import { schema } from "../drizzle";
import { layouts, themes } from "../constants";
import { InferSelectModel, Update } from "drizzle-orm";

export type Usage = {
  traffic: { pageviews: number; unique_visitors: number };
  credits: number;
  catalogues: number;
};

export type UserData = User & {
  usage: Usage;
  currentPlan: PricingPlan;
};

export type PricingPlan = {
  id: number;
  name: string;
  type: string;
  priceId: {
    month: string;
    year: string;
  };
  description: string;
  features: {
    support: string;
    catalogues: number;
    sections_per_catalogue?: number | "unlimited";
    items_per_catalogue?: number | "unlimited";
    /**
     * Which block types the plan unlocks. Read as `=== true` everywhere, so a
     * tier that omits a flag does not get the block.
     */
    sections: {
      divider: boolean;
      embedding: boolean;
      customVisual: boolean;
    };
    /**
     * Third-party services the owner may connect to a published catalogue.
     * `tracking` covers their own GA4 and Meta Pixel tags. Google Tag Manager
     * is deliberately absent: a container is arbitrary owner-authored code,
     * and published catalogues share an origin with the signed-in app.
     */
    integrations: {
      tracking: boolean;
    };
    newsletter: boolean;
    custom_features: boolean;
    traffic_limit: number;
    branding: boolean;
    analytics: string;
    ai_credits: number;
    /**
     * Custom colour themes, fonts, text size, corners, shadows, overlay, glass
     * and background. Standard themes are on every plan, so they are not a flag.
     */
    advancedAppearance: boolean;
  };
  billing_period?: "month" | "year";
};

type Item = {
  key: string;
  label: string;
  image: string;
  description: string;
};

export type Theme = Item;
export type Layout = Item;

export type ThemeVariant = (typeof themes)[number]["key"];
export type LayoutVariant = (typeof layouts)[number]["key"];

export type OverallAnalytics = {
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalServiceCatalogues: number;
  totalNewsletterSubscriptions: number;
};

export type Analytics = {
  day: string;
  catalogue_id: string | null;
  pageviews: number;
  unique_visitors: number;
};

type RawUser = InferSelectModel<typeof schema.users>;

export type User = Update<
  RawUser,
  {
    cookiePreferences: CookiePreferences;
    consents: Consents;
  }
>;

export type OCRImageData = {
  id: string;
  file: File;
  originalUrl: string;
  confidence?: number;
  isProcessed: boolean;
};

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export type ContactData = {
  message: string;
  email: string;
  name: string;
  subject: string;
};

export type Currency = {
  value: string;
  label: string;
  symbol: string;
  locale: string;
};

export type AreLimitesReached = {
  catalogues: boolean;
  credits: boolean;
};

export type CookiePreferences = {
  accepted: boolean;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
};

export type Consents = {
  termsAndConditions: string;
  privacyPolicy: string;
  refundPolicy: string;
};
