'use client';
import { logger } from '@/utils/logger';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { personas } from '@/constants/personas';

const ChatInput = ({
  onSendMessage,
  disabled,
  selectedPersona,
  isLoading,
  userUsage,
  isRateLimited,
  hideSuggestions = false,
  compact = false,
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Get suggestions from the selected persona configuration
  const suggestions = personas[selectedPersona]?.suggestionPills || [
    {
      display: 'Explain this concept...',
      full: 'Can you explain this concept in detail?',
      category: '💡',
    },
    {
      display: 'Help me with...',
      full: 'I need help with understanding this topic',
      category: '🚀',
    },
    {
      display: 'Advice on...',
      full: 'What advice do you have about this situation?',
      category: '🎯',
    },
    {
      display: 'Tell me about...',
      full: 'Tell me more about your expertise and experience',
      category: '✨',
    },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Max height for 5 rows: line-height (1.5 * 14px) * 5 rows ≈ 105px
      const maxHeight = 105;
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + 'px';
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

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          logger.log('🎤 Speech recognition started');
        };

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join('');

          setMessage(transcript);
          logger.log('🗣️ Transcript:', transcript);
        };

        recognition.onerror = (event) => {
          logger.error('❌ Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          logger.log('🎤 Speech recognition ended');
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Countdown timer for rate limit reset
  useEffect(() => {
    if (!userUsage || !userUsage.resetAt) return;

    const updateCountdown = () => {
      const resetTime = new Date(userUsage.resetAt).getTime();
      const now = Date.now();
      const diff = resetTime - now;

      if (diff <= 0) {
        setTimeUntilReset('Ready to reset!');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [userUsage]);

  const onSubmit = (e) => {
    e?.preventDefault();
    logger.log('📤 Form submit:', { message, disabled });

    if (!message.trim() || disabled || isLoading) {
      logger.log('⚠️ Submit blocked');
      return;
    }

    if (onSendMessage) {
      logger.log('✅ Calling onSendMessage with:', message);
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
    setMessage(suggestion.full || suggestion.text);
    textareaRef.current?.focus();
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current || disabled) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        logger.error('Error starting speech recognition:', error);
      }
    }
  };

  const showSuggestions = !hideSuggestions && !message.trim() && !disabled;

  return (
    <div
      className={
        compact
          ? 'w-full bg-white border-t border-zinc-100 px-3'
          : 'absolute bottom-0 left-0 right-0 p-2 sm:p-4 pointer-events-none'
      }>
      <div
        className={
          compact ? 'w-full' : 'max-w-4xl mx-auto pointer-events-auto'
        }>
        {/* Quick Suggestions - Mobile Optimized */}
        {showSuggestions && (
          <div className='mb-2 sm:mb-3'>
            <div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className='group px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-background/95 backdrop-blur-sm border border-border/60 hover:border-[#FA8072]/40 hover:bg-accent/80 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md'>
                  <span className='mr-1 sm:mr-1.5'>{suggestion.category}</span>
                  <span className='text-foreground/80 group-hover:text-foreground'>
                    {suggestion.display || suggestion.text}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Compact Floating Input Box - Mobile Optimized */}
        <form onSubmit={onSubmit}>
          <div
            className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border backdrop-blur-xl transition-all duration-200 ${
              compact
                ? isFocused
                  ? 'border-[#FA8072]/50 bg-white shadow-2xl ring-2 ring-[#FA8072]/10'
                  : 'border-zinc-200 bg-white shadow-lg hover:shadow-xl'
                : isFocused
                ? 'border-[#FA8072]/50 bg-background/98 shadow-2xl ring-2 ring-[#FA8072]/10'
                : 'border-border/60 bg-background/95 shadow-lg hover:shadow-xl'
            }`}>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                isRateLimited
                  ? compact
                    ? 'Free limit reached. Sign up to continue!'
                    : `Daily limit reached. Resets in ${
                        timeUntilReset || 'calculating...'
                      }`
                  : disabled
                  ? 'Select a mentor to start chatting...'
                  : isListening
                  ? 'Listening...'
                  : 'Type your message...'
              }
              disabled={disabled}
              rows={1}
              className={
                compact
                  ? 'flex-1 resize-none bg-transparent border-none outline-none text-sm leading-[1.5] text-zinc-900 placeholder:text-zinc-400 disabled:opacity-50 min-h-[21px] max-h-[105px] overflow-y-auto custom-scrollbar'
                  : 'flex-1 resize-none bg-transparent border-none outline-none text-sm leading-[1.5] text-foreground placeholder:text-muted-foreground/50 disabled:opacity-50 min-h-[21px] max-h-[105px] overflow-y-auto custom-scrollbar'
              }
              style={{
                height: 'auto',
              }}
            />

            {/* Voice Input Button - Mobile Optimized */}
            {speechSupported && (
              <motion.button
                type='button'
                onClick={toggleVoiceRecording}
                disabled={disabled}
                whileTap={{ scale: 0.95 }}
                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                  compact
                    ? disabled
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : isListening
                      ? 'bg-red-500 text-white shadow-lg animate-pulse'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                    : disabled
                    ? 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
                    : isListening
                    ? 'bg-red-500 text-white shadow-lg animate-pulse'
                    : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-md'
                }`}
                title={isListening ? 'Stop recording' : 'Start voice input'}>
                {isListening ? (
                  <MicOff className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                ) : (
                  <Mic className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                )}
              </motion.button>
            )}

            {/* Compact Send Button - Mobile Optimized */}
            <Button
              type='submit'
              size='sm'
              variant='default'
              disabled={!message.trim() || disabled}
              className={`h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg flex-shrink-0 transition-all duration-200 ${
                !message.trim() || disabled
                  ? compact
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] text-white hover:from-[#FF9189] hover:to-[#FFA3A3] shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
              }`}>
              <Send className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
            </Button>
          </div>

          {/* Footer Info - Mobile Optimized */}
          <div className='flex items-center justify-between mt-1.5 sm:mt-2.5 px-1 sm:px-2'>
            <div className='flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground/70'>
              <Sparkles className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FA8072]' />
              <span className='font-medium hidden sm:inline'>
                Powered by AI
              </span>
              <span className='font-medium sm:hidden'>AI</span>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              {/* {userUsage && (
                <span className={`font-medium ${
                  userUsage.remaining <= 0
                    ? 'text-red-500'
                    : userUsage.remaining <= 3
                    ? 'text-orange-500'
                    : 'text-muted-foreground/70'
                }`}>
                  {userUsage.remaining} left today
                </span>
              )} */}
              <div className='hidden sm:flex items-center gap-2 text-muted-foreground/70'>
                <kbd className='px-2 py-1 rounded-md bg-muted/60 border border-border/50 text-xs font-semibold shadow-sm'>
                  Enter
                </kbd>
                <span>to send</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
