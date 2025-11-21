// src/utils/validation.js
import { VALIDATION_RULES, ERROR_TYPES, personaManager } from '@/constants/config';

/**
 * Validation error class for better error handling
 */
export class ValidationError extends Error {
  constructor(message, type = ERROR_TYPES.VALIDATION, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.type = type;
    this.details = details;
  }
}

/**
 * Validates persona identifier
 * @param {string} persona - Persona identifier
 * @returns {boolean} - True if valid
 * @throws {ValidationError} - If persona is invalid
 */
export const validatePersona = (persona) => {
  if (!persona) {
    throw new ValidationError(
      'Persona is required',
      ERROR_TYPES.VALIDATION,
      { field: 'persona', value: persona }
    );
  }

  if (typeof persona !== 'string') {
    throw new ValidationError(
      'Persona must be a string',
      ERROR_TYPES.VALIDATION,
      { field: 'persona', value: persona, expectedType: 'string' }
    );
  }

  // Check if persona exists and is enabled
  if (!personaManager.hasPersona(persona.toLowerCase())) {
    const availablePersonas = personaManager.getAllPersonas({ enabled: true }).map(p => p.id);
    throw new ValidationError(
      `Invalid persona. Must be one of: ${availablePersonas.join(', ')}`,
      ERROR_TYPES.VALIDATION,
      { field: 'persona', value: persona, allowedValues: availablePersonas }
    );
  }

  const personaData = personaManager.getPersona(persona.toLowerCase());
  if (!personaData.enabled) {
    throw new ValidationError(
      `Persona '${persona}' is currently disabled`,
      ERROR_TYPES.VALIDATION,
      { field: 'persona', value: persona }
    );
  }

  return true;
};

/**
 * Validates message content
 * @param {string} message - Message content
 * @returns {boolean} - True if valid
 * @throws {ValidationError} - If message is invalid
 */
export const validateMessage = (message) => {
  if (!message && VALIDATION_RULES.MESSAGE.REQUIRED) {
    throw new ValidationError(
      'Message is required',
      ERROR_TYPES.VALIDATION,
      { field: 'message', value: message }
    );
  }

  if (typeof message !== 'string') {
    throw new ValidationError(
      'Message must be a string',
      ERROR_TYPES.VALIDATION,
      { field: 'message', value: message, expectedType: 'string' }
    );
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length < VALIDATION_RULES.MESSAGE.MIN_LENGTH) {
    throw new ValidationError(
      `Message must be at least ${VALIDATION_RULES.MESSAGE.MIN_LENGTH} character(s)`,
      ERROR_TYPES.VALIDATION,
      {
        field: 'message',
        value: message,
        minLength: VALIDATION_RULES.MESSAGE.MIN_LENGTH,
        actualLength: trimmedMessage.length
      }
    );
  }

  if (trimmedMessage.length > VALIDATION_RULES.MESSAGE.MAX_LENGTH) {
    throw new ValidationError(
      `Message must not exceed ${VALIDATION_RULES.MESSAGE.MAX_LENGTH} characters`,
      ERROR_TYPES.VALIDATION,
      {
        field: 'message',
        value: message,
        maxLength: VALIDATION_RULES.MESSAGE.MAX_LENGTH,
        actualLength: trimmedMessage.length
      }
    );
  }

  return true;
};

/**
 * Validates conversation history
 * @param {Array} history - Conversation history array
 * @returns {boolean} - True if valid
 * @throws {ValidationError} - If history is invalid
 */
export const validateHistory = (history) => {
  if (!history && !VALIDATION_RULES.HISTORY.REQUIRED) {
    return true;
  }

  if (!Array.isArray(history)) {
    throw new ValidationError(
      'History must be an array',
      ERROR_TYPES.VALIDATION,
      { field: 'history', value: history, expectedType: 'array' }
    );
  }

  if (history.length > VALIDATION_RULES.HISTORY.MAX_ITEMS) {
    throw new ValidationError(
      `History must not exceed ${VALIDATION_RULES.HISTORY.MAX_ITEMS} items`,
      ERROR_TYPES.VALIDATION,
      {
        field: 'history',
        maxItems: VALIDATION_RULES.HISTORY.MAX_ITEMS,
        actualItems: history.length
      }
    );
  }

  // Validate each message in history
  history.forEach((msg, index) => {
    if (!msg || typeof msg !== 'object') {
      throw new ValidationError(
        `Invalid message at index ${index} in history`,
        ERROR_TYPES.VALIDATION,
        { field: 'history', index, value: msg }
      );
    }

    if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) {
      throw new ValidationError(
        `Invalid role at index ${index} in history`,
        ERROR_TYPES.VALIDATION,
        { field: 'history', index, role: msg.role, allowedRoles: ['user', 'assistant', 'system'] }
      );
    }

    if (!msg.content || typeof msg.content !== 'string') {
      throw new ValidationError(
        `Invalid content at index ${index} in history`,
        ERROR_TYPES.VALIDATION,
        { field: 'history', index, content: msg.content }
      );
    }
  });

  return true;
};

/**
 * Validates context object
 * @param {Object} context - Context object
 * @returns {boolean} - True if valid
 */
export const validateContext = (context) => {
  if (!context) {
    return true; // Context is optional
  }

  if (typeof context !== 'object' || Array.isArray(context)) {
    throw new ValidationError(
      'Context must be an object',
      ERROR_TYPES.VALIDATION,
      { field: 'context', value: context, expectedType: 'object' }
    );
  }

  return true;
};

/**
 * Validates chat request payload
 * @param {Object} payload - Request payload
 * @returns {Object} - Validated and sanitized payload
 * @throws {ValidationError} - If payload is invalid
 */
export const validateChatRequest = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError(
      'Invalid request payload',
      ERROR_TYPES.VALIDATION,
      { value: payload }
    );
  }

  const { message, persona, history } = payload;

  // Validate all fields
  validateMessage(message);
  validatePersona(persona);

  if (history !== undefined) {
    validateHistory(history);
  }

  // Return sanitized payload
  return {
    message: message.trim(),
    persona: persona.toLowerCase(),
    history: history || [],
  };
};

/**
 * Safe validation wrapper that returns result instead of throwing
 * @param {Function} validationFn - Validation function to wrap
 * @param  {...any} args - Arguments to pass to validation function
 * @returns {Object} - { isValid: boolean, error: Error | null }
 */
export const safeValidate = (validationFn, ...args) => {
  try {
    validationFn(...args);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error };
  }
};
