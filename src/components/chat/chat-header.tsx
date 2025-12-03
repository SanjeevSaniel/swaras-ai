// src/components/chat/chat-header.tsx (Compact Version)
import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Image from 'next/image';

interface ChatHeaderProps {
  selectedPersona: string;
  compact?: boolean;
  rateLimitInfo?: { remaining: number; limit: number };
}

const ChatHeader = ({
  selectedPersona,
  compact = false,
  rateLimitInfo,
}: ChatHeaderProps) => {
  const { darkMode } = useChatStore();
  const persona = personas[selectedPersona];

  if (!persona) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b ${
        compact || !darkMode
          ? 'bg-white/90 border-gray-200/60 backdrop-blur-sm'
          : 'bg-gray-800/90 border-gray-700/60 backdrop-blur-sm'
      }`}>
      {/* Persona info - compact layout */}
      <div className='flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 ml-14 lg:ml-0'>
        {/* Avatar with online indicator */}
        <div className='relative flex-shrink-0'>
          <Image
            src={persona.avatarUrl}
            alt={`${persona.name} avatar`}
            width={40}
            height={40}
            className='rounded-full object-cover border-2 border-green-400/50'
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const nextEl = target.nextElementSibling as HTMLElement;
              target.style.display = 'none';
              if (nextEl) nextEl.style.display = 'flex';
            }}
          />
          <div
            className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-xl'
            style={{ display: 'none' }}>
            {persona.avatar}
          </div>
          {/* Compact online indicator */}
          <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white'></div>
        </div>

        {/* Name and status - single line layout */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-1.5 sm:space-x-2'>
            <h2
              className={`font-semibold text-sm sm:text-base truncate ${
                compact
                  ? 'text-zinc-900'
                  : darkMode
                  ? 'text-gray-100'
                  : 'text-gray-900'
              }`}>
              {persona.name}
            </h2>
            {/* {compact && rateLimitInfo && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                  rateLimitInfo.remaining === 0
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}>
                {rateLimitInfo.remaining}/{rateLimitInfo.limit}
              </span>
            )} */}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
