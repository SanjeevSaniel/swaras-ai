// src/components/sidebar/persona-selector.jsx (Fixed)
'use client';

import { Badge } from '@/components/ui/badge';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Zap, Crown, Loader2 } from 'lucide-react';

const PersonaSelector = () => {
  const {
    selectedPersona,
    setSelectedPersona,
    darkMode,
    mentorsOnline,
    mentorsLoading,
  } = useChatStore();

  const personaIcons = { hitesh: Coffee, piyush: Zap };

  // Define persona-specific colors
  const personaColors = {
    hitesh: {
      bgColor: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
      borderColor: 'border-orange-500/60',
      darkBgColor: 'from-orange-900/40 via-amber-900/40 to-orange-800/40',
      darkBorderColor: 'border-orange-600/50',
    },
    piyush: {
      bgColor: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
      borderColor: 'border-blue-500/60',
      darkBgColor: 'from-blue-900/40 via-cyan-900/40 to-teal-800/40',
      darkBorderColor: 'border-blue-600/50',
    },
  };

  const handlePersonaClick = (personaId) => {
    if (!mentorsOnline || mentorsLoading) return;
    setSelectedPersona(selectedPersona === personaId ? null : personaId);
  };

  return (
    <div className='p-4 space-y-3'>
      <div
        className={`text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
        Choose AI Mentor
      </div>

      {Object.entries(personas).map(([personaId, persona]) => {
        const IconComponent = personaIcons[personaId] || Coffee;
        const isSelected = selectedPersona === personaId;
        const isAvailable = mentorsOnline && !mentorsLoading;
        const colors = personaColors[personaId] || personaColors.hitesh; // Fallback to hitesh colors

        return (
          <motion.div
            key={personaId}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePersonaClick(personaId)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
              isSelected
                ? darkMode
                  ? `bg-gradient-to-r ${colors.darkBgColor} ${colors.darkBorderColor} shadow-lg`
                  : `bg-gradient-to-r ${colors.bgColor} ${colors.borderColor} shadow-lg`
                : darkMode
                ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50'
                : 'bg-white/60 border-gray-200/50 hover:bg-gray-50/80 hover:border-gray-300/50'
            } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <div className='flex items-start space-x-3'>
              {/* Avatar - Fixed: Removed conflicting flex/hidden classes */}
              <div className='relative flex-shrink-0'>
                <img
                  src={persona.avatarUrl}
                  alt={`${persona.name} avatar`}
                  className='w-12 h-12 rounded-full object-cover'
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback emoji avatar - Using conditional display, not conflicting classes */}
                <div
                  className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl'
                  style={{ display: 'none' }}>
                  {persona.avatar}
                </div>

                {/* Status indicator */}
                <div className='absolute -bottom-1 -right-1 flex items-center justify-center'>
                  {mentorsLoading ? (
                    <Loader2 className='w-4 h-4 animate-spin text-yellow-500' />
                  ) : mentorsOnline ? (
                    <div className='w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
                  ) : (
                    <div className='w-4 h-4 bg-red-500 rounded-full border-2 border-white'></div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center space-x-2'>
                  <h3
                    className={`font-semibold truncate ${
                      isSelected
                        ? darkMode
                          ? 'text-gray-100'
                          : 'text-gray-900'
                        : darkMode
                        ? 'text-gray-100'
                        : 'text-gray-900'
                    }`}>
                    {persona.name}
                  </h3>
                  {persona.isPremium && (
                    <Crown className='w-4 h-4 text-yellow-500' />
                  )}
                </div>

                <p
                  className={`text-sm truncate ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  {persona.title}
                </p>

                <div className='flex items-center space-x-2 mt-2'>
                  <Badge
                    variant='secondary'
                    className='text-xs'>
                    {isSelected
                      ? 'Active'
                      : mentorsOnline
                      ? 'Available'
                      : 'Offline'}
                  </Badge>
                </div>
              </div>

              <div className='flex-shrink-0'>
                <IconComponent
                  className={`w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </div>
            </div>

            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                    darkMode
                      ? personaId === 'hitesh'
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                      : personaId === 'hitesh'
                      ? 'bg-orange-600'
                      : 'bg-blue-600'
                  }`}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      <div
        className={`text-xs px-3 py-2 rounded-lg ${
          darkMode
            ? 'text-gray-400 bg-gray-800/40'
            : 'text-gray-600 bg-gray-100/40'
        }`}>
        {mentorsOnline && !mentorsLoading
          ? '💡 Click the active mentor again to deselect'
          : mentorsLoading
          ? '🔄 Establishing connection to AI mentors...'
          : '⚠️ AI mentors are currently offline'}
      </div>
    </div>
  );
};

export default PersonaSelector;
