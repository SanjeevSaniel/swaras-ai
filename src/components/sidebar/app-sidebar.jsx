// src/components/sidebar/app-sidebar.jsx
'use client';

import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { useUser, useClerk, SignInButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  Sparkles,
  Users,
  WifiOff,
  Zap,
  ChevronDown,
  LogOut,
  Settings,
  Moon,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useState } from 'react';
import ConversationCombobox from './conversation-combobox';
import PersonaSelector from './persona-selector';

const AppSidebar = () => {
  const {
    darkMode,
    toggleDarkMode,
    selectedPersona,
    conversations,
    mentorsOnline,
    mentorsLoading,
  } = useChatStore();

  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut, openSignIn } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          ? 'bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-800/95'
          : 'bg-gradient-to-b from-white/95 via-white/90 to-slate-50/95'
      } backdrop-blur-xl border-r ${
        darkMode ? 'border-slate-700/40' : 'border-slate-200/40'
      }`}>
      {/* Animated background pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%223%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Enhanced Header */}
      <div
        className={`flex-shrink-0 p-4 border-b backdrop-blur-sm ${
          darkMode
            ? 'border-slate-700/40 bg-slate-900/20'
            : 'border-slate-200/40 bg-white/20'
        }`}>
        {/* Main Brand Section with Dropdown */}
        <motion.div
          className='flex items-center justify-between mb-3'
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}>
          <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <PopoverTrigger asChild>
              <button className='flex items-center space-x-3 flex-1 min-w-0 hover:opacity-80 transition-opacity'>
                {/* Modern Brushed Geometric Logo */}
                <motion.div
                  className='relative w-10 h-10 flex items-center justify-center'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}>
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10">
                    {/* Geometric hexagon with brushed S */}
                    <path
                      d="M24 2L42 13V35L24 46L6 35V13L24 2Z"
                      fill={darkMode ? '#1e293b' : '#f1f5f9'}
                      stroke={darkMode ? '#3b82f6' : '#2563eb'}
                      strokeWidth="1.5"
                    />
                    {/* Stylized S with geometric cuts */}
                    <path
                      d="M24 14C27 14 29.5 15.5 30.5 18C30.8 18.8 30.5 19.5 29.7 19.8C28.9 20.1 28.2 19.8 27.9 19C27.3 17.5 25.8 16.5 24 16.5C21.5 16.5 19.5 18 19.5 20C19.5 21.5 20.5 22.5 23 23.5L25 24.3C28.5 25.5 30 27 30 30C30 33 27.5 35.5 24 35.5C20.5 35.5 17.8 33.5 17 30.5C16.8 29.7 17.2 28.9 18 28.7C18.8 28.5 19.6 28.9 19.8 29.7C20.3 31.5 22 32.5 24 32.5C26.5 32.5 28.5 31 28.5 29C28.5 27.5 27.5 26.8 25 25.8L23 25C19.5 23.8 18 22.3 18 20C18 17 20.5 14 24 14Z"
                      fill={darkMode ? '#3b82f6' : '#2563eb'}
                    />
                    {/* Geometric accent dots */}
                    <circle cx="24" cy="10" r="1.5" fill={darkMode ? '#3b82f6' : '#2563eb'} opacity="0.6"/>
                    <circle cx="24" cy="38" r="1.5" fill={darkMode ? '#3b82f6' : '#2563eb'} opacity="0.6"/>
                  </svg>
                </motion.div>

                <div className='min-w-0 flex-1 text-left'>
                  <div className='flex items-center space-x-1.5'>
                    <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        letterSpacing: '-0.03em',
                        fontWeight: '700'
                      }}>
                      SWARAS
                    </h1>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <p
                    className={`text-[10px] font-bold tracking-[0.15em] uppercase ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                    AI PLATFORM
                  </p>
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent
              className={`w-56 p-2 ${darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-[#e5e7eb]'}`}
              align="start"
              sideOffset={8}>
              <div className='space-y-1'>
                {/* User Info */}
                {isLoaded && (
                  <>
                    {isSignedIn ? (
                      <div className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-[#262626]' : 'bg-[#f5f5f5]'}`}>
                        <div className='flex items-center space-x-2'>
                          {user?.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt={user.fullName || 'User'}
                              className='w-8 h-8 rounded-full object-cover'
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#2563eb]' : 'bg-[#2563eb]'}`}>
                              <UserIcon className='w-4 h-4 text-white' />
                            </div>
                          )}
                          <div className='flex-1 min-w-0'>
                            <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user?.fullName || user?.firstName || 'User'}
                            </p>
                            <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user?.primaryEmailAddress?.emailAddress || 'No email'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-[#262626]' : 'bg-[#f5f5f5]'}`}>
                        <button
                          onClick={() => {
                            openSignIn();
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          <div className='flex items-center space-x-2'>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#2563eb]' : 'bg-[#2563eb]'}`}>
                              <UserIcon className='w-4 h-4 text-white' />
                            </div>
                            <div>
                              <p className='text-sm font-medium'>Sign In</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Click to sign in
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Divider */}
                <div className={`h-px ${darkMode ? 'bg-[#2a2a2a]' : 'bg-[#e5e7eb]'}`} />

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'hover:bg-[#262626] text-gray-300'
                      : 'hover:bg-[#f5f5f5] text-gray-700'
                  }`}>
                  {darkMode ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
                  <span className='text-sm'>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    console.log('Settings clicked');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'hover:bg-[#262626] text-gray-300'
                      : 'hover:bg-[#f5f5f5] text-gray-700'
                  }`}>
                  <Settings className='w-4 h-4' />
                  <span className='text-sm'>Settings</span>
                </button>

                {/* Divider */}
                <div className={`h-px ${darkMode ? 'bg-[#2a2a2a]' : 'bg-[#e5e7eb]'}`} />

                {/* Logout - Only show if signed in */}
                {isSignedIn && (
                  <button
                    onClick={() => {
                      signOut();
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      darkMode
                        ? 'hover:bg-red-900/20 text-red-400'
                        : 'hover:bg-red-50 text-red-600'
                    }`}>
                    <LogOut className='w-4 h-4' />
                    <span className='text-sm'>Sign Out</span>
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Compact Status Section */}
        <motion.div
          className={`rounded-2xl p-3 border ${statusConfig.bgColor} backdrop-blur-sm`}
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
