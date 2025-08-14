// src/components/sidebar/persona-selector.jsx
'use client';

import { Badge } from '@/components/ui/badge';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Code,
  Coffee,
  Crown,
  Loader2,
  Lock,
  Plus,
  Star,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';

const PersonaSelector = () => {
  const {
    selectedPersona,
    setSelectedPersona,
    darkMode,
    mentorsOnline,
    mentorsLoading,
  } = useChatStore();

  const personaIcons = {
    hitesh: Coffee,
    piyush: Zap,
  };

  const handlePersonaClick = (personaId) => {
    if (!mentorsOnline || mentorsLoading) {
      return;
    }

    if (selectedPersona === personaId) {
      setSelectedPersona(null);
    } else {
      setSelectedPersona(personaId);
    }
  };

  // Get persona-specific selected background for dark mode
  const getSelectedBackground = (personaId) => {
    if (!darkMode) {
      // Light mode - keep original gradient
      const persona = personas[personaId];
      return `bg-gradient-to-r ${persona.bgColor}`;
    } else {
      // Dark mode - use darker persona-specific backgrounds
      const darkBackgrounds = {
        hitesh:
          'bg-gradient-to-r from-orange-900/40 via-amber-900/40 to-orange-800/40',
        piyush:
          'bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-800/40',
      };
      return (
        darkBackgrounds[personaId] ||
        'bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-800/40'
      );
    }
  };

  // Get persona-specific selected border for dark mode
  const getSelectedBorder = (personaId) => {
    if (!darkMode) {
      // Light mode - keep original blue border
      return 'border-blue-300';
    } else {
      // Dark mode - use persona-specific darker borders
      const darkBorders = {
        hitesh: 'border-orange-600/50',
        piyush: 'border-blue-600/50',
      };
      return darkBorders[personaId] || 'border-purple-600/50';
    }
  };

  // Get persona-specific selected text colors for dark mode
  const getSelectedTextColor = (isName = false) => {
    if (!darkMode) {
      // Light mode - keep original gray colors
      return isName ? 'text-gray-900' : 'text-gray-700';
    } else {
      // Dark mode - use lighter colors for better contrast
      return isName ? 'text-gray-100' : 'text-gray-200';
    }
  };

  return (
    <div className='space-y-2'>
      {/* Compact Header */}
      <div className='flex items-center justify-between mb-3'>
        <h3
          className={`text-xs font-semibold uppercase tracking-wide ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
          Choose Mentor
        </h3>
        <div className='flex items-center space-x-2'>
          <motion.div
            className={`w-1.5 h-1.5 rounded-full ${
              mentorsLoading
                ? 'bg-yellow-400'
                : mentorsOnline
                ? 'bg-green-400'
                : 'bg-red-400'
            }`}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: mentorsLoading ? 0.8 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.span
            className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-default ${
              mentorsOnline
                ? darkMode
                  ? 'bg-purple-900/30 text-purple-400'
                  : 'bg-purple-100 text-purple-600'
                : darkMode
                ? 'bg-gray-700/30 text-gray-500'
                : 'bg-gray-200/30 text-gray-500'
            }`}
            animate={
              mentorsOnline
                ? {
                    scale: [1, 1.02, 1],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}>
            {mentorsOnline ? Object.keys(personas).length : '0'}
          </motion.span>
        </div>
      </div>

      {/* Persona Cards - Updated Selected Styling for Dark Mode */}
      {Object.values(personas).map((persona, index) => {
        const IconComponent = personaIcons[persona.id] || Code;
        const isSelected = selectedPersona === persona.id;
        const isDisabled = !mentorsOnline || mentorsLoading;

        return (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: mentorsLoading ? 0.3 : mentorsOnline ? 1 : 0.5,
              y: 0,
              scale: mentorsLoading ? 0.98 : 1,
            }}
            transition={{
              delay: index * 0.1 + 0.3,
              duration: 0.3,
            }}>
            <motion.div
              className={`relative overflow-hidden rounded-xl transition-all duration-200 ${
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${
                isSelected && !isDisabled
                  ? `${getSelectedBackground(
                      persona.id,
                    )} border ${getSelectedBorder(persona.id)} shadow-md`
                  : isDisabled
                  ? darkMode
                    ? 'bg-gray-800/20 border border-gray-700/20'
                    : 'bg-gray-200/40 border border-gray-300/40'
                  : darkMode
                  ? 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-700/40'
                  : 'bg-white/40 border border-gray-200/40 hover:bg-white/70'
              } backdrop-blur-sm`}
              onClick={() => handlePersonaClick(persona.id)}
              whileTap={isDisabled ? {} : { scale: 0.98 }}
              whileHover={
                isDisabled ? {} : { scale: isSelected ? 0.98 : 1.02 }
              }>
              <div className='p-3'>
                <div className='flex items-center space-x-3'>
                  {/* Compact Persona Avatar */}
                  <motion.div
                    className={`relative w-10 h-10 rounded-xl ${
                      persona.accentColor
                    } flex items-center justify-center text-white text-base font-bold shadow-md flex-shrink-0 ${
                      isDisabled ? 'opacity-50' : ''
                    }`}
                    animate={
                      isSelected && !isDisabled
                        ? {
                            rotate: [0, 3, -3, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: isSelected && !isDisabled ? Infinity : 0,
                      ease: 'easeInOut',
                    }}>
                    {persona.avatar}

                    {/* Status Indicator */}
                    <motion.div
                      className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm'
                      animate={
                        isSelected && !isDisabled
                          ? {
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: isSelected && !isDisabled ? Infinity : 0,
                        ease: 'easeInOut',
                      }}>
                      <AnimatePresence mode='wait'>
                        {mentorsLoading ? (
                          <motion.div
                            key='loading'
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            exit={{ scale: 0 }}
                            transition={{
                              scale: { duration: 0.2 },
                              rotate: {
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              },
                            }}>
                            <Loader2 className='w-2 h-2 text-yellow-500' />
                          </motion.div>
                        ) : mentorsOnline ? (
                          isSelected ? (
                            <motion.div
                              key='selected'
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className='w-full h-full flex items-center justify-center'>
                              <Crown className='w-2 h-2 text-yellow-500' />
                            </motion.div>
                          ) : (
                            <motion.div
                              key='online'
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}>
                              <Wifi className='w-2 h-2 text-green-500' />
                            </motion.div>
                          )
                        ) : (
                          <motion.div
                            key='offline'
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}>
                            <WifiOff className='w-2 h-2 text-red-500' />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Disabled Overlay */}
                    {isDisabled && (
                      <motion.div
                        className='absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}>
                        <Lock className='w-3 h-3 text-white/70' />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Compact Persona Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-1 mb-0.5'>
                      <h3
                        className={`font-semibold text-sm truncate ${
                          isSelected && !isDisabled
                            ? getSelectedTextColor(true)
                            : isDisabled
                            ? darkMode
                              ? 'text-gray-500'
                              : 'text-gray-400'
                            : darkMode
                            ? 'text-gray-100'
                            : 'text-gray-900'
                        }`}>
                        {persona.name}
                      </h3>
                      {isSelected && !isDisabled && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='flex items-center space-x-1'>
                          <Star className='w-3 h-3 text-yellow-500 fill-current' />
                          <span
                            className={`text-xs font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Active
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <p
                      className={`text-xs truncate mb-1 ${
                        isSelected && !isDisabled
                          ? getSelectedTextColor(false)
                          : isDisabled
                          ? darkMode
                            ? 'text-gray-500'
                            : 'text-gray-400'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
                      {persona.title}
                    </p>

                    {/* Status Messages */}
                    <AnimatePresence mode='wait'>
                      {mentorsLoading ? (
                        <motion.p
                          key='loading-text'
                          className={`text-xs italic mb-1 ${
                            darkMode ? 'text-yellow-400' : 'text-yellow-600'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          exit={{ opacity: 0 }}>
                          Connecting...
                        </motion.p>
                      ) : !mentorsOnline ? (
                        <motion.p
                          key='offline-text'
                          className={`text-xs italic mb-1 ${
                            darkMode ? 'text-red-400' : 'text-red-600'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          exit={{ opacity: 0 }}>
                          Currently offline
                        </motion.p>
                      ) : isSelected ? (
                        <motion.p
                          key='selected-text'
                          className={`text-xs italic mb-1 cursor-pointer ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          transition={{ delay: 0.5 }}>
                          Click again to deselect
                        </motion.p>
                      ) : null}
                    </AnimatePresence>

                    {/* Compact Expertise - Updated for Dark Mode Selected State */}
                    <div className='flex flex-wrap gap-1'>
                      {persona.expertise
                        .slice(0, 2)
                        .map((skill, skillIndex) => (
                          <Badge
                            key={skill}
                            variant='secondary'
                            className={`text-xs px-1.5 py-0 h-5 ${
                              isSelected && !isDisabled
                                ? darkMode
                                  ? 'bg-gray-800/60 text-gray-200 border-gray-700/50'
                                  : 'bg-blue-100/60 text-blue-700 border-blue-200/50'
                                : isDisabled
                                ? darkMode
                                  ? 'bg-gray-700/20 text-gray-500 border-gray-600/20'
                                  : 'bg-gray-200/60 text-gray-400 border-gray-300/40'
                                : darkMode
                                ? 'bg-gray-700/40 text-gray-400 border-gray-600/40'
                                : 'bg-gray-100/60 text-gray-600 border-gray-200/40'
                            }`}>
                            {skill}
                          </Badge>
                        ))}
                      {persona.expertise.length > 2 && (
                        <Badge
                          variant='outline'
                          className={`text-xs px-1.5 py-0 h-5 ${
                            isSelected && !isDisabled
                              ? darkMode
                                ? 'border-gray-700/50 text-gray-300'
                                : 'border-blue-300/50 text-blue-700'
                              : isDisabled
                              ? darkMode
                                ? 'border-gray-600/20 text-gray-600'
                                : 'border-gray-300/20 text-gray-500'
                              : darkMode
                              ? 'border-gray-600/40 text-gray-500'
                              : 'border-gray-300/40 text-gray-500'
                          }`}>
                          +{persona.expertise.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Indicator - Updated for Dark Mode */}
                {isSelected && !isDisabled && (
                  <motion.div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${
                      darkMode
                        ? 'bg-gradient-to-b from-gray-400 to-gray-300'
                        : 'bg-gradient-to-b from-purple-500 to-pink-500'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}

                {/* Pulsing border for selected - Updated for Dark Mode */}
                {isSelected && !isDisabled && (
                  <motion.div
                    className={`absolute inset-0 rounded-xl border-2 ${
                      darkMode
                        ? getSelectedBorder(persona.id)
                        : 'border-blue-400/30'
                    }`}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Compact Coming Soon Card */}
      <motion.div
        className={`border border-dashed rounded-xl p-3 text-center transition-all duration-200 ${
          mentorsOnline && !mentorsLoading
            ? darkMode
              ? 'border-gray-700/40 hover:border-gray-600/60 cursor-pointer'
              : 'border-gray-300/40 hover:border-gray-400/60 cursor-pointer'
            : darkMode
            ? 'border-gray-700/20 cursor-not-allowed'
            : 'border-gray-300/20 cursor-not-allowed'
        }`}
        whileHover={mentorsOnline && !mentorsLoading ? { scale: 1.01 } : {}}
        animate={{
          opacity: mentorsLoading ? 0.3 : mentorsOnline ? 1 : 0.5,
        }}>
        <motion.div
          className={`w-8 h-8 rounded-xl mx-auto mb-1 flex items-center justify-center ${
            darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
          }`}
          whileHover={mentorsOnline && !mentorsLoading ? { rotate: 5 } : {}}>
          <Plus
            className={`w-4 h-4 ${
              mentorsOnline && !mentorsLoading
                ? darkMode
                  ? 'text-gray-600'
                  : 'text-gray-400'
                : darkMode
                ? 'text-gray-700'
                : 'text-gray-500'
            }`}
          />
        </motion.div>
        <p
          className={`text-xs font-medium ${
            mentorsOnline && !mentorsLoading
              ? darkMode
                ? 'text-gray-500'
                : 'text-gray-500'
              : darkMode
              ? 'text-gray-600'
              : 'text-gray-600'
          }`}>
          {mentorsOnline && !mentorsLoading ? 'More Soon' : 'Coming Soon'}
        </p>
      </motion.div>

      {/* Compact Status Messages */}
      <AnimatePresence>
        {selectedPersona && mentorsOnline && !mentorsLoading && (
          <motion.div
            className={`p-2 rounded-lg border backdrop-blur-sm text-center ${
              darkMode
                ? 'bg-blue-900/10 border-blue-700/20 text-blue-300'
                : 'bg-blue-50/60 border-blue-200/40 text-blue-700'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}>
            <p className='text-xs font-medium'>
              💡 Click the active mentor again to deselect
            </p>
          </motion.div>
        )}

        {!mentorsOnline && !mentorsLoading && (
          <motion.div
            className={`p-2 rounded-lg border backdrop-blur-sm text-center ${
              darkMode
                ? 'bg-red-900/10 border-red-700/20 text-red-300'
                : 'bg-red-50/60 border-red-200/40 text-red-700'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}>
            <p className='text-xs font-medium'>
              ⚠️ AI mentors are currently offline
            </p>
          </motion.div>
        )}

        {mentorsLoading && (
          <motion.div
            className={`p-2 rounded-lg border backdrop-blur-sm text-center ${
              darkMode
                ? 'bg-yellow-900/10 border-yellow-700/20 text-yellow-300'
                : 'bg-yellow-50/60 border-yellow-200/40 text-yellow-700'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}>
            <p className='text-xs font-medium'>
              🔄 Establishing connection to AI mentors...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonaSelector;
