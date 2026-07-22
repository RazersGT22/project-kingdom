import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { galleryCopy, galleryItems } from "@/data";
import { useStaggerReveal, useParallax, scrollToWithLenis } from "@/hooks";
import { SectionHeading, Card, TiltWrapper } from "@/components/ui";
import { GalleryComments } from "./GalleryComments";

const ALL_CATEGORIES = ["Semua", ...Array.from(new Set(galleryItems.map((i) => i.category)))];

// Jumlah foto per halaman dibuat DINAMIS mengikuti lebar layar, supaya jumlah
// baris konsisten (10 baris) di semua ukuran layar — cuma jumlah kolomnya yang
// beda. Breakpoint di bawah ini HARUS sama dengan grid className di JSX
// ("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"): mobile 1 kolom → 10 foto/halaman,
// tablet 2 kolom → 20 foto/halaman, desktop 3 kolom → 30 foto/halaman.
const ROWS_PER_PAGE = 10;

function getColumnsForWidth(width: number): number {
  if (width >= 1024) return 3; // breakpoint lg
  if (width >= 640) return 2; // breakpoint sm
  return 1; // mobile
}

function getItemsPerPage(): number {
  if (typeof window === "undefined") return ROWS_PER_PAGE;
  return ROWS_PER_PAGE * getColumnsForWidth(window.innerWidth);
}

// Komponen navigasi halaman kecil, dipakai 2 kali (atas & bawah grid) biar
// user nggak perlu scroll balik ke bawah cuma buat ganti halaman kalau lagi
// di atas. Dipisah jadi komponen sendiri biar nggak nulis JSX yang sama 2 kali.
type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function PaginationNav({ currentPage, totalPages, onPageChange }: PaginationNavProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-xs uppercase tracking-wider border border-parchment-white/10 text-parchment-white/60 hover:border-ember-gold/30 hover:text-ember-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman sebelumnya"
      >
        ← Sebelumnya
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`w-9 h-9 rounded-lg text-xs font-heading transition-colors border ${
            currentPage === page
              ? "border-ember-gold bg-ember-gold/10 text-ember-gold"
              : "border-parchment-white/10 text-parchment-white/60 hover:border-ember-gold/30 hover:text-ember-gold"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-xs uppercase tracking-wider border border-parchment-white/10 text-parchment-white/60 hover:border-ember-gold/30 hover:text-ember-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman selanjutnya"
      >
        Selanjutnya →
      </button>
    </div>
  );
}

export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null); // titik scroll target pas ganti halaman
  useStaggerReveal(ref);
  useParallax(bgRef, 0.6);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<(typeof galleryItems)[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(getItemsPerPage);

  // Ganti halaman SEKALIGUS scroll halus ke bagian atas grid — dipakai baik
  // dari navigasi di atas maupun di bawah grid, biar user nggak nyasar liat
  // foto halaman baru padahal posisi scroll masih di tempat lama.
  // Offset -100px: kasih jarak dikit dari navbar yang fixed di atas.
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (gridTopRef.current) {
      scrollToWithLenis(gridTopRef.current, -100);
    }
  };

  // Update jumlah foto per halaman kalau jendela browser di-resize melewati breakpoint
  useEffect(() => {
    function handleResize() {
      setItemsPerPage(getItemsPerPage());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = galleryItems.filter(
    (item) => activeCategory === "Semua" || item.category === activeCategory,
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Balik ke halaman 1 tiap kali kategori filter diganti ATAU jumlah foto per halaman berubah
  // (misal user resize browser sampai lewat breakpoint, biar nggak nyangkut di halaman kosong)
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, itemsPerPage]);

  // Pas lightbox kebuka, matiin scroll halaman belakang biar cuma ada 1 scrollbar aktif
  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0c0d10] to-obsidian-night pointer-events-none"
      />
      {/* Layer parallax — glow + motif titik */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute -inset-y-32 inset-x-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(201,162,39,0.10) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(201,162,39,0.08) 0%, transparent 40%), radial-gradient(rgba(244,237,224,0.12) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px",
        }}
      />
      <div aria-hidden="true" className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div data-reveal>
          <SectionHeading eyebrow="Galeri Kerajaan" title={galleryCopy.headline} className="mb-4" />
        </div>
        <p
          className="max-w-3xl text-base md:text-lg text-parchment-white/70 leading-relaxed mb-10"
          data-reveal
        >
          {galleryCopy.body}
        </p>

        {/* Filter category bar */}
        <div
          className="flex flex-wrap gap-2 md:gap-3 mb-10"
          role="tablist"
          aria-label="Filter galeri"
          data-reveal
        >
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-heading transition-all duration-300 border ${
                activeCategory === cat
                  ? "border-ember-gold bg-ember-gold/10 text-ember-gold"
                  : "border-parchment-white/10 bg-obsidian-night/40 text-parchment-white/60 hover:border-ember-gold/30 hover:bg-ember-gold/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Titik target scroll pas ganti halaman (baik dari nav atas maupun bawah) */}
        <div ref={gridTopRef} aria-hidden="true" />

        {/* Navigasi halaman DI ATAS grid — biar user nggak perlu scroll ke
            bawah dulu cuma buat pindah halaman kalau lagi di posisi atas */}
        {totalPages > 1 && (
          <div className="mb-6" data-reveal>
            <PaginationNav
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Grid galeri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginated.map((item, index) => (
            <TiltWrapper
              key={item.id}
              className="animate-card-in rounded-xl"
              style={{ animationDelay: `${Math.min(index, 8) * 150}ms` }}
            >
              <button
                onClick={() => setSelectedItem(item)}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-gold rounded-xl overflow-hidden w-full"
                aria-label={`Lihat detail ${item.title}`}
              >
                <Card className="p-0 border border-ember-gold/15 bg-obsidian-night/40 overflow-hidden hover:border-ember-gold/40 transition-all duration-300 transform group-hover:scale-[1.02] flex flex-col h-full">
                  {/* Real Image */}
                  <div className="aspect-[16/10] w-full relative overflow-hidden bg-[#1a1209]">
                    <img
                      src={item.file}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-ember-gold border border-ember-gold/40 px-3 py-1 rounded bg-black/60">
                        Baca Kisahnya 📜
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-ember-gold">
                        {item.category}
                      </span>
                      <h4 className="font-heading text-lg text-parchment-white mt-1 group-hover:text-ember-gold transition-colors duration-300">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-parchment-white/50 leading-relaxed mt-2 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </Card>
              </button>
            </TiltWrapper>
          ))}
        </div>

        {/* Navigasi halaman DI BAWAH grid - cuma muncul kalau fotonya lebih dari 1 halaman */}
        {totalPages > 1 && (
          <div className="mb-12" data-reveal>
            <PaginationNav
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Lightbox - di-portal-kan ke document.body biar 'fixed' beneran nempel ke layar, */}
      {/* keluar dari pembungkus Lenis yang bisa punya transform dan bikin fixed jadi ke-kunci */}
      {selectedItem && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail: ${selectedItem.title}`}
          onClick={() => setSelectedItem(null)}
        >
          {/* Close - fixed di layar, gak ikut ke-scroll pas isi lightbox digulir */}
          <button
            onClick={() => setSelectedItem(null)}
            className="fixed top-4 right-4 z-[110] flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-ember-gold/30 text-ember-gold hover:bg-ember-gold hover:text-black transition-colors"
            aria-label="Tutup pratinjau"
          >
            ✕
          </button>

          <div
            className="relative w-full h-full border-0 bg-[#0c0d10] overflow-y-auto shadow-2xl pt-20"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className="max-w-3xl mx-auto w-full">
              {/* Real image full */}
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-[#1a1209]">
                <img
                  src={selectedItem.file}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-transparent" />
              </div>

              {/* Narrative info */}
              <div className="p-6 md:p-8">
                <span className="text-xs uppercase tracking-wider text-ember-gold font-bold">
                  {selectedItem.category}
                </span>
                <h3 className="font-heading text-2xl text-parchment-white mt-1 mb-3">
                  {selectedItem.title}
                </h3>
                <p className="text-sm text-parchment-white/70 leading-relaxed mb-4">
                  {selectedItem.desc}
                </p>
                {/* Lore divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-ember-gold/20" />
                  <span className="text-[10px] uppercase tracking-widest text-ember-gold/60">Kronik Kerajaan</span>
                  <div className="flex-1 h-px bg-ember-gold/20" />
                </div>
                <p className="text-sm text-parchment-white/55 leading-relaxed italic">
                  {selectedItem.lore}
                </p>

                <GalleryComments photoId={selectedItem.file} />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
