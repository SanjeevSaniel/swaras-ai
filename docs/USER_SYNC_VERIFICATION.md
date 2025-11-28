# User Sync Verification Guide

## Overview

This guide explains how to verify that Clerk user data is properly synchronized with your Neon database.

## How Synchronization Works

SwarAI uses **Clerk webhooks** to keep user data in sync:

1. **User Signs Up** → Clerk webhook sends `user.created` event → User added to Neon DB with `FREE` tier
2. **User Updates Profile** → Clerk webhook sends `user.updated` event → Profile data updated in Neon DB (tier preserved)
3. **User Deletes Account** → Clerk webhook sends `user.deleted` event → User removed from Neon DB

## Verification Steps

### 1. Verify Webhook Configuration

**In Clerk Dashboard:**
- Navigate to **Webhooks**
- Confirm endpoint URL is correct
- Verify these events are selected:
  - ✅ `user.created`
  - ✅ `user.updated`
  - ✅ `user.deleted`
- Check that `CLERK_WEBHOOK_SECRET` is set in your environment variables

### 2. Test New User Creation

**Steps:**
1. Clear browser cache and cookies
2. Create a new test user account
3. Check server logs for: `✨ Creating new user: [userId] (tier: FREE)`
4. Verify in Neon database:
   ```sql
   SELECT id, email, tier FROM users WHERE email = 'test@example.com';
   ```
5. Expected result: User exists with `tier = 'FREE'`

**Success Indicators:**
- ✅ Webhook receives `user.created` event
- ✅ Server log shows "User created in database"
- ✅ User appears in Neon database with FREE tier

### 3. Test Existing User Login

**Steps:**
1. Manually update a test user's tier in the database:
   ```sql
   UPDATE users SET tier = 'PRO' WHERE email = 'test@example.com';
   ```
2. Log out and log back in with the same user
3. Check server logs - should NOT see "Creating new user"
4. Verify tier in database remains `PRO`

**Success Indicators:**
- ✅ Tier remains unchanged after login
- ✅ No "Creating new user" log message
- ✅ Database query shows `tier = 'PRO'`

### 4. Test Profile Updates

**Steps:**
1. Update user profile in Clerk (change name or email)
2. Check server logs for: `📝 Updating existing user: [userId] (tier: [CURRENT_TIER] - preserved)`
3. Verify in database that:
   - Name/email is updated
   - Tier is NOT changed

**Success Indicators:**
- ✅ Webhook receives `user.updated` event
- ✅ Server log shows "User profile updated"
- ✅ Profile data updated but tier preserved

## Common Issues

### Issue: User tier resets to FREE on login

**Symptoms:**
- Users with PRO/MAXX tier get downgraded to FREE
- Every login creates a "Creating new user" log

**Solution:**
- Verify webhooks are properly configured
- Check that webhook secret is correct
- Ensure webhook events are being received

### Issue: User not syncing to database

**Symptoms:**
- User can log in but doesn't appear in database
- Webhook logs show errors

**Solution:**
- Check webhook endpoint is accessible
- Verify `CLERK_WEBHOOK_SECRET` is correct
- Check Clerk Dashboard webhook logs for errors
- Ensure Neon database connection is working

### Issue: Duplicate users in database

**Symptoms:**
- Multiple entries for same user
- Constraint violations

**Solution:**
- Check that user ID is being used consistently
- Verify webhook isn't being called multiple times
- Review database constraints on `users` table

## Manual Database Queries

### Check user tier
```sql
SELECT id, email, tier, created_at, updated_at 
FROM users 
WHERE email = 'user@example.com';
```

### List all users and their tiers
```sql
SELECT email, tier, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Update user tier manually
```sql
UPDATE users 
SET tier = 'PRO' 
WHERE email = 'user@example.com';
```

### Check rate limits for a user
```sql
SELECT u.email, u.tier, r.message_count, r.last_reset_at
FROM users u
LEFT JOIN rate_limits r ON u.id = r.user_id
WHERE u.email = 'user@example.com';
```

## Monitoring

### Webhook Logs

Check Clerk Dashboard → Webhooks → [Your Endpoint] → Logs to see:
- Event type
- Response status
- Response body
- Timestamp

### Server Logs

Monitor your application logs for:
- `✨ Creating new user:` - New user creation
- `📝 Updating existing user:` - Profile updates
- `🗑️ User deleted from database:` - User deletion
- `📨 Clerk Webhook received:` - Webhook event received

## Best Practices

1. **Never manually set tier on every sync** - Only set tier for new users
2. **Always preserve existing tiers** - Don't override user's current tier
3. **Use webhooks as single source of truth** - Don't duplicate sync logic client-side
4. **Monitor webhook failures** - Set up alerts for webhook errors
5. **Test tier preservation** - Regularly verify existing users keep their tiers

## Next Steps

If all verification steps pass:
- ✅ Your user sync is working correctly
- ✅ Tiers are properly preserved
- ✅ Clerk and Neon DB are in sync

If any issues:
- Review the troubleshooting section
- Check webhook configuration
- Verify database connectivity
- Review server logs for errors
