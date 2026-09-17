import { pgTable, index, foreignKey, unique, uuid, timestamp, text, jsonb, integer, bigserial, pgView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const prompts = pgTable("prompts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	datetime: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: text("user_id"),
	catalogue: text().notNull(),
}, (table) => [
	index("prompts_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.catalogue],
			foreignColumns: [catalogues.name],
			name: "prompts_catalogue_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "prompts_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("prompts_service_catalogue_key").on(table.catalogue),
]);

export const ocr = pgTable("ocr", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	datetime: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: text("user_id"),
	catalogue: text().notNull(),
}, (table) => [
	index("ocr_catalogue_idx").using("btree", table.catalogue.asc().nullsLast().op("text_ops")),
	index("ocr_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.catalogue],
			foreignColumns: [catalogues.name],
			name: "ocr_catalogue_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ocr_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const qrConfigs = pgTable("qr_configs", {
	catalogue: text().notNull(),
	config: jsonb().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	index("qr_configs_catalogue_idx").using("btree", table.catalogue.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.catalogue],
			foreignColumns: [catalogues.name],
			name: "qr_configs_catalogue_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
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
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	image: text(),
	email: text(),
	planId: text("plan_id").notNull(),
	customerId: text("customer_id"),
	cookiePreferences: jsonb("cookie_preferences"),
	consents: jsonb().default({"refund-policy":true,"privacy-policy":true,"terms-and-conditions":true}).notNull(),
}, (table) => [
	index("users_plan_id_idx").using("btree", table.planId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.planId],
			foreignColumns: [plans.id],
			name: "users_plan_id_fkey"
		}),
	unique("users_customer_id_key").on(table.customerId),
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
	createdBy: text("created_by").notNull(),
	metadata: jsonb().default({}),
	tags: text().array().notNull(),
}, (table) => [
	index("catalogues_created_by_idx").using("btree", table.createdBy.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "catalogues_new_created_by_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("catalogues_new_name_key").on(table.name),
]);

export const productNewsletter = pgTable("product_newsletter", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
});

export const plans = pgTable("plans", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const analytics = pgTable("analytics", {
	date: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	currentUrl: text("current_url").notNull(),
	pageviewCount: integer("pageview_count").notNull(),
	uniqueVisitors: integer("unique_visitors"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	userId: text("user_id").notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	index("analytics_user_id_date_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.date.desc().nullsFirst().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "analytics_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("analytics_unique_entry").on(table.date, table.currentUrl),
]);

export const newsletter = pgTable("newsletter", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	catalogueId: uuid("catalogue_id").notNull(),
	ownerId: text("owner_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("newsletter_catalogue_id_idx").using("btree", table.catalogueId.asc().nullsLast().op("uuid_ops")),
	index("newsletter_owner_id_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.catalogueId],
			foreignColumns: [catalogues.id],
			name: "newsletter_catalogue_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "newsletter_owner_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const subscriptions = pgTable("subscriptions", {
	subscriptionId: text("subscription_id").primaryKey().notNull(),
	subscriptionStatus: text("subscription_status").notNull(),
	priceId: text("price_id"),
	productId: text("product_id"),
	scheduledChange: text("scheduled_change"),
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
]);

export const jobLogs = pgTable("job_logs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	jobName: text("job_name").notNull(),
	status: text().notNull(),
	processedCount: integer("processed_count"),
	insertedCount: integer("inserted_count"),
	executionTimeMs: integer("execution_time_ms"),
	error: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	log: jsonb(),
});
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
}).with({"securityInvoker":true}).as(sql`SELECT DISTINCT ON ((COALESCE(u.id, lower(n.email)))) COALESCE(u.id, gen_random_uuid()::text) AS id, COALESCE(u.email, n.email) AS email, COALESCE(u.name, 'Unknown'::text) AS firstname, COALESCE(p.name, ''::text) AS plan, u.customer_id AS paddle_customer_id, COALESCE(c.catalogues, ''::text) AS catalogues, CASE WHEN u.id IS NOT NULL THEN 'Yes'::text ELSE 'No'::text END AS is_user, CASE WHEN n.id IS NOT NULL THEN 'Yes'::text ELSE 'No'::text END AS product_newsletter, CASE WHEN COALESCE((u.consents ->> 'refund-policy'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS refund_policy, CASE WHEN COALESCE((u.consents ->> 'terms-and-conditions'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS terms_and_conditions, CASE WHEN COALESCE((u.consents ->> 'privacy-policy'::text)::boolean, false) THEN 'Yes'::text ELSE 'No'::text END AS privacy_policy FROM users u FULL JOIN product_newsletter n ON lower(n.email) = lower(u.email) LEFT JOIN plans p ON p.id = u.plan_id LEFT JOIN LATERAL ( SELECT string_agg('https://www.quicktalog.app/catalogues/'::text || cat.name, ', '::text) AS catalogues FROM catalogues cat WHERE cat.created_by = u.id) c ON true ORDER BY (COALESCE(u.id, lower(n.email))), (n.id IS NOT NULL) DESC LIMIT 10000000`);

export const activeSubscriptions = pgView("active_subscriptions", {	email: text(),
	name: text(),
	priceId: text("price_id"),
	subscriptionStatus: text("subscription_status"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	catalogueName: text("catalogue_name"),
}).with({"securityInvoker":true}).as(sql`SELECT u.email, u.name, u.plan_id AS price_id, s.subscription_status, s.created_at, s.updated_at, 'https://www.quicktalog.app/catalogues/'::text || COALESCE(c.name, ''::text) AS catalogue_name FROM subscriptions s LEFT JOIN users u ON s.customer_id = u.customer_id LEFT JOIN catalogues c ON c.created_by = u.id WHERE s.subscription_status = 'active'::text AND u.name !~~* '%Mirilo%'::text AND u.name !~~* '%Tes%'::text AND u.name !~~* '%Montre%'::text AND u.name !~~* '%Djuranov%'::text AND u.email !~~* '%test%'::text AND s.scheduled_change IS NULL`);