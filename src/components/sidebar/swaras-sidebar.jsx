'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquarePlus,
  Search,
  X,
  Star,
  Moon,
  Sun,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useChatStore } from '@/store/chat-store';
import { personas } from '@/constants/personas-dataset';
import { Input } from '@/components/ui/input';

const SwarasSidebar = ({ selectedPersona, onSelectPersona }) => {
  const { darkMode, toggleDarkMode } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pinned'
  const [pinnedPersonas, setPinnedPersonas] = useState([]); // Track pinned personas

  const togglePinPersona = (personaId, e) => {
    e.stopPropagation();
    setPinnedPersonas(prev =>
      prev.includes(personaId)
        ? prev.filter(id => id !== personaId)
        : [...prev, personaId]
    );
  };

  // Get all personas as an array
  const allPersonas = Object.values(personas);

  // Filter personas based on search and tab
  const filteredPersonas = allPersonas.filter((persona) => {
    const matchesSearch = searchQuery
      ? persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        persona.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        persona.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesTab = activeTab === 'all' || (activeTab === 'pinned' && pinnedPersonas.includes(persona.id));

    return matchesSearch && matchesTab;
  });

  const pinnedCount = pinnedPersonas.length;

  // Get message count from localStorage for a persona
  const getMessageCount = (personaId) => {
    if (typeof window === 'undefined') return 0;
    try {
      const storedMessages = localStorage.getItem(`conversation-${personaId}`);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        return messages.length;
      }
    } catch (error) {
      console.error('Failed to get message count:', error);
    }
    return 0;
  };

  // Get last message from localStorage for a persona
  const getLastMessage = (personaId) => {
    if (typeof window === 'undefined') return null;
    try {
      const storedMessages = localStorage.getItem(`conversation-${personaId}`);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        const lastMsg = messages[messages.length - 1];

        // Return content regardless of role/sender field
        return lastMsg;
      }
    } catch (error) {
      console.error('Failed to get last message:', error);
    }
    return null;
  };

  return (
    <div className='w-[340px] h-full flex flex-col' style={{ background: 'linear-gradient(180deg, #1e1544 0%, #1a1035 50%, #0f0822 100%)' }}>
      {/* Header with Logo and User */}
      <div className='p-5 border-b border-white/10'>
        <div className='flex items-center justify-between mb-5'>
          {/* Swaras AI Logo */}
          <div className='flex items-center gap-3'>
            <div className='relative w-10 h-10'>
              <div className='absolute inset-0 rounded-lg shadow-md' style={{ background: 'linear-gradient(135deg, #FA8072, #FF6B6B, #FF8E8E)', boxShadow: '0 6px 15px -3px rgba(250, 128, 114, 0.3)' }}></div>
              <svg className='relative w-10 h-10 p-1.5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5'
                      stroke='white' strokeWidth='1.5' strokeLinecap='round' opacity='0.95'/>
                <path d='M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5'
                      stroke='white' strokeWidth='1.5' strokeLinecap='round' opacity='0.95'/>
                <path d='M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z'
                      stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' opacity='0.95'/>
                <circle cx='10' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                <circle cx='12' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
                <circle cx='14' cy='16.5' r='0.9' fill='white' opacity='0.95'/>
              </svg>
            </div>
            <div>
              <h1 className='text-white text-lg font-bold'>Swaras AI</h1>
            </div>
          </div>

          {/* User Button and Theme Toggle */}
          <div className='flex items-center gap-2'>
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
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </div>
        </div>

      </div>

      {/* Search Bar */}
      <div className='px-4 pt-4 pb-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search mentors...'
            className='pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl text-sm focus:bg-white/15 focus:border-white/30'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>

      {/* Tabs - Pinned / All Mentors */}
      <div className='px-4 pb-3'>
        <div className='flex gap-2 p-1 bg-white/5 rounded-xl'>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            All Mentors
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'pinned'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Star className='w-3 h-3' />
            Favorites {pinnedCount > 0 && `(${pinnedCount})`}
          </button>
        </div>
      </div>

      {/* Personas List */}
      <div className='flex-1 overflow-y-auto px-4 pb-3'>
        <div className='space-y-2'>
          {filteredPersonas && filteredPersonas.length > 0 ? (
            <AnimatePresence mode='popLayout'>
              {filteredPersonas.map((persona) => {
                const isActive = selectedPersona === persona.id;
                const messageCount = getMessageCount(persona.id);
                const lastMessage = getLastMessage(persona.id);
                const isPinned = pinnedPersonas.includes(persona.id);

                return (
                  <motion.button
                    key={persona.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    layout
                    whileHover={{ x: 2 }}
                    onClick={() => onSelectPersona(persona.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-white/15 border border-white/20 shadow-sm'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <div className='relative flex-shrink-0'>
                      <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-xl shadow-md'>
                        {persona.avatar}
                      </div>
                      {messageCount > 0 && (
                        <div className='absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500 border-2 border-[#1a1035] flex items-center justify-center'>
                          <span className='text-[9px] font-bold text-white'>
                            {messageCount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='flex-1 text-left min-w-0'>
                      <div className='flex items-center justify-between mb-0.5'>
                        <span className='text-sm font-bold text-white truncate'>
                          {persona.name}
                        </span>
                        <div
                          onClick={(e) => togglePinPersona(persona.id, e)}
                          className='opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1'
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              isPinned ? 'text-amber-400 fill-amber-400' : 'text-white/40'
                            }`}
                          />
                        </div>
                      </div>
                      <p className='text-[10px] text-white/50 truncate mb-1'>
                        {persona.title}
                      </p>
                      {lastMessage ? (
                        <p className='text-xs text-white/70 truncate'>
                          {lastMessage.content}
                        </p>
                      ) : (
                        <p className='text-xs text-white/40 italic truncate'>
                          {persona.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <div className='w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3'>
                <Search className='w-5 h-5 text-white/40' />
              </div>
              <p className='text-xs font-semibold text-white/80 mb-1'>
                {searchQuery ? 'No mentors found' : activeTab === 'pinned' ? 'No favorites yet' : 'No mentors available'}
              </p>
              <p className='text-[10px] text-white/50'>
                {searchQuery ? 'Try a different search' : 'Add mentors to favorites'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwarasSidebar;
