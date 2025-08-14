// src/components/welcome/components/QuickStartSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const QuickStartSection = ({
  questions,
  onQuickStart,
  darkMode,
  mentorName,
  theme,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      },
    },
  };

  const getThemeHover = (theme) => {
    switch (theme) {
      case 'orange':
        return 'hover:from-orange-600 hover:to-red-600';
      case 'blue':
        return 'hover:from-blue-600 hover:to-indigo-600';
      default:
        return 'hover:from-purple-600 hover:to-blue-600';
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className='max-w-4xl mx-auto'>
      <h3
        className={`text-lg font-semibold mb-4 text-center ${
          darkMode ? 'text-gray-200' : 'text-gray-900'
        }`}>
        💡 Ask {mentorName} About
      </h3>

      <div className='flex flex-wrap justify-center gap-2 px-4'>
        {questions.map((question, index) => (
          <motion.button
            key={index}
            onClick={() => onQuickStart(question)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
              darkMode
                ? `bg-gray-700/60 text-gray-200 border-gray-600/40 hover:bg-gradient-to-r ${getThemeHover(
                    theme,
                  )} hover:text-white hover:border-${theme}-500/50`
                : `bg-gray-100/80 text-gray-800 border-gray-300/40 hover:bg-gradient-to-r ${getThemeHover(
                    theme,
                  )} hover:text-white hover:border-${theme}-500/50`
            } shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onQuickStart(question);
              }
            }}>
            {question}
          </motion.button>
        ))}
      </div>

      <div
        className={`text-center mt-3 text-xs ${
          darkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
        Click any topic to start your conversation with {mentorName}
      </div>
    </motion.div>
  );
};

export default QuickStartSection;
