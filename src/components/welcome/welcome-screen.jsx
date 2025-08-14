// src/components/welcome/welcome-screen.jsx
'use client';

import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { AnimatePresence, motion } from 'framer-motion';

// Import all sub-components
import DefaultContent from './components/DefaultContent';
import HiteshContent from './components/HiteshContent';
import MentorStatusCard from './components/MentorStatusCard';
import PiyushContent from './components/PiyushContent';
import WelcomeBadge from './components/WelcomeBadge';
import WelcomeFooter from './components/WelcomeFooter';
import WelcomeHero from './components/WelcomeHero';

const WelcomeScreen = ({ onQuickStart }) => {
  const { selectedPersona, mentorsOnline, mentorsLoading, darkMode } =
    useChatStore();

  const startNewConversation = () => {
    const event = new CustomEvent('startNewConversation');
    window.dispatchEvent(event);
  };

  const handleQuickStart = (question) => {
    if (onQuickStart) {
      onQuickStart(question);
    } else {
      startNewConversation();
      setTimeout(() => {
        const event = new CustomEvent('autoSendMessage', { detail: question });
        window.dispatchEvent(event);
      }, 300);
    }
  };

  const persona = selectedPersona ? personas[selectedPersona] : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  // Render mentor-specific content
  const renderMentorContent = () => {
    if (!selectedPersona || !mentorsOnline || mentorsLoading) return null;

    switch (selectedPersona) {
      case 'hitesh':
        return (
          <HiteshContent
            onQuickStart={handleQuickStart}
            darkMode={darkMode}
          />
        );
      case 'piyush':
        return (
          <PiyushContent
            onQuickStart={handleQuickStart}
            darkMode={darkMode}
          />
        );
      default:
        return (
          <DefaultContent
            onQuickStart={handleQuickStart}
            darkMode={darkMode}
          />
        );
    }
  };

  return (
    <motion.div
      className='flex-1 flex flex-col min-h-0 overflow-hidden'
      variants={containerVariants}
      initial='hidden'
      animate='visible'>
      <div className='flex-1 overflow-y-auto scroll-smooth custom-scroll p-4 space-y-6'>
        <WelcomeBadge darkMode={darkMode} />

        <WelcomeHero
          darkMode={darkMode}
          persona={persona}
        />

        <MentorStatusCard
          persona={persona}
          mentorsOnline={mentorsOnline}
          mentorsLoading={mentorsLoading}
          darkMode={darkMode}
          selectedPersona={selectedPersona}
          onStartConversation={startNewConversation}
        />

        <AnimatePresence mode='wait'>{renderMentorContent()}</AnimatePresence>

        <WelcomeFooter darkMode={darkMode} />
      </div>

      {/* Scrollbar styles */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${darkMode
            ? 'rgba(156, 163, 175, 0.4)'
            : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 3px;
        }
      `}</style>
    </motion.div>
  );
};

export default WelcomeScreen;
