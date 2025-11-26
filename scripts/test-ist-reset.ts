// scripts/test-ist-reset.ts
// Script to test IST midnight reset functionality

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('✅ Environment variables loaded\n');

async function testISTReset() {
  const { db, users, rateLimits } = await import('@/db/index');
  const { eq } = await import('drizzle-orm');
  const { getUserStats } = await import('@/lib/rate-limiter-db');

  console.log('🧪 Testing IST Midnight Reset Functionality...\n');

  try {
    // Get first user
    const allUsers = await db.select().from(users).limit(1);

    if (allUsers.length === 0) {
      console.log('❌ No users found');
      process.exit(1);
    }

    const testUser = allUsers[0];
    console.log(`📝 Testing with user: ${testUser.email}\n`);

    // Display current time information
    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + IST_OFFSET);

    console.log('⏰ Current Time Information:');
    console.log(`   UTC Time: ${now.toUTCString()}`);
    console.log(`   IST Time: ${istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    console.log(`   IST Offset: +05:30 (${IST_OFFSET}ms)\n`);

    // Calculate IST midnight
    const istMidnight = new Date(
      Date.UTC(
        istTime.getUTCFullYear(),
        istTime.getUTCMonth(),
        istTime.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const todayStartUTC = istMidnight.getTime() - IST_OFFSET;

    console.log('🕛 IST Midnight Calculation:');
    console.log(`   Today's IST Midnight (UTC): ${new Date(todayStartUTC).toUTCString()}`);
    console.log(`   Today's IST Midnight (IST): ${new Date(todayStartUTC + IST_OFFSET).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    console.log(`   Timestamp: ${todayStartUTC}\n`);

    // Get current rate limit data
    const [rateLimitData] = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.userId, testUser.id));

    if (rateLimitData) {
      const lastResetTime = rateLimitData.lastResetAt.getTime();
      const shouldReset = lastResetTime < todayStartUTC;

      console.log('📊 Current Rate Limit Data:');
      console.log(`   Message Count: ${rateLimitData.messageCount}`);
      console.log(`   Last Reset (UTC): ${rateLimitData.lastResetAt.toUTCString()}`);
      console.log(`   Last Reset Timestamp: ${lastResetTime}`);
      console.log(`   Should Reset: ${shouldReset ? '✅ YES' : '❌ NO'}\n`);

      // Get stats (this should trigger reset if needed)
      console.log('🔄 Getting user stats (triggers automatic reset if needed)...');
      const stats = await getUserStats(testUser.id);

      console.log(`   Used: ${stats.used}/${stats.limit}`);
      console.log(`   Remaining: ${stats.remaining}`);
      console.log(`   Reset At: ${stats.resetAt}`);
      console.log(`   Percentage: ${stats.percentage.toFixed(2)}%\n`);

      // Fetch updated rate limit data to see if reset occurred
      const [updatedRateLimitData] = await db
        .select()
        .from(rateLimits)
        .where(eq(rateLimits.userId, testUser.id));

      if (updatedRateLimitData) {
        const wasReset = updatedRateLimitData.messageCount === 0 &&
                        updatedRateLimitData.lastResetAt.getTime() > lastResetTime;

        console.log('📊 Updated Rate Limit Data:');
        console.log(`   Message Count: ${updatedRateLimitData.messageCount}`);
        console.log(`   Last Reset (UTC): ${updatedRateLimitData.lastResetAt.toUTCString()}`);
        console.log(`   Last Reset Timestamp: ${updatedRateLimitData.lastResetAt.getTime()}`);
        console.log(`   Was Reset: ${wasReset ? '✅ YES' : '❌ NO'}\n`);

        if (wasReset) {
          console.log('✅ SUCCESS: Counter was automatically reset!');
        } else if (updatedRateLimitData.messageCount === 0) {
          console.log('✅ Counter is at 0 (either already reset or freshly initialized)');
        } else {
          console.log('ℹ️  Counter was not reset (same day, reset not needed)');
        }
      }
    } else {
      console.log('⚠️  No rate limit data found for this user');
    }

    // Test manual reset by setting last_reset_at to yesterday
    console.log('\n🧪 Test 2: Manual Reset Test');
    console.log('Setting last_reset_at to yesterday to simulate day change...\n');

    const yesterdayUTC = todayStartUTC - (24 * 60 * 60 * 1000);

    await db
      .update(rateLimits)
      .set({
        lastResetAt: new Date(yesterdayUTC),
        messageCount: 5, // Set some usage
      })
      .where(eq(rateLimits.userId, testUser.id));

    console.log('✅ Set last_reset_at to yesterday');
    console.log('✅ Set message_count to 5\n');

    // Now get stats again, should trigger reset
    console.log('Fetching stats again (should trigger automatic reset)...');
    const statsAfterManualSet = await getUserStats(testUser.id);

    console.log(`   Used: ${statsAfterManualSet.used}/${statsAfterManualSet.limit}`);
    console.log(`   Remaining: ${statsAfterManualSet.remaining}`);
    console.log(`   Percentage: ${statsAfterManualSet.percentage.toFixed(2)}%\n`);

    if (statsAfterManualSet.used === 0) {
      console.log('✅ SUCCESS: Counter was automatically reset to 0 after detecting new day!');
    } else {
      console.log('❌ FAILED: Counter was not reset');
    }

    // Verify the database was updated
    const [finalRateLimitData] = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.userId, testUser.id));

    if (finalRateLimitData) {
      console.log('\n📊 Final Database State:');
      console.log(`   Message Count: ${finalRateLimitData.messageCount}`);
      console.log(`   Last Reset (UTC): ${finalRateLimitData.lastResetAt.toUTCString()}`);
      console.log(`   Last Reset (IST): ${new Date(finalRateLimitData.lastResetAt.getTime() + IST_OFFSET).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

      const isCorrectResetTime = finalRateLimitData.lastResetAt.getTime() >= todayStartUTC;
      console.log(`   Reset time is correct: ${isCorrectResetTime ? '✅ YES' : '❌ NO'}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testISTReset()
  .then(() => {
    console.log('\n✨ IST Reset test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
