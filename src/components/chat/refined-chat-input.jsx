'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react';
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
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
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
    <div className='border-t border-border bg-background'>
      {/* Suggestions */}
      {showSuggestions && (
        <div className='p-3 border-b border-border'>
          <div className='flex items-center gap-2 flex-wrap'>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className='px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent transition-colors text-xs font-medium text-foreground'
              >
                <span className='text-muted-foreground mr-1.5'>{suggestion.category}</span>
                {suggestion.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className='p-4'>
        <div
          className={`relative flex items-end gap-2 p-3 rounded-2xl border transition-all ${
            isFocused
              ? 'border-primary bg-card shadow-sm'
              : 'border-border bg-card'
          }`}
        >
          {/* Attachment Button */}
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 hover:bg-accent flex-shrink-0'
            disabled={disabled}
          >
            <Paperclip className='w-4.5 h-4.5 text-muted-foreground' />
          </Button>

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
                ? 'Please select a mentor first...'
                : 'Type your message...'
            }
            disabled={disabled}
            rows={1}
            className='flex-1 resize-none bg-transparent border-none outline-none text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground disabled:opacity-50 min-h-[32px] max-h-[120px]'
            style={{ height: 'auto' }}
          />

          {/* Voice Input Button */}
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 hover:bg-accent flex-shrink-0'
            disabled={disabled}
          >
            <Mic className='w-4.5 h-4.5 text-muted-foreground' />
          </Button>

          {/* Send Button */}
          <Button
            type='submit'
            size='sm'
            disabled={!message.trim() || disabled}
            className='h-8 w-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 flex-shrink-0'
          >
            <Send className='w-4.5 h-4.5' />
          </Button>
        </div>

        {/* Footer Hints */}
        <div className='flex items-center justify-between mt-2 px-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>AI-powered responses</span>
          </div>
          <div className='text-xs text-muted-foreground'>
            <kbd className='px-1.5 py-0.5 rounded bg-muted text-xs'>Enter</kbd> to send
            <span className='mx-1'>•</span>
            <kbd className='px-1.5 py-0.5 rounded bg-muted text-xs'>Shift + Enter</kbd> for new line
          </div>
        </div>
      </form>
    </div>
  );
};

export default RefinedChatInput;
