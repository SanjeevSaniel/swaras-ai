'use client';

import { Button } from '@/components/ui/button';
import { getEnabledPersonas } from '@/constants/personas';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const LightLandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Curated selection of featured personas for landing page
  const featuredPersonaIds = [
    'hitesh',
    'saptarshiux',
    'piyush',
    'puneetkumar',
    'samantha',
    'mkbhd',
    'aliabdaal',
    'kunalshah',
  ];

  // Get personas dynamically from personas.js - only featured ones
  const personas = useMemo(() => {
    const allPersonas = getEnabledPersonas();
    return featuredPersonaIds
      .map((id, index) => {
        const persona = allPersonas[id];
        if (!persona || !persona.avatarUrl) return null;
        return {
          id: index + 1,
          name: persona.name,
          image: persona.avatarUrl,
        };
      })
      .filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate how many more personas are available
  const remainingCount = useMemo(() => {
    const allPersonas = getEnabledPersonas();
    const totalCount = Object.values(allPersonas).filter(
      (p: any) => p.enabled,
    ).length;
    return totalCount - featuredPersonaIds.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className='min-h-screen bg-white relative overflow-hidden'>
      {/* Subtle cursor follower */}
      <motion.div
        className='fixed w-96 h-96 rounded-full pointer-events-none z-0 blur-[120px] opacity-30'
        style={{
          background:
            'radial-gradient(circle, rgba(250, 128, 114, 0.3), transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Floating chat bubbles - minimal decoration */}
      <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
        {/* Top left bubble */}
        <motion.div
          className='absolute top-32 left-[10%] w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Top right bubble */}
        <motion.div
          className='absolute top-48 right-[15%] w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200'
          animate={{
            y: [0, 25, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Middle left bubble */}
        <motion.div
          className='absolute top-1/2 left-[5%] w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Bottom right bubble */}
        <motion.div
          className='absolute bottom-32 right-[8%] w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200'
          animate={{
            y: [0, 20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />

        {/* Small accent bubble - top center */}
        <motion.div
          className='absolute top-24 left-1/2 w-8 h-8 rounded-lg bg-[#FA8072]/10 border border-[#FA8072]/20'
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
        />

        {/* Small accent bubble - middle right */}
        <motion.div
          className='absolute top-1/3 right-[25%] w-10 h-10 rounded-xl bg-[#FA8072]/10 border border-[#FA8072]/20'
          animate={{
            y: [0, 18, 0],
            x: [0, -8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        />
      </div>

      {/* Minimal Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Modern logo with icon */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='flex items-center gap-2.5'>
              {/* Refined Logo Icon */}
              <div
                className='relative w-9 h-9 rounded-xl overflow-hidden shadow-md'
                style={{
                  background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
                }}>
                <svg
                  className='w-9 h-9 p-1.5'
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
              </div>
              {/* Refined typography with Raleway font */}
              <div className='flex items-center'>
                <span className='text-lg font-bold tracking-tight text-gray-900 font-[family-name:var(--font-raleway)]'>
                  Swar<span className='font-extrabold text-[#FA8072]'>AI</span>
                </span>
              </div>
            </motion.div>

            <div className='flex items-center gap-3'>
              <Link href='/login'>
                <Button
                  size='lg'
                  variant='default'
                  className='bg-transparent hover:bg-transparent text-sm text-gray-600 hover:text-gray-900'>
                  Sign in
                </Button>
              </Link>
              <Link href='/signup'>
                <Button
                  variant='default'
                  size='lg'
                  className='text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 shadow-sm transition-all'>
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Centered, Minimal */}
      <main className='relative'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col items-center justify-center min-h-screen text-center pt-20'>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className='mb-8'>
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200'>
                <Sparkles className='w-3.5 h-3.5 text-gray-600' />
                <span className='text-xs font-medium text-gray-700'>
                  AI Powered Personas
                </span>
              </div>
            </motion.div>

            {/* Main Heading - Very Large, Light */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className='text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight text-gray-900 mb-6 max-w-5xl'>
              AI expertise.
              <br />
              Personalized{' '}
              <span className='inline-block relative'>
                <span className='relative z-10'>personas.</span>
                <motion.div
                  className='absolute bottom-2 left-0 right-0 h-3 bg-[#FA8072]/20 -z-0'
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className='text-lg md:text-xl text-gray-600 max-w-2xl mb-12 font-light leading-relaxed'>
              Get instant guidance from specialized AI assistants.
              <br />
              Available 24/7, always learning.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className='flex flex-col sm:flex-row items-center gap-4'>
              <Link href='/signup'>
                <Button
                  size='lg'
                  variant='default'
                  className='group bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300'>
                  Start chatting
                  <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
            </motion.div>

            {/* Personas */}
            <div className='flex flex-col items-center justify-center mt-10 w-full'>
              <div className='flex flex-col items-center justify-center gap-3'>
                <div className='flex items-center -space-x-3'>
                  {personas.slice(0, 6).map((persona, index) => (
                    <motion.div
                      key={persona.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      className='group relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-110 hover:z-50 transition-transform cursor-pointer'>
                        <Image
                          src={persona.image}
                          alt={persona.name}
                          width={48}
                          height={48}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      {/* Tooltip */}
                      <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50'>
                        {persona.name}
                        <div className='absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900'></div>
                      </div>
                    </motion.div>
                  ))}
                  {(personas.length > 6 || remainingCount > 0) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + 6 * 0.05 }}
                      className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer'>
                      +{Math.max(0, personas.length - 6) + remainingCount}
                    </motion.div>
                  )}
                </div>
                <div className='text-sm text-gray-600 ml-2'>
                  <span className='font-semibold text-gray-900'>
                    10+ AI Personas
                  </span>
                  <span className='hidden sm:inline'> ready to help you</span>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl'>
              {[
                {
                  title: 'Instant answers',
                  description: 'Get responses in under a second',
                },
                {
                  title: 'Always learning',
                  description: 'Updated with the latest knowledge',
                },
                {
                  title: 'Voice enabled',
                  description: 'Speak naturally or type your questions',
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className='p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {card.title}
                  </h3>
                  <p className='text-sm text-gray-600 font-light leading-relaxed'>
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className='container mx-auto px-6 py-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
              How it works
            </h2>
            <p className='text-lg text-gray-600 font-light max-w-2xl mx-auto'>
              Three simple steps to start learning with AI mentors
            </p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            {[
              {
                number: '01',
                title: 'Choose your mentor',
                description:
                  'Select from 10+ specialized AI mentors across technology, business, health, creativity, and more domains.',
              },
              {
                number: '02',
                title: 'Start conversing',
                description:
                  'Ask questions, brainstorm ideas, or get personalized guidance. Each mentor is trained with deep expertise in their field.',
              },
              {
                number: '03',
                title: 'Achieve your goals',
                description:
                  'Get instant answers, learn new skills, and accelerate your growth with 24/7 AI-powered mentorship.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className='relative'>
                <div className='text-6xl font-light text-gray-200 mb-4'>
                  {step.number}
                </div>
                <h3 className='text-xl font-medium text-gray-900 mb-3'>
                  {step.title}
                </h3>
                <p className='text-sm text-gray-600 font-light leading-relaxed'>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className='bg-gray-50 py-24'>
          <div className='container mx-auto px-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
                Why SwarAI?
              </h2>
              <p className='text-lg text-gray-600 font-light max-w-2xl mx-auto'>
                Everything you need for AI-powered mentorship
              </p>
            </motion.div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto'>
              {[
                {
                  title: 'Multiple AI Mentors',
                  description:
                    '10+ specialized personas covering programming, business strategy, health & wellness, creative arts, and more.',
                },
                {
                  title: 'Real-Time Knowledge',
                  description:
                    'Hybrid web scraping + GPT-4 ensures you get current, accurate information from the latest sources.',
                },
                {
                  title: 'Instant Responses',
                  description:
                    'Sub-second response times with intelligent query routing. No waiting, just learning.',
                },
                // {
                //   title: 'Context Awareness',
                //   description:
                //     'Remembers your conversation history for personalized, continuous guidance tailored to you.',
                // },
                {
                  title: 'Always Available',
                  description:
                    '24/7 access to expert guidance. Get help whenever inspiration strikes or questions arise.',
                },
                // {
                //   title: 'Mobile Optimized',
                //   description:
                //     'Seamless experience across all devices with touch-friendly interface and voice input support.',
                // },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className='px-6 pt-4 pb-2 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition-all duration-300'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-sm text-gray-600 font-light leading-relaxed'>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className='container mx-auto px-6 py-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
              Built for everyone
            </h2>
            <p className='text-lg text-gray-600 font-light max-w-2xl mx-auto'>
              Whether you&apos;re learning, building, or growing
            </p>
          </motion.div>

          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {[
              {
                title: 'For Learners',
                description:
                  'Get instant help with coding problems, understand complex concepts, and accelerate your learning journey with personalized guidance.',
                examples: [
                  'Debug code',
                  'Learn new frameworks',
                  'Understand algorithms',
                  'Career guidance',
                ],
              },
              {
                title: 'For Professionals',
                description:
                  'Enhance productivity, make better decisions, and solve business challenges with expert AI assistance available anytime.',
                examples: [
                  'Business strategy',
                  'Technical architecture',
                  'Problem solving',
                  'Quick research',
                ],
              },
              {
                title: 'For Creatives',
                description:
                  'Brainstorm ideas, get feedback on your work, learn new techniques, and push your creative boundaries with specialized mentors.',
                examples: [
                  'Content ideas',
                  'Design feedback',
                  'Writing help',
                  'Creative direction',
                ],
              },
              {
                title: 'For Everyone',
                description:
                  'From health advice to life coaching, get thoughtful guidance on personal development and daily challenges.',
                examples: [
                  'Wellness tips',
                  'Life advice',
                  'Skill building',
                  'Personal growth',
                ],
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='p-8 rounded-2xl bg-white border border-gray-200'>
                <h3 className='text-xl font-medium text-gray-900 mb-3'>
                  {useCase.title}
                </h3>
                <p className='text-sm text-gray-600 font-light leading-relaxed mb-4'>
                  {useCase.description}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {useCase.examples.map((example, i) => (
                    <span
                      key={i}
                      className='px-3 py-1 text-xs bg-gray-50 text-gray-700 rounded-full border border-gray-200'>
                      {example}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className='bg-gray-50 py-24'>
          <div className='container mx-auto px-6'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='text-center max-w-3xl mx-auto'>
              <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-6'>
                Ready to start learning?
              </h2>
              <p className='text-lg text-gray-600 font-light mb-8 leading-relaxed'>
                Join thousands of learners, professionals, and creators using AI
                mentors to achieve their goals. Start chatting in seconds.
              </p>
              <Link href='/signup'>
                <Button
                  variant='default'
                  size='lg'
                  className='group bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300'>
                  Get started now
                  <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
              <p className='text-xs text-gray-500 mt-4'>
                Instant access • No credit card required
              </p>
            </motion.div>

            {/* Simple stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className='flex items-center justify-center gap-8 mt-16 text-sm text-gray-500'>
              <div className='text-center'>
                <div className='text-2xl font-light text-gray-900 mb-1'>
                  10+
                </div>
                <div className='text-xs uppercase tracking-wide'>Mentors</div>
              </div>
              <div className='w-px h-8 bg-gray-200' />
              <div className='text-center'>
                <div className='text-2xl font-light text-gray-900 mb-1'>
                  24/7
                </div>
                <div className='text-xs uppercase tracking-wide'>Available</div>
              </div>
              <div className='w-px h-8 bg-gray-200' />
              <div className='text-center'>
                <div className='text-2xl font-light text-gray-900 mb-1'>
                  &lt;5s
                </div>
                <div className='text-xs uppercase tracking-wide'>Response</div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className='relative border-t border-gray-100 py-8 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500'>
            <div className='flex items-center gap-2'>
              <span>© 2025 SwarAI</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs'>developed by</span>
              <a
                href='https://sanjeevkujur.dev'
                target='_blank'
                rel='noopener noreferrer'
                className='font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer'>
                Sanjeev Kujur
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LightLandingPage;
