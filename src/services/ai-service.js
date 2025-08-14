import { personas } from '@/constants/personas';

export class AIService {
  static async getPersonaResponse(
    message,
    personaId,
    conversationHistory = [],
  ) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          persona: personaId,
          history: conversationHistory
            .map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content,
            }))
            .slice(-10), // Keep last 10 messages for context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error; // Re-throw to handle in component
    }
  }

  static getPersonaGreeting(personaId) {
    if (personaId === 'hitesh') {
      return `Haanji! Welcome to Swaras AI! 🎯\n\nI'm Hitesh Choudhary, and I'm here to make coding as simple as making chai! Whether you want to learn JavaScript, React, Node.js, or just need some career advice, I'm here to help.\n\nChaliye, let's start coding together! ☕️`;
    } else {
      return `Hey there! 🚀\n\nI'm Piyush Garg, and I build devs, not just apps! Ready to dive into some serious full-stack development? I'll help you master the MERN stack, build real projects, and get industry-ready.\n\nTrust me, I'm a software engineer. Let's build something amazing! 💻`;
    }
  }

  static createConversation(personaId) {
    return {
      id: Date.now().toString(),
      personaId: personaId,
      messages: [
        {
          id: Date.now(),
          content: this.getPersonaGreeting(personaId),
          sender: 'ai',
          timestamp: new Date().toISOString(),
        },
      ],
      title: 'New Chat',
      createdAt: new Date().toISOString(),
    };
  }

  static createMessage(content, sender = 'user') {
    return {
      id: Date.now() + Math.random(),
      content,
      sender,
      timestamp: new Date().toISOString(),
    };
  }
}
