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
  { value: '42K+', label: 'Sessions' },
  { value: '99%', label: 'Satisfaction' },
  { value: '12+', label: 'Mentor Personas' },
];
const features = [
  {
    icon: '🧠',
    title: 'Context-Aware',
    desc: 'AI mentors remember, adapt, and adjust to your goals.',
  },
  {
    icon: '💬',
    title: 'Conversational',
    desc: 'Chat, code, and learn in natural, lively dialogue.',
  },
  {
    icon: '🚀',
    title: 'Instant Review',
    desc: 'Peer-style, live code review & feedback at speed.',
  },
  {
    icon: '📚',
    title: 'Visual Progress',
    desc: 'Track topics, sessions, and knowledge over time.',
  },
];
const mentors = [
  {
    avatar: '☕',
    name: 'Hitesh Choudhary',
    role: 'Chai aur Code',
    tags: ['JavaScript', 'Project-based', 'YouTube'],
    desc: 'Modern development taught hands-on and memorable.',
  },
  {
    avatar: '📘',
    name: 'Piyush Garg',
    role: 'Cloud Mentor',
    tags: ['DevOps', 'Design', 'Scalable Systems'],
    desc: 'Architectural theory made practical and actionable.',
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
    <div className='relative min-h-screen bg-gradient-to-tr from-sky-50 via-slate-100 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 overflow-x-hidden'>
      {/* NAVBAR */}
      <nav className='fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 flex items-center justify-between w-[90%] max-w-4xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg rounded-full border border-slate-200/60 dark:border-slate-700/60'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-md relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse' />
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              className='relative z-10'>
              <path
                d='M12 2L2 7L12 12L22 7L12 2Z'
                fill='white'
                opacity='0.9'
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
          <span className='text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent tracking-tight'>
            Swaras AI
          </span>
        </div>
        <SignInButton mode='modal'>
          <button className='group relative px-5 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 dark:from-cyan-500 dark:to-teal-500 dark:hover:from-cyan-600 dark:hover:to-teal-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden'>
            <span className='relative z-10'>Get Started</span>
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
          </button>
        </SignInButton>
      </nav>
      {/* HERO */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-20'>
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
              className='absolute right-1/2 top-0 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]'
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
              className='absolute left-1/2 top-0 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 [--conic-position:from_290deg_at_center_top]'
            />
            {/* Glow effects */}
            <div className='absolute top-1/4 h-36 w-[28rem] rounded-full bg-cyan-500 opacity-30 blur-3xl' />
            <motion.div
              initial={{ width: "8rem" }}
              animate={{ width: "16rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className='absolute top-1/4 h-36 w-64 rounded-full bg-cyan-400 opacity-40 blur-2xl'
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className='relative z-10 max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15 }}>
            <h1 className='font-black text-4xl md:text-6xl lg:text-7xl leading-tight max-w-4xl text-center mx-auto tracking-tight text-neutral-900 dark:text-white mb-6'>
              Unleash Next-Level Mentorship
              <br />
              <span className='font-light text-teal-600 dark:text-cyan-400'>
                Built for memory, speed, and clarity.
              </span>
            </h1>
            <p className='text-lg md:text-xl font-light text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto text-center mb-8'>
              <span className='font-semibold text-sky-600 dark:text-sky-400'>
                Real-time guidance,
              </span>{' '}
              instant code review, and insightful feedback—always tailored for
              you.
            </p>
            <div className='flex gap-5 justify-center mb-8 flex-wrap'>
              {stats.map((s) => (
                <div
                  key={s.label}
                  className='bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg text-center min-w-[110px] border border-slate-200/50 dark:border-slate-700/50'>
                  <div className='font-bold text-2xl text-sky-600 dark:text-cyan-400'>
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
                <button className='px-8 py-3.5 text-lg font-bold bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all'>
                  Try Free
                </button>
              </SignInButton>
              <button className='px-8 py-3.5 text-lg font-bold border-2 border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-neutral-900 dark:text-white rounded-full hover:border-sky-400 dark:hover:border-cyan-400 shadow-lg hover:shadow-xl transition-all'>
                See Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* FEATURES GRID */}
      <section className='py-8 px-2 md:px-0 max-w-screen-lg mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-x-7 gap-y-8 items-center'>
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 170, damping: 21 }}
              className='border border-slate-100 dark:border-slate-900 bg-white/95 dark:bg-slate-900/80 rounded-xl shadow px-4 py-6 flex flex-col items-center'>
              <div className='text-2xl mb-2'>{f.icon}</div>
              <span className='font-bold text-base mb-1 text-sky-700 dark:text-teal-200'>
                {f.title}
              </span>
              <span className='text-xs font-light text-neutral-700 dark:text-neutral-300'>
                {f.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* MENTORS GRID */}
      <section className='py-7 px-2 md:px-0 max-w-screen-lg mx-auto'>
        <div className='grid md:grid-cols-2 gap-8'>
          {mentors.map((m, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className='flex items-center gap-6 border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/85 rounded-xl shadow px-8 py-7'>
              <div className='text-3xl w-14 h-14 rounded-full bg-gradient-to-br from-sky-100 via-teal-200 to-cyan-100 flex items-center justify-center'>
                {m.avatar}
              </div>
              <div className='flex flex-col flex-1 gap-1'>
                <span className='text-lg font-bold text-neutral-900 dark:text-white'>
                  {m.name}
                </span>
                <span className='text-xs text-sky-700 dark:text-teal-300 font-medium tracking-wide'>
                  {m.role}
                </span>
                <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                  {m.desc}
                </span>
                <div className='flex gap-2 flex-wrap mt-1'>
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className='bg-sky-100 dark:bg-teal-900 text-sky-700 dark:text-teal-200 rounded-full px-2 py-0.5 text-xs font-semibold'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* COMMUNITY FEEDBACK */}
      <section className='py-5 px-2 max-w-screen-md mx-auto'>
        <h3 className='text-center text-base font-semibold text-sky-700 dark:text-teal-200 mb-3'>
          Loved by Developers
        </h3>
        <div className='flex gap-4 flex-wrap justify-center'>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className='bg-white dark:bg-slate-900 px-4 py-3 rounded-lg shadow font-light text-sm max-w-xs'
              whileHover={{ scale: 1.05 }}>
              <div className='mb-2 flex items-center gap-1 font-bold text-lg'>
                {t.avatar}
              </div>
              <div className='text-neutral-700 dark:text-neutral-300 mb-1'>
                "{t.text}"
              </div>
              <div className='text-sky-700 dark:text-teal-200 italic text-xs'>
                {t.name}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section className='py-8 text-center bg-gradient-to-tr from-sky-700 via-teal-600 to-cyan-500'>
        <h2 className='text-xl md:text-2xl font-bold text-white mb-2'>
          Ready to mentor smarter?
        </h2>
        <p className='text-base text-white/90 mb-3'>
          Ask a question, get instant code review, or request project feedback
          now.
        </p>
        <SignInButton mode='modal'>
          <button className='px-8 py-3 text-base font-bold bg-white text-sky-900 hover:bg-slate-100 rounded-xl shadow'>
            Log In or Create Account
          </button>
        </SignInButton>
      </section>
      {/* FOOTER */}
      <footer className='py-6 text-center text-xs bg-slate-900 text-slate-200 border-t border-slate-800 font-medium'>
        <span className='font-bold'>Swaras AI</span> — Elegant mentorship for
        developers. <span className='opacity-70'>© 2025</span>
      </footer>
    </div>
  );
}
