// src/components/sidebar/app-sidebar.jsx
'use client';

import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  Sparkles,
  Users,
  WifiOff,
  Zap,
} from 'lucide-react';
import AnimatedThemeToggle from './animated-theme-toggle';
import ConversationCombobox from './conversation-combobox';
import PersonaSelector from './persona-selector';

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

  // Enhanced status configuration with better colors and animations
  const getStatusConfig = () => {
    if (mentorsLoading) {
      return {
        icon: Loader2,
        text: 'Connecting...',
        dotColor: 'bg-gradient-to-r from-amber-400 to-orange-400',
        bgColor: darkMode
          ? 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-700/30'
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50',
        textColor: darkMode ? 'text-amber-300' : 'text-amber-700',
        iconColor: darkMode ? 'text-amber-400' : 'text-amber-600',
        iconAnimation: { rotate: 360 },
        iconTransition: { duration: 1, repeat: Infinity, ease: 'linear' },
        pulseColor: 'shadow-amber-400/20',
      };
    } else if (mentorsOnline) {
      return {
        icon: Zap,
        text: 'Online',
        dotColor: 'bg-gradient-to-r from-emerald-400 to-green-400',
        bgColor: darkMode
          ? 'bg-gradient-to-r from-emerald-900/20 to-green-900/20 border-emerald-700/30'
          : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/50',
        textColor: darkMode ? 'text-emerald-300' : 'text-emerald-700',
        iconColor: darkMode ? 'text-emerald-400' : 'text-emerald-600',
        iconAnimation: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
        iconTransition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        pulseColor: 'shadow-emerald-400/20',
      };
    } else {
      return {
        icon: WifiOff,
        text: 'Offline',
        dotColor: 'bg-gradient-to-r from-rose-400 to-red-400',
        bgColor: darkMode
          ? 'bg-gradient-to-r from-rose-900/20 to-red-900/20 border-rose-700/30'
          : 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-200/50',
        textColor: darkMode ? 'text-rose-300' : 'text-rose-700',
        iconColor: darkMode ? 'text-rose-400' : 'text-rose-600',
        iconAnimation: { opacity: [1, 0.4, 1] },
        iconTransition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        pulseColor: 'shadow-rose-400/20',
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      className={`h-full flex flex-col transition-all duration-500 relative overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-800/95'
          : 'bg-gradient-to-b from-white/95 via-white/90 to-gray-50/95'
      } backdrop-blur-xl border-r ${
        darkMode ? 'border-gray-700/40' : 'border-gray-200/40'
      }`}>
      {/* Animated background pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%223%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Enhanced Header */}
      <div
        className={`flex-shrink-0 p-4 border-b backdrop-blur-sm ${
          darkMode
            ? 'border-gray-700/40 bg-gray-900/20'
            : 'border-gray-200/40 bg-white/20'
        }`}>
        {/* Main Brand Section */}
        <motion.div
          className='flex items-center justify-between mb-3'
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}>
          <div className='flex items-center space-x-3 flex-1 min-w-0'>
            <motion.div
              className='relative w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md cursor-pointer'
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.4 }}>
              <Sparkles className='w-4 h-4 text-white' />
            </motion.div>

            <div className='min-w-0 flex-1'>
              <h1 className='text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'>
                Swaras AI
              </h1>
              <p
                className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                } font-medium`}>
                Code with Legends
              </p>
            </div>
          </div>

          <AnimatedThemeToggle />
        </motion.div>

        {/* Compact Status Section */}
        <motion.div
          className={`rounded-xl p-3 border ${statusConfig.bgColor} backdrop-blur-sm`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <motion.div
                className={`w-6 h-4 rounded-lg ${statusConfig.bgColor} border flex items-center justify-center ${statusConfig.pulseColor}`}
                animate={statusConfig.iconAnimation}
                transition={statusConfig.iconTransition}>
                <statusConfig.icon
                  className={`w-3 h-3 ${statusConfig.iconColor}`}
                />
              </motion.div>

              <div>
                <h3
                  className={`text-xs font-semibold ${statusConfig.textColor}`}>
                  {statusConfig.text}
                </h3>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='flex items-center space-x-1'>
                <Users
                  className={`w-3 h-3 ${
                    darkMode ? 'text-gray-500' : 'text-gray-600'
                  }`}
                />
                <span
                  className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {mentorsOnline ? Object.keys(personas).length : '0'}
                </span>
              </div>

              <div className='flex items-center space-x-1'>
                <MessageSquare
                  className={`w-3 h-3 ${
                    darkMode ? 'text-gray-500' : 'text-gray-600'
                  }`}
                />
                <span
                  className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {conversations.length}
                </span>
              </div>

              <motion.div
                className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}
                animate={{
                  scale: mentorsOnline ? [1, 1.3, 1] : [1, 0.8, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content with thin auto-hide scrolling */}
      <div className='flex-1 overflow-hidden flex flex-col'>
        <motion.div
          className='flex-1 overflow-y-auto px-4 pt-4 pb-2 scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 scrollbar-track-transparent transition-all duration-300'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'transparent transparent',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}>
          <PersonaSelector />
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 1px;
          transition: background 0.3s ease;
        }

        .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.6);
        }

        .dark .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.6);
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8) !important;
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8) !important;
        }

        /* Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .scrollbar-thin:hover {
          scrollbar-color: rgba(156, 163, 175, 0.6) transparent;
        }

        .dark .scrollbar-thin:hover {
          scrollbar-color: rgba(107, 114, 128, 0.6) transparent;
        }
      `}</style>

      {/* Enhanced Footer - Chat History */}
      {selectedPersona && personaConversations.length > 0 && mentorsOnline && (
        <motion.div
          className={`flex-shrink-0 border-t p-4 backdrop-blur-sm ${
            darkMode
              ? 'border-gray-700/40 bg-gradient-to-r from-gray-900/30 to-gray-800/30'
              : 'border-gray-200/40 bg-gradient-to-r from-white/30 to-gray-50/30'
          }`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}>
          <div className='mb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div
                  className={`w-6 h-6 rounded-lg ${
                    currentPersona?.bgColor || 'bg-gray-200'
                  } flex items-center justify-center text-sm`}>
                  {currentPersona?.avatar || '🤖'}
                </div>
                <h3
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  {currentPersona?.name || 'AI Assistant'}
                </h3>
              </div>

              <motion.span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  darkMode
                    ? 'bg-purple-900/30 text-purple-400 border border-purple-700/30'
                    : 'bg-purple-100 text-purple-600 border border-purple-200'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}>
                {personaConversations.length} chats
              </motion.span>
            </div>
          </div>

          <ConversationCombobox />
        </motion.div>
      )}

      {/* Enhanced Offline Notice */}
      {!mentorsOnline && !mentorsLoading && (
        <motion.div
          className={`flex-shrink-0 border-t px-4 py-3 backdrop-blur-sm ${
            darkMode
              ? 'border-rose-700/40 bg-gradient-to-r from-rose-900/20 to-red-900/20'
              : 'border-rose-200/40 bg-gradient-to-r from-rose-50/20 to-red-50/20'
          }`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}>
          <div className='flex items-center space-x-3'>
            <motion.div
              className={`w-8 h-8 rounded-xl ${
                darkMode ? 'bg-rose-900/30' : 'bg-rose-100'
              } flex items-center justify-center`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <AlertCircle
                className={`w-4 h-4 ${
                  darkMode ? 'text-rose-400' : 'text-rose-600'
                }`}
              />
            </motion.div>

            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? 'text-rose-300' : 'text-rose-700'
                }`}>
                Mentors Offline
              </p>
              <p
                className={`text-xs ${
                  darkMode ? 'text-rose-400' : 'text-rose-600'
                }`}>
                Reconnecting automatically...
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AppSidebar;
