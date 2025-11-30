CREATE TABLE IF NOT EXISTS "billing_details" (
  "user_id" text PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
  "name" varchar(255) NOT NULL,
  "address_line1" text,
  "address_line2" text,
  "city" varchar(100),
  "state" varchar(100),
  "postal_code" varchar(20),
  "country" varchar(100) DEFAULT 'India',
  "gst_number" varchar(50),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "invoice_url" text;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "receipt_url" text;
