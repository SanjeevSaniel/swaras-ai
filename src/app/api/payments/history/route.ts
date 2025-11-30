/**
 * Payment History API Route
 *
 * Fetches the payment history for the authenticated user.
 * Returns a list of all payments made by the user, sorted by date (newest first).
 *
 * @route GET /api/payments/history
 * @access Protected (requires authentication)
 *
 * @returns {Payment[]} Array of payment records
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/payments/history');
 * const payments = await response.json();
 * ```
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { payments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'You must be signed in to view payment history',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Fetch payment history from database
    const paymentHistory = await db
      .select({
        id: payments.id,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        paymentMethod: payments.paymentMethod,
        planName: payments.planName,
        razorpayPaymentId: payments.razorpayPaymentId,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));

    // Format the response
    const formattedPayments = paymentHistory.map((payment) => ({
      id: payment.id,
      amount: `₹${payment.amount}`,
      status: payment.status,
      paymentMethod: payment.paymentMethod || 'N/A',
      planName: payment.planName,
      date: new Date(payment.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      razorpayPaymentId: payment.razorpayPaymentId,
    }));

    return new Response(JSON.stringify(formattedPayments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to fetch payment history',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
