// src/services/memory-service.ts
import MemoryClient from 'mem0ai';

const isDev = process.env.NODE_ENV === 'development';
const logger = {
  log: (...args: any) => isDev && console.log(...args),
  error: (...args: any) => isDev && console.error(...args),
};

// Initialize Mem0 client
const memoryClient = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY || '',
});

export interface MemoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MemorySearchResult {
  id: string;
  memory: string;
  score: number;
  metadata?: Record<string, any>;
}

/**
 * Add memories from a conversation turn
 * @param userId - Clerk user ID
 * @param personaId - Persona identifier (e.g., 'hitesh', 'piyush')
 * @param messages - Array of user/assistant messages
 * @param includeResponse - Whether to include AI response (for post-stream storage)
 */
export async function addMemory(
  userId: string,
  personaId: string,
  messages: MemoryMessage[],
  includeResponse?: string,
): Promise<void> {
  try {
    logger.log(`💾 Storing memory for user=${userId}, persona=${personaId}`);

    // If we have a response, add it to the messages for better context
    const messagesToStore = includeResponse
      ? [...messages, { role: 'assistant' as const, content: includeResponse }]
      : messages;

    await memoryClient.add(messagesToStore, {
      user_id: userId,
      metadata: {
        persona: personaId,
        timestamp: new Date().toISOString(),
        messageCount: messagesToStore.length,
      },
    });

    logger.log('✅ Memory stored successfully');
  } catch (error) {
    logger.error('❌ Failed to store memory:', error);
    // Don't throw - memory storage failure shouldn't break the chat
  }
}

/**
 * Search for relevant memories
 * @param userId - Clerk user ID
 * @param personaId - Persona identifier
 * @param query - Search query (usually the user's latest message)
 * @param limit - Maximum number of results (default: 5)
 */
export async function searchMemories(
  userId: string,
  personaId: string,
  query: string,
  limit: number = 5,
): Promise<MemorySearchResult[]> {
  try {
    logger.log(
      `🔍 Searching memories for user=${userId}, persona=${personaId}`,
    );

    const filters = {
      AND: [{ user_id: userId }, { 'metadata.persona': personaId }],
    };

    const results: any = await memoryClient.search(query, {
      api_version: 'v2',
      filters: filters,
      limit: limit,
    });

    logger.log(`✅ Found ${results?.length || 0} relevant memories`);

    // Map the Mem0 response to our interface
    return (results || []).map((r: any) => ({
      id: r.id || '',
      memory: r.memory || '',
      score: r.score || 0,
      metadata: r.metadata,
    }));
  } catch (error) {
    logger.error('❌ Failed to search memories:', error);
    return []; // Return empty array on failure
  }
}

/**
 * Get formatted memory context for injection into system prompt
 * @param userId - Clerk user ID
 * @param personaId - Persona identifier
 * @param query - Search query
 */
export async function getMemoryContext(
  userId: string,
  personaId: string,
  query: string,
): Promise<string> {
  const memories = await searchMemories(userId, personaId, query, 5);

  if (memories.length === 0) {
    return '';
  }

  // Format memories for injection
  const memoryText = memories
    .map((m, idx) => `${idx + 1}. ${m.memory}`)
    .join('\n');

  return `\n\n## Context from Previous Conversations:\n${memoryText}\n`;
}
