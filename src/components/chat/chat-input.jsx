'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatInput = ({
  onSendMessage,
  disabled,
  selectedPersona,
  isLoading
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const suggestions = [
    { text: 'Explain this concept...', category: '💡', emoji: true },
    { text: 'Help me build...', category: '🚀', emoji: true },
    { text: 'Career advice on...', category: '🎯', emoji: true },
    { text: 'Debug my code...', category: '🐛', emoji: true },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 100) + 'px';
    }
  }, [message]);

  // Listen for custom event to set input value from welcome cards
  useEffect(() => {
    const handleSetInputEvent = (e) => {
      setMessage(e.detail);
      // Auto-focus textarea when input is set
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    window.addEventListener('setInputValue', handleSetInputEvent);
    return () => {
      window.removeEventListener('setInputValue', handleSetInputEvent);
    };
  }, []);

  const onSubmit = (e) => {
    e?.preventDefault();
    console.log('📤 Form submit:', { message, disabled });

    if (!message.trim() || disabled || isLoading) {
      console.log('⚠️ Submit blocked');
      return;
    }

    if (onSendMessage) {
      console.log('✅ Calling onSendMessage with:', message);
      onSendMessage(message.trim());
      setMessage('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion.text);
    textareaRef.current?.focus();
  };

  const showSuggestions = !message.trim() && !disabled;

  return (
    <div className='absolute bottom-0 left-0 right-0 p-4 pointer-events-none'>
      <div className='max-w-4xl mx-auto pointer-events-auto'>
        {/* Quick Suggestions */}
        {showSuggestions && (
          <div className='mb-3'>
            <div className='flex items-center gap-2 flex-wrap'>
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className='group px-3 py-2 rounded-xl bg-background/95 backdrop-blur-sm border border-border/60 hover:border-[#FA8072]/40 hover:bg-accent/80 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md'
                >
                  <span className='mr-1.5'>{suggestion.category}</span>
                  <span className='text-foreground/80 group-hover:text-foreground'>{suggestion.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Compact Floating Input Box */}
        <form onSubmit={onSubmit}>
          <div
            className={`relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border backdrop-blur-xl transition-all duration-200 ${
              isFocused
                ? 'border-[#FA8072]/50 bg-background/98 shadow-2xl ring-2 ring-[#FA8072]/10'
                : 'border-border/60 bg-background/95 shadow-lg hover:shadow-xl'
            }`}
          >
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                disabled
                  ? 'Select a mentor to start chatting...'
                  : 'Type your message...'
              }
              disabled={disabled}
              rows={1}
              className='flex-1 resize-none bg-transparent border-none outline-none text-sm leading-snug text-foreground placeholder:text-muted-foreground/50 disabled:opacity-50 min-h-[24px] max-h-[100px]'
              style={{ height: 'auto' }}
            />

            {/* Compact Send Button */}
            <Button
              type='submit'
              size='sm'
              disabled={!message.trim() || disabled}
              className={`h-8 w-8 p-0 rounded-lg flex-shrink-0 transition-all duration-200 ${
                !message.trim() || disabled
                  ? 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] text-white hover:from-[#FF9189] hover:to-[#FFA3A3] shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              <Send className='w-3.5 h-3.5' />
            </Button>
          </div>

          {/* Footer Info */}
          <div className='flex items-center justify-between mt-2.5 px-2'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground/70'>
              <Sparkles className='w-3.5 h-3.5 text-[#FA8072]' />
              <span className='font-medium'>Powered by AI</span>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground/70'>
              <kbd className='px-2 py-1 rounded-md bg-muted/60 border border-border/50 text-xs font-semibold shadow-sm'>
                Enter
              </kbd>
              <span>to send</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
