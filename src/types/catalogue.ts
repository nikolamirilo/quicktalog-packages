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
 * parent DOM. Analytics belongs in `TrackingBlock`, which runs same-origin.
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

/**
 * Providers the analytics block can load. A closed set on purpose: the block
 * stores an id, never a snippet, and the app builds the tag from a template.
 */
export type TrackingProvider =
  | "ga4"
  | "gtm"
  | "meta_pixel"
  | "hotjar"
  | "clarity";

/**
 * A third-party analytics tag. Unlike every other block this renders nothing;
 * it is configuration that the published page collects and loads once the
 * visitor has consented. `trackingId` is the only author-controlled value, and
 * it is validated against the provider's pattern again at render.
 */
export type TrackingBlock = BaseContentBlock & {
  type: "tracking";
  name?: string;
  provider: TrackingProvider;
  trackingId: string;
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
  | TrackingBlock
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
