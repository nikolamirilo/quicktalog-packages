-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"datetime" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text,
	"catalogue" text NOT NULL,
	CONSTRAINT "prompts_service_catalogue_key" UNIQUE("catalogue")
);
--> statement-breakpoint
ALTER TABLE "prompts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ocr" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"datetime" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text,
	"catalogue" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ocr" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "qr_configs" (
	"catalogue" text NOT NULL,
	"config" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "qr_configs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"colors" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_themes_user_id_name_key" UNIQUE("user_id","name")
);
--> statement-breakpoint
ALTER TABLE "user_themes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" text,
	"email" text,
	"plan_id" text NOT NULL,
	"customer_id" text,
	"cookie_preferences" jsonb,
	"consents" jsonb DEFAULT '{"refund-policy":true,"privacy-policy":true,"terms-and-conditions":true}'::jsonb NOT NULL,
	CONSTRAINT "users_customer_id_key" UNIQUE("customer_id")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "catalogues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"heading" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"source" text DEFAULT 'builder' NOT NULL,
	"language" text DEFAULT 'eng' NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"business_type" text,
	"content" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"legal" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"appearance" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"contact" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"header" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"footer" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"partners" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"tags" text[] NOT NULL,
	CONSTRAINT "catalogues_new_name_key" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "catalogues" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "product_newsletter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_newsletter" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "analytics" (
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"current_url" text NOT NULL,
	"pageview_count" integer NOT NULL,
	"unique_visitors" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "analytics_unique_entry" UNIQUE("date","current_url")
);
--> statement-breakpoint
ALTER TABLE "analytics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "newsletter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"catalogue_id" uuid NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "newsletter" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"subscription_id" text PRIMARY KEY NOT NULL,
	"subscription_status" text NOT NULL,
	"price_id" text,
	"product_id" text,
	"scheduled_change" text,
	"customer_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "job_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"job_name" text NOT NULL,
	"status" text NOT NULL,
	"processed_count" integer,
	"inserted_count" integer,
	"execution_time_ms" integer,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"log" jsonb
);
--> statement-breakpoint
ALTER TABLE "job_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_catalogue_fkey" FOREIGN KEY ("catalogue") REFERENCES "public"."catalogues"("name") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ocr" ADD CONSTRAINT "ocr_catalogue_fkey" FOREIGN KEY ("catalogue") REFERENCES "public"."catalogues"("name") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ocr" ADD CONSTRAINT "ocr_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "qr_configs" ADD CONSTRAINT "qr_configs_catalogue_fkey" FOREIGN KEY ("catalogue") REFERENCES "public"."catalogues"("name") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_themes" ADD CONSTRAINT "user_themes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalogues" ADD CONSTRAINT "catalogues_new_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "newsletter" ADD CONSTRAINT "newsletter_catalogue_id_fkey" FOREIGN KEY ("catalogue_id") REFERENCES "public"."catalogues"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "newsletter" ADD CONSTRAINT "newsletter_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("customer_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prompts_user_id_idx" ON "prompts" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ocr_catalogue_idx" ON "ocr" USING btree ("catalogue" text_ops);--> statement-breakpoint
CREATE INDEX "ocr_user_id_idx" ON "ocr" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "qr_configs_catalogue_idx" ON "qr_configs" USING btree ("catalogue" text_ops);--> statement-breakpoint
CREATE INDEX "users_plan_id_idx" ON "users" USING btree ("plan_id" text_ops);--> statement-breakpoint
CREATE INDEX "catalogues_created_by_idx" ON "catalogues" USING btree ("created_by" text_ops);--> statement-breakpoint
CREATE INDEX "analytics_user_id_date_idx" ON "analytics" USING btree ("user_id" text_ops,"date" text_ops);--> statement-breakpoint
CREATE INDEX "newsletter_catalogue_id_idx" ON "newsletter" USING btree ("catalogue_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "newsletter_owner_id_idx" ON "newsletter" USING btree ("owner_id" text_ops);--> statement-breakpoint
CREATE INDEX "subscriptions_customer_id_idx" ON "subscriptions" USING btree ("customer_id" text_ops);--> statement-breakpoint
CREATE INDEX "subscriptions_price_id_idx" ON "subscriptions" USING btree ("price_id" text_ops);--> statement-breakpoint
CREATE VIEW "public"."contacts" WITH (security_invoker = true) AS (SELECT DISTINCT ON ((COALESCE(u.id, lower(n.email)))) COALESCE(u.id, gen_random_uuid()::text) AS id, COALESCE(u.email, n.email) AS email, COALESCE(u.name, 'Unknown'::text) AS firstname, COALESCE(p.name, ''::text) AS plan, u.customer_id AS paddle_customer_id, COALESCE(c.catalogues, ''::text) AS catalogues, CASE WHEN u.id IS NOT NULL THEN 'Yes'::text ELSE 'No'::text END AS is_user, CASE WHEN n.id IS NOT NULL THEN 'Yes'::text ELSE 'No'::text END AS product_newsletter, CASE WHEN COALESCE((u.consents ->> 'refund-policy'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS refund_policy, CASE WHEN COALESCE((u.consents ->> 'terms-and-conditions'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS terms_and_conditions, CASE WHEN COALESCE((u.consents ->> 'privacy-policy'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS privacy_policy FROM users u FULL JOIN product_newsletter n ON lower(n.email) = lower(u.email) LEFT JOIN plans p ON p.id = u.plan_id LEFT JOIN LATERAL ( SELECT string_agg('https://www.quicktalog.app/catalogues/'::text || cat.name, ', '::text) AS catalogues FROM catalogues cat WHERE cat.created_by = u.id) c ON true ORDER BY (COALESCE(u.id, lower(n.email))), (n.id IS NOT NULL) DESC LIMIT 10000000);--> statement-breakpoint
CREATE VIEW "public"."active_subscriptions" WITH (security_invoker = true) AS (SELECT u.email, u.name, u.plan_id AS price_id, s.subscription_status, s.created_at, s.updated_at, 'https://www.quicktalog.app/catalogues/'::text || COALESCE(c.name, ''::text) AS catalogue_name FROM subscriptions s LEFT JOIN users u ON s.customer_id = u.customer_id LEFT JOIN catalogues c ON c.created_by = u.id WHERE s.subscription_status = 'active'::text AND u.name !~~* '%Mirilo%'::text AND u.name !~~* '%Tes%'::text AND u.name !~~* '%Montre%'::text AND u.name !~~* '%Djuranov%'::text AND u.email !~~* '%test%'::text AND s.scheduled_change IS NULL);
*/