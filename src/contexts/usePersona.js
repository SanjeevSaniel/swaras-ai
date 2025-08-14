// src/contexts/usePersona.js (Complete persona hook)
'use client';

import { useContext, createContext, useReducer, useEffect } from 'react';
import { useChatStore } from '@/store/chat-store';
import { personas } from '@/constants/personas';

// Persona Context
const PersonaContext = createContext();

// Persona Reducer
const personaReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_PERSONA':
      return {
        ...state,
        currentPersona: action.payload,
      };
    case 'START_NEW_CONVERSATION':
      return {
        ...state,
        isNewConversationStarted: true,
      };
    case 'RESET_CONVERSATION_FLAG':
      return {
        ...state,
        isNewConversationStarted: false,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  currentPersona: null,
  personas: personas,
  isNewConversationStarted: false,
};

// Persona Provider Component
export const PersonaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(personaReducer, initialState);
  const { selectedPersona, setSelectedPersona } = useChatStore();

  // Sync with chat store
  useEffect(() => {
    if (selectedPersona !== state.currentPersona) {
      dispatch({ type: 'SET_CURRENT_PERSONA', payload: selectedPersona });
    }
  }, [selectedPersona, state.currentPersona]);

  // Handle new conversation start
  useEffect(() => {
    if (state.isNewConversationStarted && state.currentPersona) {
      // Reset flag after starting conversation
      setTimeout(() => {
        dispatch({ type: 'RESET_CONVERSATION_FLAG' });
      }, 1000);
    }
  }, [state.isNewConversationStarted, state.currentPersona]);

  const value = {
    ...state,
    dispatch,
    setCurrentPersona: (personaId) => {
      setSelectedPersona(personaId);
      dispatch({ type: 'SET_CURRENT_PERSONA', payload: personaId });
    },
  };

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
};

// usePersona Hook
export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

// For backward compatibility, also export as default
// export default usePersona;
