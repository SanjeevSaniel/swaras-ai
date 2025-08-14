// src/components/sidebar/persona-selector.jsx
import { Badge } from '@/components/ui/badge';
import { personas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Code, Coffee, Crown, Plus, Star, Zap } from 'lucide-react';

const PersonaSelector = () => {
  const { selectedPersona, setSelectedPersona, darkMode } = useChatStore();

  const personaIcons = {
    hitesh: Coffee,
    piyush: Zap,
  };

  const handlePersonaClick = (personaId) => {
    // Toggle functionality: if already selected, deselect it
    if (selectedPersona === personaId) {
      setSelectedPersona(null);
    } else {
      setSelectedPersona(personaId);
    }
  };

  return (
    <div className='space-y-2'>
      {Object.values(personas).map((persona, index) => {
        const IconComponent = personaIcons[persona.id] || Code;
        const isSelected = selectedPersona === persona.id;

        return (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}>
            <motion.div
              className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? `bg-gradient-to-r ${persona.bgColor} border border-blue-300 shadow-md`
                  : darkMode
                  ? 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-700/40'
                  : 'bg-white/40 border border-gray-200/40 hover:bg-white/70'
              } backdrop-blur-sm`}
              onClick={() => handlePersonaClick(persona.id)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: isSelected ? 0.98 : 1.02 }}>
              <div className='p-3'>
                <div className='flex items-center space-x-3'>
                  {/* Compact Avatar - Already interactive via parent */}
                  <motion.div
                    className={`relative w-10 h-10 rounded-xl ${persona.accentColor} flex items-center justify-center text-white text-base font-bold shadow-md flex-shrink-0`}
                    animate={
                      isSelected
                        ? {
                            rotate: [0, 3, -3, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: isSelected ? Infinity : 0,
                      ease: 'easeInOut',
                    }}>
                    {persona.avatar}

                    {/* Enhanced Status Indicator */}
                    <motion.div
                      className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm'
                      animate={
                        isSelected
                          ? {
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: isSelected ? Infinity : 0,
                        ease: 'easeInOut',
                      }}>
                      {isSelected ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='w-full h-full flex items-center justify-center'>
                          <Crown className='w-2 h-2 text-yellow-500' />
                        </motion.div>
                      ) : (
                        <IconComponent className='w-2 h-2 text-gray-400' />
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Compact Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-1 mb-0.5'>
                      <h3
                        className={`font-semibold text-sm truncate ${
                          isSelected
                            ? 'text-gray-900'
                            : darkMode
                            ? 'text-gray-100'
                            : 'text-gray-900'
                        }`}>
                        {persona.name}
                      </h3>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='flex items-center space-x-1'>
                          <Star className='w-3 h-3 text-yellow-500 fill-current' />
                          <span
                            className={`text-xs font-medium ${
                              darkMode ? 'text-gray-600' : 'text-gray-700'
                            }`}>
                            Active
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <p
                      className={`text-xs truncate mb-1 ${
                        isSelected
                          ? 'text-gray-700'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
                      {persona.title}
                    </p>

                    {/* Click hint for selected persona */}
                    {isSelected && (
                      <motion.p
                        className={`text-xs italic mb-1 cursor-pointer ${
                          darkMode ? 'text-gray-600' : 'text-gray-600'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 0.5 }}>
                        Click again to deselect
                      </motion.p>
                    )}

                    {/* Compact Expertise - Show only top 2 */}
                    <div className='flex flex-wrap gap-1'>
                      {persona.expertise
                        .slice(0, 2)
                        .map((skill, skillIndex) => (
                          <Badge
                            key={skill}
                            variant='secondary'
                            className={`text-xs px-1.5 py-0 h-5 ${
                              isSelected
                                ? 'bg-blue-100/60 text-blue-700 border-blue-200/50'
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
                            darkMode
                              ? 'border-gray-600/40 text-gray-500'
                              : 'border-gray-300/40 text-gray-500'
                          }`}>
                          +{persona.expertise.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Indicator with animation */}
                {isSelected && (
                  <motion.div
                    className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-purple-500 to-pink-500'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}

                {/* Pulsing border for selected */}
                {isSelected && (
                  <motion.div
                    className='absolute inset-0 rounded-xl border-2 border-blue-400/30'
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

      {/* Coming Soon Card - Added cursor-pointer */}
      <motion.div
        className={`border border-dashed rounded-xl p-3 text-center transition-all duration-200 cursor-pointer ${
          darkMode
            ? 'border-gray-700/40 hover:border-gray-600/60'
            : 'border-gray-300/40 hover:border-gray-400/60'
        }`}
        whileHover={{ scale: 1.01 }}>
        <motion.div
          className={`w-8 h-8 rounded-xl mx-auto mb-1 flex items-center justify-center ${
            darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
          }`}
          whileHover={{ rotate: 5 }}>
          <Plus
            className={`w-4 h-4 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}
          />
        </motion.div>
        <p
          className={`text-xs font-medium ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
          More Soon
        </p>
      </motion.div>

      {/* Toggle Instructions */}
      {selectedPersona && (
        <motion.div
          className={`p-2 rounded-lg border backdrop-blur-sm text-center ${
            darkMode
              ? 'bg-blue-900/10 border-blue-700/20 text-blue-300'
              : 'bg-blue-50/60 border-blue-200/40 text-blue-700'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          <p className='text-xs font-medium'>
            💡 Click the active mentor again to deselect
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PersonaSelector;
