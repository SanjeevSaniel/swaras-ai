// src/services/hybrid-processor.js - Processor for hybrid system with fallbacks
import { OpenAI } from 'openai';
import { HybridSystem } from './hybrid-system';
import { ResponseService } from './response-service';
import {
  TIMEOUTS,
  RESPONSE_SOURCES,
  OPENAI_CONFIG,
  FEATURES,
  personaManager,
} from '@/constants/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Hybrid Processor - Orchestrates hybrid system with timeouts and fallbacks
 */
export class HybridProcessor {
  constructor() {
    this.hybridSystem = new HybridSystem();
    this.timeouts = {
      quick: TIMEOUTS.QUICK_QUERY,
      detailed: TIMEOUTS.DETAILED_QUERY,
    };
  }

  /**
   * Determines if a query is complex based on content
   *
   * @param {string} message - User message
   * @returns {boolean} - True if complex
   */
  isComplexQuery(message) {
    const complexKeywords = ['course', 'platform', 'explain', 'architecture', 'system', 'detailed'];
    const lowerMessage = message.toLowerCase();

    return (
      message.length > 50 ||
      complexKeywords.some((keyword) => lowerMessage.includes(keyword))
    );
  }

  /**
   * Main processing method with timeout and fallback handling
   *
   * @param {string} personaId - Persona identifier
   * @param {string} personaName - Full persona name
   * @param {string} userMessage - User's message
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<Object>} - Response and metadata
   */
  async processConversation(personaId, personaName, userMessage, conversationHistory = []) {
    const startTime = Date.now();

    try {
      // Try fast-path first for simple queries
      if (FEATURES.ENABLE_FAST_PATH) {
        const fastResponse = ResponseService.getFastResponse(personaId, userMessage);
        if (fastResponse) {
          console.log('⚡ Using fast-path response');
          return {
            ...fastResponse,
            metadata: {
              ...fastResponse.metadata,
              processingTime: Date.now() - startTime,
            },
          };
        }
      }

      // Determine timeout based on query complexity
      const timeout = this.isComplexQuery(userMessage)
        ? this.timeouts.detailed
        : this.timeouts.quick;

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Processing timeout')), timeout);
      });

      // Create processing promise
      const processingPromise = this.hybridSystem.process(
        personaId,
        personaName,
        userMessage,
        conversationHistory,
      );

      // Race between processing and timeout
      const result = await Promise.race([processingPromise, timeoutPromise]);
      const processingTime = Date.now() - startTime;

      return {
        ...result,
        metadata: {
          ...result.metadata,
          processingTime,
          timeout,
          systemType: 'hybrid_processor',
        },
      };
    } catch (error) {
      return await this.handleFailure(
        error,
        personaId,
        personaName,
        userMessage,
        Date.now() - startTime,
      );
    }
  }

  /**
   * Handles processing failures with fallback strategies
   *
   * @param {Error} error - Error that occurred
   * @param {string} personaId - Persona identifier
   * @param {string} personaName - Full persona name
   * @param {string} userMessage - User's message
   * @param {number} processingTime - Time taken before failure
   * @returns {Promise<Object>} - Fallback response
   */
  async handleFailure(error, personaId, personaName, userMessage, processingTime) {
    console.error('⚠️  Hybrid system failed, using GPT-only fallback:', error.message);

    try {
      // Fallback 1: GPT-only response
      const fallbackResponse = await this.generateGPTOnlyResponse(
        personaId,
        personaName,
        userMessage,
      );

      return {
        response: fallbackResponse,
        metadata: {
          source: RESPONSE_SOURCES.GPT_ONLY,
          originalError: error.message,
          processingTime,
          confidence: 0.6,
        },
      };
    } catch (fallbackError) {
      // Fallback 2: Emergency response
      console.error('⚠️  GPT fallback failed, using emergency response:', fallbackError.message);

      return {
        response: this.getEmergencyResponse(personaId),
        metadata: {
          source: RESPONSE_SOURCES.EMERGENCY,
          errors: [error.message, fallbackError.message],
          processingTime,
          confidence: 0.3,
        },
      };
    }
  }

  /**
   * Generates GPT-only response without web scraping
   *
   * @param {string} personaId - Persona identifier
   * @param {string} personaName - Full persona name
   * @param {string} userMessage - User's message
   * @returns {Promise<string>} - GPT response
   */
  async generateGPTOnlyResponse(personaId, personaName, userMessage) {
    const guidelines = this.getPersonaGuidelines(personaId);

    const fallbackPrompt = `You are ${personaName}. Respond authentically to: "${userMessage}"

${guidelines}

Respond naturally:`;

    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.MODEL,
      messages: [{ role: 'user', content: fallbackPrompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  }

  /**
   * Gets persona-specific guidelines for GPT fallback
   *
   * @param {string} personaId - Persona identifier
   * @returns {string} - Guidelines text
   */
  getPersonaGuidelines(personaId) {
    const persona = personaManager.getPersona(personaId);
    if (!persona) {
      return 'Use professional and helpful tone.';
    }

    const style = persona.communicationStyle;
    let guidelines = `Use ${style.tone} tone with ${style.language}.\n`;

    if (style.signature) {
      guidelines += `${style.signature}\n`;
    }

    if (persona.catchphrases && persona.catchphrases.length > 0) {
      guidelines += `Use phrases like: ${persona.catchphrases.slice(0, 3).map(p => `"${p}"`).join(', ')}.\n`;
    }

    if (persona.websiteUrl) {
      guidelines += `Mention your website ${persona.websiteUrl} if relevant.\n`;
    }

    guidelines += `${style.approach}`;

    return guidelines;
  }

  /**
   * Gets emergency response when all systems fail
   *
   * @param {string} personaId - Persona identifier
   * @returns {string} - Emergency response
   */
  getEmergencyResponse(personaId) {
    const persona = personaManager.getPersona(personaId);
    if (!persona) {
      return 'Hello! We\'re experiencing some technical issues right now. Please try again in a moment!';
    }

    // Use first catchphrase if available
    const greeting = persona.catchphrases && persona.catchphrases.length > 0
      ? persona.catchphrases[0]
      : 'Hello!';

    return `${greeting} We're experiencing some technical issues right now, but I understand your question. Please try again in a moment!`;
  }
}

/**
 * Creates a hybrid processor instance
 *
 * @returns {HybridProcessor} - Processor instance
 */
export function createHybridProcessor() {
  return new HybridProcessor();
}

/**
 * Gets full persona name from ID
 * Now dynamically retrieved from persona manager
 *
 * @param {string} personaId - Persona identifier
 * @returns {string} - Full name
 */
export function getPersonaName(personaId) {
  return personaManager.getPersonaName(personaId);
}
