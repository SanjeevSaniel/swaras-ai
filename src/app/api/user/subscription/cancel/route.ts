/**
 * Cancel Subscription API Route
 * 
 * Cancels the user's current active subscription.
 * Sets status to 'cancelled' but keeps expiry date so user retains access until end of period.
 * 
 * @route POST /api/user/subscription/cancel
 * @access Protected (requires authentication)
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { subscriptions, planAudits } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
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
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update subscription status
    await db
      .update(subscriptions)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId));

    // Log audit
    await db.insert(planAudits).values({
      userId,
      oldPlan: subscription.planName,
      newPlan: subscription.planName,
      action: 'CANCEL',
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription cancelled successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
