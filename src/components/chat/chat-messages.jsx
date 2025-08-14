// src/components/chat/chat-messages.jsx (Complete Fixed Version)
'use client';

import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ThumbsDown, ThumbsUp, User, Check, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const { darkMode } = useChatStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const persona = personas[selectedPersona];
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [particles, setParticles] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle scrollbar visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollable = scrollHeight > clientHeight;
      const isNearTop = scrollTop > 10;

      setShowScrollbar(isScrollable && isNearTop);
    };

    const handleMouseEnter = () => {
      const { scrollHeight, clientHeight } = container;
      if (scrollHeight > clientHeight) {
        setShowScrollbar(true);
      }
    };

    const handleMouseLeave = () => {
      setShowScrollbar(false);
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [messages]);

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);

      // Create particle effect
      const newParticles = [...Array(8)].map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
        scale: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);

      setTimeout(() => {
        setCopiedMessageId(null);
        setParticles([]);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedMessageId(messageId);

        // Create particle effect for fallback too
        const newParticles = [...Array(8)].map((_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 40 - 20,
          y: Math.random() * 40 - 20,
          scale: Math.random() * 0.5 + 0.5,
          delay: Math.random() * 0.3,
        }));
        setParticles(newParticles);

        setTimeout(() => {
          setCopiedMessageId(null);
          setParticles([]);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle message reactions
  const handleReaction = (messageId, reactionType) => {
    setMessageReactions((prev) => {
      const currentReaction = prev[messageId]?.type;

      // If clicking the same reaction, remove it
      if (currentReaction === reactionType) {
        const { [messageId]: removed, ...rest } = prev;
        return rest;
      }

      // Otherwise, set new reaction
      return {
        ...prev,
        [messageId]: {
          type: reactionType,
          timestamp: Date.now(),
        },
      };
    });

    // Optional: Send reaction to backend here
    console.log(`Reacted ${reactionType} to message ${messageId}`);
  };

  if (!messages || messages.length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
        <div className='relative mb-6'>
          <img
            src={persona?.avatarUrl}
            alt={`${persona?.name} avatar`}
            className='w-20 h-20 rounded-full object-cover mx-auto'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div
            className='w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mx-auto'
            style={{ display: 'none' }}>
            {persona?.avatar}
          </div>
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
          Start a conversation with {persona?.name}
        </h3>
        <p
          className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Ask anything about coding and programming!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth relative ${
        showScrollbar ? 'scrollbar-visible' : 'scrollbar-hidden'
      }`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: darkMode ? '#4B5563 #1F2937' : '#D1D5DB #F9FAFB',
      }}>
      {messages.map((message) => {
        const reaction = messageReactions[message.id];

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex group ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            {/* Avatar for AI messages */}
            {message.sender === 'ai' && (
              <div className='flex-shrink-0 mr-3'>
                <div className='relative'>
                  <img
                    src={persona?.avatarUrl}
                    alt={`${persona?.name} avatar`}
                    className='w-10 h-10 rounded-full object-cover'
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl'
                    style={{ display: 'none' }}>
                    {persona?.avatar}
                  </div>
                  <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white'></div>
                </div>
              </div>
            )}

            {/* Message container */}
            <div
              className={`flex flex-col max-w-[75%] ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
              {/* Message bubble */}
              <div
                className={`relative rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-100 border border-gray-700'
                    : 'bg-white text-gray-900 border border-gray-200 shadow-md'
                }`}>
                {/* Message content */}
                <div
                  className={`prose prose-sm max-w-none ${
                    message.sender === 'user'
                      ? 'prose-invert'
                      : darkMode
                      ? 'prose-invert'
                      : ''
                  }`}>
                  <p className='mb-0 whitespace-pre-wrap break-words leading-relaxed'>
                    {message.content}
                  </p>
                </div>

                {/* Message tail */}
                <div
                  className={`absolute top-3 ${
                    message.sender === 'user'
                      ? 'right-0 translate-x-2'
                      : 'left-0 -translate-x-2'
                  }`}>
                  <div
                    className={`w-3 h-3 rotate-45 ${
                      message.sender === 'user'
                        ? darkMode
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        : darkMode
                        ? 'bg-gray-800 border-l border-b border-gray-700'
                        : 'bg-white border-l border-b border-gray-200'
                    }`}></div>
                </div>

                {/* Reaction indicator on message */}
                {reaction && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -bottom-2 ${
                      message.sender === 'user' ? 'left-3' : 'right-3'
                    } bg-white dark:bg-gray-700 rounded-full p-1 shadow-lg border`}>
                    {reaction.type === 'like' ? (
                      <ThumbsUp className='w-3 h-3 text-blue-500 fill-current' />
                    ) : reaction.type === 'dislike' ? (
                      <ThumbsDown className='w-3 h-3 text-red-500 fill-current' />
                    ) : (
                      <Heart className='w-3 h-3 text-pink-500 fill-current' />
                    )}
                  </motion.div>
                )}
              </div>

              {/* AI message actions with FIXED copy button */}
              {message.sender === 'ai' && (
                <div className='flex items-center space-x-1 mt-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  {/* FIXED Copy button - no spring animation error */}
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 px-3 text-xs relative overflow-hidden group/copy transition-all duration-300 hover:shadow-md hover:shadow-blue-500/25 dark:hover:shadow-purple-500/25 rounded-xl border border-transparent hover:border-blue-200 dark:hover:border-purple-600/30'
                    onClick={() =>
                      copyToClipboard(message.content, message.id)
                    }>
                    <AnimatePresence mode='wait'>
                      {copiedMessageId === message.id ? (
                        <motion.div
                          key='success'
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className='flex items-center text-green-600 dark:text-green-400 relative z-10'>
                          {/* Success background with gradient */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className='absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl -z-10'
                          />

                          {/* Expanding ring effect */}
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0.8 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className='absolute inset-0 border-2 border-green-400 rounded-xl -z-10'
                          />

                          {/* FIXED: Check icon - using backOut instead of spring */}
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              duration: 0.5,
                              ease: 'backOut', // ✅ No more spring animation error
                            }}>
                            <Check className='w-3 h-3 mr-1.5' />
                          </motion.div>

                          {/* Text with smooth appearance */}
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className='font-semibold'>
                            Copied!
                          </motion.span>

                          {/* Floating particles */}
                          {particles.map((particle) => (
                            <motion.div
                              key={particle.id}
                              initial={{
                                scale: 0,
                                opacity: 1,
                                x: 0,
                                y: 0,
                              }}
                              animate={{
                                scale: particle.scale,
                                opacity: 0,
                                x: particle.x,
                                y: particle.y,
                                rotate: 360,
                              }}
                              transition={{
                                duration: 1.5,
                                delay: particle.delay,
                                ease: 'easeOut',
                              }}
                              className='absolute w-1.5 h-1.5 bg-green-400 rounded-full'
                            />
                          ))}

                          {/* Shimmer effect */}
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                              duration: 1,
                              delay: 0.3,
                              ease: 'easeInOut',
                            }}
                            className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -z-10 -rotate-12'
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key='copy'
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className='flex items-center relative'>
                          {/* Hover gradient background */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{
                              opacity: 1,
                              scale: 1,
                            }}
                            className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl -z-10'
                          />

                          {/* Copy icon with gentle hover animation */}
                          <motion.div
                            whileHover={{
                              y: -1,
                              transition: { duration: 0.2 },
                            }}>
                            <Copy className='w-3 h-3 mr-1.5' />
                          </motion.div>

                          <span className='font-medium'>Copy</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>

                  {/* Like button */}
                  <Button
                    variant='ghost'
                    size='sm'
                    className={`h-8 px-2 transition-colors ${
                      reaction?.type === 'like'
                        ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:text-blue-500'
                    }`}
                    onClick={() => handleReaction(message.id, 'like')}>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}>
                      <ThumbsUp
                        className={`w-3 h-3 ${
                          reaction?.type === 'like' ? 'fill-current' : ''
                        }`}
                      />
                    </motion.div>
                  </Button>

                  {/* Dislike button */}
                  <Button
                    variant='ghost'
                    size='sm'
                    className={`h-8 px-2 transition-colors ${
                      reaction?.type === 'dislike'
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'hover:text-red-500'
                    }`}
                    onClick={() => handleReaction(message.id, 'dislike')}>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}>
                      <ThumbsDown
                        className={`w-3 h-3 ${
                          reaction?.type === 'dislike' ? 'fill-current' : ''
                        }`}
                      />
                    </motion.div>
                  </Button>

                  {/* Love button */}
                  <Button
                    variant='ghost'
                    size='sm'
                    className={`h-8 px-2 transition-colors ${
                      reaction?.type === 'love'
                        ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'hover:text-pink-500'
                    }`}
                    onClick={() => handleReaction(message.id, 'love')}>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}>
                      <Heart
                        className={`w-3 h-3 ${
                          reaction?.type === 'love' ? 'fill-current' : ''
                        }`}
                      />
                    </motion.div>
                  </Button>
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                {new Date(message.timestamp || Date.now()).toLocaleTimeString(
                  [],
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )}
              </div>
            </div>

            {/* Avatar for user messages */}
            {message.sender === 'user' && (
              <div className='flex-shrink-0 ml-3'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-blue-600' : 'bg-blue-500'
                  }`}>
                  <User className='w-6 h-6 text-white' />
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Typing indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex justify-start'>
          <div className='flex-shrink-0 mr-3'>
            <img
              src={persona?.avatarUrl}
              alt={`${persona?.name} avatar`}
              className='w-10 h-10 rounded-full object-cover'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div
              className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl'
              style={{ display: 'none' }}>
              {persona?.avatar}
            </div>
          </div>
          <div
            className={`rounded-2xl px-4 py-3 ${
              darkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}>
            <div className='flex space-x-1'>
              {[0, 150, 300].map((delay, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    darkMode ? 'bg-gray-400' : 'bg-gray-500'
                  }`}
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
