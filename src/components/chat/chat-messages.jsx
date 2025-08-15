// src/components/chat/chat-messages.jsx
'use client';

import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas-dataset';
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
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ChatMessages = ({ messages, isTyping, selectedPersona }) => {
  const { darkMode } = useChatStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const persona = personas[selectedPersona];
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Function to check if user is near bottom of scroll
  const isNearBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
  };

  // Auto-scroll only when user is near bottom or it's the first message
  const scrollToBottom = () => {
    if (shouldAutoScroll && !isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll events to detect user scrolling
  const handleScroll = () => {
    if (!containerRef.current) return;

    setIsUserScrolling(true);
    setShouldAutoScroll(isNearBottom());

    // Reset scrolling state after a delay
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      setIsUserScrolling(false);
    }, 150);
  };

  // Only auto-scroll for new messages when appropriate
  useEffect(() => {
    const messageCount = messages?.length || 0;

    // Always scroll for first message or when user is near bottom
    if (messageCount === 1 || (shouldAutoScroll && !isUserScrolling)) {
      scrollToBottom();
    }
  }, [messages?.length]); // Only depend on message count, not content

  // Handle typing indicator separately
  useEffect(() => {
    if (isTyping && shouldAutoScroll && !isUserScrolling) {
      scrollToBottom();
    }
  }, [isTyping]);

  // Reset auto-scroll when persona changes
  useEffect(() => {
    setShouldAutoScroll(true);
    setIsUserScrolling(false);
  }, [selectedPersona]);

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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

  if (!messages || messages.length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
        <div className='relative mb-6'>
          <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-500 to-purple-600'>
            <img
              src={persona?.avatarUrl}
              alt={`${persona?.name} avatar`}
              className='w-full h-full object-cover'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div
              className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl text-white'
              style={{ display: 'none' }}>
              {persona?.avatar}
            </div>
          </div>

          <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900'>
            <Sparkles className='w-2.5 h-2.5 text-white' />
          </div>
        </div>

        <h3
          className={`text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          Start a conversation with {persona?.name}
        </h3>
        <p
          className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          } mb-4`}>
          Ask anything about coding, career advice, or programming best
          practices
        </p>

        <div className='flex flex-wrap justify-center gap-2 max-w-md'>
          {['How to learn React?', 'Career guidance', 'Best practices'].map(
            (suggestion) => (
              <div
                key={suggestion}
                className={`px-3 py-1.5 rounded-full text-xs border cursor-pointer transition-colors ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'bg-white/80 border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}>
                {suggestion}
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col relative overflow-hidden'>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 ${
          darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'
        }`}>
        {messages.map((message, index) => {
          const reaction = messageReactions[message.id];
          const isUser = message.sender === 'user';
          const isHovered = hoveredMessage === message.id;

          return (
            <div
              key={message.id}
              onMouseEnter={() => setHoveredMessage(message.id)}
              onMouseLeave={() => setHoveredMessage(null)}
              className={`flex group ${
                isUser ? 'justify-end' : 'justify-start'
              }`}>
              {/* AI Avatar */}
              {!isUser && (
                <div className='flex-shrink-0 mr-3'>
                  <div className='relative'>
                    <div className='w-8 h-8 rounded-full overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-500 to-purple-600'>
                      <img
                        src={persona?.avatarUrl}
                        alt={`${persona?.name} avatar`}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div
                        className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm text-white'
                        style={{ display: 'none' }}>
                        {persona?.avatar}
                      </div>
                    </div>

                    <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-900'></div>
                  </div>
                </div>
              )}

              {/* Message Container */}
              <div
                className={`flex flex-col max-w-[75%] ${
                  isUser ? 'items-end' : 'items-start'
                }`}>
                {/* Message Bubble */}
                <div
                  className={`relative rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : darkMode
                      ? 'bg-gray-800 text-gray-100 border border-gray-700'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                  }`}>
                  {/* Message Content */}
                  <div
                    className={`prose prose-sm max-w-none ${
                      isUser ? 'prose-invert' : darkMode ? 'prose-invert' : ''
                    }`}>
                    <p className='mb-0 whitespace-pre-wrap break-words leading-relaxed'>
                      {message.content}
                    </p>
                  </div>

                  {/* Reaction Badge */}
                  {reaction && (
                    <div
                      className={`absolute -bottom-1.5 ${
                        isUser ? 'left-3' : 'right-3'
                      } bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-600`}>
                      {reaction.type === 'like' ? (
                        <ThumbsUp className='w-2.5 h-2.5 text-blue-500' />
                      ) : reaction.type === 'dislike' ? (
                        <ThumbsDown className='w-2.5 h-2.5 text-red-500' />
                      ) : (
                        <Heart
                          className={`w-2.5 h-2.5 ${
                            darkMode ? 'text-pink-400' : 'text-pink-500'
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons and Timestamp Row for AI messages */}
                <div
                  className={`flex items-center justify-between mt-2 ml-2 ${
                    !isUser ? 'opacity-100' : 'opacity-0'
                  }`}>
                  {/* Timestamp - Always visible on left */}
                  <div
                    className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                    {new Date(
                      message.timestamp || Date.now(),
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  {/* Action Buttons - Only visible on hover on right */}
                  <div
                    className={`flex items-center space-x-1 transition-opacity duration-200 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                    {/* Copy Button */}
                    <Button
                      variant='ghost'
                      size='sm'
                      className={`h-7 px-2 text-xs transition-colors ${
                        copiedMessageId === message.id
                          ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                          : darkMode
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() =>
                        copyToClipboard(message.content, message.id)
                      }>
                      {copiedMessageId === message.id ? (
                        <>
                          <Check className='w-3 h-3 mr-1' /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className='w-3 h-3 mr-1' /> Copy
                        </>
                      )}
                    </Button>

                    {/* Reaction Buttons */}
                    <Button
                      variant='ghost'
                      size='sm'
                      className={`h-7 px-2 transition-colors ${
                        reaction?.type === 'like'
                          ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : darkMode
                          ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
                          : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100'
                      }`}
                      onClick={() => handleReaction(message.id, 'like')}>
                      <ThumbsUp
                        className={`w-3 h-3 ${
                          reaction?.type === 'like' ? 'fill-current' : ''
                        }`}
                      />
                    </Button>

                    {/* Theme-aware Heart Button */}
                    <Button
                      variant='ghost'
                      size='sm'
                      className={`h-7 px-2 transition-colors ${
                        reaction?.type === 'love'
                          ? darkMode
                            ? 'text-pink-400 bg-pink-900/20'
                            : 'text-pink-500 bg-pink-50'
                          : darkMode
                          ? 'text-gray-400 hover:text-pink-400 hover:bg-gray-800'
                          : 'text-gray-500 hover:text-pink-500 hover:bg-gray-100'
                      }`}
                      onClick={() => handleReaction(message.id, 'love')}>
                      <Heart
                        className={`w-3 h-3 transition-colors ${
                          reaction?.type === 'love' ? 'fill-current' : ''
                        } ${
                          darkMode
                            ? 'text-pink-400 hover:text-pink-300'
                            : 'text-pink-500 hover:text-pink-600'
                        }`}
                      />
                    </Button>

                    <Button
                      variant='ghost'
                      size='sm'
                      className={`h-7 px-2 transition-colors ${
                        reaction?.type === 'dislike'
                          ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                          : darkMode
                          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                          : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                      }`}
                      onClick={() => handleReaction(message.id, 'dislike')}>
                      <ThumbsDown
                        className={`w-3 h-3 ${
                          reaction?.type === 'dislike' ? 'fill-current' : ''
                        }`}
                      />
                    </Button>

                    <Button
                      variant='ghost'
                      size='sm'
                      className={`h-7 px-2 transition-colors ${
                        darkMode
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}>
                      <MoreHorizontal className='w-3 h-3' />
                    </Button>
                  </div>
                </div>

                {/* Timestamp for User messages */}
                {isUser && (
                  <div
                    className={`text-xs mt-1 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                    {new Date(
                      message.timestamp || Date.now(),
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className='flex-shrink-0 ml-3'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600`}>
                    <User className='w-4 h-4 text-white' />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Simple Typing Indicator */}
        {isTyping && (
          <div className='flex justify-start'>
            <div className='flex-shrink-0 mr-3'>
              <div className='relative'>
                <div className='w-8 h-8 rounded-full overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-500 to-purple-600'>
                  <img
                    src={persona?.avatarUrl}
                    alt={`${persona?.name} avatar`}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm text-white'
                    style={{ display: 'none' }}>
                    {persona?.avatar}
                  </div>
                </div>
                <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-900'></div>
              </div>
            </div>

            <div
              className={`rounded-2xl px-4 py-3 ${
                darkMode
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
              <div className='flex items-center space-x-1'>
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-gray-400' : 'bg-gray-500'
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  />
                ))}
                <span
                  className={`text-xs ml-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  {persona?.name} is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar-light {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f9fafb;
        }

        .custom-scrollbar-dark {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }

        .custom-scrollbar-light::-webkit-scrollbar,
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 3px;
        }

        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }

        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }

        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default ChatMessages;
