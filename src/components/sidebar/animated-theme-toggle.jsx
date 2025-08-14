// src/components/sidebar/animated-theme-toggle.jsx (Smaller size)
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Stars, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chat-store';

const AnimatedThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useChatStore();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}>
      <Button
        variant='ghost'
        size='sm'
        onClick={toggleDarkMode}
        className={`relative w-10 h-10 rounded-xl transition-all duration-300 overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-purple-500/20'
            : 'bg-gradient-to-br from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-md shadow-amber-400/20'
        }`}>
        {/* Main Icon */}
        <div className='relative z-10 flex items-center justify-center w-full h-full'>
          <AnimatePresence mode='wait'>
            {darkMode ? (
              <motion.div
                key='dark'
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ duration: 0.2 }}
                className='relative'>
                <Moon className='w-4 h-4 text-white' />

                <motion.div
                  className='absolute -top-0.5 -right-0.5'
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }}>
                  <Stars className='w-1.5 h-1.5 text-yellow-300' />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key='light'
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.2 }}
                className='relative'>
                <Sun className='w-4 h-4 text-white' />

                <motion.div
                  className='absolute -top-0.5 -right-0.5'
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}>
                  <Zap className='w-1.5 h-1.5 text-yellow-200' />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Button>
    </motion.div>
  );
};

export default AnimatedThemeToggle;
