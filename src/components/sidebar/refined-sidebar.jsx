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

const RefinedSidebar = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  selectedPersona,
  onSelectPersona,
}) => {
  const { darkMode, toggleDarkMode } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedConversation, setExpandedConversation] = useState(null);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const allPersonas = personaManager.getAllPersonas({ enabled: true });
  const currentPersona = selectedPersona ? personaManager.getPersona(selectedPersona) : null;

  const filteredConversations = conversations?.filter((conv) => {
    const matchesSearch = searchQuery
      ? conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages?.some((msg) =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'recent' && conv.lastMessageAt > Date.now() - 24 * 60 * 60 * 1000) ||
      (filterType === 'starred' && conv.starred);

    return matchesSearch && matchesFilter;
  });

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
    <div className='w-72 h-full bg-background border-r border-border/50 flex flex-col backdrop-blur-xl'>
      {/* Header */}
      <div className='p-4 border-b border-border/50'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            {/* Coral-themed Logo */}
            <div className='relative w-7 h-7'>
              <div className='absolute inset-0 rounded-lg shadow-md' style={{ background: 'linear-gradient(135deg, #FA8072, #FF6B6B, #FF8E8E)', boxShadow: '0 6px 15px -3px rgba(250, 128, 114, 0.3)' }}></div>
              <svg className='relative w-7 h-7 p-1' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
              <h1 className='text-xs font-bold text-foreground'>Swaras AI</h1>
              <p className='text-[10px] text-muted-foreground/70'>AI Mentors</p>
            </div>
          </div>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>

        {/* Persona Selector */}
        <div className='relative mb-2.5'>
          <button
            onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
            className='w-full p-2.5 rounded-lg bg-card border border-border/50 hover:border-[#FA8072]/30 transition-all duration-200 flex items-center gap-2.5 group hover:shadow-sm'
          >
            {currentPersona ? (
              <>
                <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-base flex-shrink-0 shadow-sm'>
                  {currentPersona.avatar}
                </div>
                <div className='flex-1 text-left min-w-0'>
                  <div className='text-xs font-semibold text-foreground truncate'>
                    {currentPersona.name}
                  </div>
                  <div className='text-[10px] text-muted-foreground truncate'>
                    {currentPersona.category}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0'>
                  <Users className='w-4 h-4 text-muted-foreground' />
                </div>
                <div className='flex-1 text-left'>
                  <div className='text-xs font-semibold text-foreground'>
                    Choose a mentor
                  </div>
                  <div className='text-[10px] text-muted-foreground'>
                    Select to begin
                  </div>
                </div>
              </>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${personaDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {personaDropdownOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-40'
                  onClick={() => setPersonaDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className='absolute top-full mt-2 left-0 right-0 z-50 bg-popover border border-border rounded-xl shadow-lg max-h-[360px] overflow-hidden'
                >
                  <div className='p-2 border-b border-border/50'>
                    <p className='text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wide'>
                      Available Mentors
                    </p>
                  </div>
                  <div className='overflow-y-auto max-h-[280px] p-1'>
                    {allPersonas.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => {
                          onSelectPersona(persona.id);
                          setPersonaDropdownOpen(false);
                        }}
                        className={`w-full p-2 flex items-center gap-2 rounded-lg hover:bg-accent transition-all duration-150 ${
                          selectedPersona === persona.id ? 'bg-accent border border-[#FA8072]/20' : ''
                        }`}
                      >
                        <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-sm flex-shrink-0 shadow-sm'>
                          {persona.avatar}
                        </div>
                        <div className='flex-1 text-left min-w-0'>
                          <div className='text-xs font-semibold text-foreground truncate'>
                            {persona.name}
                          </div>
                          <div className='text-[10px] text-muted-foreground truncate'>
                            {persona.category}
                          </div>
                        </div>
                        {selectedPersona === persona.id && (
                          <Check className='w-3.5 h-3.5 text-[#FA8072] flex-shrink-0' />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewConversation}
          className='w-full h-9 text-white shadow-md hover:shadow-lg transition-all duration-200 text-xs font-semibold'
          style={{
            background: 'linear-gradient(to right, #FA8072, #FF6B6B, #FF8E8E)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #FF9189, #FF7F7F, #FFA3A3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #FA8072, #FF6B6B, #FF8E8E)';
          }}
        >
          <MessageSquarePlus className='w-3.5 h-3.5 mr-1.5' />
          New Chat
        </Button>
      </div>

      {/* Search and Filters */}
      <div className='p-3 space-y-2.5 border-b border-border/50'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search conversations...'
            className='pl-8 h-8 bg-background border-border/50 text-xs placeholder:text-xs hover:border-[#FA8072]/20 focus:border-[#FA8072]/40 transition-colors'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          )}
        </div>

        <div className='flex gap-1'>
          {[
            { id: 'all', label: 'All' },
            { id: 'recent', label: 'Recent' },
            { id: 'starred', label: 'Starred' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-all duration-200 ${
                filterType === filter.id
                  ? 'text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
              style={filterType === filter.id ? {
                background: 'linear-gradient(to right, #FA8072, #FF8E8E)',
              } : {}}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto p-2'>
        {filteredConversations && filteredConversations.length > 0 ? (
          <div className='space-y-1'>
            <AnimatePresence mode='popLayout'>
              {filteredConversations.map((conversation) => {
                const persona = personaManager.getPersona(conversation.personaId);
                const isActive = currentConversation?.id === conversation.id;

                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    layout
                    className={`group relative rounded-lg p-2.5 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/80 border border-[#FA8072]/20 shadow-sm'
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <div className='flex items-start gap-2.5'>
                      <div className='flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-sm shadow-sm'>
                        {persona?.avatar || '💬'}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-1.5 mb-0.5'>
                          <h3 className='text-xs font-semibold text-foreground truncate leading-tight'>
                            {conversation.title || 'New Chat'}
                          </h3>
                          <span className='text-[10px] text-muted-foreground/70 flex-shrink-0'>
                            {formatTime(conversation.lastMessageAt || conversation.createdAt)}
                          </span>
                        </div>

                        {conversation.messages && conversation.messages.length > 0 && (
                          <p className='text-[10px] text-muted-foreground/80 truncate leading-relaxed mt-0.5'>
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                        )}

                        <div className='flex items-center gap-1.5 mt-1.5'>
                          <span className='text-[9px] text-muted-foreground/70 font-medium'>
                            {conversation.messages?.length || 0} msgs
                          </span>
                          {conversation.starred && (
                            <Star className='w-2.5 h-2.5 text-amber-500 fill-amber-500' />
                          )}
                        </div>
                      </div>

                      <Button
                        variant='ghost'
                        size='sm'
                        className='opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-accent transition-opacity'
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedConversation(
                            expandedConversation === conversation.id ? null : conversation.id
                          );
                        }}
                      >
                        <MoreHorizontal className='h-3.5 w-3.5 text-muted-foreground' />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center mb-3 shadow-sm opacity-50'>
              <MessageSquarePlus className='w-5 h-5 text-white' />
            </div>
            <p className='text-xs font-semibold text-foreground mb-1'>
              {searchQuery ? 'No chats found' : 'No conversations yet'}
            </p>
            <p className='text-[10px] text-muted-foreground/80'>
              {searchQuery ? 'Try a different search' : 'Start chatting to begin'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='p-3 border-t border-border/50'>
        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleDarkMode}
            className='flex-1 h-8 justify-start text-muted-foreground hover:text-foreground hover:bg-accent transition-all'
          >
            {darkMode ? <Sun className='w-3.5 h-3.5 mr-1.5' /> : <Moon className='w-3.5 h-3.5 mr-1.5' />}
            <span className='text-[10px] font-medium'>{darkMode ? 'Light' : 'Dark'}</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='flex-1 h-8 justify-start text-muted-foreground hover:text-foreground hover:bg-accent transition-all'
          >
            <Settings className='w-3.5 h-3.5 mr-1.5' />
            <span className='text-[10px] font-medium'>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RefinedSidebar;
