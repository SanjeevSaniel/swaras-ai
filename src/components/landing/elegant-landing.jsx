'use client';
import React from 'react';
import { motion } from 'framer-motion'; // <-- Note: 'framer-motion'
import { SignInButton } from '@clerk/nextjs';
import { LampContainer } from '../ui/lamp'; // <-- Your local lamp effect

export function HeroLampSection() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl'>
        Mentorship in Motion
        <br />
        <span className='text-teal-600 dark:text-cyan-400 font-semibold'>
          Built for memory, speed, and clarity.
        </span>
      </motion.h1>
      <div className='mt-6 flex gap-4 justify-center'>
        {/* Add your CTA buttons and stats below */}
        <button className='px-7 py-3 text-lg font-bold bg-gradient-to-r from-sky-400 to-teal-400 text-white rounded-full shadow hover:scale-105 transition'>
          Get Started
        </button>
        <button className='px-7 py-3 text-lg font-bold border border-neutral-300 dark:border-slate-800 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white rounded-full hover:border-sky-400 shadow transition'>
          See Demo
        </button>
      </div>
      {/* Optionally, add your stats, subtitle, description, or login buttons here */}
    </LampContainer>
  );
}

const stats = [
  { value: '2.1M+', label: 'Students Taught' },
  { value: '2', label: 'AI Mentors' },
  { value: '24/7', label: 'Available' },
];
const features = [
  {
    icon: '🎭',
    title: 'AI Persona Mentors',
    desc: 'Chat with AI versions of Hitesh and Piyush, trained on their teaching styles.',
  },
  {
    icon: '💬',
    title: 'Interactive Learning',
    desc: 'Engage in natural conversations and get personalized guidance.',
  },
  {
    icon: '⚡',
    title: 'Instant Feedback',
    desc: 'Real-time code review and debugging assistance whenever you need it.',
  },
  {
    icon: '📈',
    title: 'Track Progress',
    desc: 'Monitor your learning journey with conversation history and insights.',
  },
];
const mentors = [
  {
    avatar: '☕',
    name: 'Hitesh Choudhary',
    role: 'Full Stack Development Expert',
    tags: ['JavaScript', 'React', 'Node.js', 'Project-based'],
    desc: 'Learn modern web development with hands-on projects. Known for "Chai aur Code" teaching style - making complex concepts simple and fun.',
  },
  {
    avatar: '📘',
    name: 'Piyush Garg',
    role: 'DevOps & System Design Specialist',
    tags: ['DevOps', 'System Design', 'Cloud', 'Architecture'],
    desc: 'Master scalable systems and cloud architecture. Expert in making system design practical and accessible for developers at all levels.',
  },
];
const testimonials = [
  {
    avatar: '🤩',
    text: "Mentorship with Swaras AI lets you learn faster—it's memory in motion.",
    name: 'Sveltelandia',
  },
  {
    avatar: '🚀',
    text: 'Reviewing my code is smooth, and the feedback is instant.',
    name: '@chhaaya',
  },
];

export default function LandingPage() {
  return (
    <div className='relative min-h-screen bg-white dark:bg-[#0a0f1e] overflow-x-hidden'>
      {/* NAVBAR - Stripe Style */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0a0f1e]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-10'>
              <div className='flex items-center gap-2.5'>
                <div className='w-8 h-8 bg-gradient-to-br from-[#0073e6] to-[#0052cc] rounded-md flex items-center justify-center'>
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                    <path d='M12 2L2 7L12 12L22 7L12 2Z' fill='white' opacity='0.95' />
                    <path d='M2 17L12 22L22 17M2 12L12 17L22 12' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </div>
                <span className='text-lg font-semibold text-slate-900 dark:text-white'>
                  Swaras AI
                </span>
              </div>
              <div className='hidden lg:flex items-center gap-1'>
                <a href='#features' className='px-3 py-2 text-[15px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800'>
                  Features
                </a>
                <a href='#mentors' className='px-3 py-2 text-[15px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800'>
                  Mentors
                </a>
                <a href='#testimonials' className='px-3 py-2 text-[15px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800'>
                  Testimonials
                </a>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <SignInButton mode='modal'>
                <button className='hidden sm:block px-4 py-2 text-[15px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors'>
                  Sign in
                </button>
              </SignInButton>
              <SignInButton mode='modal'>
                <button className='px-4 py-2 bg-[#0073e6] hover:bg-[#0052cc] text-white text-[15px] font-medium rounded-md transition-all duration-200'>
                  Get started →
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </nav>
      {/* HERO */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
        {/* Lamp Effect Background */}
        <div className='absolute inset-0 z-0'>
          <div className='relative w-full h-full flex items-center justify-center'>
            {/* Left lamp cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              animate={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className='absolute right-1/2 top-0 h-56 overflow-visible w-[30rem] bg-gradient-conic from-blue-500 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]'
            />
            {/* Right lamp cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              animate={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className='absolute left-1/2 top-0 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-blue-500 [--conic-position:from_290deg_at_center_top]'
            />
            {/* Glow effects */}
            <div className='absolute top-1/4 h-36 w-[28rem] rounded-full bg-blue-500 opacity-30 blur-3xl' />
            <motion.div
              initial={{ width: "8rem" }}
              animate={{ width: "16rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className='absolute top-1/4 h-36 w-64 rounded-full bg-blue-400 opacity-40 blur-2xl'
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15 }}>
            <h1 className='font-black text-4xl md:text-6xl lg:text-7xl leading-tight max-w-4xl text-center mx-auto tracking-tight text-slate-900 dark:text-white mb-6'>
              Learn to Code with
              <br />
              <span className='font-light bg-gradient-to-r from-[#0073e6] to-[#0052cc] bg-clip-text text-transparent'>
                AI Persona Mentors
              </span>
            </h1>
            <p className='text-lg md:text-xl font-light text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-center mb-8'>
              Master programming with <span className='font-semibold text-[#0073e6] dark:text-blue-400'>personalized AI mentorship</span> from industry experts{' '}
              <span className='font-semibold'>Hitesh Choudhary</span> and <span className='font-semibold'>Piyush Garg</span>.
              Get instant help, build real projects, and accelerate your career.
            </p>
            <div className='flex gap-5 justify-center mb-8 flex-wrap'>
              {stats.map((s) => (
                <div
                  key={s.label}
                  className='bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg text-center min-w-[110px] border border-slate-200/50 dark:border-slate-700/50'>
                  <div className='font-bold text-2xl text-[#0073e6] dark:text-blue-400'>
                    {s.value}
                  </div>
                  <div className='text-xs text-slate-600 dark:text-slate-300 font-medium'>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-center gap-5 flex-wrap'>
              <SignInButton mode='modal'>
                <button className='px-8 py-3.5 text-lg font-bold bg-[#0073e6] hover:bg-[#0052cc] text-white rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all'>
                  Try Free
                </button>
              </SignInButton>
              <button className='px-8 py-3.5 text-lg font-bold border-2 border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg hover:border-[#0073e6] dark:hover:border-blue-500 shadow-lg hover:shadow-xl transition-all'>
                See Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* FEATURES GRID */}
      <section id='features' className='py-24 px-6 bg-slate-50 dark:bg-[#0d1424]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4'>
              Why choose AI persona mentors
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
              Experience personalized learning with AI mentors who understand your unique learning style
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className='p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700'>
                <div className='text-3xl mb-4'>{f.icon}</div>
                <h3 className='font-semibold text-lg mb-2 text-slate-900 dark:text-white'>
                  {f.title}
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* MENTORS GRID */}
      <section id='mentors' className='py-24 px-6 bg-white dark:bg-[#0a0f1e]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4'>
              Meet your AI mentors
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
              AI personas trained on the teaching philosophies and expertise of industry legends
            </p>
          </div>
          <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
            {mentors.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className='group relative p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#0073e6] dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl'>
                {/* Avatar and header */}
                <div className='flex items-start gap-4 mb-6'>
                  <div className='relative'>
                    <div className='text-4xl w-16 h-16 rounded-xl bg-gradient-to-br from-[#0073e6] to-[#0052cc] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      {m.avatar}
                    </div>
                    <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800'></div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
                      {m.name}
                    </h3>
                    <p className='text-sm text-[#0073e6] dark:text-blue-400 font-semibold uppercase tracking-wide'>
                      {m.role}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className='text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-[15px]'>
                  {m.desc}
                </p>

                {/* Tags */}
                <div className='flex gap-2 flex-wrap mb-6'>
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className='bg-blue-50 dark:bg-blue-900/20 text-[#0073e6] dark:text-blue-400 rounded-lg px-3 py-1.5 text-xs font-semibold border border-blue-100 dark:border-blue-800/30'>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <SignInButton mode='modal'>
                  <button className='w-full py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-[#0073e6] dark:hover:bg-[#0073e6] text-slate-900 dark:text-white hover:text-white rounded-lg font-medium text-sm transition-all duration-200 group-hover:shadow-md'>
                    Start Learning with {m.name.split(' ')[0]} →
                  </button>
                </SignInButton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* COMMUNITY FEEDBACK */}
      <section id='testimonials' className='py-24 px-6 bg-slate-50 dark:bg-[#0d1424]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4'>
              Loved by developers
            </h2>
          </div>
          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className='p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700'>
                <div className='text-3xl mb-4'>{t.avatar}</div>
                <p className='text-slate-600 dark:text-slate-400 mb-4 leading-relaxed'>
                  "{t.text}"
                </p>
                <p className='text-sm font-medium text-slate-900 dark:text-white'>
                  {t.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className='py-24 px-6 bg-white dark:bg-[#0a0f1e]'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4'>
            Ready to accelerate your learning?
          </h2>
          <p className='text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto'>
            Join thousands of developers learning with AI mentors. Get instant code reviews
            and personalized guidance.
          </p>
          <SignInButton mode='modal'>
            <button className='px-8 py-4 text-base font-medium bg-[#0073e6] hover:bg-[#0052cc] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200'>
              Get started for free
            </button>
          </SignInButton>
        </div>
      </section>
      {/* FOOTER */}
      <footer className='py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1424]'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-[#0073e6] to-[#0052cc] rounded-lg flex items-center justify-center'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'>
                <path
                  d='M12 2L2 7L12 12L22 7L12 2Z'
                  fill='white'
                  opacity='0.95'
                />
                <path
                  d='M2 17L12 22L22 17M2 12L12 17L22 12'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <span className='font-semibold text-slate-900 dark:text-white'>Swaras AI</span>
          </div>
          <div className='text-sm text-slate-600 dark:text-slate-400'>
            © 2025 Swaras AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
