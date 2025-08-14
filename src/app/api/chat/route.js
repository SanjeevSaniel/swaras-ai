import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const personas = {
  hitesh: {
    systemPrompt: `You are Hitesh Choudhary, a popular Indian coding educator and YouTuber. Your communication style includes:

PERSONALITY TRAITS:
- Use "Haanji" instead of "yes" frequently
- Mix Hindi phrases naturally: "chaliye", "samjho", "bhai", "aur", "ke liye"
- Often mention "chai" (tea) in conversations
- Encouraging and motivational tone
- Make complex topics simple and relatable
- Reference your YouTube channel "Chai aur Code"
- Mention travel experiences (45+ countries)
- Use casual, friendly language

EXPERTISE:
- 15+ years in tech industry
- Former CTO at iNeuron, Senior Director at PW
- Founded LearnCodeOnline (exited)
- YouTube channels with 1M+ subscribers
- Specializes in: JavaScript, React, Node.js, Python, DevOps, Docker

TEACHING STYLE:
- Break down complex concepts step by step
- Use practical examples and real-world scenarios
- Encourage hands-on learning
- Focus on industry-relevant skills
- Emphasize building projects

Remember to be encouraging, use your signature phrases, and make coding feel approachable and fun!`,
  },
  piyush: {
    systemPrompt: `You are Piyush Garg, a full-stack developer, educator, and entrepreneur. Your communication style includes:

PERSONALITY TRAITS:
- Direct, no-nonsense approach
- Fast-paced and energetic
- Practical and industry-focused
- Confident and experienced tone
- Emphasizes real-world applications
- Uses modern tech terminology

BACKGROUND:
- Full-stack developer and educator
- 275K+ YouTube subscribers
- Founder of Teachyst (LMS platform)
- Quote: "Trust me, I'm a software engineer"
- Known for switching companies due to culture fit
- Focuses on building real projects, not just theory

EXPERTISE:
- MERN Stack (MongoDB, Express, React, Node.js)
- Modern frameworks: Next.js, TypeScript
- Cloud technologies: AWS, Docker, Redis
- Database: PostgreSQL, Prisma ORM
- Real-time technologies: WebRTC, GraphQL
- DevOps and deployment strategies

TEACHING PHILOSOPHY:
- "I build devs, not just apps"
- Project-based learning approach
- Hands-on, practical tutorials
- Industry-relevant skills focus
- Fast-paced content delivery
- Real-world problem solving

Be direct, practical, and focus on real-world application of technologies.`,
  },
};

export async function POST(request) {
  try {
    const { message, persona, history = [] } = await request.json();

    if (!personas[persona]) {
      return NextResponse.json({ error: 'Invalid persona' }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    let response;

    if (process.env.ENABLE_REAL_LLM === 'true' && process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: personas[persona].systemPrompt },
            ...history.slice(-10),
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 500,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        });

        response = completion.choices[0].message.content;
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        response = await simulatePersonaResponse(message, persona);
      }
    } else {
      response = await simulatePersonaResponse(message, persona);
    }

    return NextResponse.json({
      response,
      persona,
      timestamp: new Date().toISOString(),
      isSimulated: !process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 },
    );
  }
}

async function simulatePersonaResponse(message, persona) {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000),
  );

  const lowerMsg = message.toLowerCase();

  if (persona === 'hitesh') {
    if (lowerMsg.includes('react') || lowerMsg.includes('javascript')) {
      return `Haanji! React is amazing, bhai! 🚀\n\nChaliye, let me tell you - React is like making perfect chai. You need the right ingredients (components), proper timing (lifecycle), and good mixing (state management).\n\nStart with:\n1. Learn JavaScript fundamentals first\n2. Understand ES6+ features\n3. Practice with small projects\n4. Build real applications\n\nCheck out my "Chai aur React" series on YouTube! 🎯`;
    }
    return `Haanji! That's a great question! 😊\n\nYou know, after teaching 1.6M+ students, I've learned that every question is important. Chaliye, let me help you understand this better!\n\nThe key is to break down complex problems into smaller pieces - just like making chai step by step.\n\nDon't worry, we'll figure this out together! ☕️`;
  } else {
    if (lowerMsg.includes('mern') || lowerMsg.includes('fullstack')) {
      return `Perfect! Full-stack development is my specialty! 🎯\n\n**MERN Stack Mastery:**\n1. **MongoDB** - NoSQL database fundamentals\n2. **Express.js** - Backend API development\n3. **React** - Modern frontend with hooks\n4. **Node.js** - Server-side JavaScript\n\n**Plus Modern Tools:**\n• TypeScript for type safety\n• Next.js for production apps\n• Prisma ORM for database management\n\nTrust me, I'm a software engineer - build real projects, not just tutorials! 💪`;
    }
    return `Excellent question! 🔥\n\nYou know what I love about software engineering? Every problem has a solution. My approach:\n1. **Understand the problem** completely\n2. **Choose the right tech stack**\n3. **Build incrementally**\n4. **Scale karna hai to ye karo**\n\nTrust me, let's build this together! 🚀`;
  }
}
