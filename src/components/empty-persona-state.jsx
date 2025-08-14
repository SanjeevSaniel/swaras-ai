// src/components/empty-persona-state.jsx
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Heart,
  Lightbulb,
  MessageSquare,
  Rocket,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';

const EmptyPersonaState = () => {
  const { darkMode, conversations } = useChatStore();

  const hasConversations = conversations.length > 0;
  const availablePersonas = Object.values(personas);
  const mentorCount = availablePersonas.length;

  const getMentorNamesText = () => {
    const names = availablePersonas.map((p) => p.name);
    if (names.length <= 2) {
      return names.join(' and ');
    } else if (names.length === 3) {
      return `${names[0]}, ${names[1]}, and ${names[2]}`;
    } else {
      return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Expert Mentorship',
      description: 'Learn from coding legends with personalized guidance',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: 'Interactive Conversations',
      description: 'Engage in dynamic programming discussions',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Lightbulb,
      title: 'Instant Problem Solving',
      description: 'Get immediate help with coding challenges',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className='w-full h-full flex items-center justify-center overflow-hidden relative'>
      <div className='w-full max-w-3xl mx-auto px-3 py-4 relative'>
        {/* Compact Background Pattern */}
        <motion.div
          className='absolute inset-0 opacity-15 pointer-events-none overflow-hidden'
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          <div
            className='w-full h-full'
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, ${
                  darkMode ? '#1e293b' : '#e0e7ff'
                } 1.5px, transparent 1.5px),
                radial-gradient(circle at 75% 75%, ${
                  darkMode ? '#0f172a' : '#f1f5f9'
                } 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px, 30px 30px',
            }}
          />
        </motion.div>

        <div className='relative z-10 text-center space-y-5'>
          {/* Compact Context Header */}
          <AnimatePresence>
            {hasConversations && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}>
                <motion.div
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border backdrop-blur-md ${
                    darkMode
                      ? 'bg-blue-900/30 border-blue-600/40 text-blue-300'
                      : 'bg-blue-50/90 border-blue-300/60 text-blue-700'
                  }`}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}>
                    <RotateCcw className='w-4 h-4' />
                  </motion.div>
                  <span className='text-xs font-semibold'>
                    Mentor Deselected • Choose Your Guide
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}>
                    <Heart className='w-3 h-3 text-pink-500' />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Main Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: hasConversations ? 0.2 : 0 }}
            className='space-y-4'>
            {/* Compact Logo with Fewer Particles */}
            <motion.div
              className='relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl'
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className='w-10 h-10 md:w-12 md:h-12 text-white' />
              </motion.div>

              {/* Reduced Particles (4 instead of 6) */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1.5 h-1.5 rounded-full ${
                    i % 2 === 0 ? 'bg-yellow-400' : 'bg-pink-400'
                  }`}
                  style={{
                    top: `${20 + Math.sin((i * Math.PI) / 2) * 40}%`,
                    left: `${20 + Math.cos((i * Math.PI) / 2) * 40}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2.5 + i * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                />
              ))}

              {/* Compact Orbital Ring */}
              <motion.div
                className={`absolute inset-0 border rounded-2xl ${
                  darkMode ? 'border-purple-400/20' : 'border-purple-500/20'
                }`}
                animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Compact Title Section */}
            <div className='space-y-3'>
              <motion.h1
                className='text-3xl md:text-4xl font-bold'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}>
                <motion.span
                  className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ backgroundSize: '200% 200%' }}>
                  {hasConversations
                    ? 'Welcome Back, Developer!'
                    : 'Welcome to Swaras AI'}
                </motion.span>
              </motion.h1>

              <motion.p
                className={`text-base md:text-lg ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}>
                {hasConversations
                  ? 'Your coding mentors are ready to continue'
                  : 'Your Gateway to Expert Coding Mentorship'}
              </motion.p>

              <motion.div
                className='flex items-center justify-center space-x-2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}>
                  <Rocket
                    className={`w-4 h-4 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-xs font-medium ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                  Powered by AI • Built with ❤️ in Bengaluru
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Compact Features Grid */}
          {!hasConversations && (
            <motion.div
              className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-default ${
                    darkMode
                      ? 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-700/50'
                      : 'bg-white/50 border-gray-200/40 hover:bg-white/70'
                  }`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}>
                  <motion.div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}>
                    <feature.icon className='w-5 h-5 text-white' />
                  </motion.div>

                  <h3
                    className={`text-sm font-bold mb-2 ${
                      darkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                    {feature.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Compact Call to Action */}
          <motion.div
            className={`max-w-2xl mx-auto p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-purple-900/25 via-pink-900/25 to-blue-900/25 border-purple-600/30'
                : 'bg-gradient-to-br from-purple-100/60 via-pink-100/60 to-blue-100/60 border-purple-300/40'
            }`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: hasConversations ? 0.4 : 0.7 }}>
            <div className='relative z-10'>
              <motion.div
                className='flex items-center justify-center space-x-3 mb-4'
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}>
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}>
                  <Users
                    className={`w-6 h-6 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-lg font-bold ${
                    darkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                  {hasConversations
                    ? '🎉 Ready to Code?'
                    : '🚀 Ready to Level Up?'}
                </span>
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}>
                  <ArrowRight
                    className={`w-6 h-6 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  />
                </motion.div>
              </motion.div>

              {/* Compact Direction Indicator */}
              <motion.div
                className='flex items-center justify-center mb-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}>
                <motion.div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm border ${
                    darkMode
                      ? 'bg-gray-800/50 border-gray-600/40 text-purple-300'
                      : 'bg-white/60 border-gray-300/50 text-purple-700'
                  }`}
                  animate={{ x: [-5, 0, -5] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.03 }}>
                  <ArrowLeft className='w-4 h-4' />
                  <span className='text-sm font-bold'>
                    {mentorCount} Legend{mentorCount !== 1 ? 's' : ''} Available
                  </span>
                  <motion.div
                    className='w-2 h-2 rounded-full bg-green-400'
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.p
                className={`text-sm leading-relaxed mb-4 ${
                  darkMode ? 'text-purple-200' : 'text-purple-600'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}>
                {hasConversations
                  ? `🎯 Click any mentor card to continue your coding journey!`
                  : `🌟 Choose from ${getMentorNamesText()} to start your personalized coding adventure!`}
              </motion.p>

              {/* Compact Mentors Preview */}
              <motion.div
                className='flex items-center justify-center flex-wrap gap-2'
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}>
                <span
                  className={`text-xs font-bold ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                  🎓 Your Mentors:
                </span>
                {availablePersonas.map((persona, index) => (
                  <motion.div
                    key={persona.id}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs border ${
                      darkMode
                        ? 'bg-gray-800/60 text-gray-200 border-gray-600/40'
                        : 'bg-white/60 text-gray-700 border-gray-300/40'
                    }`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.3 + index * 0.08,
                      type: 'spring',
                      bounce: 0.3,
                    }}
                    whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className={`w-5 h-5 rounded ${persona.accentColor} flex items-center justify-center text-white text-xs font-bold`}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.3,
                      }}>
                      {persona.avatar}
                    </motion.div>
                    <span className='font-bold'>{persona.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Compact Decorative Elements */}
        <motion.div
          className='absolute top-16 right-16 w-24 h-24 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-full blur-xl pointer-events-none'
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className='absolute bottom-16 left-16 w-28 h-28 bg-gradient-to-r from-pink-400/8 to-red-400/8 rounded-full blur-xl pointer-events-none'
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default EmptyPersonaState;
