import { useRef } from "react";
import { villageCopy } from "@/data";
import { useStaggerReveal, useParallax } from "@/hooks";
import { SectionHeading, Card, Button, TiltWrapper } from "@/components/ui";
import { scrollToSection } from "@/utils";
import type { ArchetypeId } from "@/types";

type VillageProps = {
  activePath: ArchetypeId | null;
};

// 3 kartu fitur komunitas desa — konten placeholder, konsisten lintas archetype.
const villageFeatures = [
  {
    icon: "🌾",
    title: "Pertanian & Panen",
    desc: "Kelola lahan, tanam berbagai tanaman, dan nikmati hasil panen bersama komunitas yang solid.",
  },
  {
    icon: "🔨",
    title: "Keahlian Tradisional",
    desc: "Pelajari seni kerajinan tangan, tempa senjata, atau bangun struktur yang bertahan berabad-abad.",
  },
  {
    icon: "🤝",
    title: "Persekutuan Warga",
    desc: "Bergabung dengan guild, selenggarakan festival, dan bentuk aliansi yang mengubah sejarah kerajaan.",
  },
];

// Project Bible Bab 6 & 8 — Village: 3 kartu fitur komunitas, copy menyesuaikan activePath.
// Fallback ke "citizen" saat belum ada archetype terpilih.
export function Village({ activePath }: VillageProps) {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(ref);
  useParallax(bgRef, 0.6);
  const copy = villageCopy[activePath ?? "citizen"];

  return (
    <section
      id="village"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden"
    >
      {/* Background accent — slight warm tint to differentiate from Castle */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#100d08] to-obsidian-night pointer-events-none"
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

      {/* Section top border */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div data-reveal>
          <SectionHeading
            eyebrow="The Village"
            title={copy.headline}
            className="mb-6"
          />
        </div>

        {/* Body copy */}
        <p
          className="max-w-2xl text-base md:text-lg text-parchment-white/60 leading-relaxed mb-14"
          data-reveal
        >
          {copy.body}
        </p>

        {/* 3 feature cards — 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {villageFeatures.map((feat) => (
            <TiltWrapper key={feat.title} data-reveal>
              <Card
                className="flex flex-col gap-4 hover:border-ember-gold/50 transition-colors duration-300"
              >
                {/* Icon area */}
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-ember-gold/20 bg-ember-gold/5 text-2xl"
                >
                  {feat.icon}
                </span>

                {/* Card content */}
                <h3 className="font-heading text-xl text-parchment-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-parchment-white/55 leading-relaxed flex-1">
                  {feat.desc}
                </p>

                {/* Hover accent line */}
                <div
                  aria-hidden="true"
                  className="mt-auto h-px bg-gradient-to-r from-ember-gold/30 to-transparent"
                />
              </Card>
            </TiltWrapper>
          ))}
        </div>

        {/* CTA */}
        {copy.ctaLabel && (
          <div data-reveal>
            <Button
              variant="secondary"
              className="text-base py-4"
              onClick={() => scrollToSection("#marketplace")}
            >
              {copy.ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
