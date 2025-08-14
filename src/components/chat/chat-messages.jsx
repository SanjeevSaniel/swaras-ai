// src/components/chat/chat-messages.jsx
'use client';

import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Copy, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

const ChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const { darkMode } = useChatStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const persona = personas[selectedPersona];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!messages || messages.length === 0) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='text-center'>
          <div
            className={`w-16 h-16 rounded-2xl ${persona?.accentColor} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <span className='text-2xl'>{persona?.avatar}</span>
          </div>
          <p
            className={`text-lg font-semibold ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
            Start a conversation with {persona?.name}
          </p>
          <p
            className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Ask anything about coding and programming!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      <div
        ref={containerRef}
        className='flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 custom-scroll'
        style={{
          scrollBehavior: 'smooth',
          height: '100%',
        }}>
        {messages.map((message, index) => (
          <motion.div
            key={`${message.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } w-full`}>
            <div
              className={`max-w-[80%] ${
                message.sender === 'user' ? 'order-1' : 'order-2'
              }`}>
              {/* Message Header */}
              <div
                className={`flex items-center space-x-2 mb-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                {message.sender === 'ai' && (
                  <div
                    className={`w-8 h-8 rounded-xl ${persona?.accentColor} flex items-center justify-center shadow-md`}>
                    <span className='text-white text-sm font-bold'>
                      {persona?.avatar}
                    </span>
                  </div>
                )}
                <div
                  className={`text-xs font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {message.sender === 'user' ? 'You' : persona?.name}
                </div>
                {message.sender === 'user' && (
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md`}>
                    <User className='w-4 h-4 text-white' />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div
                className={`relative group ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : darkMode
                    ? 'bg-gray-800/80 border border-gray-700/50 text-gray-100'
                    : 'bg-white/80 border border-gray-200/50 text-gray-900'
                } backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg`}>
                {/* Message Text */}
                <div className='prose prose-sm max-w-none'>
                  <p className='whitespace-pre-wrap leading-relaxed text-sm'>
                    {message.content}
                  </p>
                </div>

                {/* Message Actions - Added cursor-pointer to all buttons */}
                {message.sender === 'ai' && (
                  <div className='flex items-center space-x-2 mt-3 pt-2 border-t border-gray-200/20'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => copyToClipboard(message.content)}
                      className='h-7 px-2 text-xs opacity-70 hover:opacity-100 transition-opacity cursor-pointer'>
                      <Copy className='w-3 h-3 mr-1' />
                      Copy
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 px-2 text-xs opacity-70 hover:opacity-100 transition-opacity cursor-pointer'>
                      <ThumbsUp className='w-3 h-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 px-2 text-xs opacity-70 hover:opacity-100 transition-opacity cursor-pointer'>
                      <ThumbsDown className='w-3 h-3' />
                    </Button>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-xs mt-2 ${
                    message.sender === 'user'
                      ? 'text-blue-100'
                      : darkMode
                      ? 'text-gray-500'
                      : 'text-gray-500'
                  } opacity-70`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex justify-start'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-8 h-8 rounded-xl ${persona?.accentColor} flex items-center justify-center shadow-md`}>
                <span className='text-white text-sm font-bold'>
                  {persona?.avatar}
                </span>
              </div>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  darkMode
                    ? 'bg-gray-800/80 border border-gray-700/50'
                    : 'bg-white/80 border border-gray-200/50'
                } backdrop-blur-sm shadow-lg`}>
                <div className='flex space-x-1'>
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      darkMode ? 'bg-gray-400' : 'bg-gray-600'
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      darkMode ? 'bg-gray-400' : 'bg-gray-600'
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      darkMode ? 'bg-gray-400' : 'bg-gray-600'
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
