// src/components/welcome/components/HiteshContent.jsx - Enhanced with authentic questions
import React from 'react';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';
import StatsGrid from './StatsGrid';
import QuickStartSection from './QuickStartSection';

const HiteshContent = ({ onQuickStart, darkMode }) => {
  const hiteshQuestions = [
    'Haanji bhai! React seekhna hai - kahan se start karu?',
    'JavaScript mein confused hun, step by step guide karo',
    'Career mein kya focus karna chahiye industry ke liye?',
    'Chai aur Code style mein project kaise banayein?',
    'Freelancing start karne ke liye roadmap batao',
    'YouTube pe coding channel grow kaise karein?',
    'Production ready app ke best practices?',
    'Interview preparation complete guide chahiye',
  ];

  const hiteshStats = [
    {
      icon: Users,
      number: '1.6M+',
      label: 'Students',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Award,
      number: '500+',
      label: 'Videos',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Clock,
      number: '15+',
      label: 'Years Exp',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      number: '98%',
      label: 'Success Rate',
      color: 'from-orange-600 to-red-600',
    },
  ];

  return (
    <>
      <StatsGrid
        stats={hiteshStats}
        darkMode={darkMode}
      />
      <QuickStartSection
        questions={hiteshQuestions}
        onQuickStart={onQuickStart}
        darkMode={darkMode}
        mentorName='Hitesh'
        theme='orange'
      />
    </>
  );
};

export default HiteshContent;
