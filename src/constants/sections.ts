// Project Bible Bab 8 — urutan folder section = urutan scroll.
export const SECTION_IDS = [
  "opening",
  "path-select",
  "castle",
  "village",
  "marketplace",
  "economy",
  "jobs",
  "dungeon",
  "boss",
  "gallery",
  "trailer",
  "join-server",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

// Section yang menerima activePath (Implementation Guide Bagian 2 & 5).
// Opening, PathSelect, Gallery, Trailer, JoinServer TIDAK per-archetype (copy tunggal).
export const PATH_AWARE_SECTIONS: SectionId[] = [
  "castle",
  "village",
  "marketplace",
  "economy",
  "jobs",
  "dungeon",
  "boss",
];
