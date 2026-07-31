import { Button } from "@/components/ui";
import { useHashRouter } from "@/hooks";

// RENCANA.md Tahap 3 — Halaman 404. Muncul kalau URL/hash yang diketik user
// nggak dikenal (lihat useHashRouter.ts, getRouteFromHash — return "/404").
// Sengaja TIDAK di-lazy-load kayak halaman lain di src/pages/ — ini komponen
// kecil & harus langsung tampil tanpa jeda "Memuat...", soalnya penampilannya
// sendiri sudah bagian dari feedback ke user bahwa link/URL-nya salah.
export function PageNotFound() {
  const { navigate } = useHashRouter();

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Kabut dekoratif di background, konsisten sama tema gelap situs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian-night/40 to-obsidian-night pointer-events-none"
      />

      <div className="relative z-10 max-w-xl">
        <span className="font-heading text-8xl md:text-9xl text-ember-gold/20 select-none block mb-2">
          404
        </span>
        <h1 className="font-heading text-3xl md:text-4xl text-parchment-white mb-4">
          Jalan Ini Berakhir di Kabut
        </h1>
        <p className="text-parchment-white/60 text-base leading-relaxed mb-10">
          Petualang, jalan yang kau tuju rupanya belum pernah dipetakan oleh kerajaan
          ini — atau mungkin sudah lama ditelan kabut. Mari kembali ke jalan yang
          dikenal.
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          ← Kembali ke Beranda
        </Button>
      </div>
    </section>
  );
}
