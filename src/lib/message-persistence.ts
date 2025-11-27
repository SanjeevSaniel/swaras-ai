// src/lib/message-persistence.ts - Service for persisting chat messages to Neon DB
import { db, conversations, messages, type NewConversation, type NewMessage } from '@/db';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Save a new conversation to the database
 */
export async function saveConversation(
  userId: string,
  personaId: string,
  conversationId: string,
  title?: string
): Promise<void> {
  try {
    const newConversation: NewConversation = {
      id: conversationId,
      userId,
      personaId,
      title: title || `Chat with ${personaId}`,
    };

    await db.insert(conversations).values(newConversation);
    console.log(`✅ Saved conversation ${conversationId} to database`);
  } catch (error) {
    console.error('Failed to save conversation:', error);
    throw error;
  }
}

/**
 * Save a message to the database
 */
export async function saveMessage(
  conversationId: string,
  messageId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  try {
    const newMessage: NewMessage = {
      id: messageId,
      conversationId,
      role,
      content,
    };

    await db.insert(messages).values(newMessage);
    console.log(`✅ Saved message ${messageId} to database`);
  } catch (error) {
    console.error('Failed to save message:', error);
    throw error;
  }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string) {
  try {
    const userConversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));

    return userConversations;
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    throw error;
  }
}

/**
 * Get all messages for a conversation
 */
export async function getConversationMessages(conversationId: string) {
  try {
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return conversationMessages;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
}

/**
 * Get conversation by user and persona
 */
export async function getConversationByUserAndPersona(
  userId: string,
  personaId: string
) {
  try {
    const result = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.userId, userId),
          eq(conversations.personaId, personaId)
        )
      )
      .orderBy(desc(conversations.updatedAt))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Failed to fetch conversation by user and persona:', error);
    throw error;
  }
}

/**
 * Update conversation timestamp
 */
export async function updateConversationTimestamp(conversationId: string) {
  try {
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    console.log(`✅ Updated conversation ${conversationId} timestamp`);
  } catch (error) {
    console.error('Failed to update conversation timestamp:', error);
    throw error;
  }
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(conversationId: string) {
  try {
    // Messages will be cascade deleted due to foreign key constraint
    await db
      .delete(conversations)
      .where(eq(conversations.id, conversationId));

    console.log(`✅ Deleted conversation ${conversationId} from database`);
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    throw error;
  }
}

/**
 * Get conversation with all messages
 */
export async function getFullConversation(conversationId: string) {
  try {
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation[0]) {
      return null;
    }

    const conversationMessages = await getConversationMessages(conversationId);

    return {
      ...conversation[0],
      messages: conversationMessages,
    };
  } catch (error) {
    console.error('Failed to fetch full conversation:', error);
    throw error;
  }
}

/**
 * Sync conversation data (save or update)
 */
export async function syncConversation(
  userId: string,
  personaId: string,
  conversationId: string,
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>,
  title?: string
) {
  try {
    // Check if conversation exists
    const existing = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!existing[0]) {
      // Create new conversation
      await saveConversation(userId, personaId, conversationId, title);
    } else {
      // Update timestamp
      await updateConversationTimestamp(conversationId);
    }

    // Get existing messages
    const existingMessages = await getConversationMessages(conversationId);
    const existingIds = new Set(existingMessages.map((m) => m.id));

    // Save only new messages
    for (const msg of messages) {
      if (!existingIds.has(msg.id)) {
        await saveMessage(conversationId, msg.id, msg.role, msg.content);
      }
    }

    console.log(`✅ Synced conversation ${conversationId} with ${messages.length} messages`);
  } catch (error) {
    console.error('Failed to sync conversation:', error);
    throw error;
  }
}
