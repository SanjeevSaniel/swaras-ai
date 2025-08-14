// src/components/welcome/welcome-screen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MessageCircle, Users } from 'lucide-react';
import { personas, quickStartQuestions } from '@/constants/personas';
import { useChatStore } from '@/store/chat-store';
import { AIService } from '@/services/ai-service';

const WelcomeScreen = ({ onQuickStart }) => {
  const { selectedPersona, addConversation, setCurrentConversation } =
    useChatStore();

  const startNewConversation = () => {
    if (!selectedPersona) return;

    const newConversation = AIService.createConversation(selectedPersona);
    addConversation(newConversation);
    setCurrentConversation(newConversation);
  };

  return (
    <div className='flex-1 flex items-center justify-center p-8'>
      <div className='max-w-2xl text-center space-y-8'>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <motion.div
            className='inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full px-4 py-2 mb-6'
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}>
            <Sparkles className='w-4 h-4 text-purple-500' />
            <span className='text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              AI-Powered Learning
            </span>
          </motion.div>

          <h1 className='text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-4 leading-tight'>
            Welcome to
            <br />
            <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Swaras AI
            </span>
          </h1>

          <p className='text-xl text-gray-600 leading-relaxed'>
            Learn coding from India's most beloved tech educators.
            <br />
            Get personalized guidance powered by AI.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className='flex justify-center space-x-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <div className='text-center'>
            <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-2'>
              <Users className='w-6 h-6 text-white' />
            </div>
            <p className='text-2xl font-bold text-gray-900'>2M+</p>
            <p className='text-sm text-gray-600'>Students Taught</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-2'>
              <MessageCircle className='w-6 h-6 text-white' />
            </div>
            <p className='text-2xl font-bold text-gray-900'>24/7</p>
            <p className='text-sm text-gray-600'>AI Assistance</p>
          </div>
        </motion.div>

        {selectedPersona ? (
          <motion.div
            className='space-y-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            {/* Start Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewConversation}
              className='inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300'>
              <span>Start Chatting with {personas[selectedPersona]?.name}</span>
              <ArrowRight className='w-5 h-5' />
            </motion.button>

            {/* Quick Start Questions */}
            <div className='space-y-4'>
              <p className='text-lg font-semibold text-gray-700'>
                Or try these quick starters:
              </p>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {quickStartQuestions[selectedPersona]?.map(
                  (question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onQuickStart(question)}
                      className='text-left p-4 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
                        <span className='text-sm font-medium'>{question}</span>
                      </div>
                    </motion.button>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className='bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}>
            <p className='text-amber-800 font-medium'>
              👈 Choose a mentor from the sidebar to begin your learning
              journey!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
