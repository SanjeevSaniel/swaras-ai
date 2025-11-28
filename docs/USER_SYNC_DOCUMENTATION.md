# User Sync System - Complete Documentation

> **Current Implementation:** Client-Side Sync (No Webhooks Required)

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [How It Works](#how-it-works)
4. [Architecture](#architecture)
5. [Implementation Details](#implementation-details)
6. [Tier Management](#tier-management)
7. [Testing Guide](#testing-guide)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Alternative: Webhook Sync](#alternative-webhook-sync)
11. [FAQ](#faq)

---

## Overview

SwarAI uses a **client-side sync system** to keep Clerk user data synchronized with the Neon database. This approach:

✅ **No external tools** - No ngrok, no tunneling services  
✅ **Zero configuration** - Works immediately in development  
✅ **Tier preservation** - Existing users keep their subscription tier  
✅ **Production ready** - Deploy to Vercel with no additional setup  
✅ **Next.js optimized** - Works with App Router and Edge Runtime  

### Key Features

- **Automatic Sync:** Users are synced to database on first login
- **New Users:** Automatically assigned FREE tier
- **Existing Users:** Profile data updated, tier preserved
- **Session-Based:** Syncs once per browser session (no duplicates)
- **Silent Operation:** No loading states or user interruptions

---

## Quick Start

### Prerequisites

- ✅ Clerk account configured
- ✅ Neon database connected
- ✅ Environment variables set

### Run Your App

```bash
npm run dev
```

That's it! User sync works automatically when users log in.

### Test It

1. Open http://localhost:3001
2. Sign up with a new email
3. Check terminal logs for sync confirmation
4. User is now in your database with FREE tier

---

## How It Works

### User Flow

```mermaid
sequenceDiagram
    participant User
    participant Clerk
    participant App
    participant Hook as useEnsureUserSync
    participant API as /api/user/ensure-sync
    participant DB as Neon DB

    User->>Clerk: Sign up
    Clerk->>User: Redirect to app
    User->>App: First visit
    App->>Hook: Component mounts
    Hook->>Hook: Check sessionStorage
    Note over Hook: No sync record
    Hook->>API: POST /api/user/ensure-sync
    API->>Clerk: Get user data
    Clerk->>API: User details
    API->>DB: Check if user exists
    
    alt New User
        API->>DB: INSERT with FREE tier
        Note over DB: tier = 'FREE'
    else Existing User
        API->>DB: UPDATE profile only
        Note over DB: tier = preserved
    end
    
    DB->>API: Success
    API->>Hook: 200 OK
    Hook->>Hook: Save to sessionStorage
    Note over Hook: Won't sync again this session
```

### Timing

| Event | Sync Triggered? | Action |
|-------|----------------|---------|
| User signs up | ✅ Yes | First login syncs user with FREE tier |
| User logs in (existing) | ✅ Yes | Profile updated, tier preserved |
| Page refresh (same session) | ❌ No | sessionStorage prevents duplicate sync |
| User updates profile in Clerk | ⚠️ On next login | Profile syncs on next login |
| User deleted in Clerk | ❌ Manual | Requires manual cleanup |

---

## Architecture

### File Structure

```
src/
├── app/
│   └── api/
│       └── user/
│           └── ensure-sync/
│               └── route.ts          # Sync API endpoint
├── hooks/
│   └── useEnsureUserSync.ts          # Client sync hook
├── lib/
│   └── rate-limiter-db.ts            # Database sync logic
└── components/
    └── swaras-ai.tsx                  # Main component (uses hook)
```

### Components

#### 1. API Endpoint: `/api/user/ensure-sync`

**Purpose:** Server-side endpoint to sync authenticated users to database

**Location:** `src/app/api/user/ensure-sync/route.ts`

**What it does:**
- Authenticates request with Clerk
- Gets user data from Clerk server-side
- Calls `syncUserToDatabase` function
- Returns success/error response

**Code:**
```typescript
export async function POST() {
  const { userId } = await auth();
  const user = await currentUser();
  
  await syncUserToDatabase(
    user.id,
    email,
    firstName,
    lastName,
    imageUrl,
    'FREE' // Only for new users
  );
  
  return NextResponse.json({ success: true });
}
```

#### 2. Client Hook: `useEnsureUserSync`

**Purpose:** React hook that automatically syncs users on mount

**Location:** `src/hooks/useEnsureUserSync.ts`

**What it does:**
- Runs once when component mounts
- Checks sessionStorage to prevent duplicates
- Calls sync API endpoint
- Marks session as synced

**Usage:**
```typescript
import { useEnsureUserSync } from '@/hooks/useEnsureUserSync';

function MyComponent() {
  const { user, isLoaded } = useEnsureUserSync();
  // user is now synced to database
}
```

#### 3. Database Sync Function: `syncUserToDatabase`

**Purpose:** Core logic for creating/updating users in database

**Location:** `src/lib/rate-limiter-db.ts`

**What it does:**
- Checks if user exists in database
- **New users:** Creates record with tier parameter (defaults to FREE)
- **Existing users:** Updates profile fields, preserves tier

**Code:**
```typescript
export async function syncUserToDatabase(
  userId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  tier?: string
) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (existingUser) {
    // Update profile, DON'T touch tier
    await db.update(users).set({
      email, firstName, lastName, imageUrl,
      updatedAt: new Date()
    });
  } else {
    // Create new user with tier
    await db.insert(users).values({
      id: userId, email, firstName, lastName, imageUrl,
      tier: tier || 'FREE'
    });
  }
}
```

---

## Tier Management

### How Tiers Work

SwarAI has three subscription tiers:

| Tier | Daily Limit | Default |
|------|-------------|---------|
| FREE | 10 messages | ✅ Yes |
| PRO | 100 messages | ❌ No |
| MAXX | 1000 messages | ❌ No |

### Tier Assignment Rules

1. **New users** → Always get **FREE** tier on signup
2. **Existing users** → Tier is **NEVER** changed by sync
3. **Manual upgrades** → Set in database, preserved on login
4. **Profile updates** → Tier remains unchanged

### Upgrading Users

To upgrade a user to PRO or MAXX:

```sql
-- Upgrade to PRO
UPDATE users 
SET tier = 'PRO' 
WHERE email = 'user@example.com';

-- Upgrade to MAXX
UPDATE users 
SET tier = 'MAXX' 
WHERE email = 'user@example.com';
```

**Important:** Once upgraded, the user keeps their tier even if they:
- Log out and log back in
- Update their profile in Clerk
- Refresh the page
- Clear browser cache

### Tier Preservation Guarantee

The sync system **guarantees** tier preservation through:

1. **Database-level:** `syncUserToDatabase` only sets tier for new users
2. **API-level:** `/api/user/ensure-sync` passes tier only for creation
3. **Hook-level:** No tier manipulation in client code

**Code proof:**
```typescript
if (existingUser) {
  // Tier is NOT in this update ✅
  await db.update(users).set({
    email,
    firstName,
    lastName,
    imageUrl,
    // ← No tier field here
    updatedAt: new Date()
  });
}
```

---

## Testing Guide

### Test 1: New User Signup

**Objective:** Verify new users are created with FREE tier

**Steps:**
1. Clear browser data (Ctrl+Shift+Delete)
2. Navigate to http://localhost:3001
3. Click "Sign Up"
4. Create account with `newuser@test.com`
5. Complete signup flow

**Expected Results:**

**Terminal logs:**
```
✨ Creating new user: user_2abc123 (tier: FREE)
✅ User ensured in database: user_2abc123
```

**Database verification:**
```sql
SELECT id, email, tier, created_at 
FROM users 
WHERE email = 'newuser@test.com';
```

**Expected output:**
```
id: user_2abc123
email: newuser@test.com
tier: FREE
created_at: 2024-01-28 12:00:00
```

✅ **PASS** if tier = 'FREE'

---

### Test 2: Tier Preservation

**Objective:** Verify existing users keep their tier after login

**Steps:**
1. Upgrade a test user in database:
   ```sql
   UPDATE users 
   SET tier = 'PRO' 
   WHERE email = 'existinguser@test.com';
   ```

2. Verify upgrade:
   ```sql
   SELECT tier FROM users WHERE email = 'existinguser@test.com';
   -- Should show: PRO
   ```

3. In browser:
   - Log out completely
   - Clear sessionStorage: `sessionStorage.clear()`
   - Log back in with the upgraded user

4. Check terminal logs:
   ```
   📝 Updating existing user: user_2xyz789 (tier: PRO - preserved)
   ✅ User ensured in database: user_2xyz789
   ```

5. Verify in database:
   ```sql
   SELECT tier FROM users WHERE email = 'existinguser@test.com';
   ```

**Expected output:**
```
tier: PRO
```

✅ **PASS** if tier is still 'PRO' (not reset to 'FREE')

---

### Test 3: Session Deduplication

**Objective:** Verify sync only happens once per session

**Steps:**
1. Open browser DevTools → Network tab
2. Filter for "ensure-sync"
3. Log in to the app
4. **First load:** Should see 1 request to `/api/user/ensure-sync`
5. Refresh page (F5) → No request
6. Refresh again (F5) → No request
7. Navigate to different page → No request
8. Check sessionStorage:
   ```javascript
   sessionStorage.getItem('user-synced-user_xxx')
   // Should return: "true"
   ```

**Expected Results:**
- ✅ Exactly 1 sync request on first load
- ✅ 0 sync requests on subsequent refreshes
- ✅ sessionStorage key exists

✅ **PASS** if only 1 sync request per session

---

### Test 4: Profile Update

**Objective:** Verify profile updates sync without affecting tier

**Steps:**
1. User is PRO tier in database
2. Update name in Clerk Dashboard:
   - Go to Clerk Dashboard → Users
   - Edit user → Change first name to "UpdatedName"
3. In app:
   - Log out
   - Log back in
4. Check terminal logs:
   ```
   📝 Updating existing user: user_xxx (tier: PRO - preserved)
   ```
5. Check database:
   ```sql
   SELECT first_name, tier 
   FROM users 
   WHERE id = 'user_xxx';
   ```

**Expected output:**
```
first_name: UpdatedName
tier: PRO
```

✅ **PASS** if name updated AND tier still PRO

---

## Deployment

### Deploying to Vercel

#### 1. Push to GitHub

```bash
git add .
git commit -m "Add client-side user sync"
git push origin main
```

#### 2. Connect to Vercel

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel auto-detects Next.js

#### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Neon Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Optional (not needed for client-side sync)
# CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

#### 4. Deploy

Click "Deploy" - that's it!

**No webhook configuration needed!**

---

### Deploying to Other Platforms

#### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add environment variables
railway variables set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
railway variables set CLERK_SECRET_KEY=sk_live_xxx
railway variables set DATABASE_URL=postgresql://...

# Deploy
railway up
```

#### Netlify

- Connect GitHub repository
- Build command: `npm run build`
- Publish directory: `.next`
- Add environment variables in Netlify dashboard

---

## Troubleshooting

### Issue: User not syncing to database

**Symptoms:**
- User logs in successfully
- No logs in terminal
- User not in database

**Diagnosis:**
```bash
# Check if hook is imported
grep -r "useEnsureUserSync" src/components/

# Check if endpoint exists
ls -la src/app/api/user/ensure-sync/
```

**Solution:**
1. Verify hook is imported and used in component
2. Verify API endpoint exists
3. Check browser console for errors
4. Restart dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

### Issue: Tier reset to FREE

**Symptoms:**
- User was PRO/MAXX
- After login, tier is FREE

**This should NOT happen!**

**Diagnosis:**
```sql
-- Check user tier history
SELECT id, email, tier, updated_at 
FROM users 
WHERE email = 'affected@user.com';
```

**Check code:**
```typescript
// In syncUserToDatabase function
if (existingUser) {
  // This should NOT have 'tier' in the set() 
  await db.update(users).set({
    email,
    firstName,
    lastName,
    imageUrl,
    tier, // ← Should NOT be here!
    updatedAt: new Date()
  });
}
```

**Solution:**
- Verify `syncUserToDatabase` doesn't set tier for existing users
- Check `src/lib/rate-limiter-db.ts` line ~294
- Ensure tier is only set for new user inserts

---

### Issue: Multiple sync calls per session

**Symptoms:**
- Multiple `/api/user/ensure-sync` requests in Network tab
- Same session making repeated calls

**Diagnosis:**
```javascript
// In browser console
console.log(sessionStorage.getItem('user-synced-user_xxx'));
// Should return "true" after first sync
```

**Solution:**
1. Check if sessionStorage is enabled in browser
2. Verify sync hook has sessionStorage check
3. Clear sessionStorage and test again:
   ```javascript
   sessionStorage.clear();
   location.reload();
   ```

---

### Issue: API returns 401 Unauthorized

**Symptoms:**
- Sync fails silently
- Console shows 401 error
- Terminal shows "Unauthorized"

**Diagnosis:**
- User is not authenticated with Clerk
- Auth token expired
- Clerk environment variables missing

**Solution:**
```bash
# Check Clerk env vars
cat .env.local | grep CLERK

# Verify keys are correct
# Should have both:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
```

---

## Alternative: Webhook Sync

### When to Use Webhooks

Use webhooks if you need:
- ✅ Real-time profile updates (instant sync)
- ✅ User deletion sync
- ✅ Multi-app sync (one Clerk account, multiple apps)
- ✅ Server-to-server communication only

### When NOT to Use Webhooks

Avoid webhooks if:
- ❌ You want simple development setup
- ❌ You don't want to configure ngrok
- ❌ Client-side sync is sufficient
- ❌ You're just prototyping

### Webhook Setup (Optional)

If you want webhooks IN ADDITION to client-side sync:

#### 1. Create Webhook in Clerk

- Go to Clerk Dashboard → Webhooks
- Add Endpoint: `https://yourdomain.com/api/webhooks/clerk`
- Select events: `user.created`, `user.updated`, `user.deleted`
- Copy Signing Secret

#### 2. Add Webhook Secret

```bash
# Add to .env.local
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

#### 3. Webhook Endpoint Already Exists

The webhook handler is already implemented at `src/app/api/webhooks/clerk/route.ts`

It follows the same tier preservation rules:
- `user.created` → Create with FREE tier
- `user.updated` → Update profile, preserve tier
- `user.deleted` → Delete from database

### Hybrid Approach (Recommended for Production)

Use **both** client-side sync and webhooks:

**Benefits:**
- ✅ Client-side sync = Fallback/redundancy
- ✅ Webhooks = Real-time updates
- ✅ Best of both worlds
- ✅ No single point of failure

**How it works:**
1. User signs up → Webhook fires immediately (if configured)
2. User logs in → Client-side sync checks/updates (fallback)
3. Profile update → Webhook syncs in real-time
4. If webhook fails → Client-side sync on next login

---

## FAQ

### Q: Do I need webhooks?

**A:** No! The client-side sync works perfectly without webhooks. Webhooks are optional for real-time updates.

### Q: Will this work in production?

**A:** Yes! Deploy to Vercel (or any platform) with zero additional configuration.

### Q: What happens if a user updates their profile?

**A:** Profile updates sync on their next login. For instant sync, add webhooks (optional).

### Q: What about user deletion?

**A:** Manual cleanup needed, or add webhooks for automatic deletion sync.

### Q: Can I use both client-side sync and webhooks?

**A:** Yes! This is actually recommended for production. They work together perfectly.

### Q: How does sessionStorage work?

**A:** It stores a flag per user that persists until the browser tab closes. When tab closes, flag is cleared, and user will sync again on next visit.

### Q: What if sessionStorage is disabled?

**A:** Sync will happen on every page load. This is inefficient but won't break anything.

### Q: Can I change the tier manually in the database?

**A:** Yes! Manual tier changes are preserved. The sync system never overwrites existing tiers.

### Q: Does this work with Clerk's middleware?

**A:** Yes! Clerk's middleware and this sync system work together seamlessly.

### Q: What about rate limiting?

**A:** The sync endpoint has no rate limiting. However, the sync only happens once per session due to sessionStorage, so abuse is not a concern.

---

## Summary

### What You Have

✅ **Client-side sync** - Works immediately, no setup  
✅ **Tier preservation** - Existing users keep their tier  
✅ **Session-based** - No duplicate syncs  
✅ **Production ready** - Deploy anywhere  
✅ **Zero dependencies** - No ngrok, no webhooks required  

### Next Steps

1. ✅ Test new user signup
2. ✅ Test tier preservation
3. ✅ Build your features
4. ✅ Deploy to production

### Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Documentation Files

This documentation system includes:

| File | Purpose |
|------|---------|
| **USER_SYNC_DOCUMENTATION.md** | This file - Complete reference |
| **READY_TO_USE.md** | Quick start guide with testing |
| **CLIENT_SIDE_SYNC.md** | Client-side implementation details |
| **WEBHOOK_TROUBLESHOOTING.md** | Webhook setup guide (optional) |
| **USER_SYNC_VERIFICATION.md** | Testing procedures |
| **CLERK_SETUP.md** | Clerk configuration guide |

---

**Last Updated:** 2024-11-28  
**Version:** 2.0 (Client-Side Sync)  
**Status:** Production Ready ✅
