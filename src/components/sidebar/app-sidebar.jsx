// src/components/sidebar/app-sidebar.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import PersonaSelector from './persona-selector';
import ConversationCombobox from './conversation-combobox';
import AnimatedThemeToggle from './animated-theme-toggle';
import { useChatStore } from '@/store/chat-store';
import { personas } from '@/constants/personas';

const AppSidebar = () => {
  const {
    darkMode,
    selectedPersona,
    conversations,
    mentorsOnline,
    mentorsLoading,
  } = useChatStore();

  const currentPersona = personas[selectedPersona];
  const personaConversations = conversations.filter(
    (conv) => conv.personaId === selectedPersona,
  );

  // Determine status display
  const getStatusConfig = () => {
    if (mentorsLoading) {
      return {
        icon: Loader2,
        text: 'Connecting to AI Mentors...',
        bgColor: darkMode
          ? 'bg-yellow-900/20 border-yellow-700/30 text-yellow-300'
          : 'bg-yellow-100/60 border-yellow-200/30 text-yellow-700',
        iconAnimation: { rotate: 360 },
        iconTransition: { duration: 1, repeat: Infinity, ease: 'linear' },
      };
    } else if (mentorsOnline) {
      return {
        icon: Wifi,
        text: 'AI Mentors Online',
        bgColor: darkMode
          ? 'bg-green-900/20 border-green-700/30 text-green-300'
          : 'bg-green-100/60 border-green-200/30 text-green-700',
        iconAnimation: { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] },
        iconTransition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      };
    } else {
      return {
        icon: WifiOff,
        text: 'AI Mentors Offline',
        bgColor: darkMode
          ? 'bg-red-900/20 border-red-700/30 text-red-300'
          : 'bg-red-100/60 border-red-200/30 text-red-700',
        iconAnimation: { opacity: [1, 0.3, 1] },
        iconTransition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      className={`h-full flex flex-col transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900/50 to-gray-800/50 border-gray-700/30'
          : 'bg-gradient-to-b from-white/60 to-gray-50/60 border-gray-200/30'
      } backdrop-blur-lg border-r`}>
      {/* Compact Header */}
      <div
        className={`flex-shrink-0 p-4 border-b ${
          darkMode ? 'border-gray-700/30' : 'border-gray-200/30'
        }`}>
        <motion.div
          className='flex items-center justify-between mb-3'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}>
          <div className='flex items-center space-x-2'>
            <motion.div
              className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer'
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}>
              <Sparkles className='w-4 h-4 text-white' />
            </motion.div>

            <div className='min-w-0 flex-1'>
              <h2 className='text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate'>
                Swaras AI
              </h2>
              <p
                className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Code with Legends
              </p>
            </div>
          </div>

          <AnimatedThemeToggle />
        </motion.div>

        {/* Dynamic Status Indicator with Animations */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={
              mentorsLoading ? 'loading' : mentorsOnline ? 'online' : 'offline'
            }
            className={`rounded-lg p-2 backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${statusConfig.bgColor}`}
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ delay: 0.6, duration: 0.3 }}>
            <div className='flex items-center space-x-2'>
              <motion.div
                animate={statusConfig.iconAnimation}
                transition={statusConfig.iconTransition}>
                <statusConfig.icon className='w-4 h-4' />
              </motion.div>
              <span className='text-xs font-medium'>{statusConfig.text}</span>

              {/* Connection progress indicator for loading state */}
              {mentorsLoading && (
                <div className='ml-auto'>
                  <div className='flex space-x-1'>
                    <motion.div
                      className='w-1 h-1 bg-current rounded-full'
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className='w-1 h-1 bg-current rounded-full'
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className='w-1 h-1 bg-current rounded-full'
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Animated background effect for online state */}
            {mentorsOnline && (
              <motion.div
                className='absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent'
                animate={{ x: [-100, 100] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-hidden flex flex-col'>
        <div className='p-4 pb-2 flex-shrink-0'>
          <div className='flex items-center space-x-2 mb-3'>
            <h3
              className={`text-xs font-semibold uppercase tracking-wide ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Choose Mentor
            </h3>
            <motion.span
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium cursor-default transition-colors ${
                mentorsOnline
                  ? darkMode
                    ? 'bg-purple-900/30 text-purple-400'
                    : 'bg-purple-100 text-purple-600'
                  : darkMode
                  ? 'bg-gray-700/30 text-gray-500'
                  : 'bg-gray-200/30 text-gray-500'
              }`}
              animate={
                mentorsOnline
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}>
              {mentorsOnline
                ? `${Object.keys(personas).length} Available`
                : 'Offline'}
            </motion.span>
          </div>
        </div>

        {/* Personas - Custom scrollable container */}
        <div className='flex-1 overflow-y-auto px-4 pb-2 custom-scroll'>
          <PersonaSelector />
        </div>
      </div>

      {/* Footer - Chat History */}
      {selectedPersona && personaConversations.length > 0 && mentorsOnline && (
        <motion.div
          className={`flex-shrink-0 border-t p-3 ${
            darkMode
              ? 'border-gray-700/30 bg-gray-900/10'
              : 'border-gray-200/30 bg-white/10'
          }`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}>
          <div className='mb-2'>
            <h3
              className={`text-xs font-semibold flex items-center space-x-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
              <span>💬</span>
              <span>{currentPersona?.name} History</span>
              <span
                className={`text-xs px-1 py-0.5 rounded cursor-default ${
                  darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                {personaConversations.length}
              </span>
            </h3>
          </div>
          <ConversationCombobox />
        </motion.div>
      )}

      {/* Offline Notice in Footer */}
      {!mentorsOnline && !mentorsLoading && (
        <motion.div
          className={`flex-shrink-0 border-t p-3 ${
            darkMode
              ? 'border-red-700/30 bg-red-900/10'
              : 'border-red-200/30 bg-red-50/10'
          }`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}>
          <div className='flex items-center space-x-2 text-center'>
            <AlertCircle
              className={`w-4 h-4 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`}
            />
            <p
              className={`text-xs ${
                darkMode ? 'text-red-300' : 'text-red-700'
              }`}>
              Mentors are currently offline. Please try again later.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AppSidebar;
