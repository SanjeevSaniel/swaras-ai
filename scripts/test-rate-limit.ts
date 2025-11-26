// scripts/test-rate-limit.ts
// Script to test rate limit counter functionality

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('✅ Environment variables loaded\n');

async function testRateLimit() {
  // Dynamic imports after environment is set
  const { db, users, rateLimits } = await import('@/db/index');
  const { eq } = await import('drizzle-orm');
  const { getUserStats, checkRateLimit, incrementUsage } = await import('@/lib/rate-limiter-db');

  console.log('🧪 Starting Rate Limit Tests...\n');

  try {
    // Get first user from database
    const allUsers = await db.select().from(users).limit(1);

    if (allUsers.length === 0) {
      console.log('❌ No users found in database. Run migration first.');
      process.exit(1);
    }

    const testUser = allUsers[0];
    console.log(`📝 Testing with user: ${testUser.email} (${testUser.id})\n`);

    // Test 1: Get initial stats
    console.log('Test 1: Getting initial user stats...');
    const initialStats = await getUserStats(testUser.id);
    console.log(`   ✅ Initial stats:`, {
      tier: initialStats.tier,
      used: initialStats.used,
      limit: initialStats.limit,
      remaining: initialStats.remaining,
      percentage: initialStats.percentage.toFixed(2) + '%',
    });
    console.log('');

    // Test 2: Check rate limit (should be allowed)
    console.log('Test 2: Checking if user can send message...');
    const rateLimitCheck = await checkRateLimit(testUser.id);
    console.log(`   ${rateLimitCheck.allowed ? '✅' : '❌'} Allowed: ${rateLimitCheck.allowed}`);
    console.log(`   Current: ${rateLimitCheck.usage.current}/${rateLimitCheck.usage.limit}`);
    console.log(`   Remaining: ${rateLimitCheck.usage.remaining}`);
    console.log(`   Reset at: ${rateLimitCheck.usage.resetAt}`);
    console.log('');

    // Test 3: Increment usage
    console.log('Test 3: Simulating message send (incrementing counter)...');
    const newCount = await incrementUsage(testUser.id);
    console.log(`   ✅ Usage incremented to: ${newCount}`);
    console.log('');

    // Test 4: Get updated stats
    console.log('Test 4: Getting updated user stats...');
    const updatedStats = await getUserStats(testUser.id);
    console.log(`   ✅ Updated stats:`, {
      tier: updatedStats.tier,
      used: updatedStats.used,
      limit: updatedStats.limit,
      remaining: updatedStats.remaining,
      percentage: updatedStats.percentage.toFixed(2) + '%',
    });
    console.log('');

    // Test 5: Simulate multiple messages to test counter
    console.log('Test 5: Simulating 5 more messages...');
    for (let i = 0; i < 5; i++) {
      const count = await incrementUsage(testUser.id);
      console.log(`   Message ${i + 1}: Usage now at ${count}`);
    }
    console.log('');

    // Test 6: Final stats
    console.log('Test 6: Final stats after all messages...');
    const finalStats = await getUserStats(testUser.id);
    console.log(`   ✅ Final stats:`, {
      tier: finalStats.tier,
      used: finalStats.used,
      limit: finalStats.limit,
      remaining: finalStats.remaining,
      percentage: finalStats.percentage.toFixed(2) + '%',
    });
    console.log('');

    // Test 7: Check if would hit limit (for FREE tier with limit of 10)
    if (finalStats.used >= finalStats.limit) {
      console.log('Test 7: Checking rate limit after hitting limit...');
      const limitCheck = await checkRateLimit(testUser.id);
      console.log(`   ${limitCheck.allowed ? '⚠️ Still allowed' : '✅ Correctly blocked'}`);
      console.log(`   Allowed: ${limitCheck.allowed}`);
      console.log('');
    }

    // Show rate_limits table data
    console.log('📊 Rate Limits Table Data:');
    const rateLimitData = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.userId, testUser.id));
    if (rateLimitData.length > 0) {
      console.log(`   User ID: ${rateLimitData[0].userId}`);
      console.log(`   Message Count: ${rateLimitData[0].messageCount}`);
      console.log(`   Last Reset: ${rateLimitData[0].lastResetAt}`);
      console.log(`   Created At: ${rateLimitData[0].createdAt}`);
      console.log(`   Updated At: ${rateLimitData[0].updatedAt}`);
    } else {
      console.log('   No rate limit record found');
    }

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the tests
testRateLimit()
  .then(() => {
    console.log('\n✨ Test script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test script failed:', error);
    process.exit(1);
  });
