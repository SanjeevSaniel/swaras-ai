// src/store/chat-store.js - Enhanced with better conversation management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set, get) => ({
      // State - Modified to use persona-based conversations
      personaConversations: {}, // { personaId: conversation }
      currentConversation: null,
      selectedPersona: null,
      darkMode: false,
      mentorsOnline: false,
      mentorsLoading: true,

      // New enhanced state
      conversationStats: {
        totalMessages: 0,
        favoritePersona: null,
        longestConversation: null,
        totalSessions: 0,
      },
      userPreferences: {
        responseSpeed: 'normal', // slow, normal, fast
        personaStyle: 'authentic', // authentic, casual, formal
        notificationsEnabled: true,
        soundEnabled: false,
      },

      // Actions
      setMentorsOnline: (status) => set({ mentorsOnline: status }),
      setMentorsLoading: (loading) => set({ mentorsLoading: loading }),

      // Enhanced mentor status initialization
      initializeMentorStatus: () => {
        set({ mentorsOnline: false, mentorsLoading: true });

        // Simulate realistic connection process
        setTimeout(() => {
          set({ mentorsLoading: false, mentorsOnline: true });
          console.log('✅ AI Mentors connected successfully!');

          // Update session stats
          const state = get();
          set({
            conversationStats: {
              ...state.conversationStats,
              totalSessions: state.conversationStats.totalSessions + 1,
            },
          });
        }, Math.random() * 2000 + 3000);
      },

      // Enhanced persona selection - loads persona's conversation
      setSelectedPersona: (persona) => {
        const currentState = get();

        if (!currentState.mentorsOnline && persona) {
          console.log(
            '⚠️ Cannot select mentor - AI mentors are currently offline',
          );
          return;
        }

        if (!persona || currentState.selectedPersona === persona) {
          set({
            selectedPersona: null,
            currentConversation: null,
          });
          return;
        }

        // Load the persona's conversation or null if none exists
        const personaConversation = currentState.personaConversations[persona] || null;

        set({
          selectedPersona: persona,
          currentConversation: personaConversation,
          conversationStats: {
            ...currentState.conversationStats,
            favoritePersona: personaConversation ? persona : currentState.conversationStats.favoritePersona,
          },
        });

        console.log(`✨ Selected persona: ${persona}`, personaConversation ? 'with existing conversation' : 'new conversation');
      },

      // Enhanced conversation management
      setCurrentConversation: (conv) => {
        const state = get();

        if (!state.mentorsOnline) {
          console.log('⚠️ Cannot start conversation - AI mentors are offline');
          return;
        }

        if (
          state.selectedPersona &&
          conv &&
          conv.personaId === state.selectedPersona
        ) {
          set({ currentConversation: conv });
        } else if (!conv) {
          set({ currentConversation: null });
        }
      },

      // Enhanced conversation creation - one per persona
      addConversation: (conv) => {
        const state = get();

        if (!state.selectedPersona || !state.mentorsOnline) {
          console.warn('Cannot add conversation - invalid state');
          return;
        }

        const personaId = conv.personaId || state.selectedPersona;

        // Create or update the persona's conversation
        const enhancedConv = {
          ...conv,
          id: `${personaId}-conversation`,
          personaId,
          tags: [],
          rating: null,
          archived: false,
          lastAccessedAt: Date.now(),
          createdAt: state.personaConversations[personaId]?.createdAt || Date.now(),
        };

        set((state) => ({
          personaConversations: {
            ...state.personaConversations,
            [personaId]: enhancedConv,
          },
          currentConversation: enhancedConv,
          conversationStats: {
            ...state.conversationStats,
            totalMessages:
              state.conversationStats.totalMessages +
              enhancedConv.messages.length,
          },
        }));

        console.log(`💾 Saved conversation for persona: ${personaId}`);
      },

      // Enhanced conversation updates - persona-based
      updateConversation: (convId, updates) => {
        set((state) => {
          // Find which persona this conversation belongs to
          const personaId = Object.keys(state.personaConversations).find(
            pid => state.personaConversations[pid]?.id === convId
          );

          if (!personaId) {
            console.warn('Conversation not found:', convId);
            return state;
          }

          const existingConv = state.personaConversations[personaId];
          const updatedConv = {
            ...existingConv,
            ...updates,
            lastAccessedAt: Date.now(),
            messageCount: updates.messages
              ? updates.messages.length
              : existingConv.messageCount || 0,
          };

          // Track longest conversation
          const isLongest =
            !state.conversationStats.longestConversation ||
            updatedConv.messageCount >
              (state.conversationStats.longestConversation?.messageCount || 0);

          const newStats = { ...state.conversationStats };
          if (isLongest) {
            newStats.longestConversation = {
              id: updatedConv.id,
              messageCount: updatedConv.messageCount,
              personaId: updatedConv.personaId,
            };
          }

          // Calculate total messages
          const allConversations = Object.values({
            ...state.personaConversations,
            [personaId]: updatedConv,
          });
          newStats.totalMessages = allConversations.reduce(
            (total, conv) => total + (conv.messages?.length || 0),
            0,
          );

          return {
            personaConversations: {
              ...state.personaConversations,
              [personaId]: updatedConv,
            },
            currentConversation:
              state.currentConversation?.id === convId
                ? updatedConv
                : state.currentConversation,
            conversationStats: newStats,
          };
        });
      },

      // Delete conversation for a persona
      deleteConversation: (personaId) => {
        set((state) => {
          const conversationToDelete = state.personaConversations[personaId];
          if (!conversationToDelete) return state;

          const { [personaId]: deleted, ...remaining } = state.personaConversations;

          // Recalculate stats
          const remainingConversations = Object.values(remaining);
          const newTotalMessages = remainingConversations.reduce(
            (total, conv) => total + (conv.messages?.length || 0),
            0,
          );

          // Update longest conversation if deleted
          let newLongestConversation = state.conversationStats.longestConversation;
          if (state.conversationStats.longestConversation?.personaId === personaId) {
            newLongestConversation = remainingConversations.reduce(
              (longest, conv) => {
                const messageCount = conv.messages?.length || 0;
                return messageCount > (longest?.messageCount || 0)
                  ? { id: conv.id, messageCount, personaId: conv.personaId }
                  : longest;
              },
              null,
            );
          }

          return {
            personaConversations: remaining,
            currentConversation:
              state.currentConversation?.personaId === personaId
                ? null
                : state.currentConversation,
            conversationStats: {
              ...state.conversationStats,
              totalMessages: newTotalMessages,
              longestConversation: newLongestConversation,
            },
          };
        });

        console.log(`🗑️ Deleted conversation for persona: ${personaId}`);
      },

      // Enhanced theme management
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;

        if (typeof document !== 'undefined') {
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
          }
        }

        set({ darkMode: newDarkMode });
      },

      initializeTheme: () => {
        const { darkMode } = get();
        if (typeof document !== 'undefined') {
          if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
          }
        }
      },

      // New: Conversation search and filtering
      searchConversations: (query, personaId = null) => {
        const state = get();
        if (!query.trim()) return state.conversations;

        return state.conversations.filter((conv) => {
          const matchesPersona = !personaId || conv.personaId === personaId;
          const matchesQuery =
            conv.title.toLowerCase().includes(query.toLowerCase()) ||
            conv.messages.some((msg) =>
              msg.content.toLowerCase().includes(query.toLowerCase()),
            );

          return matchesPersona && matchesQuery;
        });
      },

      // New: Archive conversation
      archiveConversation: (convId) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === convId ? { ...conv, archived: true } : conv,
          ),
        }));
      },

      // New: Rate conversation
      rateConversation: (convId, rating) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === convId ? { ...conv, rating } : conv,
          ),
        }));
      },

      // New: Export conversations
      exportConversations: (personaId = null) => {
        const state = get();
        const conversationsToExport = personaId
          ? state.conversations.filter((conv) => conv.personaId === personaId)
          : state.conversations;

        const exportData = {
          exportDate: new Date().toISOString(),
          version: '1.1.0',
          totalConversations: conversationsToExport.length,
          conversations: conversationsToExport.map((conv) => ({
            ...conv,
            exportedAt: new Date().toISOString(),
          })),
          stats: state.conversationStats,
        };

        return exportData;
      },

      // New: Import conversations
      importConversations: (importData) => {
        try {
          const { conversations: importedConversations } = importData;

          set((state) => {
            // Merge with existing conversations, avoiding duplicates
            const existingIds = new Set(
              state.conversations.map((conv) => conv.id),
            );
            const newConversations = importedConversations.filter(
              (conv) => !existingIds.has(conv.id),
            );

            return {
              conversations: [...newConversations, ...state.conversations],
            };
          });

          return { success: true, imported: importedConversations.length };
        } catch (error) {
          console.error('Import failed:', error);
          return { success: false, error: error.message };
        }
      },

      // New: Get conversation analytics
      getAnalytics: () => {
        const state = get();
        const { conversations, conversationStats } = state;

        const personaBreakdown = conversations.reduce((acc, conv) => {
          acc[conv.personaId] = (acc[conv.personaId] || 0) + 1;
          return acc;
        }, {});

        const averageMessagesPerConversation =
          conversations.length > 0
            ? Math.round(conversationStats.totalMessages / conversations.length)
            : 0;

        const recentActivity = conversations.filter((conv) => {
          const daysSinceLastAccess =
            (Date.now() - (conv.lastAccessedAt || conv.createdAt)) /
            (1000 * 60 * 60 * 24);
          return daysSinceLastAccess <= 7;
        }).length;

        return {
          totalConversations: conversations.length,
          totalMessages: conversationStats.totalMessages,
          averageMessagesPerConversation,
          personaBreakdown,
          favoritePersona: conversationStats.favoritePersona,
          longestConversation: conversationStats.longestConversation,
          recentActivity,
          totalSessions: conversationStats.totalSessions,
        };
      },

      // Enhanced: Clear all conversations with confirmation
      clearAllConversations: () => {
        set({
          personaConversations: {},
          currentConversation: null,
          conversationStats: {
            totalMessages: 0,
            favoritePersona: null,
            longestConversation: null,
            totalSessions: get().conversationStats.totalSessions, // Keep session count
          },
        });
      },

      // Helper: Get all conversations as array
      getConversations: () => {
        const state = get();
        return Object.values(state.personaConversations);
      },

      // New: User preferences management
      updateUserPreferences: (preferences) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        }));
      },

      // New: Get conversation suggestions based on history
      getConversationSuggestions: (personaId) => {
        const state = get();
        const personaConversations = state.conversations.filter(
          (conv) => conv.personaId === personaId,
        );

        if (personaConversations.length === 0) {
          // Return default suggestions for new users
          const defaultSuggestions = {
            hitesh: [
              'JavaScript fundamentals ke liye step-by-step guide',
              'React hooks ki complete explanation chahiye',
              'Career guidance - industry mein kya important hai?',
              'Project banane ke liye roadmap suggest karo',
            ],
            piyush: [
              'Modern MERN stack with TypeScript setup',
              'System design fundamentals for scaling',
              'Production-ready deployment strategies',
              'Real-world project ideas for portfolio',
            ],
          };

          return defaultSuggestions[personaId] || [];
        }

        // Generate suggestions based on conversation history
        const topics = personaConversations.flatMap((conv) =>
          conv.messages
            .filter((msg) => msg.sender === 'user')
            .map((msg) => msg.content.toLowerCase()),
        );

        // Simple topic analysis - in production, use more sophisticated NLP
        const topicKeywords = {
          react: 'React development ke advanced concepts',
          javascript: 'JavaScript performance optimization tips',
          career: 'Career growth aur industry insights',
          project: 'Real-world project building guidance',
        };

        const suggestions = [];
        Object.entries(topicKeywords).forEach(([keyword, suggestion]) => {
          if (topics.some((topic) => topic.includes(keyword))) {
            suggestions.push(suggestion);
          }
        });

        return suggestions.slice(0, 4); // Return top 4 suggestions
      },
    }),
    {
      name: 'swaras-ai-persona-storage',
      partialize: (state) => ({
        personaConversations: state.personaConversations,
        selectedPersona: state.selectedPersona,
        darkMode: state.darkMode,
        conversationStats: state.conversationStats,
        userPreferences: state.userPreferences,
        // Don't persist mentor status - should reset on each load
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => {
            state.initializeTheme();
            state.initializeMentorStatus();
          }, 0);
        }
      },
      // Enhanced storage with version migration
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migrate from v0 to v1 - add new fields
          return {
            ...persistedState,
            conversationStats: {
              totalMessages: 0,
              favoritePersona: null,
              longestConversation: null,
              totalSessions: 0,
            },
            userPreferences: {
              responseSpeed: 'normal',
              personaStyle: 'authentic',
              notificationsEnabled: true,
              soundEnabled: false,
            },
          };
        }
        return persistedState;
      },
    },
  ),
);
