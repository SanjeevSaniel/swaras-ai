'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const RefinedChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = async (content, index) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!messages || messages.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='text-center max-w-md'>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center mx-auto mb-4 shadow-lg' style={{ boxShadow: '0 10px 30px -5px rgba(250, 128, 114, 0.4)' }}>
            <Bot className='w-7 h-7 text-white' />
          </div>
          <h3 className='text-base font-bold text-foreground mb-2'>
            Start a Conversation
          </h3>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            Ask me anything! I'm here to help you learn, grow, and achieve your goals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-3'>
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const isAI = message.role === 'ai' || message.role === 'assistant';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className='flex-shrink-0'>
                {isUser ? (
                  <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm'>
                    <User className='w-3.5 h-3.5 text-white' />
                  </div>
                ) : (
                  <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center shadow-sm'>
                    <Bot className='w-3.5 h-3.5 text-white' />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[70%] ${isUser ? 'flex flex-col items-end' : ''}`}>
                <div
                  className={`group relative rounded-xl px-3.5 py-2.5 shadow-sm ${
                    isUser
                      ? 'text-white'
                      : 'bg-card border border-border/50'
                  }`}
                  style={isUser ? {
                    background: 'linear-gradient(to right, #FA8072, #FF8E8E)',
                  } : {}}
                >
                  <div
                    className={`text-sm leading-relaxed ${
                      isUser ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {message.content}
                  </div>

                  {/* Copy Button for AI messages */}
                  {isAI && (
                    <button
                      onClick={() => handleCopy(message.content, index)}
                      className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded-md'
                      title='Copy message'
                    >
                      {copiedIndex === index ? (
                        <Check className='w-3 h-3 text-[#FA8072]' />
                      ) : (
                        <Copy className='w-3 h-3 text-muted-foreground' />
                      )}
                    </button>
                  )}
                </div>

                {/* Timestamp */}
                <div
                  className={`text-[10px] text-muted-foreground/70 mt-1 px-1 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {new Date(message.timestamp || Date.now()).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Typing Indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className='flex gap-2.5'
        >
          <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center shadow-sm'>
            <Bot className='w-3.5 h-3.5 text-white' />
          </div>
          <div className='bg-card border border-border/50 rounded-xl px-3.5 py-2.5 shadow-sm'>
            <div className='flex gap-1'>
              <motion.div
                className='w-1.5 h-1.5 rounded-full bg-[#FA8072]'
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className='w-1.5 h-1.5 rounded-full bg-[#FA8072]'
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className='w-1.5 h-1.5 rounded-full bg-[#FA8072]'
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default RefinedChatMessages;
