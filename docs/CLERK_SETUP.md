# Clerk Authentication Setup Guide

## 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

## 2. Get Your API Keys

1. In the Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

## 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory
2. Copy the contents from `.env.local.example`
3. Replace the placeholder values with your actual Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
```

## 4. Configure Clerk Dashboard

### Authentication Options

1. In Clerk Dashboard, go to **User & Authentication** → **Email, Phone, Username**
2. Enable the authentication methods you want:
   - ✅ Email address (recommended)
   - ✅ Google OAuth (optional)
   - ✅ GitHub OAuth (optional)

### Customize Sign In/Up Experience

1. Go to **Customization** → **Components**
2. Configure the appearance to match your brand
3. Set up custom branding (logo, colors)

## 5. Test Your Setup

1. Start the development server:
```bash
npm run dev
```

2. Visit [http://localhost:3000](http://localhost:3000)
3. Click "Get Started" or "Sign Up"
4. Complete the sign-up process
5. You should be redirected to the main app

## 6. Important Security Notes

⚠️ **NEVER commit your `.env.local` file to git**
- The `.env.local` file is already in `.gitignore`
- Only share keys through secure channels
- Use different keys for development and production

## 7. Production Deployment

### Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add your Clerk keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Other Platforms

Add the same environment variables to your hosting platform's settings.

## 8. Webhook Setup (Required for Data Sync)

> **⚠️ IMPORTANT**: Webhooks are **required** for keeping Clerk user data synchronized with your Neon database. Without webhooks, user data will not sync properly.

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Enter your webhook URL:
   - Development: `https://your-domain.ngrok.io/api/webhooks/clerk`
   - Production: `https://your-domain.com/api/webhooks/clerk`
4. Select these events (required):
   - ✅ `user.created` - Syncs new users to database
   - ✅ `user.updated` - Updates user profile data (preserves tier)
   - ✅ `user.deleted` - Removes users from database
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add it to your environment variables:
```env
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Why Webhooks Are Critical

- **Automatic Sync**: User data is automatically synced when users sign up or update their profile
- **Tier Preservation**: New users get FREE tier; existing users keep their current tier (PRO/MAXX)
- **Profile Updates**: Email, name, and profile image stay in sync between Clerk and your database
- **No Client-Side Code**: All synchronization happens server-side through webhooks

### Testing Webhooks Locally

For local development, use a tool like [ngrok](https://ngrok.com) to expose your localhost:

```bash
ngrok http 3000
```

Then use the ngrok URL in your Clerk webhook settings.

## Features Enabled

✅ **User Authentication** - Sign up, sign in, sign out
✅ **Protected Routes** - App is only accessible when signed in
✅ **Session Management** - Automatic session handling
✅ **User Profile** - Built-in user profile management
✅ **Social Login** - Google, GitHub, etc. (configurable)

## Troubleshooting

### "Invalid publishable key" error
- Verify your key starts with `pk_test_` or `pk_live_`
- Check for extra spaces or quotes in `.env.local`
- Restart your development server after adding keys

### Authentication not working
- Clear your browser cache and cookies
- Check the Clerk Dashboard logs for errors
- Ensure your API keys are correct

### Need Help?
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Integration Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Discord Community](https://clerk.com/discord)
