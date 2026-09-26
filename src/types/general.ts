import { schema } from "../drizzle";
import { layouts, themes } from "../constants";
import { InferSelectModel, Update } from "drizzle-orm";

export type Usage = {
  traffic: { pageview_count: number; unique_visitors: number };
  /** @deprecated Always 0 - OCR runs in the browser and is never metered. */
  ocr: number;
  /** @deprecated Row count. Enforcement moved to `credits`; kept until the flip. */
  prompts: number;
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
    sections: {
      divider: boolean;
      embedding: boolean;
      customCode: boolean;
    };
    newsletter: boolean;
    custom_features: boolean;
    ocr_ai_import: number;
    traffic_limit: number;
    branding: boolean;
    analytics: string;
    /** @deprecated Superseded by `ai_credits`; kept until the flip. */
    ai_prompts: number;
    ai_credits: number;
    apperance: {
      standardThemes: boolean;
      styles: boolean;
      customThemes: boolean;
    };
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
  date: string;
  current_url: string;
  pageview_count: number;
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
  /** @deprecated Always false; retired with the OCR limit. */
  ocr: boolean;
  /** @deprecated Superseded by `credits`; kept until the flip. */
  prompts: boolean;
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
