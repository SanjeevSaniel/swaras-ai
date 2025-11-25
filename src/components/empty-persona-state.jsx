// src/components/empty-persona-state.jsx
import { personas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

const EmptyPersonaState = () => {
  const { darkMode } = useChatStore();
  const availablePersonas = Object.entries(personas)
    .map(([id, persona]) => ({ ...persona, id }))
    .filter(p => p.enabled);

  return (
    <div className={`w-full h-full flex items-center justify-center p-8 ${
      darkMode ? 'bg-[#0a0f1e]' : 'bg-white'
    }`}>
      <div className='max-w-lg w-full text-center'>
        {/* Animated Logo - Using Sidebar Design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-6 inline-block relative'>
          {/* Rotating Glow Effect */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
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
              ease: "easeInOut"
            }}
            className='relative w-20 h-20 rounded-xl overflow-hidden shadow-xl'
            style={{
              background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
            }}>
            <svg
              className='w-20 h-20 p-4'
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='mb-6'>
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Swaras AI
          </h1>
          <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Your AI Mentorship Platform
          </p>
        </motion.div>

        {/* Instruction Card - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`max-w-sm mx-auto p-5 rounded-xl border backdrop-blur-sm ${
            darkMode
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/50 border-slate-200'
          }`}>
          <div className='flex items-center gap-3'>
            <motion.div
              animate={{
                x: [-3, 0, -3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`p-2.5 rounded-lg ${
                darkMode ? 'bg-[#FA8072]/10' : 'bg-[#FA8072]/10'
              }`}>
              <ArrowLeft className='w-5 h-5 text-[#FA8072]' />
            </motion.div>
            <div className='text-left flex-1'>
              <h3 className={`text-sm font-semibold mb-0.5 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Select a Mentor to Begin
              </h3>
              <p className={`text-xs ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {availablePersonas.length} expert AI mentors available
              </p>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mt-8 flex items-center justify-center gap-6'>
          {/* Floating Orbs */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? 'bg-[#FA8072]' : i === 1 ? 'bg-[#FF8E8E]' : 'bg-[#FA8072]/70'
              }`}
            />
          ))}
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='mt-6 flex items-center justify-center gap-2'>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className='w-1.5 h-1.5 bg-green-500 rounded-full'
          />
          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            All mentors online and ready
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default EmptyPersonaState;
