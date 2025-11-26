// src/hooks/useMessageSync.ts - Hook for syncing messages with Neon DB
import { useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useChatStore } from '@/store/chat-store';

/**
 * Custom hook to sync conversation messages with Neon DB
 * Automatically saves messages when they change
 */
export function useMessageSync() {
  const { user } = useUser();
  const { personaConversations, currentConversation, selectedPersona } = useChatStore();
  const syncInProgressRef = useRef(false);
  const lastSyncedRef = useRef<Record<string, number>>({});

  /**
   * Sync a conversation to the database
   */
  const syncConversation = useCallback(
    async (conversationId: string, personaId: string, messages: any[]) => {
      if (!user?.id || syncInProgressRef.current) return;

      try {
        syncInProgressRef.current = true;

        // Format messages for API
        const formattedMessages = messages.map((msg) => ({
          id: msg.id || `${msg.timestamp || Date.now()}`,
          role: msg.role === 'ai' || msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        }));

        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            personaId,
            messages: formattedMessages,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync conversation');
        }

        lastSyncedRef.current[conversationId] = Date.now();
        console.log(`✅ Synced conversation ${conversationId} to database`);
      } catch (error) {
        console.error('Failed to sync conversation:', error);
      } finally {
        syncInProgressRef.current = false;
      }
    },
    [user]
  );

  /**
   * Load conversation from database
   */
  const loadConversation = useCallback(
    async (personaId: string) => {
      if (!user?.id) return null;

      try {
        const response = await fetch(`/api/messages?personaId=${personaId}`);

        if (!response.ok) {
          console.error('Failed to load conversation');
          return null;
        }

        const data = await response.json();
        return data.conversation;
      } catch (error) {
        console.error('Failed to load conversation:', error);
        return null;
      }
    },
    [user]
  );

  /**
   * Load all user conversations
   */
  const loadAllConversations = useCallback(async () => {
    if (!user?.id) return [];

    try {
      const response = await fetch('/api/messages');

      if (!response.ok) {
        console.error('Failed to load conversations');
        return [];
      }

      const data = await response.json();
      return data.conversations || [];
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return [];
    }
  }, [user]);

  /**
   * Auto-sync current conversation when messages change
   */
  useEffect(() => {
    if (!currentConversation || !selectedPersona || !user?.id) return;

    const { id, personaId, messages } = currentConversation;

    // Only sync if there are messages
    if (!messages || messages.length === 0) return;

    // Debounce sync - wait 2 seconds after last message
    const syncTimeout = setTimeout(() => {
      syncConversation(id, personaId, messages);
    }, 2000);

    return () => clearTimeout(syncTimeout);
  }, [currentConversation, selectedPersona, user, syncConversation]);

  /**
   * Sync all conversations periodically
   */
  useEffect(() => {
    if (!user?.id) return;

    const syncAllConversations = async () => {
      const conversations = Object.values(personaConversations);

      for (const conv of conversations) {
        if (conv.messages && conv.messages.length > 0) {
          await syncConversation(conv.id, conv.personaId, conv.messages);
        }
      }
    };

    // Sync every 5 minutes
    const interval = setInterval(syncAllConversations, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, personaConversations, syncConversation]);

  return {
    syncConversation,
    loadConversation,
    loadAllConversations,
  };
}
