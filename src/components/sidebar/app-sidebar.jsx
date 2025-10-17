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
      className={`h-full flex flex-col transition-colors duration-300 ${
        darkMode ? 'bg-[#0a0f1e]' : 'bg-white'
      } border-r ${
        darkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>

      {/* Header */}
      <div className={`flex-shrink-0 p-4 border-b ${
        darkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        {/* Main Brand Section with Dropdown */}
        <motion.div
          className='flex items-center justify-between mb-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <PopoverTrigger asChild>
              <button className='flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity'>
                {/* Logo */}
                <div className='w-10 h-10 bg-gradient-to-br from-[#0073e6] to-[#0052cc] rounded-lg flex items-center justify-center shadow-sm'>
                  <Sparkles className='w-5 h-5 text-white' />
                </div>

                <div className='min-w-0 flex-1 text-left'>
                  <div className='flex items-center gap-1.5'>
                    <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Swaras AI
                    </h1>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    AI Mentors
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

        {/* Status Section */}
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
        }`}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className={`w-2 h-2 rounded-full ${
                mentorsLoading
                  ? 'bg-yellow-500'
                  : mentorsOnline
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }`}></div>
              <span className={`text-sm font-medium ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {mentorsLoading ? 'Connecting' : mentorsOnline ? Object.keys(personas).length + ' Mentors Online' : 'Offline'}
              </span>
            </div>
            <span className={`text-xs ${
              darkMode ? 'text-slate-500' : 'text-slate-500'
            }`}>
              24/7
            </span>
          </div>
        </div>
      </div>

      {/* Persona Selector */}
      <div className='flex-shrink-0'>
        <PersonaSelector />
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
