// src/components/welcome/welcome-screen.jsx
'use client';

import { personas } from '@/constants/personas-dataset';
import { AIService } from '@/services/ai-service';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Zap } from 'lucide-react';
import { useState } from 'react';

// Floating particles (minimal animations)
const FloatingParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className='absolute w-1 h-1 bg-pink-400 rounded-full opacity-30'
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

const WelcomeScreen = ({ onQuickStart }) => {
  const {
    selectedPersona,
    setSelectedPersona,
    darkMode,
    addConversation,
    setCurrentConversation,
    mentorsOnline,
  } = useChatStore();
  const [startingChat, setStartingChat] = useState(false);
  const persona = selectedPersona ? personas[selectedPersona] : null;

  // Conversation starters based on persona
  const getConversationStarters = (personaId) => {
    const starters = {
      hitesh: [
        'Explain JavaScript fundamentals',
        'How to learn React effectively?',
        'Career advice for developers'
      ],
      piyush: [
        'System design best practices',
        'Building scalable applications',
        'Modern full-stack architecture'
      ]
    };
    return starters[personaId] || [
      'Ask about their expertise',
      'Get career advice',
      'Learn best practices'
    ];
  };

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
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn from coding legends with personalized guidance',
      color: '#c026d3',
    },
    {
      icon: MessageCircle,
      title: 'Interactive Conversations',
      description: 'Engage in dynamic programming discussions',
      color: '#9333ea',
    },
    {
      icon: Zap,
      title: 'Instant Problem Solving',
      description: 'Get immediate help with coding challenges',
      color: '#d946ef',
    },
  ];


  if (!persona) {
    return (
      <div
        className={`relative min-h-screen ${
          darkMode ? 'bg-[#27282c] text-white' : 'bg-[#fafafa] text-gray-900'
        }`}>
        {/* JetBrains-style subtle gradient overlay */}
        <div
          className={`absolute inset-0 ${
            darkMode
              ? 'bg-gradient-to-b from-[#27282c] via-[#27282c] to-[#1e1f23]'
              : 'bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-[#f5f5f5]'
          }`}
        />

        <div className='relative z-10 max-w-[1280px] mx-auto px-8 py-16'>
          {/* JetBrains-style Hero section */}
          <div className='mb-24'>
            <div className='grid lg:grid-cols-2 gap-16 items-center'>
              {/* Left: Text content */}
              <div className='space-y-8'>
                {/* <div>
                  <h1 className={`text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] ${
                    darkMode ? 'text-white' : 'text-[#27282c]'
                  }`}
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    The AI-Powered<br/>
                    <span className='bg-gradient-to-r from-[#c026d3] to-[#d946ef] bg-clip-text text-transparent'>
                      Coding Mentor
                    </span>
                  </h1>

                  <p className={`text-xl lg:text-2xl leading-relaxed mb-8 ${
                    darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'
                  }`}>
                    Learn from industry legends Hitesh Choudhary and Piyush Garg through personalized AI mentorship
                  </p>

                  <div className='flex flex-wrap gap-4 items-center'>
                    <button className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                      mentorsOnline
                        ? 'bg-[#c026d3] hover:bg-[#a21caf] text-white shadow-lg hover:shadow-xl'
                        : 'bg-[#4d4d4d] text-[#999] cursor-not-allowed'
                    }`}
                      disabled={!mentorsOnline}>
                      {mentorsOnline ? 'Start Learning' : 'Connecting...'}
                    </button>

                    <div className='flex items-center space-x-2'>
                      <div className={`w-2 h-2 rounded-full ${
                        mentorsOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className={`text-sm ${darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'}`}>
                        {mentorsOnline ? '2 Mentors Online' : 'Connecting...'}
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Stats row */}
                {/* <div className='grid grid-cols-3 gap-6 pt-8 border-t'
                  style={{ borderColor: darkMode ? '#3c3d41' : '#e6e6e6' }}>
                  <div>
                    <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#27282c]'}`}>
                      1.6M+
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'}`}>
                      Students Taught
                    </div>
                  </div>
                  <div>
                    <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#27282c]'}`}>
                      15+
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'}`}>
                      Years Experience
                    </div>
                  </div>
                  <div>
                    <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#27282c]'}`}>
                      24/7
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'}`}>
                      AI Support
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Right: Visual element */}
              <div
                className={`relative h-[500px] rounded-2xl overflow-hidden ${
                  darkMode ? 'bg-[#2b2d30]' : 'bg-white'
                }`}
                style={{
                  boxShadow: darkMode
                    ? '0 20px 60px rgba(0,0,0,0.3)'
                    : '0 20px 60px rgba(0,0,0,0.08)',
                }}>
                {/* Code editor mockup */}
                <div className='p-4'>
                  <div className='flex items-center space-x-2 mb-4'>
                    <div className='w-3 h-3 rounded-full bg-[#ff5f57]' />
                    <div className='w-3 h-3 rounded-full bg-[#ffbd2e]' />
                    <div className='w-3 h-3 rounded-full bg-[#28ca42]' />
                  </div>

                  <div className='space-y-3 font-mono text-sm'>
                    <div className='flex'>
                      <span
                        className={darkMode ? 'text-[#4d4d4d]' : 'text-[#999]'}>
                        1
                      </span>
                      <span className='ml-4'>
                        <span
                          className={
                            darkMode ? 'text-[#cf8e6d]' : 'text-[#0033b3]'
                          }>
                          const
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#c77dbb]' : 'text-[#067d17]'
                          }>
                          {' '}
                          mentor
                        </span>
                        <span
                          className={darkMode ? 'text-white' : 'text-black'}>
                          {' '}
                          ={' '}
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#6a8759]' : 'text-[#1a8031]'
                          }>
                          "Hitesh"
                        </span>
                      </span>
                    </div>
                    <div className='flex'>
                      <span
                        className={darkMode ? 'text-[#4d4d4d]' : 'text-[#999]'}>
                        2
                      </span>
                      <span className='ml-4'>
                        <span
                          className={
                            darkMode ? 'text-[#cf8e6d]' : 'text-[#0033b3]'
                          }>
                          const
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#c77dbb]' : 'text-[#067d17]'
                          }>
                          {' '}
                          learn
                        </span>
                        <span
                          className={darkMode ? 'text-white' : 'text-black'}>
                          {' '}
                          ={' '}
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#c77dbb]' : 'text-[#00627a]'
                          }>
                          await{' '}
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#ffc66d]' : 'text-[#0033b3]'
                          }>
                          swarasAI
                        </span>
                        <span
                          className={darkMode ? 'text-white' : 'text-black'}>
                          .
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#ffc66d]' : 'text-[#00627a]'
                          }>
                          ask
                        </span>
                        <span
                          className={darkMode ? 'text-white' : 'text-black'}>
                          {' '}
                          ()
                        </span>
                      </span>
                    </div>
                    <div className='flex'>
                      <span
                        className={darkMode ? 'text-[#4d4d4d]' : 'text-[#999]'}>
                        3
                      </span>
                      <span className='ml-4'>
                        <span
                          className={
                            darkMode ? 'text-[#ffc66d]' : 'text-[#00627a]'
                          }>
                          console
                        </span>
                        <span
                          className={darkMode ? 'text-white' : 'text-black'}>
                          .
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#ffc66d]' : 'text-[#00627a]'
                          }>
                          log
                        </span>
                        <span
                          className={darkMode ? 'text-white' : 'text-black'}>
                          {' '}
                          (
                        </span>
                        <span
                          className={
                            darkMode ? 'text-[#6a8759]' : 'text-[#1a8031]'
                          }>
                          "Learning!"
                        </span>
                        <span
                          className={darkMode ? 'text-white' : 'text-black'}>
                          )
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div
                    className={`mt-8 p-4 rounded-lg ${
                      darkMode ? 'bg-[#1e1f23]' : 'bg-[#f5f5f5]'
                    }`}>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 rounded-full bg-gradient-to-r from-[#c026d3] to-[#d946ef] flex items-center justify-center text-white text-sm font-bold'>
                        AI
                      </div>
                      <div className='flex-1'>
                        <p
                          className={`text-sm leading-relaxed ${
                            darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'
                          }`}>
                          Great question! Let me help you understand async/await
                          in JavaScript...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features section - JetBrains style */}
          <div className='mb-24'>
            <h2
              className={`text-4xl font-bold mb-12 ${
                darkMode ? 'text-white' : 'text-[#27282c]'
              }`}>
              Why choose Swaras AI
            </h2>

            <div className='grid md:grid-cols-3 gap-6'>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-[#2b2d30] hover:bg-[#313438]'
                      : 'bg-white hover:shadow-lg'
                  }`}
                  style={{
                    border: `1px solid ${darkMode ? '#3c3d41' : '#e6e6e6'}`,
                  }}>
                  <div
                    className='w-12 h-12 rounded-lg flex items-center justify-center mb-6'
                    style={{ backgroundColor: feature.color }}>
                    <feature.icon className='w-6 h-6 text-white' />
                  </div>

                  <h3
                    className={`font-bold text-xl mb-3 ${
                      darkMode ? 'text-white' : 'text-[#27282c]'
                    }`}>
                    {feature.title}
                  </h3>
                  <p
                    className={`text-base leading-relaxed ${
                      darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'
                    }`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentors section - JetBrains style */}
          <div className='mb-24'>
            <h2
              className={`text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-[#27282c]'
              }`}>
              Meet your AI mentors
            </h2>
            <p
              className={`text-xl mb-12 ${
                darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'
              }`}>
              Learn from industry legends with years of real-world experience
            </p>

            <div className='grid md:grid-cols-2 gap-8'>
              {Object.entries(personas).map(
                ([personaId, personaData], index) => (
                  <div
                    key={personaId}
                    onClick={() => selectPersonaAndStartChat(personaId)}
                    className={`p-8 rounded-xl cursor-pointer transition-all ${
                      darkMode
                        ? 'bg-[#2b2d30] hover:bg-[#313438]'
                        : 'bg-white hover:shadow-xl'
                    } ${!mentorsOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      border: `1px solid ${darkMode ? '#3c3d41' : '#e6e6e6'}`,
                      boxShadow: darkMode
                        ? 'none'
                        : '0 8px 24px rgba(0,0,0,0.06)',
                    }}>
                    <div className='flex items-start space-x-6'>
                      <div className='relative flex-shrink-0'>
                        <img
                          src={personaData.avatarUrl}
                          alt={personaData.name}
                          className='w-20 h-20 rounded-lg object-cover'
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          className='w-20 h-20 rounded-lg bg-gradient-to-r from-[#c026d3] to-[#d946ef] flex items-center justify-center text-3xl'
                          style={{ display: 'none' }}>
                          {personaData.avatar}
                        </div>

                        {/* Online badge */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                            darkMode ? 'border-[#2b2d30]' : 'border-white'
                          } ${mentorsOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between mb-2'>
                          <h3
                            className={`font-bold text-2xl ${
                              darkMode ? 'text-white' : 'text-[#27282c]'
                            }`}>
                            {personaData.name}
                          </h3>
                          <svg
                            className='w-5 h-5 flex-shrink-0'
                            fill='currentColor'
                            viewBox='0 0 20 20'>
                            <path
                              fillRule='evenodd'
                              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>

                        <p
                          className={`text-base mb-4 ${
                            darkMode ? 'text-[#aaadb3]' : 'text-[#6c6e73]'
                          }`}>
                          {personaData.title}
                        </p>

                        <div className='flex flex-wrap gap-2 mb-4'>
                          {personaData.expertise
                            .slice(0, 3)
                            .map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className={`text-xs px-3 py-1 rounded-full ${
                                  darkMode
                                    ? 'bg-[#1e1f23] text-[#aaadb3]'
                                    : 'bg-[#f5f5f5] text-[#6c6e73]'
                                }`}>
                                {skill}
                              </span>
                            ))}
                          {personaData.expertise.length > 3 && (
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                darkMode
                                  ? 'bg-[#1e1f23] text-[#aaadb3]'
                                  : 'bg-[#f5f5f5] text-[#6c6e73]'
                              }`}>
                              +{personaData.expertise.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className='flex items-center space-x-4'>
                          {personaData.websiteUrl && (
                            <a
                              href={personaData.websiteUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              onClick={(e) => e.stopPropagation()}
                              className={`text-sm hover:underline ${
                                darkMode ? 'text-[#c026d3]' : 'text-[#c026d3]'
                              }`}>
                              Website
                            </a>
                          )}
                          {personaData.youtubeUrl && (
                            <a
                              href={personaData.youtubeUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              onClick={(e) => e.stopPropagation()}
                              className={`text-sm hover:underline ${
                                darkMode ? 'text-[#c026d3]' : 'text-[#c026d3]'
                              }`}>
                              YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact modern welcome view for chat interface
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='h-full flex items-center justify-center px-6 py-12 overflow-y-auto'>
      <div className='max-w-xl w-full'>
        {/* Compact Header */}
        <div className='text-center mb-8'>
          <div className='relative mb-4 inline-block'>
            <div className='relative w-16 h-16'>
              <img
                src={persona.avatarUrl}
                alt={persona.name}
                className='w-16 h-16 rounded-full object-cover shadow-md'
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className='w-16 h-16 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-2xl shadow-md'
                style={{ display: 'none' }}>
                {persona.avatar}
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
                  mentorsOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>
          </div>

          <h2 className='text-2xl font-semibold mb-1 text-foreground'>
            {persona.name}
          </h2>
          <p className='text-base text-muted-foreground/80'>
            {persona.title} • {persona.subtitle}
          </p>
        </div>

        {/* Quick Start Prompts */}
        {onQuickStart && (
          <div className='space-y-2 mb-6'>
            <p className='text-sm font-medium text-muted-foreground/70 px-1 mb-3'>
              Try asking about...
            </p>
            <div className='grid gap-2'>
              {getConversationStarters(selectedPersona).map((starter, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => {
                    if (mentorsOnline) {
                      window.dispatchEvent(new CustomEvent('setInputValue', { detail: starter }));
                    }
                  }}
                  disabled={!mentorsOnline}
                  className={`group relative px-3.5 py-3 rounded-lg text-sm text-left transition-all ${
                    !mentorsOnline
                      ? 'opacity-50 cursor-not-allowed bg-accent/50'
                      : 'cursor-pointer bg-accent/50 hover:bg-accent border border-transparent hover:border-[#FA8072]/20'
                  }`}>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-foreground/90 font-medium line-clamp-1'>{starter}</span>
                    <svg
                      className='w-4 h-4 text-muted-foreground/50 group-hover:text-[#FA8072] group-hover:translate-x-0.5 transition-all flex-shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Expertise Tags */}
        <div className='mb-6'>
          <p className='text-sm font-medium text-muted-foreground/70 px-1 mb-2'>
            Expertise
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {persona.expertise.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className='px-2.5 py-1 text-xs font-medium rounded-md bg-accent/60 text-foreground/70 border border-border/30'>
                {skill}
              </span>
            ))}
            {persona.expertise.length > 6 && (
              <span className='px-2.5 py-1 text-xs font-medium rounded-md bg-accent/60 text-foreground/70 border border-border/30'>
                +{persona.expertise.length - 6}
              </span>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className='text-center'>
          <p className='text-xs text-muted-foreground/60 leading-relaxed'>
            Type your question below or click a suggestion to get started
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;

