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
          <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mx-auto mb-4'>
            <Bot className='w-8 h-8 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>
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
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const isAI = message.role === 'ai' || message.role === 'assistant';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className='flex-shrink-0'>
                {isUser ? (
                  <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center'>
                    <User className='w-4.5 h-4.5 text-white' />
                  </div>
                ) : (
                  <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center'>
                    <Bot className='w-4.5 h-4.5 text-white' />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[75%] ${isUser ? 'flex flex-col items-end' : ''}`}>
                <div
                  className={`group relative rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  <div
                    className={`text-[15px] leading-relaxed ${
                      isUser ? 'text-primary-foreground' : 'text-foreground'
                    }`}
                  >
                    {message.content}
                  </div>

                  {/* Copy Button for AI messages */}
                  {isAI && (
                    <button
                      onClick={() => handleCopy(message.content, index)}
                      className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-accent rounded-lg'
                      title='Copy message'
                    >
                      {copiedIndex === index ? (
                        <Check className='w-3.5 h-3.5 text-success' />
                      ) : (
                        <Copy className='w-3.5 h-3.5 text-muted-foreground' />
                      )}
                    </button>
                  )}
                </div>

                {/* Timestamp */}
                <div
                  className={`text-xs text-muted-foreground mt-1 px-1 ${
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='flex gap-3'
        >
          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center'>
            <Bot className='w-4.5 h-4.5 text-white' />
          </div>
          <div className='bg-card border border-border rounded-2xl px-4 py-3'>
            <div className='flex gap-1.5'>
              <motion.div
                className='w-2 h-2 rounded-full bg-muted-foreground'
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className='w-2 h-2 rounded-full bg-muted-foreground'
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className='w-2 h-2 rounded-full bg-muted-foreground'
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
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
