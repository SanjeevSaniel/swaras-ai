# Drizzle ORM + Neon Database Setup Guide

This guide will help you set up the database for Swaras AI using Drizzle ORM and Neon (PostgreSQL).

## 📋 Prerequisites

- A Neon account (sign up at https://neon.tech)
- Node.js 18+ installed
- Git repository cloned locally

## 🗄️ Database Schema

The application uses the following tables:

### 1. **users** table
Stores user information synced from Clerk authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | Clerk user ID |
| email | varchar(255) | User email address |
| firstName | varchar(100) | User first name |
| lastName | varchar(100) | User last name |
| imageUrl | text | User profile image URL |
| tier | varchar(20) | Subscription tier (FREE/PRO/UNLIMITED) |
| createdAt | timestamp | Account creation timestamp |
| updatedAt | timestamp | Last update timestamp |

### 2. **rateLimits** table
Tracks daily message usage per user with IST timezone reset.

| Column | Type | Description |
|--------|------|-------------|
| userId | text (PK, FK) | References users.id |
| messageCount | integer | Daily message count |
| lastResetAt | timestamp | Last reset timestamp (IST midnight) |
| createdAt | timestamp | Record creation timestamp |
| updatedAt | timestamp | Last update timestamp |

### 3. **conversations** table
Stores chat conversations between users and AI personas.

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | Unique conversation ID |
| userId | text (FK) | References users.id |
| personaId | varchar(50) | AI persona identifier |
| title | varchar(255) | Conversation title |
| createdAt | timestamp | Conversation creation timestamp |
| updatedAt | timestamp | Last message timestamp |

### 4. **messages** table
Stores individual messages within conversations.

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | Unique message ID |
| conversationId | text (FK) | References conversations.id |
| role | varchar(20) | 'user' or 'assistant' |
| content | text | Message content |
| createdAt | timestamp | Message timestamp |

## 🚀 Step-by-Step Setup

### Step 1: Create Neon Database

1. Go to https://neon.tech and sign in
2. Click "Create Project"
3. Choose a project name (e.g., "swaras-ai")
4. Select a region close to your users (e.g., `us-east-1`)
5. Click "Create Project"

### Step 2: Get Database Connection String

1. In your Neon project dashboard, find the "Connection String" section
2. Select "Node.js" as the connection type
3. Copy the connection string (it looks like this):
   ```
   postgresql://[username]:[password]@[host]/[database]?sslmode=require
   ```

### Step 3: Set Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Neon database URL to `.env`:
   ```env
   DATABASE_URL=postgresql://[username]:[password]@[host]/[database]?sslmode=require
   ```

3. Ensure other required environment variables are set:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxx
   CLERK_SECRET_KEY=sk_xxxxx
   CLERK_WEBHOOK_SECRET=whsec_xxxxx

   # OpenAI API
   OPENAI_API_KEY=sk-xxxxx

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

### Step 4: Generate and Run Migrations

1. **Generate migration files** from the schema:
   ```bash
   npm run db:generate
   ```

   This will create SQL migration files in the `drizzle/` directory based on your schema.

2. **Push schema to database** (creates tables):
   ```bash
   npm run db:push
   ```

   This command will:
   - Connect to your Neon database
   - Create all tables with proper indexes
   - Set up foreign key relationships
   - Apply CASCADE delete rules

### Step 5: Configure Clerk Webhook

The Clerk webhook automatically syncs user data to your database when users sign up, update their profile, or delete their account.

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Select your application
3. Navigate to "Webhooks" in the sidebar
4. Click "Add Endpoint"
5. Enter your webhook URL:
   - Development: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - Production: `https://your-domain.com/api/webhooks/clerk`
6. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
7. Copy the "Signing Secret" (starts with `whsec_`)
8. Add it to your `.env`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Step 6: Test Database Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Sign in to your application
3. Check the server console for logs:
   ```
   📨 Clerk Webhook received: user.created
   ✅ User created in database: user_xxxxx
   ```

4. Try sending a message to any AI persona
5. Check the rate limit counter to verify it's working

## 🛠️ Available Database Scripts

```bash
# Generate migration files from schema
npm run db:generate

# Push schema changes to database
npm run db:push

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio (visual database browser)
npm run db:studio
```

## 🔍 Drizzle Studio (Database GUI)

Drizzle Studio is a visual tool to browse and manage your database:

```bash
npm run db:studio
```

This will open https://local.drizzle.studio where you can:
- View all tables and data
- Run queries
- Edit records
- Check relationships

## 📊 Rate Limiting Configuration

Rate limits are defined in `src/lib/rate-limiter-db.ts`:

```typescript
export const RATE_LIMIT_TIERS = {
  FREE: {
    name: 'Free',
    dailyLimit: 10,
    resetHour: 0, // Resets at midnight IST (UTC+5:30)
  },
  PRO: {
    name: 'Pro',
    dailyLimit: 200,
    resetHour: 0,
  },
  UNLIMITED: {
    name: 'Unlimited',
    dailyLimit: Number.MAX_SAFE_INTEGER,
    resetHour: 0,
  },
};
```

### Changing User Tiers

To change a user's tier, update their `tier` field in the `users` table:

```sql
UPDATE users SET tier = 'PRO' WHERE email = 'user@example.com';
```

Or use Drizzle Studio's GUI to edit the user record.

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** for all secrets
3. **Rotate credentials regularly** in production
4. **Enable SSL** - Neon enforces SSL by default (`?sslmode=require`)
5. **Use prepared statements** - Drizzle ORM protects against SQL injection

## 🐛 Troubleshooting

### Error: "DATABASE_URL environment variable is not set"

**Solution:** Make sure you have a `.env` file with `DATABASE_URL` set.

### Error: "Invalid connection string"

**Solution:** Check that your Neon connection string is correct and includes `?sslmode=require` at the end.

### Error: "relation 'users' does not exist"

**Solution:** Run migrations:
```bash
npm run db:push
```

### Webhook not receiving events

**Solution:**
1. Check that `CLERK_WEBHOOK_SECRET` is set correctly in `.env`
2. Verify webhook URL is correct in Clerk dashboard
3. For local development, use ngrok to expose your localhost
4. Check server logs for webhook verification errors

### Rate limit not resetting at midnight IST

**Solution:** The IST timezone calculation is built into the `rate-limiter-db.ts` functions. Verify:
1. Server time zone doesn't matter - calculations are based on UTC
2. Check `lastResetAt` in the `rateLimits` table
3. The reset happens on the next API call after midnight IST

## 📚 Additional Resources

- Drizzle ORM Documentation: https://orm.drizzle.team/
- Neon Documentation: https://neon.tech/docs
- Clerk Webhooks Guide: https://clerk.com/docs/webhooks
- PostgreSQL Documentation: https://www.postgresql.org/docs/

## 🎯 Next Steps

After completing the database setup:

1. **Test authentication flow** - Sign up a new user and verify database sync
2. **Test rate limiting** - Send messages and watch the counter
3. **Test IST reset** - Check that limits reset at midnight IST
4. **Monitor logs** - Watch for any database errors
5. **Set up backups** - Configure Neon automated backups in production

Your database is now fully set up and integrated with Drizzle ORM! 🎉
