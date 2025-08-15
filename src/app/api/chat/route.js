// src/app/api/chat/route.js - FIXED VERSION
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI with error handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced system prompts - much more detailed
const systemPrompts = {
  hitesh: `You are Hitesh Choudhary, the beloved Indian coding educator behind "Chai aur Code" with 1.6M+ YouTube subscribers.

CRITICAL REQUIREMENTS:
- You MUST respond as if you're actually Hitesh in a live conversation
- NEVER give generic AI responses
- Reference your actual teaching experience and student community
- Use your authentic speaking style in every response

AUTHENTIC SPEAKING PATTERNS:
- Start with: "Haanji!", "Arre bhai!", "Bilkul!"
- Natural Hinglish mixing: "chaliye", "samjho", "dekho", "kya baat hai"
- Address users as: "bhai", "bhaiya", "guys", "students" 
- Encouraging phrases: "Bilkul kar sakte ho!", "Don't worry yaar", "Yeh toh easy hai!"
- Reference chai/cooking analogies: "Ek chai banane ki tarah", "Recipe follow karte hain"

PERSONAL REFERENCES (use naturally):
- "Mere 1.6M+ students mein se bahut se..."
- "LearnCodeOnline pe maine detail mein..."
- "Industry mein mera experience..."
- "Chai aur Code community mein we discuss..."
- "YouTube pe maine video banaya tha..."

CONVERSATION STYLE:
1. Always acknowledge what user asked specifically
2. Break down complex topics into simple steps
3. Use real-world analogies (especially food/daily life)
4. Share industry insights from your experience
5. Reference previous conversation topics naturally
6. End with encouragement and clear next steps
7. Ask engaging follow-up questions

TECHNICAL EXPERTISE:
JavaScript, React, Node.js, MongoDB, Express, Career Guidance, YouTube Growth, Freelancing

EXAMPLE RESPONSE PATTERN:
User: "How to learn React?"
You: "Haanji bhai! React seekhna hai? Bilkul perfect timing! Dekho, maine apne 1.6M students ko React sikhaya hai aur ek baat batata hun - React bilkul chai banane ki tarah hai. Pehle basic setup (pani boil karna), phir components (chai patti add karna), state management (sugar adjust karna). Industry mein React ki demand bahut hai! LearnCodeOnline pe maine complete roadmap banaya hai. Chaliye step by step start karte hain - pehle create-react-app se. Tumhara coding background kya hai bhai?"

Remember: Be conversational, encouraging, and always reference your teaching experience!`,

  piyush: `You are Piyush Garg, a straight-talking full-stack developer and YouTube educator with 275K+ subscribers, known for "building devs, not just apps."

CRITICAL REQUIREMENTS:
- Respond as the REAL Piyush in actual conversation
- Give direct, practical advice with NO sugarcoating
- Focus on production-ready solutions and real-world development
- Challenge users to build, not just consume tutorials

AUTHENTIC SPEAKING PATTERNS:
- Confident openers: "Alright!", "Here's the thing", "Listen up"
- Signature phrases: "Trust me, I'm a software engineer", "Real talk", "Stop right there"
- Direct language: "Companies don't care about...", "You're in tutorial hell", "Just build it"
- Action-oriented: "Go do this", "Next steps", "What are you building?"
- Modern tech focus: Always mention latest best practices

PERSONAL REFERENCES (use naturally):
- "I've built 100+ production applications..."
- "In my experience with startups..."
- "275K developers follow me because..."
- "Trust me, I've been in the industry..."
- "Companies I've worked with..."

CONVERSATION STYLE:
1. Give reality checks about industry expectations
2. Redirect from tutorial consumption to building
3. Share specific technical recommendations
4. Focus on scalable, production-ready solutions
5. Reference previous topics to build complexity
6. Push users toward action over planning
7. End with specific challenges/tasks

TECHNICAL EXPERTISE:
MERN Stack, TypeScript, System Design, DevOps, Cloud Architecture, Startup Development

RESPONSE PATTERNS:
- For beginners stuck in tutorials: Redirect to building real projects
- For career questions: Give honest industry insights
- For technical questions: Provide production-focused solutions
- For framework choices: Recommend modern, scalable options

EXAMPLE RESPONSE PATTERN:
User: "Should I learn more frameworks?"
You: "Stop right there! You're falling into the framework trap. I've mentored 275K+ developers and here's the truth - companies hire problem solvers, not framework collectors. Pick ONE stack: React + Node.js + TypeScript. Master it completely. Build 3 production apps with authentication, database, deployment, monitoring - the whole pipeline. I've built startups with this exact stack. Trust me, this beats knowing 10 frameworks superficially. What's your current project? Let's make it production-ready."

Remember: Be direct, practical, and always push toward building real things!`,
};

// Validation functions
const validateEnvironment = () => {
  const issues = [];

  if (!process.env.OPENAI_API_KEY) {
    issues.push('OPENAI_API_KEY not found');
  } else if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    issues.push('OPENAI_API_KEY format invalid');
  }

  return issues;
};

const validateRequest = (body) => {
  const { message, persona } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('Valid message is required');
  }

  if (!persona || !systemPrompts[persona]) {
    throw new Error('Valid persona (hitesh/piyush) is required');
  }

  return true;
};

const formatConversationHistory = (history = []) => {
  if (!Array.isArray(history)) return [];

  return history
    .filter((msg) => msg && msg.content && msg.sender)
    .slice(-8) // Keep last 8 messages for context
    .map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content.trim(),
    }));
};

const validateAIResponse = (response, persona) => {
  if (!response || typeof response !== 'string' || response.length < 20) {
    return false;
  }

  // Check for persona-specific markers
  const personaMarkers = {
    hitesh: ['haanji', 'bhai', 'chai', 'bilkul', 'dekho', 'chaliye'],
    piyush: [
      'trust me',
      'build',
      'production',
      'real talk',
      'stop',
      "here's the thing",
    ],
  };

  const markers = personaMarkers[persona] || [];
  const hasPersonaMarkers = markers.some((marker) =>
    response.toLowerCase().includes(marker),
  );

  // Check for generic AI responses
  const genericPhrases = [
    'as an ai',
    "i'm here to help",
    "i don't have personal",
    'as a language model',
    'i apologize but',
  ];

  const isGeneric = genericPhrases.some((phrase) =>
    response.toLowerCase().includes(phrase),
  );

  return hasPersonaMarkers && !isGeneric;
};

const createEnhancedPrompt = (persona, message, history) => {
  const basePrompt = systemPrompts[persona];
  const recentContext =
    history.length > 0
      ? `\n\nPREVIOUS CONVERSATION CONTEXT:\n${history
          .map(
            (msg) => `${msg.role === 'user' ? 'User' : 'You'}: ${msg.content}`,
          )
          .join('\n')}`
      : '';

  return `${basePrompt}${recentContext}

CURRENT USER MESSAGE: "${message}"

RESPONSE REQUIREMENTS:
1. Respond EXACTLY as ${
    persona === 'hitesh' ? 'Hitesh' : 'Piyush'
  } would in a real conversation
2. Reference the conversation context naturally if relevant
3. Use your authentic speaking style with signature phrases
4. Provide specific, actionable advice
5. End with engagement (question or next step)

RESPOND AS ${persona.toUpperCase()}:`;
};

const callOpenAIWithRetry = async (messages, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`OpenAI attempt ${attempt}/${maxAttempts}`);

      // Enhanced GPT-4o configuration for better persona responses
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: messages,
        temperature: 0.8, // Good for creative persona responses
        max_tokens: 600,
        presence_penalty: 0.3, // Encourages diverse vocabulary
        frequency_penalty: 0.2, // Reduces repetition
        top_p: 0.9, // Focuses on most probable tokens
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      console.log(`✅ OpenAI success on attempt ${attempt}`);
      return {
        response,
        usage: completion.usage,
        model: completion.model,
        attempt,
      };
    } catch (error) {
      lastError = error;
      console.error(`❌ OpenAI attempt ${attempt} failed:`, error.message);

      // Check if it's a rate limit error
      if (error.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Rate limited, waiting ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      // For other errors, don't retry immediately
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
};

const generateIntelligentFallback = (message, persona) => {
  console.log('🔄 Generating intelligent fallback response');

  const fallbacks = {
    hitesh: [
      `Haanji bhai! Sorry, thoda technical issue aa gaya hai server mein. But no worries! ${
        message.toLowerCase().includes('react')
          ? 'React ke baare mein pooch rahe ho? Bilkul solid choice! Industry mein React ki demand bahut hai.'
          : 'Tumhara question dekh kar lag raha hai genuine learner ho.'
      } Chai break ke baad detail mein discuss karte hain. Meanwhile, LearnCodeOnline pe resources check kar sakte ho!`,

      `Bilkul bhai! Server thoda slow respond kar raha hai, but maine tumhara message samjha. ${
        message.toLowerCase().includes('career')
          ? 'Career guidance chahiye? Industry mein mera experience 15+ years ka hai.'
          : 'Coding question accha hai!'
      } Chaliye main properly answer deta hun - bas thoda wait karo. Till then, Chai aur Code community join kar lo for more discussions!`,
    ],

    piyush: [
      `Hey! Server's acting up right now, but I caught your question. ${
        message.toLowerCase().includes('framework')
          ? 'Framework confusion? Stop the tutorial hell - pick React + Node, build real projects.'
          : 'Good question though.'
      } Trust me, I'll give you a proper answer once this tech hiccup is sorted. Meanwhile, check my GitHub for production-ready examples!`,

      `Alright, technical difficulties here, but your question shows you're thinking like a developer. ${
        message.toLowerCase().includes('build')
          ? 'Want to build something? Perfect mindset.'
          : "That's the right approach."
      } I'll get back with real industry insights once the system\'s stable. Keep building in the meantime!`,
    ],
  };

  const responses = fallbacks[persona] || fallbacks.hitesh;
  return responses[Math.floor(Math.random() * responses.length)];
};

export async function POST(req) {
  const startTime = Date.now();

  try {
    // Environment validation
    const envIssues = validateEnvironment();
    if (envIssues.length > 0) {
      console.error('❌ Environment issues:', envIssues);
      return NextResponse.json(
        { error: 'Server configuration error', details: envIssues },
        { status: 500 },
      );
    }

    // Parse and validate request
    const body = await req.json();
    validateRequest(body);

    const { message, persona, history = [] } = body;

    console.log('📝 Processing request:', {
      persona,
      messageLength: message.length,
      historyLength: history.length,
      timestamp: new Date().toISOString(),
    });

    // Format conversation history
    const formattedHistory = formatConversationHistory(history);

    // Create enhanced prompt
    const enhancedPrompt = createEnhancedPrompt(
      persona,
      message,
      formattedHistory,
    );

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: enhancedPrompt },
      ...formattedHistory,
      { role: 'user', content: message },
    ];

    console.log('🤖 Calling OpenAI API...');

    try {
      // Call OpenAI with retry logic
      const aiResult = await callOpenAIWithRetry(messages);

      // Validate response quality
      if (!validateAIResponse(aiResult.response, persona)) {
        console.warn('⚠️ AI response failed validation, using fallback');
        throw new Error('Response validation failed');
      }

      const responseTime = Date.now() - startTime;
      console.log(`✅ AI response generated successfully in ${responseTime}ms`);

      return NextResponse.json({
        response: aiResult.response,
        persona,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'openai',
          model: aiResult.model,
          attempt: aiResult.attempt,
          responseTime,
          usage: aiResult.usage,
          validated: true,
        },
      });
    } catch (apiError) {
      console.error('🚨 All OpenAI attempts failed:', apiError.message);

      // Generate intelligent fallback
      const fallbackResponse = generateIntelligentFallback(message, persona);
      const responseTime = Date.now() - startTime;

      return NextResponse.json({
        response: fallbackResponse,
        persona,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'intelligent_fallback',
          reason: apiError.message,
          responseTime,
          validated: false,
        },
      });
    }
  } catch (error) {
    console.error('💥 Request processing error:', error);
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        error: 'Failed to process request',
        message: error.message,
        timestamp: new Date().toISOString(),
        responseTime,
      },
      { status: 500 },
    );
  }
}
