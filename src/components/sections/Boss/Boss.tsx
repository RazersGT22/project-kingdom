import { useRef } from "react";
import { bossCopy } from "@/data";
import { useStaggerReveal, useParallax } from "@/hooks";
import { SectionHeading, Card, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";
import type { ArchetypeId } from "@/types";

type BossProps = {
  activePath: ArchetypeId | null;
};

const dropItems = [
  {
    name: "Dreadnought Greatsword",
    tier: "Mythic",
    rate: "1%",
    icon: "🗡️",
    glow: "border-purple-500/40 bg-purple-950/20 shadow-purple-500/10 hover:border-purple-400/80 hover:shadow-purple-500/20",
  },
  {
    name: "Heart of Ignis (Relic)",
    tier: "Legendary",
    rate: "5%",
    icon: "❤️",
    glow: "border-orange-500/40 bg-orange-950/20 shadow-orange-500/10 hover:border-orange-400/80 hover:shadow-orange-500/20",
  },
  {
    name: "Dragonscale Aegis",
    tier: "Epic",
    rate: "10%",
    icon: "🛡️",
    glow: "border-blue-500/40 bg-blue-950/20 shadow-blue-500/10 hover:border-blue-400/80 hover:shadow-blue-500/20",
  },
];

export function Boss({ activePath }: BossProps) {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(ref);
  useParallax(bgRef, 0.6);
  const copy = bossCopy[activePath ?? "citizen"];

  return (
    <section
      id="boss"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden"
    >
      {/* Dark reddish magma style background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#150a0a] to-[#0c0505] pointer-events-none"
      />
      {/* Layer parallax — glow merah magma + motif titik, sesuai tema Boss */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute -inset-y-32 inset-x-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(153,27,27,0.14) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(153,27,27,0.10) 0%, transparent 40%), radial-gradient(rgba(244,237,224,0.10) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="h-[600px] w-[600px] rounded-full bg-red-900/5 blur-[120px]" />
      </div>

      {/* Top Divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div data-reveal>
          <SectionHeading
            eyebrow="Raid Boss Event"
            title={copy.headline}
            className="mb-6"
          />
        </div>

        <p
          className="max-w-3xl text-base md:text-lg text-parchment-white/70 leading-relaxed mb-12"
          data-reveal
        >
          {copy.body}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Boss Lore Card */}
          <div className="relative" data-reveal>
            {/* Pulsing red volcanic aura glow */}
            <div className="absolute inset-0 bg-red-500/15 rounded-2xl blur-3xl animate-magma-pulse pointer-events-none" />
            
            <Card className="relative border border-red-900/30 bg-[#0f0707]/90 p-8 rounded-xl hover-shimmer">
              <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Raid Boss Tier V</span>
              <h3 className="font-heading text-3xl text-parchment-white mt-1 mb-4">Ignis the Dreadnought</h3>
              <p className="text-sm text-parchment-white/70 leading-relaxed mb-6">
                Raksasa naga vulkanik berselimut zirah magma tebal yang bersemayam di jantung kawah terdalam. 
                Semburan api masifnya dapat meluluhlantakkan satu pasukan prajurit dalam hitungan detik. 
                Kalahkan dia bersama seluruh klan kerajaanmu untuk menghentikan malapetaka!
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="bg-red-950/40 border border-red-900/30 px-3 py-2 rounded">
                  <span className="text-parchment-white/40 block mb-1">Rekomendasi Level</span>
                  <span className="font-bold text-red-400">Level 80+ (Raid 10 Pemain)</span>
                </div>
                <div className="bg-red-950/40 border border-red-900/30 px-3 py-2 rounded">
                  <span className="text-parchment-white/40 block mb-1">Status Kesehatan</span>
                  <span className="font-bold text-red-400">10,000,000 HP</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Reward & Loot Showcase */}
          <div>
            <h4 className="font-heading text-xl text-ember-gold mb-6" data-reveal>
              Jaminan Drop Item Legendaris
            </h4>
            <div className="flex flex-col gap-4">
              {dropItems.map((item) => (
                <div
                  key={item.name}
                  data-reveal
                  className={`flex items-center justify-between p-4 rounded-xl border ${item.glow} backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover-shimmer`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl animate-float-slow" aria-hidden="true">{item.icon}</span>
                    <div>
                      <h5 className="font-heading text-sm text-parchment-white">{item.name}</h5>
                      <span className="text-[10px] uppercase tracking-wider text-parchment-white/40">{item.tier}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-ember-gold block">Peluang Drop</span>
                    <span className="font-heading text-sm text-ember-gold">{item.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA to Gallery */}
        {copy.ctaLabel && (
          <div className="flex justify-start" data-reveal>
            <Button
              variant="primary"
              className="text-base py-4 min-w-[200px] hover-shimmer"
              onClick={() => scrollToSection("#gallery")}
            >
              {copy.ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
