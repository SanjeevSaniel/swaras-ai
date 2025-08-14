// src/components/welcome/components/HiteshContent.jsx
import React from 'react';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';
import StatsGrid from './StatsGrid';
import QuickStartSection from './QuickStartSection';

const HiteshContent = ({ onQuickStart, darkMode }) => {
  const hiteshQuestions = [
    'How do I master React development?',
    'Career roadmap for full-stack?',
    'JavaScript advanced concepts?',
    'Your teaching methodology?',
    'Building production apps?',
    'Industry best practices?',
  ];

  const hiteshStats = [
    {
      icon: Users,
      number: '2M+',
      label: 'Students',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Award,
      number: '500+',
      label: 'Projects',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Clock,
      number: '10+',
      label: 'Years',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      number: '98%',
      label: 'Success',
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
