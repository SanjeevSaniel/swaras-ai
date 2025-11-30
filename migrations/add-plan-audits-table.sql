CREATE TABLE IF NOT EXISTS "plan_audits" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "old_plan" varchar(50),
  "new_plan" varchar(50) NOT NULL,
  "action" varchar(20) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "plan_audits_user_idx" ON "plan_audits" ("user_id");
CREATE INDEX IF NOT EXISTS "plan_audits_created_idx" ON "plan_audits" ("created_at");
