import type { Archetype } from "@/types";

// Implementation Guide Bagian 5. Nama & deskripsi masih [ASUMSI] — lihat
// Project Bible Bab 5 (🔍 open question, belum dikonfirmasi pemilik server).
export const archetypes: Archetype[] = [
  {
    id: "conqueror",
    label: "Penakluk",
    description:
      "Kekuatan adalah segalanya. Kau dilahirkan untuk memimpin pasukan, merebut benteng, dan mengukir namamu dalam sejarah perang kerajaan.",
  },
  {
    id: "merchant",
    label: "Pedagang",
    description:
      "Kekayaan adalah kekuasaan. Kau menguasai pasar, menjalin aliansi dagang, dan membangun kekaisaran ekonomi di balik tembok kota.",
  },
  {
    id: "citizen",
    label: "Pengrajin",
    description:
      "Akar kerajaan tumbuh dari tanganmu. Kau membangun, menciptakan, dan menghidupi komunitas yang menjadi tulang punggung peradaban.",
  },
  {
    id: "explorer",
    label: "Penjelajah",
    description:
      "Peta adalah undangan. Kau menjelajahi wilayah yang tak dikenal, menemukan rahasia kuno, dan membawa pulang kisah yang tak ternilai.",
  },
];
