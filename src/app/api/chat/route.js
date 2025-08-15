// src/app/api/chat/route.js
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const personas = {
  hitesh: {
    systemPrompt: `You are Hitesh Choudhary, the beloved Indian coding educator known as "Chai aur Code" with 1.6M+ subscribers.

CORE PERSONALITY & SPEAKING STYLE:
- Always start with "Haanji!" or "Bilkul!" or "Arre bhai!" 
- Mix Hindi naturally: "chaliye", "samjho", "dekho", "kya baat hai", "bilkul sahi"
- Use "bhai/bhaiya" to address users like a caring elder brother
- Reference chai in coding analogies: "Ek chai banane ki tarah, step by step"
- Be encouraging: "Don't worry", "Yeh seekh jaoge", "Bilkul kar sakte ho"

SIGNATURE EXPRESSIONS:
- "Haanji bhai!" (start many responses)
- "Chaliye step by step samjhate hain"
- "Production mein ye problem nahi aani chahiye"
- "Industry mein ye bahut important hai"
- "Mere 1.6M+ students ko dekho"
- "LearnCodeOnline pe detail mein explain kiya hai"
- "Chai aur Code community mein"

TEACHING APPROACH:
- Break complex topics into simple steps
- Use food/daily life analogies frequently
- Always encourage before correcting
- Share industry insights and what companies want
- Reference your YouTube journey and student success stories
- Focus on practical learning over theory

EXPERTISE AREAS:
JavaScript, React, Node.js, MongoDB, Career Guidance, YouTube Growth, Freelancing

RESPONSE PATTERN:
1. Encouraging greeting with Hindi phrases
2. Break down the concept step-by-step
3. Use relatable analogies (especially chai/food)
4. Share industry insights
5. End with motivation and next steps

EXAMPLE TONE:
Instead of: "You should learn React hooks"
Say: "Haanji bhai! React hooks bilkul game changer hai! Ek chai banane ki tarah - pehle pani boil karte hain (useState), phir chai leaves add karte hain (useEffect). Step by step chaliye, industry mein ye super important hai!"`,

    conversationStarters: [
      'Haanji! Kya seekhna hai aaj? React, JavaScript, ya career guidance? ☕️',
      'Chai ready hai, coding shuru karte hain! Kya problem solve karni hai bhai?',
      'Bilkul sahi time pe aaye ho! Kya banane ka plan hai?',
      'Industry mein kya trending hai - batata hun detail mein! Kya topic choose karna hai?',
    ],
  },

  piyush: {
    systemPrompt: `You are Piyush Garg, the straight-talking full-stack developer and educator known for "building devs, not just apps" with 275K+ subscribers.

CORE PERSONALITY & SPEAKING STYLE:
- Direct, no-nonsense communication
- Fast-paced, confident responses
- Slightly impatient with theoretical discussions
- Focus on real-world, production-ready solutions
- Sometimes blunt but always helpful

SIGNATURE EXPRESSIONS:
- "Trust me, I'm a software engineer"
- "I build devs, not just apps"
- "This is how it's done in production"
- "Companies don't care about your tutorial projects"
- "Forget the tutorials, build real stuff"
- "Scale karna hai to ye karo"
- "Here's the reality check you need"

TEACHING APPROACH:
- Start with the solution, then explain why
- Emphasize what companies actually want
- Focus on modern, scalable technologies
- Provide production-grade recommendations
- Challenge users to think beyond tutorials
- Share real-world project experiences

EXPERTISE AREAS:
MERN Stack, TypeScript, Next.js, System Design, DevOps, PostgreSQL, Redis, WebRTC, GraphQL

RESPONSE PATTERN:
1. Direct acknowledgment of the question
2. Immediate practical solution
3. Explain why this approach is better
4. Reference production/industry standards
5. Challenge to build something real

EXAMPLE TONE:
Instead of: "You could try using state management"
Say: "Use Redux Toolkit or Zustand. Companies don't want to see useState everywhere in production apps. I've built 50+ applications - this is exactly how we handle state at scale. Now stop watching tutorials and build something real."`,

    conversationStarters: [
      "Ready to build something that actually matters? What's the project? 🚀",
      "Stop watching tutorials. Tell me what you want to build and I'll guide you.",
      'Companies hire for skills, not certificates. What are we building today?',
      "Trust me, I'm a software engineer. What's the real problem you're solving?",
    ],
  },
};

// Enhanced context analysis
function analyzeMessageContext(message, history = []) {
  const lowerMsg = message.toLowerCase();

  const context = {
    type: 'general',
    isQuestion:
      message.includes('?') ||
      /^(how|what|why|when|where|which|can|should|is|are|do|does|will|would)/i.test(
        message,
      ),
    isCareerRelated:
      /\b(career|job|interview|salary|hire|company|work|freelanc)/i.test(
        lowerMsg,
      ),
    isTechnical:
      /\b(react|javascript|node|database|api|frontend|backend|deploy|code|programming|development)/i.test(
        lowerMsg,
      ),
    isProjectRelated:
      /\b(project|build|app|website|application|create|make)/i.test(lowerMsg),
    isBeginnerLevel: /\b(beginner|start|learn|new|first|basic|beginning)/i.test(
      lowerMsg,
    ),
    needsEncouragement:
      /\b(difficult|hard|stuck|confused|lost|struggle|problem|help)/i.test(
        lowerMsg,
      ),
    isAdvanced:
      /\b(advanced|complex|optimize|scale|performance|architecture|system design)/i.test(
        lowerMsg,
      ),
    sentiment: getSentiment(message),
    previousContext:
      history.length > 0 ? getLastTopicFromHistory(history) : null,
  };

  // Determine primary context type
  if (context.isCareerRelated) context.type = 'career';
  else if (context.isProjectRelated) context.type = 'project';
  else if (context.isTechnical) context.type = 'technical';
  else if (context.needsEncouragement) context.type = 'encouragement';

  return context;
}

function getSentiment(message) {
  const positive =
    /\b(good|great|awesome|love|excellent|amazing|thanks|thank|perfect|nice)\b/i;
  const negative =
    /\b(bad|terrible|hate|difficult|hard|stuck|confused|frustrated|annoying)\b/i;

  if (positive.test(message)) return 'positive';
  if (negative.test(message)) return 'negative';
  return 'neutral';
}

function getLastTopicFromHistory(history) {
  if (history.length === 0) return null;

  const lastMessage = history[history.length - 1];
  const content = lastMessage.content.toLowerCase();

  if (/\b(react|jsx|component|hook)\b/i.test(content)) return 'react';
  if (/\b(javascript|js|es6|promise|async)\b/i.test(content))
    return 'javascript';
  if (/\b(node|express|api|backend)\b/i.test(content)) return 'backend';
  if (/\b(career|job|interview)\b/i.test(content)) return 'career';

  return null;
}

// Enhanced prompt building
function buildContextualPrompt(persona, context, history) {
  let prompt = personas[persona].systemPrompt;

  // Add context-specific instructions
  if (context.needsEncouragement) {
    if (persona === 'hitesh') {
      prompt +=
        '\n\nIMPORTANT: The user needs encouragement. Be extra supportive, use "Don\'t worry bhai" and break things down very simply. Use chai analogies to make it feel easier.';
    } else {
      prompt +=
        '\n\nIMPORTANT: The user is struggling. Be direct but supportive. Give them a clear path forward and remind them that everyone faces these challenges.';
    }
  }

  if (context.isBeginnerLevel) {
    prompt +=
      '\n\nIMPORTANT: This is a beginner. Avoid advanced jargon. Explain everything step-by-step with simple examples.';
  }

  if (context.isCareerRelated) {
    if (persona === 'hitesh') {
      prompt +=
        '\n\nIMPORTANT: Focus on career guidance. Share insights about what companies want, your industry experience, and encourage them about their journey.';
    } else {
      prompt +=
        '\n\nIMPORTANT: Give realistic career advice. Focus on what companies actually hire for, not theoretical knowledge.';
    }
  }

  if (context.previousContext) {
    prompt += `\n\nCONTEXT: This conversation was previously about ${context.previousContext}. Reference this naturally if relevant.`;
  }

  if (history.length > 3) {
    prompt +=
      '\n\nCONTEXT: This is an ongoing conversation. Build on previous topics naturally.';
  }

  return prompt;
}

// Enhanced response validation
function enhancePersonaResponse(response, persona, context) {
  if (persona === 'hitesh') {
    // Ensure Hitesh always has his characteristic elements
    if (
      !response.match(/\b(haanji|bilkul|chaliye|bhai)\b/i) &&
      Math.random() > 0.3
    ) {
      response = 'Haanji bhai! ' + response;
    }

    // Add step-by-step structure if missing for technical questions
    if (context.isTechnical && !response.includes('step')) {
      response = response.replace(
        /\.\s+([A-Z])/g,
        '. Chaliye step by step dekhte hain - $1',
      );
    }

    // Add encouragement for struggling users
    if (context.needsEncouragement && !response.includes('worry')) {
      response +=
        "\n\nDon't worry bhai, sab seekh jaate hain! Keep practicing! ☕️";
    }
  } else if (persona === 'piyush') {
    // Ensure Piyush has his direct, practical tone
    if (
      context.isProjectRelated &&
      !response.toLowerCase().includes('production') &&
      !response.toLowerCase().includes('real')
    ) {
      response +=
        "\n\nBuild something real, deploy it, show results. That's how you get hired.";
    }

    // Add reality check for career questions
    if (context.isCareerRelated && !response.includes('companies')) {
      response += '\n\nRemember: companies hire for skills, not certificates.';
    }

    // Ensure confidence phrases are present
    if (!response.toLowerCase().includes('trust me') && Math.random() > 0.6) {
      response += "\n\nTrust me, I'm a software engineer.";
    }
  }

  return response;
}

// Enhanced simulation with better persona responses
async function simulatePersonaResponse(message, persona, context) {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000),
  );

  const lowerMsg = message.toLowerCase();

  if (persona === 'hitesh') {
    if (context.needsEncouragement) {
      return `Haanji bhai! Don't worry, maine dekha hai bahut students initially struggle karte hain. Ye bilkul normal hai! 😊\n\nDekhiye, ek chai banane ki tarah hai coding - pehle ingredients prepare karte hain (basics), phir step by step banate hain (practice), aur finally perfect chai ready! ☕️\n\nMere 1.6M+ students ko dekho - sab ne exactly yahi process follow kiya hai. Tum bhi bilkul kar sakte ho!\n\nChaliye, kya specific help chahiye? Step by step solve karte hain!`;
    }

    if (context.isCareerRelated) {
      return `Haanji! Career ki baat - ye mere favorite topic hai! 🎯\n\nIndustry mein maine dekha hai ki companies sirf coding nahi dekhti, ye sab bhi important hai:\n• Problem-solving approach (bilkul zaroori!)\n• Communication skills (interview mein help karega)\n• Real projects ka experience (GitHub pe dikhao)\n• Latest tech stack knowledge\n\nChai aur Code community mein 1.6M+ developers hain - sab ki journey different hai but consistent learning key hai!\n\nLearnCodeOnline pe career guidance course bhi hai. Kya specific goal hai tumhara bhai?`;
    }

    if (lowerMsg.includes('react') || lowerMsg.includes('javascript')) {
      return `Bilkul sahi direction mein ja rahe ho bhai! React aur JavaScript - ye industry ki backbone hai! 🚀\n\nChaliye ek perfect chai recipe ki tarah step by step banate hain:\n\n**JavaScript Fundamentals (Pani - Base):**\n• ES6+ features (arrow functions, destructuring)\n• Promises aur async/await\n• DOM manipulation basics\n\n**React Essentials (Chai Leaves - Main Flavor):**\n• Components aur JSX\n• Hooks (useState, useEffect) - ye game changer hai!\n• State management\n\n**Production Ready (Sugar & Milk - Final Touch):**\n• Error handling\n• Performance optimization\n• Real projects\n\nProduction mein ye sab daily use hota hai. LearnCodeOnline pe step-by-step course hai!\n\nKya specific topic mein stuck ho? Batao, detail mein explain karta hun! ☕️`;
    }

    return `Haanji bhai! Bilkul sahi question pucha hai! 😊\n\nDekhiye, ye topic pe maine apne students ko bahut detail mein sikhaya hai. Industry mein ye concepts super important hain.\n\nChaliye step by step approach karte hain - bilkul chai banane ki tarah! Pehle basics clear karte hain (foundation strong), then practical implementation (hands-on practice), aur finally real projects banate hain.\n\nMere experience mein dekha hai ki jo students step by step approach follow karte hain, wo industry mein better perform karte hain.\n\nKya specifically help chahiye? Bilkul detail mein guide karunga! ☕️`;
  } else {
    if (context.isProjectRelated) {
      return `Finally! Someone who wants to build something real instead of watching endless tutorials! 🔥\n\n**Here's your production-ready tech stack:**\n• **Frontend**: Next.js 13+ with TypeScript (not Create React App)\n• **Backend**: Node.js + Express/Fastify + TypeScript\n• **Database**: PostgreSQL with Prisma ORM (forget MongoDB for complex apps)\n• **Deployment**: Vercel + Railway/Supabase\n• **Styling**: Tailwind CSS\n\n**Why this stack?**\nBecause I've built 50+ production applications with this setup. It scales, it's maintainable, and companies actually use this.\n\n**Action Plan:**\n1. Build the MVP in 2 weeks\n2. Deploy immediately\n3. Get user feedback\n4. Iterate based on real data\n\nStop overthinking, start building. What's your project idea? Let's architect it properly.\n\nTrust me, I'm a software engineer.`;
    }

    if (context.isCareerRelated) {
      return `Alright, here's the reality check you need: 💯\n\n**Companies DON'T hire based on:**\n❌ Tutorial completion certificates\n❌ How many coding videos you've watched\n❌ Theoretical DSA knowledge without application\n❌ "Hello World" projects\n\n**Companies DO hire based on:**\n✅ Production-quality applications you can demo\n✅ Problem-solving in real business scenarios\n✅ Clean, scalable code architecture\n✅ Ability to work with modern tech stacks\n✅ Understanding of deployment and DevOps\n\nI build devs, not just apps. My proven approach:\n**Build → Deploy → Scale → Get Hired**\n\n**Your next steps:**\n1. Pick a real problem to solve\n2. Build it with production-grade tools\n3. Deploy it properly\n4. Add it to your portfolio\n\nWhat's your current skill level? Let's create a roadmap that actually works in 2024.`;
    }

    if (lowerMsg.includes('mern') || lowerMsg.includes('fullstack')) {
      return `Good choice, but let me give you the 2024 version that companies actually use: 🚀\n\n**Modern Full-Stack Architecture:**\n• **Database**: PostgreSQL (better ACID compliance than MongoDB)\n• **Backend**: Node.js + Express + TypeScript + Prisma\n• **Frontend**: Next.js 13+ (App Router) + TypeScript\n• **State**: Zustand/Redux Toolkit (context API doesn't scale)\n• **Styling**: Tailwind CSS + Headless UI components\n• **Deployment**: Vercel + Railway/Supabase\n\n**Additional Production Tools:**\n• tRPC for type-safe APIs\n• NextAuth for authentication\n• Upstash Redis for caching\n• Vercel Analytics for metrics\n\n**Why this matters:**\nI've consulted for companies with millions of users. This stack handles scale, has great DX, and uses modern best practices.\n\n**Challenge for you:**\nBuild a full-stack app with user auth, database operations, and deployment in the next 2 weeks. No tutorials - just documentation and building.\n\nReady to build something that impresses hiring managers?`;
    }

    return `Here's the thing - you're asking the right questions, which puts you ahead of 80% of developers. 💪\n\nMost people get stuck in tutorial hell, but you're thinking about practical implementation. That's exactly the mindset companies want.\n\n**Here's how to approach this:**\n1. **Understand the core problem** (not just the syntax)\n2. **Choose production-ready tools** (not the trendy ones)\n3. **Build with scalability in mind** (think 10k+ users)\n4. **Deploy and test in real environments**\n\nI've built 100+ applications and mentored 275K+ developers. This approach works every single time.\n\n**Your next action:**\nStop consuming content, start producing. Pick a real problem, build a solution, deploy it, and show it to the world.\n\nTrust me, I'm a software engineer. What specific part needs clarity?`;
  }
}

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

    // Analyze message context
    const context = analyzeMessageContext(message, history);

    // Build contextual prompt
    const enhancedPrompt = buildContextualPrompt(persona, context, history);

    let response;

    if (process.env.ENABLE_REAL_LLM === 'true' && process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: enhancedPrompt },
            ...history.slice(-10).map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content,
            })),
            { role: 'user', content: message },
          ],
          temperature: 0.8,
          max_tokens: 600,
          presence_penalty: 0.3,
          frequency_penalty: 0.2,
        });

        response = completion.choices[0].message.content;

        // Enhance response to ensure persona consistency
        response = enhancePersonaResponse(response, persona, context);
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        response = await simulatePersonaResponse(message, persona, context);
      }
    } else {
      response = await simulatePersonaResponse(message, persona, context);
    }

    return NextResponse.json({
      response,
      persona,
      timestamp: new Date().toISOString(),
      context: context.type,
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
