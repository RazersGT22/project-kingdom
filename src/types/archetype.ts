// Project Bible Bab 5 — 4 archetype (nama masih [ASUMSI], tandai 🔍 di Project Bible).
export type ArchetypeId = "conqueror" | "merchant" | "citizen" | "explorer";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  description: string;
};
