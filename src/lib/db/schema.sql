-- Neon Database Schema for Swaras AI
-- Run this script in your Neon DB console to create the tables

-- Table: tier_plans
-- Stores subscription tier information
CREATE TABLE IF NOT EXISTS tier_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE, -- 'FREE', 'PRO', 'UNLIMITED'
  display_name VARCHAR(100) NOT NULL, -- 'Free Plan', 'Pro Plan', etc.
  daily_message_limit INTEGER NOT NULL,
  monthly_price DECIMAL(10, 2) DEFAULT 0.00,
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature descriptions
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: users
-- Stores user information and their current tier
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_user_id VARCHAR(255) NOT NULL UNIQUE, -- Clerk's user ID
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  tier_plan_id INTEGER REFERENCES tier_plans(id) DEFAULT 1, -- Default to FREE tier
  daily_message_count INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE, -- IST midnight reset tracking
  total_messages_sent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tier_plan FOREIGN KEY (tier_plan_id) REFERENCES tier_plans(id) ON DELETE SET DEFAULT
);

-- Table: personas
-- Stores AI persona configurations
CREATE TABLE IF NOT EXISTS personas (
  id SERIAL PRIMARY KEY,
  persona_key VARCHAR(50) NOT NULL UNIQUE, -- 'hitesh', 'piyush', etc.
  name VARCHAR(100) NOT NULL, -- Display name
  title VARCHAR(255), -- e.g., "Coding Educator & YouTuber"
  avatar_url TEXT,
  description TEXT,
  system_prompt TEXT, -- The LLM system prompt
  specialty VARCHAR(100), -- 'Coding', 'Business', 'Health', etc.
  is_enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0, -- For ordering in UI
  greeting_message TEXT, -- Default greeting when conversation starts
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional data (social links, stats, etc.)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_conversations
-- Stores conversation history between users and personas
CREATE TABLE IF NOT EXISTS user_conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE,
  conversation_data JSONB NOT NULL, -- Full conversation object
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: usage_logs
-- Tracks message usage for analytics and rate limiting
CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  persona_id INTEGER REFERENCES personas(id) ON DELETE SET NULL,
  message_content TEXT,
  response_content TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier_plan_id);
CREATE INDEX IF NOT EXISTS idx_users_reset_date ON users(last_reset_date);
CREATE INDEX IF NOT EXISTS idx_personas_key ON personas(persona_key);
CREATE INDEX IF NOT EXISTS idx_personas_enabled ON personas(is_enabled);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON user_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_persona ON user_conversations(persona_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_tier_plans_updated_at
  BEFORE UPDATE ON tier_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personas_updated_at
  BEFORE UPDATE ON personas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_conversations_updated_at
  BEFORE UPDATE ON user_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default tier plans
INSERT INTO tier_plans (name, display_name, daily_message_limit, monthly_price, features)
VALUES
  ('FREE', 'Free Plan', 10, 0.00, '["10 messages per day", "Access to all personas", "Basic support"]'::jsonb),
  ('PRO', 'Pro Plan', 200, 9.99, '["200 messages per day", "Priority response time", "Advanced features", "Email support"]'::jsonb),
  ('UNLIMITED', 'Unlimited Plan', 999999, 29.99, '["Unlimited messages", "Fastest response time", "All features", "24/7 priority support", "Early access to new personas"]'::jsonb)
ON CONFLICT (name) DO NOTHING;
