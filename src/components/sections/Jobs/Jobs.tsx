import { useRef } from "react";
import { jobsCopy } from "@/data";
import { useScrollReveal } from "@/hooks";
import { SectionHeading, Card, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";
import type { ArchetypeId } from "@/types";

type JobsProps = {
  activePath: ArchetypeId | null;
};

const jobsList = [
  {
    title: "Royal Soldier (Prajurit)",
    icon: "🛡️",
    reward: "1,200 GC + Exp Militer / Jam",
    rank: "Recruit ➔ Royal Commander",
    progress: 40,
    desc: "Menjaga keamanan gerbang depan, membersihkan bandit di pinggiran kota, dan ikut serta dalam ekspedisi pertahanan.",
  },
  {
    title: "Master Miner (Penambang)",
    icon: "⛏️",
    reward: "850 GC + Mineral Langka / Jam",
    rank: "Apprentice ➔ Mythril Miner",
    progress: 75,
    desc: "Menambang bijih besi, batubara, dan permata mistis di gua bawah tanah kastil untuk pasokan pandai besi.",
  },
  {
    title: "Grand Blacksmith",
    icon: "⚒️",
    reward: "1,500 GC + Bahan Pembuatan / Jam",
    rank: "Forge Initiate ➔ Artificer",
    progress: 20,
    desc: "Menempa baja, memodifikasi senjata pahlawan, dan menyuplai persenjataan militer kerajaan.",
  },
  {
    title: "Beast Hunter (Pemburu)",
    icon: "🏹",
    reward: "1,100 GC + Kulit & Daging / Jam",
    rank: "Tracker ➔ Legendary Hunter",
    progress: 90,
    desc: "Memburu binatang buas di hutan kelam, mengumpulkan bahan obat-obatan, dan melacak keberadaan bos purba.",
  },
];

export function Jobs({ activePath }: JobsProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  const copy = jobsCopy[activePath ?? "citizen"];

  return (
    <section
      id="jobs"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
    >
      {/* Background gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0b0c10] to-obsidian-night pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-ember-gold/5 blur-[120px] pointer-events-none"
      />

      {/* Top Divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <SectionHeading
          eyebrow="Guild Pekerjaan"
          title={copy.headline}
          className="mb-6"
        />

        <p className="max-w-3xl text-base md:text-lg text-parchment-white/70 leading-relaxed mb-16">
          {copy.body}
        </p>

        {/* Jobs Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {jobsList.map((job) => (
            <Card
              key={job.title}
              className="flex flex-col justify-between border border-ember-gold/15 bg-obsidian-night/40 hover:border-ember-gold/40 transition-all duration-300 group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-gold/10 text-2xl border border-ember-gold/20"
                    >
                      {job.icon}
                    </span>
                    <div>
                      <h4 className="font-heading text-lg text-parchment-white group-hover:text-ember-gold transition-colors duration-300">
                        {job.title}
                      </h4>
                      <span className="text-xs text-ember-gold/70">{job.rank}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-parchment-white/60 leading-relaxed mb-6">
                  {job.desc}
                </p>
              </div>

              {/* Progress & Reward stats */}
              <div className="border-t border-parchment-white/5 pt-4 mt-auto">
                <div className="flex justify-between text-xs text-parchment-white/40 mb-2">
                  <span>Progres Kemajuan</span>
                  <span className="text-ember-gold">{job.progress}%</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-4 border border-parchment-white/5">
                  <div
                    className="bg-ember-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-parchment-white/40">Estimasi Upah</span>
                  <span className="font-heading text-ember-gold">{job.reward}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA to Dungeon */}
        {copy.ctaLabel && (
          <div className="flex justify-start">
            <Button
              variant="primary"
              className="text-base py-4 min-w-[200px]"
              onClick={() => scrollToSection("#dungeon")}
            >
              {copy.ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
