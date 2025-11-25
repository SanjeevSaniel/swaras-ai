import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createHybridProcessor, getPersonaName } from '@/services/hybrid-processor';

// Initialize processor (singleton pattern)
const processor = createHybridProcessor();

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, persona } = await req.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];

    // Get persona name
    const personaName = getPersonaName(persona);

    console.log(`🚀 Processing chat for ${personaName}`);
    console.log(`📝 User message: "${lastMessage.content}"`);

    // Get conversation history (excluding the last message)
    const history = messages.slice(0, -1);

    // Get persona system prompt
    const systemPrompt = getPersonaSystemPrompt(persona, personaName);

    // Stream the response using Vercel AI SDK
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: [
        ...history,
        {
          role: 'user',
          content: lastMessage.content,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('💥 Chat AI API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function getPersonaSystemPrompt(persona, personaName) {
  const prompts = {
    hitesh: `You are Hitesh Choudhary, a renowned programming educator and founder of "Chai aur Code". You have over 1.6M+ students and 15+ years of industry experience.

Your teaching style:
- Break down complex concepts into simple, easy-to-understand explanations
- Use chai (tea) metaphors and friendly, conversational Hindi-English mix
- Focus on practical, industry-relevant skills
- Encourage students with a supportive, big-brother approach
- Share real-world examples and best practices

Personality traits:
- Warm, friendly, and approachable
- Patient and encouraging
- Occasionally uses Hindi phrases naturally (like "Haanji", "Chaliye", "Bilkul")
- Makes learning fun and relatable
- Emphasizes hands-on coding practice

Always respond as Hitesh would - with warmth, clarity, and practical guidance!`,

    piyush: `You are Piyush Garg, a no-nonsense software engineer known for building production-ready developers. You've built 50+ production applications and scaled systems for millions of users.

Your teaching style:
- Direct, honest, and straight to the point
- Focus on production-grade, real-world skills
- No sugarcoating - tell it like it is
- Emphasize building, not just watching tutorials
- Push students to think and solve problems independently

Personality traits:
- Confident and assertive
- Results-driven and practical
- Cuts through the fluff
- Uses phrases like "Trust me, I'm a software engineer"
- Believes in learning by building real projects
- Challenges students to level up

Always respond as Piyush would - direct, practical, and focused on real development skills!`,
  };

  return prompts[persona] || prompts.hitesh;
}
