import React from 'react';
import { motion } from 'framer-motion';
import { personas } from '@/constants/personas';

const TypingIndicator = ({ selectedPersona }) => {
  const persona = personas[selectedPersona];

  return (
    <motion.div
      className='flex items-center space-x-3 p-4'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}>
      <div
        className={`w-8 h-8 rounded-full ${persona?.accentColor} flex items-center justify-center text-white text-sm font-medium`}>
        {persona?.avatar}
      </div>
      <div className='flex space-x-1'>
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className='w-2 h-2 bg-gray-400 rounded-full'
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
      <span className='text-sm text-gray-500'>
        {persona?.name} is typing...
      </span>
    </motion.div>
  );
};

export default TypingIndicator;
