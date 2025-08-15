// src/components/swaras-ai.jsx (Updated with Enhanced LLM Integration)
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
  const [responseMetadata, setResponseMetadata] = useState(null);
  const [debugMode, setDebugMode] = useState(
    process.env.NODE_ENV === 'development',
  );

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

  // Enhanced message sending with comprehensive analysis and error handling
  const handleSendMessage = async (messageText) => {
    // Prevent message sending if mentors are offline
    if (!mentorsOnline || mentorsLoading) {
      toast.error(
        'AI mentors are currently offline. Please wait for connection.',
        {
          duration: 4000,
          icon: '⚠️',
          style: {
            borderLeft: '4px solid #f59e0b',
          },
        },
      );
      return;
    }

    if (!messageText.trim() || !selectedPersona || isTyping) return;

    let conversation = currentConversation;

    // Ensure conversation matches selected persona
    if (conversation && conversation.personaId !== selectedPersona) {
      conversation = null;
    }

    // Create new conversation if none exists using Enhanced AI Service
    if (!conversation) {
      try {
        conversation = AIService.createConversation(selectedPersona);
        addConversation(conversation);
        setCurrentConversation(conversation);
      } catch (error) {
        console.error('Failed to create conversation:', error);
        toast.error('Failed to start conversation. Please try again.');
        return;
      }
    }

    const userMessage = AIService.createMessage(messageText, 'user', {
      timestamp: Date.now(),
      personaContext: selectedPersona,
    });

    const updatedMessages = [...conversation.messages, userMessage];
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      title:
        conversation.title === 'New Chat'
          ? messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '')
          : conversation.title,
      lastMessageAt: Date.now(),
      messageCount: updatedMessages.length,
    };

    updateConversation(conversation.id, updatedConversation);
    setIsTyping(true);

    try {
      // Show immediate feedback with persona context
      const personaName = personas[selectedPersona]?.name;
      const personaAvatar = personas[selectedPersona]?.avatar;

      toast.success(`Message sent to ${personaName}! 🚀`, {
        duration: 2000,
        icon: personaAvatar,
        style: {
          borderLeft: '4px solid #10b981',
        },
      });

      // Get enhanced AI response with full context analysis
      console.log('🤖 Requesting enhanced AI response...');
      const startTime = Date.now();

      // const aiResponse = await AIService.getPersonaResponse(
      //   messageText,
      //   selectedPersona,
      //   conversation.messages,
      // );

      console.log('🚀 Sending message to AI Service:', {
        message: messageText,
        persona: selectedPersona,
        conversationLength: conversation.messages.length,
      });

      const aiResponse = await AIService.getPersonaResponse(
        messageText,
        selectedPersona,
        conversation.messages,
      );

      console.log(
        '📦 Received AI response:',
        aiResponse.substring(0, 100) + '...',
      );

      const responseTime = Date.now() - startTime;

      // Create AI message with enhanced metadata
      const aiMessage = AIService.createMessage(aiResponse, 'ai', {
        generatedAt: Date.now(),
        responseTime: responseTime,
        responseLength: aiResponse.length,
        personaUsed: selectedPersona,
        conversationLength: conversation.messages.length,
      });

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedMessages, aiMessage],
        lastMessageAt: Date.now(),
        messageCount: updatedMessages.length + 1,
        totalResponseTime: (conversation.totalResponseTime || 0) + responseTime,
      };

      updateConversation(conversation.id, finalConversation);

      // Set metadata for debug mode
      if (debugMode) {
        setResponseMetadata({
          persona: selectedPersona,
          responseTime: responseTime,
          messageLength: aiResponse.length,
          conversationLength: finalConversation.messages.length,
        });
      }

      // Show success feedback with response time
      toast.success(
        `${personaName} responded! ${responseTime < 3000 ? '⚡' : '💬'}`,
        {
          duration: 2000,
          icon: '✨',
          style: {
            borderLeft: '4px solid #8b5cf6',
          },
        },
      );

      console.log(`✅ Response generated in ${responseTime}ms`);
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Enhanced error handling with specific error types and solutions
      let errorMessage =
        'Failed to get response from mentor. Please try again.';
      let errorIcon = '❌';
      let errorSuggestion = '';

      if (
        error.message.includes('network') ||
        error.message.includes('fetch')
      ) {
        errorMessage = 'Network connection issue detected.';
        errorIcon = '🌐';
        errorSuggestion = 'Please check your internet connection.';
      } else if (
        error.message.includes('rate limit') ||
        error.message.includes('429')
      ) {
        errorMessage = 'Too many requests sent.';
        errorIcon = '⏳';
        errorSuggestion = 'Please wait a moment before trying again.';
      } else if (
        error.message.includes('persona') ||
        error.message.includes('prompt')
      ) {
        errorMessage = 'Mentor configuration error.';
        errorIcon = '⚙️';
        errorSuggestion = 'Try selecting the mentor again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Response took too long.';
        errorIcon = '⏰';
        errorSuggestion = 'The AI is thinking hard! Please try again.';
      }

      toast.error(
        errorSuggestion ? `${errorMessage} ${errorSuggestion}` : errorMessage,
        {
          duration: 6000,
          icon: errorIcon,
          style: {
            borderLeft: '4px solid #ef4444',
          },
        },
      );

      // Remove user message on error to maintain conversation state
      updateConversation(conversation.id, {
        ...conversation,
        messages: conversation.messages,
        errorCount: (conversation.errorCount || 0) + 1,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickStart = async (question) => {
    if (!mentorsOnline || mentorsLoading) {
      toast.error('Please wait for AI mentors to come online.', {
        icon: '⏳',
        duration: 3000,
      });
      return;
    }

    // Add loading state for quick start
    toast.loading('Preparing your question...', {
      duration: 1000,
      icon: '🎯',
    });

    await handleSendMessage(question);
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
              responseMetadata={responseMetadata}
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
              secondary: darkMode ? '#1f2937' : '#ffffff',
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

      {/* Main Application Card Container with Enhanced Styling */}
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
        {/* Enhanced AI Background Animation */}
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
          </svg>

          {/* Floating AI Particles */}
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
          className='absolute top-4 right-4 flex space-x-3 z-50'
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}>
          {/* Enhanced Connection Status with Previous Animations */}
          <AnimatePresence mode='wait'>
            {mentorsLoading ? (
              <motion.div
                key='loading'
                className='flex items-center space-x-2 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-full px-3 py-2'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                title='Connecting to AI mentors...'>
                <motion.div
                  className='w-2 h-2 bg-yellow-400 rounded-full'
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className='text-xs font-medium text-yellow-600 dark:text-yellow-400'>
                  Connecting...
                </span>

                {/* Additional pulsating loading indicators */}
                <div className='flex space-x-0.5 ml-1'>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className='w-1 h-1 bg-yellow-400/60 rounded-full'
                      animate={{
                        scale: [0.5, 1, 0.5],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : mentorsOnline ? (
              <motion.div
                key='online'
                className='flex items-center space-x-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full px-3 py-2 relative overflow-hidden'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                title='AI mentors online and ready'>
                {/* Animated background glow */}
                <motion.div
                  className='absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/20 to-green-400/10'
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                <motion.div
                  className='w-2 h-2 bg-green-400 rounded-full relative z-10'
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <span className='text-xs font-medium text-green-600 dark:text-green-400 relative z-10'>
                  Enhanced AI
                </span>

                {/* Connection quality indicators with staggered animation */}
                <div className='flex space-x-0.5 ml-2 relative z-10'>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className='w-1 rounded-full bg-green-400'
                      style={{ height: `${(i + 1) * 3}px` }}
                      animate={{
                        scaleY: [1, 1.4, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key='offline'
                className='flex items-center space-x-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full px-3 py-2'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                title='AI mentors currently offline'>
                <motion.div
                  className='w-2 h-2 bg-red-400 rounded-full'
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                <span className='text-xs font-medium text-red-600 dark:text-red-400'>
                  Offline
                </span>

                {/* Subtle warning pulse */}
                <motion.div
                  className='w-3 h-3 border border-red-400/30 rounded-full ml-1'
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Performance Indicator */}
          {responseMetadata && debugMode && (
            <motion.div
              className='flex items-center space-x-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-3 py-2'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              title={`Response time: ${responseMetadata.responseTime}ms`}>
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  responseMetadata.responseTime < 2000
                    ? 'bg-green-400'
                    : responseMetadata.responseTime < 5000
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1 }}
              />
              <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                {responseMetadata.responseTime < 2000 ? 'Fast' : 'Normal'}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced App Version Badge */}
        {/* <motion.div
          className='absolute bottom-4 right-4 z-50'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}>
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
              darkMode
                ? 'bg-gray-800/60 text-gray-400 border-gray-700/40'
                : 'bg-white/60 text-gray-600 border-gray-200/40'
            }`}>
            <motion.div
              className='w-1.5 h-1.5 bg-green-400 rounded-full'
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>v0.1.0</span>
          </div>
        </motion.div> */}

        {/* Debug Panel (Development Only) */}
        {debugMode && responseMetadata && (
          <motion.div
            className='absolute bottom-4 left-4 z-50'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}>
            <div
              className={`px-3 py-2 rounded-lg text-xs backdrop-blur-sm border ${
                darkMode
                  ? 'bg-gray-800/80 text-gray-300 border-gray-700/40'
                  : 'bg-white/80 text-gray-600 border-gray-200/40'
              }`}>
              <div className='font-bold mb-1'>Debug Info:</div>
              <div>Persona: {responseMetadata.persona}</div>
              <div>Response: {responseMetadata.responseTime}ms</div>
              <div>Length: {responseMetadata.messageLength} chars</div>
              <div>Messages: {responseMetadata.conversationLength}</div>
            </div>
          </motion.div>
        )}
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
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Additional AI-themed background elements */}
        <motion.div
          className='absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-green-400/8 to-emerald-400/8 rounded-full blur-2xl'
          animate={{
            scale: [0.8, 1.4, 0.8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className='absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-orange-400/6 to-red-400/6 rounded-full blur-3xl'
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, -360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
};

export default SwarasAI;
