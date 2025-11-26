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
    resetHour: 0, // Resets at midnight UTC
  },
  PRO: {
    name: 'Pro',
    dailyLimit: 200,
    resetHour: 0,
  },
  UNLIMITED: {
    name: 'Unlimited',
    dailyLimit: Number.MAX_SAFE_INTEGER,
    resetHour: 0,
  },
};

/**
 * Get user's rate limit tier
 * Can be extended to check user metadata for subscription tier
 */
export function getUserTier(userId, userMetadata = {}) {
  // Check user's public metadata for tier (set via Clerk dashboard or API)
  const tier = userMetadata?.rateLimitTier || 'FREE';
  return RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS.FREE;
}

/**
 * Get the start of today in UTC
 */
function getTodayStart() {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return today.getTime();
}

/**
 * Check if the usage data needs to be reset (new day)
 */
function shouldResetUsage(lastResetTimestamp) {
  const todayStart = getTodayStart();
  return !lastResetTimestamp || lastResetTimestamp < todayStart;
}

/**
 * Get user's current usage from Clerk metadata
 */
export async function getUserUsage(userId) {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Get usage data from private metadata
    const usage = user.privateMetadata?.rateLimit || {
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
export async function updateUserUsage(userId, newCount) {
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
export async function checkRateLimit(userId, userMetadata = {}) {
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
        resetAt: new Date(usage.lastResetTimestamp + 24 * 60 * 60 * 1000).toISOString(),
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
        resetAt: new Date(getTodayStart() + 24 * 60 * 60 * 1000).toISOString(),
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
export async function incrementUsage(userId) {
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
export async function getUserStats(userId, userMetadata = {}) {
  const tier = getUserTier(userId, userMetadata);
  const usage = await getUserUsage(userId);

  return {
    tier: tier.name,
    used: usage.count,
    limit: tier.dailyLimit,
    remaining: Math.max(0, tier.dailyLimit - usage.count),
    percentage: Math.min(100, (usage.count / tier.dailyLimit) * 100),
    resetAt: new Date(usage.lastResetTimestamp + 24 * 60 * 60 * 1000).toISOString(),
  };
}
