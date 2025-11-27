// src/lib/rate-limiter-db.ts - Rate limiting service using Neon database with Drizzle ORM
// Tracks daily message limits per user stored in database instead of Clerk metadata

import { db, users, rateLimits } from '@/db';
import { eq, sql } from 'drizzle-orm';

/**
 * Rate limit tiers configuration
 * Adjust these values based on your business needs
 */
export const RATE_LIMIT_TIERS = {
  FREE: {
    name: 'Free',
    dailyLimit: 10,
    resetHour: 0, // Resets at midnight IST (UTC+5:30)
  },
  PRO: {
    name: 'Pro',
    dailyLimit: 100,
    resetHour: 0,
  },
  MAXX: {
    name: 'Maxx',
    // dailyLimit: Number.MAX_SAFE_INTEGER,
    dailyLimit: 1000,
    resetHour: 0,
  },
};

/**
 * Get user's rate limit tier from database
 */
export async function getUserTier(userId: string) {
  try {
    const [user] = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return RATE_LIMIT_TIERS.FREE;
    }

    const tierKey = user.tier as keyof typeof RATE_LIMIT_TIERS;
    return RATE_LIMIT_TIERS[tierKey] || RATE_LIMIT_TIERS.FREE;
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return RATE_LIMIT_TIERS.FREE;
  }
}

/**
 * Get the start of today in IST (UTC+5:30)
 */
function getTodayStart() {
  const now = new Date();
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

  // Convert current time to IST
  const istTime = new Date(now.getTime() + IST_OFFSET);

  // Get the start of day in IST (midnight)
  const istMidnight = new Date(
    Date.UTC(
      istTime.getUTCFullYear(),
      istTime.getUTCMonth(),
      istTime.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );

  // Convert back to UTC timestamp by subtracting IST offset
  return istMidnight.getTime() - IST_OFFSET;
}

/**
 * Get the next midnight in IST (when the limit will reset)
 */
function getNextMidnightIST() {
  const now = new Date();
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

  // Convert current time to IST
  const istTime = new Date(now.getTime() + IST_OFFSET);

  // Get tomorrow's midnight in IST
  const nextIstMidnight = new Date(
    Date.UTC(
      istTime.getUTCFullYear(),
      istTime.getUTCMonth(),
      istTime.getUTCDate() + 1, // Next day
      0,
      0,
      0,
      0,
    ),
  );

  // Convert back to UTC timestamp by subtracting IST offset
  return nextIstMidnight.getTime() - IST_OFFSET;
}

/**
 * Check if the usage data needs to be reset (new day)
 */
function shouldResetUsage(lastResetTimestamp: number) {
  const todayStart = getTodayStart();
  return !lastResetTimestamp || lastResetTimestamp < todayStart;
}

/**
 * Get user's current usage from database
 */
export async function getUserUsage(userId: string) {
  try {
    // Get or create rate limit record
    let [rateLimit] = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.userId, userId));

    if (!rateLimit) {
      // Check if user exists in users table
      const [userExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId));

      if (!userExists) {
        // User doesn't exist in database yet, return default values
        console.warn(`User ${userId} not found in database, returning default usage`);
        return {
          count: 0,
          lastResetTimestamp: getTodayStart(),
        };
      }

      // Create new rate limit record
      [rateLimit] = await db
        .insert(rateLimits)
        .values({
          userId,
          messageCount: 0,
          lastResetAt: new Date(getTodayStart()),
        })
        .returning();
    }

    // Check if we need to reset for a new day
    if (shouldResetUsage(rateLimit.lastResetAt.getTime())) {
      [rateLimit] = await db
        .update(rateLimits)
        .set({
          messageCount: 0,
          lastResetAt: new Date(getTodayStart()),
          updatedAt: new Date(),
        })
        .where(eq(rateLimits.userId, userId))
        .returning();
    }

    return {
      count: rateLimit.messageCount,
      lastResetTimestamp: rateLimit.lastResetAt.getTime(),
    };
  } catch (error) {
    console.error('Error fetching user usage:', error);
    return {
      count: 0,
      lastResetTimestamp: getTodayStart(),
    };
  }
}

/**
 * Update user's usage count in database
 */
export async function updateUserUsage(userId: string, newCount: number) {
  try {
    await db
      .update(rateLimits)
      .set({
        messageCount: newCount,
        lastResetAt: new Date(getTodayStart()),
        updatedAt: new Date(),
      })
      .where(eq(rateLimits.userId, userId));

    return true;
  } catch (error) {
    console.error('Error updating user usage:', error);
    return false;
  }
}

/**
 * Check if user has exceeded their rate limit
 * Returns { allowed: boolean, usage: object, limit: object }
 */
export async function checkRateLimit(userId: string) {
  try {
    // Get user's tier and current usage
    const tier = await getUserTier(userId);
    const usage = await getUserUsage(userId);

    // Check if limit is exceeded
    const allowed = usage.count < tier.dailyLimit;
    const remaining = Math.max(0, tier.dailyLimit - usage.count);

    return {
      allowed,
      usage: {
        current: usage.count,
        limit: tier.dailyLimit,
        remaining,
        resetAt: new Date(getNextMidnightIST()).toISOString(),
      },
      tier: tier.name,
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // On error, allow the request but log it
    return {
      allowed: true,
      usage: {
        current: 0,
        limit: RATE_LIMIT_TIERS.FREE.dailyLimit,
        remaining: RATE_LIMIT_TIERS.FREE.dailyLimit,
        resetAt: new Date(getNextMidnightIST()).toISOString(),
      },
      tier: 'FREE',
      error: true,
    };
  }
}

/**
 * Increment user's usage count
 * Call this after successfully processing a request
 */
export async function incrementUsage(userId: string) {
  try {
    const usage = await getUserUsage(userId);
    const newCount = usage.count + 1;
    await updateUserUsage(userId, newCount);
    return newCount;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return null;
  }
}

/**
 * Get user's usage statistics for display
 */
export async function getUserStats(userId: string) {
  const tier = await getUserTier(userId);
  const usage = await getUserUsage(userId);

  return {
    tier: tier.name,
    used: usage.count,
    limit: tier.dailyLimit,
    remaining: Math.max(0, tier.dailyLimit - usage.count),
    percentage: Math.min(100, (usage.count / tier.dailyLimit) * 100),
    resetAt: new Date(getNextMidnightIST()).toISOString(),
  };
}

/**
 * Sync user to database (called from Clerk webhook)
 */
export async function syncUserToDatabase(
  userId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  tier: string = 'FREE',
) {
  try {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser) {
      // Update existing user
      await db
        .update(users)
        .set({
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl || null,
          tier,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      // Insert new user
      await db.insert(users).values({
        id: userId,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        tier,
      });
    }

    return true;
  } catch (error) {
    console.error('Error syncing user to database:', error);
    return false;
  }
}

/**
 * Delete user from database (called from Clerk webhook)
 */
export async function deleteUserFromDatabase(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error('Error deleting user from database:', error);
    return false;
  }
}
