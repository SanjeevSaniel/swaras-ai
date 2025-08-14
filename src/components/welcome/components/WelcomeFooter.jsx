// src/components/welcome/components/WelcomeFooter.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const WelcomeFooter = ({ darkMode }) => {
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

  return (
    <motion.div
      variants={itemVariants}
      className={`text-center pt-4 border-t ${
        darkMode ? 'border-gray-700/30' : 'border-gray-200/30'
      }`}>
      <div className='flex items-center justify-center gap-2 mb-2'>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
          <Star className='w-4 h-4 text-amber-500' />
        </motion.div>
        <p
          className={`text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
          Powered by Advanced AI Technology
        </p>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}>
          ⚡
        </motion.span>
      </div>
      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        Made with ❤️ in Bengaluru • Join millions of successful developers
      </p>
    </motion.div>
  );
};

export default WelcomeFooter;
