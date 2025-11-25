'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Copy, Check, Globe, Play, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { personas } from '@/constants/personas-dataset';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chat-store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
                  className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className='flex-shrink-0'>
                    {isUser ? (
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200 dark:ring-slate-700'>
                        <User className='w-4 h-4 text-white' />
                      </div>
                    ) : isAssistant ? (
                      <div className='w-8 h-8 rounded-full overflow-hidden shadow-md ring-2 ring-[#FA8072]/20'>
                        <img
                          src={persona?.avatarUrl}
                          alt={persona?.name}
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          className='w-8 h-8 bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center'
                          style={{ display: 'none' }}
                        >
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
                  <div className={`max-w-[60%] ${isUser ? 'flex flex-col items-end' : ''}`}>
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
                      style={isUser ? {
                        background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
                        boxShadow: '0 4px 12px rgba(250, 128, 114, 0.25)',
                      } : {}}
                    >
                      <div
                        className={`text-sm leading-relaxed ${
                          isUser ? 'text-white font-medium whitespace-pre-wrap' : ''
                        }`}
                      >
                        {/* Handle both string content and AI SDK parts format */}
                        {isUser ? (
                          // User messages: plain text with whitespace preserved
                          typeof message.content === 'string'
                            ? message.content
                            : message.content?.map((part, i) => (
                                <span key={i}>{part.text || part.content || ''}</span>
                              ))
                        ) : (
                          // Assistant messages: render as markdown
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Custom styling for markdown elements
                              p: ({ node, children, ...props }) => {
                                // Check if paragraph contains highlighted text markers
                                const text = node?.children?.[0]?.value || '';

                                // Handle different highlight patterns - return styled paragraphs, not divs
                                if (text.startsWith('💡') || text.startsWith('ℹ️') || text.includes('Note:') || text.includes('Tip:')) {
                                  return (
                                    <p className="mb-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 text-foreground text-sm" {...props}>
                                      {children}
                                    </p>
                                  );
                                }
                                if (text.startsWith('⚠️') || text.includes('Warning:') || text.includes('Important:')) {
                                  return (
                                    <p className="mb-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-foreground text-sm" {...props}>
                                      {children}
                                    </p>
                                  );
                                }
                                if (text.startsWith('✅') || text.includes('Success:')) {
                                  return (
                                    <p className="mb-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 text-foreground text-sm" {...props}>
                                      {children}
                                    </p>
                                  );
                                }
                                if (text.startsWith('❌') || text.includes('Error:')) {
                                  return (
                                    <p className="mb-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-foreground text-sm" {...props}>
                                      {children}
                                    </p>
                                  );
                                }

                                return <p className="mb-2 last:mb-0 text-foreground" {...props}>{children}</p>;
                              },
                              ul: ({ node, ...props }) => <ul className="mb-2 ml-4 list-disc text-foreground" {...props} />,
                              ol: ({ node, ...props }) => <ol className="mb-2 ml-4 list-decimal text-foreground" {...props} />,
                              li: ({ node, ...props }) => <li className="mb-1 text-foreground" {...props} />,
                              code: ({ node, inline, className, children, ...props }) => {
                                // Extract language from className (format: language-js, language-python, etc.)
                                const match = /language-(\w+)/.exec(className || '');
                                const language = match ? match[1] : null;

                                return inline ? (
                                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#FA8072] dark:text-[#FF8E8E] font-mono text-xs border border-slate-200 dark:border-slate-700" {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code
                                    className="block p-4 pt-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs overflow-x-auto relative rounded-lg border border-slate-200 dark:border-slate-700 my-3"
                                    {...props}
                                  >
                                    {/* Language badge */}
                                    {language && (
                                      <span className="absolute top-2 right-2 z-10 inline-block">
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] font-mono uppercase bg-[#FA8072] dark:bg-[#FF8E8E] text-white border-0 shadow-sm"
                                        >
                                          {language}
                                        </Badge>
                                      </span>
                                    )}
                                    {children}
                                  </code>
                                );
                              },
                              pre: ({ node, children, ...props }) => <>{children}</>,
                              strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                              em: ({ node, ...props }) => <em className="italic text-foreground" {...props} />,
                              a: ({ node, ...props }) => (
                                <a className="text-[#FA8072] dark:text-[#FF8E8E] hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                              ),
                              h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-3 text-foreground" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-3 text-foreground" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2 mt-2 text-foreground" {...props} />,
                              blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-[#FA8072] dark:border-[#FF8E8E] pl-3 italic my-2 text-slate-600 dark:text-slate-400" {...props} />
                              ),
                              table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-2">
                                  <table className="min-w-full border border-slate-200 dark:border-slate-700 text-foreground" {...props} />
                                </div>
                              ),
                              thead: ({ node, ...props }) => <thead className="bg-slate-100 dark:bg-slate-800" {...props} />,
                              tbody: ({ node, ...props }) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700" {...props} />,
                              tr: ({ node, ...props }) => <tr className="text-foreground" {...props} />,
                              th: ({ node, ...props }) => <th className="px-3 py-2 text-left text-xs font-semibold text-foreground border-b border-slate-200 dark:border-slate-700" {...props} />,
                              td: ({ node, ...props }) => <td className="px-3 py-2 text-xs text-foreground" {...props} />,
                            }}
                          >
                            {typeof message.content === 'string'
                              ? message.content
                              : message.content?.map((part) => part.text || part.content || '').join('')}
                          </ReactMarkdown>
                        )}
                        {!message.content && message.text && message.text}
                      </div>

                      {/* Copy Button for assistant messages */}
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(message.content, index)}
                          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-accent rounded-lg'
                          title='Copy message'
                        >
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
            className='flex gap-2.5'
          >
            <div className='w-8 h-8 rounded-full overflow-hidden shadow-md ring-2 ring-[#FA8072]/20'>
              <img
                src={persona?.avatarUrl}
                alt={persona?.name}
                className='w-full h-full object-cover'
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className='w-8 h-8 bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center'
                style={{ display: 'none' }}
              >
                {persona?.avatar ? (
                  <span className='text-base'>{persona.avatar}</span>
                ) : (
                  <Bot className='w-4 h-4 text-white' />
                )}
              </div>
            </div>
            <div className='max-w-[60%]'>
              {persona && (
                <div className='text-xs font-semibold text-[#FA8072] mb-1.5 px-1'>
                  {persona.name}
                </div>
              )}
              <div className='rounded-2xl rounded-bl-sm px-4 py-3 shadow-md bg-card border-2 border-border/60'>
                <div className='flex items-center gap-2.5'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  >
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
                  <span className='text-sm text-foreground font-medium'>Thinking...</span>
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
