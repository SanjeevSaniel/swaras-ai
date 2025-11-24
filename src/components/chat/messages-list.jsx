'use client';

import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  Pin,
  Search,
  X
} from 'lucide-react';
import { useState } from 'react';

const MessagesList = ({ conversations, currentConversation, onSelectConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock team members for the header
  const teamMembers = [
    { id: 1, name: 'Daniel', avatar: '👨‍💻', online: true },
    { id: 2, name: 'Nixtio', avatar: '🎯', online: true },
    { id: 3, name: 'Anna', avatar: '👩‍🎨', online: true },
    { id: 4, name: 'Nelly', avatar: '👩‍💼', online: true },
  ];

  // Mock pinned chats
  const pinnedChats = [
    {
      id: 'p1',
      name: 'George Lobko',
      avatar: '👨‍💼',
      message: 'Thanks for the quick respon...',
      time: '09:41',
      online: true,
    },
    {
      id: 'p2',
      name: 'Amelia Korns',
      avatar: '👩‍🦰',
      message: "I'm stuck in traffic 🚗🔥, bu...",
      time: '21:25',
      unread: 2,
      online: true,
    },
    {
      id: 'p3',
      name: 'Arnold Lincoln',
      avatar: '🧑‍💼',
      message: 'Great job on the presenta...',
      time: '18:17',
      read: true,
      online: false,
    },
  ];

  // Mock all chats
  const allChats = [
    {
      id: 'c1',
      name: 'Hasima Medvedeva',
      avatar: '👩‍🎓',
      message: 'Hasima is typing ...',
      time: '12:23',
      typing: true,
      unread: 1,
    },
    {
      id: 'c2',
      name: 'Nixtio Team',
      avatar: '🎯',
      message: 'Daniel is typing ...',
      time: '12:13',
      typing: true,
      read: true,
    },
    {
      id: 'c3',
      name: 'Anatoly Ferusso',
      avatar: '🧑‍🔬',
      message: "Sorry for the delay. 🤝 I'll b...",
      time: '11:53',
      read: true,
    },
    {
      id: 'c4',
      name: 'Anna Gordienko',
      avatar: '👩‍🎨',
      message: 'Anna is typing ...',
      time: '10:41',
      typing: true,
      read: true,
    },
    {
      id: 'c5',
      name: 'Maksim Yerush',
      avatar: '🧑‍💻',
      message: 'Hi there, i need to go!)',
      time: '9:14',
      read: true,
    },
  ];

  return (
    <div className='w-[340px] h-full bg-white/95 backdrop-blur-xl border-l border-gray-200 flex flex-col'>
      {/* Header */}
      <div className='p-5 border-b border-gray-200'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-bold text-gray-900'>Messages</h2>
          <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
            <MoreHorizontal className='w-5 h-5 text-gray-600' />
          </button>
        </div>

        {/* Active Team Members */}
        <div className='flex items-center gap-3 mb-4'>
          {teamMembers.map((member, index) => (
            <div key={member.id} className='relative'>
              <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl border-2 border-white shadow-lg'>
                {member.avatar}
              </div>
              {member.online && (
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white' />
              )}
              {index === teamMembers.length - 1 && (
                <div className='absolute -right-1 -bottom-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white'>
                  +15
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search or start of message'
            className='pl-10 h-11 bg-gray-50 border-gray-200 text-sm placeholder:text-gray-400 rounded-xl'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>

      {/* Pinned Chats */}
      <div className='px-4 py-3 border-b border-gray-200'>
        <div className='flex items-center gap-2 mb-3'>
          <Pin className='w-4 h-4 text-gray-700 font-bold' />
          <h3 className='text-sm font-bold text-gray-900'>Pinned Chats</h3>
        </div>
        <div className='space-y-1'>
          {pinnedChats.map((chat) => (
            <motion.button
              key={chat.id}
              whileHover={{ x: 2 }}
              onClick={() => onSelectConversation && onSelectConversation(chat)}
              className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200'
            >
              <div className='relative flex-shrink-0'>
                <div className='w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-lg shadow-md'>
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white' />
                )}
              </div>
              <div className='flex-1 text-left min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='text-sm font-semibold text-gray-900 truncate'>
                    {chat.name}
                  </span>
                  <span className='text-xs text-gray-500'>{chat.time}</span>
                </div>
                <p className='text-xs text-gray-500 truncate'>{chat.message}</p>
              </div>
              {chat.unread && (
                <div className='flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold'>
                  {chat.unread}
                </div>
              )}
              {chat.read && (
                <svg className='flex-shrink-0 w-4 h-4 text-blue-500' viewBox='0 0 16 16' fill='currentColor'>
                  <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z'/>
                </svg>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* All Chats */}
      <div className='flex-1 overflow-y-auto px-4 py-3'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='w-4 h-4 rounded-full bg-gray-900' />
          <h3 className='text-sm font-bold text-gray-900'>All Chats</h3>
        </div>
        <div className='space-y-1'>
          {allChats.map((chat) => (
            <motion.button
              key={chat.id}
              whileHover={{ x: 2 }}
              onClick={() => onSelectConversation && onSelectConversation(chat)}
              className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200'
            >
              <div className='relative flex-shrink-0'>
                <div className='w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-lg shadow-md'>
                  {chat.avatar}
                </div>
                {chat.typing && (
                  <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse' />
                )}
              </div>
              <div className='flex-1 text-left min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='text-sm font-semibold text-gray-900 truncate'>
                    {chat.name}
                  </span>
                  <span className='text-xs text-gray-500'>{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.typing ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
                  {chat.message}
                </p>
              </div>
              {chat.unread && (
                <div className='flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold'>
                  {chat.unread}
                </div>
              )}
              {chat.read && !chat.typing && (
                <svg className='flex-shrink-0 w-4 h-4 text-blue-500' viewBox='0 0 16 16' fill='currentColor'>
                  <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z'/>
                </svg>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesList;
