// src/db/index.ts - Database connection and Drizzle client setup
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Validate database URL exists
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please add it to your .env file.'
  );
}

// Create Neon HTTP client
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle ORM client with schema
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';
