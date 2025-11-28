// src/app/api/webhooks/clerk/route.ts
// Clerk webhook to sync user data with Neon DB using Drizzle ORM

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { syncUserToDatabase, deleteUserFromDatabase } from '@/lib/rate-limiter-db';

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  console.log(`📨 Clerk Webhook received: ${eventType}`);

  try {
    if (eventType === 'user.created') {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        public_metadata,
      } = evt.data;

      const email = email_addresses[0]?.email_address;

      if (!email) {
        console.error('No email found for user');
        return new Response('Error: No email found', { status: 400 });
      }

      // Get tier from public metadata or default to FREE for new users
      const tier = (public_metadata?.tier as string) || 'FREE';

      // Sync new user to database with tier
      await syncUserToDatabase(
        id,
        email,
        first_name || undefined,
        last_name || undefined,
        image_url || undefined,
        tier,
      );

      console.log(`✅ User created in database: ${id} (tier: ${tier})`);

      return new Response(JSON.stringify({ success: true, userId: id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      const email = email_addresses[0]?.email_address;

      if (!email) {
        console.error('No email found for user');
        return new Response('Error: No email found', { status: 400 });
      }

      // Update user profile but preserve their existing tier
      await syncUserToDatabase(
        id,
        email,
        first_name || undefined,
        last_name || undefined,
        image_url || undefined,
        // Don't pass tier - let syncUserToDatabase preserve the existing tier
      );

      console.log(`✅ User profile updated in database: ${id}`);

      return new Response(JSON.stringify({ success: true, userId: id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      // Delete user from database (CASCADE will handle related records)
      await deleteUserFromDatabase(id);

      console.log(`🗑️ User deleted from database: ${id}`);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For other event types, just acknowledge receipt
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
