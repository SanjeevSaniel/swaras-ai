# Clerk User Sync & Webhook Automation Guide

This guide explains how to sync existing Clerk users to your database and set up automatic syncing for new users.

## 🎯 Overview

The system has two components:
1. **One-time sync script**: Syncs all existing Clerk users to your database
2. **Webhook automation**: Automatically syncs new users when they sign up

---

## 📦 Part 1: Sync Existing Users

### Step 1: Run the Sync Script

```bash
npm run sync:clerk-users
```

This script will:
- Fetch all users from Clerk (in batches of 100)
- Sync each user to your Neon database
- Create rate limit records for each user
- Show a summary of synced/skipped/failed users

### Expected Output

```
🔄 Starting Clerk user sync...

📦 Processing batch: 1 to 50
✅ Synced: user1@example.com (user_123...)
✅ Synced: user2@example.com (user_456...)
...

==================================================
📊 Sync Summary:
==================================================
✅ Successfully synced: 50
⚠️  Skipped: 0
❌ Errors: 0
📈 Total processed: 50
==================================================

🎉 All users synced successfully!
```

### Troubleshooting

If you encounter errors:

**Error: "CLERK_SECRET_KEY not found"**
- Make sure your `.env.local` has `CLERK_SECRET_KEY` set

**Error: "Database connection failed"**
- Verify your `DATABASE_URL` in `.env.local`
- Check that your Neon database is accessible

**Error: "Some users failed to sync"**
- Check the error messages in the output
- Users without email addresses will be skipped
- Duplicate users will be updated (not cause errors)

---

## 🤖 Part 2: Set Up Webhook Automation

The webhook is already implemented at `src/app/api/webhooks/clerk/route.ts`. You just need to configure it in Clerk dashboard.

### Step 1: Get Your Webhook URL

Your webhook URL will be: `https://your-domain.com/api/webhooks/clerk`

**For local development:**
- Use a tunnel service like [ngrok](https://ngrok.com/) or [localtunnel](https://localtunnel.me/)
- Example with ngrok: `ngrok http 3000`
- Your webhook URL: `https://abc123.ngrok.io/api/webhooks/clerk`

**For production:**
- Use your deployed domain
- Example: `https://swaras-ai.vercel.app/api/webhooks/clerk`

### Step 2: Configure Webhook in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Webhooks** in the sidebar
4. Click **Add Endpoint**
5. Enter your webhook URL
6. Select the following events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
7. Click **Create**

### Step 3: Get Webhook Secret

After creating the webhook:
1. Click on your webhook endpoint
2. Copy the **Signing Secret** (starts with `whsec_`)
3. Add it to your `.env.local`:

```bash
CLERK_WEBHOOK_SECRET=whsec_your_secret_here
```

### Step 4: Test the Webhook

**Option A: Test with a new user signup**
1. Sign up with a new test account
2. Check your server logs for webhook events
3. Verify the user appears in your database

**Option B: Test with Clerk's test feature**
1. In Clerk Dashboard → Webhooks → Your endpoint
2. Click **Testing** tab
3. Select `user.created` event
4. Click **Send Example**
5. Check your server logs

### Expected Webhook Logs

```
📨 Clerk Webhook received: user.created
✅ User created in database: user_abc123xyz
```

---

## 🔄 How Webhook Automation Works

Once set up, the webhook will:

1. **On user signup (`user.created`)**:
   - Clerk sends webhook to your API
   - User is created in `users` table
   - Rate limit record is automatically created
   - Returns success response

2. **On user update (`user.updated`)**:
   - Updates user info in database
   - Preserves existing rate limits

3. **On user deletion (`user.deleted`)**:
   - Deletes user from database
   - Cascade deletes related records (rate limits, etc.)

---

## 📊 Verify Everything Works

### Check Database

```bash
# Open Drizzle Studio
npm run db:studio
```

Then verify:
- ✅ All users are in the `users` table
- ✅ Each user has a corresponding `rate_limits` record

### Check Rate Limiting

Test that rate limiting works for your synced users:
```bash
npm run test:rate-limit
```

---

## 🛠️ Manual User Sync (If Needed)

If you need to manually sync a specific user:

```typescript
import { syncUserToDatabase } from '@/lib/rate-limiter-db';

await syncUserToDatabase(
  'user_id',
  'email@example.com',
  'FirstName',
  'LastName',
  'https://image-url.com',
  'FREE' // or 'PRO', 'ENTERPRISE'
);
```

---

## 📝 Important Notes

1. **Run sync script once**: The sync script is meant for one-time bulk import
2. **Webhook handles ongoing sync**: After setup, new users are auto-synced
3. **Webhook secret security**: Never commit `CLERK_WEBHOOK_SECRET` to version control
4. **Staging vs Production**: Use different webhook endpoints for different environments
5. **Rate limiting**: The fixed code now handles users not yet synced gracefully

---

## 🔍 Monitoring

### Check Webhook Delivery

In Clerk Dashboard:
1. Go to Webhooks → Your endpoint
2. Click **Logs** tab
3. View delivery status for each webhook event
4. Check for failed deliveries

### Check Application Logs

Your webhook logs important events:
```bash
# Watch logs during development
npm run dev

# Look for these log messages:
# ✅ User created in database: user_xyz
# ⚠️  Warning messages (if any)
# ❌ Error messages (if any)
```

---

## 🎉 You're Done!

Your Clerk-to-Database sync is now fully automated:
- ✅ Existing users are synced
- ✅ New signups are automatically synced
- ✅ Rate limiting works for all users
- ✅ No more foreign key constraint errors

If you encounter any issues, check the troubleshooting sections above or review your server logs.
