// scripts/migrate-users-standalone.ts
// Standalone script to migrate all existing Clerk users to Neon database

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local FIRST before any other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import modules that need environment variables
import { clerkClient } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is not set in .env.local');
}

console.log('✅ Environment variables loaded successfully\n');

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL);

async function createOrUpdateUser(clerkUserId: string, email: string, firstName?: string, lastName?: string) {
  try {
    const result = await sql`
      INSERT INTO users (clerk_user_id, email, first_name, last_name)
      VALUES (${clerkUserId}, ${email}, ${firstName || ''}, ${lastName || ''})
      ON CONFLICT (clerk_user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

async function updateUserTier(clerkUserId: string, tierName: string) {
  try {
    const result = await sql`
      UPDATE users
      SET tier_plan_id = (SELECT id FROM tier_plans WHERE name = ${tierName})
      WHERE clerk_user_id = ${clerkUserId}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating user tier:', error);
    throw error;
  }
}

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
