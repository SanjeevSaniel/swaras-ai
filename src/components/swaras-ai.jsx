// src/components/swaras-ai.jsx
'use client';

import { personas } from '@/constants/personas-dataset';
import { AIService } from '@/services/ai-service';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useChat } from '@ai-sdk/react';
import ChatHeader from './chat/chat-header';
import ChatInput from './chat/chat-input';
import ChatMessages from './chat/chat-messages';
import EmptyPersonaState from './empty-persona-state';
import AppSidebar from './sidebar/app-sidebar';
import WelcomeScreen from './welcome/welcome-screen';

const SwarasAI = () => {
  const [responseMetadata, setResponseMetadata] = useState(null);
  const [debugMode, setDebugMode] = useState(
    process.env.NODE_ENV === 'development',
  );

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
  const conversations = getConversations ? getConversations() : Object.values(personaConversations || {});

  // Initialize AI SDK's useChat hook
  const chatApi = useChat({
    api: '/api/chat-ai',
    body: {
      persona: selectedPersona,
    },
    onResponse: (response) => {
      console.log('✅ AI response started streaming', response);
    },
    onFinish: (message) => {
      console.log('✅ AI response completed:', message);
      console.log('📊 Current messages count:', chatApi.messages.length);
      // Update conversation with the new message
      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: chatApi.messages,
          lastMessageAt: Date.now(),
          messageCount: chatApi.messages.length,
        };
        updateConversation(currentConversation.id, updatedConversation);
        console.log('💾 Conversation updated in store');
      }
    },
    onError: (error) => {
      console.error('❌ Streaming error:', error);
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

  console.log('🎯 useChat values:', {
    input,
    hasHandleInputChange: !!handleInputChange,
    hasHandleSubmit: !!originalHandleSubmit,
    messagesCount: messages.length,
    isTyping,
  });

  // Custom message sending with manual streaming
  const handleSendMessage = async (messageText) => {
    console.log('🔄 handleSendMessage called with:', messageText);

    // Prevent message sending if mentors are offline
    if (!mentorsOnline || mentorsLoading) {
      console.log('⚠️ Mentors offline or loading');
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
      console.log('⚠️ Invalid input or state:', { messageText, selectedPersona, isTyping });
      return;
    }

    // Ensure conversation exists before sending
    const conversation = ensureConversation();
    if (!conversation) {
      console.log('❌ Failed to create/get conversation');
      return;
    }

    console.log('✅ Conversation ready:', conversation.id);

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

      console.log('📥 Starting stream read...');
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('✅ Stream complete');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('📦 Received chunk:', { length: chunk.length, preview: chunk.substring(0, 100) });

        // toTextStreamResponse() returns plain text chunks, not formatted lines
        // Just accumulate the text directly
        assistantContent += chunk;
        console.log('💬 Current content length:', assistantContent.length, 'Preview:', assistantContent.substring(0, 50));

        // Hide thinking indicator as soon as first chunk arrives
        if (isFirstChunk && assistantContent.length > 0) {
          console.log('🎯 First chunk received - hiding thinking indicator');
          setIsTyping(false);
          isFirstChunk = false;
        }

        // Update with streaming content - use functional update to avoid stale closure
        setMessages((prevMessages) => {
          // Remove any existing assistant message with this ID and add updated one
          const withoutCurrent = prevMessages.filter(m => m.id !== assistantId);
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

      console.log('✅ Final content length:', assistantContent.length);

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
      console.error('❌ Error:', error);
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
        role: msg.role === 'ai' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));
      setMessages(aiSdkMessages);
      console.log('📋 Synced messages to AI SDK:', aiSdkMessages.length);
    } else {
      setMessages([]);
      console.log('📋 Cleared messages (no conversation)');
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
          hitesh: `Namaste! 🙏 I'm Hitesh from Chai aur Code. Let's make coding simple and fun together! What would you like to learn today?`,
          piyush: `Hey! 👋 I'm Piyush. Ready to build some real production-grade apps? Let's get started!`
        };

        const greetingMessage = {
          id: `greeting-${Date.now()}`,
          role: 'assistant',
          content: greetings[selectedPersona] || `Hi! I'm ${persona?.name}. How can I help you today?`,
          createdAt: new Date(),
          timestamp: Date.now(),
        };

        conversation.messages = [greetingMessage];
        conversation.messageCount = 1;
        conversation.lastMessageAt = Date.now();

        addConversation(conversation);
        setCurrentConversation(conversation);
        setMessages([{ ...greetingMessage, role: 'assistant' }]);

        toast.success(`Connected with ${persona?.name}! 🎉`, { duration: 2000 });
      } catch (error) {
        console.error('Failed to create conversation:', error);
      }
    }
  }, [selectedPersona, mentorsOnline, mentorsLoading, personaConversations, addConversation, setCurrentConversation, setMessages]);

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
        console.error('Failed to create conversation:', error);
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
        console.error('Failed to create conversation:', error);
        toast.error('Failed to start conversation. Please try again.');
        return;
      }
    }

    // Just fill the input - don't send the message
    // The event will be dispatched to the input component
    window.dispatchEvent(new CustomEvent('setInputValue', { detail: question }));
  };

  // Enhanced auto-send with better error handling and user feedback
  useEffect(() => {
    const handleAutoSendMessage = async (event) => {
      const question = event.detail;
      if (question && selectedPersona && mentorsOnline && !mentorsLoading) {
        try {
          await handleSendMessage(question);
        } catch (error) {
          console.error('Auto-send failed:', error);
          toast.error('Failed to send auto-generated message', {
            icon: '🤖',
          });
        }
      } else {
        console.warn('Auto-send conditions not met:', {
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
        console.error('Failed to start conversation:', error);
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
          className={`h-full overflow-hidden ${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'}`}
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

      console.log('🎨 Rendering chat view:', {
        selectedPersona,
        messagesCount: displayMessages.length,
        hasMessages,
        isTyping,
      });

      return (
        <motion.div
          className={`relative flex flex-col h-full overflow-hidden chat-container ${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          key={`conversation-${validConversation?.id || 'new'}-${selectedPersona}`}>
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
        className={`h-full overflow-hidden ${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'}`}
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

        {/* Main Application Layout */}
        <div className='flex h-full overflow-hidden relative z-10'>
          {/* Sidebar - Modern */}
          <motion.div
            className='flex-shrink-0 overflow-hidden'
            initial={{ x: -340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <AppSidebar
              conversations={conversations}
              currentConversation={currentConversation}
              onSelectConversation={setCurrentConversation}
              onNewConversation={() => {
                if (!selectedPersona || !mentorsOnline || mentorsLoading) {
                  toast.error('Please select a mentor first', { icon: '⚠️' });
                  return;
                }
                const conversation = AIService.createConversation(selectedPersona);
                addConversation(conversation);
                setCurrentConversation(conversation);
                toast.success('Chat started successfully!', { icon: '✨' });
              }}
              onDeleteConversation={deleteConversation}
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
            />
          </motion.div>

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

        {/* Status Indicators - Minimal and static */}
        {currentConversation &&
          currentConversation.messages &&
          currentConversation.messages.length > 0 && (
            <div className='absolute top-4 right-4 flex space-x-2 z-50'>
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
