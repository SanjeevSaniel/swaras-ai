// scripts/migrate-users-v2.ts
// Script to migrate users from Clerk to Neon with proper environment variable loading

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}
if (!process.env.CLERK_SECRET_KEY) {
  console.error('❌ CLERK_SECRET_KEY is not set in .env.local');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully\n');

async function runMigration() {
  // Dynamic imports after environment is set
  const { clerkClient } = await import('@clerk/nextjs/server');
  const { neon } = await import('@neondatabase/serverless');

  const sql = neon(process.env.DATABASE_URL!);

  async function createOrUpdateUser(clerkUserId: string, email: string, firstName?: string, lastName?: string) {
    try {
      const result = await sql`
        INSERT INTO users (id, email, first_name, last_name, tier)
        VALUES (${clerkUserId}, ${email}, ${firstName || ''}, ${lastName || ''}, 'FREE')
        ON CONFLICT (id)
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
        SET tier = ${tierName},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${clerkUserId}
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      console.error('Error updating user tier:', error);
      throw error;
    }
  }

  console.log('🚀 Starting user migration from Clerk to Neon DB...\n');

  try {
    const client = await clerkClient();
    let migratedCount = 0;
    let errorCount = 0;
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      console.log(`📥 Fetching users (offset: ${offset}, limit: ${limit})...`);

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

      for (const user of users) {
        try {
          const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;

          if (!email) {
            console.log(`⚠️  Skipping user ${user.id} - no email found`);
            errorCount++;
            continue;
          }

          // Get tier from public metadata
          const tier = (user.publicMetadata?.tier as string) ||
                      (user.publicMetadata?.rateLimitTier as string) ||
                      'FREE';

          // Migrate user
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
runMigration()
  .then(() => {
    console.log('✨ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
