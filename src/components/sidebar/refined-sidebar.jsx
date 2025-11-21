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
    <div className='w-80 h-full bg-background border-r border-border flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-border'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center'>
              <Bot className='w-4.5 h-4.5 text-white' />
            </div>
            <div>
              <h1 className='text-sm font-semibold text-foreground'>Swaras AI</h1>
              <p className='text-xs text-muted-foreground'>AI Mentors</p>
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
        <div className='relative mb-3'>
          <button
            onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
            className='w-full p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors flex items-center gap-3 group'
          >
            {currentPersona ? (
              <>
                <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-lg flex-shrink-0'>
                  {currentPersona.avatar}
                </div>
                <div className='flex-1 text-left min-w-0'>
                  <div className='text-sm font-medium text-foreground truncate'>
                    {currentPersona.name}
                  </div>
                  <div className='text-xs text-muted-foreground truncate'>
                    {currentPersona.category}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0'>
                  <Users className='w-5 h-5 text-muted-foreground' />
                </div>
                <div className='flex-1 text-left'>
                  <div className='text-sm font-medium text-foreground'>
                    Choose a mentor
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Select to begin
                  </div>
                </div>
              </>
            )}
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${personaDropdownOpen ? 'rotate-180' : ''}`} />
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
                  <div className='p-2 border-b border-border'>
                    <p className='text-xs font-medium text-muted-foreground px-2 py-1'>
                      Available Mentors
                    </p>
                  </div>
                  <div className='overflow-y-auto max-h-[300px] p-1'>
                    {allPersonas.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => {
                          onSelectPersona(persona.id);
                          setPersonaDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 flex items-center gap-2.5 rounded-lg hover:bg-accent transition-colors ${
                          selectedPersona === persona.id ? 'bg-accent' : ''
                        }`}
                      >
                        <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-base flex-shrink-0'>
                          {persona.avatar}
                        </div>
                        <div className='flex-1 text-left min-w-0'>
                          <div className='text-sm font-medium text-foreground truncate'>
                            {persona.name}
                          </div>
                          <div className='text-xs text-muted-foreground truncate'>
                            {persona.category}
                          </div>
                        </div>
                        {selectedPersona === persona.id && (
                          <Check className='w-4 h-4 text-primary flex-shrink-0' />
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
          className='w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
        >
          <MessageSquarePlus className='w-4 h-4 mr-2' />
          Start New Chat
        </Button>
      </div>

      {/* Search and Filters */}
      <div className='p-4 space-y-3 border-b border-border'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search chats...'
            className='pl-9 h-9 bg-background border-border text-sm'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <div className='flex gap-1.5'>
          {[
            { id: 'all', label: 'All' },
            { id: 'recent', label: 'Recent' },
            { id: 'starred', label: 'Starred' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
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
                    className={`group relative rounded-xl p-3 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-accent border border-border'
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-base'>
                        {persona?.avatar || '💬'}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2 mb-1'>
                          <h3 className='text-sm font-medium text-foreground truncate'>
                            {conversation.title || 'New Chat'}
                          </h3>
                          <span className='text-xs text-muted-foreground flex-shrink-0'>
                            {formatTime(conversation.lastMessageAt || conversation.createdAt)}
                          </span>
                        </div>

                        {conversation.messages && conversation.messages.length > 0 && (
                          <p className='text-xs text-muted-foreground truncate leading-relaxed'>
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                        )}

                        <div className='flex items-center gap-2 mt-2'>
                          <span className='text-xs text-muted-foreground'>
                            {conversation.messages?.length || 0} messages
                          </span>
                          {conversation.starred && (
                            <Star className='w-3 h-3 text-amber-500 fill-amber-500' />
                          )}
                        </div>
                      </div>

                      <Button
                        variant='ghost'
                        size='sm'
                        className='opacity-0 group-hover:opacity-100 h-7 w-7 p-0'
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedConversation(
                            expandedConversation === conversation.id ? null : conversation.id
                          );
                        }}
                      >
                        <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
            <MessageSquarePlus className='w-10 h-10 text-muted-foreground/50 mb-3' />
            <p className='text-sm font-medium text-foreground mb-1'>
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {searchQuery ? 'Try a different search' : 'Start a conversation to begin'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='p-3 border-t border-border'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleDarkMode}
            className='flex-1 h-9 justify-start text-muted-foreground hover:text-foreground'
          >
            {darkMode ? <Sun className='w-4 h-4 mr-2' /> : <Moon className='w-4 h-4 mr-2' />}
            <span className='text-xs'>{darkMode ? 'Light' : 'Dark'}</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='flex-1 h-9 justify-start text-muted-foreground hover:text-foreground'
          >
            <Settings className='w-4 h-4 mr-2' />
            <span className='text-xs'>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RefinedSidebar;
