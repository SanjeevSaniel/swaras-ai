// src/components/swaras-ai.jsx
'use client';

import { personas } from '@/constants/personas-dataset';
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

  useEffect(() => {
    initializeTheme();
    initializeMentorStatus();
  }, [initializeTheme, initializeMentorStatus]);

  // Clear conversation if persona changes
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
      if (!selectedPersona || !mentorsOnline || mentorsLoading) return;

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
  }, [
    selectedPersona,
    mentorsOnline,
    mentorsLoading,
    addConversation,
    setCurrentConversation,
  ]);

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
        <WelcomeScreen onQuickStart={handleQuickStart} />
      </motion.div>
    );
  };

  return (
    <div
      className={`min-h-screen py-6 px-4 transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'
      }`}>
      {/* Enhanced Toast Configuration */}
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
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: darkMode ? '#1f2937' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: darkMode ? '#1f2937' : '#ffffff',
            },
          },
        }}
      />

      {/* Main Application Card Container */}
      <motion.div
        className={`max-w-7xl mx-auto h-[calc(100vh-3rem)] backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 relative ${
          darkMode
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50'
            : 'bg-white/80 border-white/30 shadow-gray-200/50'
        }`}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          boxShadow: darkMode
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        }}>
        {/* Northern Lights Background Animation */}
        <div className='absolute inset-0 overflow-hidden rounded-3xl'>
          {/* Aurora Borealis Effect */}
          <motion.div
            className='absolute inset-0 opacity-30'
            animate={{
              background: darkMode
                ? [
                    'linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(139, 92, 246, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(59, 130, 246, 0.1) 100%)',
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 75%, rgba(16, 185, 129, 0.1) 100%)',
                    'linear-gradient(225deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 25%, rgba(16, 185, 129, 0.1) 50%, rgba(139, 92, 246, 0.1) 75%, rgba(59, 130, 246, 0.1) 100%)',
                    'linear-gradient(315deg, rgba(236, 72, 153, 0.1) 0%, rgba(16, 185, 129, 0.1) 25%, rgba(59, 130, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 75%, rgba(139, 92, 246, 0.1) 100%)',
                  ]
                : [
                    'linear-gradient(45deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 25%, rgba(139, 92, 246, 0.05) 50%, rgba(16, 185, 129, 0.05) 75%, rgba(59, 130, 246, 0.05) 100%)',
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 25%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 75%, rgba(16, 185, 129, 0.05) 100%)',
                    'linear-gradient(225deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 25%, rgba(16, 185, 129, 0.05) 50%, rgba(139, 92, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 100%)',
                    'linear-gradient(315deg, rgba(236, 72, 153, 0.05) 0%, rgba(16, 185, 129, 0.05) 25%, rgba(59, 130, 246, 0.05) 50%, rgba(236, 72, 153, 0.05) 75%, rgba(139, 92, 246, 0.05) 100%)',
                  ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Flowing Light Waves */}
          <motion.div
            className='absolute top-0 left-0 w-full h-full opacity-20'
            style={{
              background: darkMode
                ? 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* AI Neural Network Pattern */}
          <svg
            className='absolute inset-0 w-full h-full opacity-10'
            viewBox='0 0 800 600'>
            {/* Neural Network Nodes */}
            <motion.circle
              cx='150'
              cy='100'
              r='3'
              fill={darkMode ? '#8b5cf6' : '#6366f1'}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx='300'
              cy='80'
              r='3'
              fill={darkMode ? '#10b981' : '#059669'}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx='450'
              cy='120'
              r='3'
              fill={darkMode ? '#f59e0b' : '#d97706'}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.circle
              cx='600'
              cy='90'
              r='3'
              fill={darkMode ? '#ec4899' : '#db2777'}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
            <motion.circle
              cx='200'
              cy='200'
              r='3'
              fill={darkMode ? '#06b6d4' : '#0891b2'}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            />
            <motion.circle
              cx='400'
              cy='220'
              r='3'
              fill={darkMode ? '#8b5cf6' : '#6366f1'}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2.5 }}
            />

            {/* Neural Network Connections */}
            <motion.line
              x1='150'
              y1='100'
              x2='300'
              y2='80'
              stroke={darkMode ? '#8b5cf6' : '#6366f1'}
              strokeWidth='1'
              animate={{
                strokeOpacity: [0.1, 0.5, 0.1],
                pathLength: [0, 1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0 }}
            />
            <motion.line
              x1='300'
              y1='80'
              x2='450'
              y2='120'
              stroke={darkMode ? '#10b981' : '#059669'}
              strokeWidth='1'
              animate={{
                strokeOpacity: [0.1, 0.5, 0.1],
                pathLength: [0, 1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
            <motion.line
              x1='450'
              y1='120'
              x2='600'
              y2='90'
              stroke={darkMode ? '#f59e0b' : '#d97706'}
              strokeWidth='1'
              animate={{
                strokeOpacity: [0.1, 0.5, 0.1],
                pathLength: [0, 1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            <motion.line
              x1='150'
              y1='100'
              x2='200'
              y2='200'
              stroke={darkMode ? '#ec4899' : '#db2777'}
              strokeWidth='1'
              animate={{
                strokeOpacity: [0.1, 0.5, 0.1],
                pathLength: [0, 1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            />
            <motion.line
              x1='300'
              y1='80'
              x2='400'
              y2='220'
              stroke={darkMode ? '#06b6d4' : '#0891b2'}
              strokeWidth='1'
              animate={{
                strokeOpacity: [0.1, 0.5, 0.1],
                pathLength: [0, 1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            />

            {/* Geometric AI Symbols */}
            <motion.polygon
              points='100,300 120,280 140,300 120,320'
              fill='none'
              stroke={darkMode ? '#8b5cf6' : '#6366f1'}
              strokeWidth='2'
              animate={{
                rotate: [0, 360],
                strokeOpacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                strokeOpacity: { duration: 4, repeat: Infinity },
              }}
            />
            <motion.rect
              x='500'
              y='350'
              width='30'
              height='30'
              fill='none'
              stroke={darkMode ? '#10b981' : '#059669'}
              strokeWidth='2'
              animate={{
                rotate: [0, -360],
                strokeOpacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
                strokeOpacity: { duration: 5, repeat: Infinity },
              }}
            />
            <motion.circle
              cx='250'
              cy='450'
              r='20'
              fill='none'
              stroke={darkMode ? '#f59e0b' : '#d97706'}
              strokeWidth='2'
              animate={{
                scale: [1, 1.2, 1],
                strokeOpacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </svg>

          {/* Data Flow Animation */}
          <motion.div
            className='absolute inset-0'
            style={{
              background: darkMode
                ? 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                darkMode ? 'bg-purple-400/30' : 'bg-purple-500/20'
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + Math.sin(i) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.cos(i) * 20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Binary Code Rain Effect */}
          <motion.div
            className='absolute top-0 right-10 text-xs font-mono opacity-5 select-none'
            animate={{ y: ['-100%', '100vh'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <div
              className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              01001001
              <br />
              11010101
              <br />
              00110110
              <br />
              10101010
              <br />
              01110001
              <br />
              11000011
              <br />
              00101101
              <br />
              10011100
            </div>
          </motion.div>
        </div>

        {/* Main Application Layout */}
        <div className='flex h-full overflow-hidden relative z-10'>
          {/* Enhanced Sidebar */}
          <motion.div
            className='w-[30%] h-full flex-shrink-0 overflow-hidden'
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <AppSidebar />
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            className='flex-1 h-full overflow-hidden'
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}>
            <div
              className={`h-full flex flex-col main-content-area ${
                darkMode ? 'bg-gray-900/20' : 'bg-white/20'
              } backdrop-blur-sm`}>
              <AnimatePresence mode='wait'>{getMainContent()}</AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Status Indicators */}
        <motion.div
          className='absolute top-4 right-4 flex space-x-2 z-50'
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
                  mentorsOnline ? 'bg-green-400' : 'bg-gray-400'
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
          className='absolute bottom-4 right-4 z-50'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
              darkMode
                ? 'bg-gray-800/60 text-gray-400 border-gray-700/40'
                : 'bg-white/60 text-gray-600 border-gray-200/40'
            }`}>
            v1.0.0-beta
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Background Elements */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
        <motion.div
          className='absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className='absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl'
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -40, 0, 40, 0],
            y: [0, 40, 0, -40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
};

export default SwarasAI;
