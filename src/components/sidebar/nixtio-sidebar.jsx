'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  LayoutDashboard,
  Users,
  Star,
  Calendar,
  FileText,
  Moon,
  Sun,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useChatStore } from '@/store/chat-store';

const NixtioSidebar = () => {
  const { darkMode, toggleDarkMode } = useChatStore();
  const [activeTab, setActiveTab] = useState('messages');

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 13 },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'favourites', icon: Star, label: 'Favourites' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'files', icon: FileText, label: 'Files' },
  ];

  return (
    <div className='w-[293px] h-full flex flex-col' style={{ background: 'linear-gradient(180deg, #1e1544 0%, #1a1035 50%, #0f0822 100%)' }}>
      {/* Header */}
      <div className='p-6 pb-8'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center'>
            <span className='text-[#1e1544] text-lg font-black'>AI</span>
          </div>
          <span className='text-white text-xl font-bold'>Chat</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-4 space-y-1'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
              <span className='text-sm font-medium flex-1 text-left'>{item.label}</span>
              {item.badge && (
                <span className='px-2 py-0.5 rounded-full bg-white text-[#1e1544] text-xs font-bold min-w-[24px] text-center'>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className='p-4 mt-auto border-t border-white/10'>
        <div className='flex items-center gap-3 p-3 rounded-xl bg-white/5'>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10 rounded-full',
              },
            }}
          />
          <div className='flex-1'>
            <div className='text-white text-sm font-semibold'>Jordan Betord</div>
            <div className='text-white/50 text-xs'>@jordan.b._uxui</div>
          </div>
          <button
            onClick={toggleDarkMode}
            className='p-2 rounded-lg hover:bg-white/10 transition-colors'
          >
            {darkMode ? (
              <Sun className='w-4 h-4 text-white/60' />
            ) : (
              <Moon className='w-4 h-4 text-white/60' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NixtioSidebar;
