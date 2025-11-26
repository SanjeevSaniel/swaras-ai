// scripts/test-rate-limit-exceeded.ts
// Script to test rate limit exceeded scenario

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('✅ Environment variables loaded\n');

async function testRateLimitExceeded() {
  const { db, users } = await import('@/db/index');
  const { getUserStats, checkRateLimit, incrementUsage } = await import('@/lib/rate-limiter-db');

  console.log('🧪 Testing Rate Limit Exceeded Scenario...\n');

  try {
    // Get first user
    const allUsers = await db.select().from(users).limit(1);

    if (allUsers.length === 0) {
      console.log('❌ No users found');
      process.exit(1);
    }

    const testUser = allUsers[0];
    console.log(`📝 Testing with user: ${testUser.email}\n`);

    // Check current usage
    const currentStats = await getUserStats(testUser.id);
    console.log(`Current usage: ${currentStats.used}/${currentStats.limit}`);
    console.log(`Remaining: ${currentStats.remaining}\n`);

    // Calculate how many messages needed to hit limit
    const messagesNeeded = currentStats.remaining;

    if (messagesNeeded === 0) {
      console.log('✅ User has already hit the limit');

      const limitCheck = await checkRateLimit(testUser.id);
      console.log(`Allowed: ${limitCheck.allowed}`);
      console.log(`Usage: ${limitCheck.usage.current}/${limitCheck.usage.limit}`);
    } else {
      console.log(`📨 Sending ${messagesNeeded} more messages to hit the limit...`);

      for (let i = 0; i < messagesNeeded; i++) {
        const count = await incrementUsage(testUser.id);
        console.log(`   Message ${i + 1}: Usage now at ${count}`);
      }

      console.log('\n✅ Limit reached!');
      console.log('\nNow testing if further messages are blocked...\n');

      const limitCheck = await checkRateLimit(testUser.id);
      console.log(`Allowed: ${limitCheck.allowed}`);
      console.log(`Usage: ${limitCheck.usage.current}/${limitCheck.usage.limit}`);
      console.log(`Remaining: ${limitCheck.usage.remaining}`);
      console.log(`Reset at: ${limitCheck.usage.resetAt}`);

      if (!limitCheck.allowed) {
        console.log('\n✅ SUCCESS: User is correctly blocked after hitting limit');
      } else {
        console.log('\n⚠️  WARNING: User can still send messages after hitting limit');
      }

      // Try to increment again (should still work for counter, but API should block)
      console.log('\nAttempting to increment counter beyond limit...');
      const overLimitCount = await incrementUsage(testUser.id);
      console.log(`Counter incremented to: ${overLimitCount}`);
      console.log('(Note: Counter increments, but API should block the request)\n');
    }

    // Final stats
    const finalStats = await getUserStats(testUser.id);
    console.log('📊 Final Stats:');
    console.log(`   Used: ${finalStats.used}/${finalStats.limit}`);
    console.log(`   Remaining: ${finalStats.remaining}`);
    console.log(`   Percentage: ${finalStats.percentage.toFixed(2)}%`);
    console.log(`   Reset at: ${finalStats.resetAt}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testRateLimitExceeded()
  .then(() => {
    console.log('\n✨ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
