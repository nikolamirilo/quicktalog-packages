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

type RawSavedTheme = InferSelectModel<typeof schema.userThemes>;

export type SavedTheme = Update<
  RawSavedTheme,
  {
    colors: CustomThemeColors;
  }
>;

export type Metadata = {
  title: string;
  description: string;
  icon: string;
  /**
   * The owner's own GA4 Measurement ID ("G-XXXXXXXXXX"). Loaded on the
   * published page only after the visitor allows analytics.
   *
   * Stored here rather than in a column of its own because `metadata` is
   * already public-readable and owner-editable, so this needs no migration.
   * It arrives from the client like the rest of `metadata`, so the shape is
   * checked on save and again at render.
   */
  googleAnalyticsId?: string;
  /** The owner's own Meta Pixel ID (digits only). Same handling as above. */
  metaPixelId?: string;
};

export type BaseContentBlock = {
  id: string;
  order: number;
};

export type DividerBlock = BaseContentBlock & {
  type: "divider";
  name?: string;  
  spacing: number; // rem
  border?: {
    isEnabled: boolean;
    style?: "solid" | "dashed" | "dotted";
    thickness?: number; // px
    color?: string;
    opacity?: number; //0-100
  };
};

/**
 * A section of priced items. Replaces the old `category`/`container` pair:
 * a category was this with `showHeading`, a container was this without.
 */
export type ItemsBlock = BaseContentBlock & {
  type: "items";
  /** Always stored. Shown as the section heading only when `showHeading`. */
  name: string;
  showHeading: boolean;
  /** Initial expanded state. Only reachable when `showHeading` - the heading is the toggle. */
  isExpanded: boolean;
  layout: ContentLayout;
  items: Item[];
};

/** @deprecated Legacy shape, normalized to `ItemsBlock` on read. Do not write. */
export type CategoryBlock = BaseContentBlock & {
  type: "category";
  name: string;
  layout: ContentLayout;
  items: Item[];
  isExpanded: boolean;
};

/** @deprecated Legacy shape, normalized to `ItemsBlock` on read. Do not write. */
export type ContainerBlock = BaseContentBlock & {
  type: "container";
  name: string;
  layout: ContentLayout;
  items: Item[];
};

export type EmbeddingBlock = BaseContentBlock & {
  type: "embedding";
  name?: string;  
  code: string;
};

/**
 * Author-written HTML/CSS/JS - a banner, an animation, a small interactive
 * object. Rendered inside a sandboxed frame with an opaque origin, so the
 * fragment can animate and lay itself out but can reach no cookie, storage or
 * parent DOM. Analytics is not a block at all: it is a catalogue setting
 * (`Metadata.googleAnalyticsId`), because a tag has to run same-origin.
 */
export type CustomVisualBlock = BaseContentBlock & {
  type: "custom_visual";
  name?: string;
  code: string;
};

/** @deprecated Renamed to `custom_visual`. Normalized on read. Do not write. */
export type CustomCodeBlock = BaseContentBlock & {
  type: "custom_code";
  name?: string;  
  code: string;
};

export type TextBlock = BaseContentBlock & {
  type: "text";
  name?: string;  
  content: string;
};

export type ContentBlock =
  | ItemsBlock
  | CategoryBlock
  | ContainerBlock
  | EmbeddingBlock
  | CustomVisualBlock
  | CustomCodeBlock
  | TextBlock
  | DividerBlock;

/** Every block that holds items, including the two legacy keys. */
export type AnyItemsBlock = ItemsBlock | CategoryBlock | ContainerBlock;

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

export type CustomThemeColors = Partial<
  Record<
    | "background"
    | "heading"
    | "text"
    | "primary"
    | "secondary"
    | "cardBackground",
    string
  >
>;

export type Appearance = {
  theme: {
    type: ThemeType;
    name: string;
    colors?: CustomThemeColors;
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
  type: "default" | "custom";
  cta: CTAButton;
  newsletter: boolean;
  showPartners: boolean;
  logoSize: {
    width: number;
    height: number;
  };
};

export type Header = {
  type: "default" | "custom";
  cta: CTAButton;
  emailCta: boolean;
  phoneCta: boolean;
  logoSize: {
    width: number;
    height: number;
  };
};

export type Contact = {
  phone: string;
  email: string;
  website: string;
  socials: string[];
};
