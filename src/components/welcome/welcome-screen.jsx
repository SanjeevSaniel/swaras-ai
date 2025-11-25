// src/components/welcome/welcome-screen.jsx
'use client';

import { getEnabledPersonas } from '@/constants/personas';
import { AIService } from '@/services/ai-service';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

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
  const personas = getEnabledPersonas();
  const persona = selectedPersona ? personas[selectedPersona] : null;

  // Conversation starters based on persona
  const getConversationStarters = (personaId) => {
    const starters = {
      hitesh: [
        'Explain closures in JavaScript with chai analogy ☕',
        'React hooks vs class components - samjhao bhai',
        'Best roadmap for full-stack development in 2024'
      ],
      piyush: [
        'Design a scalable URL shortener system',
        'Microservices vs monolith - real production perspective',
        'How to crack system design interviews at FAANG?'
      ],
      foodpharmer: [
        'Is brown sugar actually healthier than white sugar?',
        'Decode this product label for hidden ingredients',
        'Truth about protein powder vs natural sources'
      ],
      johnnyharris: [
        'Why is the South China Sea so heavily contested?',
        'What really caused the Ukraine-Russia conflict?',
        'How does the Israel-Palestine situation work?'
      ],
      lla: [
        'Can my employer fire me without notice period?',
        'How to claim PF if company refuses to release it?',
        'What to do about workplace harassment legally?'
      ],
      zero1: [
        'How should I start investing with ₹10,000?',
        'SIP vs lump sum - which is better for beginners?',
        'Build an emergency fund - how much and where?'
      ],
      aliabdaal: [
        'Active recall vs re-reading - what does research say?',
        'How to build a sustainable morning routine?',
        'Best way to use Notion for personal knowledge management'
      ],
      kunalshah: [
        'Explain Delta 4 theory with real startup examples',
        'How to spot inefficiencies in existing markets?',
        'What makes a product truly irreversible for users?'
      ],
      markmanson: [
        'How do I stop caring about what others think?',
        'Finding meaning when everything feels pointless',
        'Why positive thinking can actually be harmful'
      ],
      ankurwarikoo: [
        'Mutual funds vs direct stocks - where to start?',
        'How to negotiate salary without seeming greedy?',
        'Money habits to build in your 20s'
      ],
      flyingbeast: [
        'Best beginner gym routine for natural muscle gain',
        'How to stay disciplined with early morning workouts?',
        'Balancing pilot career, fitness and family life'
      ]
    };
    return starters[personaId] || [
      'Ask about their expertise',
      'Get personalized advice',
      'Learn their proven strategies'
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

  if (!persona) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='h-full flex items-center justify-center px-6 py-12 overflow-y-auto'>
        <div className='max-w-2xl w-full text-center'>
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className='mb-8 inline-block'>
            <div className='relative'>
              <div className='w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center shadow-lg'>
                <Sparkles className='w-10 h-10 text-white' />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className='absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] blur-xl -z-10'
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='text-4xl md:text-5xl font-bold mb-4 text-foreground'>
            Welcome to Swaras AI
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className='text-lg md:text-xl text-muted-foreground/80 mb-12 leading-relaxed'>
            Select a mentor from the sidebar to start your personalized learning journey
          </motion.p>

          {/* Mentor Grid Preview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className='mb-12'>
            <p className='text-sm font-medium text-muted-foreground/70 mb-6'>
              {Object.keys(personas).length} Expert Mentors Available
            </p>

            {/* Avatar stack */}
            <div className='flex justify-center items-center mb-8'>
              <div className='flex -space-x-4'>
                {Object.entries(personas).slice(0, 5).map(([id, p], index) => (
                  <motion.div
                    key={id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    className='relative'>
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className='w-14 h-14 rounded-full border-4 border-background object-cover shadow-md hover:scale-110 transition-transform cursor-pointer'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className='w-14 h-14 rounded-full border-4 border-background bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-xl shadow-md'
                      style={{ display: 'none' }}>
                      {p.avatar}
                    </div>
                  </motion.div>
                ))}
                {Object.keys(personas).length > 5 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.3 }}
                    className='w-14 h-14 rounded-full border-4 border-background bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground shadow-md'>
                    +{Object.keys(personas).length - 5}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className='flex flex-wrap justify-center gap-2 max-w-lg mx-auto'>
              {['Programming', 'Nutrition', 'Finance', 'Productivity', 'Wellness'].map((category, index) => (
                <motion.span
                  key={category}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                  className='px-3 py-1.5 text-xs font-medium rounded-full bg-accent/60 text-foreground/70 border border-border/30'>
                  {category}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className='flex flex-col items-center gap-4'>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              mentorsOnline
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-yellow-500/10 border border-yellow-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                mentorsOnline ? 'bg-green-500' : 'bg-yellow-500'
              } animate-pulse`} />
              <span className={`text-sm font-medium ${
                mentorsOnline ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {mentorsOnline ? 'All mentors online' : 'Connecting to mentors...'}
              </span>
            </div>

            <p className='text-xs text-muted-foreground/60 max-w-md'>
              Click on any mentor card in the left sidebar to begin. Each mentor has unique expertise and communication style tailored to help you learn effectively.
            </p>
          </motion.div>
        </div>
      </motion.div>
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

        {/* Social Links */}
        {(persona.socialLinks?.youtube || persona.socialLinks?.instagram || persona.socialLinks?.twitter || persona.websiteUrl) && (
          <div className='mb-6'>
            <p className='text-sm font-medium text-muted-foreground/70 px-1 mb-2'>
              Connect
            </p>
            <div className='flex flex-wrap gap-2'>
              {persona.socialLinks?.youtube && (
                <a
                  href={persona.socialLinks.youtube}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors'>
                  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'/>
                  </svg>
                  YouTube
                </a>
              )}
              {persona.socialLinks?.instagram && (
                <a
                  href={persona.socialLinks.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 transition-colors'>
                  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
                  </svg>
                  Instagram
                </a>
              )}
              {persona.socialLinks?.twitter && (
                <a
                  href={persona.socialLinks.twitter}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors'>
                  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/>
                  </svg>
                  Twitter
                </a>
              )}
              {persona.websiteUrl && (
                <a
                  href={persona.websiteUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-accent/60 text-foreground/70 border border-border/30 hover:bg-accent transition-colors'>
                  <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'/>
                  </svg>
                  Website
                </a>
              )}
            </div>
          </div>
        )}

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

