// src/lib/rate-limiter-neon.js - New rate limiting using Neon DB
// This replaces the old Clerk metadata-based rate limiter

import {
  getUserUsageStats,
  checkUserRateLimit,
  incrementUserUsage,
} from '@/app/actions';

/**
 * Rate limit tiers configuration (now managed in database)
 * This is kept for reference only - actual limits come from database
 */
export const RATE_LIMIT_TIERS = {
  FREE: {
    name: 'Free',
    dailyLimit: 10,
  },
  PRO: {
    name: 'Pro',
    dailyLimit: 200,
  },
  UNLIMITED: {
    name: 'Unlimited',
    dailyLimit: 999999,
  },
};

/**
 * Get user's usage statistics for display
 */
export async function getUserStats(clerkUserId: string) {
  try {
    const stats = await getUserUsageStats(clerkUserId);
    return stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return default stats on error
    return {
      tier: 'Free',
      used: 0,
      limit: 10,
      remaining: 10,
      percentage: 0,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}

/**
 * Check if user has exceeded their rate limit
 * Returns { allowed: boolean, usage: object, tier: string }
 */
export async function checkRateLimit(clerkUserId: string) {
  try {
    const result = await checkUserRateLimit(clerkUserId);
    return result;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // On error, allow the request but log it
    return {
      allowed: true,
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

/**
 * Increment user's usage count
 * Call this after successfully processing a request
 */
export async function incrementUsage(clerkUserId: string) {
  try {
    const newCount = await incrementUserUsage(clerkUserId);
    return newCount;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return null;
  }
}

// Export old functions for backward compatibility
export { getUserUsageStats as getUserUsage };
