// src/components/sidebar/sidebar.jsx
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Code2, Moon, Settings, Sparkles, Sun, Zap } from 'lucide-react';
import { useEffect } from 'react';
import ConversationCombobox from './conversation-combobox';
import PersonaSelector from './persona-selector';

const Sidebar = () => {
  const { darkMode, toggleDarkMode, initializeTheme } = useChatStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <div
      className={`h-full flex flex-col border-r ${
        darkMode ? 'bg-[#0a0f1e] border-slate-800' : 'bg-white border-slate-200'
      }`}>
      {/* CLEAN HEADER */}
      <motion.div
        className='flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-800'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <div className='relative z-10'>
          {/* Logo and Title Row */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center space-x-3'>
              {/* Logo */}
              <div className='w-10 h-10 bg-gradient-to-br from-[#0073e6] to-[#0052cc] rounded-lg flex items-center justify-center shadow-sm'>
                <Sparkles className='w-5 h-5 text-white' />
              </div>

              {/* Title */}
              <div className='flex flex-col'>
                <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Swaras AI
                </h1>
                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  AI Mentors
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-2'>
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'hover:bg-slate-800 text-slate-400'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}>
                {darkMode ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
              </button>

              {/* Settings Button */}
              <button
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'hover:bg-slate-800 text-slate-400'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}>
                <Settings className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                2 Mentors Online
              </span>
            </div>
            <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              24/7
            </span>
          </div>
        </div>
      </motion.div>

      {/* Rest remains the same */}
      <div className='flex-shrink-0'>
        <PersonaSelector />
      </div>

      <div className='flex-shrink-0'>
        <ConversationCombobox />
      </div>

      <div className='flex-1'>{/* Future features */}</div>
    </div>
  );
};

export default Sidebar;
