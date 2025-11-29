'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getEnabledPersonas } from '@/constants/personas';

// Get all enabled personas
const allPersonas = Object.values(getEnabledPersonas()).filter(
  (p: any) => p.enabled,
);

export const PersonaGrid = () => {
  // Duplicate personas for seamless infinite loop
  const duplicatedPersonas = [...allPersonas, ...allPersonas];

  return (
    <div className='w-full overflow-hidden py-6 md:py-8'>
      <div className='relative'>
        {/* Gradient fade edges - smaller on mobile */}
        <div className='absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none' />
        <div className='absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none' />

        {/* Infinite scrolling marquee */}
        <motion.div
          className='flex gap-4 md:gap-8 items-center'
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
            },
          }}>
          {duplicatedPersonas.map((persona, idx) => (
            <div
              key={`${persona.id}-${idx}`}
              className='flex-shrink-0 group cursor-pointer'>
              <div className='flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-300'>
                {/* Avatar - smaller on mobile */}
                <div className='relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-100 group-hover:scale-105 transition-transform flex-shrink-0'>
                  <Image
                    src={persona.avatarUrl}
                    alt={persona.name}
                    fill
                    className='object-cover'
                  />
                </div>
                {/* Info */}
                <div className='flex flex-col gap-0.5 md:gap-1 min-w-0'>
                  <span className='text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap truncate max-w-[120px] md:max-w-none'>
                    {persona.name}
                  </span>
                  <span className='text-[10px] md:text-xs text-gray-500 whitespace-nowrap truncate max-w-[120px] md:max-w-none'>
                    {persona.title}
                  </span>
                </div>
                {/* Category Badge - hidden on mobile */}
                <span className='hidden sm:inline-block ml-2 px-2.5 py-1 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full uppercase tracking-wide whitespace-nowrap flex-shrink-0'>
                  {persona.category || 'AI'}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
