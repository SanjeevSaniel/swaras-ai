// src/db/schema.ts - Drizzle ORM schema definitions for Neon database
import { pgTable, text, timestamp, integer, varchar, index } from 'drizzle-orm/pg-core';

/**
 * Users table - synced from Clerk
 * Stores user information and subscription tier
 */
export const users = pgTable('users', {
  // Clerk user ID as primary key
  id: text('id').primaryKey(),

  // User profile information
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  imageUrl: text('image_url'),

  // Subscription tier - determines rate limits
  tier: varchar('tier', { length: 20 }).notNull().default('FREE'),
  // Possible values: 'FREE', 'PRO', 'UNLIMITED'

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Index on email for faster lookups
  emailIdx: index('email_idx').on(table.email),
  // Index on tier for analytics queries
  tierIdx: index('tier_idx').on(table.tier),
}));

/**
 * Rate limits table - tracks daily message usage per user
 * Stores usage count and reset timestamp in IST timezone
 */
export const rateLimits = pgTable('rate_limits', {
  // User ID (foreign key to users table)
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Daily message count
  messageCount: integer('message_count').notNull().default(0),

  // Last reset timestamp (stored as UTC, calculated for IST midnight)
  lastResetAt: timestamp('last_reset_at').defaultNow().notNull(),

  // Timestamps for tracking
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Index for efficiently querying resets
  lastResetIdx: index('last_reset_idx').on(table.lastResetAt),
}));

/**
 * Conversations table - stores chat history per user and persona
 */
export const conversations = pgTable('conversations', {
  // Auto-generated conversation ID
  id: text('id').primaryKey(),

  // User ID (foreign key to users table)
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Persona ID (references llm-prompts.ts personas)
  personaId: varchar('persona_id', { length: 50 }).notNull(),

  // Conversation title (auto-generated or user-set)
  title: varchar('title', { length: 255 }),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Composite index for user + persona lookups
  userPersonaIdx: index('user_persona_idx').on(table.userId, table.personaId),
  // Index for sorting by update time
  updatedAtIdx: index('updated_at_idx').on(table.updatedAt),
}));

/**
 * Messages table - stores individual messages in conversations
 */
export const messages = pgTable('messages', {
  // Auto-generated message ID
  id: text('id').primaryKey(),

  // Conversation ID (foreign key to conversations table)
  conversationId: text('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),

  // Message role: 'user' or 'assistant'
  role: varchar('role', { length: 20 }).notNull(),

  // Message content (text)
  content: text('content').notNull(),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Index for fetching messages by conversation
  conversationIdx: index('conversation_idx').on(table.conversationId),
  // Composite index for ordering messages within conversation
  conversationCreatedIdx: index('conversation_created_idx').on(
    table.conversationId,
    table.createdAt
  ),
}));

/**
 * Subscriptions table - tracks user subscription status and plan
 */
export const subscriptions = pgTable('subscriptions', {
  // Auto-generated subscription ID
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

  // User ID (foreign key to users table)
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Plan name: 'Free', 'Pro', 'Maxx'
  planName: varchar('plan_name', { length: 50 }).notNull(),

  // Subscription status: 'active', 'cancelled', 'expired'
  status: varchar('status', { length: 50 }).notNull().default('active'),

  // Subscription start date
  startedAt: timestamp('started_at').defaultNow().notNull(),

  // Subscription expiry date (null for lifetime/free plans)
  expiresAt: timestamp('expires_at'),

  // Cancellation date (if cancelled)
  cancelledAt: timestamp('cancelled_at'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Index for user lookups
  userIdx: index('subscriptions_user_idx').on(table.userId),
  // Index for status queries
  statusIdx: index('subscriptions_status_idx').on(table.status),
  // Composite index for active subscriptions per user
  userStatusIdx: index('subscriptions_user_status_idx').on(table.userId, table.status),
}));

/**
 * Payments table - stores payment transaction records
 */
export const payments = pgTable('payments', {
  // Auto-generated payment ID
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

  // User ID (foreign key to users table)
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Subscription ID (foreign key to subscriptions table, nullable)
  subscriptionId: text('subscription_id')
    .references(() => subscriptions.id, { onDelete: 'set null' }),

  // Razorpay order ID
  razorpayOrderId: varchar('razorpay_order_id', { length: 255 }),

  // Razorpay payment ID (after successful payment)
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),

  // Razorpay signature (for verification)
  razorpaySignature: varchar('razorpay_signature', { length: 500 }),

  // Payment amount (in rupees)
  amount: varchar('amount', { length: 20 }).notNull(),

  // Currency code (default: INR)
  currency: varchar('currency', { length: 10 }).notNull().default('INR'),

  // Payment status: 'pending', 'success', 'failed', 'refunded'
  status: varchar('status', { length: 50 }).notNull().default('pending'),

  // Payment method: 'card', 'upi', 'netbanking', etc.
  paymentMethod: varchar('payment_method', { length: 50 }),

  // Plan name for this payment
  planName: varchar('plan_name', { length: 50 }).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Index for user lookups
  userIdx: index('payments_user_idx').on(table.userId),
  // Index for status queries
  statusIdx: index('payments_status_idx').on(table.status),
  // Index for Razorpay order ID lookups
  razorpayOrderIdx: index('payments_razorpay_order_idx').on(table.razorpayOrderId),
  // Index for Razorpay payment ID lookups
  razorpayPaymentIdx: index('payments_razorpay_payment_idx').on(table.razorpayPaymentId),
  // Composite index for user payment history (sorted by date)
  userCreatedIdx: index('payments_user_created_idx').on(table.userId, table.createdAt),
}));

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
