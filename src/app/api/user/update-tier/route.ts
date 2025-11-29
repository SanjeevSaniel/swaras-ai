/**
 * Update User Tier API Route
 *
 * Updates the user's tier in the database based on their subscription plan.
 * This endpoint is called after successful payment verification to upgrade/downgrade the user.
 *
 * @route POST /api/user/update-tier
 * @access Protected (requires authentication)
 *
 * @body {string} planName - The plan name ('Free', 'Pro', 'Maxx')
 *
 * @returns {object} Updated user tier information
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const PLAN_TO_TIER_MAP: Record<string, string> = {
  Free: 'FREE',
  Pro: 'PRO',
  Maxx: 'MAXX',
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'You must be signed in to update tier',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { planName } = await req.json();

    if (!planName || !PLAN_TO_TIER_MAP[planName]) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid plan name. Must be one of: Free, Pro, Maxx',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const tier = PLAN_TO_TIER_MAP[planName];

    const [updatedUser] = await db
      .update(users)
      .set({ tier, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({ id: users.id, tier: users.tier, email: users.email });

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          error: 'Not Found',
          message: 'User not found in database. Please refresh and try again.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    console.log(
      `✅ Updated user ${userId} tier to ${tier} (plan: ${planName})`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        tier: updatedUser.tier,
        planName,
        message: `Successfully updated to ${planName} plan`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error updating user tier:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to update user tier',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
