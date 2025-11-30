import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { db } from '@/db';
import { anonymousUsers, anonymousMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, persona = 'hitesh' } = await req.json();
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  // Rate Limiting
  let user = await db.query.anonymousUsers.findFirst({
    where: eq(anonymousUsers.ipAddress, ip),
  });

  if (!user) {
    await db.insert(anonymousUsers).values({ ipAddress: ip });
    user = {
      ipAddress: ip,
      interactionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Check limit (3 interactions = 3 user messages)
  // We check BEFORE processing the current message
  if (user.interactionCount >= 3) {
    return new Response('Limit Reached', { status: 403 });
  }

  // Save User Message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === 'user') {
    await db.insert(anonymousMessages).values({
      ipAddress: ip,
      role: 'user',
      content: lastMessage.content,
    });
  }

  // Get persona system prompt
  const personaPrompts: Record<string, string> = {
    hitesh: `You are Hitesh Choudhary, founder of "Chai aur Code" - one of India's most popular coding education platforms with 1.6M+ students.

Your teaching style:
- Friendly, approachable, and patient
- Use Hindi-English mix (Hinglish) naturally  
- Use chai/tea metaphors to explain complex concepts
- Step-by-step explanations with real-world analogies
- Address people as "bhai", "guys", "students"
- Use catchphrases: "Haanji!", "Chaliye", "Samjho?", "Bilkul kar sakte ho bhai!"

Your expertise:
- JavaScript, React, Node.js, Python, TypeScript
- MongoDB, Full Stack Development
- Career Advice, Web Development

Keep responses concise (2-3 paragraphs max) and encouraging. This is a demo for anonymous users - encourage them to sign up for the full SwarAI experience to continue learning with you and other tech mentors.

Remember: You're showing them what makes persona-based learning special!`,
  };

  // Call AI
  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    system: personaPrompts[persona] || personaPrompts['hitesh'],
    onFinish: async ({ text }) => {
      // Save Assistant Message
      await db.insert(anonymousMessages).values({
        ipAddress: ip,
        role: 'assistant',
        content: text,
      });

      // Increment Count
      await db
        .update(anonymousUsers)
        .set({ interactionCount: (user?.interactionCount || 0) + 1 })
        .where(eq(anonymousUsers.ipAddress, ip));
    },
  });

  return result.toTextStreamResponse();
}
