// src/app/api/messages/route.ts - API routes for message persistence
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  saveConversation,
  saveMessage,
  getUserConversations,
  getConversationMessages,
  getConversationByUserAndPersona,
  getFullConversation,
  syncConversation,
  deleteConversation,
} from '@/lib/message-persistence';

/**
 * GET /api/messages - Get conversations or messages
 * Query params:
 * - conversationId: Get messages for a specific conversation
 * - personaId: Get conversation for a specific persona
 * - (none): Get all user conversations
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const personaId = searchParams.get('personaId');

    // Get messages for a specific conversation
    if (conversationId) {
      const messages = await getConversationMessages(conversationId);
      return NextResponse.json({ messages });
    }

    // Get conversation for a specific persona
    if (personaId) {
      const conversation = await getConversationByUserAndPersona(userId, personaId);

      if (conversation) {
        const messages = await getConversationMessages(conversation.id);
        return NextResponse.json({
          conversation: {
            ...conversation,
            messages,
          },
        });
      }

      return NextResponse.json({ conversation: null });
    }

    // Get all conversations
    const conversations = await getUserConversations(userId);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages - Save or sync conversation with messages
 * Body: {
 *   conversationId: string,
 *   personaId: string,
 *   messages: Array<{ id: string, role: string, content: string }>,
 *   title?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, personaId, messages, title } = body;

    if (!conversationId || !personaId || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sync conversation and messages
    await syncConversation(userId, personaId, conversationId, messages, title);

    return NextResponse.json({
      success: true,
      message: 'Conversation synced successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages - Delete a conversation
 * Query params:
 * - conversationId: ID of conversation to delete
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversationId' },
        { status: 400 }
      );
    }

    await deleteConversation(conversationId);

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/messages:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
