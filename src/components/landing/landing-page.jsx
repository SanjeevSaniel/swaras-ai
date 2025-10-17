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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Mentorship',
      description:
        'Get personalized guidance from AI mentors trained on expertise from industry leaders.',
    },
    {
      icon: Code2,
      title: 'Interactive Learning',
      description:
        'Learn by doing with real-time code assistance and project-based learning.',
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description:
        'Learn from personas modeled after renowned educators and developers.',
    },
    {
      icon: Lightbulb,
      title: 'Instant Answers',
      description:
        'Get instant help with coding questions, debugging, and best practices.',
    },
    {
      icon: Rocket,
      title: 'Career Growth',
      description:
        'Accelerate your development career with industry-relevant skills.',
    },
    {
      icon: MessageCircle,
      title: '24/7 Availability',
      description:
        'Access your AI mentors anytime, anywhere. No scheduling required.',
    },
  ];

  const mentors = [
    {
      name: 'Hitesh Choudhary',
      role: 'Full Stack Expert',
      icon: GraduationCap,
      specialty: 'JavaScript, React, Node.js, Full-Stack Development',
    },
    {
      name: 'Piyush Garg',
      role: 'DevOps & Backend Specialist',
      icon: Code2,
      specialty: 'System Design, DevOps, Cloud Architecture, Scalability',
    },
  ];

  const stats = [
    { label: 'AI Mentors', value: '2', icon: Users },
    { label: 'Available', value: '24/7', icon: Zap },
    { label: 'Response Time', value: 'Instant', icon: Target },
    { label: 'Languages', value: 'Multiple', icon: MessageCircle },
  ];


  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='relative w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30'>
                <Sparkles className='w-5 h-5 text-white' />
                <div className='absolute inset-0 bg-white/20 rounded-2xl blur-xl'></div>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent'>
                Swaras AI
              </span>
            </div>

            <div className='flex items-center gap-3'>
              <SignInButton mode='modal'>
                <Button
                  variant='ghost'
                  className='text-slate-300 hover:text-white hover:bg-white/5 transition-colors'>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50'>
                  Get Started
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-6 relative overflow-hidden'>
        {/* Animated background elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        <div className='container mx-auto max-w-6xl relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm'>
              <Zap className='w-4 h-4 text-emerald-400' />
              <span className='text-sm font-medium text-emerald-300'>
                AI-Powered Learning Platform
              </span>
            </motion.div>

            <h1 className='text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white'>
              Learn to Code with{' '}
              <span className='bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent'>
                AI Mentors
              </span>
            </h1>

            <p className='text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Master programming with personalized AI mentorship from industry
              experts. Get instant help, build real projects, and accelerate
              your development career.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-12'>
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl shadow-emerald-500/30 px-8 py-6 text-lg transition-all hover:shadow-emerald-500/50 hover:scale-105'>
                  Start Learning Free
                  <ArrowRight className='w-5 h-5 ml-2' />
                </Button>
              </SignUpButton>
            </div>

          
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='mt-20 grid grid-cols-2 md:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 text-center hover:border-emerald-500/30 transition-all duration-300 hover:scale-105'>
                <stat.icon className='w-8 h-8 text-emerald-400 mx-auto mb-3' />
                <div className='text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-1'>
                  {stat.value}
                </div>
                <div className='text-sm text-slate-400'>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-6 relative'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Everything You Need to{' '}
              <span className='bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent'>
                Excel
              </span>
            </h2>
            <p className='text-xl text-slate-400 max-w-2xl mx-auto'>
              Comprehensive features designed to accelerate your learning
              journey
            </p>
          </motion.div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className='group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 hover:border-emerald-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10'>
                <div className='w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                  <feature.icon className='w-7 h-7 text-emerald-400' />
                </div>
                <h3 className='text-xl font-semibold mb-3 text-white'>
                  {feature.title}
                </h3>
                <p className='text-slate-400 leading-relaxed'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className='py-20 px-6 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Learn from{' '}
              <span className='bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent'>
                Industry Experts
              </span>
            </h2>
            <p className='text-xl text-slate-400 max-w-2xl mx-auto'>
              AI mentors trained on the teaching styles of renowned educators
            </p>
          </motion.div>

          <div className='grid md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
            {mentors.map((mentor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className='group p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-2xl border border-white/10 hover:border-emerald-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow duration-300'>
                    <mentor.icon className='w-8 h-8 text-white' />
                    <div className='absolute inset-0 bg-white/10 rounded-2xl blur-xl'></div>
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-white'>
                      {mentor.name}
                    </h3>
                    <p className='text-slate-400'>{mentor.role}</p>
                  </div>
                </div>
                <div className='px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg'>
                  <p className='text-sm text-emerald-300 font-medium'>{mentor.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className='py-20 px-6'>
        <div className='container mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-emerald-500/30 overflow-hidden'>
            <div className='absolute inset-0'>
              <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
            </div>
            <div className='relative z-10'>
              <h2 className='text-4xl md:text-5xl font-bold mb-6'>
                Ready to Start Your Journey?
              </h2>
              <p className='text-xl mb-8 opacity-90'>
                Join thousands of developers learning with AI mentors
              </p>
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='bg-white text-emerald-700 hover:bg-slate-100 px-8 py-6 text-lg font-semibold shadow-xl hover:scale-105 transition-all'>
                  Get Started for Free
                  <ArrowRight className='w-5 h-5 ml-2' />
                </Button>
              </SignUpButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 px-6 border-t border-white/10'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='relative w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30'>
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <span className='font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent'>
                Swaras AI
              </span>
            </div>
            <div className='text-sm text-slate-500'>
              © 2025 Swaras AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
