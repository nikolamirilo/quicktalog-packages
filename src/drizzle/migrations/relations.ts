import { relations } from "drizzle-orm/relations";
import { users, aiCredits, catalogues, plans, userThemes, analytics, catalogueSubscribers, qrConfigs, subscriptions } from "./schema";

export const aiCreditsRelations = relations(aiCredits, ({one}) => ({
	user: one(users, {
		fields: [aiCredits.userId],
		references: [users.id]
	}),
	catalogue: one(catalogues, {
		fields: [aiCredits.catalogueId],
		references: [catalogues.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	aiCredits: many(aiCredits),
	catalogues: many(catalogues),
	plan: one(plans, {
		fields: [users.planId],
		references: [plans.id]
	}),
	userThemes: many(userThemes),
	analytics: many(analytics),
	subscriptions: many(subscriptions),
}));

export const cataloguesRelations = relations(catalogues, ({one, many}) => ({
	aiCredits: many(aiCredits),
	user: one(users, {
		fields: [catalogues.userId],
		references: [users.id]
	}),
	analytics: many(analytics),
	catalogueSubscribers: many(catalogueSubscribers),
	qrConfigs: many(qrConfigs),
}));

export const plansRelations = relations(plans, ({many}) => ({
	users: many(users),
	subscriptions: many(subscriptions),
}));

export const userThemesRelations = relations(userThemes, ({one}) => ({
	user: one(users, {
		fields: [userThemes.userId],
		references: [users.id]
	}),
}));

export const analyticsRelations = relations(analytics, ({one}) => ({
	user: one(users, {
		fields: [analytics.userId],
		references: [users.id]
	}),
	catalogue: one(catalogues, {
		fields: [analytics.catalogueId],
		references: [catalogues.id]
	}),
}));

export const catalogueSubscribersRelations = relations(catalogueSubscribers, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [catalogueSubscribers.catalogueId],
		references: [catalogues.id]
	}),
}));

export const qrConfigsRelations = relations(qrConfigs, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [qrConfigs.catalogueId],
		references: [catalogues.id]
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