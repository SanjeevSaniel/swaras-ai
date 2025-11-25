'use client';

import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      {/* Animated Background Gradient */}
      <div className='absolute inset-0 opacity-30'>
        <motion.div
          className='absolute top-0 right-0 w-96 h-96 bg-[#FA8072] rounded-full blur-[120px]'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute bottom-0 left-0 w-96 h-96 bg-[#FF8E8E] rounded-full blur-[120px]'
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Logo and Loader */}
      <div className='relative z-10 flex flex-col items-center gap-8'>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='relative'>
          {/* SVG Logo */}
          <svg
            width='80'
            height='80'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='relative z-10'>
            <defs>
              <linearGradient
                id='logoGradient'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='100%'>
                <stop offset='0%' stopColor='#FA8072' />
                <stop offset='100%' stopColor='#FF8E8E' />
              </linearGradient>
            </defs>
            <rect
              x='2'
              y='2'
              width='28'
              height='28'
              rx='8'
              fill='url(#logoGradient)'
            />
            <circle cx='12' cy='12' r='2' fill='white' opacity='0.95' />
            <circle cx='20' cy='12' r='2' fill='white' opacity='0.95' />
            <path
              d='M10 20 Q16 24 22 20'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              fill='none'
              opacity='0.95'
            />
          </svg>

          {/* Pulsing Ring */}
          <motion.div
            className='absolute inset-0 rounded-2xl border-4 border-[#FA8072]'
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </motion.div>

        {/* Text */}
        <div className='flex flex-col items-center gap-3'>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='text-2xl font-bold bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] bg-clip-text text-transparent'>
            Swaras AI
          </motion.h2>

          {/* Elegant Dots Loader */}
          <div className='flex items-center gap-2'>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className='w-2 h-2 rounded-full bg-gradient-to-r from-[#FA8072] to-[#FF8E8E]'
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className='text-sm text-muted-foreground mt-1'>
            Loading your mentors...
          </motion.p>
        </div>
      </div>

      {/* Bottom Floating Elements */}
      <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4'>
        <motion.div
          className='w-1 h-1 rounded-full bg-[#FA8072]/40'
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='w-1.5 h-1.5 rounded-full bg-[#FF8E8E]/40'
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.3,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='w-1 h-1 rounded-full bg-[#FA8072]/40'
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.6,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
};

export default PageLoader;
