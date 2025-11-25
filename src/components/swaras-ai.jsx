// src/components/swaras-ai.jsx
'use client';

import { personas } from '@/constants/personas';
import { AIService } from '@/services/ai-service';
import { useChatStore } from '@/store/chat-store';
import { logger } from '@/utils/logger';
import { useChat } from '@ai-sdk/react';
import { useClerk, useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ChatHeader from './chat/chat-header';
import ChatInput from './chat/chat-input';
import ChatMessages from './chat/chat-messages';
import EmptyPersonaState from './empty-persona-state';
import AppSidebar from './sidebar/app-sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent } from './ui/sheet';
import WelcomeScreen from './welcome/welcome-screen';

const SwarasAI = () => {
  const [responseMetadata, setResponseMetadata] = useState(null);
  const [debugMode, setDebugMode] = useState(
    process.env.NODE_ENV === 'development',
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Clerk authentication hooks
  const { user } = useUser();
  const { signOut } = useClerk();

  const {
    personaConversations,
    currentConversation,
    selectedPersona,
    darkMode,
    mentorsOnline,
    mentorsLoading,
    setCurrentConversation,
    setSelectedPersona,
    updateConversation,
    addConversation,
    deleteConversation,
    initializeTheme,
    initializeMentorStatus,
    getConversations,
  } = useChatStore();

  // Get conversations as array for sidebar
  const conversations = getConversations
    ? getConversations()
    : Object.values(personaConversations || {});

  // Initialize AI SDK's useChat hook
  const chatApi = useChat({
    api: '/api/chat-ai',
    body: {
      persona: selectedPersona,
    },
    onResponse: (response) => {
      logger.log('✅ AI response started streaming', response);
    },
    onFinish: (message) => {
      logger.log('✅ AI response completed:', message);
      logger.log('📊 Current messages count:', chatApi.messages.length);
      // Update conversation with the new message
      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: chatApi.messages,
          lastMessageAt: Date.now(),
          messageCount: chatApi.messages.length,
        };
        updateConversation(currentConversation.id, updatedConversation);
        logger.log('💾 Conversation updated in store');
      }
    },
    onError: (error) => {
      logger.error('❌ Streaming error:', error);
      toast.error('Failed to get response from mentor', {
        icon: '❌',
        duration: 4000,
      });
    },
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    setMessages,
  } = chatApi;

  // Add custom typing state for manual streaming
  const [isTyping, setIsTyping] = useState(false);

  logger.log('🎯 useChat values:', {
    input,
    hasHandleInputChange: !!handleInputChange,
    hasHandleSubmit: !!originalHandleSubmit,
    messagesCount: messages.length,
    isTyping,
  });

  // Custom message sending with manual streaming
  const handleSendMessage = async (messageText) => {
    logger.log('🔄 handleSendMessage called with:', messageText);

    // Prevent message sending if mentors are offline
    if (!mentorsOnline || mentorsLoading) {
      logger.log('⚠️ Mentors offline or loading');
      toast.error(
        'AI mentors are currently offline. Please wait for connection.',
        {
          duration: 4000,
          icon: '⚠️',
        },
      );
      return;
    }

    if (!messageText || !messageText.trim() || !selectedPersona || isTyping) {
      logger.log('⚠️ Invalid input or state:', {
        messageText,
        selectedPersona,
        isTyping,
      });
      return;
    }

    // Ensure conversation exists before sending
    const conversation = ensureConversation();
    if (!conversation) {
      logger.log('❌ Failed to create/get conversation');
      return;
    }

    logger.log('✅ Conversation ready:', conversation.id);

    const personaName = personas[selectedPersona]?.name;

    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      createdAt: new Date(),
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Start typing indicator
    setIsTyping(true);

    try {
      // Call streaming API
      const response = await fetch('/api/chat-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          persona: selectedPersona,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Read streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = `assistant-${Date.now()}`;

      logger.log('📥 Starting stream read...');
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          logger.log('✅ Stream complete');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        logger.log('📦 Received chunk:', {
          length: chunk.length,
          preview: chunk.substring(0, 100),
        });

        // toTextStreamResponse() returns plain text chunks, not formatted lines
        // Just accumulate the text directly
        assistantContent += chunk;
        logger.log(
          '💬 Current content length:',
          assistantContent.length,
          'Preview:',
          assistantContent.substring(0, 50),
        );

        // Hide thinking indicator as soon as first chunk arrives
        if (isFirstChunk && assistantContent.length > 0) {
          logger.log('🎯 First chunk received - hiding thinking indicator');
          setIsTyping(false);
          isFirstChunk = false;
        }

        // Update with streaming content - use functional update to avoid stale closure
        setMessages((prevMessages) => {
          // Remove any existing assistant message with this ID and add updated one
          const withoutCurrent = prevMessages.filter(
            (m) => m.id !== assistantId,
          );
          return [
            ...withoutCurrent,
            {
              id: assistantId,
              role: 'assistant',
              content: assistantContent,
              createdAt: new Date(),
              timestamp: Date.now(),
            },
          ];
        });
      }

      logger.log('✅ Final content length:', assistantContent.length);

      // Ensure typing indicator is off (should already be off from first chunk)
      setIsTyping(false);

      // Final message state is already set by the last streaming update
      // Just need to update conversation store
      if (currentConversation) {
        setMessages((prevMessages) => {
          updateConversation(currentConversation.id, {
            ...currentConversation,
            messages: prevMessages,
            lastMessageAt: Date.now(),
            messageCount: prevMessages.length,
          });
          return prevMessages;
        });
      }

      toast.success(`${personaName} replied! ✨`, {
        duration: 1500,
        icon: personas[selectedPersona]?.avatar,
      });
    } catch (error) {
      logger.error('❌ Error:', error);
      setIsTyping(false);
      toast.error('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    initializeTheme();
    initializeMentorStatus();
  }, [initializeTheme, initializeMentorStatus]);

  // Sync messages from current conversation to useChat
  useEffect(() => {
    if (currentConversation && currentConversation.messages) {
      // Convert conversation messages to AI SDK format
      const aiSdkMessages = currentConversation.messages.map((msg) => ({
        id: msg.id || `${msg.timestamp}`,
        role:
          msg.role === 'ai' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));
      setMessages(aiSdkMessages);
      logger.log('📋 Synced messages to AI SDK:', aiSdkMessages.length);
    } else {
      setMessages([]);
      logger.log('📋 Cleared messages (no conversation)');
    }
  }, [currentConversation?.id, setMessages]);

  // Clear conversation if persona changes
  useEffect(() => {
    if (
      currentConversation &&
      selectedPersona &&
      currentConversation.personaId !== selectedPersona
    ) {
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [selectedPersona, currentConversation, setCurrentConversation]);

  // Send greeting when persona is first selected
  useEffect(() => {
    if (!selectedPersona || !mentorsOnline || mentorsLoading) return;

    // Check if there's already a conversation for this persona
    const existingConversation = personaConversations[selectedPersona];

    if (!existingConversation) {
      // Create new conversation with greeting
      try {
        const conversation = AIService.createConversation(selectedPersona);
        const persona = personas[selectedPersona];

        // Create greeting message from persona
        const greetings = {
          hitesh: `Haanji! Namaste! ☕ I'm Hitesh from Chai aur Code. Chaliye, let's make coding simple and fun together, bhai! Chai ready hai? What would you like to learn today?`,
          piyush: `Look, I'm Piyush Garg. Trust me, I'm a software engineer who's built 50+ production apps. Ready to learn how things actually work in the real world? Let's ship something today.`,
          foodpharmer: `Hey! I'm FoodPharmer - Revant Himatsingka. Let me show you the truth behind food labels and marketing BS. Science over marketing, always. What food myth should we bust today?`,
          johnnyharris: `Hey there! I'm Johnny Harris. Let's explore the stories shaping our world - the geopolitics, the history, the context that makes everything make sense. What fascinates you?`,
          lla: `Hello! I'm your Labour Law Advisor. I'm here to help you understand your workplace rights under Indian labor law. Document everything, know your rights. How can I assist you today?`,
          zero1: `Namaste! Welcome to Zero1 by Zerodha. 📊 Markets mein aane se pehle, seekh lo - that's our motto. Let's simplify investing and trading for you. Remember: DYOR! What would you like to learn?`,
          aliabdaal: `Hey! I'm Ali Abdaal. Let's talk about feel-good productivity and evidence-based strategies for learning and life. Here's what the research shows - we can make productivity enjoyable! What would you like to work on?`,
          kunalshah: `Hey! I'm Kunal Shah. Let's think from first principles about business, startups, and consumer behavior. What's the Delta 4 you're trying to create? What inefficiency are you solving?`,
          markmanson: `Hey. I'm Mark Manson. Let's cut through the self-help BS and talk about what actually matters in life. Life is problems - let's pick good ones. What's on your mind?`,
          ankurwarikoo: `Hey friends! I'm Ankur Warikoo. Let's talk about money, career, and life lessons I learned the hard way so you don't have to. Start before you're ready! What do you want to discuss?`,
          flyingbeast: `Jai Hind doston! ✈️ I'm Gaurav Taneja - Flying Beast! Discipline is everything, bhai. Whether it's fitness, aviation, or life - consistency beats intensity every single time. Kya baat karni hai aaj?`,
        };

        const greetingMessage = {
          id: `greeting-${Date.now()}`,
          role: 'assistant',
          content:
            greetings[selectedPersona] ||
            `Hi! I'm ${persona?.name}. How can I help you today?`,
          createdAt: new Date(),
          timestamp: Date.now(),
        };

        conversation.messages = [greetingMessage];
        conversation.messageCount = 1;
        conversation.lastMessageAt = Date.now();

        addConversation(conversation);
        setCurrentConversation(conversation);
        setMessages([{ ...greetingMessage, role: 'assistant' }]);

        toast.success(`Connected with ${persona?.name}! 🎉`, {
          duration: 2000,
        });
      } catch (error) {
        logger.error('Failed to create conversation:', error);
      }
    }
  }, [
    selectedPersona,
    mentorsOnline,
    mentorsLoading,
    personaConversations,
    addConversation,
    setCurrentConversation,
    setMessages,
  ]);

  // Create conversation before first message if needed
  const ensureConversation = () => {
    if (!selectedPersona || !mentorsOnline || mentorsLoading) return null;

    let conversation = currentConversation;

    // Ensure conversation matches selected persona
    if (conversation && conversation.personaId !== selectedPersona) {
      conversation = null;
    }

    // Create new conversation if none exists
    if (!conversation) {
      try {
        conversation = AIService.createConversation(selectedPersona);

        // Add initial greeting message
        const greetingMessage = AIService.createMessage(
          AIService.getPersonaGreeting(selectedPersona),
          'assistant',
          { isGreeting: true },
        );

        conversation.messages = [greetingMessage];
        conversation.messageCount = 1;
        conversation.lastMessageAt = Date.now();

        addConversation(conversation);
        setCurrentConversation(conversation);
      } catch (error) {
        logger.error('Failed to create conversation:', error);
        toast.error('Failed to start conversation. Please try again.');
        return null;
      }
    }

    return conversation;
  };

  const handleQuickStart = async (question) => {
    if (!mentorsOnline || mentorsLoading) {
      toast.error('Please wait for AI mentors to come online.', {
        icon: '⏳',
        duration: 3000,
      });
      return;
    }

    // Create a new conversation if none exists
    let conversation = currentConversation;

    // Ensure conversation matches selected persona
    if (conversation && conversation.personaId !== selectedPersona) {
      conversation = null;
    }

    // Create new conversation if none exists
    if (!conversation) {
      try {
        conversation = AIService.createConversation(selectedPersona);

        // Add initial greeting message from the mentor
        const greetingMessage = AIService.createMessage(
          AIService.getPersonaGreeting(selectedPersona),
          'assistant',
          { isGreeting: true },
        );

        // Update conversation with greeting
        const conversationWithGreeting = {
          ...conversation,
          messages: [greetingMessage],
          messageCount: 1,
          lastMessageAt: Date.now(),
        };

        addConversation(conversationWithGreeting);
        setCurrentConversation(conversationWithGreeting);
      } catch (error) {
        logger.error('Failed to create conversation:', error);
        toast.error('Failed to start conversation. Please try again.');
        return;
      }
    }

    // Just fill the input - don't send the message
    // The event will be dispatched to the input component
    window.dispatchEvent(
      new CustomEvent('setInputValue', { detail: question }),
    );
  };

  // Enhanced auto-send with better error handling and user feedback
  useEffect(() => {
    const handleAutoSendMessage = async (event) => {
      const question = event.detail;
      if (question && selectedPersona && mentorsOnline && !mentorsLoading) {
        try {
          await handleSendMessage(question);
        } catch (error) {
          logger.error('Auto-send failed:', error);
          toast.error('Failed to send auto-generated message', {
            icon: '🤖',
          });
        }
      } else {
        logger.warn('Auto-send conditions not met:', {
          hasQuestion: !!question,
          hasPersona: !!selectedPersona,
          mentorsOnline,
          mentorsLoading,
        });
      }
    };

    const handleStartNewConversation = () => {
      if (!selectedPersona || !mentorsOnline || mentorsLoading) {
        toast.error('Cannot start conversation - mentors not available', {
          icon: '⚠️',
        });
        return;
      }

      try {
        const conversation = AIService.createConversation(selectedPersona);
        addConversation(conversation);
        setCurrentConversation(conversation);

        const personaName = personas[selectedPersona]?.name;
        const personaAvatar = personas[selectedPersona]?.avatar;

        toast.success(`New conversation started with ${personaName}! 🎉`, {
          icon: personaAvatar,
          duration: 3000,
        });
      } catch (error) {
        logger.error('Failed to start conversation:', error);
        toast.error('Failed to start new conversation');
      }
    };

    window.addEventListener('autoSendMessage', handleAutoSendMessage);
    window.addEventListener('startNewConversation', handleStartNewConversation);

    return () => {
      window.removeEventListener('autoSendMessage', handleAutoSendMessage);
      window.removeEventListener(
        'startNewConversation',
        handleStartNewConversation,
      );
    };
  }, [
    selectedPersona,
    mentorsOnline,
    mentorsLoading,
    addConversation,
    setCurrentConversation,
  ]);

  // Enhanced content determination with better state management
  const getMainContent = () => {
    if (!selectedPersona) {
      return (
        <motion.div
          className={`h-full overflow-hidden ${
            darkMode ? 'bg-[#0a0f1e]' : 'bg-white'
          }`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          key='empty-persona-state'>
          <EmptyPersonaState />
        </motion.div>
      );
    }

    const validConversation =
      currentConversation && currentConversation.personaId === selectedPersona
        ? currentConversation
        : null;

    // Always show chat interface when persona is selected
    if (selectedPersona) {
      // Use AI SDK messages directly - they are the source of truth
      const displayMessages = messages || [];
      const hasMessages = displayMessages.length > 0;

      logger.log('🎨 Rendering chat view:', {
        selectedPersona,
        messagesCount: displayMessages.length,
        hasMessages,
        isTyping,
      });

      return (
        <motion.div
          className={`relative flex flex-col h-full overflow-hidden chat-container ${
            darkMode ? 'bg-[#0a0f1e]' : 'bg-white'
          }`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          key={`conversation-${
            validConversation?.id || 'new'
          }-${selectedPersona}`}>
          <ChatHeader selectedPersona={selectedPersona} />
          <div className='flex-1 overflow-hidden chat-messages-area pb-32'>
            {hasMessages ? (
              <ChatMessages
                messages={displayMessages}
                isTyping={isTyping}
                selectedPersona={selectedPersona}
              />
            ) : (
              <WelcomeScreen onQuickStart={handleQuickStart} />
            )}
          </div>
          <ChatInput
            onSendMessage={handleSendMessage}
            selectedPersona={selectedPersona}
            disabled={!mentorsOnline || mentorsLoading || isTyping}
            isLoading={isTyping}
          />
        </motion.div>
      );
    }

    // No persona selected - show empty state
    return (
      <motion.div
        className={`h-full overflow-hidden ${
          darkMode ? 'bg-[#0a0f1e]' : 'bg-white'
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        key='no-persona'>
        <EmptyPersonaState />
      </motion.div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
      }`}>
      {/* Enhanced Toast Configuration with Better Styling */}
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          className: darkMode
            ? 'bg-gray-800 text-gray-100 border border-gray-700'
            : 'bg-white text-gray-900 border border-gray-200',
          duration: 4000,
          style: {
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#f9fafb' : '#111827',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: darkMode
              ? '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: darkMode ? '#0f172a' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: darkMode ? '#1f2937' : '#ffffff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: darkMode ? '#1f2937' : '#ffffff',
            },
          },
        }}
      />

      {/* Full-Screen Application Container */}
      <motion.div
        className={`w-full h-screen border-0 overflow-hidden transition-all duration-300 relative ${
          darkMode
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
            : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}>
        {/* Mobile Top Bar - Hamburger Menu & Profile */}
        <div className='fixed top-4 left-4 right-4 z-50 lg:hidden flex items-center justify-between'>
          {/* Hamburger Menu Button */}
          <motion.button
            onClick={() => setIsMobileSidebarOpen(true)}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              darkMode
                ? 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
                : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
            } shadow-lg`}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <Menu className='w-5 h-5' />
          </motion.button>

          {/* Mobile Profile Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
                      : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                  } shadow-lg`}>
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.firstName || 'User'}
                      className='w-5 h-5 rounded-full object-cover'
                    />
                  ) : (
                    <User className='w-5 h-5' />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {user?.firstName || user?.username || 'User'}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className='text-red-600 dark:text-red-400 cursor-pointer'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>

        {/* Main Application Layout */}
        <div className='flex h-full overflow-hidden relative z-10'>
          {/* Sidebar - Desktop Always Visible */}
          <div className='hidden lg:block flex-shrink-0 overflow-hidden'>
            <AppSidebar
              conversations={conversations}
              currentConversation={currentConversation}
              onSelectConversation={setCurrentConversation}
              onNewConversation={() => {
                if (!selectedPersona || !mentorsOnline || mentorsLoading) {
                  toast.error('Please select a mentor first', { icon: '⚠️' });
                  return;
                }
                const conversation =
                  AIService.createConversation(selectedPersona);
                addConversation(conversation);
                setCurrentConversation(conversation);
                toast.success('Chat started successfully!', { icon: '✨' });
              }}
              onDeleteConversation={deleteConversation}
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
            />
          </div>

          {/* Sidebar - Mobile Sheet (Only When Open) */}
          <Sheet
            open={isMobileSidebarOpen}
            onOpenChange={setIsMobileSidebarOpen}>
            <SheetContent
              side='left'
              className='p-0 w-full sm:w-80 lg:hidden'>
              <AppSidebar
                conversations={conversations}
                currentConversation={currentConversation}
                onSelectConversation={(conv) => {
                  setCurrentConversation(conv);
                  setIsMobileSidebarOpen(false);
                }}
                onNewConversation={() => {
                  if (!selectedPersona || !mentorsOnline || mentorsLoading) {
                    toast.error('Please select a mentor first', { icon: '⚠️' });
                    return;
                  }
                  const conversation =
                    AIService.createConversation(selectedPersona);
                  addConversation(conversation);
                  setCurrentConversation(conversation);
                  toast.success('Chat started successfully!', { icon: '✨' });
                  setIsMobileSidebarOpen(false);
                }}
                onDeleteConversation={deleteConversation}
                selectedPersona={selectedPersona}
                onSelectPersona={(personaId) => {
                  setSelectedPersona(personaId);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>

          {/* Main Content Area */}
          <motion.div
            className='flex-1 h-full overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <div className='h-full flex flex-col main-content-area'>
              <AnimatePresence mode='wait'>{getMainContent()}</AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Status Indicators - Minimal and static - Hidden on mobile to avoid overlap */}
        {currentConversation &&
          currentConversation.messages &&
          currentConversation.messages.length > 0 && (
            <div className='absolute top-4 right-4 flex space-x-2 z-50 hidden lg:flex'>
              {mentorsLoading ? (
                <div
                  className={`flex items-center space-x-2 border rounded-lg px-3 py-1.5 ${
                    darkMode
                      ? 'bg-[#1a1a1a] border-[#2a2a2a] text-yellow-400'
                      : 'bg-white border-[#e5e7eb] text-yellow-600'
                  }`}
                  title='Connecting to AI mentors...'>
                  <div className='w-2 h-2 bg-yellow-400 rounded-full' />
                  <span className='text-xs font-medium'>Connecting...</span>
                </div>
              ) : mentorsOnline ? (
                <div
                  className={`flex items-center space-x-2 border rounded-lg px-3 py-1.5 ${
                    darkMode
                      ? 'bg-[#1a1a1a] border-[#2a2a2a] text-green-400'
                      : 'bg-white border-[#e5e7eb] text-green-600'
                  }`}
                  title='AI mentors online and ready'>
                  <div className='w-2 h-2 bg-green-500 rounded-full' />
                  <span className='text-xs font-medium'>Online</span>
                </div>
              ) : (
                <div
                  className={`flex items-center space-x-2 border rounded-lg px-3 py-1.5 ${
                    darkMode
                      ? 'bg-[#1a1a1a] border-[#2a2a2a] text-red-400'
                      : 'bg-white border-[#e5e7eb] text-red-600'
                  }`}
                  title='AI mentors currently offline'>
                  <div className='w-2 h-2 bg-red-500 rounded-full' />
                  <span className='text-xs font-medium'>Offline</span>
                </div>
              )}
            </div>
          )}
      </motion.div>
    </div>
  );
};

export default SwarasAI;
