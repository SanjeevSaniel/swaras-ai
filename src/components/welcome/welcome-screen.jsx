// src/components/welcome/welcome-screen.jsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { AIService } from '@/services/ai-service';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Brain,
  ChevronRight,
  Code,
  Coffee,
  Cpu,
  Globe,
  MessageCircle,
  Play,
  Rocket,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaYoutube } from 'react-icons/fa6';
import { FaExternalLinkAlt } from 'react-icons/fa';

// Compact floating particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className='absolute w-1 h-1 bg-purple-400 rounded-full opacity-30'
          animate={{
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 2 + 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Gradient text component
const GradientText = ({ children, className = '' }) => (
  <span
    className={`bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const WelcomeScreen = () => {
  const {
    selectedPersona,
    setSelectedPersona,
    darkMode,
    addConversation,
    setCurrentConversation,
    mentorsOnline,
  } = useChatStore();
  const [animationStage, setAnimationStage] = useState(0);
  const [startingChat, setStartingChat] = useState(false);
  const persona = selectedPersona ? personas[selectedPersona] : null;

  useEffect(() => {
    // Progressive animation stages
    const timers = [
      setTimeout(() => setAnimationStage(1), 500), // Hero
      setTimeout(() => setAnimationStage(2), 800), // Stats
      setTimeout(() => setAnimationStage(3), 1200), // Quick Starts
      setTimeout(() => setAnimationStage(4), 1600), // Features/Mentors
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  // Function to start a new chat
  const startNewChat = async () => {
    if (!selectedPersona || !mentorsOnline) {
      console.log(
        '❌ Cannot start chat - no persona selected or mentors offline',
      );
      return;
    }

    setStartingChat(true);

    try {
      // Create new conversation
      const newConversation = AIService.createConversation(selectedPersona);

      // Add initial greeting message from the mentor
      const greetingMessage = AIService.createMessage(
        AIService.getPersonaGreeting(selectedPersona),
        'assistant',
        { isGreeting: true },
      );

      // Update conversation with greeting
      const conversationWithGreeting = {
        ...newConversation,
        messages: [greetingMessage],
        messageCount: 1,
        lastMessageAt: Date.now(),
      };

      // Add to store
      addConversation(conversationWithGreeting);
      setCurrentConversation(conversationWithGreeting);

      console.log('✅ New chat started with', selectedPersona);
    } catch (error) {
      console.error('❌ Error starting chat:', error);
      // You could add a toast notification here for user feedback
    } finally {
      setStartingChat(false);
    }
  };

  // Function to handle persona selection and start chat immediately
  const selectPersonaAndStartChat = async (personaId) => {
    if (!mentorsOnline) {
      console.log('❌ Mentors are offline, cannot start chat');
      return;
    }

    setSelectedPersona(personaId);

    // Small delay to allow persona selection to register
    setTimeout(() => {
      startNewChat();
    }, 100);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Smart learning with personalized guidance',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Learn from industry professionals',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Rocket,
      title: 'Fast Progress',
      description: 'Accelerate your coding career',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { number: '1.6M+', label: 'Students', icon: Users },
    { number: '15+', label: 'Years Exp', icon: Award },
    { number: '24/7', label: 'Available', icon: Globe },
    { number: '100%', label: 'Personal', icon: Target },
  ];

  const personaIcons = { hitesh: Coffee, piyush: Zap };

  const quickStarts = [
    {
      icon: Code,
      title: 'Start Coding',
      description: 'Begin with interactive exercises',
      color: 'from-blue-500 to-purple-500',
      action: () => {
        // You can implement specific quick start actions here
        if (selectedPersona) {
          startNewChat();
        } else {
          // Auto-select first available persona and start
          const firstPersona = Object.keys(personas)[0];
          selectPersonaAndStartChat(firstPersona);
        }
      },
    },
    {
      icon: MessageCircle,
      title: 'Ask Questions',
      description: 'Get instant help from AI mentors',
      color: 'from-green-500 to-teal-500',
      action: () => {
        if (selectedPersona) {
          startNewChat();
        } else {
          const firstPersona = Object.keys(personas)[0];
          selectPersonaAndStartChat(firstPersona);
        }
      },
    },
    {
      icon: Rocket,
      title: 'Build Projects',
      description: 'Create real-world applications',
      color: 'from-orange-500 to-red-500',
      action: () => {
        if (selectedPersona) {
          startNewChat();
        } else {
          const firstPersona = Object.keys(personas)[0];
          selectPersonaAndStartChat(firstPersona);
        }
      },
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Monitor your learning journey',
      color: 'from-pink-500 to-rose-500',
      action: () => {
        // Could open a progress/dashboard view
        console.log('Track progress clicked - implement progress tracking');
      },
    },
  ];

  // Quick Start Card Component with click handler
  const QuickStartCard = ({ item, index, show }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{
        opacity: show ? 1 : 0,
        y: show ? 0 : 30,
        scale: show ? 1 : 0.8,
      }}
      transition={{
        delay: show ? index * 0.1 : 0,
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={item.action}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
        darkMode
          ? 'bg-gray-800/70 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/90'
          : 'bg-white/70 border-gray-200/50 hover:border-gray-300 hover:bg-white/90'
      } ${!mentorsOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ backdropFilter: 'blur(12px)' }}>
      {/* Icon with gradient background */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300`}>
        <item.icon className='w-6 h-6 text-white' />
      </div>

      {/* Title */}
      <h3
        className={`font-bold text-sm text-center mb-2 ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
        {item.title}
      </h3>

      {/* Description */}
      <p
        className={`text-xs text-center leading-relaxed ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
        {item.description}
      </p>

      {/* Subtle hover indicator */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          darkMode
            ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
            : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5'
        }`}
      />
    </motion.div>
  );

  // Fixed mentor card with proper avatar positioning, click handler, and social links
  const MentorCard = ({ personaId, personaData, index }) => {
    const IconComponent = personaIcons[personaId] || Code;

    const handleSocialClick = (e, url) => {
      e.stopPropagation(); // Prevent triggering the main card click
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: animationStage >= 4 ? 1 : 0,
          y: animationStage >= 4 ? 0 : 30,
        }}
        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
        whileHover={{ scale: 1.03, y: -5 }}
        onClick={() => selectPersonaAndStartChat(personaId)}
        className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
          darkMode
            ? 'bg-gray-800/70 border-gray-700/50 hover:border-gray-600'
            : 'bg-white/70 border-gray-200/50 hover:border-gray-300'
        } ${!mentorsOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ backdropFilter: 'blur(12px)' }}>
        <div className='flex items-center space-x-4'>
          {/* Fixed avatar section */}
          <div className='relative flex-shrink-0'>
            <div className='relative w-16 h-16'>
              <img
                src={personaData.avatarUrl}
                alt={`${personaData.name} avatar`}
                className='w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-lg'
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className='w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl border-2 border-white/50 shadow-lg'
                style={{ display: 'none' }}>
                {personaData.avatar}
              </div>

              {/* Properly positioned online badge */}
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white shadow-sm ${
                  mentorsOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                <div className='w-2 h-2 bg-white rounded-full'></div>
              </div>
            </div>
          </div>

          {/* Mentor info */}
          <div className='flex-1 min-w-0'>
            <h3
              className={`font-bold text-lg mb-1 ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
              {personaData.name}
            </h3>

            <p
              className={`text-sm mb-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {personaData.title}
            </p>

            {/* Skills badges */}
            <div className='flex flex-wrap gap-1 mb-3'>
              {personaData.expertise.slice(0, 2).map((skill, skillIndex) => (
                <Badge
                  key={skillIndex}
                  variant='secondary'
                  className='text-xs px-2 py-0.5 bg-purple-100 text-purple-700'>
                  {skill}
                </Badge>
              ))}
              {personaData.expertise.length > 2 && (
                <Badge
                  variant='outline'
                  className='text-xs px-2 py-0.5'>
                  +{personaData.expertise.length - 2}
                </Badge>
              )}
            </div>

            {/* Social Links */}
            <div className='flex items-center space-x-2'>
              {personaData.websiteUrl && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleSocialClick(e, personaData.websiteUrl)}
                  className={`p-2 rounded-lg relative overflow-hidden group transition-all duration-500 ease-out ${
                    darkMode
                      ? 'bg-gray-700/50 text-gray-400'
                      : 'bg-gray-100/50 text-gray-500'
                  }`}
                  title={`Visit ${personaData.name}'s website`}>
                  {/* Animated background overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ease-out transform scale-0 group-hover:scale-100 ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-500'
                    } rounded-lg`}
                  />

                  <FaExternalLinkAlt className='w-4 h-4 relative z-10 transition-colors duration-500 ease-out group-hover:text-white' />
                </motion.button>
              )}

              {personaData.youtubeUrl && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleSocialClick(e, personaData.youtubeUrl)}
                  className={`p-2 rounded-lg relative overflow-hidden group transition-all duration-500 ease-out ${
                    darkMode
                      ? 'bg-gray-700/50 text-gray-400'
                      : 'bg-gray-100/50 text-gray-500'
                  }`}
                  title={`Visit ${personaData.name}'s YouTube channel`}>
                  {/* Animated background overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ease-out transform scale-0 group-hover:scale-100 ${
                      darkMode ? 'bg-red-600' : 'bg-red-500'
                    } rounded-lg`}
                  />

                  <FaYoutube className='w-4 h-4 relative z-10 transition-colors duration-500 ease-out group-hover:text-white' />
                </motion.button>
              )}
            </div>
          </div>

          {/* Action arrow */}
          <motion.div
            whileHover={{ x: 5 }}
            className='flex-shrink-0'>
            <ArrowRight
              className={`w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  if (!persona) {
    return (
      <div
        className={`relative min-h-screen overflow-hidden ${
          darkMode
            ? 'bg-gray-900 text-gray-100'
            : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-900'
        }`}>
        {/* Background elements */}
        <FloatingParticles />
        <div className='absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full filter blur-2xl opacity-20 animate-pulse' />
        <div className='absolute bottom-10 right-10 w-40 h-40 bg-pink-400 rounded-full filter blur-2xl opacity-20 animate-pulse' />

        <div className='relative z-10 container mx-auto px-6 py-12 max-w-6xl'>
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{
              opacity: animationStage >= 1 ? 1 : 0,
              y: animationStage >= 1 ? 0 : -30,
            }}
            transition={{ duration: 0.8 }}
            className='text-center mb-12'>
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: animationStage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'backOut', delay: 0.2 }}
              className='mb-6'>
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-800/60' : 'bg-white/60'
                }`}
                style={{ backdropFilter: 'blur(10px)' }}>
                <Cpu className='w-8 h-8 text-purple-600' />
              </div>
            </motion.div>

            {/* Heading */}
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Welcome to <GradientText>Swaras AI</GradientText>
            </h1>

            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Your personalized AI coding mentor platform. Learn from experts
              and accelerate your journey.
            </p>

            {/* Mentor status indicator - FIXED */}
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                mentorsOnline
                  ? darkMode
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-green-100 text-green-700'
                  : darkMode
                  ? 'bg-gray-800/30 text-gray-400'
                  : 'bg-gray-100 text-gray-700'
              }`}>
              <div
                className={`w-2 h-2 rounded-full ${
                  mentorsOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              <span className='text-sm font-medium'>
                {mentorsOnline ? 'AI Mentors Online' : 'Mentors Connecting...'}
              </span>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: animationStage >= 2 ? 1 : 0,
              y: animationStage >= 2 ? 0 : 20,
            }}
            transition={{ duration: 0.6 }}
            className='grid grid-cols-4 gap-4 max-w-lg mx-auto mb-16'>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: animationStage >= 2 ? 1 : 0 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.5,
                  type: 'spring',
                }}
                className={`text-center p-3 rounded-xl ${
                  darkMode ? 'bg-gray-800/40' : 'bg-white/40'
                }`}
                style={{ backdropFilter: 'blur(8px)' }}>
                <stat.icon className='w-5 h-5 mx-auto mb-1 text-purple-600' />
                <div className='text-lg font-bold text-purple-600'>
                  {stat.number}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Starts - Now with working click handlers */}
          <div className='mb-16'>
            <h2
              className={`text-3xl font-bold text-center mb-8 ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
              Quick Start Your Journey
            </h2>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto'>
              {quickStarts.map((item, index) => (
                <QuickStartCard
                  key={index}
                  item={item}
                  index={index}
                  show={animationStage >= 3}
                />
              ))}
            </div>
          </div>

          {/* Features and mentors grid */}
          <div className='grid lg:grid-cols-2 gap-12 items-start'>
            {/* Features section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{
                opacity: animationStage >= 4 ? 1 : 0,
                x: animationStage >= 4 ? 0 : -30,
              }}
              transition={{ duration: 0.6 }}>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                Why <GradientText>Swaras AI?</GradientText>
              </h2>

              <div className='space-y-4'>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: animationStage >= 4 ? 1 : 0,
                      x: animationStage >= 4 ? 0 : -20,
                    }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    whileHover={{ x: 5 }}
                    className={`flex items-center p-4 rounded-xl border ${
                      darkMode
                        ? 'bg-gray-800/60 border-gray-700/50'
                        : 'bg-white/60 border-gray-200/50'
                    }`}
                    style={{ backdropFilter: 'blur(10px)' }}>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mr-4 flex-shrink-0`}>
                      <feature.icon className='w-6 h-6 text-white' />
                    </div>

                    <div className='flex-1'>
                      <h3
                        className={`font-semibold mb-1 ${
                          darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                        {feature.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mentors section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{
                opacity: animationStage >= 4 ? 1 : 0,
                x: animationStage >= 4 ? 0 : 30,
              }}
              transition={{ duration: 0.6 }}>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                Your <GradientText>AI Mentors</GradientText>
              </h2>

              <div className='space-y-4'>
                {Object.entries(personas).map(
                  ([personaId, personaData], index) => (
                    <MentorCard
                      key={personaId}
                      personaId={personaId}
                      personaData={personaData}
                      index={index}
                    />
                  ),
                )}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: animationStage >= 4 ? 1 : 0,
                  y: animationStage >= 4 ? 0 : 20,
                }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`mt-6 p-4 rounded-xl text-center ${
                  darkMode ? 'bg-gray-800/40' : 'bg-white/40'
                }`}
                style={{ backdropFilter: 'blur(10px)' }}>
                <div className='flex items-center justify-center space-x-2 mb-2'>
                  <ChevronRight className='w-4 h-4 text-purple-600' />
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    {mentorsOnline
                      ? 'Select a mentor above to start learning'
                      : 'Mentors are connecting... Please wait'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Selected persona view with working start chat button and social links
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative min-h-screen flex items-center justify-center p-6 overflow-hidden ${
        darkMode
          ? 'bg-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-900'
      }`}>
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className='relative z-10 max-w-2xl text-center'>
        <div className='relative mb-6 flex justify-center'>
          <div className='relative w-32 h-32'>
            <img
              src={persona.avatarUrl}
              alt={`${persona.name} avatar`}
              className='w-32 h-32 rounded-full object-cover border-4 border-white/50 shadow-xl'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div
              className='w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl border-4 border-white/50 shadow-xl'
              style={{ display: 'none' }}>
              {persona.avatar}
            </div>

            {/* Properly positioned status badge */}
            <div
              className={`absolute -bottom-2 -right-2 p-2 rounded-full border-3 border-white shadow-lg ${
                mentorsOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}>
              <Star className='w-4 h-4 text-white' />
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>
            Hello, I'm <GradientText>{persona.name}</GradientText>
          </h1>

          <p
            className={`text-lg mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            {persona.description}
          </p>

          {/* Status indicator - FIXED */}
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full mb-6 ${
              mentorsOnline
                ? darkMode
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-green-100 text-green-700'
                : darkMode
                ? 'bg-gray-800/30 text-gray-400'
                : 'bg-gray-100 text-gray-700'
            }`}>
            <div
              className={`w-2 h-2 rounded-full ${
                mentorsOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            <span className='text-sm font-medium'>
              {mentorsOnline ? 'Online & Ready' : 'Connecting...'}
            </span>
          </div>

          {/* Skills */}
          <div className='flex flex-wrap justify-center gap-2 mb-6'>
            {persona.expertise.slice(0, 4).map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}>
                <Badge
                  variant='outline'
                  className='px-3 py-1 bg-purple-100 text-purple-700 border-purple-200'>
                  {skill}
                </Badge>
              </motion.div>
            ))}
            {persona.expertise.length > 4 && (
              <Badge
                variant='outline'
                className='px-3 py-1'>
                +{persona.expertise.length - 4} more
              </Badge>
            )}
          </div>

          {/* Social Links for selected persona */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className='flex justify-center space-x-4 mb-8'>
            {persona.websiteUrl && (
              <motion.a
                href={persona.websiteUrl}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border relative overflow-hidden group transition-all duration-500 ease-out ${
                  darkMode
                    ? 'bg-gray-800/60 border-gray-700/50 text-gray-400'
                    : 'bg-white/60 border-gray-200/50 text-gray-500'
                }`}
                style={{ backdropFilter: 'blur(10px)' }}>
                {/* Animated background overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-out transform scale-0 group-hover:scale-100 ${
                    darkMode ? 'bg-blue-600' : 'bg-blue-500'
                  } rounded-xl`}
                />

                {/* Animated border overlay */}
                <div
                  className={`absolute inset-0 border rounded-xl transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 ${
                    darkMode ? 'border-blue-500' : 'border-blue-400'
                  }`}
                />

                <FaExternalLinkAlt className='w-4 h-4 relative z-10 transition-colors duration-500 ease-out group-hover:text-white' />
                <span className='text-sm font-medium relative z-10 transition-colors duration-500 ease-out group-hover:text-white'>
                  Website
                </span>
              </motion.a>
            )}

            {persona.youtubeUrl && (
              <motion.a
                href={persona.youtubeUrl}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border relative overflow-hidden group transition-all duration-500 ease-out ${
                  darkMode
                    ? 'bg-gray-800/60 border-gray-700/50 text-gray-400'
                    : 'bg-white/60 border-gray-200/50 text-gray-500'
                }`}
                style={{ backdropFilter: 'blur(10px)' }}>
                {/* Animated background overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-out transform scale-0 group-hover:scale-100 ${
                    darkMode ? 'bg-red-600' : 'bg-red-500'
                  } rounded-xl`}
                />

                {/* Animated border overlay */}
                <div
                  className={`absolute inset-0 border rounded-xl transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 ${
                    darkMode ? 'border-red-500' : 'border-red-400'
                  }`}
                />

                <FaYoutube className='w-4 h-4 relative z-10 transition-colors duration-500 ease-out group-hover:text-white' />
                <span className='text-sm font-medium relative z-10 transition-colors duration-500 ease-out group-hover:text-white'>
                  YouTube
                </span>
              </motion.a>
            )}
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className={`p-6 rounded-2xl border mb-8 ${
              darkMode
                ? 'bg-gray-800/60 border-gray-700/50'
                : 'bg-white/60 border-gray-200/50'
            }`}
            style={{ backdropFilter: 'blur(12px)' }}>
            <p
              className={`leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {persona.bio ||
                "I'm here to guide you through your programming journey with practical advice and real-world insights. Let's start coding together!"}
            </p>
          </motion.div>

          {/* CTA Button - Now with working onClick handler */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: mentorsOnline ? 1.05 : 1 }}
            whileTap={{ scale: mentorsOnline ? 0.95 : 1 }}>
            <Button
              onClick={startNewChat}
              disabled={!mentorsOnline || startingChat}
              className={`px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                mentorsOnline
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}>
              {startingChat ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full'
                  />
                  Starting Chat...
                </>
              ) : mentorsOnline ? (
                <>
                  <Play className='w-4 h-4 mr-2' />
                  Start Chatting with {persona.name.split(' ')[0]}
                  <MessageCircle className='w-4 h-4 ml-2' />
                </>
              ) : (
                <>
                  <MessageCircle className='w-4 h-4 mr-2' />
                  Mentor Connecting...
                </>
              )}
            </Button>
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className='mt-6'>
            <Button
              variant='ghost'
              onClick={() => setSelectedPersona(null)}
              className={`text-sm ${
                darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
              ← Choose Different Mentor
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
