// scripts/migrate-users-to-neon.ts
// Script to migrate all existing Clerk users to Neon database

import 'dotenv/config';
import { clerkClient } from '@clerk/nextjs/server';
import { createOrUpdateUser } from '@/app/actions';

async function migrateUsers() {
  console.log('🚀 Starting user migration from Clerk to Neon DB...\n');

  try {
    const client = await clerkClient();
    let migratedCount = 0;
    let errorCount = 0;
    let offset = 0;
    const limit = 100; // Fetch users in batches of 100
    let hasMore = true;

    while (hasMore) {
      console.log(`📥 Fetching users (offset: ${offset}, limit: ${limit})...`);

      // Fetch users from Clerk
      const response = await client.users.getUserList({
        limit,
        offset,
      });

      const users = response.data;
      hasMore = users.length === limit;

      if (users.length === 0) {
        console.log('✅ No more users to migrate');
        break;
      }

      console.log(`   Found ${users.length} users in this batch\n`);

      // Migrate each user
      for (const user of users) {
        try {
          const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;

          if (!email) {
            console.log(`⚠️  Skipping user ${user.id} - no email found`);
            errorCount++;
            continue;
          }

          // Get tier from public metadata (if set)
          const tier = (user.publicMetadata?.tier as string) ||
                      (user.publicMetadata?.rateLimitTier as string) ||
                      'FREE';

          // Migrate user to Neon
          await createOrUpdateUser(
            user.id,
            email,
            user.firstName || undefined,
            user.lastName || undefined
          );

          // Update tier if not FREE
          if (tier !== 'FREE') {
            const { updateUserTier } = await import('@/app/actions');
            await updateUserTier(user.id, tier);
          }

          migratedCount++;
          console.log(`✅ Migrated: ${email} (${user.id}) - Tier: ${tier}`);
        } catch (error) {
          console.error(`❌ Error migrating user ${user.id}:`, error);
          errorCount++;
        }
      }

      offset += limit;
      console.log(`\n📊 Progress: ${migratedCount} migrated, ${errorCount} errors\n`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Migration Complete!');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${migratedCount} users`);
    if (errorCount > 0) {
      console.log(`⚠️  Errors encountered: ${errorCount} users`);
    }
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('💥 Fatal error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateUsers()
  .then(() => {
    console.log('✨ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
