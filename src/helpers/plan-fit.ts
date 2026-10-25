import { tiers } from "../constants/pricing";

type TierFeatures = (typeof tiers)[number]["features"];

/** Block keys that hold items, including the pre-merge `category` and `container`. */
const ITEMS_BLOCK_TYPES = ["items", "category", "container"];

const blocksOf = (content: unknown): { type?: string; items?: unknown[] }[] =>
  Array.isArray(content) ? content : [];

/** What `sections_per_catalogue` counts: every block, text included. */
export function countPlanSections(content: unknown): number {
  return blocksOf(content).length;
}

/** What `items_per_catalogue` counts: the items in items blocks. */
export function countPlanItems(content: unknown): number {
  return blocksOf(content).reduce(
    (total, block) =>
      total +
      (ITEMS_BLOCK_TYPES.includes(block?.type ?? "") && Array.isArray(block.items)
        ? block.items.length
        : 0),
    0
  );
}

/**
 * Which stored `type` keys each `features.sections` flag governs, including the
 * legacy keys a row can still carry. A gated type must be listed here or it is
 * ungated, so the map is the gate.
 */
export const GATED_SECTION_TYPES: {
  types: string[];
  label: string;
  flag: keyof TierFeatures["sections"];
}[] = [
  { types: ["divider"], label: "Divider", flag: "divider" },
  { types: ["embedding"], label: "External content", flag: "embedding" },
  { types: ["custom_visual"], label: "Custom visual", flag: "customVisual" },
];

export type PlanMisfit = {
  items?: { used: number; limit: number };
  sections?: { used: number; limit: number };
  lockedTypes?: string[];
};

/**
 * Whether a catalogue fits a plan completely: the bar for going live. The app
 * refuses publishing or switching on below it, and the backend's subscription
 * job switches off any active catalogue that falls below it.
 */
export function catalogueFitsPlan(
  content: unknown,
  features: TierFeatures
): { ok: true } | { ok: false; misfit: PlanMisfit } {
  const misfit: PlanMisfit = {};

  const items = countPlanItems(content);
  if (
    typeof features.items_per_catalogue === "number" &&
    items > features.items_per_catalogue
  ) {
    misfit.items = { used: items, limit: features.items_per_catalogue };
  }

  const sections = countPlanSections(content);
  if (
    typeof features.sections_per_catalogue === "number" &&
    sections > features.sections_per_catalogue
  ) {
    misfit.sections = {
      used: sections,
      limit: features.sections_per_catalogue,
    };
  }

  const blocks = blocksOf(content);
  const locked = GATED_SECTION_TYPES.filter(
    ({ types, flag }) =>
      features.sections[flag] !== true &&
      blocks.some((block) => types.includes(block?.type ?? ""))
  ).map(({ types }) => types[0]);
  if (locked.length > 0) misfit.lockedTypes = locked;

  return Object.keys(misfit).length === 0
    ? { ok: true }
    : { ok: false, misfit };
}

/** What the owner has to remove, in one sentence. */
export function misfitMessage(misfit: PlanMisfit, planName: string): string {
  const parts: string[] = [];
  if (misfit.items) {
    parts.push(`${misfit.items.used - misfit.items.limit} item(s)`);
  }
  if (misfit.sections) {
    parts.push(`${misfit.sections.used - misfit.sections.limit} section(s)`);
  }
  for (const type of misfit.lockedTypes ?? []) {
    const label = GATED_SECTION_TYPES.find(({ types }) => types[0] === type)
      ?.label;
    parts.push(`the ${label ?? type} sections`);
  }
  const list =
    parts.length > 1
      ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`
      : parts[0];
  return `Remove ${list} to fit the ${planName} plan.`;
}
