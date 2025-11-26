'use client';
import { logger } from '@/utils/logger';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ChatInput = ({ onSendMessage, disabled, selectedPersona, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Persona-specific quick suggestions
  const getPersonaSuggestions = (personaId) => {
    const suggestions = {
      hitesh: [
        { display: 'Explain async/await...', full: 'Explain async/await in JavaScript with a chai analogy', category: '☕' },
        { display: 'React best practices...', full: 'What are the best practices for React development?', category: '⚛️' },
        { display: 'Help debug this...', full: 'Help me debug this code issue', category: '🐛' },
        { display: 'Career roadmap...', full: 'What is the best career roadmap for full-stack development?', category: '🎯' },
      ],
      piyush: [
        { display: 'System design for...', full: 'How would you design a scalable URL shortener system?', category: '🏗️' },
        { display: 'Scale this feature...', full: 'How do I scale this feature to handle millions of users?', category: '📈' },
        { display: 'Interview prep...', full: 'How should I prepare for system design interviews at FAANG?', category: '💼' },
        { display: 'Architecture review...', full: 'Can you review my architecture and suggest improvements?', category: '🎯' },
      ],
      foodpharmer: [
        { display: 'Is this healthy?...', full: 'Is brown sugar actually healthier than white sugar?', category: '🥗' },
        { display: 'Decode label...', full: 'Help me decode this product label for hidden ingredients', category: '🔍' },
        { display: 'Best protein source...', full: 'What are the best natural protein sources vs supplements?', category: '💪' },
        { display: 'Diet myth check...', full: 'Can you fact-check this diet myth with scientific evidence?', category: '🔬' },
      ],
      johnnyharris: [
        { display: 'Why did this happen?...', full: 'Why is the South China Sea so heavily contested?', category: '🗺️' },
        { display: 'History behind...', full: 'What is the history behind the Israel-Palestine conflict?', category: '📜' },
        { display: 'Geopolitics of...', full: 'Explain the geopolitics of the Ukraine-Russia situation', category: '🌍' },
        { display: 'Explain the conflict...', full: 'Can you explain what really caused this conflict?', category: '⚔️' },
      ],
      lla: [
        { display: 'My rights for...', full: 'What are my rights if my employer fires me without notice period?', category: '⚖️' },
        { display: 'Legal action for...', full: 'What legal action can I take for workplace harassment?', category: '📋' },
        { display: 'PF/ESI query...', full: 'How do I claim my PF if the company refuses to release it?', category: '💼' },
        { display: 'Termination issue...', full: 'My employer terminated me unfairly, what should I do?', category: '🚨' },
      ],
      zero1: [
        { display: 'Start investing...', full: 'How should I start investing with ₹10,000 as a complete beginner?', category: '💰' },
        { display: 'Mutual funds vs stocks...', full: 'Should I invest in mutual funds or direct stocks as a beginner?', category: '📊' },
        { display: 'SIP strategy...', full: 'What is SIP and how do I create a good SIP investment strategy?', category: '📈' },
        { display: 'Emergency fund...', full: 'How much should I save in an emergency fund and where should I keep it?', category: '🎯' },
      ],
      aliabdaal: [
        { display: 'Productivity tips...', full: 'What are evidence-based productivity tips that actually work?', category: '⚡' },
        { display: 'Study technique...', full: 'What study techniques does research show are most effective?', category: '📚' },
        { display: 'Build habits...', full: 'How do I build sustainable habits that stick long-term?', category: '🎯' },
        { display: 'Time management...', full: 'What are the best time management strategies for students and professionals?', category: '⏰' },
      ],
      kunalshah: [
        { display: 'Delta 4 for...', full: 'Explain Delta 4 theory with real startup examples', category: '🧠' },
        { display: 'First principles...', full: 'How do I apply first principles thinking to solve business problems?', category: '💡' },
        { display: 'Market inefficiency...', full: 'How can I spot inefficiencies in existing markets to build a startup?', category: '🎯' },
        { display: 'Startup strategy...', full: 'What makes a product truly irreversible for users?', category: '🚀' },
      ],
      markmanson: [
        { display: 'Life advice on...', full: 'How do I stop caring about what other people think of me?', category: '💭' },
        { display: 'Stop caring about...', full: 'How do I choose what problems are worth caring about in life?', category: '🎯' },
        { display: 'Find meaning in...', full: 'How do I find meaning when everything feels pointless?', category: '🌟' },
        { display: 'Harsh truth about...', full: 'Give me the harsh truth about why positive thinking can be harmful', category: '💥' },
      ],
      ankurwarikoo: [
        { display: 'Money advice...', full: 'Should I invest in mutual funds or stocks first as a beginner?', category: '💰' },
        { display: 'Career switch...', full: 'How do I negotiate salary in a job interview without seeming greedy?', category: '💼' },
        { display: 'Investment tips...', full: 'What are the best money habits to build in your 20s?', category: '📈' },
        { display: 'Life lesson on...', full: 'What life lessons should everyone know about money and career?', category: '🎯' },
      ],
      flyingbeast: [
        { display: 'Workout routine...', full: 'What is the best beginner gym routine for natural muscle gain?', category: '💪' },
        { display: 'Stay disciplined...', full: 'How do I stay disciplined with early morning workouts consistently?', category: '⚡' },
        { display: 'Diet plan...', full: 'What should my diet plan look like for muscle gain and fat loss?', category: '🥗' },
        { display: 'Balance life...', full: 'How do you balance career, fitness, and family life effectively?', category: '✈️' },
      ],
      saptarshiux: [
        { display: 'UX portfolio tips...', full: 'How should I structure my UX design portfolio to stand out?', category: '🎨' },
        { display: 'User research...', full: 'What are the best practices for conducting user research and testing?', category: '🔍' },
        { display: 'Design systems...', full: 'How do I create a scalable design system in Figma?', category: '🎯' },
        { display: 'Career in UX...', full: 'What skills do I need to break into UX/UI design as a beginner?', category: '💼' },
      ],
      puneetkumar: [
        { display: 'Start storytelling...', full: 'How do I start writing compelling stories as a beginner?', category: '📖' },
        { display: 'Character depth...', full: 'How do I create characters that feel real and relatable?', category: '✨' },
        { display: 'Story structure...', full: 'What are the key elements of a well-structured story?', category: '🎯' },
        { display: 'Writer\'s block...', full: 'How do I overcome writer\'s block and find inspiration?', category: '💡' },
      ],
      akshatgupta: [
        { display: 'Mahabharata lessons...', full: 'What are the key life lessons from the Mahabharata that apply today?', category: '📚' },
        { display: 'Vedic wisdom...', full: 'Can you explain Vedic principles for modern life in simple terms?', category: '🕉️' },
        { display: 'Mythology meaning...', full: 'What is the deeper meaning behind this mythological story?', category: '💭' },
        { display: 'Dharma dilemma...', full: 'How do I apply the concept of dharma to modern ethical dilemmas?', category: '⚖️' },
      ],
      samantha: [
        { display: 'Wellness routine...', full: 'How do I create a sustainable wellness routine that works with chronic illness?', category: '🌸' },
        { display: 'Mental health...', full: 'What are some effective self-care practices for managing mental health?', category: '💆' },
        { display: 'Fitness journey...', full: 'How do I start a fitness journey when dealing with health challenges?', category: '💪' },
        { display: 'Build resilience...', full: 'How can I build emotional resilience during difficult times?', category: '✨' },
      ],
      mkbhd: [
        { display: 'Best smartphone...', full: 'What smartphone should I buy in 2024 for the best value?', category: '📱' },
        { display: 'Tech comparison...', full: 'How do the latest flagship phones compare in real-world usage?', category: '⚡' },
        { display: 'Camera quality...', full: 'What makes a smartphone camera truly great beyond megapixels?', category: '📸' },
        { display: 'EV insights...', full: 'What should I know before buying my first electric vehicle?', category: '🚗' },
      ],
    };

    return (
      suggestions[personaId] || [
        { display: 'Explain this concept...', full: 'Can you explain this concept in detail?', category: '💡' },
        { display: 'Help me with...', full: 'I need help with understanding this topic', category: '🚀' },
        { display: 'Advice on...', full: 'What advice do you have about this situation?', category: '🎯' },
        { display: 'Tell me about...', full: 'Tell me more about your expertise and experience', category: '✨' },
      ]
    );
  };

  const suggestions = getPersonaSuggestions(selectedPersona);

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
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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
            .map(result => result[0].transcript)
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

  const showSuggestions = !message.trim() && !disabled;

  return (
    <div className='absolute bottom-0 left-0 right-0 p-2 sm:p-4 pointer-events-none'>
      <div className='max-w-4xl mx-auto pointer-events-auto'>
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
              isFocused
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
                disabled
                  ? 'Select a mentor to start chatting...'
                  : isListening
                  ? 'Listening...'
                  : 'Type your message...'
              }
              disabled={disabled}
              rows={1}
              className='flex-1 resize-none bg-transparent border-none outline-none text-sm leading-[1.5] text-foreground placeholder:text-muted-foreground/50 disabled:opacity-50 min-h-[21px] max-h-[105px] overflow-y-auto custom-scrollbar'
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
                  disabled
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
              disabled={!message.trim() || disabled}
              className={`h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg flex-shrink-0 transition-all duration-200 ${
                !message.trim() || disabled
                  ? 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] text-white hover:from-[#FF9189] hover:to-[#FFA3A3] shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
              }`}>
              <Send className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
            </Button>
          </div>

          {/* Footer Info - Mobile Optimized */}
          <div className='flex items-center justify-between mt-1.5 sm:mt-2.5 px-1 sm:px-2'>
            <div className='flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground/70'>
              <Sparkles className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FA8072]' />
              <span className='font-medium hidden sm:inline'>Powered by AI</span>
              <span className='font-medium sm:hidden'>AI</span>
            </div>
            <div className='hidden sm:flex items-center gap-2 text-xs text-muted-foreground/70'>
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
