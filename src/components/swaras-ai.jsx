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

    if (validConversation && validConversation.messages.length > 0) {
      return (
        <motion.div
          className={`flex flex-col h-full overflow-hidden chat-container ${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
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
        className={`h-full overflow-hidden ${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        key={`welcome-${selectedPersona}`}>
        <WelcomeScreen onQuickStart={handleQuickStart} />
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
          {/* Sidebar - Wider */}
          <motion.div
            className={`w-[340px] h-full flex-shrink-0 overflow-hidden border-r ${
              darkMode ? 'border-white/10' : 'border-slate-200'
            }`}
            initial={{ x: -340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <AppSidebar />
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
