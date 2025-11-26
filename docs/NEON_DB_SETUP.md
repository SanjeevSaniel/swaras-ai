# Neon Database Setup Guide

This guide will help you set up Neon PostgreSQL database for Swaras AI.

## Prerequisites

- Neon account (sign up at https://neon.tech)
- Clerk account for authentication webhooks

## Step 1: Create Neon Database

1. Go to https://console.neon.tech
2. Create a new project named "swaras-ai"
3. Copy your database connection string
4. Add it to your `.env` file:

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

## Step 2: Run Database Schema

1. Open the Neon SQL Editor in your dashboard
2. Copy the contents of `src/lib/db/schema.sql`
3. Paste and execute the SQL script

This will create:
- `tier_plans` table with FREE, PRO, and UNLIMITED tiers
- `users` table for user data and rate limiting
- `personas` table for AI persona configurations
- `user_conversations` table for conversation history
- `usage_logs` table for analytics
- All necessary indexes and triggers

## Step 3: Seed Initial Data

Run the seed script to populate personas and tier plans:

```bash
npx tsx src/lib/db/seed.ts
```

Or add to package.json:

```json
{
  "scripts": {
    "db:seed": "tsx src/lib/db/seed.ts"
  }
}
```

Then run:

```bash
npm run db:seed
```

## Step 4: Set Up Clerk Webhook

### 4.1 Get Webhook Secret

1. Go to Clerk Dashboard > Webhooks
2. Click "Add Endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/clerk`
4. Select events to listen for:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the "Signing Secret"

### 4.2 Add to Environment

Add the webhook secret to `.env`:

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 4.3 Test Webhook (Development)

For local development, use ngrok or similar:

```bash
ngrok http 3000
```

Update Clerk webhook URL to: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`

## Step 5: Verify Setup

### 5.1 Check Database Tables

Run in Neon SQL Editor:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see: tier_plans, users, personas, user_conversations, usage_logs

### 5.2 Check Tier Plans

```sql
SELECT * FROM tier_plans;
```

Should return 3 rows: FREE, PRO, UNLIMITED

### 5.3 Check Personas

```sql
SELECT persona_key, name FROM personas WHERE is_enabled = true;
```

Should show your seeded personas

## Step 6: Update Environment Variables

Complete `.env` file should include:

```env
# Neon Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxx
CLERK_SECRET_KEY=sk_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# App URL (for production)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## How It Works

### User Flow

1. **User Signs Up with Clerk**
   - Webhook triggers `user.created` event
   - Webhook creates user in Neon DB with FREE tier
   - User starts with 10 messages/day

2. **User Sends Message**
   - API checks rate limit from Neon DB
   - If allowed, processes message
   - Increments usage counter
   - Auto-resets at midnight IST

3. **Daily Reset**
   - Resets happen automatically at midnight IST
   - Calculated per-user on each request
   - No cron jobs needed

### Rate Limiting

Rate limiting is now database-driven:
- User tier determines daily limit
- Counter resets at midnight IST
- IST offset: UTC + 5:30
- All calculations done server-side

### Persona Management

Personas are now stored in database:
- Easy to add/update via admin panel (future)
- System prompts versioned in database
- Can enable/disable personas dynamically
- Metadata supports social links, stats, etc.

## Database Management

### Add New Persona

```sql
INSERT INTO personas (
  persona_key, name, title, avatar_url, description,
  system_prompt, specialty, greeting_message, sort_order
) VALUES (
  'new_persona',
  'New Persona Name',
  'Title/Role',
  '/avatars/persona.jpg',
  'Description',
  'System prompt here...',
  'Specialty',
  'Greeting message',
  10
);
```

### Update User Tier

```sql
UPDATE users
SET tier_plan_id = (SELECT id FROM tier_plans WHERE name = 'PRO')
WHERE clerk_user_id = 'user_xxxxx';
```

### Check Usage Analytics

```sql
SELECT
  COUNT(*) as total_users,
  SUM(daily_message_count) as today_messages,
  SUM(total_messages_sent) as all_time_messages
FROM users;
```

### View User Activity

```sql
SELECT
  u.email,
  u.daily_message_count,
  t.display_name as tier,
  u.last_reset_date
FROM users u
JOIN tier_plans t ON u.tier_plan_id = t.id
ORDER BY u.daily_message_count DESC
LIMIT 10;
```

## Troubleshooting

### Issue: Users not syncing from Clerk

**Solution:**
1. Check webhook is configured in Clerk
2. Verify CLERK_WEBHOOK_SECRET in .env
3. Check webhook endpoint logs
4. Test webhook manually in Clerk dashboard

### Issue: Rate limit not resetting

**Solution:**
1. Check `last_reset_date` in users table
2. Verify IST calculation in actions.ts
3. Manually reset: `UPDATE users SET last_reset_date = CURRENT_DATE - 1`

### Issue: Personas not loading

**Solution:**
1. Run seed script: `npm run db:seed`
2. Check personas table: `SELECT * FROM personas`
3. Verify `is_enabled = true`

## Migration from Old System

The old rate-limiter (Clerk metadata) is now deprecated. All new requests use Neon DB.

To migrate existing users:
1. Webhook will create DB entries on next sign-in
2. Or run a migration script to sync all Clerk users
3. Old metadata will be ignored

## Security Notes

1. **Never commit DATABASE_URL** - Use environment variables
2. **Webhook secret is sensitive** - Rotate if exposed
3. **Use SSL mode** - Required for Neon connections
4. **Validate inputs** - All user inputs are parameterized
5. **Rate limit API routes** - Protect against abuse

## Performance Tips

1. **Indexes are created** - Key lookups are fast
2. **Connection pooling** - Neon handles automatically
3. **Cache persona data** - Consider Redis for production
4. **Batch operations** - Use transactions for multiple queries
5. **Monitor query performance** - Use Neon analytics

## Next Steps

1. ✅ Database schema created
2. ✅ Webhook configured
3. ✅ Rate limiting active
4. 🔄 Add admin panel for persona management
5. 🔄 Add analytics dashboard
6. 🔄 Implement conversation persistence
7. 🔄 Add usage analytics and insights

## Support

For issues or questions:
- Check Neon docs: https://neon.tech/docs
- Clerk webhook guide: https://clerk.com/docs/webhooks
- GitHub issues: [Your repo URL]
