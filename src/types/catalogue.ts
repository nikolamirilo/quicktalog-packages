import { type InferSelectModel } from "drizzle-orm";
import { schema } from "../drizzle";
import {
  ContentLayout,
  FontSize,
  ShadowLevel,
  Source,
  Status,
  ThemeType,
} from "./enums";
import { Update } from "./functions";

type RawCatalogue = InferSelectModel<typeof schema.catalogues>;

export type Catalogue = Update<
  RawCatalogue,
  {
    status: Status;
    source: Source;
    content: ContentBlock[];
    legal: Legal;
    appearance: Appearance;
    contact: Contact;
    header: Header;
    footer: Footer;
    partners: Partner[];
    metadata: Metadata;
  }
>;

export type Metadata = {
  title: string;
  description: string;
  icon: string;
};

export type BaseContentBlock = {
  id: string;
  order: number;
};

export type DividerBlock = BaseContentBlock & {
  type: "divider";
  spacing: number; // rem
  border?: {
    isEnabled: boolean;
    style?: "solid" | "dashed" | "dotted";
    thickness?: number; // px
    color?: string;
    opacity?: number; //0-100
  };
};

export type CategoryBlock = BaseContentBlock & {
  type: "category";
  name: string;
  layout: ContentLayout;
  items: Item[];
  isExpanded: boolean;
};

export type ContainerBlock = BaseContentBlock & {
  type: "container";
  name: string;
  layout: ContentLayout;
  items: Item[];
};

export type IframeBlock = BaseContentBlock & {
  type: "iframe";
  heading?: string;
  src: string;
};

export type CustomCodeBlock = BaseContentBlock & {
  type: "custom_code";
  code: string;
};

export type TextBlock = BaseContentBlock & {
  type: "text";
  content: string;
};

export type ContentBlock =
  | CategoryBlock
  | ContainerBlock
  | IframeBlock
  | CustomCodeBlock
  | TextBlock
  | DividerBlock;

export type ItemDiscount = {
  isOnDiscount: boolean;
  discountPercentage: number;
  discountedPrice: number;
};

export type Item = {
  id: string;
  order: number;
  name: string;
  description: string;
  image: string;
  isFree?: boolean;
  discount?: ItemDiscount;
  price: number;
  denominator?: string;
};

export type Legal = {
  legalName: string;
  termsAndConditions: string;
  privacyPolicy: string;
  address: string;
};

export type Appearance = {
  theme: {
    type: ThemeType;
    name: string;
  };
  style: {
    contentFontSize: FontSize;
    fontFamily: string;
    borderRadius: number;
    shadow: ShadowLevel;
  };
  overlay: {
    isEnabled: boolean;
    icon: string;
  };
};

export type CTAButton = {
  isEnabled: boolean;
  label: string;
  url: string;
};

export type Partner = {
  name: string;
  url: string;
  description: string;
};

export type Footer = {
  cta: CTAButton;
  newsletter: boolean;
  showPartners: boolean;
};

export type Header = {
  cta: CTAButton;
  emailCta: boolean;
  phoneCta: boolean;
};

export type Contact = {
  phone: string;
  email: string;
  website: string;
  socials: string[];
};
