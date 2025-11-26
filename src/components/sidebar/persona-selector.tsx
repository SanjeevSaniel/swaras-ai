// src/components/sidebar/persona-selector.jsx
'use client';

import { getEnabledPersonas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';

const PersonaSelector = () => {
  const {
    selectedPersona,
    setSelectedPersona,
    darkMode,
    mentorsOnline,
    mentorsLoading,
  } = useChatStore();

  const handlePersonaClick = (personaId: string) => {
    if (!mentorsOnline || mentorsLoading) return;
    setSelectedPersona(selectedPersona === personaId ? null : personaId);
  };

  // Get only enabled personas
  const enabledPersonas = getEnabledPersonas();

  return (
    <div className='p-4 space-y-3'>
      <div
        className={`text-xs font-semibold uppercase tracking-wide mb-3 ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
        AI Mentors
      </div>

      <div className='space-y-2'>
        {Object.entries(enabledPersonas).map(
          ([personaId, persona]: [string, any], index) => {
            const isSelected = selectedPersona === personaId;
            const isAvailable = mentorsOnline && !mentorsLoading;

            return (
              <motion.button
                key={personaId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                onClick={() => handlePersonaClick(personaId)}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                  isSelected
                    ? darkMode
                      ? 'bg-blue-500/10 border-blue-500/50 shadow-sm'
                      : 'bg-blue-50 border-blue-500/50 shadow-sm'
                    : darkMode
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                } ${
                  !isAvailable
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}>
                <div className='flex items-center gap-3'>
                  {/* Avatar */}
                  <div className='relative flex-shrink-0'>
                    <Image
                      src={persona.avatarUrl}
                      alt={persona.name}
                      width={40}
                      height={40}
                      className='rounded-lg object-cover shadow-sm'
                    />
                    {/* Status indicator */}
                    <div className='absolute -bottom-0.5 -right-0.5'>
                      {mentorsLoading ? (
                        <Loader2 className='w-3 h-3 animate-spin text-yellow-500' />
                      ) : mentorsOnline ? (
                        <div className='w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800'></div>
                      ) : (
                        <div className='w-3 h-3 bg-gray-400 rounded-full border-2 border-white dark:border-slate-800'></div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-0.5'>
                      <h3
                        className={`font-semibold text-sm truncate ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                        {persona.name}
                      </h3>
                      {isSelected && (
                        <CheckCircle2 className='w-4 h-4 text-blue-500 flex-shrink-0' />
                      )}
                    </div>
                    <p
                      className={`text-xs truncate ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                      {persona.title}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          },
        )}
      </div>

      {/* Status message */}
      <div
        className={`text-xs px-3 py-2 rounded-lg ${
          darkMode
            ? 'text-slate-400 bg-slate-800/50'
            : 'text-slate-600 bg-slate-50'
        }`}>
        {mentorsOnline && !mentorsLoading
          ? '💡 Click mentor to select/deselect'
          : mentorsLoading
          ? '🔄 Connecting to mentors...'
          : '⚠️ Mentors offline'}
      </div>
    </div>
  );
};

export default PersonaSelector;
