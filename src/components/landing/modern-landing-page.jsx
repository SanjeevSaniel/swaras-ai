'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Check,
  Code2,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
  BookOpen,
  Target,
  Award,
  Globe,
  Shield,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personaManager } from '@/constants/config';

const ModernLandingPage = () => {
  const allPersonas = personaManager.getAllPersonas({ enabled: true });
  const categories = personaManager.getCategories();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Mentorship',
      description:
        'Get personalized guidance from diverse AI mentors across multiple domains and expertise areas.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Multiple Persona Types',
      description:
        'Choose from coding mentors, life coaches, business advisors, and more specialized AI assistants.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Responses',
      description:
        'Get immediate answers with our optimized fast-path system and intelligent caching.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Globe,
      title: 'Real-Time Knowledge',
      description:
        'Access current information through our hybrid system combining web scraping and AI knowledge.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Your conversations are secure with enterprise-grade encryption and privacy protection.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: Cpu,
      title: 'Advanced AI',
      description:
        'Powered by GPT-4o with custom training and personality modeling for authentic interactions.',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const stats = [
    { label: 'AI Personas', value: allPersonas.length.toString(), icon: Users },
    { label: 'Categories', value: categories.length.toString(), icon: Target },
    { label: 'Availability', value: '24/7', icon: Zap },
    { label: 'Response Time', value: '<1s', icon: Rocket },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Full Stack Developer',
      content:
        'Swaras AI helped me learn React in half the time. The personalized mentorship is incredible!',
      avatar: '👩‍💻',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Startup Founder',
      content:
        'The business mentor persona gave me insights that would have cost thousands in consulting fees.',
      avatar: '👨‍💼',
      rating: 5,
    },
    {
      name: 'Priya Patel',
      role: 'Product Manager',
      content:
        'Available 24/7, instant responses, and genuinely helpful advice. This is the future of learning!',
      avatar: '👩‍🎓',
      rating: 5,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden'>
      {/* Animated Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent'></div>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent'></div>
        <div className='absolute top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex items-center space-x-3'
            >
              <div className='relative w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50'>
                <Sparkles className='w-5 h-5 text-white' />
                <div className='absolute inset-0 bg-white/20 rounded-2xl blur-xl'></div>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent'>
                Swaras AI
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex items-center space-x-4'
            >
              <SignInButton mode='modal'>
                <Button
                  variant='ghost'
                  className='text-slate-300 hover:text-white hover:bg-white/5'
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50'>
                  Get Started
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </SignUpButton>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative pt-32 pb-20 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center space-y-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'
            >
              <Sparkles className='w-4 h-4 text-purple-400' />
              <span className='text-sm text-purple-300'>Powered by GPT-4o</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-5xl md:text-7xl font-bold leading-tight'
            >
              <span className='bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent'>
                Your Personal AI
              </span>
              <br />
              <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent'>
                Mentor Ecosystem
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-xl text-slate-400 max-w-3xl mx-auto'
            >
              Learn from diverse AI personas - from coding mentors and life coaches to business
              advisors. Get instant, personalized guidance 24/7 across any domain.
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
                  className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 text-lg px-8 py-6'
                >
                  Start Learning Free
                  <Rocket className='ml-2 h-5 w-5' />
                </Button>
              </SignUpButton>
              <Button
                size='lg'
                variant='outline'
                className='border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 text-lg px-8 py-6'
              >
                Explore Personas
                <Users className='ml-2 h-5 w-5' />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto'
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group'
                >
                  <stat.icon className='w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform' />
                  <div className='text-3xl font-bold text-white mb-1'>{stat.value}</div>
                  <div className='text-sm text-slate-400'>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='relative py-20 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-4xl md:text-5xl font-bold text-white mb-4'
            >
              Powerful Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-lg text-slate-400'
            >
              Everything you need for personalized AI mentorship
            </motion.p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105'
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className='w-7 h-7 text-white' />
                </div>
                <h3 className='text-xl font-semibold text-white mb-3'>{feature.title}</h3>
                <p className='text-slate-400 leading-relaxed'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='relative py-20 px-6 bg-gradient-to-b from-transparent to-slate-950/50'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-4xl md:text-5xl font-bold text-white mb-4'
            >
              Loved by Learners
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-lg text-slate-400'
            >
              See what our users are saying
            </motion.p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300'
              >
                <div className='flex items-center mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className='w-5 h-5 text-yellow-400 fill-yellow-400' />
                  ))}
                </div>
                <p className='text-slate-300 mb-6 leading-relaxed'>{testimonial.content}</p>
                <div className='flex items-center'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl mr-4'>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className='text-white font-semibold'>{testimonial.name}</div>
                    <div className='text-slate-400 text-sm'>{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative py-20 px-6'>
        <div className='container mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10'></div>
            <div className='relative z-10 text-center space-y-6'>
              <h2 className='text-4xl md:text-5xl font-bold text-white'>
                Ready to Start Learning?
              </h2>
              <p className='text-xl text-slate-300 max-w-2xl mx-auto'>
                Join thousands of learners getting personalized AI mentorship across multiple
                domains.
              </p>
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 text-lg px-10 py-6'
                >
                  Get Started for Free
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </SignUpButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl py-12 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-3 mb-4 md:mb-0'>
              <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center'>
                <Sparkles className='w-5 h-5 text-white' />
              </div>
              <span className='text-lg font-bold text-white'>Swaras AI</span>
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

export default ModernLandingPage;
