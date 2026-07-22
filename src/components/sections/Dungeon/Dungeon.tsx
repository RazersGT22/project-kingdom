import { useRef, useState } from "react";
import { dungeonCopy } from "@/data";
import { useStaggerReveal, useParallax } from "@/hooks";
import { SectionHeading, Card, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";
import type { ArchetypeId } from "@/types";

type DungeonProps = {
  activePath: ArchetypeId | null;
};

const dungeonList = [
  {
    id: "mines",
    name: "The Forgotten Mines",
    difficulty: "Mudah (Tier I)",
    stars: "⭐⭐",
    bg: "from-[#1a1c1e] to-[#0f1112]",
    icon: "⛏️",
    mobs: ["Cave Spider", "Skeleton Miner", "Zombie Worker"],
    rewards: ["Iron Ore", "Bronze Chest Key", "Rusty Shovel"],
    desc: "Lorong tambang kuno yang runtuh, dihuni oleh laba-laba raksasa dan kerangka penambang terdahulu. Tempat sempurna untuk petualang pemula.",
  },
  {
    id: "crypt",
    name: "Crypt of the Ancestors",
    difficulty: "Menantang (Tier II)",
    stars: "⭐⭐⭐",
    bg: "from-[#1b1921] to-[#0d0a10]",
    icon: "💀",
    mobs: ["Undead Guardian", "Wraith", "Ancient Ghoul"],
    rewards: ["Silver Ingot", "Relic Fragment", "Scroll of Healing"],
    desc: "Makam bawah tanah leluhur bangsawan yang dipenuhi kutukan mistis. Berhati-hatilah dengan perangkap panah tersembunyi.",
  },
  {
    id: "citadel",
    name: "Volcanic Citadel",
    difficulty: "Legendaris (Tier III)",
    stars: "⭐⭐⭐⭐⭐",
    bg: "from-[#281515] to-[#120707]",
    icon: "🌋",
    mobs: ["Fire Golem", "Hellhound", "Magma Slime"],
    rewards: ["Obsidian Shard", "Dragon Scale", "Hellfire Core"],
    desc: "Benteng yang dibangun di atas lava pijar aktif. Hanya petualang dengan zirah tahan panas tingkat tinggi yang sanggup bertahan.",
  },
];

export function Dungeon({ activePath }: DungeonProps) {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(ref);
  useParallax(bgRef, 0.6);
  const [selectedId, setSelectedId] = useState("mines");
  const copy = dungeonCopy[activePath ?? "citizen"];
  const activeDungeon = dungeonList.find((d) => d.id === selectedId) || dungeonList[0];

  return (
    <section
      id="dungeon"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden"
    >
      {/* Background gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0e0c0f] to-obsidian-night pointer-events-none"
      />
      {/* Layer parallax — glow ungu redup + motif titik, sesuai tema dungeon yang misterius */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute -inset-y-32 inset-x-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(88,60,120,0.12) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(201,162,39,0.06) 0%, transparent 40%), radial-gradient(rgba(244,237,224,0.10) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px",
        }}
      />

      {/* Top Divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div data-reveal>
          <SectionHeading
            eyebrow="Dungeon & Labirin"
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

        {/* Tab Selection buttons & Detail Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Left Dungeon List Tabs */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-widest text-parchment-white/40 mb-2" data-reveal>
              Pilih Wilayah
            </h3>
            {dungeonList.map((dun) => {
              const isSelected = dun.id === selectedId;
              return (
                <button
                  key={dun.id}
                  data-reveal
                  onClick={() => setSelectedId(dun.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? "border-ember-gold bg-ember-gold/10 text-ember-gold"
                      : "border-parchment-white/10 bg-obsidian-night/40 text-parchment-white/60 hover:border-ember-gold/30 hover:bg-ember-gold/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden="true">{dun.icon}</span>
                    <div>
                      <h4 className="font-heading text-sm text-parchment-white">{dun.name}</h4>
                      <span className="text-[10px] uppercase tracking-wider text-ember-gold">{dun.stars}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Dungeon Details Showcase */}
          <div className="lg:col-span-8" data-reveal>
            <div className={`h-full rounded-xl border border-ember-gold/20 bg-gradient-to-br ${activeDungeon.bg} p-6 md:p-8 flex flex-col justify-between`}>
              <div>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ember-gold">{activeDungeon.difficulty}</span>
                    <h3 className="font-heading text-2xl md:text-3xl text-parchment-white mt-1">{activeDungeon.name}</h3>
                  </div>
                  <span className="text-3xl bg-black/40 border border-ember-gold/25 h-12 w-12 rounded-lg flex items-center justify-center" aria-hidden="true">
                    {activeDungeon.icon}
                  </span>
                </div>

                <p className="text-sm md:text-base text-parchment-white/70 leading-relaxed mb-6">
                  {activeDungeon.desc}
                </p>

                {/* Mob list and rewards preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-parchment-white/10">
                  {/* Monsters */}
                  <div>
                    <h5 className="text-xs uppercase tracking-wider text-ember-gold mb-3">Monster & Penjaga</h5>
                    <ul className="flex flex-col gap-2 text-xs text-parchment-white/60" aria-label="Monster penunggu">
                      {activeDungeon.mobs.map((mob) => (
                        <li key={mob} className="flex items-center gap-2">
                          <span className="text-red-400">⚔️</span> {mob}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rewards */}
                  <div>
                    <h5 className="text-xs uppercase tracking-wider text-ember-gold mb-3">Potensi Loot / Hadiah</h5>
                    <ul className="flex flex-col gap-2 text-xs text-parchment-white/60" aria-label="Hadiah dungeon">
                      {activeDungeon.rewards.map((rew) => (
                        <li key={rew} className="flex items-center gap-2">
                          <span className="text-green-400">💎</span> {rew}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Exploration section highlight */}
              <div className="mt-8 bg-black/40 border border-parchment-white/10 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div>
                  <h6 className="font-bold text-parchment-white">Mode Ekspedisi Aktif</h6>
                  <p className="text-parchment-white/40">Dapatkan bonus EXP +10% saat menjelajah berpasangan.</p>
                </div>
                <div className="text-[10px] text-ember-gold border border-ember-gold/30 px-3 py-1 rounded bg-ember-gold/5 uppercase tracking-wider font-bold">
                  Status: Siap Dijelajahi
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* CTA to Boss */}
        {copy.ctaLabel && (
          <div className="flex justify-start" data-reveal>
            <Button
              variant="primary"
              className="text-base py-4 min-w-[200px]"
              onClick={() => scrollToSection("#boss")}
            >
              {copy.ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
