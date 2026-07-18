import { useRef } from "react";
import { marketplaceCopy } from "@/data";
import { useScrollReveal } from "@/hooks";
import { SectionHeading, Card, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";
import type { ArchetypeId } from "@/types";

type MarketplaceProps = {
  activePath: ArchetypeId | null;
};

const npcMerchants = [
  {
    name: "Alistair the Ironclad",
    role: "Master Blacksmith",
    avatar: "⚒️",
    desc: "Menyediakan persenjataan baja Damaskus, zirah pelat tempur, dan layanan perbaikan perlengkapan perang.",
  },
  {
    name: "Mistress Rowena",
    role: "Grand Alchemist",
    avatar: "🧪",
    desc: "Meracik ramuan pemulih instan, racun mematikan, dan ramuan penambah stamina untuk pertempuran panjang.",
  },
  {
    name: "Old Barnaby",
    role: "Merchant Guildmaster",
    avatar: "⚖️",
    desc: "Mengimpor rempah eksotis, sutra, dan memfasilitasi lelang komoditas langka bernilai tinggi.",
  },
];

const marketFeatures = [
  {
    title: "Regional Auction House",
    desc: "Sistem pelelangan otomatis yang menghubungkan seluruh kota di kerajaan untuk transaksi yang adil.",
  },
  {
    title: "Player-to-Player Barter",
    desc: "Tukar barang secara langsung tanpa perantara dengan sistem keamanan transaksi terjamin.",
  },
];

export function Marketplace({ activePath }: MarketplaceProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  const copy = marketplaceCopy[activePath ?? "citizen"];

  return (
    <section
      id="marketplace"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
    >
      {/* Background visual elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0d0f12] to-obsidian-night pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="h-[500px] w-[500px] rounded-full bg-ember-gold/5 blur-[100px]" />
      </div>

      {/* Top Divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <SectionHeading
          eyebrow="Medieval Marketplace"
          title={copy.headline}
          className="mb-6"
        />

        <p className="max-w-3xl text-base md:text-lg text-parchment-white/70 leading-relaxed mb-16">
          {copy.body}
        </p>

        {/* NPC Merchants Grid */}
        <h3 className="font-heading text-2xl text-ember-gold mb-8">Pedagang Terkenal Kerajaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {npcMerchants.map((npc) => (
            <Card
              key={npc.name}
              className="flex flex-col gap-4 border border-ember-gold/15 bg-obsidian-night/40 backdrop-blur-sm hover:border-ember-gold/40 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-ember-gold/10 text-3xl border border-ember-gold/20"
                >
                  {npc.avatar}
                </span>
                <div>
                  <h4 className="font-heading text-lg text-parchment-white">{npc.name}</h4>
                  <span className="text-xs uppercase tracking-wider text-ember-gold">{npc.role}</span>
                </div>
              </div>
              <p className="text-sm text-parchment-white/60 leading-relaxed">{npc.desc}</p>
            </Card>
          ))}
        </div>

        {/* Trading Features and Economy Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="font-heading text-2xl text-ember-gold mb-6">Fitur Perdagangan</h3>
            <div className="flex flex-col gap-6">
              {marketFeatures.map((feat) => (
                <div key={feat.title} className="flex gap-4">
                  <span className="text-ember-gold text-xl">✦</span>
                  <div>
                    <h4 className="font-heading text-lg text-parchment-white mb-1">{feat.title}</h4>
                    <p className="text-sm text-parchment-white/65 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#121417]/80 border border-ember-gold/20 rounded-xl p-8">
            <h4 className="font-heading text-lg text-ember-gold mb-4">Sorotan Ekonomi</h4>
            <p className="text-sm text-parchment-white/70 leading-relaxed mb-6">
              Sistem ekonomi RZ Survival dirancang untuk mensimulasikan pasar nyata. Inflasi, kelangkaan barang,
              dan pajak kastil secara dinamis berubah berdasarkan aktivitas pemain. Setiap keputusan dagang berdampak luas.
            </p>
            <div className="flex items-center justify-between border-t border-parchment-white/10 pt-4 text-sm text-parchment-white/50">
              <span>Mata Uang Server: Gold Coins (GC)</span>
              <span>Status Pasar: Stabil</span>
            </div>
          </div>
        </div>

        {/* CTA to Economy */}
        {copy.ctaLabel && (
          <div className="flex justify-start">
            <Button
              variant="primary"
              className="text-base py-4 min-w-[200px]"
              onClick={() => scrollToSection("#economy")}
            >
              {copy.ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
