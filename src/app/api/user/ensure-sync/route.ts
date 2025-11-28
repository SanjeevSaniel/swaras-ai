// src/app/api/user/ensure-sync/route.ts
// Safe user sync endpoint that only creates new users, never overwrites existing data

import { syncUserToDatabase } from '@/lib/rate-limiter-db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Verify the request is authenticated
    const { userId: authUserId } = await auth();
    
    if (!authUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user data from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Sync user to database
    // This function now only creates new users with FREE tier
    // Existing users are updated with profile data but tier is preserved
    const success = await syncUserToDatabase(
      user.id,
      email,
      user.firstName || undefined,
      user.lastName || undefined,
      user.imageUrl || undefined,
      'FREE' // Only applied for new users
    );

    if (success) {
      console.log(`✅ User ensured in database: ${user.id}`);
      return NextResponse.json({ 
        success: true,
        userId: user.id
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to sync user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error in ensure-sync API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
