import { relations } from "drizzle-orm/relations";
import { catalogues, qrConfigs, users, userThemes, aiCredits, plans, analytics, catalogueSubscribers, subscriptions } from "./schema";

export const qrConfigsRelations = relations(qrConfigs, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [qrConfigs.catalogueId],
		references: [catalogues.id]
	}),
}));

export const cataloguesRelations = relations(catalogues, ({one, many}) => ({
	qrConfigs: many(qrConfigs),
	aiCredits: many(aiCredits),
	user: one(users, {
		fields: [catalogues.userId],
		references: [users.id]
	}),
	analytics: many(analytics),
	catalogueSubscribers: many(catalogueSubscribers),
}));

export const userThemesRelations = relations(userThemes, ({one}) => ({
	user: one(users, {
		fields: [userThemes.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	userThemes: many(userThemes),
	aiCredits: many(aiCredits),
	plan: one(plans, {
		fields: [users.planId],
		references: [plans.id]
	}),
	catalogues: many(catalogues),
	analytics: many(analytics),
	subscriptions: many(subscriptions),
}));

export const aiCreditsRelations = relations(aiCredits, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [aiCredits.catalogueId],
		references: [catalogues.id]
	}),
	user: one(users, {
		fields: [aiCredits.userId],
		references: [users.id]
	}),
}));

export const plansRelations = relations(plans, ({many}) => ({
	users: many(users),
	subscriptions: many(subscriptions),
}));

export const analyticsRelations = relations(analytics, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [analytics.catalogueId],
		references: [catalogues.id]
	}),
	user: one(users, {
		fields: [analytics.userId],
		references: [users.id]
	}),
}));

export const catalogueSubscribersRelations = relations(catalogueSubscribers, ({one}) => ({
	catalogue: one(catalogues, {
		fields: [catalogueSubscribers.catalogueId],
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