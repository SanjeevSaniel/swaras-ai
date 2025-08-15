// src/services/ai-service.js
import { personas } from '@/constants/personas-dataset';
import {
  systemPrompts,
  contextualPrompts,
  responseEnhancers,
  topicClassification,
  levelDetectionPatterns,
  contextEnhancers,
  personaGreetings,
  quickStartQuestions,
} from '@/constants/llm-prompts';

export class AIService {
  // Simplified user level detection using existing patterns
  static analyzeUserLevel(message, conversationHistory = []) {
    const messageText = message.toLowerCase();

    // Use existing level detection patterns
    const beginnerScore =
      levelDetectionPatterns.beginner?.filter((keyword) =>
        messageText.includes(keyword),
      ).length || 0;

    const advancedScore =
      levelDetectionPatterns.advanced?.filter((keyword) =>
        messageText.includes(keyword),
      ).length || 0;

    const intermediateScore =
      levelDetectionPatterns.intermediate?.filter((keyword) =>
        messageText.includes(keyword),
      ).length || 0;

    // Check conversation history (last 3 messages only)
    const historyText = conversationHistory
      .slice(-3)
      .map((msg) => msg.content)
      .join(' ')
      .toLowerCase();

    // Simple scoring
    let score = 0;
    if (beginnerScore >= 1) score -= 1;
    if (advancedScore >= 1) score += 2;
    if (intermediateScore >= 1) score += 1;

    // Check history for technical terms
    const technicalTerms = [
      'architecture',
      'scale',
      'optimize',
      'production',
      'system design',
    ];
    if (technicalTerms.some((term) => historyText.includes(term))) score += 1;

    // Return level based on simple scoring
    if (score <= 0) return 'beginner';
    if (score >= 2) return 'advanced';
    return 'intermediate';
  }

  // Simplified topic classification using existing patterns
  static classifyTopic(message, confidence = false) {
    const messageText = message.toLowerCase();

    if (!topicClassification?.patterns) {
      console.warn('Topic classification patterns not found, using fallback');
      return confidence
        ? { topic: 'general', confidence: 0.1, matches: [] }
        : 'general';
    }

    let bestTopic = 'general';
    let bestScore = 0;
    let bestMatches = [];

    // Calculate scores for each topic using existing patterns
    for (const [topic, keywords] of Object.entries(
      topicClassification.patterns,
    )) {
      const matches = keywords.filter((keyword) =>
        messageText.includes(keyword),
      );
      if (matches.length > bestScore) {
        bestScore = matches.length;
        bestTopic = topic;
        bestMatches = matches;
      }
    }

    if (confidence) {
      return {
        topic: bestTopic,
        confidence: Math.min(bestScore / 2, 1), // Max confidence at 2+ matches
        matches: bestMatches,
      };
    }

    return bestTopic;
  }

  // Simplified prompt building using existing system prompts
  static buildEnhancedPrompt(
    personaId,
    userMessage,
    level,
    topic,
    conversationHistory = [],
  ) {
    // Get base system prompt
    const basePrompt = systemPrompts[personaId];
    if (!basePrompt) {
      throw new Error(`No system prompt found for persona: ${personaId}`);
    }

    // Get contextual prompt if available
    const contextual =
      contextualPrompts[level]?.[topic] ||
      contextualPrompts[level]?.general ||
      '';

    // Simple conversation analysis
    const recentTopics = conversationHistory
      .slice(-3)
      .map((msg) => this.classifyTopic(msg.content))
      .filter((topic) => topic !== 'general')
      .slice(-2); // Last 2 unique topics

    const intent = this.classifyMessageIntent(userMessage);

    // Build focused prompt
    const enhancedPrompt = `${basePrompt}

CURRENT CONTEXT:
- User Level: ${level}
- Topic: ${topic}
- Intent: ${intent}
- Recent Topics: ${recentTopics.length > 0 ? recentTopics.join(', ') : 'None'}

${contextual ? `CONTEXTUAL GUIDANCE:\n${contextual}\n` : ''}

USER QUESTION: "${userMessage}"

RESPONSE GUIDELINES:
1. Stay completely in character with your authentic personality
2. Use your signature phrases and communication style
3. Adjust complexity for ${level} level
4. Focus on ${topic} while being practical and actionable
5. Provide specific examples when helpful
6. End with encouragement and next steps

Respond as ${
      personas[personaId]?.name
    } would, addressing their specific question naturally.`;

    return enhancedPrompt;
  }

  // Simplified message intent classification
  static classifyMessageIntent(message) {
    const intents = {
      question: /\?|how|what|why|when|where|which|can you|could you/i,
      help: /help|assist|guide|show|explain|teach/i,
      problem: /error|issue|problem|not working|stuck|debug|fix/i,
      project: /build|create|make|develop|project|application/i,
      career: /job|career|interview|salary|company|work|hire/i,
      comparison: /vs|versus|difference|compare|better|best|choose/i,
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(message)) return intent;
    }

    return 'general';
  }

  // MAIN METHOD: Simplified persona response
  static async getPersonaResponse(
    message,
    personaId,
    conversationHistory = [],
  ) {
    const startTime = Date.now();

    try {
      console.log('🚀 AI Service Request:', {
        message:
          message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        personaId,
        historyLength: conversationHistory.length,
      });

      // Input validation
      if (!message?.trim()) {
        throw new Error('Message cannot be empty');
      }

      if (!personas[personaId]) {
        throw new Error(`Invalid persona: ${personaId}`);
      }

      if (!systemPrompts[personaId]) {
        throw new Error(`System prompt not found for persona: ${personaId}`);
      }

      // Simple analysis using existing patterns
      const level = this.analyzeUserLevel(message, conversationHistory);
      const topicAnalysis = this.classifyTopic(message, true);
      const topic = topicAnalysis.topic;

      console.log('📊 Analysis:', {
        level,
        topic,
        confidence: topicAnalysis.confidence,
        matches: topicAnalysis.matches,
      });

      // Build prompt using existing system prompts
      const enhancedPrompt = this.buildEnhancedPrompt(
        personaId,
        message,
        level,
        topic,
        conversationHistory,
      );

      // Prepare clean history
      const formattedHistory =
        this.prepareConversationHistory(conversationHistory);

      // API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          persona: personaId,
          history: formattedHistory,
          enhancedPrompt,
          context: {
            level,
            topic,
            confidence: topicAnalysis.confidence,
            intent: this.classifyMessageIntent(message),
            requestId: `req-${Date.now()}`,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error('No response received from API');
      }

      // Apply enhancements using existing enhancers
      let enhancedResponse = this.enhanceResponse(
        data.response,
        personaId,
        topic,
        level,
        message,
      );

      // Add contextual enhancements if available
      if (contextEnhancers?.addProjectContext && level === 'beginner') {
        enhancedResponse = contextEnhancers.addProjectContext(
          enhancedResponse,
          topic,
          level,
        );
      }

      // Validate response
      const validation = this.validateResponse(enhancedResponse, personaId);
      console.log('✅ Response Validation:', validation);

      const processingTime = Date.now() - startTime;
      console.log(`🎯 Response generated in ${processingTime}ms`);

      return enhancedResponse;
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`❌ AI Service Error (${processingTime}ms):`, error);
      return this.getFallbackResponse(personaId, message);
    }
  }

  // Clean conversation history preparation
  static prepareConversationHistory(history) {
    if (!Array.isArray(history)) return [];

    if (history.length <= 8) {
      return history.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));
    }

    // For longer conversations, keep recent messages
    const recent = history.slice(-6); // Last 6 messages

    return recent.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
  }

  // Enhanced response using existing enhancers
  static enhanceResponse(
    baseResponse,
    personaId,
    topic,
    level,
    originalMessage,
  ) {
    let enhanced = baseResponse;

    try {
      // Use existing response enhancers if available
      const enhancerKey = `enhance${
        personaId.charAt(0).toUpperCase() + personaId.slice(1)
      }Response`;
      const enhancer = responseEnhancers?.[enhancerKey];

      if (enhancer && typeof enhancer === 'function') {
        enhanced = enhancer(enhanced, topic, level);
      }

      // Add code examples for technical topics if needed
      if (
        ['react', 'javascript', 'backend', 'typescript', 'nodejs'].includes(
          topic,
        ) &&
        !enhanced.includes('```') &&
        enhanced.length < 800
      ) {
        enhanced = this.addSimpleCodeExample(enhanced, topic, level);
      }
    } catch (error) {
      console.warn('Enhancement failed, using base response:', error);
    }

    return enhanced;
  }

  // Simple code example addition
  static addSimpleCodeExample(response, topic, level) {
    const examples = {
      javascript: {
        beginner: `\n\n**Quick Example:**\n\`\`\`javascript\n// Basic JavaScript\nconst greeting = "Hello World!";\nconsole.log(greeting);\n\`\`\``,
        intermediate: `\n\n**Example:**\n\`\`\`javascript\n// Modern JavaScript\nconst users = [{name: "John", age: 25}];\nconst adults = users.filter(user => user.age >= 18);\n\`\`\``,
        advanced: `\n\n**Advanced Example:**\n\`\`\`javascript\n// Design pattern example\nclass EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, callback) { this.events[event] = callback; }\n  emit(event, data) { this.events[event]?.(data); }\n}\n\`\`\``,
      },
      react: {
        beginner: `\n\n**Simple Component:**\n\`\`\`jsx\nfunction Welcome() {\n  return <h1>Hello React!</h1>;\n}\n\`\`\``,
        intermediate: `\n\n**With State:**\n\`\`\`jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}\n\`\`\``,
        advanced: `\n\n**Custom Hook:**\n\`\`\`jsx\nfunction useCounter(initial = 0) {\n  const [count, setCount] = useState(initial);\n  return [count, () => setCount(c => c + 1)];\n}\n\`\`\``,
      },
    };

    const example = examples[topic]?.[level];
    return example ? response + example : response;
  }

  // Response validation using existing validators
  static validateResponse(response, personaId) {
    try {
      // Use existing validators if available
      const validatorKey = `${personaId}Validation`;
      const validator = responseEnhancers?.[validatorKey]?.checkResponse;

      if (validator && typeof validator === 'function') {
        return validator(response);
      }
    } catch (error) {
      console.warn('Validation failed, using basic validation:', error);
    }

    // Basic validation fallback
    return {
      isValid: response && response.length > 50,
      score: response?.length > 200 ? 5 : 3,
      checks: {
        hasContent: response && response.length > 50,
        notTooLong: response && response.length < 3000,
      },
      maxScore: 5,
    };
  }

  // Fallback response using existing patterns
  static getFallbackResponse(personaId, message) {
    const persona = personas[personaId];

    if (personaId === 'hitesh') {
      return `Haanji! Technical issue aa gayi hai, but main yahan hun! 😅

"${message}" ke baare mein aapko help chahiye? Let me share what I can:

**Based on my experience:**
- Start with fundamentals
- Practice daily coding
- Build real projects
- Join developer community

Main step-by-step guidance dunga. Samjho?

Chai peete peete code karte rehna! ☕️

**📚 Resource:** Check my YouTube channel 'Chai aur Code' for tutorials!`;
    } else if (personaId === 'piyush') {
      return `Hey! Technical glitch, but let's solve this! 🚀

Regarding "${message}" - here's my approach:

**Modern Development Strategy:**
- Focus on practical implementation
- Build projects that scale  
- Use industry best practices
- Deploy and iterate quickly

Trust me, we'll figure this out together!

Ready to build something real? 💪`;
    }

    return `Sorry about the technical issue. Let me help you with "${message}" in a different way. What specific aspect would you like to focus on?`;
  }

  // Persona greeting using existing greetings
  static getPersonaGreeting(personaId) {
    try {
      const hour = new Date().getHours();
      const timeOfDay =
        hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

      // Use existing persona greetings if available
      const timeGreeting =
        personaGreetings?.[personaId]?.[timeOfDay] ||
        personaGreetings?.[personaId]?.general;

      if (timeGreeting) {
        return timeGreeting;
      }
    } catch (error) {
      console.warn('Error getting persona greeting:', error);
    }

    // Fallback greetings
    const fallbackGreetings = {
      hitesh: `Haanji! Welcome to Swaras AI! 🎯

I'm Hitesh Choudhary, ready to help you with JavaScript, React, career advice, and more!

Think of this as our chai session - comfortable and full of learning! ☕️

What would you like to explore today?

Chaliye, let's start coding together! 😊`,

      piyush: `Hey there! Welcome to Swaras AI! 🚀

I'm Piyush Garg, here to help you build real-world development skills.

Ready to dive into MERN stack, system design, or career growth?

Let's build something that scales! 💪`,
    };

    return (
      fallbackGreetings[personaId] ||
      `Hello! I'm ${personas[personaId]?.name}. How can I help you today?`
    );
  }

  // Simple message creation
  static createMessage(content, sender = 'user', metadata = {}) {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      sender,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      ...metadata,
    };
  }

  // Simple conversation creation
  static createConversation(personaId) {
    const persona = personas[personaId];
    if (!persona) {
      throw new Error(`Persona not found: ${personaId}`);
    }

    return {
      id: `conv-${Date.now()}`,
      personaId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
      messageCount: 0,
    };
  }

  // Get quick start questions using existing data
  static getQuickStartQuestions(personaId, topic = null) {
    try {
      const questions = quickStartQuestions?.[personaId];
      if (!questions) return [];

      if (topic && questions[topic]) {
        return questions[topic];
      }

      return Object.values(questions).flat();
    } catch (error) {
      console.warn('Error getting quick start questions:', error);
      return [];
    }
  }

  // Get available personas
  static getAvailablePersonas() {
    return Object.keys(personas)
      .filter((personaId) => systemPrompts[personaId])
      .map((personaId) => ({
        id: personaId,
        name: personas[personaId].name,
        title: personas[personaId].title,
        avatar: personas[personaId].avatar,
        expertise: personas[personaId].expertise,
        available: true,
      }));
  }
}

// MISSING FUNCTION: Add the processUserMessage function that your API route expects
export async function processUserMessage(
  message,
  persona,
  history = [],
  enhancedPrompt = null,
  context = {},
) {
  try {
    console.log('📝 Processing user message:', {
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      persona,
      historyLength: history.length,
      hasEnhancedPrompt: !!enhancedPrompt,
      context,
    });

    // Use the enhanced prompt if provided, otherwise use AIService
    if (enhancedPrompt) {
      // This would be your actual LLM API call
      // For now, return a placeholder response
      return `Enhanced response for ${persona}: ${message}`;
    }

    // Fallback to regular AIService method
    return await AIService.getPersonaResponse(message, persona, history);
  } catch (error) {
    console.error('Error in processUserMessage:', error);
    throw error;
  }
}

export default AIService;
