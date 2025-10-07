// src/components/sidebar/animated-theme-toggle.jsx
'use client';

import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chat-store';
import { Moon, Sun } from 'lucide-react';

const AnimatedThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useChatStore();

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={toggleDarkMode}
      className={`w-10 h-10 rounded-lg transition-colors duration-200 ${
        darkMode
          ? 'bg-[#1a1a1a] hover:bg-[#262626] text-white'
          : 'bg-[#f5f5f5] hover:bg-[#e5e7eb] text-gray-900'
      }`}>
      <div className='flex items-center justify-center w-full h-full'>
        {darkMode ? (
          <Moon className='w-4 h-4' />
        ) : (
          <Sun className='w-4 h-4' />
        )}
      </div>
    </Button>
  );
};

export default AnimatedThemeToggle;
