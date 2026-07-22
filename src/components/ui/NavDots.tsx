import { useEffect, useState } from "react";
import { scrollToSection } from "@/utils";
import type { AppRoute } from "@/hooks";

// Label display untuk tiap section ID
const SECTION_LABELS: Record<string, string> = {
  opening: "Beranda",
  "path-select": "Pilih Jalur",
  castle: "Kastil",
  village: "Desa",
  marketplace: "Pasar",
  economy: "Ekonomi",
  jobs: "Pekerjaan",
  dungeon: "Dungeon",
  boss: "Boss",
  gallery: "Galeri",
  trailer: "Trailer",
  "join-server": "Bergabung",
  faq: "Pertanyaan",
};

const KNOWN_SECTION_IDS = new Set(Object.keys(SECTION_LABELS));

type NavDotsProps = {
  currentRoute: AppRoute;
};

export function NavDots({ currentRoute }: NavDotsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [presentIds, setPresentIds] = useState<string[]>([]);

  useEffect(() => {
    // Cari section apa saja yang ADA di halaman saat ini, dalam URUTAN ASLI
    // kemunculannya di DOM (bukan urutan tetap dari daftar konstanta) — supaya
    // kalau suatu halaman merender section dengan urutan yang beda (mis. Village
    // sebelum Castle di halaman Wilayah), titik navigasinya ikut nyesuaiin.
    const sectionEls = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const present = sectionEls.map((el) => el.id).filter((id) => KNOWN_SECTION_IDS.has(id));

    setPresentIds(present);
    if (present.length > 0) {
      setActiveId(present[0]);
    }

    if (present.length === 0) return;

    // Tentukan section aktif berdasarkan posisi scroll aktual — dicek ulang tiap
    // event scroll, bukan cuma sekali di awal. Section "aktif" = section yang
    // batas atasnya paling dekat (dan sudah terlewati) dari garis referensi di
    // ~35% tinggi layar dari atas.
    function updateActiveByScroll() {
      const referenceY = window.innerHeight * 0.35;
      let closestId = present[0];
      let closestDist = Infinity;

      present.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= referenceY) {
          const dist = referenceY - top;
          if (dist < closestDist) {
            closestDist = dist;
            closestId = id;
          }
        }
      });

      setActiveId(closestId);
    }

    updateActiveByScroll();
    window.addEventListener("scroll", updateActiveByScroll, { passive: true });
    window.addEventListener("resize", updateActiveByScroll);

    return () => {
      window.removeEventListener("scroll", updateActiveByScroll);
      window.removeEventListener("resize", updateActiveByScroll);
    };
  }, [currentRoute]); // Run ulang setiap pindah halaman/route

  // Jika halaman hanya punya 1 section (seperti galeri), tidak usah tampilkan navigasi dots
  if (presentIds.length <= 1) return null;

  return (
    <nav
      aria-label="Navigasi cepat section"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3"
    >
      {presentIds.map((id) => {
        const isActive = activeId === id;
        const isHovered = hoveredId === id;

        return (
          <button
            key={id}
            id={`nav-dot-${id}`}
            onClick={() => scrollToSection(`#${id}`)}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            aria-label={`Navigasi ke ${SECTION_LABELS[id] || id}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-gold rounded-full"
          >
            {/* Tooltip label — muncul saat hover */}
            <span
              className={`text-xs font-body uppercase tracking-wider text-ember-gold transition-all duration-300 ${
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
              }`}
            >
              {SECTION_LABELS[id] || id}
            </span>

            {/* Dot */}
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-3 w-3 bg-ember-gold shadow-[0_0_8px_2px_rgba(201,162,39,0.6)]"
                  : isHovered
                    ? "h-2.5 w-2.5 bg-ember-gold/70"
                    : "h-1.5 w-1.5 bg-parchment-white/30 hover:bg-ember-gold/50"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
