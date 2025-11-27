// src/lib/rate-limiter.js - Rate limiting service for user accounts
// Tracks daily message limits per user to prevent abuse

import { clerkClient } from '@clerk/nextjs/server';

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
    dailyLimit: 200,
    resetHour: 0,
  },
  MAXX: {
    name: 'Maxx',
    dailyLimit: 1000,
    resetHour: 0,
  },
};

/**
 * Get user's rate limit tier
 * Can be extended to check user metadata for subscription tier
 */
export function getUserTier(userId: string, userMetadata: Record<string, any> = {}) {
  // Check user's public metadata for tier (set via Clerk dashboard or API)
  const tier = userMetadata?.rateLimitTier || 'FREE';
  return RATE_LIMIT_TIERS[tier as keyof typeof RATE_LIMIT_TIERS] || RATE_LIMIT_TIERS.FREE;
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
function shouldResetUsage(lastResetTimestamp: number | undefined): boolean {
  const todayStart = getTodayStart();
  return !lastResetTimestamp || lastResetTimestamp < todayStart;
}

/**
 * Get user's current usage from Clerk metadata
 */
export async function getUserUsage(userId: string): Promise<{ count: number; lastResetTimestamp: number }> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Get usage data from private metadata
    const usage: any = user.privateMetadata?.rateLimit || {
      count: 0,
      lastResetTimestamp: getTodayStart(),
    };

    // Reset if it's a new day
    if (shouldResetUsage(usage.lastResetTimestamp)) {
      return {
        count: 0,
        lastResetTimestamp: getTodayStart(),
      };
    }

    return usage;
  } catch (error) {
    console.error('Error fetching user usage:', error);
    // Return default usage on error
    return {
      count: 0,
      lastResetTimestamp: getTodayStart(),
    };
  }
}

/**
 * Update user's usage count in Clerk metadata
 */
export async function updateUserUsage(userId: string, newCount: number): Promise<boolean> {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        rateLimit: {
          count: newCount,
          lastResetTimestamp: getTodayStart(),
        },
      },
    });
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
export async function checkRateLimit(userId: string, userMetadata: Record<string, any> = {}) {
  try {
    // Get user's tier and current usage
    const tier = getUserTier(userId, userMetadata);
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
export async function incrementUsage(userId: string): Promise<number | null> {
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
export async function getUserStats(userId: string, userMetadata: Record<string, any> = {}) {
  const tier = getUserTier(userId, userMetadata);
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
