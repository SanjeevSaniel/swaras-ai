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
      className={`h-full flex flex-col ${
        darkMode ? 'bg-gray-800/50' : 'bg-white/50'
      } backdrop-blur-xl`}>
      {/* COMPLETELY NEW MODERN HEADER DESIGN */}
      <motion.div
        className='flex-shrink-0 p-6 pb-6 relative overflow-hidden'
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}>
        {/* Animated Background Gradient */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 rounded-3xl'
          animate={{
            background: [
              'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.1) 100%)',
              'linear-gradient(225deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(236, 72, 153, 0.1) 100%)',
              'linear-gradient(315deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(168, 85, 247, 0.1) 100%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Main Header Content */}
        <div className='relative z-10'>
          {/* Logo and Title Row */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-center space-x-4'>
              {/* Large Modern Logo */}
              <motion.div
                className='relative group'
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}>
                {/* Outer glow ring */}
                <motion.div
                  className='absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl opacity-20 blur-lg'
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />

                {/* Main logo container */}
                <div className='relative w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 group-hover:shadow-purple-500/25 transition-all duration-300'>
                  {/* Inner animated circle */}
                  <motion.div
                    className='absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl'
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                        'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 100%)',
                        'linear-gradient(225deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}>
                    <Sparkles className='w-8 h-8 text-white relative z-10' />
                  </motion.div>

                  {/* Floating micro elements */}
                  <motion.div
                    className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-lg'
                    animate={{
                      y: [-3, -8, -3],
                      x: [0, 2, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <motion.div
                    className='absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full shadow-lg'
                    animate={{
                      x: [-2, -6, -2],
                      y: [0, 1, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                </div>
              </motion.div>

              {/* Enhanced Title Section */}
              <div className='flex flex-col'>
                <motion.h1
                  className='text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent tracking-tight'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}>
                  Swaras AI
                </motion.h1>

                <motion.div
                  className='flex items-center space-x-1.5 mt-1'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}>
                  <Code2
                    className={`w-3.5 h-3.5 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Code with Legends
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <Zap
                      className={`w-3.5 h-3.5 ${
                        darkMode ? 'text-yellow-400' : 'text-yellow-500'
                      }`}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Modern Action Buttons */}
            <div className='flex items-center space-x-3'>
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className={`relative p-3.5 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 group ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-700/60 to-gray-800/60 border-gray-600/40 text-amber-400 hover:border-amber-400/50'
                    : 'bg-gradient-to-br from-white/70 to-white/50 border-white/50 text-slate-600 hover:border-amber-500/50 hover:text-amber-600'
                }`}>
                <motion.div className='absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity' />

                <motion.div
                  key={darkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                  {darkMode ? (
                    <Sun className='w-4.5 h-4.5 relative z-10' />
                  ) : (
                    <Moon className='w-4.5 h-4.5 relative z-10' />
                  )}
                </motion.div>
              </motion.button>

              {/* Settings Button */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className={`relative p-3.5 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 group ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-700/60 to-gray-800/60 border-gray-600/40 text-gray-300 hover:border-blue-400/50'
                    : 'bg-gradient-to-br from-white/70 to-white/50 border-white/50 text-slate-600 hover:border-blue-500/50'
                }`}>
                <motion.div className='absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity' />

                <Settings className='w-4.5 h-4.5 relative z-10' />

                {/* Active indicator */}
                <motion.div
                  className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-lg'
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 0 0px rgba(239, 68, 68, 0.4)',
                      '0 0 0 4px rgba(239, 68, 68, 0)',
                      '0 0 0 0px rgba(239, 68, 68, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </div>
          </div>

          {/* Premium Status Card */}
          <motion.div
            className={`relative rounded-3xl p-6 border-2 backdrop-blur-md overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-600/30'
                : 'bg-gradient-to-br from-green-50/90 to-emerald-50/70 border-green-300/40'
            }`}
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.03, y: -2 }}>
            {/* Animated background shimmer */}
            <motion.div
              className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12'
              animate={{ x: ['-200%', '200%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 2,
              }}
            />

            <div className='relative z-10 space-y-3'>
              {/* Status header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <motion.div
                    className='relative flex items-center space-x-2'
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}>
                    <motion.div
                      className='w-4 h-4 bg-green-400 rounded-full shadow-xl relative'
                      animate={{
                        scale: [1, 1.4, 1],
                        boxShadow: [
                          '0 0 0 0px rgba(34, 197, 94, 0.6)',
                          '0 0 0 8px rgba(34, 197, 94, 0)',
                          '0 0 0 0px rgba(34, 197, 94, 0)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}>
                      <motion.div
                        className='absolute inset-1 bg-white/40 rounded-full'
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>

                    <span
                      className={`text-base font-bold ${
                        darkMode ? 'text-green-300' : 'text-green-700'
                      }`}>
                      AI Mentors Online
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                    darkMode
                      ? 'bg-green-800/60 text-green-200 border-green-600/40'
                      : 'bg-green-100 text-green-800 border-green-300/60'
                  }`}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  🔴 LIVE
                </motion.div>
              </div>

              {/* Status details */}
              <div className='flex items-center justify-between'>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? 'text-green-400/90' : 'text-green-600/90'
                  }`}>
                  Ready to help you code like a legend! 🚀✨
                </p>

                {/* Signal strength */}
                <div className='flex items-center space-x-1.5'>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className='w-1.5 rounded-full bg-green-400 shadow-sm'
                      style={{ height: `${(i + 1) * 3 + 4}px` }}
                      animate={{
                        scaleY: [1, 1.6, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
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
