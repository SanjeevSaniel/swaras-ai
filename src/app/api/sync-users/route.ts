// src/app/api/sync-users/route.ts
// Manual endpoint to sync current Clerk users to database
// Use this once to sync existing users

import { auth, clerkClient } from '@clerk/nextjs/server';
import { syncUserToDatabase } from '@/lib/rate-limiter-db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting user sync...');

    // Get all users from Clerk
    const client = await clerkClient();
    const response = await client.users.getUserList({ limit: 500 });
    const users = response.data;

    console.log(`Found ${users.length} users to sync`);

    let synced = 0;
    let failed = 0;

    // Sync each user to database
    for (const user of users) {
      try {
        const email = user.emailAddresses[0]?.emailAddress;
        
        if (!email) {
          console.warn(`⚠️ User ${user.id} has no email, skipping`);
          failed++;
          continue;
        }

        const tier = (user.publicMetadata?.tier as string) || 'FREE';

        await syncUserToDatabase(
          user.id,
          email,
          user.firstName || undefined,
          user.lastName || undefined,
          user.imageUrl || undefined,
          tier
        );

        synced++;
        console.log(`✅ Synced user: ${user.id} (${email})`);
      } catch (error) {
        failed++;
        console.error(`❌ Failed to sync user ${user.id}:`, error);
      }
    }

    console.log(`🎉 Sync complete: ${synced} synced, ${failed} failed`);

    return NextResponse.json({
      success: true,
      total: users.length,
      synced,
      failed,
    });

  } catch (error) {
    console.error('💥 Error syncing users:', error);
    return NextResponse.json(
      { error: 'Failed to sync users', details: error.message },
      { status: 500 }
    );
  }
}
