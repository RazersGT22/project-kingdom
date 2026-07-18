// Implementation Guide Bagian 4 — navigasi via anchor scroll, bukan router.
export function scrollToSection(anchor: string): void {
  const id = anchor.startsWith("#") ? anchor.slice(1) : anchor;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
