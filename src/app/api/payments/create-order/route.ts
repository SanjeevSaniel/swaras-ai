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
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { payments, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    // Calculate amount in paise (Razorpay uses smallest currency unit)
    let finalAmount = amount;
    let discount = 0;

    // Check for existing active subscription to calculate proration
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });

    if (existingSubscription && existingSubscription.status === 'active' && existingSubscription.expiresAt && existingSubscription.planName !== 'Free') {
      const now = new Date();
      const expiresAt = new Date(existingSubscription.expiresAt);
      
      if (expiresAt > now) {
        const totalDays = 30; // Assuming 30 day cycle
        const remainingTime = expiresAt.getTime() - now.getTime();
        const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        
        // Calculate daily rate of old plan
        // We need to know the price of the old plan. 
        // For simplicity, we'll hardcode prices here or fetch from a config.
        // Ideally this should be in a shared config.
        const PLAN_PRICES: Record<string, number> = {
          'Pro': 499,
          'Maxx': 999
        };
        
        const oldPrice = PLAN_PRICES[existingSubscription.planName] || 0;
        const dailyRate = oldPrice / totalDays;
        const remainingValue = dailyRate * remainingDays;
        
        // Only apply proration if upgrading (new price > old price)
        // Or if we want to support cross-grade with credit.
        // For now, let's just deduct remaining value from new amount.
        
        if (remainingValue > 0) {
          discount = Math.round(remainingValue);
          finalAmount = Math.max(0, amount - discount);
        }
      }
    }

    const amountInPaise = Math.round(finalAmount * 100);

    // TODO: Initialize Razorpay instance
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID!,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
    // });

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
      amount: finalAmount.toString(),
      currency: 'INR',
      status: 'pending',
      planName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return order details
    return new Response(
      JSON.stringify({
        orderId,
        amount: amountInPaise,
        currency: 'INR',
        planName,
        originalAmount: amount,
        discount,
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
