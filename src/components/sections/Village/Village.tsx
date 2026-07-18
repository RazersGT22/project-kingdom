import { useRef } from "react";
import { villageCopy } from "@/data";
import { useScrollReveal } from "@/hooks";
import { SectionHeading, Card, Button } from "@/components/ui";
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
  useScrollReveal(ref);
  const copy = villageCopy[activePath ?? "citizen"];

  return (
    <section
      id="village"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
    >
      {/* Background accent — slight warm tint to differentiate from Castle */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#100d08] to-obsidian-night pointer-events-none"
      />

      {/* Section top border */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <SectionHeading
          eyebrow="The Village"
          title={copy.headline}
          className="mb-6"
        />

        {/* Body copy */}
        <p className="max-w-2xl text-base md:text-lg text-parchment-white/60 leading-relaxed mb-14">
          {copy.body}
        </p>

        {/* 3 feature cards — 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {villageFeatures.map((feat) => (
            <Card
              key={feat.title}
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
          ))}
        </div>

        {/* CTA */}
        {copy.ctaLabel && (
          <Button
            variant="secondary"
            className="text-base py-4"
            onClick={() => scrollToSection("#marketplace")}
          >
            {copy.ctaLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
