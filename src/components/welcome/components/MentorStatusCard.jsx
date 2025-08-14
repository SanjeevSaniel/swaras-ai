// src/components/welcome/components/MentorStatusCard.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MentorStatusCard = ({
  persona,
  mentorsOnline,
  mentorsLoading,
  darkMode,
  selectedPersona,
  onStartConversation,
}) => {
  return (
    <div>
      <AnimatePresence mode='wait'>
        {persona && mentorsOnline && !mentorsLoading && (
          <motion.div
            key='mentor-active'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
            <Card
              className={`max-w-2xl mx-auto backdrop-blur-md border shadow-lg ${
                darkMode
                  ? 'bg-gray-800/80 border-gray-700/60'
                  : 'bg-white/80 border-gray-200/60'
              }`}>
              <CardContent className='p-4 flex items-center gap-3'>
                <div className='relative'>
                  <Avatar className='w-12 h-12 border-2 border-emerald-400/50 shadow-md'>
                    <AvatarFallback
                      className={`text-xl font-bold ${persona.accentColor} text-white`}>
                      {persona.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    className='absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center'
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <CheckCircle className='w-2 h-2 text-white' />
                  </motion.div>
                </div>

                <div className='flex-1 min-w-0'>
                  <h3
                    className={`text-lg font-bold truncate ${
                      darkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                    {persona.name}
                  </h3>
                  <p
                    className={`text-sm truncate ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {persona.title}
                  </p>
                  <div className='flex flex-wrap gap-1 mt-1'>
                    {persona.expertise.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill}
                        variant='outline'
                        className='text-xs px-1 py-0 h-4'>
                        {skill}
                      </Badge>
                    ))}
                    {persona.expertise.length > 2 && (
                      <Badge
                        variant='secondary'
                        className='text-xs px-1 py-0 h-4'>
                        +{persona.expertise.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={onStartConversation}
                  className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 shadow-md cursor-pointer'
                  disabled={!mentorsOnline || mentorsLoading}>
                  <Play className='w-4 h-4 mr-2' />
                  Start
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!selectedPersona && (
          <motion.div
            key='no-persona'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}>
            <Card
              className={`max-w-xl mx-auto border-2 border-dashed backdrop-blur-sm ${
                darkMode
                  ? 'border-gray-600/50 bg-gray-800/30'
                  : 'border-gray-300/50 bg-gray-50/30'
              }`}>
              <CardContent className='p-6 text-center'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-3'>
                  <Users
                    className={`w-6 h-6 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                  Choose Your Mentor
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Select a coding legend from the sidebar to begin
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedPersona && mentorsLoading && (
          <Card
            className={`max-w-xl mx-auto ${
              darkMode
                ? 'bg-amber-900/20 border-amber-700/30'
                : 'bg-amber-50/80 border-amber-200/60'
            }`}>
            <CardContent className='p-6 flex items-center gap-4'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className='w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg'>
                <Zap className='w-6 h-6 text-white' />
              </motion.div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${
                    darkMode ? 'text-amber-200' : 'text-amber-800'
                  }`}>
                  Connecting to {persona?.name}...
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-amber-300' : 'text-amber-700'
                  }`}>
                  Establishing secure AI connection
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorStatusCard;
