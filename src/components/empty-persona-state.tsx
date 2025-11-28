// src/components/empty-persona-state.jsx
import { personas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { LayoutGrid, Sparkles } from 'lucide-react';

const EmptyPersonaState = () => {
  const { darkMode } = useChatStore();
  const availablePersonas = Object.entries(personas)
    .map(([id, persona]) => ({ ...persona, id }))
    .filter((p) => p.enabled);

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 ${
        darkMode ? 'bg-[#0a0f1e]' : 'bg-white'
      }`}>
      <div className='max-w-md w-full text-center px-4 sm:px-0'>
        {/* Animated Logo - Using Sidebar Design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-6 sm:mb-8 inline-block relative'>
          {/* Rotating Glow Effect */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className='absolute inset-0 rounded-2xl opacity-30'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FA8072] via-transparent to-[#FF8E8E] blur-2xl' />
          </motion.div>

          {/* Logo - Same as Sidebar */}
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-xl'
            style={{
              background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
            }}>
            <svg
              className='w-20 h-20 sm:w-24 sm:h-24 p-4 sm:p-5'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5'
                stroke='white'
                strokeWidth='1.8'
                strokeLinecap='round'
                opacity='0.95'
              />
              <path
                d='M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5'
                stroke='white'
                strokeWidth='1.8'
                strokeLinecap='round'
                opacity='0.95'
              />
              <path
                d='M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z'
                stroke='white'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'
                opacity='0.95'
              />
              <circle
                cx='10'
                cy='16.5'
                r='1'
                fill='white'
                opacity='0.95'
              />
              <circle
                cx='12'
                cy='16.5'
                r='1'
                fill='white'
                opacity='0.95'
              />
              <circle
                cx='14'
                cy='16.5'
                r='1'
                fill='white'
                opacity='0.95'
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Title - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='mb-4 sm:mb-5'>
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 font-[family-name:var(--font-raleway)] ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
            Welcome to Swar
            <span className='bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] bg-clip-text text-transparent font-extrabold'>
              AI
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
            Your AI-powered mentorship platform
          </p>
        </motion.div>

        {/* Instruction Card - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mx-auto p-5 sm:p-6 rounded-xl border backdrop-blur-sm ${
            darkMode
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200 shadow-sm'
          }`}>
          <div className='flex flex-col items-center gap-4'>
            {/* Icon */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`p-3 rounded-xl ${
                darkMode ? 'bg-[#FA8072]/10' : 'bg-[#FA8072]/10'
              }`}>
              <LayoutGrid className='w-6 h-6 sm:w-7 sm:h-7 text-[#FA8072]' />
            </motion.div>

            {/* Text */}
            <div className='text-center'>
              <h3
                className={`text-base sm:text-lg font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                Get Started
              </h3>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                Open the{' '}
                <span className='font-semibold text-[#FA8072]'>
                  mentor dashboard
                </span>{' '}
                from the sidebar to choose from{' '}
                <span className='font-semibold'>
                  {availablePersonas.length} industry experts
                </span>
              </p>
            </div>

            {/* Hint for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode ? 'bg-slate-700/30' : 'bg-slate-100'
              }`}>
              <LayoutGrid className='w-4 h-4 text-[#FA8072]' />
              <span
                className={`text-xs ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                Tap the grid icon in the top-left corner
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mt-6 sm:mt-8 space-y-3'>
          {[
            { icon: '💬', text: 'Real-time AI conversations' },
            { icon: '🎯', text: 'Personalized learning paths' },
            { icon: '⚡', text: 'Instant expert guidance' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`flex items-center justify-center gap-2 text-sm ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
              <span className='text-base'>{feature.icon}</span>
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Status Indicator - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className='mt-6 sm:mt-8 flex items-center justify-center gap-2'>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='w-2 h-2 bg-green-500 rounded-full'
          />
          <Sparkles className='w-3.5 h-3.5 text-green-500' />
          <span
            className={`text-xs sm:text-sm font-medium ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
            All {availablePersonas.length} mentors online
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default EmptyPersonaState;
