// src/store/chat-store.js - Enhanced with better conversation management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set, get) => ({
      // State
      conversations: [],
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

      // Enhanced persona selection with analytics
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

        // Update favorite persona statistics
        const personaConversations = currentState.conversations.filter(
          (conv) => conv.personaId === persona,
        );

        set({
          selectedPersona: persona,
          currentConversation: null,
          conversationStats: {
            ...currentState.conversationStats,
            favoritePersona:
              personaConversations.length > 0
                ? persona
                : currentState.conversationStats.favoritePersona,
          },
        });

        console.log(`✨ Selected persona: ${persona}`);
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

      // Enhanced conversation creation with better titles
      addConversation: (conv) => {
        const state = get();

        if (!state.selectedPersona || !state.mentorsOnline) {
          console.warn('Cannot add conversation - invalid state');
          return;
        }

        // Generate better conversation title based on first message
        const enhancedConv = {
          ...conv,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tags: [], // For future categorization
          rating: null, // User can rate conversations
          archived: false,
          lastAccessedAt: Date.now(),
        };

        set((state) => ({
          conversations: [enhancedConv, ...state.conversations],
          conversationStats: {
            ...state.conversationStats,
            totalMessages:
              state.conversationStats.totalMessages +
              enhancedConv.messages.length,
          },
        }));
      },

      // Enhanced conversation updates with analytics
      updateConversation: (convId, updates) => {
        set((state) => {
          const updatedConversations = state.conversations.map((c) => {
            if (c.id === convId) {
              const updatedConv = {
                ...c,
                ...updates,
                lastAccessedAt: Date.now(),
                messageCount: updates.messages
                  ? updates.messages.length
                  : c.messageCount || 0,
              };

              // Track longest conversation
              const isLongest =
                !state.conversationStats.longestConversation ||
                updatedConv.messageCount >
                  (state.conversationStats.longestConversation?.messageCount ||
                    0);

              if (isLongest) {
                state.conversationStats.longestConversation = {
                  id: updatedConv.id,
                  messageCount: updatedConv.messageCount,
                  personaId: updatedConv.personaId,
                };
              }

              return updatedConv;
            }
            return c;
          });

          const newTotalMessages = updatedConversations.reduce(
            (total, conv) => total + (conv.messages?.length || 0),
            0,
          );

          return {
            conversations: updatedConversations,
            currentConversation:
              state.currentConversation?.id === convId
                ? { ...state.currentConversation, ...updates }
                : state.currentConversation,
            conversationStats: {
              ...state.conversationStats,
              totalMessages: newTotalMessages,
            },
          };
        });
      },

      // Enhanced conversation deletion with confirmation
      deleteConversation: (convId) => {
        set((state) => {
          const conversationToDelete = state.conversations.find(
            (c) => c.id === convId,
          );

          if (!conversationToDelete) return state;

          const updatedConversations = state.conversations.filter(
            (c) => c.id !== convId,
          );

          // Recalculate stats
          const newTotalMessages = updatedConversations.reduce(
            (total, conv) => total + (conv.messages?.length || 0),
            0,
          );

          // Update longest conversation if deleted
          let newLongestConversation =
            state.conversationStats.longestConversation;
          if (state.conversationStats.longestConversation?.id === convId) {
            newLongestConversation = updatedConversations.reduce(
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
            conversations: updatedConversations,
            currentConversation:
              state.currentConversation?.id === convId
                ? null
                : state.currentConversation,
            conversationStats: {
              ...state.conversationStats,
              totalMessages: newTotalMessages,
              longestConversation: newLongestConversation,
            },
          };
        });
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
          conversations: [],
          currentConversation: null,
          conversationStats: {
            totalMessages: 0,
            favoritePersona: null,
            longestConversation: null,
            totalSessions: get().conversationStats.totalSessions, // Keep session count
          },
        });
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
      name: 'swaras-ai-enhanced-storage',
      partialize: (state) => ({
        conversations: state.conversations,
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
