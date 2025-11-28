# Automatic User Synchronization - Complete Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Implementation Details](#implementation-details)
4. [How It Works](#how-it-works)
5. [Setup & Configuration](#setup--configuration)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)

---

## Overview

SwarAI implements **automatic user synchronization** between Clerk (authentication provider) and Neon DB (application database). This ensures that user data is consistent across both systems without requiring manual intervention or complex webhook configurations.

### Key Features

- ✅ **Zero Configuration** - Works out of the box
- ✅ **Automatic Sync** - Syncs users on authentication
- ✅ **Fallback Mechanism** - Catches any missed users
- ✅ **Development Friendly** - No ngrok or tunnels needed
- ✅ **Production Ready** - Deploy anywhere
- ✅ **Secure** - Authentication verified
- ✅ **Efficient** - Prevents duplicate syncs

### Why This Approach?

Traditional webhook-based sync requires:
- Setting up ngrok or similar tunnels for local development
- Configuring webhook endpoints in Clerk Dashboard
- Managing webhook secrets
- Handling webhook delivery failures

Our fallback approach:
- Works immediately without configuration
- Syncs users automatically on login
- Self-healing (updates on every login)
- No external dependencies

---

## Architecture

### System Components

```mermaid
graph TB
    User[User]
    Clerk[Clerk Authentication]
    App[SwarAI Application]
    Hook[useUserSync Hook]
    API[/api/user/sync]
    NeonDB[(Neon Database)]
    
    User -->|Sign Up/Login| Clerk
    Clerk -->|Session| App
    App -->|Auto-trigger| Hook
    Hook -->|POST| API
    API -->|Sync| NeonDB
    
    style Clerk fill:#6366f1,color:#fff
    style NeonDB fill:#10b981,color:#fff
    style Hook fill:#f59e0b,color:#fff
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Clerk
    participant A as App Component
    participant H as useUserSync Hook
    participant API as /api/user/sync
    participant DB as Neon Database

    U->>C: Sign up/Login
    C->>C: Authenticate
    C-->>A: User session created
    A->>H: Component mounts
    H->>H: Check isLoaded & user
    H->>API: POST user data
    API->>API: Verify auth
    API->>DB: INSERT/UPDATE user
    DB-->>API: Success
    API-->>H: 200 OK
    H->>H: Mark as synced
    Note over U,DB: User now in both systems
```

---

## Implementation Details

### File Structure

```
src/
├── hooks/
│   └── useUserSync.ts          # Auto-sync hook
├── app/
│   └── api/
│       └── user/
│           └── sync/
│               └── route.ts     # Sync API endpoint
├── lib/
│   └── rate-limiter-db.ts      # Database sync function
└── components/
    └── swaras-ai.tsx            # Main component (uses hook)

scripts/
└── sync-clerk-users.ts          # Manual bulk sync script

docs/
├── AUTO_USER_SYNC_GUIDE.md      # This file
└── USER_SYNC_ARCHITECTURE.md    # Architecture overview
```

### 1. useUserSync Hook

**Location:** `src/hooks/useUserSync.ts`

**Purpose:** Automatically sync Clerk users to Neon DB when they authenticate

**Code Overview:**

```typescript
export function useUserSync() {
  const { user, isLoaded } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    // Debug logging
    console.log('🔍 useUserSync effect running:', { 
      isLoaded, 
      hasUser: !!user, 
      userId: user?.id,
      alreadySynced: syncedRef.current 
    });

    // Guard clauses
    if (!isLoaded) {
      console.log('⏳ Waiting for Clerk to load...');
      return;
    }

    if (!user) {
      console.log('⚠️ No user authenticated');
      return;
    }

    if (syncedRef.current) {
      console.log('✓ User already synced in this session');
      return;
    }

    // Sync user to database
    const syncUser = async () => {
      try {
        console.log('🔄 Syncing user to database:', user.id);
        
        const response = await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          }),
        });

        if (response.ok) {
          console.log('✅ User synced to database');
          syncedRef.current = true;
        } else {
          console.error('❌ Failed to sync user:', await response.text());
        }
      } catch (error) {
        console.error('❌ Error syncing user:', error);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return { user, isLoaded };
}
```

**Key Features:**

- **Guard Clauses:** Checks `isLoaded`, `user`, and `syncedRef` before syncing
- **Debug Logging:** Comprehensive logs for troubleshooting
- **Ref-based Deduplication:** Prevents multiple syncs in same session
- **Error Handling:** Catches and logs sync failures
- **Same Interface:** Returns `{ user, isLoaded }` like `useUser()`

### 2. Sync API Endpoint

**Location:** `src/app/api/user/sync/route.ts`

**Purpose:** Securely sync user data to Neon database

**Code Overview:**

```typescript
export async function POST(req: Request) {
  try {
    // Verify authentication
    const { userId: authUserId } = await auth();
    
    if (!authUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { userId, email, firstName, lastName, imageUrl } = body;

    // Verify user ID matches authenticated user
    if (authUserId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: User ID mismatch' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Sync to database
    const success = await syncUserToDatabase(
      userId,
      email,
      firstName,
      lastName,
      imageUrl,
      'FREE' // Default tier
    );

    if (success) {
      console.log(`✅ User synced to database: ${userId}`);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to sync user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error in user sync API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Security Features:**

- ✅ **Authentication Required:** Uses `auth()` from Clerk
- ✅ **User ID Validation:** Ensures authenticated user matches request
- ✅ **Input Validation:** Validates required fields
- ✅ **Error Handling:** Returns appropriate HTTP status codes

### 3. Database Sync Function

**Location:** `src/lib/rate-limiter-db.ts`

**Function:** `syncUserToDatabase()`

**Purpose:** Insert or update user in Neon database

**Code Overview:**

```typescript
export async function syncUserToDatabase(
  userId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  tier: string = 'FREE',
) {
  try {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser) {
      // Update existing user
      await db
        .update(users)
        .set({
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl || null,
          tier,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      // Insert new user
      await db.insert(users).values({
        id: userId,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        tier,
      });
    }

    return true;
  } catch (error) {
    console.error('Error syncing user to database:', error);
    return false;
  }
}
```

**Features:**

- **Upsert Logic:** Updates existing users, inserts new ones
- **Null Handling:** Converts undefined to null for database
- **Timestamp Management:** Updates `updatedAt` on changes
- **Error Handling:** Returns boolean success status

### 4. Component Integration

**Location:** `src/components/swaras-ai.tsx`

**Changes Made:**

```typescript
// Before
import { useUser } from '@clerk/nextjs';
const { user } = useUser();

// After
import { useUserSync } from '@/hooks/useUserSync';
const { user } = useUserSync();
```

**Impact:**

- ✅ Drop-in replacement for `useUser()`
- ✅ No other code changes needed
- ✅ Automatic sync on component mount
- ✅ Works with existing authentication flow

---

## How It Works

### Step-by-Step Flow

1. **User Authentication**
   - User signs up or logs in via Clerk
   - Clerk creates/validates user session
   - Session token stored in cookies

2. **Component Mount**
   - `SwarasAI` component mounts
   - `useUserSync()` hook initializes
   - Hook calls `useUser()` from Clerk

3. **User Detection**
   - Hook checks `isLoaded` status
   - Hook checks if `user` object exists
   - Hook checks `syncedRef` to prevent duplicates

4. **Sync Trigger**
   - If all checks pass, sync function executes
   - POST request sent to `/api/user/sync`
   - User data included in request body

5. **API Validation**
   - API verifies user is authenticated
   - API validates user ID matches session
   - API validates required fields present

6. **Database Sync**
   - API calls `syncUserToDatabase()`
   - Function checks if user exists
   - Inserts new user or updates existing

7. **Completion**
   - API returns success response
   - Hook marks user as synced (`syncedRef.current = true`)
   - Console logs success message

### Sync Timing

| Event | Clerk | Neon DB | Sync Method |
|-------|-------|---------|-------------|
| User signs up | Immediate | On first login | useUserSync hook |
| User logs in | Immediate | Every login | useUserSync hook |
| User updates profile | Immediate | Next login | useUserSync hook |
| Page refresh | Session maintained | Re-sync (idempotent) | useUserSync hook |
| New session | New session | Sync again | useUserSync hook |

### Preventing Duplicate Syncs

The hook uses a `useRef` to track sync status:

```typescript
const syncedRef = useRef(false);

// Before syncing
if (syncedRef.current) {
  console.log('✓ User already synced in this session');
  return;
}

// After successful sync
syncedRef.current = true;
```

**Behavior:**
- ✅ Syncs once per component mount
- ✅ Prevents multiple API calls in same session
- ✅ Resets on page refresh (new component instance)
- ✅ Ensures database stays up-to-date

---

## Setup & Configuration

### Prerequisites

- ✅ Clerk account and application configured
- ✅ Neon database with users table
- ✅ Environment variables set in `.env.local`

### Environment Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon Database
DATABASE_URL=postgresql://...
```

### Database Schema

The `users` table must exist with this schema:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  tier TEXT DEFAULT 'FREE',      -- FREE, PRO, MAXX
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Installation Steps

**1. Files Already Created:**

The following files have been created for you:

- ✅ `src/hooks/useUserSync.ts`
- ✅ `src/app/api/user/sync/route.ts`
- ✅ `src/lib/rate-limiter-db.ts` (updated)
- ✅ `src/components/swaras-ai.tsx` (updated)

**2. No Additional Setup Required:**

The auto-sync is already integrated and working. No configuration needed!

**3. Verify It's Working:**

```bash
# Start dev server
npm run dev

# Open browser console
# Look for these logs:
# 🔍 useUserSync effect running: {isLoaded: true, hasUser: true, ...}
# 🔄 Syncing user to database: user_...
# ✅ User synced to database
```

---

## Testing & Verification

### Console Logs

When auto-sync is working, you'll see these logs in the browser console:

```
🔍 useUserSync effect running: {isLoaded: true, hasUser: true, userId: 'user_2jF...', alreadySynced: false}
🔄 Syncing user to database: user_2jF...
✅ User synced to database
🔍 useUserSync effect running: {isLoaded: true, hasUser: true, userId: 'user_2jF...', alreadySynced: true}
✓ User already synced in this session
```

### Test Cases

#### Test 1: Existing User Login

1. Log in with an existing account
2. Check browser console for sync logs
3. Verify in Drizzle Studio:
   ```bash
   npm run db:studio
   ```
4. Check `users` table for your user
5. Verify `updated_at` timestamp is recent

**Expected Result:** User data updated in database

#### Test 2: New User Signup

1. Sign out from current account
2. Create a new account via sign-up
3. Check browser console for sync logs
4. Verify in Drizzle Studio
5. Check `users` table for new user

**Expected Result:** New user created in database

#### Test 3: Page Refresh

1. Refresh the page while logged in
2. Check console logs
3. Should see sync attempt again
4. Database should show same user (idempotent)

**Expected Result:** User re-synced (no duplicates)

#### Test 4: Manual Bulk Sync

Test the manual sync script:

```bash
npm run sync:clerk-users
```

**Expected Output:**
```
🔄 Starting Clerk user sync...

📦 Processing batch: 1 to 11
✅ Synced: user1@example.com (user_abc123)
✅ Synced: user2@example.com (user_def456)
...

==================================================
📊 Sync Summary:
==================================================
✅ Successfully synced: 11
⚠️  Skipped: 0
❌ Errors: 0
📈 Total processed: 11
==================================================

🎉 All users synced successfully!
```

### Verification Checklist

- [ ] Console shows "🔄 Syncing user to database"
- [ ] Console shows "✅ User synced to database"
- [ ] No errors in console
- [ ] User appears in Drizzle Studio
- [ ] User data matches Clerk profile
- [ ] Duplicate syncs prevented (ref check works)
- [ ] Manual sync script works
- [ ] All existing users synced

---

## Troubleshooting

### Issue: No Sync Logs in Console

**Symptoms:**
- No "🔍 useUserSync effect running" logs
- Hook not executing

**Possible Causes:**
1. Dev server not restarted after adding hook
2. Hook not imported in component
3. Component not mounting

**Solutions:**

```bash
# 1. Restart dev server
# Press Ctrl+C to stop
npm run dev

# 2. Hard refresh browser
# Press Ctrl+Shift+R (Windows/Linux)
# Press Cmd+Shift+R (Mac)

# 3. Check import
# In src/components/swaras-ai.tsx:
import { useUserSync } from '@/hooks/useUserSync';
const { user } = useUserSync();
```

### Issue: "⚠️ No user authenticated"

**Symptoms:**
- Console shows "No user authenticated"
- User is logged in but not detected

**Possible Causes:**
1. Clerk not fully loaded
2. Session expired
3. Clerk configuration issue

**Solutions:**

```bash
# 1. Check Clerk environment variables
# In .env.local:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# 2. Clear cookies and re-login
# Browser DevTools > Application > Cookies > Clear All

# 3. Check Clerk Dashboard
# Verify user exists in Clerk Dashboard
```

### Issue: "❌ Failed to sync user: 401 Unauthorized"

**Symptoms:**
- Sync fails with 401 error
- User not authenticated in API

**Possible Causes:**
1. Session token invalid
2. Clerk middleware not configured
3. API route not protected correctly

**Solutions:**

```typescript
// Check middleware.ts includes API route
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

// Verify auth() is called in API route
const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Issue: "❌ Failed to sync user: 403 Forbidden"

**Symptoms:**
- Sync fails with 403 error
- User ID mismatch

**Possible Causes:**
1. Request userId doesn't match authenticated userId
2. Malformed request body

**Solutions:**

```typescript
// Check request body format
{
  userId: user.id,              // Must match auth()
  email: user.primaryEmailAddress?.emailAddress,
  firstName: user.firstName,
  lastName: user.lastName,
  imageUrl: user.imageUrl,
}

// Verify API validation
if (authUserId !== userId) {
  return NextResponse.json(
    { error: 'Forbidden: User ID mismatch' },
    { status: 403 }
  );
}
```

### Issue: Database Connection Error

**Symptoms:**
- Sync fails with database error
- "Error syncing user to database" in logs

**Possible Causes:**
1. Invalid DATABASE_URL
2. Database not accessible
3. Table doesn't exist

**Solutions:**

```bash
# 1. Verify DATABASE_URL
# In .env.local:
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# 2. Test database connection
npm run db:studio

# 3. Check if users table exists
# In Drizzle Studio, look for 'users' table

# 4. Run migrations if needed
npm run db:push
```

### Issue: Duplicate Users Created

**Symptoms:**
- Multiple users with same email
- Sync creates duplicates

**Possible Causes:**
1. User ID not matching
2. Email constraint not enforced
3. Race condition

**Solutions:**

```sql
-- Ensure email is unique
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Check for duplicates
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Remove duplicates (keep most recent)
DELETE FROM users a
USING users b
WHERE a.id < b.id
AND a.email = b.email;
```

### Debug Mode

Enable verbose logging:

```typescript
// In useUserSync.ts, add more logs:
console.log('📋 User object:', user);
console.log('📋 Request body:', JSON.stringify({
  userId: user.id,
  email: user.primaryEmailAddress?.emailAddress,
  firstName: user.firstName,
  lastName: user.lastName,
  imageUrl: user.imageUrl,
}));
```

---

## API Reference

### useUserSync Hook

```typescript
function useUserSync(): {
  user: User | null | undefined;
  isLoaded: boolean;
}
```

**Returns:**
- `user`: Clerk user object (same as `useUser()`)
- `isLoaded`: Whether Clerk has finished loading

**Usage:**
```typescript
import { useUserSync } from '@/hooks/useUserSync';

function MyComponent() {
  const { user, isLoaded } = useUserSync();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome, {user.firstName}!</div>;
}
```

### POST /api/user/sync

**Endpoint:** `/api/user/sync`

**Method:** `POST`

**Authentication:** Required (Clerk session)

**Request Body:**
```typescript
{
  userId: string;        // Clerk user ID
  email: string;         // Primary email address
  firstName?: string;    // Optional first name
  lastName?: string;     // Optional last name
  imageUrl?: string;     // Optional profile image URL
}
```

**Response (Success):**
```json
{
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing email)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (user ID mismatch)
- `500` - Internal server error

**Example:**
```typescript
const response = await fetch('/api/user/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_2abc123',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    imageUrl: 'https://img.clerk.com/...',
  }),
});

const data = await response.json();
console.log(data); // { success: true }
```

### syncUserToDatabase Function

```typescript
async function syncUserToDatabase(
  userId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  tier?: string
): Promise<boolean>
```

**Parameters:**
- `userId` - Clerk user ID (required)
- `email` - User email address (required)
- `firstName` - User first name (optional)
- `lastName` - User last name (optional)
- `imageUrl` - Profile image URL (optional)
- `tier` - User tier: 'FREE', 'PRO', or 'MAXX' (default: 'FREE')

**Returns:**
- `true` if sync successful
- `false` if sync failed

**Example:**
```typescript
import { syncUserToDatabase } from '@/lib/rate-limiter-db';

const success = await syncUserToDatabase(
  'user_2abc123',
  'user@example.com',
  'John',
  'Doe',
  'https://img.clerk.com/...',
  'FREE'
);

if (success) {
  console.log('User synced successfully');
} else {
  console.error('Failed to sync user');
}
```

---

## Best Practices

### 1. Error Handling

Always handle sync errors gracefully:

```typescript
try {
  const response = await fetch('/api/user/sync', { /* ... */ });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Sync failed:', error);
    // Don't block user experience
    // Sync will retry on next login
  }
} catch (error) {
  console.error('Network error:', error);
  // User can still use the app
}
```

### 2. Logging

Use consistent log prefixes for easy filtering:

```typescript
console.log('🔍 useUserSync effect running:', data);  // Debug
console.log('🔄 Syncing user to database:', userId);  // Info
console.log('✅ User synced to database');            // Success
console.error('❌ Failed to sync user:', error);      // Error
```

### 3. Performance

The hook is already optimized:

- ✅ Syncs only once per session
- ✅ Uses `useRef` to prevent re-renders
- ✅ Runs asynchronously (non-blocking)
- ✅ No impact on page load time

### 4. Security

Always validate on the server:

```typescript
// ❌ Don't trust client data
const { userId } = await req.json();

// ✅ Verify with server-side auth
const { userId: authUserId } = await auth();
if (authUserId !== userId) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 5. Database Migrations

When updating user schema:

```typescript
// 1. Add new column to database
ALTER TABLE users ADD COLUMN phone TEXT;

// 2. Update syncUserToDatabase function
await db.insert(users).values({
  id: userId,
  email,
  firstName: firstName || null,
  lastName: lastName || null,
  imageUrl: imageUrl || null,
  phone: phone || null,  // New field
  tier,
});

// 3. Update API endpoint to accept phone
const { userId, email, firstName, lastName, imageUrl, phone } = body;

// 4. Update hook to send phone
body: JSON.stringify({
  userId: user.id,
  email: user.primaryEmailAddress?.emailAddress,
  firstName: user.firstName,
  lastName: user.lastName,
  imageUrl: user.imageUrl,
  phone: user.primaryPhoneNumber?.phoneNumber,  // New field
}),
```

### 6. Testing

Test sync in different scenarios:

```typescript
// Test 1: New user signup
// Test 2: Existing user login
// Test 3: User profile update
// Test 4: Page refresh
// Test 5: Multiple tabs
// Test 6: Network failure
// Test 7: Database unavailable
```

### 7. Monitoring

Add monitoring for production:

```typescript
// Track sync success rate
if (response.ok) {
  analytics.track('user_sync_success', { userId: user.id });
} else {
  analytics.track('user_sync_failed', { 
    userId: user.id, 
    error: await response.text() 
  });
}
```

---

## Summary

### What We Built

1. **useUserSync Hook** - Automatically syncs users on authentication
2. **Sync API Endpoint** - Securely handles sync requests
3. **Database Function** - Inserts/updates users in Neon DB
4. **Component Integration** - Drop-in replacement for `useUser()`
5. **Manual Sync Script** - Bulk sync existing users

### Benefits

- ✅ **Zero Configuration** - Works immediately
- ✅ **Self-Healing** - Updates on every login
- ✅ **Development Friendly** - No webhooks needed
- ✅ **Production Ready** - Deploy anywhere
- ✅ **Secure** - Authentication verified
- ✅ **Reliable** - Fallback mechanism

### Next Steps

1. **Optional:** Add webhooks for instant sync (see `docs/CLERK_SETUP.md`)
2. **Optional:** Add analytics tracking
3. **Optional:** Add user tier management UI
4. **Optional:** Implement profile sync on updates

---

## Related Documentation

- [User Sync Architecture](./USER_SYNC_ARCHITECTURE.md) - Architecture overview
- [Clerk Setup Guide](./CLERK_SETUP.md) - Clerk configuration
- [Neon DB Setup](./NEON_DB_SETUP.md) - Database setup
- [Rate Limiting](../RATE_LIMITING.md) - Rate limiting implementation

---

**Last Updated:** 2025-11-28  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
