import { relations } from "drizzle-orm/relations";
import { catalogues, qrConfigs, ocr, users, userThemes, prompts, plans, analytics, newsletter, subscriptions } from "./schema";

export const qrConfigsRelations = relations(qrConfigs, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [qrConfigs.catalogue],
		references: [catalogues.name]
	}),
}));

export const cataloguesRelations = relations(catalogues, ({one, many}) => ({
	qrConfigs: many(qrConfigs),
	ocrs: many(ocr),
	prompts: many(prompts),
	user: one(users, {
		fields: [catalogues.createdBy],
		references: [users.id]
	}),
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

export const usersRelations = relations(users, ({one, many}) => ({
	ocrs: many(ocr),
	userThemes: many(userThemes),
	prompts: many(prompts),
	plan: one(plans, {
		fields: [users.planId],
		references: [plans.id]
	}),
	catalogues: many(catalogues),
	analytics: many(analytics),
	newsletters: many(newsletter),
	subscriptions: many(subscriptions),
}));

export const userThemesRelations = relations(userThemes, ({one}) => ({
	user: one(users, {
		fields: [userThemes.userId],
		references: [users.id]
	}),
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

export const plansRelations = relations(plans, ({many}) => ({
	users: many(users),
	subscriptions: many(subscriptions),
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