// src/app/api/user/usage/route.js - API endpoint to fetch user usage statistics

import { auth } from '@clerk/nextjs/server';
import { getUserStats } from '@/lib/rate-limiter';

export async function GET(req) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'You must be signed in to view usage statistics',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Get user stats
    const stats = await getUserStats(userId);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user usage:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to fetch usage statistics',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
