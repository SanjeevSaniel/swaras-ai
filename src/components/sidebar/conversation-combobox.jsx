// src/components/sidebar/conversation-combobox.jsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { personas } from '@/constants/personas-dataset';
import { formatChatDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { AIService } from '@/services/ai-service';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import {
  Calendar,
  Check,
  ChevronsUpDown,
  Clock,
  MessageCircle,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ConversationCombobox = () => {
  const [open, setOpen] = useState(false);
  const {
    conversations,
    currentConversation,
    selectedPersona,
    darkMode,
    setCurrentConversation,
    addConversation,
    deleteConversation,
  } = useChatStore();

  useEffect(() => {
    if (
      selectedPersona &&
      currentConversation &&
      currentConversation.personaId !== selectedPersona
    ) {
      setCurrentConversation(null);
    }
  }, [selectedPersona, currentConversation, setCurrentConversation]);

  const startNewConversation = () => {
    if (!selectedPersona) return;

    const newConversation = AIService.createConversation(selectedPersona);
    addConversation(newConversation);
    setCurrentConversation(newConversation);
    setOpen(false);
    toast.success(`New chat started with ${personas[selectedPersona]?.name}!`);
  };

  const filteredConversations = conversations
    .filter((conv) => conv.personaId === selectedPersona)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const groupedConversations = filteredConversations.reduce((groups, conv) => {
    const dateInfo = formatChatDate(conv.createdAt);
    const groupKey =
      dateInfo.type === 'today'
        ? 'Today'
        : dateInfo.type === 'yesterday'
        ? 'Yesterday'
        : dateInfo.type === 'week'
        ? 'This Week'
        : 'Older Chats';

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push({ ...conv, dateInfo });
    return groups;
  }, {});

  const currentPersona = personas[selectedPersona];

  if (!selectedPersona) {
    return (
      <div
        className={`p-4 rounded-xl border backdrop-blur-sm text-center ${
          darkMode
            ? 'bg-gray-800/20 border-gray-700/30'
            : 'bg-gray-100/50 border-gray-200/30'
        }`}>
        <MessageCircle
          className={`w-8 h-8 mx-auto mb-2 opacity-50 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
        <p
          className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Select any mentor to view chat history
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {/* Header with New Button - Added cursor-pointer */}
      <div className='flex items-center justify-between'>
        <Button
          size='sm'
          onClick={startNewConversation}
          className={`h-7 px-3 text-xs font-medium cursor-pointer ${
            darkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/20'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-200/50'
          }`}>
          <Plus className='w-3 h-3 mr-1' />
          New Chat
        </Button>

        {filteredConversations.length > 0 && (
          <span
            className={`text-xs px-2 py-1 rounded-full cursor-default ${
              darkMode
                ? 'bg-gray-700/50 text-gray-400'
                : 'bg-gray-100 text-gray-600'
            }`}>
            {filteredConversations.length} chats
          </span>
        )}
      </div>

      {/* Fixed Combobox with Proper Hover Colors and Cursor Pointer */}
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={`w-full justify-between h-9 text-xs backdrop-blur-sm transition-colors cursor-pointer ${
              currentConversation &&
              currentConversation.personaId === selectedPersona
                ? darkMode
                  ? 'bg-purple-900/30 border-purple-700/50 text-purple-300 shadow-md hover:bg-purple-800/40 hover:text-purple-200'
                  : 'bg-purple-50/70 border-purple-200/70 text-purple-700 shadow-md hover:bg-purple-100/80 hover:text-purple-800'
                : darkMode
                ? 'bg-gray-800/40 border-gray-600/40 text-gray-300 hover:bg-gray-700/50 hover:text-gray-200'
                : 'bg-white/50 border-gray-200/50 text-gray-700 hover:bg-white/80 hover:text-gray-800'
            }`}>
            <div className='flex items-center space-x-2 min-w-0 flex-1'>
              {currentConversation &&
              currentConversation.personaId === selectedPersona ? (
                <>
                  <div
                    className={`w-6 h-6 rounded-lg ${currentPersona?.accentColor} flex items-center justify-center text-white text-xs font-bold`}>
                    {currentPersona?.avatar}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <span className='text-xs font-medium truncate block'>
                      {currentConversation.title.length > 20
                        ? currentConversation.title.slice(0, 20) + '...'
                        : currentConversation.title}
                    </span>
                    <span className='text-xs opacity-60'>
                      {currentConversation.messages?.length || 0} messages
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <MessageCircle className='w-4 h-4 opacity-50' />
                  <span className='text-xs opacity-70'>
                    Browse {currentPersona?.name} chats...
                  </span>
                </>
              )}
            </div>
            <ChevronsUpDown className='ml-1 h-3 w-3 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={`w-96 p-0 ${
            darkMode
              ? 'bg-gray-800/95 border-gray-700/50'
              : 'bg-white/95 border-gray-200/50'
          } backdrop-blur-xl shadow-2xl`}
          align='start'>
          <Command className='bg-transparent'>
            <div className='p-3 border-b border-gray-200/10'>
              <div className='flex items-center space-x-2'>
                <div
                  className={`w-6 h-6 rounded-lg ${currentPersona?.accentColor} flex items-center justify-center text-white text-xs font-bold`}>
                  {currentPersona?.avatar}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                  {currentPersona?.name} Chat History
                </span>
              </div>
              {/* <CommandInput
                placeholder={`Search conversations with ${currentPersona?.name}...`}
                className='text-xs'
              /> */}
            </div>

            <CommandList className='max-h-80'>
              <CommandEmpty className='py-8 text-center'>
                <MessageCircle
                  className={`w-12 h-12 mx-auto mb-3 opacity-30 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  No conversations found
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                  Start a new chat with {currentPersona?.name}
                </p>
              </CommandEmpty>

              {Object.entries(groupedConversations).map(
                ([groupName, convs]) => (
                  <CommandGroup
                    key={groupName}
                    heading={
                      <div className='flex items-center space-x-2 py-2'>
                        <Calendar className='w-3 h-3' />
                        <span>{groupName}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            darkMode
                              ? 'bg-gray-700 text-gray-400'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                          {convs.length}
                        </span>
                      </div>
                    }>
                    {convs.map((conv) => (
                      <CommandItem
                        key={conv.id}
                        value={`${conv.title} ${conv.id}`}
                        onSelect={() => {
                          if (conv.personaId === selectedPersona) {
                            setCurrentConversation(conv);
                            setOpen(false);
                          }
                        }}
                        className={`flex items-start justify-between p-3 cursor-pointer text-xs group transition-colors ${
                          darkMode
                            ? 'hover:bg-gray-700/50 data-[selected=true]:bg-gray-700/70 hover:text-gray-200'
                            : 'hover:bg-gray-100/70 data-[selected=true]:bg-gray-100/90 hover:text-gray-800'
                        }`}>
                        <div className='flex items-start space-x-3 min-w-0 flex-1'>
                          <Check
                            className={cn(
                              'h-4 w-4 flex-shrink-0 mt-0.5',
                              currentConversation?.id === conv.id &&
                                currentConversation?.personaId ===
                                  selectedPersona
                                ? 'opacity-100 text-green-500'
                                : 'opacity-0',
                            )}
                          />

                          <div className='min-w-0 flex-1'>
                            {/* Chat Title */}
                            <div className='flex items-center justify-between mb-2'>
                              <h4
                                className={`text-sm font-semibold truncate transition-colors ${
                                  darkMode
                                    ? 'text-gray-200 group-hover:text-gray-100'
                                    : 'text-gray-900 group-hover:text-gray-800'
                                }`}>
                                {conv.title.length > 30
                                  ? conv.title.slice(0, 30) + '...'
                                  : conv.title}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 font-medium ${
                                  conv.dateInfo.type === 'today'
                                    ? darkMode
                                      ? 'bg-green-900/30 text-green-400'
                                      : 'bg-green-100 text-green-700'
                                    : conv.dateInfo.type === 'yesterday'
                                    ? darkMode
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-blue-100 text-blue-700'
                                    : darkMode
                                    ? 'bg-gray-700/50 text-gray-400'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {conv.dateInfo.primary}
                              </span>
                            </div>

                            {/* Last Message Preview */}
                            {conv.messages && conv.messages.length > 0 && (
                              <p
                                className={`text-xs line-clamp-2 leading-relaxed mb-2 transition-colors ${
                                  darkMode
                                    ? 'text-gray-400 group-hover:text-gray-300'
                                    : 'text-gray-600 group-hover:text-gray-700'
                                }`}>
                                {conv.messages[
                                  conv.messages.length - 1
                                ]?.content?.slice(0, 80)}
                                ...
                              </p>
                            )}

                            {/* Chat Metadata */}
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <div className='flex items-center space-x-1'>
                                  <Clock
                                    className={`w-3 h-3 transition-colors ${
                                      darkMode
                                        ? 'text-gray-500 group-hover:text-gray-400'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                  />
                                  <span
                                    className={`text-xs transition-colors ${
                                      darkMode
                                        ? 'text-gray-500 group-hover:text-gray-400'
                                        : 'text-gray-500 group-hover:text-gray-600'
                                    }`}>
                                    {conv.dateInfo.secondary}
                                  </span>
                                </div>

                                <div className='flex items-center space-x-1'>
                                  <User
                                    className={`w-3 h-3 transition-colors ${
                                      darkMode
                                        ? 'text-gray-500 group-hover:text-gray-400'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                  />
                                  <span
                                    className={`text-xs transition-colors ${
                                      darkMode
                                        ? 'text-gray-500 group-hover:text-gray-400'
                                        : 'text-gray-500 group-hover:text-gray-600'
                                    }`}>
                                    {currentPersona?.name}
                                  </span>
                                </div>
                              </div>

                              <div className='flex items-center space-x-2'>
                                {conv.messages && conv.messages.length > 1 && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      darkMode
                                        ? 'bg-gray-700 text-gray-300'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {conv.messages.length} msgs
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conv.id);
                            toast.success('Conversation deleted');
                          }}
                          className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 ml-2 text-red-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/30 cursor-pointer'>
                          <Trash2 className='w-3 h-3' />
                        </Button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ),
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Active Conversation Display */}
      {currentConversation &&
        currentConversation.personaId === selectedPersona && (
          <motion.div
            className={`p-3 rounded-xl border backdrop-blur-sm ${
              darkMode
                ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700/30'
                : 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200/50'
            } shadow-sm`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center space-x-2 min-w-0 flex-1'>
                <motion.div
                  className='w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0'
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className={`text-xs font-semibold ${
                    darkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                  Active Chat
                </span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full cursor-default ${
                  darkMode
                    ? 'bg-purple-800/50 text-purple-300'
                    : 'bg-purple-200/70 text-purple-700'
                }`}>
                {currentConversation.messages?.length || 0} messages
              </span>
            </div>

            <p
              className={`text-xs truncate ${
                darkMode ? 'text-purple-200' : 'text-purple-600'
              }`}>
              {currentConversation.title}
            </p>
          </motion.div>
        )}
    </div>
  );
};

export default ConversationCombobox;
