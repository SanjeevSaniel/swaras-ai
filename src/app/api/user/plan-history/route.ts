/**
 * Plan History API Route
 * 
 * Fetches the user's plan change history from the audit logs.
 * 
 * @route GET /api/user/plan-history
 * @access Protected (requires authentication)
 */

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { planAudits } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const history = await db
      .select()
      .from(planAudits)
      .where(eq(planAudits.userId, userId))
      .orderBy(desc(planAudits.createdAt))
      .limit(10);

    return new Response(
      JSON.stringify({ history }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching plan history:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
