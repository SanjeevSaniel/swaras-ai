// src/components/welcome/components/WelcomeBadge.jsx (Compact redesign)
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const WelcomeBadge = ({ darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.1,
        duration: 0.6,
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      className='flex justify-center mb-4'>
      <motion.div
        className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border backdrop-blur-lg shadow-lg relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-r from-slate-800/95 via-gray-800/95 to-slate-800/95 border-gray-600/60 text-white'
            : 'bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95 border-gray-300/60 text-gray-900'
        }`}
        whileHover={{ scale: 1.02, y: -1 }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: darkMode
            ? '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 10px 25px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        }}>
        {/* Animated background shimmer */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent'
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transform: 'skewX(-45deg)' }}
        />

        {/* Icon */}
        <motion.div
          className='relative z-10'
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}>
          <Sparkles
            className={`w-4 h-4 ${
              darkMode ? 'text-purple-400' : 'text-purple-600'
            }`}
          />
        </motion.div>

        {/* Text */}
        <span
          className={`text-sm font-bold tracking-wide select-none relative z-10 ${
            darkMode
              ? 'text-gray-100'
              : 'bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent'
          }`}
          style={{
            textShadow: darkMode ? '0 0 8px rgba(255, 255, 255, 0.3)' : 'none',
          }}>
          AI Learning Experience
        </span>

        {/* LIVE Badge */}
        <div className='relative z-10'>
          <motion.div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border ${
              darkMode
                ? 'bg-gradient-to-r from-emerald-600/90 to-green-600/90 text-emerald-100 border-emerald-400/70'
                : 'bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white border-emerald-300/70'
            }`}
            animate={{
              boxShadow: darkMode
                ? [
                    '0 0 8px rgba(16, 185, 129, 0.4)',
                    '0 0 16px rgba(16, 185, 129, 0.6)',
                    '0 0 8px rgba(16, 185, 129, 0.4)',
                  ]
                : [
                    '0 2px 8px rgba(16, 185, 129, 0.3)',
                    '0 2px 12px rgba(16, 185, 129, 0.5)',
                    '0 2px 8px rgba(16, 185, 129, 0.3)',
                  ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}>
            <motion.div
              className='w-1.5 h-1.5 rounded-full bg-emerald-200'
              animate={{
                opacity: [1, 0.3, 1],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
            LIVE
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeBadge;
