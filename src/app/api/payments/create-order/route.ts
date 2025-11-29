/**
 * Create Razorpay Order API Route
 *
 * Creates a new Razorpay order and payment record in the database.
 * This is the first step in the payment flow.
 *
 * @route POST /api/payments/create-order
 * @access Protected (requires authentication)
 *
 * @body {string} planName - The plan tier ('Pro' or 'Maxx')
 * @body {number} amount - The plan amount in rupees
 *
 * @returns {object} Razorpay order details
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/payments/create-order', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ planName: 'Pro', amount: 499 }),
 * });
 * const { orderId, amount, currency } = await response.json();
 * ```
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { payments } from '@/db/schema';

// TODO: Uncomment when Razorpay is integrated
// import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'You must be signed in to create an order',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Parse request body
    const { planName, amount } = await req.json();

    // Validate input
    if (!planName || !amount) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Plan name and amount are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // TODO: Initialize Razorpay instance
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID!,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
    // });

    // Calculate amount in paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // TODO: Create Razorpay order
    // const order = await razorpay.orders.create({
    //   amount: amountInPaise,
    //   currency: 'INR',
    //   receipt: `receipt_${Date.now()}`,
    //   notes: {
    //     planName,
    //     userId,
    //   },
    // });

    // Placeholder order ID for development
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create payment record in database
    await db.insert(payments).values({
      userId,
      razorpayOrderId: orderId,
      amount: amount.toString(),
      currency: 'INR',
      status: 'pending',
      planName,
    });

    // Return order details
    return new Response(
      JSON.stringify({
        orderId,
        amount: amountInPaise,
        currency: 'INR',
        planName,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to create order',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
