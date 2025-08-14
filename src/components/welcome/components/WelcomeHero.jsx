// src/components/welcome/components/WelcomeHero.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeHero = ({ darkMode, persona }) => {
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
      className='text-center space-y-4 max-w-3xl mx-auto'>
      <motion.h1 className='text-3xl md:text-4xl font-bold leading-tight'>
        <span
          className={`block mb-2 ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
          {persona
            ? `Learn with ${persona.name}`
            : 'Learn from Industry Legends'}
        </span>
        <motion.span
          className='block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent'
          animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ backgroundSize: '200% 200%' }}>
          Powered by AI Technology
        </motion.span>
      </motion.h1>
      <motion.p
        className={`text-base max-w-2xl mx-auto leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
        {persona
          ? `Get personalized mentorship from ${persona.name}, ${persona.title}`
          : "Get personalized mentorship from India's most trusted tech educators"}
      </motion.p>
    </motion.div>
  );
};

export default WelcomeHero;
