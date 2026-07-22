import { useRef } from "react";
import { archetypes, pathSelectCopy } from "@/data";
import { useStaggerReveal, usePathSelection } from "@/hooks";
import { SectionHeading, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";
import { PathCard } from "./PathCard";

// Project Bible Bab 6 & 8 — titik cabang personalisasi utama.
export function PathSelect() {
  const ref = useRef<HTMLElement>(null);
  useStaggerReveal(ref);
  const { activePath, selectPath } = usePathSelection();

  return (
    <section
      id="path-select"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
    >
      {/* Section background accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0e0c0a] to-obsidian-night pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div data-reveal>
          <SectionHeading
            eyebrow="Pilih Jalanmu"
            title={pathSelectCopy.headline}
            className="mb-4"
          />
        </div>
        <p
          className="max-w-2xl text-parchment-white/60 mb-12 text-base md:text-lg leading-relaxed"
          data-reveal
        >
          {pathSelectCopy.body}
        </p>

        {/* Archetype grid — 1 col mobile, 2 col tablet, 4 col desktop */}
        <div
          role="radiogroup"
          aria-label="Pilih arketipe karaktermu"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
        >
          {archetypes.map((archetype) => (
            <div key={archetype.id} data-reveal>
              <PathCard
                archetype={archetype}
                isActive={activePath === archetype.id}
                onSelect={selectPath}
              />
            </div>
          ))}
        </div>

        {/* CTA - muncul setelah archetype dipilih, tetap tersedia meski belum pilih */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4" data-reveal>
          <Button
            variant="primary"
            className={`text-base py-4 min-w-[220px] transition-opacity duration-300 ${
              activePath ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => scrollToSection("#castle")}
          >
            {pathSelectCopy.ctaLabel}
          </Button>
          {!activePath && (
            <p className="text-sm text-parchment-white/40 italic">
              Pilih arketipe di atas untuk melanjutkan
            </p>
          )}
          {activePath && (
            <p className="text-sm text-ember-gold/80">
              Jalanmu telah dipilih ✦
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
