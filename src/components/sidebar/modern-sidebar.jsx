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
  MoreVertical,
  Sparkles,
  Settings,
  LogOut,
  Moon,
  Sun,
  Filter,
  ChevronRight,
  X,
  Check,
  ChevronsUpDown,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/chat-store';
import { personaManager } from '@/constants/config';
import { UserButton } from '@clerk/nextjs';

const ModernSidebar = ({
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
  const [filterType, setFilterType] = useState('all'); // all, recent, starred, archived
  const [expandedConversation, setExpandedConversation] = useState(null);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const allPersonas = personaManager.getAllPersonas({ enabled: true });
  const currentPersona = selectedPersona ? personaManager.getPersona(selectedPersona) : null;

  // Filter conversations
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
      (filterType === 'starred' && conv.starred) ||
      (filterType === 'archived' && conv.archived);

    return matchesSearch && matchesFilter;
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className='w-80 h-full bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-slate-800/50 space-y-4'>
        {/* Logo */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg'>
              <Sparkles className='w-5 h-5 text-white' />
            </div>
            <div>
              <h1 className='text-lg font-bold text-white'>Swaras AI</h1>
              <p className='text-xs text-slate-400'>AI Mentor Ecosystem</p>
            </div>
          </div>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9',
              },
            }}
          />
        </div>

        {/* Persona Selector - Prominent */}
        <div className='relative'>
          <button
            onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
            className='w-full p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 border-2 border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-200 flex items-center gap-3 group'
          >
            {currentPersona ? (
              <>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg flex-shrink-0'>
                  {currentPersona.avatar}
                </div>
                <div className='flex-1 text-left min-w-0'>
                  <div className='text-sm font-semibold text-white truncate'>
                    {currentPersona.name}
                  </div>
                  <div className='text-xs text-slate-400 truncate'>
                    {currentPersona.title || currentPersona.category}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0'>
                  <Users className='w-6 h-6 text-slate-400' />
                </div>
                <div className='flex-1 text-left'>
                  <div className='text-sm font-semibold text-slate-300'>
                    Select AI Mentor
                  </div>
                  <div className='text-xs text-slate-500'>
                    Choose your assistant
                  </div>
                </div>
              </>
            )}
            <ChevronsUpDown className='w-4 h-4 text-slate-400 group-hover:text-slate-300 flex-shrink-0' />
          </button>

          {/* Persona Dropdown */}
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
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className='absolute top-full mt-2 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl max-h-[400px] overflow-hidden'
                >
                  <div className='p-3 border-b border-slate-700/50'>
                    <div className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>
                      Select AI Mentor
                    </div>
                  </div>
                  <div className='overflow-y-auto max-h-[340px] custom-scroll'>
                    {allPersonas.length === 0 ? (
                      <div className='p-4 text-center text-slate-500 text-sm'>
                        No personas available
                      </div>
                    ) : (
                      allPersonas.map((persona) => (
                        <button
                          key={persona.id}
                          onClick={() => {
                            onSelectPersona(persona.id);
                            setPersonaDropdownOpen(false);
                          }}
                          className={`w-full p-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors ${
                            selectedPersona === persona.id
                              ? 'bg-indigo-600/20 border-l-2 border-indigo-500'
                              : ''
                          }`}
                        >
                          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl flex-shrink-0 shadow-md'>
                            {persona.avatar}
                          </div>
                          <div className='flex-1 text-left min-w-0'>
                            <div className='text-sm font-medium text-white truncate'>
                              {persona.name}
                            </div>
                            <div className='text-xs text-slate-400 truncate'>
                              {persona.title || persona.category}
                            </div>
                          </div>
                          {selectedPersona === persona.id && (
                            <Check className='w-4 h-4 text-indigo-400 flex-shrink-0' />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewConversation}
          className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30'
        >
          <MessageSquarePlus className='w-4 h-4 mr-2' />
          New Conversation
        </Button>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search conversations...'
            className='pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-purple-500/50'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className='flex gap-2'>
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'starred', label: 'Starred', icon: Star },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                filterType === filter.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {filter.icon && <filter.icon className='w-3 h-3 inline mr-1' />}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent'>
        {filteredConversations && filteredConversations.length > 0 ? (
          <div className='p-2 space-y-1'>
            <AnimatePresence mode='popLayout'>
              {filteredConversations.map((conversation) => {
                const persona = personaManager.getPersona(conversation.personaId);
                const isActive = currentConversation?.id === conversation.id;
                const isExpanded = expandedConversation === conversation.id;

                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                        : 'hover:bg-slate-800/50 border border-transparent'
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full' />
                    )}

                    <div className='flex items-start gap-3'>
                      {/* Persona Avatar */}
                      <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md'>
                        <span className='text-lg'>{persona?.avatar || '🤖'}</span>
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2 mb-1'>
                          <h3
                            className={`text-sm font-medium truncate ${
                              isActive ? 'text-white' : 'text-slate-200'
                            }`}
                          >
                            {conversation.title || 'New Conversation'}
                          </h3>
                          <span className='text-xs text-slate-500 flex-shrink-0'>
                            {formatTime(conversation.lastMessageAt || conversation.createdAt)}
                          </span>
                        </div>

                        {/* Last Message Preview */}
                        {conversation.messages && conversation.messages.length > 0 && (
                          <p className='text-xs text-slate-400 truncate'>
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className='flex items-center gap-2 mt-2'>
                          <span className='text-xs text-slate-500'>
                            {conversation.messages?.length || 0} messages
                          </span>
                          {conversation.starred && (
                            <Star className='w-3 h-3 text-yellow-400 fill-yellow-400' />
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        variant='ghost'
                        size='sm'
                        className='opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-slate-700/50'
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedConversation(
                            isExpanded ? null : conversation.id
                          );
                        }}
                      >
                        <MoreVertical className='h-4 w-4 text-slate-400' />
                      </Button>
                    </div>

                    {/* Expanded Actions */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className='mt-2 pt-2 border-t border-slate-700/50 flex gap-1'
                        >
                          <Button
                            variant='ghost'
                            size='sm'
                            className='flex-1 h-7 text-xs hover:bg-slate-700/50'
                            onClick={(e) => {
                              e.stopPropagation();
                              // Toggle star
                            }}
                          >
                            <Star className='w-3 h-3 mr-1' />
                            Star
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='flex-1 h-7 text-xs hover:bg-slate-700/50'
                            onClick={(e) => {
                              e.stopPropagation();
                              // Archive
                            }}
                          >
                            <Archive className='w-3 h-3 mr-1' />
                            Archive
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='flex-1 h-7 text-xs hover:bg-red-500/20 text-red-400'
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                          >
                            <Trash2 className='w-3 h-3 mr-1' />
                            Delete
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
            <MessageSquarePlus className='w-12 h-12 text-slate-600 mb-3' />
            <p className='text-sm text-slate-400'>
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className='text-xs text-slate-500 mt-1'>
              {searchQuery ? 'Try a different search' : 'Start a new conversation'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='p-4 border-t border-slate-800/50 space-y-3'>
        {/* Theme Toggle */}
        <Button
          variant='ghost'
          onClick={toggleDarkMode}
          className='w-full justify-start text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        >
          {darkMode ? (
            <>
              <Sun className='w-4 h-4 mr-2' />
              Light Mode
            </>
          ) : (
            <>
              <Moon className='w-4 h-4 mr-2' />
              Dark Mode
            </>
          )}
        </Button>

        {/* Settings */}
        <Button
          variant='ghost'
          className='w-full justify-start text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        >
          <Settings className='w-4 h-4 mr-2' />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default ModernSidebar;
