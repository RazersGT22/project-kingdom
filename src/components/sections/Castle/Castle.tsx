import { useRef } from "react";
import { castleCopy } from "@/data";
import { useParallax, useStaggerReveal } from "@/hooks";
import { SectionHeading, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";
import type { ArchetypeId } from "@/types";

type CastleProps = {
  activePath: ArchetypeId | null;
};

// Fitur kastil — placeholder konten, konsisten lintas archetype.
const castleFeatures = [
  {
    icon: "🏰",
    title: "Tembok Kuat",
    desc: "Sistem pertahanan berlapis yang melindungi seluruh wilayah kerajaan.",
  },
  {
    icon: "⚔️",
    title: "Senjata Legendaris",
    desc: "Gudang senjata dengan koleksi langka dari seluruh penjuru peta.",
  },
  {
    icon: "📜",
    title: "Arsip Kerajaan",
    desc: "Ruang penyimpanan pengetahuan, hukum, dan sejarah peradaban.",
  },
];

// Project Bible Bab 6 & 8 — Castle: 2-kolom desktop, copy menyesuaikan activePath.
// Fallback ke "citizen" saat belum ada archetype terpilih.
export function Castle({ activePath }: CastleProps) {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(ref);
  useParallax(bgRef, 0.6);
  const copy = castleCopy[activePath ?? "citizen"];

  return (
    <section
      id="castle"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden"
    >
      {/* Base gradient — statis, bukan bagian dari parallax */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0f0d0a] via-obsidian-night to-[#080810] pointer-events-none"
      />

      {/* Layer parallax — glow + motif titik, diperbesar (-inset-y-32) agar tidak ada celah saat bergerak */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute -inset-y-32 inset-x-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(201,162,39,0.10) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(201,162,39,0.08) 0%, transparent 40%), radial-gradient(rgba(244,237,224,0.12) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px",
        }}
      />

      {/* Section top border */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Eyebrow */}
        <div data-reveal>
          <SectionHeading
            eyebrow="The Castle"
            title={copy.headline}
            className="mb-12"
          />
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column — image placeholder */}
          <div className="order-2 lg:order-1" data-reveal>
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-ember-gold/15">
              {/* Placeholder image area with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1408] via-[#120e08] to-[#0a0812] flex flex-col items-center justify-center gap-4">
                <div className="text-6xl opacity-20">🏰</div>
                <p className="text-xs uppercase tracking-widest text-parchment-white/20">
                  Castle Visual — Coming Soon
                </p>
              </div>
              {/* Decorative corner accents */}
              <div aria-hidden="true" className="absolute top-3 left-3 h-6 w-6 border-t border-l border-ember-gold/30" />
              <div aria-hidden="true" className="absolute top-3 right-3 h-6 w-6 border-t border-r border-ember-gold/30" />
              <div aria-hidden="true" className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-ember-gold/30" />
              <div aria-hidden="true" className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-ember-gold/30" />
            </div>
          </div>

          {/* Right column — content */}
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            {/* Body copy */}
            <p
              className="text-base md:text-lg text-parchment-white/70 leading-relaxed"
              data-reveal
            >
              {copy.body}
            </p>

            {/* Feature list */}
            <ul className="flex flex-col gap-5" aria-label="Fitur kastil">
              {castleFeatures.map((feat) => (
                <li key={feat.title} className="flex items-start gap-4" data-reveal>
                  <span
                    aria-hidden="true"
                    className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg border border-ember-gold/25 bg-ember-gold/5 text-xl"
                  >
                    {feat.icon}
                  </span>
                  <div>
                    <h4 className="font-heading text-parchment-white mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-sm text-parchment-white/55 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {copy.ctaLabel && (
              <div className="pt-2" data-reveal>
                <Button
                  variant="secondary"
                  className="text-base py-4"
                  onClick={() => scrollToSection("#village")}
                >
                  {copy.ctaLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
