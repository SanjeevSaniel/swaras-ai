// src/components/sidebar/sidebar.jsx (Replace ConversationList with ConversationCombobox)
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings, Moon, Sun } from 'lucide-react';
import PersonaSelector from './persona-selector';
import ConversationCombobox from './conversation-combobox';
import { useChatStore } from '@/store/chat-store';

const Sidebar = () => {
  const { darkMode, toggleDarkMode, initializeTheme } = useChatStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? 'bg-gray-800/50' : 'bg-white/50'
      } backdrop-blur-xl`}>
      {/* Header - Fixed */}
      <motion.div
        className='flex-shrink-0 p-6 pb-4'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <motion.div
              className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}>
              <Sparkles className='w-5 h-5 text-white' />
            </motion.div>
            <div>
              <h1 className='text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Swaras AI
              </h1>
              <p
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Code with Legends
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 text-amber-400'
                  : 'bg-white/50 hover:bg-white/70 border-white/30 text-slate-600'
              }`}>
              {darkMode ? (
                <Sun className='w-4 h-4' />
              ) : (
                <Moon className='w-4 h-4' />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 text-gray-300'
                  : 'bg-white/50 hover:bg-white/70 border-white/30 text-slate-600'
              }`}>
              <Settings className='w-4 h-4' />
            </motion.button>
          </div>
        </div>

        {/* Status Card */}
        <motion.div
          className={`rounded-2xl p-4 border backdrop-blur-sm ${
            darkMode
              ? 'bg-green-900/20 border-green-700/30 text-green-300'
              : 'bg-green-400/20 border-green-200/30 text-green-700'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
            <span className='text-sm font-medium'>AI Mentors Online</span>
          </div>
          <p className='text-xs mt-1'>Ready to help you code!</p>
        </motion.div>
      </motion.div>

      {/* Personas - Fixed */}
      <div className='flex-shrink-0'>
        <PersonaSelector />
      </div>

      {/* Conversation Combobox - Compact */}
      <div className='flex-shrink-0'>
        <ConversationCombobox />
      </div>

      {/* Additional Space for Future Features */}
      <div className='flex-1'>
        {/* You can add more features here like:
            - Quick actions
            - Settings panel
            - Statistics
            - Help section
        */}
      </div>
    </div>
  );
};

export default Sidebar;
