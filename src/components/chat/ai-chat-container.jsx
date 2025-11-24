'use client';

import { personas } from '@/constants/personas-dataset';
import { useChatStore } from '@/store/chat-store';
import { useChat } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import WelcomeScreen from '../welcome/welcome-screen';
import NixtioChatHeader from './nixtio-chat-header';
import NixtioChatInput from './nixtio-chat-input';
import NixtioChatMessages from './nixtio-chat-messages';

const AiChatContainer = ({ selectedPersona }) => {
  const { mentorsOnline, mentorsLoading } = useChatStore();

  // Use Vercel AI SDK's useChat hook with persistence
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    api: '/api/chat-ai',
    body: {
      persona: selectedPersona,
    },
    id: `conversation-${selectedPersona}`, // Unique ID for each persona conversation
    onError: (error) => {
      console.error('Chat error:', error);
      toast.error('Failed to get response from mentor. Please try again.', {
        duration: 6000,
        icon: '❌',
      });
    },
    onFinish: (message) => {
      const personaName = personas[selectedPersona]?.name;
      const personaAvatar = personas[selectedPersona]?.avatar;
      toast.success(`${personaName} responded! ✨`, {
        duration: 2000,
        icon: personaAvatar,
      });
    },
  });

  // Load persisted messages from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMessages = localStorage.getItem(
        `conversation-${selectedPersona}`,
      );
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);

          // Migrate old format to new format if needed
          const migratedMessages = parsedMessages.map((msg) => {
            // If message has 'sender' instead of 'role', migrate it
            if (msg.sender && !msg.role) {
              return {
                ...msg,
                role: msg.sender === 'user' ? 'user' : 'assistant',
              };
            }
            // If message has role='ai', convert to 'assistant'
            if (msg.role === 'ai') {
              return {
                ...msg,
                role: 'assistant',
              };
            }
            return msg;
          });

          setMessages(migratedMessages);

          // Save migrated messages back to localStorage
          if (
            JSON.stringify(parsedMessages) !== JSON.stringify(migratedMessages)
          ) {
            localStorage.setItem(
              `conversation-${selectedPersona}`,
              JSON.stringify(migratedMessages),
            );
          }
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      }
    }
  }, [selectedPersona, setMessages]);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(
        `conversation-${selectedPersona}`,
        JSON.stringify(messages),
      );
    }
  }, [messages, selectedPersona]);

  const handleQuickStart = async (question) => {
    if (!mentorsOnline || mentorsLoading) {
      toast.error('Please wait for AI mentors to come online.', {
        icon: '⏳',
        duration: 3000,
      });
      return;
    }

    toast.loading('Preparing your question...', {
      duration: 1000,
      icon: '🎯',
    });

    // Create a synthetic event to trigger form submission
    const syntheticEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    handleInputChange({ target: { value: question } });
    setTimeout(() => handleSubmit(syntheticEvent), 100);
  };

  const handleSendMessage = async (messageText) => {
    if (!mentorsOnline || mentorsLoading) {
      toast.error(
        'AI mentors are currently offline. Please wait for connection.',
        {
          duration: 4000,
          icon: '⚠️',
        },
      );
      return;
    }

    if (!messageText.trim() || isLoading) return;

    const personaName = personas[selectedPersona]?.name;
    const personaAvatar = personas[selectedPersona]?.avatar;

    toast.success(`Message sent to ${personaName}! 🚀`, {
      duration: 2000,
      icon: personaAvatar,
    });
  };

  // Show welcome screen if no messages
  if (messages.length === 0) {
    return (
      <motion.div
        className='h-full overflow-hidden bg-white'
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        key={`welcome-${selectedPersona}`}>
        <WelcomeScreen onQuickStart={handleQuickStart} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className='flex flex-col h-full overflow-hidden bg-white'
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      key={`conversation-${selectedPersona}`}>
      <NixtioChatHeader selectedPersona={selectedPersona} />
      <NixtioChatMessages
        messages={messages}
        isTyping={isLoading}
        selectedPersona={selectedPersona}
      />
      <NixtioChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        onSendMessage={handleSendMessage}
        selectedPersona={selectedPersona}
        disabled={!mentorsOnline || mentorsLoading || isLoading}
      />
    </motion.div>
  );
};

export default AiChatContainer;
