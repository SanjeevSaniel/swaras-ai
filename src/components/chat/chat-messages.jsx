'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Copy, Check, Globe, Play, Star } from 'lucide-react';
import { useState } from 'react';
import { personas } from '@/constants/personas-dataset';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chat-store';

const ChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { darkMode, mentorsOnline } = useChatStore();
  const persona = selectedPersona ? personas[selectedPersona] : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    console.log('💬 ChatMessages received:', {
      messagesCount: messages?.length || 0,
      isTyping,
      selectedPersona,
    });
    scrollToBottom();
  }, [messages, isTyping, selectedPersona]);

  const handleCopy = async (content, index) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // WhatsApp-style persona header that appears at top of chat
  const PersonaHeader = () => {
    if (!persona) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col items-center py-8 px-4 border-b border-border/30 mb-4'
      >
        {/* Avatar */}
        <div className='relative mb-4'>
          <img
            src={persona.avatarUrl}
            alt={`${persona.name} avatar`}
            className='w-24 h-24 rounded-full object-cover border-4 border-border/50 shadow-lg'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div
            className='w-24 h-24 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-4xl border-4 border-border/50 shadow-lg'
            style={{ display: 'none' }}
          >
            {persona.avatar}
          </div>

          {/* Online status badge */}
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 shadow-md flex items-center justify-center ${
              mentorsOnline ? 'bg-green-500 border-background' : 'bg-gray-400 border-background'
            }`}
          >
            <Star className='w-3 h-3 text-white' />
          </div>
        </div>

        {/* Name & Title */}
        <h2 className='text-xl font-bold text-foreground mb-1'>{persona.name}</h2>
        <p className='text-sm text-muted-foreground mb-4 text-center max-w-md'>
          {persona.title}
        </p>

        {/* Expertise badges */}
        <div className='flex flex-wrap justify-center gap-2 mb-4 max-w-md'>
          {persona.expertise.slice(0, 4).map((skill, index) => (
            <Badge
              key={index}
              variant='outline'
              className='px-2.5 py-1 text-xs bg-card border-border/50'
            >
              {skill}
            </Badge>
          ))}
          {persona.expertise.length > 4 && (
            <Badge variant='outline' className='px-2.5 py-1 text-xs bg-card border-border/50'>
              +{persona.expertise.length - 4} more
            </Badge>
          )}
        </div>

        {/* Social links */}
        <div className='flex gap-3'>
          {persona.websiteUrl && (
            <a
              href={persona.websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/50 hover:border-[#FA8072]/40 hover:bg-accent transition-all text-xs font-medium'
            >
              <Globe className='w-3.5 h-3.5' />
              Website
            </a>
          )}
          {persona.youtubeUrl && (
            <a
              href={persona.youtubeUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/50 hover:border-red-500/40 hover:bg-accent transition-all text-xs font-medium'
            >
              <Play className='w-3.5 h-3.5' />
              YouTube
            </a>
          )}
        </div>

        {/* Bio */}
        {persona.bio && (
          <p className='mt-4 text-xs text-muted-foreground text-center max-w-md leading-relaxed px-4'>
            {persona.bio}
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto'>
      {/* Persona Header - WhatsApp style at top */}
      <PersonaHeader />

      {/* Messages Container */}
      <div className='p-4 space-y-3'>
        {(!messages || messages.length === 0) ? (
          <div className='flex items-center justify-center py-12'>
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
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              const isAssistant = message.role === 'ai' || message.role === 'assistant';

              console.log('💬 Rendering message:', {
                index,
                role: message.role,
                isUser,
                isAssistant,
                content: message.content?.substring(0, 30)
              });

              return (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-2.5 ${isAssistant ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className='flex-shrink-0'>
                    {isUser ? (
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200 dark:ring-slate-700'>
                        <User className='w-4 h-4 text-white' />
                      </div>
                    ) : isAssistant ? (
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center shadow-md ring-2 ring-[#FA8072]/20'>
                        {persona?.avatar ? (
                          <span className='text-base'>{persona.avatar}</span>
                        ) : (
                          <Bot className='w-4 h-4 text-white' />
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[70%] ${isAssistant ? 'flex flex-col items-end' : ''}`}>
                    {/* Persona name for assistant messages */}
                    {isAssistant && persona && (
                      <div className='text-xs font-semibold text-[#FA8072] mb-1.5 px-1'>
                        {persona.name}
                      </div>
                    )}

                    {/* User name label */}
                    {isUser && (
                      <div className='text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 px-1'>
                        You
                      </div>
                    )}

                    <div
                      className={`group relative rounded-2xl px-4 py-3 shadow-md transition-all ${
                        isAssistant
                          ? 'text-white rounded-br-sm'
                          : 'bg-card border-2 border-border/60 rounded-bl-sm hover:border-border/80'
                      }`}
                      style={isAssistant ? {
                        background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
                        boxShadow: '0 4px 12px rgba(250, 128, 114, 0.25)',
                      } : {}}
                    >
                      <div
                        className={`text-sm leading-relaxed ${
                          isAssistant ? 'text-white font-medium' : 'text-foreground'
                        }`}
                      >
                        {message.content}
                      </div>

                      {/* Copy Button for assistant messages */}
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(message.content, index)}
                          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/20 rounded-lg'
                          title='Copy message'
                        >
                          {copiedIndex === index ? (
                            <Check className='w-3.5 h-3.5 text-white' />
                          ) : (
                            <Copy className='w-3.5 h-3.5 text-white/80' />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div
                      className={`text-[10px] text-muted-foreground/60 mt-1.5 px-1 ${
                        isAssistant ? 'text-right' : 'text-left'
                      }`}
                    >
                      <span>
                        {new Date(message.timestamp || message.createdAt || Date.now()).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Thinking Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className='flex gap-2.5 flex-row-reverse'
          >
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center shadow-md ring-2 ring-[#FA8072]/20'>
              {persona?.avatar ? (
                <span className='text-base'>{persona.avatar}</span>
              ) : (
                <Bot className='w-4 h-4 text-white' />
              )}
            </div>
            <div className='flex-1 max-w-[70%] flex flex-col items-end'>
              {persona && (
                <div className='text-xs font-semibold text-[#FA8072] mb-1.5 px-1'>
                  {persona.name}
                </div>
              )}
              <div
                className='rounded-2xl rounded-br-sm px-4 py-3 shadow-md text-white'
                style={{
                  background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
                  boxShadow: '0 4px 12px rgba(250, 128, 114, 0.25)',
                }}
              >
                <div className='flex items-center gap-2.5'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className='w-4 h-4 text-white/90' />
                  </motion.div>
                  <div className='flex gap-1'>
                    <motion.div
                      className='w-2 h-2 rounded-full bg-white/90'
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className='w-2 h-2 rounded-full bg-white/90'
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className='w-2 h-2 rounded-full bg-white/90'
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className='text-sm text-white font-medium'>Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
