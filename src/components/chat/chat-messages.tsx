'use client';
import { logger } from '@/utils/logger';

import { Badge } from '@/components/ui/badge';
import { personas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, Copy, Globe, Sparkles, Star, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

const ChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { darkMode, mentorsOnline } = useChatStore();
  const persona = selectedPersona ? personas[selectedPersona] : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    logger.log('💬 ChatMessages received:', {
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
        className='flex flex-col items-center py-8 px-4 border-b border-border/30 mb-4'>
        {/* Avatar */}
        <div className='relative mb-4'>
          <Image
            src={persona.avatarUrl}
            alt={`${persona.name} avatar`}
            width={96}
            height={96}
            className='rounded-full object-cover border-4 border-border/50 shadow-lg'
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const nextEl = target.nextElementSibling as HTMLElement;
              target.style.display = 'none';
              if (nextEl) nextEl.style.display = 'flex';
            }}
          />
          <div
            className='w-24 h-24 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-4xl border-4 border-border/50 shadow-lg'
            style={{ display: 'none' }}>
            {persona.avatar}
          </div>

          {/* Online status badge */}
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 shadow-md flex items-center justify-center ${
              mentorsOnline
                ? 'bg-green-500 border-background'
                : 'bg-gray-400 border-background'
            }`}>
            <Star className='w-3 h-3 text-white' />
          </div>
        </div>

        {/* Name & Title */}
        <h2 className='text-xl font-bold text-foreground mb-1'>
          {persona.name}
        </h2>
        <p className='text-sm text-muted-foreground mb-4 text-center max-w-md'>
          {persona.title}
        </p>

        {/* Expertise badges */}
        <div className='flex flex-wrap justify-center gap-2 mb-4 max-w-md'>
          {persona.expertise.slice(0, 4).map((skill, index) => (
            <Badge
              key={index}
              variant='outline'
              className='px-2.5 py-1 text-xs bg-card border-border/50'>
              {skill}
            </Badge>
          ))}
          {persona.expertise.length > 4 && (
            <Badge
              variant='outline'
              className='px-2.5 py-1 text-xs bg-card border-border/50'>
              +{persona.expertise.length - 4} more
            </Badge>
          )}
        </div>

        {/* Social links */}
        {(persona.socialLinks?.youtube ||
          persona.socialLinks?.instagram ||
          persona.socialLinks?.twitter ||
          persona.websiteUrl) && (
          <div className='flex flex-wrap justify-center gap-2'>
            {persona.socialLinks?.youtube && (
              <a
                href={persona.socialLinks.youtube}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all text-xs font-medium'>
                <svg
                  className='w-3.5 h-3.5'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                </svg>
                YouTube
              </a>
            )}
            {persona.socialLinks?.instagram && (
              <a
                href={persona.socialLinks.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 transition-all text-xs font-medium'>
                <svg
                  className='w-3.5 h-3.5'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
                Instagram
              </a>
            )}
            {persona.socialLinks?.twitter && (
              <a
                href={persona.socialLinks.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-all text-xs font-medium'>
                <svg
                  className='w-3.5 h-3.5'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
                Twitter
              </a>
            )}
            {persona.websiteUrl && (
              <a
                href={persona.websiteUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/50 hover:border-[#FA8072]/40 hover:bg-accent transition-all text-xs font-medium'>
                <Globe className='w-3.5 h-3.5' />
                Website
              </a>
            )}
          </div>
        )}

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
        {!messages || messages.length === 0 ? (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center max-w-md'>
              <div
                className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center mx-auto mb-4 shadow-lg'
                style={{
                  boxShadow: '0 10px 30px -5px rgba(250, 128, 114, 0.4)',
                }}>
                <Bot className='w-7 h-7 text-white' />
              </div>
              <h3 className='text-base font-bold text-foreground mb-2'>
                Start a Conversation
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Ask me anything! I&apos;m here to help you learn, grow, and
                achieve your goals.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              const isAssistant =
                message.role === 'ai' || message.role === 'assistant';

              logger.log('💬 Rendering message:', {
                index,
                role: message.role,
                isUser,
                isAssistant,
                content: message.content?.substring(0, 30),
              });

              return (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-2.5 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                  {/* Avatar */}
                  <div className='flex-shrink-0'>
                    {isUser ? (
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200 dark:ring-slate-700'>
                        <User className='w-4 h-4 text-white' />
                      </div>
                    ) : isAssistant ? (
                      <div className='w-8 h-8 rounded-full overflow-hidden shadow-md ring-2 ring-[#FA8072]/20'>
                        <Image
                          src={persona?.avatarUrl}
                          alt={persona?.name}
                          width={32}
                          height={32}
                          className='object-cover'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const nextEl = target.nextElementSibling as HTMLElement;
                            target.style.display = 'none';
                            if (nextEl) nextEl.style.display = 'flex';
                          }}
                        />
                        <div
                          className='w-8 h-8 bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center'
                          style={{ display: 'none' }}>
                          {persona?.avatar ? (
                            <span className='text-base'>{persona.avatar}</span>
                          ) : (
                            <Bot className='w-4 h-4 text-white' />
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`max-w-[90%] sm:max-w-[60%] ${
                      isUser ? 'flex flex-col items-end' : ''
                    }`}>
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
                        isUser
                          ? 'text-white rounded-br-sm'
                          : 'bg-card border-2 border-border/60 rounded-bl-sm hover:border-border/80'
                      }`}
                      style={
                        isUser
                          ? {
                              background:
                                'linear-gradient(135deg, #FA8072, #FF8E8E)',
                              boxShadow: '0 4px 12px rgba(250, 128, 114, 0.25)',
                            }
                          : {}
                      }>
                      <div
                        className={`text-sm leading-relaxed ${
                          isUser
                            ? 'text-white font-medium whitespace-pre-wrap'
                            : ''
                        }`}>
                        {/* Handle both string content and AI SDK parts format */}
                        {isUser ? (
                          // User messages: plain text with whitespace preserved
                          typeof message.content === 'string' ? (
                            message.content
                          ) : (
                            message.content?.map((part, i) => (
                              <span key={i}>
                                {part.text || part.content || ''}
                              </span>
                            ))
                          )
                        ) : (
                          // Assistant messages: render as markdown
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Custom styling for markdown elements
                              p: ({ node, children, ...props }) => {
                                // Check if paragraph contains highlighted text markers
                                const text = (node?.children?.[0] as any)?.value || '';

                                // Handle different highlight patterns - return styled paragraphs, not divs
                                if (
                                  text.startsWith('💡') ||
                                  text.startsWith('ℹ️') ||
                                  text.includes('Note:') ||
                                  text.includes('Tip:')
                                ) {
                                  return (
                                    <p
                                      className='mb-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 text-foreground text-sm'
                                      {...props}>
                                      {children}
                                    </p>
                                  );
                                }
                                if (
                                  text.startsWith('⚠️') ||
                                  text.includes('Warning:') ||
                                  text.includes('Important:')
                                ) {
                                  return (
                                    <p
                                      className='mb-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-foreground text-sm'
                                      {...props}>
                                      {children}
                                    </p>
                                  );
                                }
                                if (
                                  text.startsWith('✅') ||
                                  text.includes('Success:')
                                ) {
                                  return (
                                    <p
                                      className='mb-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 text-foreground text-sm'
                                      {...props}>
                                      {children}
                                    </p>
                                  );
                                }
                                if (
                                  text.startsWith('❌') ||
                                  text.includes('Error:')
                                ) {
                                  return (
                                    <p
                                      className='mb-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-foreground text-sm'
                                      {...props}>
                                      {children}
                                    </p>
                                  );
                                }

                                return (
                                  <p
                                    className='mb-2 last:mb-0 text-foreground'
                                    {...props}>
                                    {children}
                                  </p>
                                );
                              },
                              ul: ({ node, ...props }) => (
                                <ul
                                  className='mb-2 ml-4 list-disc text-foreground'
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  className='mb-2 ml-4 list-decimal text-foreground'
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li
                                  className='mb-1 text-foreground'
                                  {...props}
                                />
                              ),
                              code: ({
                                node,
                                className,
                                children,
                                ...props
                              }: any) => {
                                const inline = (props as any).inline;
                                // Extract language from className (format: language-js, language-python, etc.)
                                const match = /language-(\w+)/.exec(
                                  className || '',
                                );
                                const language = match ? match[1] : null;

                                return inline ? (
                                  <code
                                    className='px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#FA8072] dark:text-[#FF8E8E] font-mono text-xs border border-slate-200 dark:border-slate-700'
                                    {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code
                                    className='block p-4 pt-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs overflow-x-auto relative rounded-lg border border-slate-200 dark:border-slate-700 my-3'
                                    {...props}>
                                    {/* Language badge */}
                                    {language && (
                                      <span className='absolute top-2 right-2 z-10 inline-block'>
                                        <Badge
                                          variant='secondary'
                                          className='text-[10px] font-mono uppercase bg-[#FA8072] dark:bg-[#FF8E8E] text-white border-0 shadow-sm'>
                                          {language}
                                        </Badge>
                                      </span>
                                    )}
                                    {children}
                                  </code>
                                );
                              },
                              pre: ({ node, children, ...props }) => (
                                <>{children}</>
                              ),
                              strong: ({ node, ...props }) => (
                                <strong
                                  className='font-bold text-foreground'
                                  {...props}
                                />
                              ),
                              em: ({ node, ...props }) => (
                                <em
                                  className='italic text-foreground'
                                  {...props}
                                />
                              ),
                              a: ({ node, ...props }) => (
                                <a
                                  className='text-[#FA8072] dark:text-[#FF8E8E] hover:underline font-medium'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  {...props}
                                />
                              ),
                              h1: ({ node, ...props }) => (
                                <h1
                                  className='text-lg font-bold mb-2 mt-3 text-foreground'
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className='text-base font-bold mb-2 mt-3 text-foreground'
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className='text-sm font-bold mb-2 mt-2 text-foreground'
                                  {...props}
                                />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className='border-l-4 border-[#FA8072] dark:border-[#FF8E8E] pl-3 italic my-2 text-slate-600 dark:text-slate-400'
                                  {...props}
                                />
                              ),
                              table: ({ node, ...props }) => (
                                <div className='overflow-x-auto my-2'>
                                  <table
                                    className='min-w-full border border-slate-200 dark:border-slate-700 text-foreground'
                                    {...props}
                                  />
                                </div>
                              ),
                              thead: ({ node, ...props }) => (
                                <thead
                                  className='bg-slate-100 dark:bg-slate-800'
                                  {...props}
                                />
                              ),
                              tbody: ({ node, ...props }) => (
                                <tbody
                                  className='divide-y divide-slate-200 dark:divide-slate-700'
                                  {...props}
                                />
                              ),
                              tr: ({ node, ...props }) => (
                                <tr
                                  className='text-foreground'
                                  {...props}
                                />
                              ),
                              th: ({ node, ...props }) => (
                                <th
                                  className='px-3 py-2 text-left text-xs font-semibold text-foreground border-b border-slate-200 dark:border-slate-700'
                                  {...props}
                                />
                              ),
                              td: ({ node, ...props }) => (
                                <td
                                  className='px-3 py-2 text-xs text-foreground'
                                  {...props}
                                />
                              ),
                            }}>
                            {typeof message.content === 'string'
                              ? message.content
                              : message.content
                                  ?.map(
                                    (part) => part.text || part.content || '',
                                  )
                                  .join('')}
                          </ReactMarkdown>
                        )}
                        {!message.content && message.text && message.text}
                      </div>

                      {/* Copy Button for assistant messages */}
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(message.content, index)}
                          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-accent rounded-lg'
                          title='Copy message'>
                          {copiedIndex === index ? (
                            <Check className='w-3.5 h-3.5 text-[#FA8072]' />
                          ) : (
                            <Copy className='w-3.5 h-3.5 text-muted-foreground' />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div
                      className={`text-[10px] text-muted-foreground/60 mt-1.5 px-1 ${
                        isUser ? 'text-right' : 'text-left'
                      }`}>
                      <span>
                        {new Date(
                          message.timestamp || message.createdAt || Date.now(),
                        ).toLocaleTimeString('en-US', {
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
            className='flex gap-2.5'>
            <div className='w-8 h-8 rounded-full overflow-hidden shadow-md ring-2 ring-[#FA8072]/20'>
              <Image
                src={persona?.avatarUrl}
                alt={persona?.name}
                width={32}
                height={32}
                className='object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const nextEl = target.nextElementSibling as HTMLElement;
                  target.style.display = 'none';
                  if (nextEl) nextEl.style.display = 'flex';
                }}
              />
              <div
                className='w-8 h-8 bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center'
                style={{ display: 'none' }}>
                {persona?.avatar ? (
                  <span className='text-base'>{persona.avatar}</span>
                ) : (
                  <Bot className='w-4 h-4 text-white' />
                )}
              </div>
            </div>
            <div className='max-w-[90%] sm:max-w-[60%]'>
              {persona && (
                <div className='text-xs font-semibold text-[#FA8072] mb-1.5 px-1'>
                  {persona.name}
                </div>
              )}
              <div className='rounded-2xl rounded-bl-sm px-4 py-3 shadow-md bg-card border-2 border-border/60'>
                <div className='flex items-center gap-2.5'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}>
                    <Sparkles className='w-4 h-4 text-[#FA8072]' />
                  </motion.div>
                  <div className='flex gap-1'>
                    <motion.div
                      className='w-2 h-2 rounded-full bg-[#FA8072]'
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className='w-2 h-2 rounded-full bg-[#FA8072]'
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className='w-2 h-2 rounded-full bg-[#FA8072]'
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className='text-sm text-foreground font-medium'>
                    Thinking...
                  </span>
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
