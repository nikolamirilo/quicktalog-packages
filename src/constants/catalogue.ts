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
  createdBy: "",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  source: "builder",
  tags: [],
  partners: [],
};

export const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "bar", label: "Bar" },
  { value: "bakery", label: "Bakery" },
  { value: "food-truck", label: "Food Truck" },
  { value: "catering", label: "Catering" },
  { value: "other", label: "Other" },
];

export const DEFAULT_IMAGE =
  "https://vgrutvaw2q.ufs.sh/f/X7AUkOrs4vhbBxZSgiECZj8HKxV2bkXdTwltoU3hRaDYAm9q";
