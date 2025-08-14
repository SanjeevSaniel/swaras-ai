// src/components/chat/chat-header.jsx
import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Menu, MoreVertical, Phone, Star, Video } from 'lucide-react';

const ChatHeader = ({ selectedPersona }) => {
  const { darkMode } = useChatStore();
  const persona = personas[selectedPersona];

  if (!persona) return null;

  return (
    <motion.div
      className={`${
        darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
      } border-b backdrop-blur-lg`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}>
      <div className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            {/* Mobile Menu Button - Custom implementation */}
            <Button
              variant='ghost'
              size='sm'
              className={`md:hidden rounded-full ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
              <Menu className='w-5 h-5' />
            </Button>

            {/* Avatar with Status */}
            <div className='relative'>
              <motion.div
                className={`w-12 h-12 rounded-2xl ${persona.accentColor} flex items-center justify-center text-white font-bold shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}>
                {persona.avatar}
              </motion.div>
              <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm'></div>
            </div>

            {/* Info */}
            <div className='flex-1'>
              <div className='flex items-center space-x-2'>
                <h1
                  className={`font-bold text-lg ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  {persona.name}
                </h1>
                <Star className='w-4 h-4 text-yellow-400 fill-current' />
              </div>

              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  Active now • {persona.description}
                </p>
              </div>

              {/* Expertise tags */}
              <div className='flex items-center space-x-1 mt-1'>
                {persona.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={skill}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex items-center space-x-1'>
            <Button
              variant='ghost'
              size='sm'
              className={`rounded-full ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
              <Video className='w-5 h-5' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className={`rounded-full ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
              <Phone className='w-5 h-5' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className={`rounded-full ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
              <MoreVertical className='w-5 h-5' />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
