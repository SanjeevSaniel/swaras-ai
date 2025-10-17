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
    <div className='p-4 space-y-3'>
      {/* Header with title */}
      <div className={`text-xs font-semibold uppercase tracking-wide ${
        darkMode ? 'text-slate-400' : 'text-slate-600'
      }`}>
        Chat History
      </div>

      {/* New Chat Button */}
      <Button
        onClick={startNewConversation}
        className={`w-full h-9 text-xs font-medium cursor-pointer transition-colors ${
          darkMode
            ? 'bg-[#0073e6] hover:bg-[#0052cc] text-white'
            : 'bg-[#0073e6] hover:bg-[#0052cc] text-white'
        }`}>
        <Plus className='w-4 h-4 mr-2' />
        New Chat
      </Button>

      {/* Conversation Selector */}
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={`w-full justify-between p-3 h-auto text-left transition-colors cursor-pointer ${
              currentConversation &&
              currentConversation.personaId === selectedPersona
                ? darkMode
                  ? 'bg-blue-500/10 border-blue-500/50 hover:bg-blue-500/20'
                  : 'bg-blue-50 border-blue-500/50 hover:bg-blue-100'
                : darkMode
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}>
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              {currentConversation &&
              currentConversation.personaId === selectedPersona ? (
                <>
                  <img
                    src={currentPersona?.avatarUrl}
                    alt={currentPersona?.name}
                    className='w-8 h-8 rounded-lg object-cover shadow-sm flex-shrink-0'
                  />
                  <div className='min-w-0 flex-1'>
                    <span className={`text-sm font-semibold truncate block ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {currentConversation.title.length > 25
                        ? currentConversation.title.slice(0, 25) + '...'
                        : currentConversation.title}
                    </span>
                    <span className={`text-xs ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {currentConversation.messages?.length || 0} messages
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <MessageCircle className={`w-4 h-4 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`} />
                  <span className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Select a conversation
                  </span>
                </>
              )}
            </div>
            <ChevronsUpDown className={`ml-2 h-4 w-4 shrink-0 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={`w-96 p-0 ${
            darkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          } shadow-xl`}
          align='start'>
          <Command className='bg-transparent'>
            <div className={`p-4 border-b ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <div className='flex items-center gap-3'>
                <img
                  src={currentPersona?.avatarUrl}
                  alt={currentPersona?.name}
                  className='w-8 h-8 rounded-lg object-cover shadow-sm'
                />
                <span className={`text-sm font-semibold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {currentPersona?.name} Chats
                </span>
              </div>
            </div>

            <CommandList className='max-h-80'>
              <CommandEmpty className='py-8 text-center'>
                <MessageCircle
                  className={`w-10 h-10 mx-auto mb-3 ${
                    darkMode ? 'text-slate-600' : 'text-slate-400'
                  }`}
                />
                <p className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  No conversations yet
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Start a new chat with {currentPersona?.name}
                </p>
              </CommandEmpty>

              {Object.entries(groupedConversations).map(
                ([groupName, convs]) => (
                  <CommandGroup
                    key={groupName}
                    heading={
                      <div className='flex items-center gap-2 py-2 px-4'>
                        <Calendar className='w-3 h-3' />
                        <span className='text-xs font-semibold uppercase tracking-wide'>{groupName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          darkMode
                            ? 'bg-slate-700 text-slate-400'
                            : 'bg-slate-100 text-slate-600'
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
                        className={`flex items-start justify-between p-3 mx-2 rounded-lg cursor-pointer group transition-colors ${
                          darkMode
                            ? 'hover:bg-slate-700/50 data-[selected=true]:bg-slate-700'
                            : 'hover:bg-slate-50 data-[selected=true]:bg-slate-100'
                        }`}>
                        <div className='flex items-start gap-3 min-w-0 flex-1'>
                          <Check
                            className={cn(
                              'h-4 w-4 flex-shrink-0 mt-1',
                              currentConversation?.id === conv.id &&
                                currentConversation?.personaId ===
                                  selectedPersona
                                ? 'opacity-100 text-blue-500'
                                : 'opacity-0',
                            )}
                          />

                          <div className='min-w-0 flex-1'>
                            {/* Chat Title */}
                            <div className='flex items-center justify-between mb-1.5'>
                              <h4 className={`text-sm font-semibold truncate ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {conv.title.length > 30
                                  ? conv.title.slice(0, 30) + '...'
                                  : conv.title}
                              </h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 font-medium ${
                                conv.dateInfo.type === 'today'
                                  ? darkMode
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-blue-100 text-blue-700'
                                  : conv.dateInfo.type === 'yesterday'
                                  ? darkMode
                                    ? 'bg-slate-700 text-slate-400'
                                    : 'bg-slate-100 text-slate-600'
                                  : darkMode
                                  ? 'bg-slate-700 text-slate-400'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {conv.dateInfo.primary}
                              </span>
                            </div>

                            {/* Last Message Preview */}
                            {conv.messages && conv.messages.length > 0 && (
                              <p className={`text-xs line-clamp-2 leading-relaxed mb-2 ${
                                darkMode ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                {conv.messages[
                                  conv.messages.length - 1
                                ]?.content?.slice(0, 80)}
                                ...
                              </p>
                            )}

                            {/* Chat Metadata */}
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-3'>
                                <div className='flex items-center gap-1'>
                                  <Clock className={`w-3 h-3 ${
                                    darkMode ? 'text-slate-500' : 'text-slate-400'
                                  }`} />
                                  <span className={`text-xs ${
                                    darkMode ? 'text-slate-500' : 'text-slate-500'
                                  }`}>
                                    {conv.dateInfo.secondary}
                                  </span>
                                </div>

                                {conv.messages && conv.messages.length > 0 && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    darkMode
                                      ? 'bg-slate-700 text-slate-400'
                                      : 'bg-slate-100 text-slate-600'
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
                          className={`h-7 w-7 p-0 opacity-0 group-hover:opacity-100 ml-2 cursor-pointer transition-all ${
                            darkMode
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                              : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                          }`}>
                          <Trash2 className='w-3.5 h-3.5' />
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
            className={`p-3 rounded-lg border ${
              darkMode
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-blue-50 border-blue-200'
            }`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}>
            <div className='flex items-center justify-between mb-1.5'>
              <div className='flex items-center gap-2 min-w-0 flex-1'>
                <motion.div
                  className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className={`text-xs font-semibold ${
                  darkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  Active Chat
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                darkMode
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-white text-slate-600'
              }`}>
                {currentConversation.messages?.length || 0} msgs
              </span>
            </div>

            <p className={`text-xs truncate ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {currentConversation.title}
            </p>
          </motion.div>
        )}
    </div>
  );
};

export default ConversationCombobox;
