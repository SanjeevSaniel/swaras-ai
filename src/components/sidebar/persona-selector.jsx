// src/components/sidebar/persona-selector.jsx (Fixed)
'use client';

import { Badge } from '@/components/ui/badge';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GraduationCap,
  Code2,
  Crown,
  Loader2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const PersonaSelector = () => {
  const {
    selectedPersona,
    setSelectedPersona,
    darkMode,
    mentorsOnline,
    mentorsLoading,
  } = useChatStore();

  const personaIcons = { hitesh: GraduationCap, piyush: Code2 };

  // Define professional persona-specific colors
  const personaColors = {
    hitesh: {
      bgColor: 'from-slate-500/10 via-slate-600/8 to-slate-500/6',
      borderColor: 'border-slate-400/30',
      darkBgColor: 'from-slate-500/12 via-slate-600/10 to-slate-500/8',
      darkBorderColor: 'border-slate-400/25',
      iconColor: 'text-slate-600',
      darkIconColor: 'text-slate-400',
    },
    piyush: {
      bgColor: 'from-blue-500/10 via-blue-600/8 to-blue-500/6',
      borderColor: 'border-blue-400/30',
      darkBgColor: 'from-blue-500/12 via-blue-600/10 to-blue-500/8',
      darkBorderColor: 'border-blue-400/25',
      iconColor: 'text-blue-600',
      darkIconColor: 'text-blue-400',
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
                <div className='flex items-center space-x-2 mb-1'>
                  <h3
                    className={`font-semibold text-base truncate ${
                      darkMode ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                    {persona.name}
                  </h3>
                  {isSelected && (
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        darkMode ? colors.darkIconColor : colors.iconColor
                      }`}
                    />
                  )}
                </div>

                <p
                  className={`text-sm truncate mb-2 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                  {persona.title}
                </p>

                <div className='flex items-center gap-1.5'>
                  <Badge
                    variant='secondary'
                    className={`text-xs px-2 py-0.5 ${
                      isSelected
                        ? darkMode
                          ? `bg-gradient-to-r ${colors.darkBgColor} ${colors.darkBorderColor} border`
                          : `bg-gradient-to-r ${colors.bgColor} ${colors.borderColor} border`
                        : ''
                    }`}>
                    {isSelected ? (
                      <span className='flex items-center gap-1'>
                        <Sparkles className='w-3 h-3' /> Active
                      </span>
                    ) : mentorsOnline ? (
                      'Available'
                    ) : (
                      'Offline'
                    )}
                  </Badge>
                </div>
              </div>

              <div className='flex-shrink-0'>
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isSelected
                      ? darkMode
                        ? `bg-gradient-to-br ${colors.darkBgColor}`
                        : `bg-gradient-to-br ${colors.bgColor}`
                      : darkMode
                      ? 'bg-slate-800/50'
                      : 'bg-slate-100/50'
                  }`}>
                  <IconComponent
                    className={`w-5 h-5 ${
                      isSelected
                        ? darkMode
                          ? colors.darkIconColor
                          : colors.iconColor
                        : darkMode
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Selection glow effect */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-0 rounded-xl overflow-hidden pointer-events-none'>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      darkMode ? colors.darkBgColor : colors.bgColor
                    } opacity-30`}
                  />
                </motion.div>
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
