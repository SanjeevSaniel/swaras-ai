'use client';

import { Mic, Paperclip } from 'lucide-react';
import { useEffect, useRef } from 'react';

const NixtioChatInput = ({
  input,
  handleInputChange,
  handleSubmit,
  onSendMessage,
  disabled,
  selectedPersona
}) => {
  const textareaRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (input?.trim() && !disabled) {
      if (onSendMessage) {
        onSendMessage(input);
      }
      handleSubmit(e);
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return (
    <div className='p-6 bg-white border-t border-gray-200'>
      <form onSubmit={onSubmit} className='flex items-center gap-3'>
        {/* Attachment Button */}
        <button
          type='button'
          className='flex-shrink-0 p-2.5 rounded-full hover:bg-gray-100 transition-colors'
          disabled={disabled}
        >
          <Paperclip className='w-5 h-5 text-gray-600' />
        </button>

        {/* Text Input */}
        <div className='flex-1 relative'>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Type Message..'
            disabled={disabled}
            rows={1}
            className='w-full bg-gray-100 rounded-full px-5 py-3 pr-12 border-none outline-none resize-none text-[15px] text-gray-900 placeholder:text-gray-400 max-h-32 focus:bg-gray-200 transition-colors'
            style={{ minHeight: '48px' }}
          />
        </div>

        {/* Voice Button */}
        <button
          type='button'
          className='flex-shrink-0 p-2.5 rounded-full hover:bg-gray-100 transition-colors'
          disabled={disabled}
        >
          <Mic className='w-5 h-5 text-gray-600' />
        </button>
      </form>
    </div>
  );
};

export default NixtioChatInput;
