// src/components/chat/chat-input.jsx
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Sparkles,
  Code,
  Lightbulb,
  ArrowUp,
  Brain,
  FileText,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ChatInput = ({ onSendMessage, selectedPersona, isTyping }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef(null);
  const { darkMode } = useChatStore();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  useEffect(() => {
    if (selectedPersona && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedPersona]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isTyping || isSubmitting || !selectedPersona) {
      return;
    }

    const messageText = message.trim();
    setMessage('');
    setIsSubmitting(true);

    try {
      await onSendMessage(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const intelligentSuggestions = [
    {
      icon: Code,
      text: 'Help me learn React components',
      category: 'Code',
    },
    {
      icon: Lightbulb,
      text: "What's the best career path for a beginner?",
      category: 'Career',
    },
    {
      icon: Brain,
      text: 'Explain JavaScript async/await concepts',
      category: 'Learn',
    },
    {
      icon: FileText,
      text: 'Review my code and suggest improvements',
      category: 'Review',
    },
  ];

  const persona = personas[selectedPersona];
  const hasText = message.trim().length > 0;
  const canSend = hasText && !isTyping && !isSubmitting && selectedPersona;

  return (
    <div
      className={`relative ${
        darkMode
          ? 'bg-gray-950/95 border-gray-800/50'
          : 'bg-white/95 border-gray-200/50'
      } border-t backdrop-blur-xl`}>
      {/* Compact Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute bottom-full left-0 right-0 mb-1 mx-3 rounded-xl border shadow-xl backdrop-blur-xl ${
              darkMode
                ? 'bg-gray-900/95 border-gray-700/50'
                : 'bg-white/95 border-gray-200/50'
            }`}>
            {/* Header - Compact */}
            <div className='p-3 border-b border-gray-200/20'>
              <div className='flex items-center space-x-2'>
                <div className='w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
                  <Sparkles className='w-2.5 h-2.5 text-white' />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                  AI Suggestions
                </span>
              </div>
            </div>

            {/* Suggestions Grid - Compact */}
            <div className='p-3 grid grid-cols-2 gap-2'>
              {intelligentSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    setMessage(suggestion.text);
                    setShowSuggestions(false);
                    textareaRef.current?.focus();
                  }}
                  className={`group p-2.5 rounded-lg text-left transition-all duration-200 border ${
                    darkMode
                      ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-blue-500/30'
                      : 'bg-gray-50/80 border-gray-200/50 hover:bg-white hover:border-blue-300/50'
                  } hover:shadow-md`}>
                  <div className='flex items-start space-x-2'>
                    <div
                      className={`p-1.5 rounded-lg ${
                        darkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
                      } group-hover:scale-105 transition-transform`}>
                      <suggestion.icon className='w-3 h-3 text-blue-500' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div
                        className={`text-xs font-medium mb-0.5 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                        {suggestion.category}
                      </div>
                      <div
                        className={`text-xs leading-tight ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        {suggestion.text}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Container - Very Compact */}
      <div className='p-3'>
        <div
          className={`relative rounded-xl border transition-all duration-300 ${
            isFocused
              ? darkMode
                ? 'bg-gray-900/80 border-blue-500/50 shadow-xl shadow-blue-500/10'
                : 'bg-white border-blue-400/50 shadow-xl shadow-blue-400/10'
              : isHovered
              ? darkMode
                ? 'bg-gray-900/60 border-gray-600/60'
                : 'bg-gray-50/80 border-gray-300/60'
              : darkMode
              ? 'bg-gray-900/40 border-gray-700/40'
              : 'bg-gray-50/60 border-gray-300/40'
          } backdrop-blur-xl`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {/* Copilot gradient border effect */}
          {isFocused && (
            <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10 blur-lg' />
          )}

          {/* Input Content - Very Compact */}
          <div className='flex items-center p-2.5 space-x-2.5'>
            {/* AI Assistant Avatar - Compact */}
            {persona && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='flex-shrink-0'>
                <div className='relative'>
                  <img
                    src={persona.avatarUrl}
                    alt={`${persona.name} avatar`}
                    className='w-6 h-6 rounded-full object-cover border border-blue-500/30'
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs border border-blue-500/30'
                    style={{ display: 'none' }}>
                    {persona.avatar}
                  </div>

                  {/* Online indicator - very small */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white'></motion.div>
                </div>
              </motion.div>
            )}

            {/* Text Input */}
            <div className='flex-1'>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  selectedPersona
                    ? `Ask ${persona?.name}...`
                    : 'Select mentor to start...'
                }
                disabled={!selectedPersona || isSubmitting}
                className={`w-full resize-none bg-transparent border-none ${
                  darkMode
                    ? 'text-gray-100 placeholder-gray-500'
                    : 'text-gray-900 placeholder-gray-500'
                } focus:outline-none text-sm leading-5 font-medium`}
                rows={1}
                style={{
                  minHeight: '18px',
                  maxHeight: '80px',
                }}
              />
            </div>

            {/* Action Buttons - Minimal */}
            <div className='flex items-center space-x-1.5 flex-shrink-0'>
              {/* AI Suggestions Button - Only when no text */}
              {!hasText && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    showSuggestions
                      ? 'bg-blue-500 text-white shadow-md'
                      : darkMode
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-800/50'
                      : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                  }`}>
                  <Sparkles className='w-3.5 h-3.5' />
                </motion.button>
              )}

              {/* Send Button - Very Compact */}
              <motion.button
                whileHover={{ scale: canSend ? 1.05 : 1 }}
                whileTap={{ scale: canSend ? 0.95 : 1 }}
                onClick={canSend ? handleSend : undefined}
                disabled={!canSend}
                className={`relative p-2 rounded-lg transition-all duration-300 ${
                  canSend
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                    : darkMode
                    ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
                }`}>
                {/* Copilot glow effect - subtle */}
                {canSend && (
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className='absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-sm -z-10'
                  />
                )}

                <AnimatePresence mode='wait'>
                  {isSubmitting ? (
                    <motion.div
                      key='loading'
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      exit={{ scale: 0 }}
                      transition={{
                        scale: { duration: 0.2 },
                        rotate: {
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        },
                      }}>
                      <Loader2 className='w-3.5 h-3.5' />
                    </motion.div>
                  ) : canSend ? (
                    <motion.div
                      key='send'
                      initial={{ scale: 0, y: 3 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: -3 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}>
                      <ArrowUp className='w-3.5 h-3.5' />
                    </motion.div>
                  ) : (
                    <motion.div
                      key='disabled'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}>
                      <ArrowUp className='w-3.5 h-3.5' />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Status - Very Compact */}
        <div className='mt-1.5 px-1'>
          <AnimatePresence>
            {isTyping ? (
              <motion.div
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className='flex items-center space-x-1.5'>
                <div className='flex space-x-0.5'>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className='w-1 h-1 bg-blue-500 rounded-full'
                    />
                  ))}
                </div>
                <span
                  className={`text-xs ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                  {persona?.name} is thinking...
                </span>
              </motion.div>
            ) : !selectedPersona ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex items-center space-x-1.5'>
                <Brain className='w-3 h-3 text-purple-500' />
                <span className='text-xs text-purple-600 font-medium'>
                  Choose AI mentor to begin
                </span>
              </motion.div>
            ) : (
              <div className='flex items-center justify-between'>
                <div
                  className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                  Enter to send
                </div>
                <div className='flex items-center space-x-1'>
                  <div className='w-1 h-1 bg-green-500 rounded-full animate-pulse' />
                  <div
                    className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                    AI
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
