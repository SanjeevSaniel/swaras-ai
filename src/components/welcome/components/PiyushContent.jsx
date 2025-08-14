// src/components/welcome/components/PiyushContent.jsx
import React from 'react';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';
import StatsGrid from './StatsGrid';
import QuickStartSection from './QuickStartSection';

const PiyushContent = ({ onQuickStart, darkMode }) => {
  const piyushQuestions = [
    'Complete MERN stack guide?',
    'System design fundamentals?',
    'TypeScript vs JavaScript?',
    'Scaling web applications?',
    'DevOps for developers?',
    'Interview preparation tips?',
  ];

  const piyushStats = [
    {
      icon: Users,
      number: '1.5M+',
      label: 'Followers',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      number: '300+',
      label: 'Videos',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Clock,
      number: '8+',
      label: 'Years',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Success',
      color: 'from-blue-600 to-indigo-600',
    },
  ];

  return (
    <>
      <StatsGrid
        stats={piyushStats}
        darkMode={darkMode}
      />
      <QuickStartSection
        questions={piyushQuestions}
        onQuickStart={onQuickStart}
        darkMode={darkMode}
        mentorName='Piyush'
        theme='blue'
      />
    </>
  );
};

export default PiyushContent;
