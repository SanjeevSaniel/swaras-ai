'use client';

import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AiChatContainer from './chat/ai-chat-container';
import SwarasSidebar from './sidebar/swaras-sidebar';

const SwarasAI = () => {
  const {
    selectedPersona,
    setSelectedPersona,
    initializeTheme,
    initializeMentorStatus,
  } = useChatStore();

  useEffect(() => {
    initializeTheme();
    initializeMentorStatus();
  }, [initializeTheme, initializeMentorStatus]);


  return (
    <div className='min-h-screen nixtio-bg-gradient'>
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: 'bg-white text-gray-900 border border-gray-200',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#111827',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />

      <div className='w-full h-screen flex overflow-hidden'>
        {/* Left Sidebar with Swaras AI Branding and Chats */}
        <motion.div
          className='flex-shrink-0'
          initial={{ x: -340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SwarasSidebar
            selectedPersona={selectedPersona}
            onSelectPersona={setSelectedPersona}
          />
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          className='flex-1 overflow-hidden'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className='h-full flex flex-col'>
            <AnimatePresence mode='wait'>
              {selectedPersona ? (
                <AiChatContainer selectedPersona={selectedPersona} />
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <p className='text-gray-500'>Select a mentor to start chatting</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SwarasAI;
