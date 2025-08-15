// src/components/welcome/components/PiyushContent.jsx - Enhanced with authentic questions
import React from 'react';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';
import StatsGrid from './StatsGrid';
import QuickStartSection from './QuickStartSection';

const PiyushContent = ({ onQuickStart, darkMode }) => {
  const piyushQuestions = [
    'Modern MERN stack with TypeScript - complete roadmap?',
    'System design fundamentals for scaling applications?',
    'Companies hire for which specific skills in 2024?',
    'Build production-ready full-stack project guidance?',
    'DevOps and deployment strategies for modern apps?',
    'Next.js vs React - when to use what in production?',
    'Database design: PostgreSQL vs MongoDB for scale?',
    'Real-world project ideas that impress hiring managers?',
  ];

  const piyushStats = [
    {
      icon: Users,
      number: '275K+',
      label: 'Subscribers',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      number: '50+',
      label: 'Prod Apps',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Clock,
      number: '8+',
      label: 'Years Exp',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Hire Rate',
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
