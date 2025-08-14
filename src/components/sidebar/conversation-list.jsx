// src/components/sidebar/conversation-list.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MessageCircle, Search, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chat-store';
import { AIService } from '@/services/ai-service';
import { formatChatDate } from '@/lib/date-utils';
import toast from 'react-hot-toast';

const ConversationList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    conversations,
    currentConversation,
    selectedPersona,
    darkMode,
    setCurrentConversation,
    addConversation,
    deleteConversation,
  } = useChatStore();

  const startNewConversation = () => {
    if (!selectedPersona) return;

    const newConversation = AIService.createConversation(selectedPersona);
    addConversation(newConversation);
    setCurrentConversation(newConversation);
    toast.success(`New conversation started!`);
  };

  const filteredConversations = conversations
    .filter((conv) => conv.personaId === selectedPersona)
    .filter(
      (conv) =>
        searchQuery === '' ||
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some((msg) =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className='flex-1 flex flex-col min-h-0 overflow-hidden'>
      {/* Header - Fixed */}
      <div className='flex-shrink-0 px-6 pb-3'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-2'>
            <MessageCircle
              className={`w-4 h-4 ${
                darkMode ? 'text-purple-400' : 'text-purple-500'
              }`}
            />
            <h2
              className={`text-sm font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Recent Chats
            </h2>
            {filteredConversations.length > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  darkMode
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                {filteredConversations.length}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewConversation}
            disabled={!selectedPersona}
            className={`p-2 rounded-xl transition-all duration-200 shadow-sm ${
              selectedPersona
                ? darkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/20'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-200/50'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}>
            <Plus className='w-4 h-4' />
          </motion.button>
        </div>

        {/* Search - Only show if there are conversations */}
        {filteredConversations.length > 3 && (
          <div className='relative'>
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <input
              type='text'
              placeholder='Search conversations...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-800/50 border-gray-600 text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:bg-gray-800/70'
                  : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white/70'
              } focus:outline-none focus:ring-1 focus:ring-purple-500/20 backdrop-blur-sm`}
            />
          </div>
        )}
      </div>

      {/* Scrollable Conversations List */}
      <div className='flex-1 min-h-0 px-6'>
        <ScrollArea className='h-full'>
          <div className='space-y-3 pr-4 pb-4'>
            {filteredConversations.length > 0 ? (
              <AnimatePresence>
                {filteredConversations.map((conv, index) => {
                  const dateInfo = formatChatDate(conv.createdAt);
                  const isActive = currentConversation?.id === conv.id;

                  return (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      onClick={() => setCurrentConversation(conv)}
                      className={`group relative p-4 rounded-2xl cursor-pointer border backdrop-blur-sm transition-all duration-300 ${
                        isActive
                          ? darkMode
                            ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50 shadow-lg shadow-purple-900/10'
                            : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg shadow-purple-200/20'
                          : darkMode
                          ? 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-700/60 hover:border-gray-600/50'
                          : 'bg-white/60 border-gray-200/50 hover:bg-white/90 hover:border-gray-300/70'
                      }`}>
                      {/* Content */}
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 min-w-0 pr-3'>
                          {/* Title */}
                          <div className='flex items-center space-x-2 mb-2'>
                            <p
                              className={`text-sm font-semibold truncate ${
                                isActive
                                  ? darkMode
                                    ? 'text-purple-300'
                                    : 'text-purple-700'
                                  : darkMode
                                  ? 'text-gray-200'
                                  : 'text-gray-900'
                              }`}>
                              {conv.title}
                            </p>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className='w-2 h-2 bg-green-400 rounded-full animate-pulse'
                              />
                            )}
                          </div>

                          {/* Last Message Preview */}
                          {conv.messages && conv.messages.length > 0 && (
                            <p
                              className={`text-xs leading-relaxed truncate mb-3 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                              {conv.messages[
                                conv.messages.length - 1
                              ]?.content?.slice(0, 60)}
                              ...
                            </p>
                          )}

                          {/* Date and Stats */}
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                              <div
                                className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                                  dateInfo.type === 'today'
                                    ? darkMode
                                      ? 'bg-green-900/30 text-green-400'
                                      : 'bg-green-100 text-green-700'
                                    : dateInfo.type === 'yesterday'
                                    ? darkMode
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-blue-100 text-blue-700'
                                    : darkMode
                                    ? 'bg-gray-800/50 text-gray-400'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                <Clock className='w-3 h-3' />
                                <span className='text-xs font-medium'>
                                  {dateInfo.primary}
                                </span>
                              </div>

                              <span
                                className={`text-xs px-2 py-1 rounded-lg ${
                                  dateInfo.type === 'today'
                                    ? darkMode
                                      ? 'bg-green-800/30 text-green-300'
                                      : 'bg-green-50 text-green-600'
                                    : dateInfo.type === 'yesterday'
                                    ? darkMode
                                      ? 'bg-blue-800/30 text-blue-300'
                                      : 'bg-blue-50 text-blue-600'
                                    : darkMode
                                    ? 'bg-gray-700/50 text-gray-400'
                                    : 'bg-gray-50 text-gray-500'
                                }`}>
                                {dateInfo.secondary}
                              </span>
                            </div>

                            {/* Message Count */}
                            {conv.messages && conv.messages.length > 1 && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  isActive
                                    ? darkMode
                                      ? 'bg-purple-800/50 text-purple-300'
                                      : 'bg-purple-200 text-purple-700'
                                    : darkMode
                                    ? 'bg-gray-700 text-gray-400'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {conv.messages.length} msgs
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conv.id);
                            toast.success('Conversation deleted');
                          }}
                          className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-xl ${
                            darkMode
                              ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                              : 'hover:bg-red-100 text-red-500 hover:text-red-600'
                          }`}>
                          <Trash2 className='w-4 h-4' />
                        </motion.button>
                      </div>

                      {/* Active Border Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId='activeConversation'
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${
                            darkMode
                              ? 'bg-gradient-to-b from-purple-500 to-pink-500'
                              : 'bg-gradient-to-b from-purple-500 to-pink-500'
                          }`}
                          transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      {/* Gradient Border Animation for Active */}
                      {isActive && (
                        <motion.div
                          className='absolute inset-0 rounded-2xl opacity-30'
                          style={{
                            background: `linear-gradient(90deg, transparent, ${
                              darkMode
                                ? 'rgba(147, 51, 234, 0.3)'
                                : 'rgba(147, 51, 234, 0.2)'
                            }, transparent)`,
                          }}
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              /* Empty State */
              <motion.div
                className={`flex flex-col items-center justify-center py-12 text-center ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}>
                <div
                  className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center ${
                    darkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                  }`}>
                  <MessageCircle className='w-8 h-8 opacity-50' />
                </div>
                <p className='text-sm font-medium mb-1'>
                  {searchQuery
                    ? 'No matching conversations'
                    : 'No conversations yet'}
                </p>
                <p className='text-xs'>
                  {selectedPersona
                    ? searchQuery
                      ? 'Try a different search term'
                      : 'Click the + button to start chatting!'
                    : 'Select a mentor to begin'}
                </p>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ConversationList;
