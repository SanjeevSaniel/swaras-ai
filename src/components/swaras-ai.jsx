// src/components/swaras-ai.jsx (Fixed version with correct imports)
'use client';

import { personas } from '@/constants/personas';
import { AIService } from '@/services/ai-service';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ChatHeader from './chat/chat-header';
import ChatInput from './chat/chat-input';
import ChatMessages from './chat/chat-messages';
import EmptyPersonaState from './empty-persona-state';
import AppSidebar from './sidebar/app-sidebar';
import WelcomeScreen from './welcome/welcome-screen';
// Import the correct persona hook
import { usePersona } from '@/contexts/usePersona';

const SwarasAI = () => {
  const [isTyping, setIsTyping] = useState(false);
  const {
    currentConversation,
    selectedPersona,
    darkMode,
    mentorsOnline,
    mentorsLoading,
    setCurrentConversation,
    updateConversation,
    addConversation,
    initializeTheme,
    initializeMentorStatus,
  } = useChatStore();

  // Persona context integration
  const { setCurrentPersona } = usePersona();

  useEffect(() => {
    initializeTheme();
    initializeMentorStatus();
  }, [initializeTheme, initializeMentorStatus]);

  // Sync persona context with chat store
  useEffect(() => {
    if (selectedPersona) {
      setCurrentPersona(selectedPersona);
    }
  }, [selectedPersona, setCurrentPersona]);

  useEffect(() => {
    if (
      currentConversation &&
      selectedPersona &&
      currentConversation.personaId !== selectedPersona
    ) {
      setCurrentConversation(null);
    }
  }, [selectedPersona, currentConversation, setCurrentConversation]);

  // Enhanced message sending with mentor status checks
  const handleSendMessage = async (messageText) => {
    // Prevent message sending if mentors are offline
    if (!mentorsOnline || mentorsLoading) {
      toast.error(
        'AI mentors are currently offline. Please wait for connection.',
      );
      return;
    }

    if (!messageText.trim() || !selectedPersona || isTyping) return;

    let conversation = currentConversation;

    // Ensure conversation matches selected persona
    if (conversation && conversation.personaId !== selectedPersona) {
      conversation = null;
    }

    // Create new conversation if none exists
    if (!conversation) {
      conversation = AIService.createConversation(selectedPersona);
      addConversation(conversation);
      setCurrentConversation(conversation);
    }

    const userMessage = AIService.createMessage(messageText, 'user');
    const updatedMessages = [...conversation.messages, userMessage];
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      title:
        conversation.title === 'New Chat'
          ? messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '')
          : conversation.title,
      lastMessageAt: Date.now(),
    };

    updateConversation(conversation.id, updatedConversation);
    setIsTyping(true);

    try {
      // Show immediate feedback
      toast.success(`Message sent to ${personas[selectedPersona]?.name}!`);

      const aiResponse = await AIService.getPersonaResponse(
        messageText,
        selectedPersona,
        conversation.messages,
      );
      const aiMessage = AIService.createMessage(aiResponse, 'ai');

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedMessages, aiMessage],
        lastMessageAt: Date.now(),
      };

      updateConversation(conversation.id, finalConversation);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast.error('Failed to get response from mentor. Please try again.');

      // Remove user message on error
      updateConversation(conversation.id, {
        ...conversation,
        messages: conversation.messages,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickStart = (question) => {
    if (!mentorsOnline || mentorsLoading) {
      toast.error('Please wait for AI mentors to come online.');
      return;
    }
    handleSendMessage(question);
  };

  // Listen for auto-send messages from WelcomeScreen
  useEffect(() => {
    const handleAutoSendMessage = (event) => {
      const question = event.detail;
      if (question && selectedPersona) {
        handleSendMessage(question);
      }
    };

    const handleStartNewConversation = () => {
      if (!selectedPersona) return;

      const conversation = AIService.createConversation(selectedPersona);
      addConversation(conversation);
      setCurrentConversation(conversation);
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
  }, [selectedPersona, mentorsOnline, addConversation, setCurrentConversation]);

  // Determine which screen to show
  const getMainContent = () => {
    if (!selectedPersona) {
      return (
        <motion.div
          className='h-full overflow-hidden'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          key='empty-persona-state'>
          <EmptyPersonaState />
        </motion.div>
      );
    }

    const validConversation =
      currentConversation && currentConversation.personaId === selectedPersona
        ? currentConversation
        : null;

    if (validConversation && validConversation.messages.length > 0) {
      return (
        <motion.div
          className='flex flex-col h-full overflow-hidden chat-container'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          key={`conversation-${validConversation.id}-${selectedPersona}`}>
          <ChatHeader selectedPersona={selectedPersona} />
          <div className='flex-1 overflow-hidden chat-messages-area'>
            <ChatMessages
              messages={validConversation.messages}
              isTyping={isTyping}
              selectedPersona={selectedPersona}
            />
          </div>
          <ChatInput
            onSendMessage={handleSendMessage}
            selectedPersona={selectedPersona}
            isTyping={isTyping}
            disabled={!mentorsOnline || mentorsLoading}
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        className='h-full overflow-hidden'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        key={`welcome-${selectedPersona}`}>
        <WelcomeScreen
          onQuickStart={handleQuickStart}
          selectedPersona={selectedPersona}
          personas={personas}
        />
      </motion.div>
    );
  };

  return (
    <div className='min-h-screen transition-colors duration-300'>
      {/* Enhanced Toast Configuration */}
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          className: 'border',
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--destructive-foreground))',
            },
          },
        }}
      />

      {/* Main Application Container */}
      <motion.div
        className='min-h-screen bg-background border-border'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
        {/* Main Application Layout */}
        <div className='flex h-screen overflow-hidden'>
          {/* Enhanced Sidebar */}
          <motion.div
            className='w-80 h-full flex-shrink-0 overflow-hidden border-r border-border'
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <AppSidebar />
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            className='flex-1 h-full overflow-hidden bg-background'
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <div className='h-full flex flex-col main-content-area'>
              <AnimatePresence mode='wait'>{getMainContent()}</AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Status Indicators */}
        <motion.div
          className='fixed top-4 right-4 flex space-x-2 z-50'
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}>
          <AnimatePresence mode='wait'>
            {mentorsLoading ? (
              <motion.div
                key='loading'
                className='w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                title='Connecting to mentors...'
              />
            ) : mentorsOnline ? (
              <motion.div
                key='online'
                className='w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                title='Mentors online and ready'
              />
            ) : (
              <motion.div
                key='offline'
                className='w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                title='Mentors currently offline'
              />
            )}
          </AnimatePresence>

          {/* Connection Quality Indicator */}
          <motion.div
            className={`flex space-x-0.5 ${
              mentorsOnline ? 'opacity-100' : 'opacity-40'
            }`}
            animate={{
              opacity: mentorsOnline ? [1, 0.6, 1] : 0.4,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-full ${
                  mentorsOnline ? 'bg-green-400' : 'bg-muted-foreground'
                }`}
                style={{ height: `${(i + 1) * 4}px` }}
                animate={{
                  scaleY: mentorsOnline ? [1, 1.5, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* App Version Badge */}
        <motion.div
          className='fixed bottom-4 right-4 z-50'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}>
          <div className='px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border/40 backdrop-blur-sm'>
            v1.0.0-beta
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SwarasAI;
