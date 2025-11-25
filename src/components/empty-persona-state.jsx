// src/components/empty-persona-state.jsx
import { personas } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, MessageSquare, Sparkles, Zap } from 'lucide-react';

const EmptyPersonaState = () => {
  const { darkMode } = useChatStore();
  const availablePersonas = Object.values(personas);

  return (
    <div className={`w-full h-full flex items-center justify-center p-8 ${
      darkMode ? 'bg-[#0a0f1e]' : 'bg-white'
    }`}>
      <div className='max-w-2xl w-full text-center space-y-8'>
        {/* Logo with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className='inline-block relative'>
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className='w-20 h-20 bg-gradient-to-br from-[#0073e6] to-[#0052cc] rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden'>
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}>
              <Sparkles className='w-10 h-10 text-white' />
            </motion.div>

            {/* Orbiting particles */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className='absolute inset-0'>
              <div className='absolute top-2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1/2'></div>
            </motion.div>
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className='absolute inset-0'>
              <div className='absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2'></div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Title with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          <motion.h1
            className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            Welcome to Swaras AI
          </motion.h1>
          <motion.p
            className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            Learn from AI mentors trained on industry experts
          </motion.p>
        </motion.div>

        {/* Info Box with Better Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`p-6 rounded-xl border ${
            darkMode
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-slate-50 border-slate-200'
          }`}>
          <div className='flex items-start gap-4 mb-6'>
            <motion.div
              animate={{
                x: [-3, 0, -3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`p-2 rounded-lg ${
                darkMode ? 'bg-blue-500/10' : 'bg-blue-500/10'
              }`}>
              <ArrowLeft className={`w-5 h-5 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </motion.div>
            <div className='text-left flex-1'>
              <h2 className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Choose a mentor from the sidebar
              </h2>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Select from our AI mentors to begin your personalized learning journey.
                Each mentor specializes in different areas of development.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className='grid grid-cols-3 gap-3 mb-6'>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className={`p-3 rounded-lg text-center ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
              <Code className={`w-5 h-5 mx-auto mb-1 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <p className={`text-xs font-medium ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Code Review</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className={`p-3 rounded-lg text-center ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
              <MessageSquare className={`w-5 h-5 mx-auto mb-1 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <p className={`text-xs font-medium ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Live Chat</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className={`p-3 rounded-lg text-center ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
              <Zap className={`w-5 h-5 mx-auto mb-1 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <p className={`text-xs font-medium ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Instant Help</p>
            </motion.div>
          </div>

          {/* Available Mentors */}
          <div className={`pt-4 border-t ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <p className={`text-sm font-medium mb-3 ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Available Mentors:
            </p>
            <div className='flex flex-wrap gap-2 justify-center'>
              {availablePersonas.map((persona, index) => (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.9 + (index * 0.1),
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 hover:border-blue-500'
                      : 'bg-white border-slate-200 hover:border-blue-500'
                  }`}>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className='w-8 h-8 bg-gradient-to-br from-[#0073e6] to-[#0052cc] rounded-lg flex items-center justify-center text-lg shadow-sm'>
                    {persona.avatar}
                  </motion.div>
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {persona.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Info with Pulse Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className='flex items-center justify-center gap-2 text-sm'>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className='w-2 h-2 bg-green-500 rounded-full'></motion.div>
          <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            {availablePersonas.length} mentors online
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default EmptyPersonaState;
