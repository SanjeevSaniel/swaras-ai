// src/app/api/user/sync/route.ts
// API endpoint to sync user from Clerk to Neon database

import { syncUserToDatabase } from '@/lib/rate-limiter-db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Verify the request is authenticated
    const { userId: authUserId } = await auth();
    
    if (!authUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, email, firstName, lastName, imageUrl } = body;

    // Ensure the authenticated user matches the user being synced
    if (authUserId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: User ID mismatch' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Sync user to database
    const success = await syncUserToDatabase(
      userId,
      email,
      firstName,
      lastName,
      imageUrl,
      'FREE' // Default tier for new users
    );

    if (success) {
      console.log(`✅ User synced to database: ${userId}`);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to sync user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error in user sync API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
