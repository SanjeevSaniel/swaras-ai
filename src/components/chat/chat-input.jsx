// src/components/chat/chat-input.jsx
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Loader2, Mic, Paperclip, Plus, Send, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ChatInput = ({ onSendMessage, selectedPersona, isTyping }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const textareaRef = useRef(null);
  const { darkMode } = useChatStore();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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

  const persona = personas[selectedPersona];
  const canSend =
    message.trim() && !isTyping && !isSubmitting && selectedPersona;

  return (
    <div
      className={`${
        darkMode
          ? 'bg-gray-900/95 border-gray-700'
          : 'bg-white/95 border-gray-200'
      } border-t backdrop-blur-lg`}>
      <div className='p-4'>
        {/* Quick Actions - Show when input is focused */}
        {showActions && (
          <motion.div
            className='mb-4'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}>
            <div className='flex space-x-2'>
              {['How to learn React?', 'Career advice?', 'Best practices?'].map(
                (suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setMessage(suggestion)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    {suggestion}
                  </motion.button>
                ),
              )}
            </div>
          </motion.div>
        )}

        <div className='flex items-end space-x-3'>
          {/* Attachment button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full transition-colors ${
              darkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}>
            <Plus className='w-5 h-5' />
          </motion.button>

          {/* Input container */}
          <div
            className={`flex-1 rounded-2xl border transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800/70 border-gray-600 focus-within:border-purple-500'
                : 'bg-white/70 border-gray-300 focus-within:border-purple-500'
            } shadow-sm focus-within:shadow-md backdrop-blur-sm`}>
            <div className='flex items-end px-4 py-3'>
              {/* Persona Avatar */}
              <div
                className={`mr-3 w-8 h-8 rounded-full ${
                  persona?.accentColor || 'bg-gray-400'
                } 
                             flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
                {persona?.avatar || '💭'}
              </div>

              {/* Emoji button */}
              <button
                className={`p-1 mr-2 transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                <Smile className='w-5 h-5' />
              </button>

              {/* Text input */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowActions(true)}
                onBlur={() => setTimeout(() => setShowActions(false), 200)}
                placeholder={
                  selectedPersona
                    ? `Message ${persona?.name}...`
                    : 'Select a mentor to start chatting...'
                }
                disabled={!selectedPersona || isSubmitting}
                className={`flex-1 resize-none bg-transparent ${
                  darkMode
                    ? 'text-gray-100 placeholder-gray-400'
                    : 'text-gray-900 placeholder-gray-500'
                } focus:outline-none text-sm max-h-32 leading-6`}
                rows={1}
                style={{ minHeight: '24px' }}
              />

              {/* Attachment button */}
              <button
                className={`p-1 ml-2 transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                <Paperclip className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Send/Mic button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={canSend ? handleSend : undefined}
            disabled={!canSend}
            className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
              canSend
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-200/50'
                : darkMode
                ? 'bg-gray-700 text-gray-500'
                : 'bg-gray-300 text-gray-500'
            }`}>
            {isSubmitting ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : canSend ? (
              <Send className='w-5 h-5' />
            ) : (
              <Mic className='w-5 h-5' />
            )}
          </motion.button>
        </div>

        {/* Status */}
        <div className='mt-2 flex items-center justify-between text-xs'>
          <div className='flex items-center space-x-4'>
            {isTyping && (
              <motion.p
                className={darkMode ? 'text-gray-400' : 'text-gray-500'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                {persona?.name} is typing...
              </motion.p>
            )}

            {!selectedPersona && (
              <p className='text-amber-600'>
                Choose a mentor from the sidebar to start chatting
              </p>
            )}
          </div>

          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
