// src/components/sidebar/quick-actions.jsx
import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { motion } from 'framer-motion';
import { BookOpen, Coffee, Download, LogOut, Share2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const QuickActions = () => {
  const { darkMode, selectedPersona, clearAllConversations, conversations } =
    useChatStore();

  const currentPersona = personas[selectedPersona];
  const personaConversations = conversations.filter(
    (conv) => conv.personaId === selectedPersona,
  );

  const handleExportChats = () => {
    if (personaConversations.length === 0) {
      toast.error('No conversations to export');
      return;
    }

    const exportData = {
      persona: currentPersona?.name,
      exportDate: new Date().toISOString(),
      conversations: personaConversations,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      currentPersona?.name || 'swaras'
    }-chats-${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Chats exported successfully!');
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Swaras AI - Code with Legends',
        text: 'Check out this amazing AI coding mentor app!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const quickActions = [
    {
      id: 'docs',
      label: 'Documentation',
      icon: BookOpen,
      action: () => toast.info('Opening documentation...'),
      color: 'text-blue-500',
      enabled: true,
    },
    {
      id: 'export',
      label: 'Export Chats',
      icon: Download,
      action: handleExportChats,
      color: 'text-green-500',
      enabled: personaConversations.length > 0,
    },
    {
      id: 'share',
      label: 'Share App',
      icon: Share2,
      action: handleShareApp,
      color: 'text-purple-500',
      enabled: true,
    },
    {
      id: 'clear',
      label: 'Clear All',
      icon: LogOut,
      action: () => {
        clearAllConversations();
        toast.success('All conversations cleared!');
      },
      color: 'text-red-500',
      enabled: conversations.length > 0,
    },
  ];

  return (
    <div className='space-y-2'>
      {/* Persona-specific quick start */}
      {selectedPersona && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl border backdrop-blur-sm mb-3 ${
            darkMode
              ? 'bg-gray-800/30 border-gray-700/30'
              : 'bg-gray-50/70 border-gray-200/50'
          }`}>
          <div className='flex items-center space-x-2 mb-2'>
            <div
              className={`w-6 h-6 rounded-lg ${currentPersona?.accentColor} flex items-center justify-center text-white text-xs font-bold`}>
              {currentPersona?.avatar}
            </div>
            <span
              className={`text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {currentPersona?.name} Tools
            </span>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className={`h-8 text-xs justify-start ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
              {selectedPersona === 'hitesh' ? (
                <Coffee className='w-3 h-3 mr-1' />
              ) : (
                <Zap className='w-3 h-3 mr-1' />
              )}
              Quick Start
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className={`h-8 text-xs justify-start ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
              <BookOpen className='w-3 h-3 mr-1' />
              Examples
            </Button>
          </div>
        </motion.div>
      )}

      {/* General quick actions */}
      <div className='space-y-1'>
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}>
            <Button
              variant='ghost'
              size='sm'
              onClick={action.action}
              disabled={!action.enabled}
              className={`w-full justify-start text-xs h-9 ${
                action.enabled
                  ? darkMode
                    ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  : 'opacity-50 cursor-not-allowed'
              }`}>
              <action.icon
                className={`w-4 h-4 mr-2 flex-shrink-0 ${
                  action.enabled ? action.color : 'text-gray-400'
                }`}
              />
              <span className='truncate'>{action.label}</span>

              {action.id === 'export' && personaConversations.length > 0 && (
                <span
                  className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
                    darkMode
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                  {personaConversations.length}
                </span>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
