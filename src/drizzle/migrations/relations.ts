import { relations } from "drizzle-orm/relations";
import { catalogues, qrConfigs, users, userThemes, ocr, subscriptions, plans, prompts, analytics, newsletter } from "./schema";

export const qrConfigsRelations = relations(qrConfigs, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [qrConfigs.catalogue],
		references: [catalogues.name]
	}),
}));

export const cataloguesRelations = relations(catalogues, ({one, many}) => ({
	qrConfigs: many(qrConfigs),
	ocrs: many(ocr),
	user: one(users, {
		fields: [catalogues.createdBy],
		references: [users.id]
	}),
	prompts: many(prompts),
	newsletters: many(newsletter),
}));

export const userThemesRelations = relations(userThemes, ({one}) => ({
	user: one(users, {
		fields: [userThemes.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	userThemes: many(userThemes),
	ocrs: many(ocr),
	subscriptions: many(subscriptions),
	catalogues: many(catalogues),
	prompts: many(prompts),
	plan: one(plans, {
		fields: [users.planId],
		references: [plans.id]
	}),
	analytics: many(analytics),
	newsletters: many(newsletter),
}));

export const ocrRelations = relations(ocr, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [ocr.catalogue],
		references: [catalogues.name]
	}),
	user: one(users, {
		fields: [ocr.userId],
		references: [users.id]
	}),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	user: one(users, {
		fields: [subscriptions.customerId],
		references: [users.customerId]
	}),
	plan: one(plans, {
		fields: [subscriptions.priceId],
		references: [plans.id]
	}),
}));

export const plansRelations = relations(plans, ({many}) => ({
	subscriptions: many(subscriptions),
	users: many(users),
}));

export const promptsRelations = relations(prompts, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [prompts.catalogue],
		references: [catalogues.name]
	}),
	user: one(users, {
		fields: [prompts.userId],
		references: [users.id]
	}),
}));

export const analyticsRelations = relations(analytics, ({one}) => ({
	user: one(users, {
		fields: [analytics.userId],
		references: [users.id]
	}),
}));

export const newsletterRelations = relations(newsletter, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [newsletter.catalogueId],
		references: [catalogues.id]
	}),
	user: one(users, {
		fields: [newsletter.ownerId],
		references: [users.id]
	}),
}));