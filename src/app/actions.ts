// src/app/actions.ts
"use server";

import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL!);

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function createOrUpdateUser(clerkUserId: string, email: string, firstName?: string, lastName?: string) {
  try {
    const result = await sql`
      INSERT INTO users (clerk_user_id, email, first_name, last_name)
      VALUES (${clerkUserId}, ${email}, ${firstName || ''}, ${lastName || ''})
      ON CONFLICT (clerk_user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserByClerkId(clerkUserId: string) {
  try {
    const result = await sql`
      SELECT
        u.*,
        t.name as tier_name,
        t.display_name as tier_display_name,
        t.daily_message_limit,
        t.monthly_price
      FROM users u
      LEFT JOIN tier_plans t ON u.tier_plan_id = t.id
      WHERE u.clerk_user_id = ${clerkUserId}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

export async function getUserUsageStats(clerkUserId: string) {
  try {
    const user = await getUserByClerkId(clerkUserId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if we need to reset the counter (new day in IST)
    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + IST_OFFSET);
    const istToday = new Date(Date.UTC(istTime.getUTCFullYear(), istTime.getUTCMonth(), istTime.getUTCDate()));
    const istTodayString = istToday.toISOString().split('T')[0];

    const lastResetDate = user.last_reset_date;
    const needsReset = lastResetDate !== istTodayString;

    if (needsReset) {
      // Reset the counter
      await sql`
        UPDATE users
        SET daily_message_count = 0,
            last_reset_date = ${istTodayString}
        WHERE clerk_user_id = ${clerkUserId}
      `;
      user.daily_message_count = 0;
    }

    const remaining = Math.max(0, user.daily_message_limit - user.daily_message_count);
    const percentage = Math.min(100, (user.daily_message_count / user.daily_message_limit) * 100);

    // Calculate reset time (next midnight IST)
    const nextMidnightIST = new Date(istToday.getTime() + 24 * 60 * 60 * 1000 - IST_OFFSET);

    return {
      tier: user.tier_display_name || 'Free',
      used: user.daily_message_count,
      limit: user.daily_message_limit,
      remaining,
      percentage,
      resetAt: nextMidnightIST.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    throw error;
  }
}

export async function checkUserRateLimit(clerkUserId: string) {
  try {
    const stats = await getUserUsageStats(clerkUserId);

    return {
      allowed: stats.remaining > 0,
      usage: {
        current: stats.used,
        limit: stats.limit,
        remaining: stats.remaining,
        resetAt: stats.resetAt,
      },
      tier: stats.tier,
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return {
      allowed: true, // Allow on error
      usage: {
        current: 0,
        limit: 10,
        remaining: 10,
        resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      tier: 'Free',
      error: true,
    };
  }
}

export async function incrementUserUsage(clerkUserId: string) {
  try {
    const result = await sql`
      UPDATE users
      SET
        daily_message_count = daily_message_count + 1,
        total_messages_sent = total_messages_sent + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE clerk_user_id = ${clerkUserId}
      RETURNING daily_message_count
    `;
    return result[0]?.daily_message_count || 0;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }
}

// ============================================================================
// TIER MANAGEMENT
// ============================================================================

export async function getAllTierPlans() {
  try {
    const result = await sql`
      SELECT * FROM tier_plans
      WHERE is_active = true
      ORDER BY monthly_price ASC
    `;
    return result;
  } catch (error) {
    console.error('Error fetching tier plans:', error);
    throw error;
  }
}

export async function updateUserTier(clerkUserId: string, tierName: string) {
  try {
    const result = await sql`
      UPDATE users
      SET tier_plan_id = (SELECT id FROM tier_plans WHERE name = ${tierName})
      WHERE clerk_user_id = ${clerkUserId}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating user tier:', error);
    throw error;
  }
}

// ============================================================================
// PERSONA MANAGEMENT
// ============================================================================

export async function getAllPersonas() {
  try {
    const result = await sql`
      SELECT * FROM personas
      WHERE is_enabled = true
      ORDER BY sort_order ASC, name ASC
    `;
    return result;
  } catch (error) {
    console.error('Error fetching personas:', error);
    throw error;
  }
}

export async function getPersonaByKey(personaKey: string) {
  try {
    const result = await sql`
      SELECT * FROM personas
      WHERE persona_key = ${personaKey} AND is_enabled = true
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching persona:', error);
    throw error;
  }
}

export async function createPersona(data: {
  persona_key: string;
  name: string;
  title?: string;
  avatar_url?: string;
  description?: string;
  system_prompt: string;
  specialty?: string;
  greeting_message?: string;
  sort_order?: number;
  metadata?: any;
}) {
  try {
    const result = await sql`
      INSERT INTO personas (
        persona_key, name, title, avatar_url, description,
        system_prompt, specialty, greeting_message, sort_order, metadata
      )
      VALUES (
        ${data.persona_key},
        ${data.name},
        ${data.title || ''},
        ${data.avatar_url || ''},
        ${data.description || ''},
        ${data.system_prompt},
        ${data.specialty || ''},
        ${data.greeting_message || ''},
        ${data.sort_order || 0},
        ${JSON.stringify(data.metadata || {})}::jsonb
      )
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating persona:', error);
    throw error;
  }
}

export async function updatePersona(personaKey: string, data: any) {
  try {
    const result = await sql`
      UPDATE personas
      SET
        name = COALESCE(${data.name}, name),
        title = COALESCE(${data.title}, title),
        avatar_url = COALESCE(${data.avatar_url}, avatar_url),
        description = COALESCE(${data.description}, description),
        system_prompt = COALESCE(${data.system_prompt}, system_prompt),
        specialty = COALESCE(${data.specialty}, specialty),
        greeting_message = COALESCE(${data.greeting_message}, greeting_message),
        sort_order = COALESCE(${data.sort_order}, sort_order),
        is_enabled = COALESCE(${data.is_enabled}, is_enabled),
        metadata = COALESCE(${data.metadata ? JSON.stringify(data.metadata) : null}::jsonb, metadata),
        updated_at = CURRENT_TIMESTAMP
      WHERE persona_key = ${personaKey}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating persona:', error);
    throw error;
  }
}

// ============================================================================
// CONVERSATION MANAGEMENT
// ============================================================================

export async function saveConversation(
  clerkUserId: string,
  personaKey: string,
  conversationData: any
) {
  try {
    // Get user and persona IDs
    const user = await getUserByClerkId(clerkUserId);
    const persona = await getPersonaByKey(personaKey);

    if (!user || !persona) {
      throw new Error('User or persona not found');
    }

    const messageCount = conversationData.messages?.length || 0;

    const result = await sql`
      INSERT INTO user_conversations (
        user_id, persona_id, conversation_data, message_count, last_message_at
      )
      VALUES (
        ${user.id},
        ${persona.id},
        ${JSON.stringify(conversationData)}::jsonb,
        ${messageCount},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id, persona_id)
      DO UPDATE SET
        conversation_data = EXCLUDED.conversation_data,
        message_count = EXCLUDED.message_count,
        last_message_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

export async function getUserConversations(clerkUserId: string) {
  try {
    const user = await getUserByClerkId(clerkUserId);

    if (!user) {
      return [];
    }

    const result = await sql`
      SELECT
        uc.*,
        p.persona_key,
        p.name as persona_name,
        p.avatar_url as persona_avatar
      FROM user_conversations uc
      JOIN personas p ON uc.persona_id = p.id
      WHERE uc.user_id = ${user.id}
      ORDER BY uc.last_message_at DESC
    `;
    return result;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

// ============================================================================
// USAGE LOGGING
// ============================================================================

export async function logMessageUsage(
  clerkUserId: string,
  personaKey: string,
  messageContent: string,
  responseContent: string,
  tokensUsed: number = 0
) {
  try {
    const user = await getUserByClerkId(clerkUserId);
    const persona = await getPersonaByKey(personaKey);

    if (!user) {
      throw new Error('User not found');
    }

    await sql`
      INSERT INTO usage_logs (
        user_id, persona_id, message_content, response_content, tokens_used
      )
      VALUES (
        ${user.id},
        ${persona?.id || null},
        ${messageContent},
        ${responseContent},
        ${tokensUsed}
      )
    `;
  } catch (error) {
    console.error('Error logging usage:', error);
    // Don't throw - logging should not break the app
  }
}

// ============================================================================
// ADMIN ACTIONS
// ============================================================================

export async function getUsersAnalytics() {
  try {
    const { userId } = await auth();

    // TODO: Add admin check here
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const result = await sql`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN tier_plan_id = 1 THEN 1 END) as free_users,
        COUNT(CASE WHEN tier_plan_id = 2 THEN 1 END) as pro_users,
        COUNT(CASE WHEN tier_plan_id = 3 THEN 1 END) as unlimited_users,
        SUM(daily_message_count) as total_daily_messages,
        SUM(total_messages_sent) as total_all_time_messages
      FROM users
    `;
    return result[0];
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}
