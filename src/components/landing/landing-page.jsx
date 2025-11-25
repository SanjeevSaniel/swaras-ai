'use client';

import { SignInButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Users, Zap, ArrowRight, Brain, Target, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Mentorship',
      description: 'Learn from AI personas trained on real industry experts',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'Get tailored guidance based on your goals and skill level',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Code,
      title: 'Real-World Skills',
      description: 'Focus on practical, production-ready development skills',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const mentors = [
    {
      name: 'Hitesh Choudhary',
      title: 'Founder, Chai aur Code',
      avatar: '☕',
      specialty: 'Full-Stack Development',
    },
    {
      name: 'Piyush Garg',
      title: 'Software Engineer',
      avatar: '💻',
      specialty: 'Production Systems',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/20'>
      {/* Header */}
      <header className='border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {/* Logo */}
            <div className='relative w-10 h-10 rounded-xl overflow-hidden shadow-md' style={{ background: 'linear-gradient(135deg, #FA8072, #FF8E8E)' }}>
              <svg className='w-10 h-10 p-2' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5'
                      stroke='white' strokeWidth='1.8' strokeLinecap='round' opacity='0.95'/>
                <path d='M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5'
                      stroke='white' strokeWidth='1.8' strokeLinecap='round' opacity='0.95'/>
                <path d='M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z'
                      stroke='white' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' opacity='0.95'/>
                <circle cx='10' cy='16.5' r='1' fill='white' opacity='0.95'/>
                <circle cx='12' cy='16.5' r='1' fill='white' opacity='0.95'/>
                <circle cx='14' cy='16.5' r='1' fill='white' opacity='0.95'/>
              </svg>
            </div>
            <div>
              <h1 className='text-xl font-bold text-foreground'>Swaras AI</h1>
            </div>
          </div>

          <SignInButton mode='modal'>
            <Button className='bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] text-white hover:from-[#FF9189] hover:to-[#FFA3A3] shadow-md'>
              Sign In
            </Button>
          </SignInButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-6 py-20 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border/50 mb-8'>
            <Sparkles className='w-4 h-4 text-[#FA8072]' />
            <span className='text-sm font-medium text-muted-foreground'>AI-Powered Learning Platform</span>
          </div>

          <h1 className='text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight'>
            Learn to Code with
            <br />
            <span className='bg-gradient-to-r from-[#FA8072] via-[#FF8E8E] to-[#FA8072] bg-clip-text text-transparent'>
              AI Mentors
            </span>
          </h1>

          <p className='text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed'>
            Get personalized guidance from AI personas trained on real industry experts.
            Learn practical skills that matter in production environments.
          </p>

          <div className='flex items-center justify-center gap-4'>
            <SignInButton mode='modal'>
              <Button size='lg' className='bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] text-white hover:from-[#FF9189] hover:to-[#FFA3A3] shadow-lg text-base px-8 py-6 h-auto'>
                Get Started Free
                <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </SignInButton>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className='max-w-7xl mx-auto px-6 py-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            Why Choose Swaras AI?
          </h2>
          <p className='text-lg text-muted-foreground'>
            Everything you need to accelerate your learning journey
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-all hover:shadow-lg'
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md`}>
                <feature.icon className='w-7 h-7 text-white' />
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2'>{feature.title}</h3>
              <p className='text-muted-foreground'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mentors Preview */}
      <section className='max-w-7xl mx-auto px-6 py-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            Meet Your AI Mentors
          </h2>
          <p className='text-lg text-muted-foreground'>
            Learn from personas trained on real industry experts
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
          {mentors.map((mentor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='p-6 rounded-2xl bg-card border border-border/50 hover:border-[#FA8072]/40 transition-all hover:shadow-lg'
            >
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-3xl shadow-md'>
                  {mentor.avatar}
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl font-bold text-foreground mb-1'>{mentor.name}</h3>
                  <p className='text-sm text-muted-foreground mb-2'>{mentor.title}</p>
                  <div className='inline-flex items-center px-3 py-1 rounded-lg bg-accent border border-border/50 text-xs font-medium'>
                    {mentor.specialty}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='max-w-7xl mx-auto px-6 py-20'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='relative p-12 rounded-3xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] text-white text-center overflow-hidden shadow-2xl'
        >
          <div className='relative z-10'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4'>
              Ready to Start Learning?
            </h2>
            <p className='text-xl mb-8 text-white/90'>
              Join thousands of developers learning with AI mentors
            </p>
            <SignInButton mode='modal'>
              <Button size='lg' className='bg-white text-[#FA8072] hover:bg-white/90 shadow-lg text-base px-8 py-6 h-auto font-semibold'>
                Get Started Now
                <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </SignInButton>
          </div>

          {/* Decorative elements */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className='border-t border-border/40 mt-20'>
        <div className='max-w-7xl mx-auto px-6 py-8 text-center text-muted-foreground'>
          <p className='text-sm'>
            © 2025 Swaras AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
