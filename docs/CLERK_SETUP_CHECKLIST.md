# ✅ Clerk User Sync - Setup Checklist

## Status: Partially Complete

### ✅ Part 1: One-Time User Sync - DONE!

- [x] Created sync script (`scripts/sync-clerk-users.ts`)
- [x] Added npm script (`npm run sync:clerk-users`)
- [x] Synced all existing users (10 users synced successfully)
- [x] Fixed foreign key constraint issue

**Result:** All 10 Clerk users are now in your database! ✅

---

### ⚠️ Part 2: Webhook Automation - NEEDS SETUP

To complete the automation, follow these steps:

#### Step 1: Get Your Webhook Secret from Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your app: **strong-scorpion-24**
3. Click **Webhooks** in the sidebar
4. If you already have an endpoint:
   - Click on it
   - Copy the **Signing Secret** (starts with `whsec_`)
5. If you don't have an endpoint yet:
   - Click **Add Endpoint**
   - For local dev: Use ngrok/localtunnel to expose your local server
   - For production: Use your deployed URL
   - Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Click **Create**
   - Copy the **Signing Secret**

#### Step 2: Update Your .env.local

Replace the current webhook secret with the real one from Clerk:

```bash
CLERK_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

**Current value:** `ep_364rOWtYg5R2gfIv9mkodHvAlfj` ❌ (This is incorrect format)
**Should be:** `whsec_...` ✅

#### Step 3: Test the Webhook

**For Local Development:**

1. Install ngrok (if not already):
   ```bash
   npm install -g ngrok
   ```

2. Start your dev server:
   ```bash
   npm run dev
   ```

3. In another terminal, start ngrok:
   ```bash
   ngrok http 3000
   ```

4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

5. In Clerk Dashboard, update your webhook endpoint URL to:
   ```
   https://abc123.ngrok.io/api/webhooks/clerk
   ```

6. Test by:
   - Creating a test user in Clerk, OR
   - Using Clerk's webhook test feature (Dashboard → Webhooks → Testing tab)

7. Check your terminal logs for:
   ```
   📨 Clerk Webhook received: user.created
   ✅ User created in database: user_xyz
   ```

**For Production:**

Once deployed, update the webhook URL to your production domain:
```
https://your-production-domain.com/api/webhooks/clerk
```

---

## Quick Commands Reference

```bash
# Sync all Clerk users to database (one-time)
npm run sync:clerk-users

# Start dev server
npm run dev

# Check database (Drizzle Studio)
npm run db:studio

# Test rate limiting
npm run test:rate-limit
```

---

## What's Working Now

✅ **User Sync**: All existing users are synced to database
✅ **Rate Limiting Fix**: No more foreign key errors
✅ **Webhook Code**: Already implemented at `src/app/api/webhooks/clerk/route.ts`

## What's Needed

⚠️ **Webhook Configuration**: Update `CLERK_WEBHOOK_SECRET` in `.env.local`
⚠️ **Webhook Endpoint**: Register your webhook URL in Clerk Dashboard

---

## Full Documentation

For detailed instructions, see: [CLERK_USER_SYNC.md](./CLERK_USER_SYNC.md)

---

## Need Help?

1. Check the logs in your terminal
2. View webhook delivery status in Clerk Dashboard → Webhooks → Logs
3. Verify database with `npm run db:studio`
