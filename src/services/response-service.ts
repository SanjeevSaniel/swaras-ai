// src/services/response-service.js - Enhanced response service with fast-path logic
import { FEATURES, RESPONSE_SOURCES, personaManager } from '@/constants/config';

/**
 * Response Service - Provides fast-path responses for simple queries
 */
export class ResponseService {
  /**
   * Determines if a query can be handled via fast path
   *
   * @param {string} message - User message
   * @returns {boolean} - True if fast path is applicable
   */
  static canUseFastPath(message) {
    if (!FEATURES.ENABLE_FAST_PATH) {
      return false;
    }

    const lowerMessage = message.toLowerCase().trim();

    // Fast path for simple greetings
    const greetings = ['hi', 'hello', 'hey', 'haanji', 'namaste', 'hola'];
    if (greetings.some((g) => lowerMessage === g || lowerMessage === `${g}!`)) {
      return true;
    }

    // Fast path for very short messages (likely simple queries)
    if (lowerMessage.length < 15 && !lowerMessage.includes('?')) {
      return true;
    }

    return false;
  }

  /**
   * Gets fast-path response for simple queries
   *
   * @param {string} personaId - Persona identifier
   * @param {string} message - User message
   * @returns {Object|null} - Fast response or null if not applicable
   */
  static getFastResponse(personaId, message) {
    if (!this.canUseFastPath(message)) {
      return null;
    }

    const lowerMessage = message.toLowerCase().trim();

    // Handle greetings
    if (this.isGreeting(lowerMessage)) {
      return {
        response: this.getGreeting(personaId),
        metadata: {
          source: RESPONSE_SOURCES.FAST_PATH,
          confidence: 0.9,
          processingTime: 0,
          isFastPath: true,
        },
      };
    }

    return null;
  }

  /**
   * Checks if message is a greeting
   *
   * @param {string} message - Lowercase message
   * @returns {boolean} - True if greeting
   */
  static isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'haanji', 'namaste', 'hola', 'yo'];
    return greetings.some((g) => message === g || message === `${g}!`);
  }

  /**
   * Gets persona-specific greeting
   *
   * @param {string} personaId - Persona identifier
   * @returns {string} - Greeting message
   */
  static getGreeting(personaId) {
    const persona = personaManager.getPersona(personaId);
    if (!persona) {
      return 'Hello! How can I help you today?';
    }

    // Return the persona's defined greeting
    return persona.greeting || `Hello! I'm ${persona.name}. How can I help you today?`;
  }

  /**
   * Classifies topic from message
   *
   * @param {string} message - User message
   * @returns {string} - Topic category
   */
  static classifyTopic(message) {
    const lowerMessage = message.toLowerCase();

    const topicKeywords = {
      react: ['react', 'jsx', 'component', 'hook', 'useeffect', 'usestate'],
      javascript: ['javascript', 'js', 'promise', 'async', 'closure', 'es6'],
      nodejs: ['node', 'nodejs', 'express', 'npm', 'backend'],
      career: ['career', 'job', 'interview', 'resume', 'portfolio', 'salary'],
      mern: ['mern', 'mongodb', 'full stack', 'fullstack'],
      css: ['css', 'styling', 'flexbox', 'grid', 'tailwind'],
      database: ['database', 'sql', 'mongodb', 'postgres', 'mysql'],
      deployment: ['deploy', 'deployment', 'hosting', 'vercel', 'aws'],
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return topic;
      }
    }

    return 'general';
  }

  /**
   * Analyzes skill level from message
   *
   * @param {string} message - User message
   * @returns {string} - Skill level (beginner/intermediate/advanced)
   */
  static analyzeLevel(message) {
    const lowerMessage = message.toLowerCase();

    const beginnerKeywords = [
      'learn',
      'start',
      'begin',
      'what is',
      'how to',
      'tutorial',
      'basic',
      'beginner',
    ];

    const advancedKeywords = [
      'architecture',
      'scale',
      'optimize',
      'advanced',
      'enterprise',
      'performance',
      'microservices',
      'distributed',
    ];

    const beginnerScore = beginnerKeywords.filter((keyword) =>
      lowerMessage.includes(keyword),
    ).length;

    const advancedScore = advancedKeywords.filter((keyword) =>
      lowerMessage.includes(keyword),
    ).length;

    if (beginnerScore >= 2) return 'beginner';
    if (advancedScore >= 1) return 'advanced';
    return 'intermediate';
  }

  /**
   * Analyzes query complexity
   *
   * @param {string} message - User message
   * @returns {Object} - Analysis result
   */
  static analyzeQuery(message) {
    return {
      topic: this.classifyTopic(message),
      level: this.analyzeLevel(message),
      length: message.length,
      isQuestion: message.includes('?'),
      isGreeting: this.isGreeting(message.toLowerCase()),
      canUseFastPath: this.canUseFastPath(message),
    };
  }
}
