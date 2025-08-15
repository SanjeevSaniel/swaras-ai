// src/app/page.js (CSS-only gradients)
'use client';

import { useEffect, useState } from 'react';
import SwarasAI from '@/components/swaras-ai';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'>
        <SwarasAI />
      </div>
    );
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* CSS-Only Animated Background */}
      <div className='fixed inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-shift' />
        <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/20 to-transparent animate-gradient-slow' />
        <div className='absolute inset-0 bg-gradient-to-bl from-purple-900/10 via-transparent to-emerald-900/10 animate-gradient-reverse' />
      </div>

      {/* Simple Static Orbs */}
      <div className='fixed inset-0 pointer-events-none -z-5'>
        <div className='absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse' />
        <div
          className='absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse'
          style={{ animationDelay: '2s' }}
        />
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl animate-pulse'
          style={{ animationDelay: '4s' }}
        />
      </div>

      <SwarasAI />
    </div>
  );
}
