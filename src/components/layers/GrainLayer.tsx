// RENCANA.md Tahap 2 poin 3 — grain/noise texture global.
// Overlay butiran film halus di SELURUH layar (termasuk navbar, modal, dll),
// biar kesan visualnya lebih "cinematic", nggak flat digital.
//
// Teknik: SVG feTurbulence di-encode jadi data URI, dipakai sebagai
// background-image berulang (tileable). Animasi CSS `steps()` bikin posisi
// noise-nya "loncat-loncat" tiap frame — itu yang bikin efeknya kerasa kayak
// butiran film asli (bukan noise statis diam).
//
// pointer-events: none — nggak ngeblokir klik/interaksi apapun di bawahnya.
// mixBlendMode "screen" dipilih (bukan "overlay") karena tema web ini gelap
// banget (obsidian-night) — overlay nyaris nggak berefek di atas warna yang
// udah hampir hitam, sedangkan screen tetap kelihatan menerangi tipis di atas
// background gelap apapun.
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function GrainLayer() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none animate-grain-shift"
      style={{
        zIndex: 9000,
        opacity: 0.07,
        mixBlendMode: "screen",
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "140px 140px",
      }}
    />
  );
}
