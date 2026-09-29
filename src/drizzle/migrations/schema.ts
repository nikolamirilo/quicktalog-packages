import { pgTable, text, timestamp, index, uniqueIndex, foreignKey, pgPolicy, check, uuid, integer, boolean, jsonb, unique, bigserial, date, pgView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const plans = pgTable("plans", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const aiCredits = pgTable("ai_credits", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: text("user_id").notNull(),
	turnId: uuid("turn_id").defaultRandom().notNull(),
	continuations: integer().default(0).notNull(),
	refundedAt: timestamp("refunded_at", { withTimezone: true, mode: 'string' }),
	kind: text().default('agent').notNull(),
	planOpen: boolean("plan_open").default(false).notNull(),
	planBudget: integer("plan_budget").default(0).notNull(),
	planHash: text("plan_hash"),
	credits: integer().default(1).notNull(),
	metadata: jsonb(),
	catalogueId: uuid("catalogue_id"),
}, (table) => [
	index("ai_credits_catalogue_id_idx").using("btree", table.catalogueId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("ai_credits_turn_id_key").using("btree", table.turnId.asc().nullsLast().op("uuid_ops")),
	index("ai_credits_user_id_created_at_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ai_credits_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.catalogueId],
			foreignColumns: [catalogues.id],
			name: "ai_credits_catalogue_id_fkey"
		}).onDelete("set null"),
	pgPolicy("ai_credits_select_owner", { as: "permissive", for: "select", to: ["app_user"], using: sql`(user_id = ( SELECT private.current_user_id() AS current_user_id))` }),
	check("ai_credits_continuations_range", sql`(continuations >= 0) AND (continuations <= 1000)`),
	check("ai_credits_credits_range", sql`(credits >= 0) AND (credits <= 100)`),
	check("ai_credits_kind_check", sql`kind = ANY (ARRAY['agent'::text, 'describe'::text])`),
	check("ai_credits_plan_budget_range", sql`(plan_budget >= 0) AND (plan_budget <= 8)`),
	check("ai_credits_plan_hash_format", sql`(plan_hash IS NULL) OR (plan_hash ~ '^[0-9a-f]{64}$'::text)`),
]);

export const catalogues = pgTable("catalogues", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	logo: text(),
	heading: text(),
	status: text().default('draft').notNull(),
	source: text().default('builder').notNull(),
	language: text().default('eng').notNull(),
	currency: text().default('EUR').notNull(),
	businessType: text("business_type"),
	content: jsonb().default([]).notNull(),
	legal: jsonb().default({}).notNull(),
	appearance: jsonb().default({}).notNull(),
	contact: jsonb().default({}).notNull(),
	header: jsonb().default({}).notNull(),
	footer: jsonb().default({}).notNull(),
	partners: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: text("user_id").notNull(),
	metadata: jsonb().default({}).notNull(),
	tags: text().array().default(sql`'{}'::text[]`).notNull(),
}, (table) => [
	index("catalogues_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "catalogues_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("catalogues_name_key").on(table.name),
	pgPolicy("catalogues_delete_owner", { as: "permissive", for: "delete", to: ["app_user"], using: sql`(user_id = ( SELECT private.current_user_id() AS current_user_id))` }),
	pgPolicy("catalogues_insert_owner", { as: "permissive", for: "insert", to: ["app_user"] }),
	pgPolicy("catalogues_select_owner", { as: "permissive", for: "select", to: ["app_user"] }),
	pgPolicy("catalogues_select_public", { as: "permissive", for: "select", to: ["app_public"] }),
	pgPolicy("catalogues_update_owner", { as: "permissive", for: "update", to: ["app_user"] }),
	check("catalogues_content_size", sql`pg_column_size(content) < 1048576`),
	check("catalogues_name_slug", sql`(name ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text) AND (length(name) <= 100)`),
	check("catalogues_other_json_size", sql`(((((((COALESCE(pg_column_size(appearance), 0) + COALESCE(pg_column_size(legal), 0)) + COALESCE(pg_column_size(contact), 0)) + COALESCE(pg_column_size(header), 0)) + COALESCE(pg_column_size(footer), 0)) + COALESCE(pg_column_size(partners), 0)) + COALESCE(pg_column_size(metadata), 0)) + COALESCE(pg_column_size(tags), 0)) < 1048576`),
	check("catalogues_source_check", sql`source = ANY (ARRAY['builder'::text, 'ocr_import'::text, 'ai_prompt'::text])`),
	check("catalogues_status_check", sql`status = ANY (ARRAY['draft'::text, 'in_preparation'::text, 'active'::text, 'inactive'::text, 'error'::text])`),
]);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("newsletter_subscribers_email_key").using("btree", sql`lower(email)`),
]);

export const jobLogs = pgTable("job_logs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	jobName: text("job_name").notNull(),
	status: text().notNull(),
	processedCount: integer("processed_count"),
	insertedCount: integer("inserted_count"),
	executionTimeMs: integer("execution_time_ms"),
	error: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	log: jsonb(),
}, (table) => [
	check("job_logs_status_check", sql`status = ANY (ARRAY['success'::text, 'failure'::text]))) NOT VALID`),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	image: text(),
	email: text(),
	planId: text("plan_id").notNull(),
	customerId: text("customer_id"),
	cookiePreferences: jsonb("cookie_preferences"),
	consents: jsonb().default({"source":"default","refund-policy":false,"privacy-policy":false,"terms-and-conditions":false}).notNull(),
	welcomeEmailSentAt: timestamp("welcome_email_sent_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("users_plan_id_idx").using("btree", table.planId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.planId],
			foreignColumns: [plans.id],
			name: "users_plan_id_fkey"
		}),
	unique("users_customer_id_key").on(table.customerId),
	pgPolicy("users_select_self", { as: "permissive", for: "select", to: ["app_user"], using: sql`(id = ( SELECT private.current_user_id() AS current_user_id))` }),
	pgPolicy("users_update_self", { as: "permissive", for: "update", to: ["app_user"] }),
	check("users_cookie_prefs_size", sql`(cookie_preferences IS NULL) OR (pg_column_size(cookie_preferences) < 2048)`),
	check("users_id_is_uuid", sql`id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'::text)) NOT VALID`),
]);

export const userThemes = pgTable("user_themes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	colors: jsonb().default({}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_themes_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("user_themes_user_id_name_key").on(table.userId, table.name),
	pgPolicy("user_themes_owner", { as: "permissive", for: "all", to: ["app_user"], using: sql`(user_id = ( SELECT private.current_user_id() AS current_user_id))`, withCheck: sql`(user_id = ( SELECT private.current_user_id() AS current_user_id))`  }),
	check("user_themes_colors_size", sql`pg_column_size(colors) < 4096`),
]);

export const analytics = pgTable("analytics", {
	day: date().notNull(),
	pageviews: integer().notNull(),
	uniqueVisitors: integer("unique_visitors").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: text("user_id").notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	catalogueId: uuid("catalogue_id"),
}, (table) => [
	index("analytics_user_id_day_idx").using("btree", table.userId.asc().nullsLast().op("date_ops"), table.day.desc().nullsFirst().op("date_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "analytics_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.catalogueId],
			foreignColumns: [catalogues.id],
			name: "analytics_catalogue_id_fkey"
		}).onDelete("set null"),
	unique("analytics_catalogue_id_day_key").on(table.day, table.catalogueId),
	pgPolicy("analytics_select_owner", { as: "permissive", for: "select", to: ["app_user"], using: sql`(user_id = ( SELECT private.current_user_id() AS current_user_id))` }),
	check("analytics_counts_non_negative", sql`(pageviews >= 0) AND (unique_visitors >= 0)`),
]);

export const catalogueSubscribers = pgTable("catalogue_subscribers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	catalogueId: uuid("catalogue_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("catalogue_subscribers_catalogue_email_key").using("btree", sql`catalogue_id`, sql`lower(email)`),
	foreignKey({
			columns: [table.catalogueId],
			foreignColumns: [catalogues.id],
			name: "catalogue_subscribers_catalogue_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("catalogue_subscribers_select_owner", { as: "permissive", for: "select", to: ["app_user"], using: sql`(catalogue_id IN ( SELECT c.id
   FROM catalogues c
  WHERE (c.user_id = ( SELECT private.current_user_id() AS current_user_id))))` }),
]);

export const qrConfigs = pgTable("qr_configs", {
	config: jsonb().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	catalogueId: uuid("catalogue_id").notNull(),
}, (table) => [
	uniqueIndex("qr_configs_catalogue_id_key").using("btree", table.catalogueId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.catalogueId],
			foreignColumns: [catalogues.id],
			name: "qr_configs_catalogue_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("qr_configs_owner", { as: "permissive", for: "all", to: ["app_user"], using: sql`(catalogue_id IN ( SELECT c.id
   FROM catalogues c
  WHERE (c.user_id = ( SELECT private.current_user_id() AS current_user_id))))`, withCheck: sql`(catalogue_id IN ( SELECT c.id
   FROM catalogues c
  WHERE (c.user_id = ( SELECT private.current_user_id() AS current_user_id))))`  }),
	check("qr_configs_config_size", sql`pg_column_size(config) < 65536`),
]);

export const subscriptions = pgTable("subscriptions", {
	subscriptionId: text("subscription_id").primaryKey().notNull(),
	subscriptionStatus: text("subscription_status").notNull(),
	priceId: text("price_id"),
	productId: text("product_id"),
	scheduledChange: timestamp("scheduled_change", { withTimezone: true, mode: 'string' }),
	customerId: text("customer_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("subscriptions_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("text_ops")),
	index("subscriptions_price_id_idx").using("btree", table.priceId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [users.customerId],
			name: "subscriptions_customer_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.priceId],
			foreignColumns: [plans.id],
			name: "subscriptions_price_id_fkey"
		}),
	check("subscriptions_status_check", sql`subscription_status = ANY (ARRAY['active'::text, 'trialing'::text, 'past_due'::text, 'paused'::text, 'canceled'::text])`),
]);
export const contacts = pgView("contacts", {	id: text(),
	email: text(),
	firstname: text(),
	plan: text(),
	paddleCustomerId: text("paddle_customer_id"),
	catalogues: text(),
	isUser: text("is_user"),
	productNewsletter: text("product_newsletter"),
	refundPolicy: text("refund_policy"),
	termsAndConditions: text("terms_and_conditions"),
	privacyPolicy: text("privacy_policy"),
}).with({"securityInvoker":true}).as(sql`SELECT DISTINCT ON ((COALESCE(u.id, lower(n.email)))) COALESCE(u.id, gen_random_uuid()::text) AS id, COALESCE(u.email, n.email) AS email, COALESCE(u.name, 'Unknown'::text) AS firstname, COALESCE(p.name, ''::text) AS plan, u.customer_id AS paddle_customer_id, COALESCE(c.catalogues, ''::text) AS catalogues, CASE WHEN u.id IS NOT NULL THEN 'Yes'::text ELSE 'No'::text END AS is_user, CASE WHEN n.id IS NOT NULL THEN 'Yes'::text ELSE 'No'::text END AS product_newsletter, CASE WHEN COALESCE((u.consents ->> 'refund-policy'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS refund_policy, CASE WHEN COALESCE((u.consents ->> 'terms-and-conditions'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS terms_and_conditions, CASE WHEN COALESCE((u.consents ->> 'privacy-policy'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS privacy_policy FROM users u FULL JOIN newsletter_subscribers n ON lower(n.email) = lower(u.email) LEFT JOIN plans p ON p.id = u.plan_id LEFT JOIN LATERAL ( SELECT string_agg('https://www.quicktalog.app/catalogues/'::text || cat.name, ', '::text) AS catalogues FROM catalogues cat WHERE cat.user_id = u.id) c ON true ORDER BY (COALESCE(u.id, lower(n.email))), (n.id IS NOT NULL) DESC LIMIT 10000000`);

export const activeSubscriptions = pgView("active_subscriptions", {	email: text(),
	name: text(),
	priceId: text("price_id"),
	subscriptionStatus: text("subscription_status"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	catalogueName: text("catalogue_name"),
}).with({"securityInvoker":true}).as(sql`SELECT u.email, u.name, u.plan_id AS price_id, s.subscription_status, s.created_at, s.updated_at, 'https://www.quicktalog.app/catalogues/'::text || COALESCE(c.name, ''::text) AS catalogue_name FROM subscriptions s LEFT JOIN users u ON s.customer_id = u.customer_id LEFT JOIN catalogues c ON c.user_id = u.id WHERE s.subscription_status = 'active'::text AND u.name !~~* '%Mirilo%'::text AND u.name !~~* '%Tes%'::text AND u.name !~~* '%Montre%'::text AND u.name !~~* '%Djuranov%'::text AND u.email !~~* '%test%'::text AND s.scheduled_change IS NULL`);