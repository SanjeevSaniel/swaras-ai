'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquarePlus,
  Search,
  Clock,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  Sparkles,
  Settings,
  Moon,
  Sun,
  X,
  Check,
  ChevronDown,
  Users,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/chat-store';
import { personaManager } from '@/constants/config';
import { UserButton } from '@clerk/nextjs';

const AppSidebar = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  selectedPersona,
  onSelectPersona,
}) => {
  const { darkMode, toggleDarkMode, personaConversations } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  const allPersonas = personaManager.getAllPersonas({ enabled: true });
  const currentPersona = selectedPersona ? personaManager.getPersona(selectedPersona) : null;

  // Get persona-conversation map for showing message counts
  const personaConversationMap = personaConversations || {};

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className='w-80 h-full bg-background border-r border-border/40 flex flex-col'>
      {/* Modern Header */}
      <div className='p-4 border-b border-border/40'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            {/* Refined Logo */}
            <div className='relative w-9 h-9 rounded-xl overflow-hidden shadow-md' style={{ background: 'linear-gradient(135deg, #FA8072, #FF8E8E)' }}>
              <svg className='w-9 h-9 p-1.5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
              <h1 className='text-base font-bold text-foreground'>Swaras AI</h1>
              <p className='text-xs text-muted-foreground/60'>AI Mentorship Platform</p>
            </div>
          </div>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 rounded-xl',
              },
            }}
          />
        </div>
      </div>

      {/* Section Header */}
      <div className='px-4 pt-4 pb-2'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-semibold text-muted-foreground/70 uppercase tracking-wide'>
            Your Mentors
          </h2>
          <div className='flex items-center gap-1'>
            <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></div>
            <span className='text-xs text-muted-foreground/60'>{allPersonas.length} online</span>
          </div>
        </div>
      </div>

      {/* Personas List - Modern Cards */}
      <div className='flex-1 overflow-y-auto px-3 pb-3'>
        <div className='space-y-2'>
          <AnimatePresence mode='popLayout'>
            {allPersonas.map((persona) => {
              const isActive = selectedPersona === persona.id;
              const personaConversation = personaConversationMap[persona.id];
              const messageCount = personaConversation?.messages?.length || 0;
              const lastMessage = personaConversation?.messages?.[personaConversation.messages.length - 1];

              return (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  whileHover={{ scale: isActive ? 1 : 1.01 }}
                  className={`group relative rounded-xl p-3.5 cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-accent via-accent to-accent/80 border border-[#FA8072]/30 shadow-md'
                      : 'bg-accent/30 hover:bg-accent/50 border border-transparent hover:border-border/50'
                  }`}
                  onClick={() => onSelectPersona(persona.id)}
                >
                  <div className='flex items-start gap-3'>
                    {/* Enhanced Avatar with Profile Image */}
                    <div className='relative flex-shrink-0'>
                      <div className={`w-12 h-12 rounded-xl overflow-hidden shadow-sm transition-all ${
                        isActive ? 'ring-2 ring-[#FA8072]/40 ring-offset-2 ring-offset-background' : ''
                      }`}>
                        <img
                          src={persona.avatarUrl}
                          alt={persona.name}
                          className='w-12 h-12 object-cover'
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          className='w-12 h-12 bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-xl'
                          style={{ display: 'none' }}>
                          {persona.avatar || '👤'}
                        </div>
                      </div>
                      {/* Status Badge */}
                      <div className='absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background shadow-sm'></div>
                    </div>

                    <div className='flex-1 min-w-0'>
                      {/* Name & Time */}
                      <div className='flex items-start justify-between gap-2 mb-1'>
                        <h3 className={`text-base font-semibold truncate leading-tight ${
                          isActive ? 'text-foreground' : 'text-foreground/90'
                        }`}>
                          {persona.name}
                        </h3>
                        {messageCount > 0 && (
                          <span className='text-xs text-muted-foreground/60 flex-shrink-0 font-medium'>
                            {formatTime(personaConversation.lastMessageAt || personaConversation.createdAt)}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <p className='text-sm text-muted-foreground/70 truncate leading-tight mb-2'>
                        {persona.title}
                      </p>

                      {/* Message Count Badge */}
                      {messageCount > 0 && (
                        <div className='flex items-center gap-1.5 mt-2'>
                          <div className='flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/50 border border-border/30'>
                            <MessageSquarePlus className='w-3 h-3 text-[#FA8072]' />
                            <span className='text-xs text-muted-foreground/70 font-medium'>
                              {messageCount}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delete Button - Subtle */}
                    {personaConversation && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-7 w-7 p-0 rounded-lg hover:bg-background/80 transition-all'
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(persona.id);
                        }}
                      >
                        <Trash2 className='h-3 w-3 text-muted-foreground/60 hover:text-red-500' />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Modern Footer */}
      <div className='p-3 border-t border-border/40'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleDarkMode}
            className='flex-1 h-9 justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all rounded-lg'
          >
            {darkMode ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
            <span className='text-xs font-medium'>{darkMode ? 'Light' : 'Dark'}</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='flex-1 h-9 justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all rounded-lg'
          >
            <Settings className='w-4 h-4' />
            <span className='text-xs font-medium'>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
