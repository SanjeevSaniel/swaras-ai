/**
 * Get User Subscription API Route
 * 
 * Fetches the user's current active subscription details.
 * 
 * @route GET /api/user/subscription
 * @access Protected (requires authentication)
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });

    if (!subscription) {
      return new Response(
        JSON.stringify({ 
          planName: 'Free',
          status: 'active',
          expiresAt: null,
          nextBillingDate: null
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ...subscription,
        nextBillingDate: subscription.expiresAt
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
