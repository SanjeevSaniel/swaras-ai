# Rate Limiting Feature

## Overview

This application now includes a comprehensive rate limiting system to prevent unauthorized usage and ensure fair access to AI personas across all users.

## Features

- **Per-User Daily Limits**: Each user has a daily message quota based on their tier
- **Automatic Reset**: Quota resets automatically at midnight UTC every day
- **Real-time Tracking**: Usage is tracked using Clerk's user metadata
- **Visual Feedback**: Users can see their remaining quota in the sidebar
- **Graceful Error Handling**: Clear error messages when limits are reached

## Rate Limit Tiers

### Free Tier (Default)
- **Daily Limit**: 30 messages
- **Reset Time**: Midnight UTC
- **Cost**: Free

### Pro Tier
- **Daily Limit**: 200 messages
- **Reset Time**: Midnight UTC
- **How to Upgrade**: Set `rateLimitTier: "PRO"` in Clerk user metadata

### Anonymous Tier
- **Total Limit**: 3 messages (Lifetime)
- **Tracking**: IP Address based
- **Reset**: Never (requires sign up)
- **Sync**: Across browsers and tabs

### Unlimited Tier
- **Daily Limit**: Unlimited
- **Reset Time**: N/A
- **How to Upgrade**: Set `rateLimitTier: "UNLIMITED"` in Clerk user metadata

## How It Works

### Backend (API)

1. **Authentication Check**: `/api/chat-ai` verifies user is signed in via Clerk
2. **Rate Limit Check**: Checks user's current usage against their tier limit
3. **Usage Increment**: Increments count after successful message processing
4. **Response Headers**: Returns rate limit info in headers:
   - `X-RateLimit-Limit`: Total daily limit
   - `X-RateLimit-Remaining`: Messages remaining
   - `X-RateLimit-Reset`: ISO timestamp for reset

### Frontend (UI)

1. **Sidebar Widget**: Displays daily quota with progress bar
2. **Visual Warnings**: Changes color when quota is low (>80%) or very low (>95%)
3. **Error Handling**: Shows user-friendly toast notifications when limit is exceeded
4. **Auto-Refresh**: Usage updates after each message

## File Structure

```
src/
├── lib/
│   └── rate-limiter.js          # Core rate limiting logic
├── app/api/
│   ├── chat-ai/route.js         # Chat API with rate limiting
│   └── user/usage/route.js      # User stats endpoint
└── components/
    ├── usage-quota.jsx          # Quota display component
    └── sidebar/
        └── app-sidebar.jsx      # Sidebar with quota widget
```

## Configuration

### Changing Tier Limits

Edit `src/lib/rate-limiter.js`:

```javascript
export const RATE_LIMIT_TIERS = {
  FREE: {
    name: 'Free',
    dailyLimit: 30,    // Change this
    resetHour: 0,
  },
  PRO: {
    name: 'Pro',
    dailyLimit: 200,   // Change this
    resetHour: 0,
  },
};
```

### Setting User Tier

Via Clerk Dashboard:
1. Go to Users → Select User
2. Navigate to "Metadata" tab
3. Add to Public Metadata:
```json
{
  "rateLimitTier": "PRO"
}
```

Via Clerk API:
```javascript
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    rateLimitTier: 'PRO'
  }
});
```

## API Endpoints

### GET /api/user/usage

Returns current user's usage statistics.

**Response:**
```json
{
  "tier": "FREE",
  "used": 15,
  "limit": 30,
  "remaining": 15,
  "percentage": 50,
  "resetAt": "2025-01-27T00:00:00.000Z"
}
```

### POST /api/chat-ai

Chat endpoint with rate limiting.

**Rate Limit Error (429):**
```json
{
  "error": "Rate limit exceeded",
  "message": "You've reached your daily limit of 30 messages. Please try again tomorrow.",
  "usage": {
    "current": 30,
    "limit": 30,
    "remaining": 0,
    "resetAt": "2025-01-27T00:00:00.000Z"
  },
  "tier": "FREE"
}
```

## Storage

Rate limiting uses **Clerk's private metadata** to store usage data:

```javascript
// Stored in user.privateMetadata.rateLimit
{
  count: 15,                        // Current message count
  lastResetTimestamp: 1706313600000 // Last reset time (UTC)
}
```

### Why Clerk Metadata?

- ✅ No additional database needed
- ✅ Encrypted and secure (private metadata)
- ✅ Scales with Clerk infrastructure
- ✅ Easy to query and update
- ✅ Per-user isolation

## Testing

### Test Rate Limiting Locally

1. Send 30 messages to any persona (Free tier limit)
2. On the 31st message, you should see:
   - Toast error: "Daily message limit reached"
   - API returns 429 status
   - Sidebar shows 0 remaining messages

### Reset Test User's Quota

```javascript
// Via Clerk API or Dashboard
await clerkClient.users.updateUserMetadata(userId, {
  privateMetadata: {
    rateLimit: {
      count: 0,
      lastResetTimestamp: Date.now()
    }
  }
});
```

### Upgrade Test User

```javascript
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    rateLimitTier: 'PRO'  // or 'UNLIMITED'
  }
});
```

## UI Components

### UsageQuota Component

Located in sidebar, shows:
- Current usage / daily limit
- Visual progress bar
- Remaining messages
- Reset countdown
- Warning alerts (when low)

**States:**
- **Normal** (< 80%): Blue progress bar
- **Low** (>= 80%): Orange warning
- **Very Low** (>= 95%): Red alert

## Future Enhancements

### Potential Upgrades

1. **Database Migration**: Move from Clerk metadata to dedicated database (MongoDB/PostgreSQL)
2. **Different Limits per Persona**: Some personas could have different quotas
3. **Hourly/Weekly Limits**: Add more granular time-based limits
4. **Usage Analytics**: Track usage patterns and popular personas
5. **Soft Limits**: Warn users before they hit hard limits
6. **Subscription Integration**: Connect with Stripe for paid tiers
7. **Admin Dashboard**: View all users' usage statistics
8. **Rate Limit Bypass**: Emergency override for specific users

## Troubleshooting

### Issue: Quota not resetting

**Cause**: Timezone mismatch or calculation error

**Solution**: Check `getTodayStart()` function uses UTC correctly:
```javascript
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
```

### Issue: Usage not incrementing

**Cause**: Clerk metadata update failing

**Solution**: Check Clerk API keys in `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Issue: Sidebar not showing quota

**Cause**: User not authenticated or API error

**Solution**: Check:
1. User is signed in via Clerk
2. `/api/user/usage` endpoint is accessible
3. Browser console for errors

## Security Considerations

- ✅ Rate limit stored in **private metadata** (not accessible to client)
- ✅ All checks done **server-side** (cannot be bypassed)
- ✅ Clerk authentication required for all rate-limited endpoints
- ✅ Usage incremented **after** successful API call (prevents free retries)
- ⚠️ Consider adding IP-based limiting for additional protection
- ⚠️ Monitor for unusual usage patterns

## Migration from Metadata to Database (Future)

When scaling beyond Clerk metadata, migrate to:

### Recommended Schema (MongoDB)

```javascript
{
  userId: String,      // Clerk user ID
  tier: String,        // 'FREE', 'PRO', 'UNLIMITED'
  dailyUsage: {
    count: Number,
    date: Date         // YYYY-MM-DD format
  },
  monthlyUsage: {
    count: Number,
    month: String      // YYYY-MM format
  },
  history: [{
    date: Date,
    messagesSent: Number,
    persona: String
  }]
}
```

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Author**: Swaras AI Team
