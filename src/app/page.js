// src/app/page.js (Enhanced with signature design and social links)
'use client';

import { useEffect, useState } from 'react';
import SwarasAI from '@/components/swaras-ai';
import { FaLinkedin, FaXTwitter, FaGithub, FaHeart } from 'react-icons/fa6';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks = [
    {
      name: 'FaLinkedin',
      url: 'https://linkedin.com/in/SanjeevSaniel',
      icon: FaLinkedin,
      color: 'hover:text-[#0A66C2] dark:hover:text-[#0A66C2]', // LinkedIn's official blue
      bgColor: 'hover:bg-[#E8F0FE] dark:hover:bg-[#0A66C2]/20',
    },
    {
      name: 'X',
      url: 'https://x.com/SanjeevSaniel',
      icon: FaXTwitter,
      color: 'hover:text-[#000000] dark:hover:text-[#FFFFFF]', // X's official black/white
      bgColor: 'hover:bg-[#F5F5F5] dark:hover:bg-[#000000]/20',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/SanjeevSaniel/swaras-ai',
      icon: FaGithub,
      color: 'hover:text-[#181717] dark:hover:text-[#F0F6FC]', // GitHub's dark theme colors
      bgColor: 'hover:bg-[#2c2e31] dark:hover:bg-[#181717]/20',
    },
  ];

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

      <div className='absolute bottom-1 right-20 text-xs text-gray-500 font-normal tracking-wider'>
        Built with <FaHeart className='inline text-white' /> by{' '}
        <span className='font-extrabold'>Sanjeev Saniel</span>
      </div>

      <div className='absolute flex flex-col justify-around items-center gap-3 bottom-10 right-5'>
        {socialLinks.map((social) => (
          <motion.div
            key={social.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{
              scale: 1.15,
              x: -8,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            whileTap={{ scale: 0.95 }}
            className='group'>
            <Link
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ease-out shadow-2xl ${social.color} bg-white ${social.bgColor} transform group-hover:shadow-lg`}>
              <social.icon className='w-5 h-5 transition-all duration-500 ease-out transform group-hover:scale-110' />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
