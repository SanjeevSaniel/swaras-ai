// src/utils/validation.js
export const validatePersona = (persona) => {
  const validPersonas = ['hitesh', 'piyush'];
  return validPersonas.includes(persona);
};

export const validateMessage = (message) => {
  return message && typeof message === 'string' && message.trim().length > 0;
};

export const validateContext = (context) => {
  return context && typeof context === 'object';
};
