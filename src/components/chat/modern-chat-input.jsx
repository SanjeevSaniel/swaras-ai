'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Code,
  Lightbulb,
  Brain,
  FileText,
  Paperclip,
  Mic,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personaManager } from '@/constants/config';

const ModernChatInput = ({ onSendMessage, disabled, selectedPersona }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef(null);
  const persona = personaManager.getPersona(selectedPersona);

  const suggestions = [
    {
      icon: Code,
      text: 'Help me understand this concept',
      category: 'Learn',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Lightbulb,
      text: 'Give me actionable advice',
      category: 'Advice',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Brain,
      text: 'Explain this in simple terms',
      category: 'Explain',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: FileText,
      text: 'Review and provide feedback',
      category: 'Review',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      setShowSuggestions(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.text);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className='border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl p-4 space-y-4'>
      {/* AI Suggestions */}
      <AnimatePresence>
        {showSuggestions && input.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className='grid grid-cols-2 md:grid-cols-4 gap-2'
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className='group relative p-3 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 text-left overflow-hidden'
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className='relative z-10'>
                  <suggestion.icon className='w-4 h-4 text-slate-400 mb-2 group-hover:text-slate-300 transition-colors' />
                  <p className='text-xs text-slate-300 line-clamp-2 leading-relaxed'>
                    {suggestion.text}
                  </p>
                  <span className='text-[10px] text-slate-500 mt-1 inline-block'>
                    {suggestion.category}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className='relative'>
        <div className='relative flex items-end gap-2'>
          {/* Persona indicator */}
          {persona && (
            <div className='flex-shrink-0 self-end mb-2'>
              <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg'>
                <span className='text-xl'>{persona.avatar}</span>
              </div>
            </div>
          )}

          {/* Input container */}
          <div className='flex-1 relative'>
            <div className='relative rounded-2xl bg-slate-800/50 border border-slate-700/50 focus-within:border-purple-500/50 focus-within:bg-slate-800/70 transition-all duration-300 shadow-lg'>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  persona
                    ? `Ask ${persona.name} anything...`
                    : 'Type your message...'
                }
                disabled={disabled}
                className='w-full px-5 py-4 bg-transparent text-slate-100 placeholder:text-slate-500 resize-none outline-none min-h-[56px] max-h-[120px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent'
                rows={1}
              />

              {/* Character count (if getting long) */}
              {input.length > 400 && (
                <div className='absolute bottom-2 left-4 text-xs text-slate-500'>
                  {input.length}/5000
                </div>
              )}

              {/* Bottom action bar */}
              <div className='flex items-center justify-between px-3 pb-2'>
                <div className='flex items-center gap-1'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-slate-300'
                    disabled={disabled}
                  >
                    <Paperclip className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-slate-300'
                    disabled={disabled}
                  >
                    <Mic className='h-4 w-4' />
                  </Button>
                </div>

                {input.trim() && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='text-xs text-slate-500'
                  >
                    Press Enter to send, Shift+Enter for new line
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Send button */}
          <Button
            type='submit'
            disabled={disabled || !input.trim()}
            className='flex-shrink-0 self-end h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100'
          >
            {disabled ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className='h-5 w-5 text-white' />
              </motion.div>
            ) : (
              <Send className='h-5 w-5 text-white' />
            )}
          </Button>
        </div>

        {/* Footer hint */}
        {!disabled && input.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='mt-2 px-2 text-xs text-slate-500 flex items-center gap-2'
          >
            <Zap className='h-3 w-3' />
            <span>Powered by GPT-4o • Real-time responses</span>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default ModernChatInput;
