// scripts/sync-clerk-users.ts
// Script to sync all users from Clerk to your database
// Run with: npm run sync:clerk-users

import { clerkClient } from '@clerk/nextjs/server';
import { syncUserToDatabase } from '../src/lib/rate-limiter-db';

async function syncAllUsers() {
  console.log('🔄 Starting Clerk user sync...\n');

  try {
    let totalSynced = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let offset = 0;
    const limit = 100; // Clerk API pagination limit

    while (true) {
      // Fetch users from Clerk in batches
      const clerk = await clerkClient();
      const response = await clerk.users.getUserList({
        limit,
        offset,
      });

      if (!response.data || response.data.length === 0) {
        break; // No more users to fetch
      }

      console.log(`📦 Processing batch: ${offset + 1} to ${offset + response.data.length}`);

      // Sync each user in the current batch
      for (const user of response.data) {
        try {
          const email = user.emailAddresses[0]?.emailAddress;

          if (!email) {
            console.warn(`⚠️  Skipping user ${user.id}: No email found`);
            totalSkipped++;
            continue;
          }

          // Get tier from public metadata or default to FREE
          const tier = (user.publicMetadata?.tier as string) || 'FREE';

          // Sync to database
          const success = await syncUserToDatabase(
            user.id,
            email,
            user.firstName || undefined,
            user.lastName || undefined,
            user.imageUrl || undefined,
            tier
          );

          if (success) {
            console.log(`✅ Synced: ${email} (${user.id})`);
            totalSynced++;
          } else {
            console.error(`❌ Failed to sync: ${email} (${user.id})`);
            totalErrors++;
          }
        } catch (error) {
          console.error(`❌ Error syncing user ${user.id}:`, error);
          totalErrors++;
        }
      }

      // Check if there are more users to fetch
      if (!response.hasNextPage) {
        break;
      }

      offset += limit;
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Sync Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully synced: ${totalSynced}`);
    console.log(`⚠️  Skipped: ${totalSkipped}`);
    console.log(`❌ Errors: ${totalErrors}`);
    console.log(`📈 Total processed: ${totalSynced + totalSkipped + totalErrors}`);
    console.log('='.repeat(50));

    if (totalErrors > 0) {
      console.log('\n⚠️  Some users failed to sync. Check the errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All users synced successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Fatal error during sync:', error);
    process.exit(1);
  }
}

// Run the sync
syncAllUsers();
