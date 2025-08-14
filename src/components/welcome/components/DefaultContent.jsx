// src/components/welcome/components/DefaultContent.jsx
import React from 'react';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';
import StatsGrid from './StatsGrid';
import QuickStartSection from './QuickStartSection';

const DefaultContent = ({ onQuickStart, darkMode }) => {
  const defaultQuestions = [
    'How to start programming?',
    'Best programming language?',
    'Build first web project?',
    'Tech career guidance?',
  ];

  const defaultStats = [
    {
      icon: Users,
      number: '3M+',
      label: 'Learners',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: Award,
      number: '800+',
      label: 'Projects',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'Available',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      number: '97%',
      label: 'Success',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <>
      <StatsGrid
        stats={defaultStats}
        darkMode={darkMode}
      />
      <QuickStartSection
        questions={defaultQuestions}
        onQuickStart={onQuickStart}
        darkMode={darkMode}
        mentorName='AI Mentor'
        theme='purple'
      />
    </>
  );
};

export default DefaultContent;
