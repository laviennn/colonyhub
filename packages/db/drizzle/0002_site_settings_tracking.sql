-- Site Settings table for validated Tracking IDs (GA4, GTM, Meta Pixel)
CREATE TABLE IF NOT EXISTS "site_settings" (
  "key" text PRIMARY KEY NOT NULL,
  "value_json" jsonb NOT NULL,
  "updated_by" text,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
