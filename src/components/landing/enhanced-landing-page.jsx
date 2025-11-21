'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Code2,
  Sparkles,
  Star,
  Users,
  Zap,
  Globe,
  Shield,
  Cpu,
  MessageSquare,
  Target,
  Rocket,
  TrendingUp,
  CheckCircle,
  Play,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personaManager } from '@/constants/config';
import { useRef, useState } from 'react';

const EnhancedLandingPage = () => {
  const containerRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const allPersonas = personaManager.getAllPersonas({ enabled: true });
  const categories = personaManager.getCategories();

  const bentoFeatures = [
    {
      title: 'Multiple AI Personas',
      description: `Choose from ${allPersonas.length}+ specialized AI assistants across ${categories.length} different categories.`,
      expandedContent: `Access a diverse ecosystem of AI mentors tailored to your needs. From coding experts and business strategists to health coaches and creative consultants - each persona brings unique expertise and authentic communication style. Explore ${categories.length} specialized categories including Technology, Business, Health & Fitness, Creative Arts, and Personal Development.`,
      benefits: ['Specialized expertise in multiple domains', 'Authentic personality & communication style', 'Context-aware responses', 'Category-based organization'],
      icon: Users,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      accentColor: 'purple',
      size: 'large',
      animation: 'pulse',
    },
    {
      title: 'Real-Time Knowledge',
      description: 'Hybrid system combining web scraping with GPT-4o for up-to-date information.',
      expandedContent: 'Our intelligent hybrid system merges the power of real-time web scraping with GPT-4o\'s advanced reasoning. Get current information from trusted sources, synthesized with AI insights for comprehensive, accurate answers that reflect the latest developments in any field.',
      benefits: ['Live data from trusted sources', 'GPT-4o powered synthesis', 'Fact-checked responses', 'Always up-to-date information'],
      icon: Globe,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      accentColor: 'blue',
      size: 'medium',
      animation: 'float',
    },
    {
      title: 'Instant Responses',
      description: 'Get answers in under 1 second with our optimized fast-path system.',
      expandedContent: 'Experience lightning-fast interactions with our optimized response engine. Simple queries get instant answers while complex questions receive thoughtful, well-researched responses. Smart caching and efficient routing ensure you never wait unnecessarily.',
      benefits: ['Sub-second simple queries', 'Smart query routing', 'Intelligent caching', 'Optimized performance'],
      icon: Zap,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      accentColor: 'amber',
      size: 'medium',
      animation: 'glow',
    },
    {
      title: 'Secure & Private',
      description: 'Enterprise-grade encryption keeps your conversations completely private.',
      expandedContent: 'Your privacy is paramount. All conversations are encrypted end-to-end with enterprise-grade security. We never sell your data, and you maintain full control over your conversation history with options to export or delete at any time.',
      benefits: ['End-to-end encryption', 'No data selling', 'GDPR compliant', 'Full data control'],
      icon: Shield,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      accentColor: 'emerald',
      size: 'small',
      animation: 'shake',
    },
    {
      title: 'Smart Context',
      description: 'AI remembers your conversation history for better, personalized responses.',
      expandedContent: 'Our AI maintains contextual awareness across your entire conversation history. It learns your preferences, remembers previous discussions, and builds upon past interactions to provide increasingly personalized and relevant guidance over time.',
      benefits: ['Conversation memory', 'Personalized learning', 'Context continuity', 'Progressive improvement'],
      icon: Brain,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      accentColor: 'indigo',
      size: 'small',
      animation: 'rotate',
    },
    {
      title: 'Powered by GPT-4o',
      description: 'Latest OpenAI technology with custom training for each persona.',
      expandedContent: 'Built on OpenAI\'s most advanced GPT-4o model, enhanced with custom training and fine-tuning for each persona. This ensures authentic communication styles, domain expertise, and nuanced understanding that goes beyond generic AI responses.',
      benefits: ['GPT-4o architecture', 'Custom persona training', 'Advanced reasoning', 'Natural conversations'],
      icon: Cpu,
      gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
      accentColor: 'violet',
      size: 'small',
      animation: 'pulse',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Choose Your Persona',
      description: 'Select from coding mentors, life coaches, business advisors, and more.',
      icon: Target,
    },
    {
      step: '2',
      title: 'Start Conversing',
      description: 'Ask questions, get advice, or have a meaningful discussion.',
      icon: MessageSquare,
    },
    {
      step: '3',
      title: 'Learn & Grow',
      description: 'Get personalized guidance tailored to your needs and goals.',
      icon: TrendingUp,
    },
  ];

  const stats = [
    { value: allPersonas.length.toString(), label: 'AI Personas', suffix: '+' },
    { value: categories.length.toString(), label: 'Categories', suffix: '' },
    { value: '24/7', label: 'Available', suffix: '' },
    { value: '<1s', label: 'Response Time', suffix: '' },
  ];

  return (
    <div ref={containerRef} className='min-h-screen bg-slate-950 overflow-hidden'>
      {/* Animated Background */}
      <div className='fixed inset-0 z-0'>
        {/* Gradient Orbs */}
        <motion.div
          style={{ y, opacity }}
          className='absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]'
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '30%']) }}
          className='absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-[128px]'
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px]'
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid Pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]' />
      </div>

      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex items-center gap-3'
            >
              <div className='relative'>
                <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50'>
                  <Sparkles className='w-5 h-5 text-white' />
                </div>
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 blur-xl opacity-50 animate-pulse' />
              </div>
              <div>
                <span className='text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent'>
                  Swaras AI
                </span>
                <p className='text-xs text-slate-400'>AI Mentor Ecosystem</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex items-center gap-4'
            >
              <SignInButton mode='modal'>
                <Button variant='ghost' className='text-slate-300 hover:text-white hover:bg-white/5'>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300'>
                  Get Started Free
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </SignUpButton>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative pt-32 pb-20 px-6'>
        <div className='container mx-auto max-w-7xl'>
          <div className='text-center space-y-8 mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm'
            >
              <Sparkles className='w-4 h-4 text-purple-400 animate-pulse' />
              <span className='text-sm font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent'>
                Powered by GPT-4o • 100% Free Forever
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight'
            >
              <span className='bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent'>
                Your Personal
              </span>
              <br />
              <span className='relative inline-block'>
                <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent'>
                  AI Mentor
                </span>
                <motion.div
                  className='absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full'
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
              <br />
              <span className='bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent'>
                Ecosystem
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed'
            >
              Choose from <span className='text-purple-400 font-semibold'>{allPersonas.length}+ AI personas</span> across{' '}
              <span className='text-pink-400 font-semibold'>{categories.length} categories</span>. Get instant, personalized guidance
              from coding mentors, life coaches, business advisors, and more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='flex flex-col sm:flex-row items-center justify-center gap-4'
            >
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 text-lg px-10 py-7 rounded-2xl'
                >
                  Start Your Journey
                  <Rocket className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </Button>
              </SignUpButton>
              <Button
                size='lg'
                variant='outline'
                className='border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 text-lg px-10 py-7 rounded-2xl backdrop-blur-sm'
              >
                <Play className='mr-2 h-5 w-5' />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto'
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className='relative group'
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300' />
                  <div className='relative p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300'>
                    <div className='text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2'>
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className='text-sm text-slate-400'>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className='relative py-20 px-6'>
        <div className='container mx-auto max-w-7xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'
          >
            <h2 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4'>
              Powerful Features
            </h2>
            <p className='text-xl text-slate-400 max-w-2xl mx-auto'>
              Everything you need for personalized AI mentorship in one platform
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]'>
            {bentoFeatures.map((feature, index) => {
              const sizeClasses = {
                large: 'md:col-span-2 md:row-span-2',
                medium: 'md:col-span-2 md:row-span-1',
                small: 'md:col-span-1 md:row-span-1',
              };

              const isExpanded = expandedCard === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: isExpanded ? 1 : 1.02, y: isExpanded ? 0 : -4 }}
                  className={`group relative ${sizeClasses[feature.size]} rounded-3xl overflow-hidden cursor-pointer`}
                  onClick={() => setExpandedCard(isExpanded ? null : index)}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 ${isExpanded ? 'opacity-30' : ''} transition-opacity duration-500`} />

                  {/* Animated border glow */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-xl ${isExpanded ? 'opacity-40' : 'group-hover:opacity-20'}`}
                    animate={isExpanded ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Content */}
                  <div className={`relative h-full p-8 rounded-3xl bg-slate-900/90 border backdrop-blur-md transition-all duration-500 flex flex-col justify-between ${isExpanded ? 'border-white/30 shadow-2xl' : 'border-white/10 group-hover:border-white/20'}`}>
                    <div className='flex-1'>
                      <div className='flex items-start justify-between mb-6'>
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl`}
                          whileHover={{ rotate: isExpanded ? 0 : 5, scale: isExpanded ? 1 : 1.1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <feature.icon className='w-8 h-8 text-white' />
                        </motion.div>

                        {isExpanded && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors'
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(null);
                            }}
                          >
                            <X className='w-4 h-4 text-white' />
                          </motion.button>
                        )}
                      </div>

                      <h3 className='text-2xl md:text-3xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300'>
                        {feature.title}
                      </h3>

                      <AnimatePresence mode='wait'>
                        {!isExpanded ? (
                          <motion.p
                            key='description'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors duration-300'
                          >
                            {feature.description}
                          </motion.p>
                        ) : (
                          <motion.div
                            key='expanded'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className='space-y-6'
                          >
                            <p className='text-slate-300 text-base leading-relaxed'>
                              {feature.expandedContent}
                            </p>

                            <div className='space-y-3'>
                              <h4 className={`text-sm font-semibold text-${feature.accentColor}-400 uppercase tracking-wider`}>
                                Key Benefits
                              </h4>
                              <ul className='space-y-2'>
                                {feature.benefits.map((benefit, idx) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className='flex items-start gap-3 text-slate-400 text-sm'
                                  >
                                    <CheckCircle className={`w-5 h-5 text-${feature.accentColor}-500 flex-shrink-0 mt-0.5`} />
                                    <span>{benefit}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className={`flex items-center font-medium mt-4 ${isExpanded ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}
                    >
                      {isExpanded ? 'Click to collapse' : 'Click to learn more'}
                      <ChevronRight className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
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
            className='text-center mb-16'
          >
            <h2 className='text-5xl font-bold text-white mb-4'>How It Works</h2>
            <p className='text-xl text-slate-400'>Get started in three simple steps</p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8'>
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className='relative group'
              >
                {/* Connecting Line */}
                {index < howItWorks.length - 1 && (
                  <div className='hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0' />
                )}

                <div className='relative z-10'>
                  {/* Step Number */}
                  <div className='mb-6'>
                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300'>
                      {step.step}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className='p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-sm group-hover:bg-slate-900/80 group-hover:border-purple-500/30 transition-all duration-300'>
                    <step.icon className='w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300' />
                    <h3 className='text-2xl font-bold text-white mb-3'>{step.title}</h3>
                    <p className='text-slate-400 leading-relaxed'>{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative py-32 px-6'>
        <div className='container mx-auto max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative p-16 rounded-[3rem] bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 border border-purple-500/20 backdrop-blur-xl overflow-hidden'
          >
            {/* Animated Background Elements */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_50%)]' />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.1),transparent_50%)]' />

            <div className='relative z-10 text-center space-y-8'>
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className='inline-block'
              >
                <Sparkles className='w-16 h-16 text-purple-400' />
              </motion.div>

              <h2 className='text-5xl md:text-6xl font-bold text-white'>
                Ready to Transform
                <br />
                Your Learning Journey?
              </h2>

              <p className='text-xl text-slate-300 max-w-2xl mx-auto'>
                Join thousands of learners getting personalized AI mentorship. Start for free, no credit card required.
              </p>

              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 text-xl px-12 py-8 rounded-2xl'
                >
                  Get Started for Free
                  <ArrowRight className='ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform' />
                </Button>
              </SignUpButton>

              <div className='flex items-center justify-center gap-8 text-sm text-slate-400'>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-green-400' />
                  <span>No credit card required</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-green-400' />
                  <span>Free forever</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-green-400' />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative border-t border-white/5 bg-slate-950/80 backdrop-blur-2xl py-12 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center'>
                <Sparkles className='w-5 h-5 text-white' />
              </div>
              <div>
                <span className='text-lg font-bold text-white'>Swaras AI</span>
                <p className='text-xs text-slate-400'>AI Mentor Ecosystem</p>
              </div>
            </div>

            <div className='flex items-center gap-6 text-sm text-slate-400'>
              <a href='#' className='hover:text-white transition-colors'>Privacy</a>
              <a href='#' className='hover:text-white transition-colors'>Terms</a>
              <a href='#' className='hover:text-white transition-colors'>Contact</a>
            </div>

            <div className='text-slate-400 text-sm'>
              © 2025 Swaras AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;
