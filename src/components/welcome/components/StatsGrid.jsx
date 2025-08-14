// src/components/welcome/components/StatsGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StatsGrid = ({ stats, darkMode }) => {
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
      className='grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto'>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 text-center ${
            darkMode
              ? 'bg-gray-800/60 border-gray-700/60 hover:bg-gray-700/70'
              : 'bg-white/70 border-gray-200/60 hover:bg-white/90'
          }`}>
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2 shadow-md`}>
            <stat.icon className='w-4 h-4 text-white' />
          </div>
          <div
            className={`text-lg font-bold ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
            {stat.number}
          </div>
          <div
            className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
