'use client';

import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-background'>
      {/* Subtle animated mesh gradient background */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          className='absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-[#FA8072]/10 via-transparent to-transparent rounded-full blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className='absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-[#FF8E8E]/10 via-transparent to-transparent rounded-full blur-3xl'
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Main loader content */}
      <div className='relative z-10 flex flex-col items-center gap-8'>
        {/* Modern logo with smooth animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
          }}
          className='relative'>
          {/* Outer rotating ring */}
          <motion.div
            className='absolute inset-0 -m-4'
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}>
            <div className='w-full h-full border-2 border-dashed border-[#FA8072]/30 rounded-full' />
          </motion.div>

          {/* Logo container with gradient border */}
          <motion.div
            className='relative p-1 rounded-2xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E]'
            animate={{
              boxShadow: [
                '0 0 20px rgba(250, 128, 114, 0.3)',
                '0 0 40px rgba(250, 128, 114, 0.5)',
                '0 0 20px rgba(250, 128, 114, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}>
            <div className='bg-background rounded-xl p-4'>
              {/* SVG Logo */}
              <svg
                width='56'
                height='56'
                viewBox='0 0 24 24'
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
                    <stop
                      offset='0%'
                      stopColor='#FA8072'
                    />
                    <stop
                      offset='100%'
                      stopColor='#FF8E8E'
                    />
                  </linearGradient>
                </defs>
                {/* Chat brain icon */}
                <motion.path
                  d='M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5'
                  stroke='url(#logoGradient)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.path
                  d='M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5'
                  stroke='url(#logoGradient)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.2,
                    ease: 'easeInOut',
                  }}
                />
                <motion.path
                  d='M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z'
                  stroke='url(#logoGradient)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill='none'
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.4,
                    ease: 'easeInOut',
                  }}
                />
                {/* Animated dots inside chat bubble */}
                {[8, 12, 16].map((cx, i) => (
                  <motion.circle
                    key={cx}
                    cx={cx}
                    cy='16.5'
                    r='1'
                    fill='url(#logoGradient)'
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Orbiting particles */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={angle}
              className='absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#FA8072] to-[#FF8E8E]'
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [
                  Math.cos((angle * Math.PI) / 180) * 50,
                  Math.cos(((angle + 360) * Math.PI) / 180) * 50,
                ],
                y: [
                  Math.sin((angle * Math.PI) / 180) * 50,
                  Math.sin(((angle + 360) * Math.PI) / 180) * 50,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Text content with smooth fade-in */}
        <div className='flex flex-col items-center gap-4'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className='text-2xl font-bold bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] bg-clip-text text-transparent font-[family-name:var(--font-raleway)]'>
            Swar<span className='font-extrabold'>AI</span>
          </motion.h2>

          {/* Modern progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='w-48 h-1 bg-border rounded-full overflow-hidden'>
            <motion.div
              className='h-full bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] rounded-full'
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ width: '50%' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              delay: 0.7,
              duration: 3,
              repeat: Infinity,
            }}
            className='text-sm text-muted-foreground'>
            Preparing your AI mentors...
          </motion.p>
        </div>
      </div>

      {/* Bottom minimal footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'>
        <div className='flex items-center gap-2'>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className='w-1.5 h-1.5 rounded-full bg-muted-foreground/40'
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <p className='text-xs text-muted-foreground/60'>Powered by AI</p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
