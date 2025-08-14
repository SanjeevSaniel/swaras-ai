// src/components/swaras-ai-refactored.jsx
'use client';

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
    initializeMentorStatus(); // Initialize mentor status on app load
  }, [initializeTheme, initializeMentorStatus]);

  useEffect(() => {
    if (
      currentConversation &&
      selectedPersona &&
      currentConversation.personaId !== selectedPersona
    ) {
      setCurrentConversation(null);
    }
  }, [selectedPersona, currentConversation, setCurrentConversation]);

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

    if (conversation && conversation.personaId !== selectedPersona) {
      conversation = null;
    }

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
    };

    updateConversation(conversation.id, updatedConversation);
    setIsTyping(true);

    try {
      const aiResponse = await AIService.getPersonaResponse(
        messageText,
        selectedPersona,
        conversation.messages,
      );
      const aiMessage = AIService.createMessage(aiResponse, 'ai');

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedMessages, aiMessage],
      };

      updateConversation(conversation.id, finalConversation);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
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

  const validConversation =
    currentConversation && currentConversation.personaId === selectedPersona
      ? currentConversation
      : null;

  return (
    <div
      className={`min-h-screen py-6 px-4 transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'
      }`}>
      <Toaster
        position='top-right'
        toastOptions={{
          className: darkMode ? 'bg-gray-800 text-gray-100' : '',
        }}
      />

      {/* Main Card Container */}
      <motion.div
        className={`max-w-7xl mx-auto h-[calc(100vh-3rem)] backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 ${
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
        {/* Main Content Area */}
        <div className='flex h-full overflow-hidden'>
          {/* Sidebar Card */}
          <motion.div
            className='w-[30%] h-full flex-shrink-0 overflow-hidden'
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <AppSidebar />
          </motion.div>

          {/* Main Chat Card */}
          <motion.div
            className='flex-1 h-full overflow-hidden'
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}>
            <div
              className={`h-full flex flex-col main-content-area ${
                darkMode ? 'bg-gray-900/20' : 'bg-white/20'
              } backdrop-blur-sm`}>
              <AnimatePresence mode='wait'>
                {!selectedPersona ? (
                  <motion.div
                    className='h-full overflow-hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    key='empty-persona-state'>
                    <EmptyPersonaState />
                  </motion.div>
                ) : validConversation ? (
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
                ) : (
                  <motion.div
                    className='h-full overflow-hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    key={`welcome-${selectedPersona}`}>
                    <WelcomeScreen onQuickStart={handleQuickStart} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Status-based Floating Indicators */}
        <motion.div
          className='absolute top-4 right-4 flex space-x-2 z-50'
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}>
          <AnimatePresence mode='wait'>
            {mentorsLoading ? (
              <motion.div
                key='loading'
                className='w-3 h-3 bg-yellow-400 rounded-full animate-pulse'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            ) : mentorsOnline ? (
              <motion.div
                key='online'
                className='w-3 h-3 bg-green-400 rounded-full animate-pulse'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            ) : (
              <motion.div
                key='offline'
                className='w-3 h-3 bg-red-400 rounded-full animate-pulse'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Floating Background Elements */}
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
      </div>
    </div>
  );
};

export default SwarasAI;
