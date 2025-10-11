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
      icon: TrendingUp,
      title: 'Track Your Progress',
      description:
        'Monitor your learning journey with detailed analytics and insights.',
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
  ];

  const mentors = [
    {
      name: 'Hitesh Choudhary',
      role: 'Full Stack Expert',
      icon: GraduationCap,
      students: '1.6M+',
      courses: '50+',
    },
    {
      name: 'Piyush Garg',
      role: 'DevOps & Backend Specialist',
      icon: Code2,
      students: '500K+',
      courses: '30+',
    },
  ];

  const pricing = [
    {
      name: 'Free',
      price: '$0',
      features: [
        '5 conversations per day',
        'Access to basic mentors',
        'Community support',
        'Basic code assistance',
      ],
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      popular: true,
      features: [
        'Unlimited conversations',
        'All mentor personalities',
        'Priority support',
        'Advanced code analysis',
        'Project reviews',
        'Career guidance',
      ],
    },
    {
      name: 'Team',
      price: '$49',
      period: '/month',
      features: [
        'Everything in Pro',
        'Up to 5 team members',
        'Team analytics',
        'Shared learning resources',
        'Custom mentor training',
        'Dedicated support',
      ],
    },
  ];

  return (
    <div className='min-h-screen bg-[#0a0a0a]'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-[#7c3aed] to-[#c026d3] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/30'>
                <Sparkles className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#d946ef] bg-clip-text text-transparent'>
                Swaras AI
              </span>
            </div>

            <div className='flex items-center gap-3'>
              <SignInButton mode='modal'>
                <Button
                  variant='ghost'
                  className='text-gray-300 hover:text-white hover:bg-white/5'>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button className='bg-gradient-to-r from-[#7c3aed] to-[#c026d3] hover:from-[#6d28d9] hover:to-[#a21caf] text-white shadow-lg shadow-purple-900/30'>
                  Get Started
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-6 relative'>
        <div className='absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none'></div>
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
              className='inline-flex items-center gap-2 px-4 py-2 mb-6 bg-purple-950/50 border border-purple-500/20 rounded-full backdrop-blur-sm'>
              <Zap className='w-4 h-4 text-purple-400' />
              <span className='text-sm font-medium text-purple-300'>
                AI-Powered Learning Platform
              </span>
            </motion.div>

            <h1 className='text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white'>
              Learn to Code with{' '}
              <span className='bg-gradient-to-r from-[#a78bfa] via-[#c026d3] to-[#d946ef] bg-clip-text text-transparent'>
                AI Mentors
              </span>
            </h1>

            <p className='text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Master programming with personalized AI mentorship from industry
              experts. Get instant help, build real projects, and accelerate
              your development career.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-12'>
              <SignUpButton mode='modal'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-[#7c3aed] to-[#c026d3] hover:from-[#6d28d9] hover:to-[#a21caf] text-white shadow-xl shadow-purple-900/30 px-8 py-6 text-lg'>
                  Start Learning Free
                  <ArrowRight className='w-5 h-5 ml-2' />
                </Button>
              </SignUpButton>
              <Button
                size='lg'
                variant='outline'
                className='border-2 border-white/10 hover:border-purple-500/50 hover:bg-white/5 text-gray-300 px-8 py-6 text-lg'>
                View Demo
                <MessageCircle className='w-5 h-5 ml-2' />
              </Button>
            </div>

            <div className='flex items-center justify-center gap-8 text-sm text-gray-400'>
              <div className='flex items-center gap-2'>
                <Check className='w-5 h-5 text-purple-400' />
                <span>No credit card required</span>
              </div>
              <div className='flex items-center gap-2'>
                <Check className='w-5 h-5 text-purple-400' />
                <span>Free forever plan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-6 bg-gradient-to-b from-[#0a0a0a] via-[#0f0a14] to-[#0a0a0a]'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Everything You Need to{' '}
              <span className='bg-gradient-to-r from-[#a78bfa] to-[#d946ef] bg-clip-text text-transparent'>
                Excel
              </span>
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
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
                whileHover={{ y: -5 }}
                className='group p-8 bg-gradient-to-b from-[#1a1a1a]/80 to-[#151515]/80 rounded-2xl border border-white/5 hover:border-purple-500/30 backdrop-blur-sm transition-all duration-300'>
                <div className='w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                  <feature.icon className='w-7 h-7 text-purple-400' />
                </div>
                <h3 className='text-xl font-semibold mb-3 text-white'>
                  {feature.title}
                </h3>
                <p className='text-gray-400 leading-relaxed'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className='py-20 px-6 bg-[#0a0a0a]'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Learn from{' '}
              <span className='bg-gradient-to-r from-[#a78bfa] to-[#d946ef] bg-clip-text text-transparent'>
                Industry Experts
              </span>
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
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
                whileHover={{ scale: 1.02 }}
                className='group p-8 bg-gradient-to-b from-[#1a1a1a]/80 to-[#151515]/80 rounded-2xl border border-white/5 hover:border-purple-500/30 backdrop-blur-sm transition-all duration-300'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-[#7c3aed] to-[#c026d3] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:shadow-purple-900/50 transition-shadow duration-300'>
                    <mentor.icon className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-white'>
                      {mentor.name}
                    </h3>
                    <p className='text-gray-400'>{mentor.role}</p>
                  </div>
                </div>
                <div className='flex gap-8'>
                  <div>
                    <div className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                      {mentor.students}
                    </div>
                    <div className='text-sm text-gray-500'>Students</div>
                  </div>
                  <div>
                    <div className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                      {mentor.courses}
                    </div>
                    <div className='text-sm text-gray-500'>Courses</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className='py-20 px-6 bg-gradient-to-b from-[#0a0a0a] via-[#0f0a14] to-[#0a0a0a]'>
        <div className='container mx-auto max-w-6xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Simple,{' '}
              <span className='bg-gradient-to-r from-[#a78bfa] to-[#d946ef] bg-clip-text text-transparent'>
                Transparent Pricing
              </span>
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              Choose the plan that fits your learning goals
            </p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-6'>
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-8 rounded-2xl border ${
                  plan.popular
                    ? 'border-purple-500/50 bg-gradient-to-b from-purple-950/50 to-[#1a1a1a]/80 shadow-2xl shadow-purple-900/30 scale-105'
                    : 'border-white/5 bg-gradient-to-b from-[#1a1a1a]/80 to-[#151515]/80'
                } backdrop-blur-sm transition-all duration-300 relative`}>
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                    <div className='px-4 py-1 bg-gradient-to-r from-[#7c3aed] to-[#c026d3] text-white text-sm font-semibold rounded-full flex items-center gap-1 shadow-lg shadow-purple-900/50'>
                      <Star className='w-4 h-4' />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className='mb-6'>
                  <h3 className='text-2xl font-bold text-white mb-2'>
                    {plan.name}
                  </h3>
                  <div className='flex items-baseline gap-1'>
                    <span className='text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className='text-gray-400'>{plan.period}</span>
                    )}
                  </div>
                </div>

                <SignUpButton mode='modal'>
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#7c3aed] to-[#c026d3] hover:from-[#6d28d9] hover:to-[#a21caf] text-white shadow-lg shadow-purple-900/30'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}>
                    Get Started
                  </Button>
                </SignUpButton>

                <ul className='space-y-3'>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className='flex items-start gap-3'>
                      <Check className='w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5' />
                      <span className='text-gray-400'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6 bg-[#0a0a0a]'>
        <div className='container mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative bg-gradient-to-br from-[#7c3aed] via-[#c026d3] to-[#d946ef] rounded-3xl p-12 text-center text-white shadow-2xl shadow-purple-900/50 overflow-hidden'>
            <div className='absolute inset-0 bg-black/10'></div>
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
                  className='bg-white text-purple-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl'>
                  Get Started for Free
                  <ArrowRight className='w-5 h-5 ml-2' />
                </Button>
              </SignUpButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 px-6 border-t border-white/5 bg-[#0a0a0a]'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#c026d3] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/30'>
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <span className='font-bold bg-gradient-to-r from-[#a78bfa] to-[#d946ef] bg-clip-text text-transparent'>Swaras AI</span>
            </div>
            <div className='text-sm text-gray-500'>
              © 2025 Swaras AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
