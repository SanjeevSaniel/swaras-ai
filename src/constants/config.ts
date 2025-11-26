// src/constants/config.js - Central configuration for the application
import { personas, PERSONA_IDS } from './personas';
import { createPersonaManager } from '@/lib/persona-manager';

// Initialize Persona Manager
export const personaManager = createPersonaManager(personas);

// Persona identifiers (dynamically generated from personas config)
export const PERSONAS = PERSONA_IDS.reduce((acc, id) => {
  acc[id.toUpperCase()] = id;
  return acc;
}, {});

// API configuration
export const API_CONFIG = {
  CHAT_ENDPOINT: '/api/chat',
  MAX_MESSAGE_LENGTH: 5000,
  MAX_HISTORY_MESSAGES: 10,
};

// Timeout configurations (in milliseconds)
export const TIMEOUTS = {
  QUICK_QUERY: 10000,       // 10 seconds for simple queries
  DETAILED_QUERY: 20000,    // 20 seconds for complex queries
  WEB_REQUEST: 10000,       // 10 seconds per web request
  SCRAPING_DELAY: 1000,     // 1 second delay between scraping requests
};

// Cache configuration
export const CACHE_CONFIG = {
  EXPIRY_TIME: 30 * 60 * 1000,  // 30 minutes
  PLATFORM_DATA_TTL: 60 * 60 * 1000,  // 1 hour for platform data
};

/**
 * Get scraping targets for a persona
 * Now dynamically retrieved from persona configuration
 *
 * @param {string} personaId - Persona identifier
 * @returns {Array} - Scraping targets or empty array
 */
export const getScrapingTargets = (personaId) => {
  const persona = personaManager.getPersona(personaId);
  if (!persona || !persona.scrapingConfig || !persona.scrapingConfig.enabled) {
    return [];
  }
  return persona.scrapingConfig.targets || [];
};

// Legacy SCRAPING_TARGETS object for backwards compatibility
export const SCRAPING_TARGETS = PERSONA_IDS.reduce((acc, id) => {
  acc[id] = getScrapingTargets(id);
  return acc;
}, {});

// Error types for consistent error handling
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  CONFIG: 'CONFIG_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  SCRAPING: 'SCRAPING_ERROR',
  AI_SERVICE: 'AI_SERVICE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network connection issue detected. Please check your internet connection.',
  [ERROR_TYPES.RATE_LIMIT]: 'Too many requests sent. Please wait a moment before trying again.',
  [ERROR_TYPES.CONFIG]: 'Mentor configuration error. Please try selecting a different mentor.',
  [ERROR_TYPES.TIMEOUT]: 'Response took too long. Please try asking in a different way.',
  [ERROR_TYPES.VALIDATION]: 'Invalid input provided. Please check your message and try again.',
  [ERROR_TYPES.AUTHENTICATION]: 'Authentication failed. Please sign in again.',
  [ERROR_TYPES.SCRAPING]: 'Unable to fetch latest information. Using cached data.',
  [ERROR_TYPES.AI_SERVICE]: 'AI service temporarily unavailable. Please try again.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

// Response metadata source types
export const RESPONSE_SOURCES = {
  HYBRID_FULL: 'hybrid_full',
  HYBRID_NO_SOCIAL: 'simple_hybrid_no_social',
  GPT_ONLY: 'gpt_only_fallback',
  CACHED: 'cached_response',
  FAST_PATH: 'fast_path_response',
  EMERGENCY: 'emergency_fallback',
};

// Confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.5,
  LOW: 0.3,
};

// OpenAI model configuration
export const OPENAI_CONFIG = {
  MODEL: 'gpt-4o',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1500,
  TOP_P: 1,
  FREQUENCY_PENALTY: 0.3,
  PRESENCE_PENALTY: 0.3,
};

// Validation rules
export const VALIDATION_RULES = {
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 5000,
    REQUIRED: true,
  },
  PERSONA: {
    ALLOWED_VALUES: Object.values(PERSONAS),
    REQUIRED: true,
  },
  HISTORY: {
    MAX_ITEMS: 10,
    REQUIRED: false,
  },
};

// User preference defaults
export const USER_PREFERENCES = {
  RESPONSE_SPEED: {
    SLOW: 'slow',
    NORMAL: 'normal',
    FAST: 'fast',
  },
  PERSONA_STYLE: {
    AUTHENTIC: 'authentic',
    CASUAL: 'casual',
    FORMAL: 'formal',
  },
};

// Feature flags
export const FEATURES = {
  ENABLE_WEB_SCRAPING: true,
  ENABLE_FAST_PATH: true,
  ENABLE_CACHING: true,
  ENABLE_ANALYTICS: true,
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
};

const config = {
  PERSONAS,
  API_CONFIG,
  TIMEOUTS,
  CACHE_CONFIG,
  SCRAPING_TARGETS,
  ERROR_TYPES,
  ERROR_MESSAGES,
  RESPONSE_SOURCES,
  CONFIDENCE_THRESHOLDS,
  OPENAI_CONFIG,
  VALIDATION_RULES,
  USER_PREFERENCES,
  FEATURES,
};

export default config;
