# Clerk Webhook Troubleshooting Guide

## Issue: New Signups Not Syncing to Neon DB

If new users signing up through Clerk are not appearing in your Neon database, follow this guide to diagnose and fix the issue.

## Prerequisites Check

✅ **Svix is already installed** - Your `package.json` includes `"svix": "^1.81.0"`, so you don't need to install anything additional. Clerk uses Svix for webhook signing and verification.

## Step-by-Step Troubleshooting

### 1. Verify Environment Variables

Check that you have `CLERK_WEBHOOK_SECRET` set in your `.env.local` file:

```bash
# In your project root
cat .env.local | grep CLERK_WEBHOOK_SECRET
```

**Expected output:**
```
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**If missing or empty:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks**
4. If you don't have an endpoint yet, skip to Step 2
5. If you do, click on your endpoint → **Signing Secret** → Copy
6. Add to `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_your_copied_secret
   ```

### 2. Configure Clerk Webhook (Critical!)

**In Clerk Dashboard:**

1. Go to **Webhooks** in the sidebar
2. Click **+ Add Endpoint**
3. **Set the endpoint URL:**
   
   For **local development** (using ngrok):
   ```
   https://your-subdomain.ngrok.io/api/webhooks/clerk
   ```
   
   For **production**:
   ```
   https://yourdomain.com/api/webhooks/clerk
   ```

4. **Select these events** (REQUIRED):
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

5. Click **Create**
6. **Copy the Signing Secret** (starts with `whsec_`)
7. Add it to your `.env.local`
8. **Restart your dev server**

### 3. Expose Local Development Server (For Testing)

Clerk webhooks need a publicly accessible URL. For local development, use **ngrok**:

**Install ngrok:**
```bash
# Using npm
npm install -g ngrok

# Or download from https://ngrok.com/download
```

**Start your dev server:**
```bash
npm run dev
```

**In a new terminal, expose port 3000:**
```bash
ngrok http 3000
```

**You'll get output like:**
```
Forwarding   https://abc123.ngrok.io -> http://localhost:3000
```

**Update your Clerk webhook URL** to `https://abc123.ngrok.io/api/webhooks/clerk`

> ⚠️ **Important**: The ngrok URL changes every time you restart it (unless you have a paid plan). You'll need to update the Clerk webhook URL each time.

### 4. Test the Webhook Endpoint

**Test locally:**
```bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected response:**
```
Error: Missing svix headers
```

This is good! It means the endpoint is accessible. The error is expected because we didn't send the required Svix headers.

### 5. Check Server Logs

**Start your dev server with verbose logging:**
```bash
npm run dev
```

**Watch for these logs when a user signs up:**

✅ **Successful sync:**
```
📨 Clerk Webhook received: user.created
✨ Creating new user: user_xxxxx (tier: FREE)
✅ User created in database: user_xxxxx (tier: FREE)
```

❌ **Failed sync (common errors):**

**Missing webhook secret:**
```
Error: Please add CLERK_WEBHOOK_SECRET to .env
```
→ Solution: Add the secret to `.env.local` and restart server

**Verification failed:**
```
Error verifying webhook: [details]
```
→ Solution: Double-check the webhook secret is correct

**Database error:**
```
Error syncing user to database: [details]
```
→ Solution: Check your Neon database connection (`DATABASE_URL`)

### 6. Verify Webhook in Clerk Dashboard

1. Go to **Clerk Dashboard** → **Webhooks**
2. Click on your endpoint
3. Check the **Logs** tab
4. You should see webhook delivery attempts

**Check for:**
- ✅ Status 200 (success)
- ❌ Status 400/500 (error)
- ❌ Timeout
- ❌ Connection refused

### 7. Test with a Real Signup

1. **Log out** of your application
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Sign up** with a new email
4. **Check server logs** for webhook events
5. **Verify in database:**

```sql
SELECT id, email, tier, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;
```

### 8. Manual Sync Script (Temporary Fix)

If webhooks are still not working, you can manually sync existing Clerk users to your database:

```bash
npm run sync:clerk-users
```

This will:
- Fetch all users from Clerk
- Sync them to your Neon database
- Set new users to FREE tier
- Preserve existing users' tiers

**Note:** This is a one-time sync and won't capture future signups. You MUST fix webhooks for automatic syncing.

## Common Issues and Solutions

### Issue: "Please add CLERK_WEBHOOK_SECRET to .env"

**Solution:**
1. Get the secret from Clerk Dashboard → Webhooks → [Your Endpoint] → Signing Secret
2. Add to `.env.local`: `CLERK_WEBHOOK_SECRET=whsec_xxxxx`
3. Restart dev server: `npm run dev`

### Issue: Webhook endpoint returns 404

**Check:**
- File exists at: `src/app/api/webhooks/clerk/route.ts`
- Next.js dev server is running
- URL path is exactly `/api/webhooks/clerk`

**Verify route is accessible:**
```bash
curl http://localhost:3000/api/webhooks/clerk
```

### Issue: Ngrok URL keeps changing

**Solution:**
- Use ngrok's paid plan for a static domain
- Or use a production deployment (Vercel, Railway, etc.)
- For Vercel: Deploy and use `https://your-app.vercel.app/api/webhooks/clerk`

### Issue: Database connection error

**Check:**
```bash
# Verify DATABASE_URL is set
cat .env.local | grep DATABASE_URL

# Test database connection
npm run db:studio
```

### Issue: Users sync but tier is wrong

**Check:**
- Are you testing with existing users? (They keep their tier)
- Is the webhook handling `user.created` vs `user.updated` correctly?
- Check server logs for which event is being received

## Verification Checklist

Before reaching out for help, verify:

- [ ] `svix` package is installed (check `package.json`)
- [ ] `CLERK_WEBHOOK_SECRET` is set in `.env.local`
- [ ] Clerk webhook is configured with correct URL
- [ ] Events selected: `user.created`, `user.updated`, `user.deleted`
- [ ] Dev server is running (`npm run dev`)
- [ ] Ngrok is running (for local dev)
- [ ] Webhook URL in Clerk matches ngrok URL
- [ ] Server logs show webhook events
- [ ] Database connection works (`DATABASE_URL` is valid)
- [ ] Webhook endpoint returns expected error when tested

## Quick Test Commands

```bash
# 1. Check if svix is installed
npm list svix

# 2. Check environment variables
cat .env.local | grep -E "(CLERK_WEBHOOK_SECRET|DATABASE_URL)"

# 3. Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/clerk

# 4. Manual sync (if webhooks not working)
npm run sync:clerk-users

# 5. Check database
npm run db:studio
```

## Still Not Working?

If you've followed all steps and it's still not working:

1. **Check Clerk Dashboard Webhook Logs** - Look for error messages
2. **Check your application logs** - Look for any errors when webhook is received
3. **Verify Network** - Make sure ngrok/deployment can receive external requests
4. **Test the flow manually:**
   ```bash
   # Terminal 1: Start dev server
   npm run dev
   
   # Terminal 2: Start ngrok
   ngrok http 3000
   
   # Terminal 3: Watch logs
   tail -f .next/server/app/api/webhooks/clerk/route.js
   ```

## Production Deployment

For production (e.g., Vercel):

1. Deploy your app
2. Get your production URL (e.g., `https://myapp.vercel.app`)
3. Update Clerk webhook to: `https://myapp.vercel.app/api/webhooks/clerk`
4. Add `CLERK_WEBHOOK_SECRET` to Vercel environment variables
5. Redeploy if needed

**Vercel Environment Variables:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `CLERK_WEBHOOK_SECRET` = `whsec_xxxxx`
   - `DATABASE_URL` = your Neon connection string
3. Redeploy

---

## Summary

**Yes, Clerk uses Svix** for webhook signing, and it's already installed in your project. The main steps are:

1. ✅ Configure webhook in Clerk Dashboard
2. ✅ Get the signing secret
3. ✅ Add `CLERK_WEBHOOK_SECRET` to `.env.local`
4. ✅ Expose your local server with ngrok (for development)
5. ✅ Update webhook URL in Clerk to point to ngrok/production URL
6. ✅ Restart dev server
7. ✅ Test with a new signup

The webhook will automatically sync user data to Neon DB!
