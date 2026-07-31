import { useEffect } from "react";
import type { AppRoute } from "./useHashRouter";

// Tahap 3 (RENCANA.md, poin SEO) — judul tab browser beda-beda per halaman.
// CATATAN PENTING: ini CUMA ngubah judul tab browser (bagus buat history/
// bookmark/tab management), BUKAN preview pas link di-share ke WhatsApp/
// Discord — preview share pakai Open Graph tags di index.html yang statis
// (nggak bisa beda-beda per halaman di SPA client-side kayak ini, karena
// aplikasi chat baca HTML mentah, nggak jalanin JavaScript kita).
const PAGE_TITLES: Record<AppRoute, string> = {
  "/": "Project Kingdom — RZ Survival",
  "/world": "Wilayah — Project Kingdom",
  "/economy": "Ekonomi — Project Kingdom",
  "/gameplay": "Gameplay — Project Kingdom",
  "/gallery": "Galeri — Project Kingdom",
  "/faq": "Bantuan — Project Kingdom",
  "/404": "Halaman Tidak Ditemukan — Project Kingdom",
};

export function useDocumentTitle(route: AppRoute) {
  useEffect(() => {
    document.title = PAGE_TITLES[route] ?? "Project Kingdom — RZ Survival";
  }, [route]);
}
