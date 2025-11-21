'use client';

import { Button } from '@/components/ui/button';
import { personaManager } from '@/constants/config';
import { useChatStore } from '@/store/chat-store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  ThumbsDown,
  ThumbsUp,
  User,
  Check,
  Heart,
  Sparkles,
  MoreHorizontal,
  RefreshCw,
  Share2,
  Bookmark,
  ChevronDown,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ModernChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const { darkMode } = useChatStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const persona = personaManager.getPersona(selectedPersona);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages?.length]);

  useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [isTyping]);

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReaction = (messageId, reactionType) => {
    setMessageReactions((prev) => {
      const currentReaction = prev[messageId]?.type;
      if (currentReaction === reactionType) {
        const { [messageId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [messageId]: { type: reactionType, timestamp: Date.now() },
      };
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!messages || messages.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='text-center space-y-4 max-w-md'>
          <div className='w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center'>
            <Sparkles className='w-10 h-10 text-purple-400' />
          </div>
          <h3 className='text-xl font-semibold text-slate-200'>Start a Conversation</h3>
          <p className='text-slate-400'>
            Ask me anything! I'm here to help you learn and grow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative flex-1 flex flex-col overflow-hidden'>
      {/* Messages Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className='flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth'
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: darkMode
            ? 'rgba(148, 163, 184, 0.3) transparent'
            : 'rgba(100, 116, 139, 0.3) transparent',
        }}
      >
        <AnimatePresence mode='popLayout'>
          {messages.map((message, index) => {
            const isUser = message.sender === 'user';
            const isLastMessage = index === messages.length - 1;
            const reaction = messageReactions[message.id];
            const messageTime = formatTime(message.timestamp);

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
                onMouseEnter={() => setHoveredMessage(message.id)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <div
                  className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className='flex-shrink-0'>
                    {isUser ? (
                      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg'>
                        <User className='w-5 h-5 text-white' />
                      </div>
                    ) : (
                      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg'>
                        <span className='text-xl'>{persona?.avatar || '🤖'}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className='flex-1 space-y-2'>
                    {/* Message Bubble */}
                    <div
                      className={`relative group/bubble ${
                        isUser
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                          : darkMode
                          ? 'bg-slate-800/80 text-slate-100 border border-slate-700/50'
                          : 'bg-white/90 text-slate-900 border border-slate-200/50'
                      } rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm`}
                    >
                      {/* Message Text */}
                      <div className='prose prose-sm max-w-none'>
                        <p className='whitespace-pre-wrap leading-relaxed'>
                          {message.content}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <div
                        className={`mt-2 text-xs ${
                          isUser ? 'text-white/70' : darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {messageTime}
                      </div>

                      {/* Reaction Badge */}
                      {reaction && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='absolute -bottom-2 right-4 px-2 py-1 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-sm'
                        >
                          {reaction.type === 'like' && '👍'}
                          {reaction.type === 'love' && '❤️'}
                          {reaction.type === 'dislike' && '👎'}
                        </motion.div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {!isUser && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredMessage === message.id || reaction ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className='flex items-center gap-2 px-2'
                      >
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className='h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg'
                        >
                          {copiedMessageId === message.id ? (
                            <Check className='h-3.5 w-3.5 text-green-400' />
                          ) : (
                            <Copy className='h-3.5 w-3.5 text-slate-400' />
                          )}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleReaction(message.id, 'like')}
                          className={`h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg ${
                            reaction?.type === 'like' ? 'bg-slate-700/50' : ''
                          }`}
                        >
                          <ThumbsUp
                            className={`h-3.5 w-3.5 ${
                              reaction?.type === 'like' ? 'text-blue-400 fill-blue-400' : 'text-slate-400'
                            }`}
                          />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleReaction(message.id, 'love')}
                          className={`h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg ${
                            reaction?.type === 'love' ? 'bg-slate-700/50' : ''
                          }`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              reaction?.type === 'love' ? 'text-red-400 fill-red-400' : 'text-slate-400'
                            }`}
                          />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg'
                        >
                          <RefreshCw className='h-3.5 w-3.5 text-slate-400' />
                        </Button>
                      </motion.div>
                    )}
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
            exit={{ opacity: 0 }}
            className='flex justify-start'
          >
            <div className='flex gap-3 max-w-[85%] md:max-w-[75%]'>
              <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg'>
                <span className='text-xl'>{persona?.avatar || '🤖'}</span>
              </div>
              <div className='bg-slate-800/80 border border-slate-700/50 rounded-2xl px-5 py-4 shadow-lg'>
                <div className='flex gap-1.5'>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className='w-2 h-2 bg-slate-400 rounded-full'
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className='absolute bottom-4 right-4 z-10'
          >
            <Button
              onClick={() => scrollToBottom()}
              className='h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 p-0'
            >
              <ChevronDown className='h-5 w-5 text-white' />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernChatMessages;
