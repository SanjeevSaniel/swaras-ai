// src/components/chat/chat-header.jsx (Compact Version)
import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

const ChatHeader = ({ selectedPersona }) => {
  const { darkMode } = useChatStore();
  const persona = personas[selectedPersona];

  if (!persona) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between px-4 py-3 border-b ${
        darkMode
          ? 'bg-gray-800/90 border-gray-700/60 backdrop-blur-sm'
          : 'bg-white/90 border-gray-200/60 backdrop-blur-sm'
      }`}>
      {/* Mobile menu button */}
      <Button
        variant='ghost'
        size='icon'
        className='lg:hidden flex-shrink-0'>
        <Menu className='h-5 w-5' />
      </Button>

      {/* Persona info - compact layout */}
      <div className='flex items-center space-x-3 flex-1 min-w-0'>
        {/* Avatar with online indicator */}
        <div className='relative flex-shrink-0'>
          <img
            src={persona.avatarUrl}
            alt={`${persona.name} avatar`}
            className='w-10 h-10 rounded-full object-cover border-2 border-green-400/50'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div
            className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl'
            style={{ display: 'none' }}>
            {persona.avatar}
          </div>
          {/* Compact online indicator */}
          <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white'></div>
        </div>

        {/* Name and status - single line layout */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2'>
            <h2
              className={`font-semibold text-base truncate ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
              {persona.name}
            </h2>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                darkMode
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-green-100 text-green-600'
              }`}>
              Online
            </span>
          </div>

          {/* Compact expertise tags */}
          {/* <div className='flex items-center space-x-1 mt-1'>
            {persona.expertise.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className={`text-xs px-1.5 py-0.5 rounded ${
                  darkMode
                    ? 'bg-gray-700/60 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                {skill}
              </span>
            ))}
            {persona.expertise.length > 2 && (
              <span
                className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                +{persona.expertise.length - 2}
              </span>
            )}
          </div> */}
        </div>
      </div>

      {/* Optional: Single action button for settings/info */}
      {/* <Button
        variant='ghost'
        size='sm'
        className={`flex-shrink-0 text-xs ${
          darkMode
            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
        }`}>
        Info
      </Button> */}
    </motion.header>
  );
};

export default ChatHeader;
