// src/components/sidebar/app-sidebar.jsx
import { personas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AnimatedThemeToggle from './animated-theme-toggle';
import ConversationCombobox from './conversation-combobox';
import PersonaSelector from './persona-selector';

const AppSidebar = () => {
  const { darkMode, selectedPersona, conversations } = useChatStore();
  const currentPersona = personas[selectedPersona];
  const personaConversations = conversations.filter(
    (conv) => conv.personaId === selectedPersona,
  );

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

        {/* Compact Status Indicator */}
        <motion.div
          className={`rounded-lg p-2 backdrop-blur-sm relative overflow-hidden ${
            darkMode
              ? 'bg-green-900/20 border border-green-700/30 text-green-300'
              : 'bg-green-100/60 border border-green-200/30 text-green-700'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}>
          <div className='flex items-center space-x-2'>
            <motion.div
              className='w-2 h-2 bg-green-400 rounded-full'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span className='text-xs font-medium'>AI Mentors Online</span>
          </div>
        </motion.div>
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
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium cursor-default ${
                darkMode
                  ? 'bg-purple-900/30 text-purple-400'
                  : 'bg-purple-100 text-purple-600'
              }`}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}>
              {Object.keys(personas).length} Available
            </motion.span>
          </div>
        </div>

        {/* Personas - Custom scrollable container */}
        <div className='flex-1 overflow-y-auto px-4 pb-2 custom-scroll'>
          <PersonaSelector />
        </div>
      </div>

      {/* Footer - Chat History */}
      {selectedPersona && personaConversations.length > 0 && (
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
    </div>
  );
};

export default AppSidebar;
