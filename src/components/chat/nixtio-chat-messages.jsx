'use client';

import { personas } from '@/constants/personas-dataset';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const NixtioChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const messagesEndRef = useRef(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  const persona = selectedPersona ? personas[selectedPersona] : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!messages || messages.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='text-center max-w-md'>
          {persona?.avatarUrl ? (
            <div className='relative w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg ring-4 ring-white'>
              <Image
                src={persona.avatarUrl}
                alt={persona.name}
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl'>
              {persona?.avatar || '💬'}
            </div>
          )}
          <h3 className='text-lg font-bold text-gray-900 mb-2'>
            {persona ? `Chat with ${persona.name}` : 'Start a Conversation'}
          </h3>
          <p className='text-sm text-gray-500 leading-relaxed'>
            {persona ? persona.bio || persona.description : 'Send a message to get started with your AI assistant!'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar'>
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const isAssistant = message.role === 'assistant';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 items-start ${isUser ? 'justify-end flex-row-reverse' : 'justify-start flex-row'}`}
              onMouseEnter={() => setHoveredMessage(index)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              {/* Avatar */}
              <div className='flex-shrink-0 mt-1'>
                {isUser ? (
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-md'>
                    <User className='w-5 h-5 text-white' />
                  </div>
                ) : persona?.avatarUrl ? (
                  <div className='relative w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white'>
                    <Image
                      src={persona.avatarUrl}
                      alt={persona.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-lg shadow-md'>
                    {persona?.avatar || '🤖'}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col max-w-[60%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Name - Only show for persona */}
                {!isUser && (
                  <span className='text-sm font-semibold text-gray-900 mb-1 px-1'>
                    {persona?.name || 'AI Assistant'}
                  </span>
                )}

                {/* Message Bubble */}
                <div className='relative group'>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-md transition-all ${
                      isUser
                        ? 'bg-[#d4f4dd] text-gray-900 rounded-tr-sm'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'
                    }`}
                  >
                    <p className='text-[15px] leading-relaxed whitespace-pre-wrap break-words'>
                      {message.content}
                    </p>
                  </div>

                  {/* Timestamp and Status - Outside bubble at bottom */}
                  <div className={`flex items-center gap-1 mt-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className='text-[11px] text-gray-400'>
                      {new Date(message.timestamp || Date.now()).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </span>
                    {isUser && (
                      <svg className='w-3.5 h-3.5 text-gray-500' viewBox='0 0 16 16' fill='currentColor'>
                        <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z'/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Typing Indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='flex gap-3'
        >
          {persona?.avatarUrl ? (
            <div className='relative w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white'>
              <Image
                src={persona.avatarUrl}
                alt={persona.name}
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-lg shadow-md'>
              {persona?.avatar || '🤖'}
            </div>
          )}
          <div className='flex flex-col items-start'>
            <span className='text-sm font-semibold text-gray-900 mb-1 px-1'>{persona?.name || 'AI Assistant'}</span>
            <div className='bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm'>
              <div className='flex gap-1.5'>
                <motion.div
                  className='w-2 h-2 rounded-full bg-gray-400'
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className='w-2 h-2 rounded-full bg-gray-400'
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className='w-2 h-2 rounded-full bg-gray-400'
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default NixtioChatMessages;
