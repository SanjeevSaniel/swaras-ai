// src/store/chat-store.js (Added mentor status management)
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
      mentorsOnline: false, // New state for mentor availability
      mentorsLoading: true, // New state for loading status

      // Actions
      setMentorsOnline: (status) => set({ mentorsOnline: status }),
      setMentorsLoading: (loading) => set({ mentorsLoading: loading }),

      // Initialize mentor status on app load
      initializeMentorStatus: () => {
        set({ mentorsOnline: false, mentorsLoading: true });

        // Simulate loading and connection process
        setTimeout(() => {
          set({ mentorsLoading: false, mentorsOnline: true });
          console.log('✅ AI Mentors are now online and ready!');
        }, Math.random() * 2000 + 3000); // 3-5 seconds random delay
      },

      setSelectedPersona: (persona) => {
        const currentState = get();

        // Prevent selection if mentors are offline
        if (!currentState.mentorsOnline && persona) {
          console.log(
            '⚠️ Cannot select mentor - AI mentors are currently offline',
          );
          return;
        }

        // If deselecting (persona is null or same as current)
        if (!persona || currentState.selectedPersona === persona) {
          set({
            selectedPersona: null,
            currentConversation: null,
          });
          console.log('Persona deselected, showing empty state');
          return;
        }

        // Selecting new persona
        set({
          selectedPersona: persona,
          currentConversation: null,
        });

        console.log(`Selected persona: ${persona}`);
      },

      setCurrentConversation: (conv) => {
        const state = get();

        // Prevent conversation if mentors offline
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

      addConversation: (conv) => {
        const state = get();

        if (!state.selectedPersona || !state.mentorsOnline) {
          console.warn(
            'Cannot add conversation - no persona selected or mentors offline',
          );
          return;
        }

        set((state) => ({
          conversations: [conv, ...state.conversations],
        }));
      },

      updateConversation: (convId, updates) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId ? { ...c, ...updates } : c,
          ),
          currentConversation:
            state.currentConversation?.id === convId
              ? { ...state.currentConversation, ...updates }
              : state.currentConversation,
        })),

      deleteConversation: (convId) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== convId),
          currentConversation:
            state.currentConversation?.id === convId
              ? null
              : state.currentConversation,
        })),

      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;

        if (typeof document !== 'undefined') {
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }

        set({ darkMode: newDarkMode });
      },

      initializeTheme: () => {
        const { darkMode } = get();
        if (typeof document !== 'undefined') {
          if (darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      clearAllConversations: () =>
        set({
          conversations: [],
          currentConversation: null,
        }),
    }),
    {
      name: 'swaras-ai-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        selectedPersona: state.selectedPersona,
        darkMode: state.darkMode,
        // Don't persist mentor status - should reset on each load
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => {
            state.initializeTheme();
            state.initializeMentorStatus(); // Initialize mentor status after rehydration
          }, 0);
        }
      },
    },
  ),
);
