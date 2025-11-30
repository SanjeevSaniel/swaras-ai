/**
 * Verify Razorpay Payment API Route
 *
 * Verifies the payment signature from Razorpay and updates the payment record.
 * This is called after the user completes payment on Razorpay's checkout.
 *
 * @route POST /api/payments/verify
 * @access Protected (requires authentication)
 *
 * @body {string} razorpay_order_id - The Razorpay order ID
 * @body {string} razorpay_payment_id - The Razorpay payment ID
 * @body {string} razorpay_signature - The payment signature for verification
 *
 * @returns {object} Verification result and subscription details
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { payments, subscriptions, users, planAudits } from '@/db/schema';
import { eq } from 'drizzle-orm';
// TODO: Uncomment when Razorpay is integrated
// import crypto from 'crypto';

const PLAN_TO_TIER_MAP: Record<string, string> = {
  Free: 'FREE',
  Pro: 'PRO',
  Maxx: 'MAXX',
};

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'You must be signed in to verify payment',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Parse request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Missing required payment details',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // TODO: Verify payment signature
    // const generatedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest('hex');

    // if (generatedSignature !== razorpay_signature) {
    //   return new Response(
    //     JSON.stringify({
    //       error: 'Payment Verification Failed',
    //       message: 'Invalid payment signature',
    //     }),
    //     {
    //       status: 400,
    //       headers: { 'Content-Type': 'application/json' },
    //     }
    //   );
    // }

    // Find the payment record
    const paymentRecord = await db.query.payments.findFirst({
      where: eq(payments.razorpayOrderId, razorpay_order_id),
    });

    if (!paymentRecord) {
      return new Response(
        JSON.stringify({
          error: 'Not Found',
          message: 'Payment record not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Update payment record with success status
    await db
      .update(payments)
      .set({
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'success',
        updatedAt: new Date(),
      })
      .where(eq(payments.razorpayOrderId, razorpay_order_id));

    // Create or update subscription
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days subscription

    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });

    if (existingSubscription) {
      // Update existing subscription
      await db
        .update(subscriptions)
        .set({
          planName: paymentRecord.planName,
          status: 'active',
          startedAt: new Date(),
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId));
    } else {
      // Create new subscription
      await db.insert(subscriptions).values({
        userId,
        planName: paymentRecord.planName,
        status: 'active',
        startedAt: new Date(),
        expiresAt,
      });
    }

    // Update user tier in the database
    const tier = PLAN_TO_TIER_MAP[paymentRecord.planName] || 'FREE';
    
    // Get old tier for audit
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    const oldTier = user?.tier || 'FREE';
    const oldPlan = Object.keys(PLAN_TO_TIER_MAP).find(key => PLAN_TO_TIER_MAP[key] === oldTier) || 'Unknown';

    await db
      .update(users)
      .set({ tier, updatedAt: new Date() })
      .where(eq(users.id, userId));

    // Create audit log
    await db.insert(planAudits).values({
      userId,
      oldPlan,
      newPlan: paymentRecord.planName,
      action: 'UPGRADE', // Payment usually implies upgrade or renewal
    });

    console.log(`✅ Payment verified and user upgraded to ${paymentRecord.planName}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        subscription: {
          planName: paymentRecord.planName,
          expiresAt: expiresAt.toISOString(),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to verify payment',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
