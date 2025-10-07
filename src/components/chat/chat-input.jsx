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
          ? 'bg-slate-950/95 border-slate-800/50'
          : 'bg-white/95 border-slate-200/50'
      } border-t backdrop-blur-xl`}>
      {/* Compact Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute bottom-full left-0 right-0 mb-1 mx-3 rounded-2xl border shadow-xl backdrop-blur-xl ${
              darkMode
                ? 'bg-slate-900/95 border-slate-700/50'
                : 'bg-white/95 border-slate-200/50'
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

      {/* Main Input Container - Centered with max-width */}
      <div className='p-3 flex justify-center'>
        <div className='w-full max-w-3xl'>
          <div
            className={`relative rounded-xl border transition-all duration-200 ${
              isFocused
                ? darkMode
                  ? 'bg-[#1a1a1a] border-[#3b82f6]'
                  : 'bg-white border-[#2563eb]'
                : darkMode
                ? 'bg-[#1a1a1a] border-[#2a2a2a]'
                : 'bg-white border-[#e5e7eb]'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>

            {/* Input Content with bottom-aligned avatar and button */}
            <div className='flex items-end p-3 space-x-3'>
              {/* AI Assistant Avatar - Bottom aligned */}
              {persona && (
                <div className='flex-shrink-0 pb-0.5'>
                  <div className='relative'>
                    <img
                      src={persona.avatarUrl}
                      alt={`${persona.name} avatar`}
                      className='w-8 h-8 rounded-full object-cover'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className='w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-sm'
                      style={{ display: 'none' }}>
                      {persona.avatar}
                    </div>

                    {/* Online indicator */}
                    <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white'></div>
                  </div>
                </div>
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
                      ? 'text-white placeholder-gray-500'
                      : 'text-gray-900 placeholder-gray-500'
                  } focus:outline-none text-sm leading-relaxed`}
                  rows={1}
                  style={{
                    minHeight: '24px',
                    maxHeight: '120px',
                  }}
                />
              </div>

              {/* Action Buttons - Bottom aligned */}
              <div className='flex items-center space-x-2 flex-shrink-0 pb-0.5'>
                {/* AI Suggestions Button - Only when no text */}
                {!hasText && (
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      showSuggestions
                        ? 'bg-[#2563eb] text-white'
                        : darkMode
                        ? 'text-gray-400 hover:text-[#3b82f6] hover:bg-[#262626]'
                        : 'text-gray-500 hover:text-[#2563eb] hover:bg-[#f5f5f5]'
                    }`}>
                    <Sparkles className='w-4 h-4' />
                  </button>
                )}

                {/* Send Button */}
                <button
                  onClick={canSend ? handleSend : undefined}
                  disabled={!canSend}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    canSend
                      ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                      : darkMode
                      ? 'bg-[#262626] text-gray-500 cursor-not-allowed'
                      : 'bg-[#f5f5f5] text-gray-400 cursor-not-allowed'
                  }`}>
                  {isSubmitting ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <ArrowUp className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Status - Inside max-w container */}
          <div className='mt-2 px-1'>
            {isTyping ? (
              <div className='flex items-center space-x-2'>
                <div className='flex space-x-1'>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className='w-1 h-1 bg-[#2563eb] rounded-full animate-pulse'
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {persona?.name} is thinking...
                </span>
              </div>
            ) : !selectedPersona ? (
              <div className='flex items-center space-x-2'>
                <Brain className='w-3 h-3 text-gray-500' />
                <span className='text-xs text-gray-500'>
                  Choose AI mentor to begin
                </span>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <span
                  className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                  Press Enter to send
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
