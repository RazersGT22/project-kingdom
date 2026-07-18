import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { galleryCopy, galleryItems } from "@/data";
import { useScrollReveal } from "@/hooks";
import { SectionHeading, Card } from "@/components/ui";
import { GalleryComments } from "./GalleryComments";

const ALL_CATEGORIES = ["Semua", ...Array.from(new Set(galleryItems.map((i) => i.category)))];

export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<(typeof galleryItems)[0] | null>(null);

  const filtered = galleryItems.filter(
    (item) => activeCategory === "Semua" || item.category === activeCategory,
  );

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
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0c0d10] to-obsidian-night pointer-events-none"
      />
      <div aria-hidden="true" className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <SectionHeading eyebrow="Galeri Kerajaan" title={galleryCopy.headline} className="mb-4" />
        <p className="max-w-3xl text-base md:text-lg text-parchment-white/70 leading-relaxed mb-10">
          {galleryCopy.body}
        </p>

        {/* Filter category bar */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-10" role="tablist" aria-label="Filter galeri">
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

        {/* Grid galeri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-gold rounded-xl overflow-hidden"
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
          ))}
        </div>
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
