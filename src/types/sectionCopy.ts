import type { ArchetypeId } from "./archetype";

// Project Bible Bab 7 — skema minimal copy per section.
export type SectionCopy = {
  headline: string;
  body: string;
  ctaLabel?: string;
};

export type ArchetypeCopyMap = Record<ArchetypeId, SectionCopy>;
