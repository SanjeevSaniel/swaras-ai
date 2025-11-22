'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RefinedChatInput = ({ onSendMessage, disabled, selectedPersona }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const suggestions = [
    { text: 'Explain this concept...', category: 'Learn' },
    { text: 'Help me understand...', category: 'Understand' },
    { text: 'Give me advice on...', category: 'Advice' },
    { text: 'What do you think about...', category: 'Discuss' },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 100) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion.text);
    textareaRef.current?.focus();
  };

  const showSuggestions = !message.trim() && !disabled;

  return (
    <div className='border-t border-border/50 bg-background/95 backdrop-blur-sm'>
      {/* Suggestions */}
      {showSuggestions && (
        <div className='p-2.5 border-b border-border/50'>
          <div className='flex items-center gap-1.5 flex-wrap'>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className='px-2.5 py-1.5 rounded-lg bg-card border border-border/50 hover:border-[#FA8072]/30 hover:bg-accent transition-all duration-150 text-[10px] font-medium text-foreground'
              >
                <span className='text-[#FA8072] mr-1'>{suggestion.category}</span>
                {suggestion.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className='p-3'>
        <div
          className={`relative flex items-end gap-2 p-2.5 rounded-xl border transition-all duration-200 ${
            isFocused
              ? 'border-[#FA8072]/40 bg-card shadow-sm'
              : 'border-border/50 bg-card'
          }`}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              disabled
                ? 'Select a mentor to start...'
                : 'Message your AI mentor...'
            }
            disabled={disabled}
            rows={1}
            className='flex-1 resize-none bg-transparent border-none outline-none text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 disabled:opacity-50 min-h-[28px] max-h-[100px]'
            style={{ height: 'auto' }}
          />

          {/* Send Button */}
          <Button
            type='submit'
            size='sm'
            disabled={!message.trim() || disabled}
            className='h-7 w-7 p-0 text-white disabled:opacity-40 flex-shrink-0 shadow-sm transition-all duration-200'
            style={!message.trim() || disabled ? {} : {
              background: 'linear-gradient(to right, #FA8072, #FF8E8E)',
            }}
            onMouseEnter={(e) => {
              if (message.trim() && !disabled) {
                e.currentTarget.style.background = 'linear-gradient(to right, #FF9189, #FFA3A3)';
              }
            }}
            onMouseLeave={(e) => {
              if (message.trim() && !disabled) {
                e.currentTarget.style.background = 'linear-gradient(to right, #FA8072, #FF8E8E)';
              }
            }}
          >
            <Send className='w-3.5 h-3.5' />
          </Button>
        </div>

        {/* Footer Hints */}
        <div className='flex items-center justify-between mt-2 px-1'>
          <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground/70'>
            <Sparkles className='w-3 h-3 text-[#FA8072]' />
            <span>AI-powered responses</span>
          </div>
          <div className='text-[10px] text-muted-foreground/70'>
            <kbd className='px-1 py-0.5 rounded bg-muted text-[9px] font-medium'>Enter</kbd> to send
          </div>
        </div>
      </form>
    </div>
  );
};

export default RefinedChatInput;
