// src/services/response-service.js
import { allResponses } from '@/data/responses/index.js';
import { personaConfigs, topicMappings } from '@/data/personas/index.js';

export class ResponseService {
  static getResponse(persona, topic, level, message, context) {
    try {
      const responses = allResponses[persona];
      if (!responses) {
        return this.getDefaultResponse(persona, message);
      }

      // Try to get specific response
      const topicResponses = responses[topic];
      if (topicResponses && typeof topicResponses[level] === 'function') {
        return topicResponses[level](message, context);
      }

      // Fallback to intermediate level
      if (topicResponses && typeof topicResponses.intermediate === 'function') {
        return topicResponses.intermediate(message, context);
      }

      // Fallback to general response
      if (typeof responses.general === 'function') {
        return responses.general(message, context);
      }

      return this.getDefaultResponse(persona, message);
    } catch (error) {
      console.error('Error getting response:', error);
      return this.getDefaultResponse(persona, message);
    }
  }

  static getDefaultResponse(persona, message) {
    const config = personaConfigs[persona];
    if (!config) {
      return 'Hello! How can I help you today?';
    }

    const defaults = {
      hitesh: `${config.personality.greeting} That's an interesting question, bhai! 😊

You know, after teaching 1.6M+ students and working in the industry for 15+ years, I've learned that every question has value.

Chaliye, let me help you understand this better! The key is to break down complex problems step by step - just like making perfect chai.

Don't worry, we'll figure this out together! Main yahan hun aapki help karne ke liye.

Samjho? ☕️`,

      piyush: `${config.personality.greeting} 🔥

You know what I love about software engineering? Every problem has a solution, and every challenge is an opportunity to build something better.

My approach is always:
1. **Understand the problem** completely
2. **Choose the right tools** for the job
3. **Build incrementally** and test often
4. **Scale when needed**

Trust me, I'm a software engineer - let's tackle this together and build something real!

Ready to dive deep? 🚀`,
    };

    return defaults[persona] || 'Hello! How can I help you today?';
  }

  static classifyTopic(message) {
    const lowerMessage = message.toLowerCase();

    for (const [topic, keywords] of Object.entries(topicMappings)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return topic;
      }
    }

    return 'general';
  }

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
    ];
    const advancedKeywords = [
      'architecture',
      'scale',
      'optimize',
      'advanced',
      'enterprise',
      'performance',
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
}
