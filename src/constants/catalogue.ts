import { Catalogue } from "../types";

export const defaultCatalogueData: Omit<Catalogue, "id"> = {
  name: "",
  logo: "",
  status: "draft",
  language: "eng",
  heading: "",
  currency: "EUR",
  businessType: "",
  content: [],
  metadata: {
    title: "",
    description: "",
    icon: "",
  },
  legal: {
    legalName: "",
    termsAndConditions: "",
    privacyPolicy: "",
    address: "",
  },
  appearance: {
    theme: {
      type: "standard",
      name: "theme-monochrome",
    },
    style: {
      contentFontSize: "medium",
      fontFamily: "inter",
      borderRadius: 12,
      shadow: "low",
    },
    overlay: {
      isEnabled: false,
      icon: "",
    },
  },
  contact: {
    phone: "",
    email: "",
    website: "",
    socials: [],
  },
  header: {
    type: "default",
    logoSize: {
      width: 100,
      height: 100,
    },
    cta: {
      isEnabled: true,
      label: "",
      url: "",
    },
    emailCta: true,
    phoneCta: true,
  },
  footer: {
    type: "default",
    logoSize: {
      width: 100,
      height: 100,
    },
    cta: {
      isEnabled: true,
      label: "",
      url: "",
    },
    newsletter: false,
    showPartners: false,
  },
  userId: "",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  source: "builder",
  tags: [],
  partners: [],
};

export const BUSINESS_TYPES = [
  {
    value: "food-beverage",
    label: "Food & Beverage",
    aiHint:
      "appetising and sensory: ingredients, preparation, portion size, how it tastes",
  },
  {
    value: "beauty-wellness",
    label: "Beauty & Wellness",
    aiHint:
      "calm and benefit-led: what the treatment involves, how long it takes, how the client feels afterwards",
  },
  {
    value: "health-fitness",
    label: "Health & Fitness",
    aiHint:
      "energetic and ability-led: what the session builds, intensity, who it suits",
  },
  {
    value: "retail",
    label: "Retail & E-commerce",
    aiHint:
      "concrete product detail: materials, dimensions, variants, what it is used for",
  },
  {
    value: "professional-services",
    label: "Professional Services",
    aiHint:
      "outcome-led and credible: the deliverable, the scope, the result for the client",
  },
  {
    value: "home-trades",
    label: "Home & Trades",
    aiHint:
      "practical and reassuring: the work carried out, what is included, typical duration",
  },
  {
    value: "events-hospitality",
    label: "Events & Hospitality",
    aiHint:
      "evocative but specific: the setting, capacity or duration, what the package covers",
  },
  {
    value: "education-training",
    label: "Education & Training",
    aiHint:
      "clear and outcome-led: what the learner can do afterwards, level, format and length",
  },
  {
    value: "automotive",
    label: "Automotive",
    aiHint:
      "factual and spec-led: model or service performed, key figures, turnaround",
  },
  {
    value: "real-estate",
    label: "Real Estate",
    aiHint:
      "factual and spatial: size, rooms, location, condition, standout feature",
  },
  { value: "other", label: "Other" },
] as const;

export type BusinessTypeValue = (typeof BUSINESS_TYPES)[number]["value"];

export const BUSINESS_TYPE_VALUES = BUSINESS_TYPES.map((type) => type.value) as [
  BusinessTypeValue,
  ...BusinessTypeValue[],
];

/** Values retired from the picker; still present on older catalogues. */
export const LEGACY_BUSINESS_TYPES: Record<string, BusinessTypeValue> = {
  "online-sales": "retail",
  services: "professional-services",
};

export const resolveBusinessType = (
  value: string | null | undefined,
): (typeof BUSINESS_TYPES)[number] | undefined => {
  if (!value) return undefined;
  const target = LEGACY_BUSINESS_TYPES[value] ?? value;
  return BUSINESS_TYPES.find((type) => type.value === target);
};

/** One clause of prompt context, or "" when the type says nothing useful. */
export const describeBusinessType = (
  value: string | null | undefined,
): string => {
  const type = resolveBusinessType(value);
  if (!type || !("aiHint" in type)) return "";
  return `Business type: ${type.label}. Write ${type.aiHint}.`;
};

export const DEFAULT_IMAGE =
  "https://vgrutvaw2q.ufs.sh/f/X7AUkOrs4vhbBxZSgiECZj8HKxV2bkXdTwltoU3hRaDYAm9q";
