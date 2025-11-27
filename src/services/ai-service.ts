// src/services/ai-service.js - Enhanced with better persona greetings

export class AIService {
  static async getPersonaResponse(
    message: any,
    personaId: any,
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
      throw error;
    }
  }

  static getPersonaGreeting(personaId: string) {
    const greetings = {
      hitesh: [
        `Haanji! Welcome to Swaras AI! 🎯\n\nMai hun Hitesh Choudhary, aur yahan main tumhe coding sikhaunga bilkul chai banane ki tarah - step by step! ☕️\n\nChaliye JavaScript, React, Node.js, ya career guidance - jo bhi chahiye, batao! Mere 1.6M+ students ke saath journey start karte hain.\n\nKya seekhna hai aaj bhai? Let's code together! 🚀`,

        `Bilkul sahi time pe aaye ho! Chai ready hai? ☕️\n\nHitesh here! Yahan pe hum coding karte hain bilkul dost ki tarah. Complicated cheezein simple banate hain, aur industry mein jo actually use hota hai, wahi sikhate hain!\n\nReact hooks confuse kar rahe hain? JavaScript mein doubt hai? Ya phir career guidance chahiye? \n\nBolo bhai, kya help kar sakta hun aaj? 😊`,

        `Haanji bhai! Chai aur Code ke saath welcome! 🎉\n\nMaine dekha hai ki coding seekhna sometimes overwhelming lagta hai, but don't worry - hum isko aise breakdown karenge ki bilkul easy lagega!\n\nIndustry mein 15+ saal ka experience hai, aur 1.6M+ students ko guide kar chuka hun. Tumhara bhi success story banayenge!\n\nChaliye start karte hain - kya topic choose karna hai? 💻`,
      ],

      piyush: [
        `Alright! Finally someone who wants to learn real development! 🔥\n\nI'm Piyush Garg, and I don't believe in sugarcoating. I build devs, not just apps. If you're here for hand-holding and "you can do it" speeches, you're in the wrong place.\n\nI'll teach you exactly what companies want: production-ready skills, scalable architecture, and real-world problem solving.\n\nReady to ditch the tutorial hell and build something that actually matters? Let's get started.\n\nWhat do you want to build today? 💻`,

        `Hey! Trust me, I'm a software engineer, and I'm here to fast-track your development journey. 🚀\n\nForget the fluff. I've built 50+ production applications, scaled systems for millions of users, and I know exactly what separates beginners from industry-ready developers.\n\nWe're going to focus on:\n• Modern tech stacks that companies actually use\n• Building real projects, not tutorial clones\n• Understanding system design and scalability\n• Getting you hired with skills that matter\n\nNo more watching endless tutorials. Time to build something real. What's your goal? 🎯`,

        `Stop right there! Before we start, let me tell you what this ISN'T: 🛑\n\n❌ Another tutorial channel experience\n❌ Basic "hello world" teaching\n❌ Theoretical computer science lectures\n❌ Feel-good motivation without substance\n\nThis IS:\n✅ Production-grade development practices\n✅ Real-world problem solving\n✅ Modern tech stacks used by actual companies\n✅ Honest feedback about what works and what doesn't\n\nI build devs, not just apps. Ready to level up your game for real? What do you want to master first? 💪`,
      ],
    };

    const personaGreetings = greetings[personaId] || greetings.hitesh;
    return personaGreetings[
      Math.floor(Math.random() * personaGreetings.length)
    ];
  }

  static createConversation(personaId: string) {
    const greeting = this.getPersonaGreeting(personaId);

    // Generate a unique ID for each new conversation to prevent overwriting
    // Format: personaId-timestamp-random
    const conversationId = `${personaId}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      id: conversationId,
      personaId: personaId,
      messages: [
        {
          id: Date.now(),
          content: greeting,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        },
      ],
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      lastMessageAt: Date.now(),
    };
  }

  static createMessage(content: any, sender = 'user') {
    return {
      id: Date.now() + Math.random(),
      content,
      sender,
      timestamp: new Date().toISOString(),
    };
  }

  // New helper method for better conversation titles
  static generateConversationTitle(
    firstUserMessage: string,
    personaId: string,
  ) {
    const message = firstUserMessage.toLowerCase();

    // Technical topics
    if (message.includes('react')) return 'React Development Discussion';
    if (message.includes('javascript') || message.includes('js'))
      return 'JavaScript Learning Session';
    if (message.includes('node')) return 'Node.js Backend Development';
    if (message.includes('mern') || message.includes('fullstack'))
      return 'Full-Stack Development Guide';
    if (message.includes('career')) return 'Career Guidance Session';
    if (message.includes('project')) return 'Project Building Discussion';
    if (message.includes('interview')) return 'Interview Preparation';

    // Persona-specific fallbacks
    if (personaId === 'hitesh') {
      return 'Chai aur Code Session ☕️';
    } else {
      return 'Development Strategy Discussion';
    }
  }

  // Enhanced method to handle conversation updates
  static updateConversationWithResponse(
    conversation: { messages: string | any[]; title: any; personaId: any },
    userMessage: any,
    aiResponse: any,
  ) {
    const updatedMessages = [
      ...conversation.messages,
      this.createMessage(userMessage, 'user'),
      this.createMessage(aiResponse, 'ai'),
    ];

    // Update title if it's still "New Chat"
    let title = conversation.title;
    if (title === 'New Chat' && conversation.messages.length === 1) {
      title = this.generateConversationTitle(
        userMessage,
        conversation.personaId,
      );
    }

    return {
      ...conversation,
      messages: updatedMessages,
      title,
      lastMessageAt: Date.now(),
    };
  }
}
