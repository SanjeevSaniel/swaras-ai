// src/store/chat-store.js (Complete store with no default selection)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set, get) => ({
      // State - No default persona selected
      conversations: [],
      currentConversation: null,
      selectedPersona: null,
      darkMode: false,

      // Actions
      setSelectedPersona: (persona) => {
        const currentState = get();

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
          currentConversation: null, // Clear conversation when switching
        });

        console.log(`Selected persona: ${persona}`);
      },

      setCurrentConversation: (conv) => {
        const state = get();

        // Only set conversation if we have a selected persona and it matches
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

        // Only add conversation if persona is selected
        if (!state.selectedPersona) {
          console.warn('Cannot add conversation without selected persona');
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
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => {
            state.initializeTheme();
          }, 0);
        }
      },
    },
  ),
);
