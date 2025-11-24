'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const LightLandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
          background: 'radial-gradient(circle, rgba(250, 128, 114, 0.3), transparent 70%)',
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
        className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100'
      >
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Elegant minimalist logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='flex items-center gap-1'
            >
              {/* Elegant S icon with wave pattern */}
              {/* <div className='relative w-5 h-5 flex items-center'>
                <svg viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'> */}
                  {/* Elegant S curve */}
                  {/* <path
                    d='M20 8C20 8 17 6 14 6C11 6 8 8 8 11C8 14 11 16 14 16C17 16 20 18 20 21C20 24 17 26 14 26C11 26 8 24 8 24'
                    stroke='url(#gradient1)'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  /> */}
                  {/* Top arc accent */}
                  {/* <path
                    d='M14 2C14 2 18 2 21 5'
                    stroke='#4285F4'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    opacity='0.6'
                  /> */}
                  {/* Bottom arc accent */}
                  {/* <path
                    d='M14 30C14 30 10 30 7 27'
                    stroke='#EA4335'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    opacity='0.6'
                  /> */}
                  {/* <defs>
                    <linearGradient id='gradient1' x1='8' y1='6' x2='20' y2='26' gradientUnits='userSpaceOnUse'>
                      <stop offset='0%' stopColor='#4285F4' />
                      <stop offset='50%' stopColor='#34A853' />
                      <stop offset='100%' stopColor='#EA4335' />
                    </linearGradient>
                  </defs> */}
                {/* </svg>
              </div> */}
              {/* Refined typography */}
              <div className='flex items-center'>
                <span className='text-lg font-medium tracking-tight text-gray-900'>
                  Swaras
                </span>
                <span className='text-lg font-light tracking-tight text-gray-400 ml-1'>
                  AI
                </span>
              </div>
            </motion.div>

            <div className='flex items-center gap-3'>
              <SignInButton mode='modal'>
                <Button
                  variant='ghost'
                  className='text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors'
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button
                  className='text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 shadow-sm transition-all'
                >
                  Get started
                </Button>
              </SignUpButton>
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
              className='mb-8'
            >
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200'>
                <Sparkles className='w-3.5 h-3.5 text-gray-600' />
                <span className='text-xs font-medium text-gray-700'>
                  Powered by GPT-4o
                </span>
              </div>
            </motion.div>

            {/* Main Heading - Very Large, Light */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className='text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight text-gray-900 mb-6 max-w-5xl'
            >
              Your AI mentor
              <br />
              for{' '}
              <span className='inline-block relative'>
                <span className='relative z-10'>everything</span>
                <motion.div
                  className='absolute bottom-2 left-0 right-0 h-3 bg-[#FA8072]/20 -z-0'
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className='text-lg md:text-xl text-gray-600 max-w-2xl mb-12 font-light leading-relaxed'
            >
              Get instant guidance from specialized AI assistants.
              <br />
              Available 24/7, always learning.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className='flex flex-col sm:flex-row items-center gap-4'
            >
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='group bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  Start chatting
                  <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </Button>
              </SignUpButton>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl'
            >
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
                  title: 'Completely private',
                  description: 'Your conversations stay yours',
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className='p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300'
                >
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
            className='text-center mb-16'
          >
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
                description: 'Select from 50+ specialized AI mentors across technology, business, health, creativity, and more domains.',
              },
              {
                number: '02',
                title: 'Start conversing',
                description: 'Ask questions, brainstorm ideas, or get personalized guidance. Each mentor is trained with deep expertise in their field.',
              },
              {
                number: '03',
                title: 'Achieve your goals',
                description: 'Get instant answers, learn new skills, and accelerate your growth with 24/7 AI-powered mentorship.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className='relative'
              >
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
              className='text-center mb-16'
            >
              <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
                Why Swaras AI?
              </h2>
              <p className='text-lg text-gray-600 font-light max-w-2xl mx-auto'>
                Everything you need for AI-powered mentorship
              </p>
            </motion.div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
              {[
                {
                  title: 'Multiple AI Mentors',
                  description: '50+ specialized assistants covering programming, business strategy, health & wellness, creative arts, and more.',
                },
                {
                  title: 'Real-Time Knowledge',
                  description: 'Hybrid web scraping + GPT-4 ensures you get current, accurate information from the latest sources.',
                },
                {
                  title: 'Instant Responses',
                  description: 'Sub-second response times with intelligent query routing. No waiting, just learning.',
                },
                {
                  title: 'Context Awareness',
                  description: 'Remembers your conversation history for personalized, continuous guidance tailored to you.',
                },
                {
                  title: 'Always Available',
                  description: '24/7 access to expert guidance. Get help whenever inspiration strikes or questions arise.',
                },
                {
                  title: 'Secure & Private',
                  description: 'Your conversations are encrypted and protected. We never share your data with third parties.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className='p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition-all duration-300'
                >
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
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
              Built for everyone
            </h2>
            <p className='text-lg text-gray-600 font-light max-w-2xl mx-auto'>
              Whether you're learning, building, or growing
            </p>
          </motion.div>

          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {[
              {
                title: 'For Learners',
                description: 'Get instant help with coding problems, understand complex concepts, and accelerate your learning journey with personalized guidance.',
                examples: ['Debug code', 'Learn new frameworks', 'Understand algorithms', 'Career guidance'],
              },
              {
                title: 'For Professionals',
                description: 'Enhance productivity, make better decisions, and solve business challenges with expert AI assistance available anytime.',
                examples: ['Business strategy', 'Technical architecture', 'Problem solving', 'Quick research'],
              },
              {
                title: 'For Creatives',
                description: 'Brainstorm ideas, get feedback on your work, learn new techniques, and push your creative boundaries with specialized mentors.',
                examples: ['Content ideas', 'Design feedback', 'Writing help', 'Creative direction'],
              },
              {
                title: 'For Everyone',
                description: 'From health advice to life coaching, get thoughtful guidance on personal development and daily challenges.',
                examples: ['Wellness tips', 'Life advice', 'Skill building', 'Personal growth'],
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='p-8 rounded-2xl bg-white border border-gray-200'
              >
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
                      className='px-3 py-1 text-xs bg-gray-50 text-gray-700 rounded-full border border-gray-200'
                    >
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
              className='text-center max-w-3xl mx-auto'
            >
              <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-6'>
                Ready to start learning?
              </h2>
              <p className='text-lg text-gray-600 font-light mb-8 leading-relaxed'>
                Join thousands of learners, professionals, and creators using AI mentors to achieve their goals. Start chatting in seconds.
              </p>
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='group bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  Get started now
                  <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </Button>
              </SignUpButton>
              <p className='text-xs text-gray-500 mt-4'>
                Instant access • No credit card required
              </p>
            </motion.div>

            {/* Simple stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className='flex items-center justify-center gap-8 mt-16 text-sm text-gray-500'
            >
              <div className='text-center'>
                <div className='text-2xl font-light text-gray-900 mb-1'>50+</div>
                <div className='text-xs uppercase tracking-wide'>Mentors</div>
              </div>
              <div className='w-px h-8 bg-gray-200' />
              <div className='text-center'>
                <div className='text-2xl font-light text-gray-900 mb-1'>24/7</div>
                <div className='text-xs uppercase tracking-wide'>Available</div>
              </div>
              <div className='w-px h-8 bg-gray-200' />
              <div className='text-center'>
                <div className='text-2xl font-light text-gray-900 mb-1'>&lt;1s</div>
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
              {/* Simplified S icon for footer */}
              {/* <svg width='14' height='14' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M20 8C20 8 17 6 14 6C11 6 8 8 8 11C8 14 11 16 14 16C17 16 20 18 20 21C20 24 17 26 14 26C11 26 8 24 8 24'
                  stroke='url(#footerGradient)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <defs>
                  <linearGradient id='footerGradient' x1='8' y1='6' x2='20' y2='26' gradientUnits='userSpaceOnUse'>
                    <stop offset='0%' stopColor='#4285F4' />
                    <stop offset='100%' stopColor='#EA4335' />
                  </linearGradient>
                </defs>
              </svg> */}
              <span>© 2025 Swaras AI</span>
            </div>
            <div className='flex items-center gap-6'>
              <a href='#' className='hover:text-gray-900 transition-colors'>
                About
              </a>
              <a href='#' className='hover:text-gray-900 transition-colors'>
                Privacy
              </a>
              <a href='#' className='hover:text-gray-900 transition-colors'>
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LightLandingPage;
