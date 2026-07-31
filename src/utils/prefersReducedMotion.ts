// RENCANA.md Tahap 3, poin Aksesibilitas — deteksi setting "Kurangi Gerakan"
// (prefers-reduced-motion) di OS/browser user. Dipakai di semua efek gerak
// yang ditambah di Tahap 2 (grain, hover tilt, magnetic cursor, reveal
// berlapis) supaya otomatis mengalah buat user yang butuh, tanpa perlu
// tombol manual apapun di website ini.
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
