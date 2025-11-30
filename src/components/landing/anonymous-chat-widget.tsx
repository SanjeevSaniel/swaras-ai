'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personas } from '@/constants/personas';
import { useChat } from '@ai-sdk/react';
import toast from 'react-hot-toast';
import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

const DEMO_PERSONA = 'hitesh';

export function AnonymousChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use AI SDK's useChat for state management
  const chatApi = useChat({
    // @ts-ignore - AI SDK v4 migration in progress
    api: '/api/chat/anonymous',
    initialMessages:
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('swar-ai-anonymous-chat') || '[]')
        : [],
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const {
    messages,
    // @ts-ignore - AI SDK v4 migration in progress
    setMessages,
  } = chatApi;

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('swar-ai-anonymous-chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: 3,
    limit: 3,
  });

  // Fetch rate limit status
  const fetchRateLimitStatus = async () => {
    try {
      const response = await fetch('/api/chat/anonymous/status');
      if (response.ok) {
        const data = await response.json();
        setRateLimitInfo({ remaining: data.remaining, limit: data.limit });
        if (data.isLimitReached) {
          setIsLimitReached(true);
          toast.error(
            `You've reached the free chat limit (${data.limit} messages). Sign up to continue!`,
          );
        }
      }
    } catch (error) {
      console.error('Failed to fetch rate limit status:', error);
    }
  };

  // Fetch rate limit status when widget opens
  useEffect(() => {
    if (isOpen) {
      fetchRateLimitStatus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText || !messageText.trim() || isLimitReached || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: messageText.trim(),
      createdAt: new Date(),
      parts: [{ type: 'text' as const, text: messageText.trim() }],
    };

    // Add user message immediately
    // @ts-ignore - AI SDK v4 type mismatch
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          persona: DEMO_PERSONA,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          setIsLimitReached(true);
          toast.error('You have reached the free chat limit.');
        } else {
          toast.error('Failed to send message. Please try again.');
        }
        setIsTyping(false);
        return;
      }

      // Handle streaming response manually like swaras-ai.tsx
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          // The API returns plain text chunks in this implementation
          assistantContent += chunk;

          // Update messages with streaming content
          setMessages((prevMessages) => {
            const withoutCurrent = prevMessages.filter(
              (m) => m.id !== assistantId,
            );
            return [
              ...withoutCurrent,
              // @ts-ignore - AI SDK v4 type mismatch
              {
                id: assistantId,
                role: 'assistant',
                content: assistantContent,
                createdAt: new Date(),
                parts: [{ type: 'text' as const, text: assistantContent }],
              },
            ];
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
      // Refetch rate limit status to update the badge
      fetchRateLimitStatus();
    }
  };

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}>
            <Card className='absolute gap-0 py-1 bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] shadow-2xl border-zinc-200 flex flex-col overflow-hidden light bg-white text-zinc-950'>
              {/* Header */}
              <CardHeader className='p-0'>
                <ChatHeader
                  selectedPersona={DEMO_PERSONA}
                  compact={true}
                  rateLimitInfo={rateLimitInfo}
                />
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-2 right-2 text-zinc-400 hover:text-zinc-600 h-8 w-8 z-10'
                  onClick={() => setIsOpen(false)}>
                  <X className='w-4 h-4' />
                </Button>
              </CardHeader>

              {/* Messages */}
              <CardContent className='flex-1 overflow-hidden p-0 flex flex-col'>
                <ChatMessages
                  messages={messages}
                  isTyping={isTyping}
                  selectedPersona={DEMO_PERSONA}
                  compact={true}
                />
              </CardContent>

              {/* Input */}
              <CardFooter className='p-0 relative'>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isLimitReached}
                  selectedPersona={DEMO_PERSONA}
                  isLoading={isTyping}
                  userUsage={null}
                  isRateLimited={isLimitReached}
                  hideSuggestions={true}
                  compact={true}
                />
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className='w-14 h-14 rounded-full bg-gradient-to-tr from-[#FA8072] to-[#FF8E8E] hover:from-[#FA8072]/90 hover:to-[#FF8E8E]/90 text-white shadow-xl shadow-[#FA8072]/30 flex items-center justify-center transition-all duration-300 z-50'>
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div
              key='close'
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <X className='w-6 h-6' />
            </motion.div>
          ) : (
            <motion.div
              key='chat'
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <MessageSquare className='w-6 h-6' />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
