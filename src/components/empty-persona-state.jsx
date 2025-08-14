// src/components/empty-persona-state.jsx (Complete empty state)
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Users,
  MessageSquare,
  Zap,
  ArrowRight,
  Code2,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { useChatStore } from '@/store/chat-store';
import { personas } from '@/constants/personas';

const EmptyPersonaState = () => {
  const { darkMode, conversations } = useChatStore();

  const hasConversations = conversations.length > 0;
  const availablePersonas = Object.values(personas);
  const mentorCount = availablePersonas.length;

  // Generate dynamic mentor names list
  const getMentorNamesText = () => {
    const names = availablePersonas.map((p) => p.name);
    if (names.length <= 2) {
      return names.join(' or ');
    } else if (names.length === 3) {
      return `${names[0]}, ${names[1]}, or ${names[2]}`;
    } else {
      return `${names.slice(0, -1).join(', ')}, or ${names[names.length - 1]}`;
    }
  };

  const features = [
    {
      icon: Code2,
      title: 'Expert Guidance',
      description: 'Get personalized coding advice',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: 'Interactive Learning',
      description: 'Dynamic programming conversations',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Instant Solutions',
      description: 'Quick coding challenge help',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className='w-full h-full flex items-center justify-center overflow-hidden'>
      <div className='w-full max-w-4xl mx-auto px-4 py-6 relative'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-20 pointer-events-none'>
          <div
            className='w-full h-full'
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${
                darkMode ? '#1e293b' : '#e0e7ff'
              } 2px, transparent 2px),
                                 radial-gradient(circle at 75% 75%, ${
                                   darkMode ? '#0f172a' : '#f1f5f9'
                                 } 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}></div>
        </div>

        <div className='relative z-10 text-center space-y-6'>
          {/* Context Header */}
          {hasConversations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <motion.div
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border backdrop-blur-sm ${
                  darkMode
                    ? 'bg-blue-900/20 border-blue-700/30 text-blue-300'
                    : 'bg-blue-50/80 border-blue-200/50 text-blue-700'
                }`}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}>
                <RotateCcw className='w-4 h-4' />
                <span className='text-sm font-medium'>Mentor Deselected</span>
              </motion.div>
            </motion.div>
          )}

          {/* Main Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: hasConversations ? 0.2 : 0 }}
            className='space-y-4'>
            <motion.div
              className='w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl'
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}>
              <Sparkles className='w-10 h-10 md:w-12 md:h-12 text-white' />

              {/* Floating particles */}
              <motion.div
                className='absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full'
                animate={{
                  y: [-8, 8, -8],
                  x: [-4, 4, -4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className='absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full'
                animate={{
                  y: [8, -8, 8],
                  x: [4, -4, 4],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
            </motion.div>

            <div className='space-y-3'>
              <motion.h1
                className='text-3xl md:text-4xl font-bold'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}>
                <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'>
                  {hasConversations
                    ? 'Ready to Continue?'
                    : 'Welcome to Swaras AI'}
                </span>
              </motion.h1>

              <motion.p
                className={`text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}>
                {hasConversations
                  ? 'Select any mentor to resume your coding sessions'
                  : 'Your Personal AI-Powered Coding Mentorship Platform'}
              </motion.p>
            </div>
          </motion.div>

          {/* Features Grid - Only for first time */}
          {!hasConversations && (
            <motion.div
              className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto'
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-700/50'
                      : 'bg-white/40 border-gray-200/30 hover:bg-white/60'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -2 }}>
                  <motion.div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}>
                    <feature.icon className='w-5 h-5 text-white' />
                  </motion.div>

                  <h3
                    className={`text-base font-semibold mb-2 ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                    {feature.title}
                  </h3>

                  <p
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            className={`max-w-2xl mx-auto p-6 rounded-2xl border backdrop-blur-sm ${
              darkMode
                ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700/30'
                : 'bg-gradient-to-r from-purple-100/60 to-pink-100/60 border-purple-200/40'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: hasConversations ? 0.5 : 0.8 }}>
            <motion.div
              className='flex items-center justify-center space-x-3 mb-4'
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <Users
                className={`w-5 h-5 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}
              />
              <span
                className={`text-lg font-semibold ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                {hasConversations
                  ? 'Welcome Back!'
                  : 'Ready to Start Learning?'}
              </span>
              <ArrowRight
                className={`w-5 h-5 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}
              />
            </motion.div>

            {/* Direction Indicator */}
            <motion.div
              className='flex items-center justify-center space-x-3 mb-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}>
              <motion.div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-sm border ${
                  darkMode
                    ? 'bg-gray-800/40 border-gray-700/40 text-purple-300'
                    : 'bg-white/60 border-gray-200/40 text-purple-700'
                }`}
                animate={{ x: [-6, 0, -6] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.05 }}>
                <ArrowLeft
                  className={`w-4 h-4 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                  {mentorCount} mentor{mentorCount !== 1 ? 's' : ''} available
                </span>
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    darkMode ? 'bg-purple-400' : 'bg-purple-600'
                  }`}
                />
              </motion.div>
            </motion.div>

            <p
              className={`text-sm leading-relaxed mb-4 ${
                darkMode ? 'text-purple-200' : 'text-purple-600'
              }`}>
              {hasConversations
                ? `Click on any of the ${mentorCount} mentor card${
                    mentorCount !== 1 ? 's' : ''
                  } in the sidebar to resume your conversations`
                : `Select from ${getMentorNamesText()} in the sidebar to begin your personalized coding mentorship`}
            </p>

            {/* Available mentors preview */}
            <motion.div
              className='flex items-center justify-center flex-wrap gap-2'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}>
              <span
                className={`text-xs font-medium ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                Available:
              </span>
              {availablePersonas.map((persona, index) => (
                <motion.div
                  key={persona.id}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    darkMode
                      ? 'bg-gray-800/50 text-gray-300'
                      : 'bg-white/50 text-gray-700'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}>
                  <div
                    className={`w-4 h-4 rounded ${persona.accentColor} flex items-center justify-center text-white text-xs font-bold`}>
                    {persona.avatar}
                  </div>
                  <span className='font-medium'>{persona.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className='absolute top-10 right-10 w-24 h-24 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-xl pointer-events-none'
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className='absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/5 to-red-400/5 rounded-full blur-xl pointer-events-none'
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
};

export default EmptyPersonaState;
