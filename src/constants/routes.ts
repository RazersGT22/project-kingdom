// Implementation Guide Bagian 4 — tidak ada routing multi-page.
// Anchor dipakai untuk navigasi Navbar → scrollIntoView per section.
import { SECTION_IDS } from "./sections";

export const ANCHORS = SECTION_IDS.map((id) => `#${id}`);
