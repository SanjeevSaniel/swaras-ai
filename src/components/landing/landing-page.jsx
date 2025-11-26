'use client';

import { SignInButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Users, Zap, ArrowRight, Brain, Target, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEnabledPersonas } from '@/constants/personas';
import { useMemo } from 'react';

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

  // Get all enabled personas dynamically
  const allPersonas = useMemo(() => {
    const personas = getEnabledPersonas();
    return Object.entries(personas)
      .filter(([_, persona]) => persona.enabled && persona.featured)
      .map(([id, persona]) => ({
        id,
        name: persona.name,
        title: persona.title,
        avatar: persona.avatar,
        specialty: persona.expertise[0] || persona.description,
        bgColor: persona.bgColor,
      }));
  }, []);

  // Curated featured personas - diverse selection across different domains
  const featuredPersonaIds = ['hitesh', 'saptarshiux', 'samantha', 'mkbhd'];

  const displayedMentors = useMemo(() => {
    const personas = getEnabledPersonas();
    return featuredPersonaIds
      .map(id => {
        const persona = personas[id];
        if (!persona) return null;
        return {
          id,
          name: persona.name,
          title: persona.title,
          avatar: persona.avatar,
          specialty: persona.expertise[0] || persona.description,
          bgColor: persona.bgColor,
          category: persona.category,
        };
      })
      .filter(Boolean);
  }, []);

  const remainingCount = allPersonas.length - displayedMentors.length;

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

          {/* Persona Avatars Stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='mt-12 flex items-center justify-center gap-3'
          >
            <div className='flex items-center -space-x-3'>
              {allPersonas.slice(0, 8).map((persona, index) => (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className='group relative'
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${persona.bgColor} flex items-center justify-center text-xl border-2 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer z-${index}`}>
                    {persona.avatar}
                  </div>
                  {/* Tooltip */}
                  <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50'>
                    {persona.name}
                    <div className='absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover'></div>
                  </div>
                </motion.div>
              ))}
              {remainingCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + 8 * 0.05 }}
                  className='w-12 h-12 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-xs font-bold text-white border-2 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer'
                >
                  +{remainingCount}
                </motion.div>
              )}
            </div>
            <div className='text-sm text-muted-foreground ml-2'>
              <span className='font-semibold text-foreground'>{allPersonas.length}+ AI Mentors</span>
              <span className='hidden sm:inline'> ready to help you learn</span>
            </div>
          </motion.div>
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
      <section className='max-w-7xl mx-auto px-6 py-16 bg-gradient-to-b from-background to-accent/5'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            Meet Your AI Mentors
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Get personalized guidance from {allPersonas.length}+ diverse personas across tech, business, wellness, and more
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
          {displayedMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className='group relative'
            >
              <div className='p-6 rounded-2xl bg-card border border-border/50 hover:border-[#FA8072]/40 transition-all hover:shadow-xl hover:-translate-y-1 duration-300'>
                <div className='flex flex-col items-center text-center gap-4'>
                  <div className='relative'>
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${mentor.bgColor} flex items-center justify-center text-4xl shadow-lg group-hover:scale-105 transition-transform`}>
                      {mentor.avatar}
                    </div>
                    <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background'></div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-bold text-foreground leading-tight'>{mentor.name}</h3>
                    <p className='text-xs text-muted-foreground'>{mentor.title}</p>
                    <div className='inline-flex items-center px-3 py-1.5 rounded-lg bg-accent/50 border border-border/50 text-xs font-medium text-foreground/80'>
                      {mentor.specialty}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {remainingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: displayedMentors.length * 0.08 }}
              className='group relative'
            >
              <div className='p-6 rounded-2xl bg-gradient-to-br from-[#FA8072]/10 to-[#FF8E8E]/10 border-2 border-dashed border-[#FA8072]/30 hover:border-[#FA8072]/60 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 cursor-pointer h-full'>
                <div className='flex flex-col items-center justify-center text-center gap-4 h-full min-h-[200px]'>
                  <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform'>
                    <span className='text-3xl font-bold text-white'>+{remainingCount}</span>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-bold text-foreground'>Discover More</h3>
                    <p className='text-xs text-muted-foreground px-4'>
                      Explore mentors in Health, Finance, Design, Storytelling & beyond
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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
