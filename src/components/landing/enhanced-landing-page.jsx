'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Sparkles,
  Users,
  Zap,
  Globe,
  Shield,
  Cpu,
  MessageSquare,
  Target,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Layers,
  Lock,
  Rocket,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personaManager } from '@/constants/config';
import { useRef, useState, useEffect } from 'react';

const EnhancedLandingPage = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(smoothProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0.3]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const allPersonas = personaManager.getAllPersonas({ enabled: true });
  const categories = personaManager.getCategories();

  const features = [
    {
      icon: Users,
      title: 'Multiple AI Mentors',
      description: `${allPersonas.length}+ specialized AI assistants across ${categories.length} expert domains`,
      gradient: 'from-purple-600 via-violet-600 to-fuchsia-600',
      glowColor: 'purple-500/40',
      accentColor: 'purple-400',
      delay: 0,
    },
    {
      icon: Globe,
      title: 'Real-Time Knowledge',
      description: 'Hybrid web scraping + GPT-4o for current, accurate information',
      gradient: 'from-cyan-600 via-teal-600 to-sky-600',
      glowColor: 'cyan-500/40',
      accentColor: 'cyan-400',
      delay: 0.1,
    },
    {
      icon: Zap,
      title: 'Instant Responses',
      description: 'Sub-second answers with intelligent query routing',
      gradient: 'from-amber-600 via-yellow-600 to-orange-500',
      glowColor: 'amber-500/40',
      accentColor: 'amber-400',
      delay: 0.2,
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'End-to-end encryption with complete privacy control',
      gradient: 'from-slate-600 via-gray-500 to-zinc-400',
      glowColor: 'gray-500/40',
      accentColor: 'slate-400',
      delay: 0.3,
    },
    {
      icon: Brain,
      title: 'Context Awareness',
      description: 'Remembers conversations for personalized guidance',
      gradient: 'from-rose-600 via-pink-600 to-fuchsia-500',
      glowColor: 'rose-500/40',
      accentColor: 'rose-400',
      delay: 0.4,
    },
    {
      icon: Cpu,
      title: 'GPT-4o Powered',
      description: 'Latest AI with custom training per persona',
      gradient: 'from-indigo-600 via-blue-600 to-violet-500',
      glowColor: 'indigo-500/40',
      accentColor: 'indigo-400',
      delay: 0.5,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Mentor',
      description: 'Select from specialized AI mentors in technology, business, health, creativity, and more.',
      icon: Target,
    },
    {
      number: '02',
      title: 'Start Conversing',
      description: 'Ask questions, brainstorm ideas, or dive deep into topics with your AI mentor.',
      icon: MessageSquare,
    },
    {
      number: '03',
      title: 'Achieve Goals',
      description: 'Get personalized guidance and actionable insights to accelerate your progress.',
      icon: TrendingUp,
    },
  ];

  const stats = [
    { value: allPersonas.length, label: 'AI Mentors', suffix: '+' },
    { value: categories.length, label: 'Categories', suffix: '' },
    { value: '24/7', label: 'Available', suffix: '' },
    { value: '<1s', label: 'Response', suffix: '' },
  ];

  return (
    <div ref={containerRef} className='min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden'>
      {/* Dynamic Background */}
      <div className='fixed inset-0 z-0'>
        {/* Gradient Mesh with Mouse Tracking */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(161, 161, 170, 0.12), transparent 60%)`,
          }}
          className='absolute inset-0'
        />

        {/* Polymorphic Gradient Orbs with Coral Theme */}
        <motion.div
          style={{ y, opacity }}
          className='absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full blur-[140px]'
          style={{
            background: 'radial-gradient(circle, rgba(250, 128, 114, 0.12), rgba(255, 107, 107, 0.08), rgba(255, 142, 142, 0.04))',
          }}
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 120, 0],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], ['0%', '25%']) }}
          className='absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px]'
          style={{
            background: 'radial-gradient(circle, rgba(255, 154, 139, 0.12), rgba(255, 106, 136, 0.08), rgba(255, 153, 172, 0.04))',
          }}
          animate={{
            scale: [1, 1.35, 1],
            x: [0, -100, 0],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className='absolute bottom-0 left-1/2 w-[500px] h-[500px] rounded-full blur-[140px]'
          style={{
            background: 'radial-gradient(circle, rgba(232, 116, 97, 0.12), rgba(250, 128, 114, 0.08), rgba(255, 159, 142, 0.04))',
          }}
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -60, 0],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle Grid Pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(161,161,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(161,161,170,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]' />

        {/* Noise Texture Overlay */}
        <div className='absolute inset-0 opacity-[0.015] mix-blend-soft-light'
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
             }}
        />
      </div>

      {/* Navigation - Compact & Aesthetic */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/30 bg-black/30 backdrop-blur-xl'
      >
        <div className='container mx-auto px-6 py-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              {/* Custom Logo: Brain + Chat + Human Connection - Coral Theme */}
              <div className='relative w-9 h-9'>
                <div className='absolute inset-0 rounded-xl shadow-lg' style={{ background: 'linear-gradient(135deg, #FA8072, #FF6B6B, #FF8E8E)', boxShadow: '0 10px 25px -5px rgba(250, 128, 114, 0.4)' }}></div>
                <svg className='relative w-9 h-9 p-1.5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  {/* Brain shape (top) */}
                  <path d='M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5'
                        stroke='white' strokeWidth='1.5' strokeLinecap='round' opacity='0.95'/>
                  <path d='M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5'
                        stroke='white' strokeWidth='1.5' strokeLinecap='round' opacity='0.95'/>
                  {/* Chat bubble (center) */}
                  <path d='M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z'
                        stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' opacity='0.95'/>
                  {/* Connection dots */}
                  <circle cx='10' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                  <circle cx='12' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                  <circle cx='14' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                </svg>
              </div>
              <div className='flex items-baseline gap-2'>
                <span className='text-lg font-black tracking-tight' style={{ backgroundImage: 'linear-gradient(to right, #FFFFFF, #FFE5E5, #FFC9C9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Swaras AI
                </span>
                <span className='hidden sm:inline-block text-[9px] font-semibold tracking-widest uppercase' style={{ color: 'rgba(250, 128, 114, 0.7)' }}>Mentors</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <SignInButton mode='modal'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-sm text-slate-400 hover:text-white hover:bg-zinc-800/40 transition-all duration-300 px-4 py-2 cursor-pointer'
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button
                  size='sm'
                  className='text-sm text-white shadow-lg transition-all duration-300 px-5 py-2 cursor-pointer'
                  style={{
                    background: 'linear-gradient(to right, #FA8072, #FF6B6B, #FF8E8E)',
                    boxShadow: '0 10px 25px -5px rgba(250, 128, 114, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #FF9189, #FF7F7F, #FFA3A3)';
                    e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(250, 128, 114, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #FA8072, #FF6B6B, #FF8E8E)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(250, 128, 114, 0.4)';
                  }}
                >
                  Get Started
                  <ArrowRight className='ml-1.5 h-3.5 w-3.5' />
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className='relative pt-24 pb-16 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center space-y-6'>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl'
              style={{
                background: 'linear-gradient(to right, rgba(250, 128, 114, 0.15), rgba(255, 107, 107, 0.15), rgba(255, 142, 142, 0.15))',
                border: '1px solid rgba(250, 128, 114, 0.3)'
              }}
            >
              <div className='w-1.5 h-1.5 rounded-full animate-pulse' style={{ background: 'linear-gradient(to right, #FA8072, #FF8E8E)', boxShadow: '0 0 10px rgba(250, 128, 114, 0.6)' }} />
              <span className='text-xs font-semibold' style={{ backgroundImage: 'linear-gradient(to right, #FFD5D5, #FFC9C9, #FFE0E0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Powered by GPT-4o • Free Forever
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='space-y-4'
            >
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight'>
                <span className='block' style={{ backgroundImage: 'linear-gradient(to right, #FFFFFF, #FFF5F5, #FFE5E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Your Personal
                </span>
                <span className='block mt-1'>
                  <span className='relative inline-block' style={{ backgroundImage: 'linear-gradient(to right, #FA8072, #FF9189, #FFA594)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    AI Mentor
                    <motion.div
                      className='absolute -bottom-1 left-0 right-0 h-1 rounded-full'
                      style={{ background: 'linear-gradient(to right, #FA8072, #FF8E8E, #FFA594)', boxShadow: '0 4px 15px rgba(250, 128, 114, 0.6)' }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    />
                  </span>
                </span>
                <span className='block mt-1' style={{ backgroundImage: 'linear-gradient(to right, #FFE0E0, #FFF0F0, #FFFFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Ecosystem
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='text-base md:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light'
              >
                Access{' '}
                <span className='font-medium' style={{ backgroundImage: 'linear-gradient(to right, #FA8072, #FF9189)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{allPersonas.length}+ specialized AI mentors</span>{' '}
                across{' '}
                <span className='font-medium' style={{ backgroundImage: 'linear-gradient(to right, #FF9189, #FFA594)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{categories.length} expert domains</span>.
                Get personalized guidance tailored to your goals, available 24/7.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='flex flex-col sm:flex-row items-center justify-center gap-3 pt-3'
            >
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='group relative text-white shadow-xl transition-all duration-500 text-base px-8 py-5 rounded-xl overflow-hidden cursor-pointer'
                  style={{
                    background: 'linear-gradient(to right, #FA8072, #FF6B6B, #FF8E8E)',
                    boxShadow: '0 15px 30px -10px rgba(250, 128, 114, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #FF9189, #FF7F7F, #FFA3A3)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(250, 128, 114, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #FA8072, #FF6B6B, #FF8E8E)';
                    e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(250, 128, 114, 0.5)';
                  }}
                >
                  <span className='relative z-10 flex items-center'>
                    Start Your Journey
                    <Rocket className='ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300' />
                  </span>
                </Button>
              </SignUpButton>

              <Button
                size='lg'
                variant='outline'
                className='group border-2 text-slate-300 text-base px-8 py-5 rounded-xl backdrop-blur-xl transition-all duration-300 cursor-pointer hover:bg-zinc-800/40'
                style={{ borderColor: 'rgba(250, 128, 114, 0.3)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(250, 128, 114, 0.5)';
                  e.currentTarget.style.color = '#FA8072';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(250, 128, 114, 0.3)';
                  e.currentTarget.style.color = '';
                }}
              >
                View Mentors
                <ChevronRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-4xl mx-auto'
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className='relative group'
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-slate-600/20 via-zinc-600/20 to-slate-700/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  <div className='relative p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:border-zinc-700/50 transition-all duration-500'>
                    <div className='text-3xl font-black bg-gradient-to-r from-slate-300 via-zinc-200 to-slate-300 bg-clip-text text-transparent mb-1'>
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className='text-[10px] text-zinc-600 font-medium tracking-wider uppercase'>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='relative py-16 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-10'
          >
            <h2 className='text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-zinc-200 bg-clip-text text-transparent mb-3'>
              Why Swaras AI
            </h2>
            <p className='text-base text-zinc-500 max-w-2xl mx-auto font-light'>
              Everything you need for AI-powered mentorship and accelerated learning
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                className='group relative'
              >
                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-25 rounded-3xl blur-2xl transition-opacity duration-500`}
                />

                {/* Card */}
                <div className='relative h-full p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all duration-500'>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-xl shadow-${feature.glowColor} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feature.icon className='w-6 h-6 text-white' />
                  </div>

                  {/* Content */}
                  <h3 className='text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-300 group-hover:to-zinc-400 transition-all duration-300'>
                    {feature.title}
                  </h3>
                  <p className='text-sm text-zinc-500 leading-relaxed font-light'>
                    {feature.description}
                  </p>

                  {/* Arrow Indicator */}
                  <div className='mt-4 flex items-center text-xs font-semibold text-zinc-600 group-hover:text-slate-400 transition-colors duration-300'>
                    <span>Learn more</span>
                    <ChevronRight className='ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300' />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='relative py-20 px-6 bg-gradient-to-b from-transparent via-slate-950/50 to-transparent'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-zinc-200 bg-clip-text text-transparent mb-3'>
              How It Works
            </h2>
            <p className='text-base text-zinc-500 font-light'>
              Get started in three simple steps
            </p>
          </motion.div>

          <div className='relative'>
            {/* Connection Line */}
            <div className='hidden lg:block absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent' />

            <div className='grid md:grid-cols-3 gap-6 relative'>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className='relative'
                >
                  {/* Step Number Badge */}
                  <div className='flex justify-center mb-5'>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className='relative w-14 h-14 rounded-xl bg-gradient-to-br from-slate-500 via-zinc-600 to-slate-700 flex items-center justify-center shadow-xl shadow-slate-700/60'
                    >
                      <span className='text-2xl font-black text-white'>{step.number}</span>
                      <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent' />
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className='p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all duration-500'
                  >
                    <step.icon className='w-10 h-10 text-slate-400 mb-4' />
                    <h3 className='text-lg font-bold text-white mb-2'>{step.title}</h3>
                    <p className='text-sm text-zinc-500 leading-relaxed font-light'>{step.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className='relative py-20 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-zinc-800/30 via-slate-800/30 to-zinc-800/30 border border-zinc-700/40 backdrop-blur-2xl overflow-hidden'
          >
            {/* Decorative Elements */}
            <div className='absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-slate-600/20 to-transparent rounded-full blur-[100px]' />
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tl from-zinc-600/20 to-transparent rounded-full blur-[100px]' />

            <div className='relative z-10 grid md:grid-cols-3 gap-6'>
              {[
                {
                  icon: Lock,
                  title: 'Private & Secure',
                  description: 'Your conversations are encrypted and never shared',
                  gradient: 'from-slate-500 to-zinc-600',
                },
                {
                  icon: Star,
                  title: 'Expert Quality',
                  description: 'Each mentor is trained with specialized knowledge',
                  gradient: 'from-zinc-500 to-slate-600',
                },
                {
                  icon: Layers,
                  title: 'Always Improving',
                  description: 'Continuous updates with latest AI advancements',
                  gradient: 'from-slate-600 to-zinc-700',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className='text-center'
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg shadow-slate-700/40 mb-4`}>
                    <item.icon className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-base font-bold text-white mb-2'>{item.title}</h3>
                  <p className='text-sm text-zinc-500 font-light leading-relaxed'>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='relative py-20 px-6'>
        <div className='container mx-auto max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative p-10 md:p-12 rounded-2xl bg-gradient-to-br from-zinc-800/40 via-slate-800/40 to-zinc-900/40 border border-zinc-700/50 backdrop-blur-2xl overflow-hidden text-center'
          >
            {/* Animated Background */}
            <motion.div
              className='absolute inset-0'
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(161, 161, 170, 0.08), transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className='relative z-10 space-y-5'>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className='inline-block'
              >
                <Sparkles className='w-14 h-14 text-slate-400' />
              </motion.div>

              <h2 className='text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-zinc-200 bg-clip-text text-transparent leading-tight'>
                Ready to Accelerate
                <br />
                Your Learning Journey?
              </h2>

              <p className='text-base text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed'>
                Join thousands of learners achieving their goals with AI mentorship.
                Start your free journey today—no credit card required.
              </p>

              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='cursor-pointer group bg-gradient-to-r from-slate-500 via-zinc-600 to-slate-700 hover:from-slate-400 hover:via-zinc-500 hover:to-slate-600 text-white shadow-xl shadow-slate-700/50 hover:shadow-slate-600/70 transition-all duration-500 text-base px-10 py-6 rounded-xl mt-3'
                >
                  Get Started for Free
                  <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </Button>
              </SignUpButton>

              <div className='flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600 pt-4'>
                {['No credit card', 'Free forever', 'Cancel anytime'].map((text, index) => (
                  <div key={index} className='flex items-center gap-1.5'>
                    <CheckCircle className='w-4 h-4 text-slate-500' />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Simple & Small with Coral Theme */}
      <footer className='relative border-t bg-black/40 backdrop-blur-xl py-8 px-6' style={{ borderColor: 'rgba(250, 128, 114, 0.15)' }}>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            {/* Brand */}
            <div className='flex items-center gap-2'>
              {/* Custom Logo */}
              <div className='relative w-7 h-7'>
                <div className='absolute inset-0 rounded-lg shadow-md' style={{ background: 'linear-gradient(135deg, #FA8072, #FF6B6B, #FF8E8E)', boxShadow: '0 8px 20px -5px rgba(250, 128, 114, 0.3)' }}></div>
                <svg className='relative w-7 h-7 p-1' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5'
                        stroke='white' strokeWidth='1.5' strokeLinecap='round' opacity='0.95'/>
                  <path d='M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5'
                        stroke='white' strokeWidth='1.5' strokeLinecap='round' opacity='0.95'/>
                  <path d='M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z'
                        stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' opacity='0.95'/>
                  <circle cx='10' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                  <circle cx='12' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                  <circle cx='14' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                </svg>
              </div>
              <div>
                <span className='text-base font-black tracking-tight' style={{ backgroundImage: 'linear-gradient(to right, #FFFFFF, #FFE5E5, #FFC9C9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Swaras AI
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className='flex items-center gap-6 text-xs'>
              {['Features', 'Mentors', 'Privacy', 'Terms'].map((item) => (
                <a key={item} href='#' className='text-zinc-600 font-light cursor-pointer transition-colors duration-300' style={{ color: '#71717a' }}
                   onMouseEnter={(e) => e.currentTarget.style.color = '#FA8072'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
                  {item}
                </a>
              ))}
            </div>

            {/* Copyright & Social */}
            <div className='flex items-center gap-4'>
              <p className='text-zinc-700 text-xs font-light'>
                © 2025 Swaras AI
              </p>
              <div className='flex items-center gap-3'>
                <a href='#' className='text-zinc-700 cursor-pointer transition-colors duration-300'
                   onMouseEnter={(e) => e.currentTarget.style.color = '#FA8072'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#3f3f46'}>
                  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                  </svg>
                </a>
                <a href='#' className='text-zinc-700 cursor-pointer transition-colors duration-300'
                   onMouseEnter={(e) => e.currentTarget.style.color = '#FA8072'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#3f3f46'}>
                  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                    <path fillRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' clipRule='evenodd' />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;
