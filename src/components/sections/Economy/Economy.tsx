import { useRef } from "react";
import { economyCopy } from "@/data";
import { useStaggerReveal, useParallax } from "@/hooks";
import { SectionHeading, Card, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";
import type { ArchetypeId } from "@/types";

type EconomyProps = {
  activePath: ArchetypeId | null;
};

const economyFeatures = [
  {
    title: "Official Castle Shop",
    desc: "Toko resmi yang dikelola oleh bangsawan kerajaan. Menjual kebutuhan dasar dengan harga stabil dan membeli hasil panen atau tambang mentah dengan harga standar keamanan.",
  },
  {
    title: "Player Marketplace (Toko Pemain)",
    desc: "Sistem pasar bebas di mana setiap pemain dapat menyewa lapak, menetapkan harga jual sendiri, dan bersaing secara terbuka dengan pedagang lainnya.",
  },
];

export function Economy({ activePath }: EconomyProps) {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(ref);
  useParallax(bgRef, 0.6);
  const copy = economyCopy[activePath ?? "citizen"];

  return (
    <section
      id="economy"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden"
    >
      {/* Background visual elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0e0c0d] to-obsidian-night pointer-events-none"
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
        <div data-reveal>
          <SectionHeading
            eyebrow="Server Economy"
            title={copy.headline}
            className="mb-6"
          />
        </div>

        <p
          className="max-w-3xl text-base md:text-lg text-parchment-white/70 leading-relaxed mb-16"
          data-reveal
        >
          {copy.body}
        </p>

        {/* 2 Column Layout: Details and Vault Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Details */}
          <div className="flex flex-col gap-8">
            <div data-reveal>
              <h3 className="font-heading text-2xl text-ember-gold mb-4">Sistem Keuangan Kerajaan</h3>
              <p className="text-sm text-parchment-white/70 leading-relaxed">
                Kerajaan menggunakan mata uang tunggal resmi yang disebut **Gold Coins (GC)**. GC digunakan untuk seluruh
                aktivitas perdagangan, klaim wilayah, pembayaran pajak, hingga perekrutan tentara bayaran.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {economyFeatures.map((feat) => (
                <div key={feat.title} className="flex gap-4" data-reveal>
                  <span className="text-ember-gold text-lg">✦</span>
                  <div>
                    <h4 className="font-heading text-lg text-parchment-white mb-1">{feat.title}</h4>
                    <p className="text-sm text-parchment-white/65 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Balance Illustration Card (Premium vault mockup) */}
          <div className="relative" data-reveal>
            {/* Ambient gold glow behind card */}
            <div className="absolute inset-0 bg-ember-gold/10 rounded-2xl blur-xl" />
            
            <Card className="relative border border-ember-gold/30 bg-[#120f0a]/90 backdrop-blur-md p-8 rounded-xl shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-parchment-white/40">Royal Bank Account</span>
                  <h4 className="font-heading text-xl text-parchment-white mt-1">Brankas Kastil Utama</h4>
                </div>
                <span className="text-3xl" aria-hidden="true">🪙</span>
              </div>

              {/* Vault Balance Display */}
              <div className="mb-8 bg-black/40 border border-ember-gold/10 p-5 rounded-lg text-center">
                <span className="text-xs uppercase tracking-wider text-ember-gold/70">Total Simpanan</span>
                <div className="text-3xl md:text-4xl font-heading text-ember-gold mt-1">
                  128,450 <span className="text-lg md:text-xl text-parchment-white/70">GC</span>
                </div>
                <span className="text-[10px] text-parchment-white/40 block mt-1">Suku bunga aktif: +2.5% per hari</span>
              </div>

              {/* Recent Transactions List */}
              <h5 className="text-xs uppercase tracking-widest text-parchment-white/50 mb-3">Transaksi Terakhir</h5>
              <ul className="flex flex-col gap-3 text-xs" aria-label="Riwayat transaksi">
                <li className="flex justify-between items-center gap-3 border-b border-parchment-white/5 pb-2">
                  <span className="min-w-0 truncate text-parchment-white/70">Penjualan "Damascus Blade +4"</span>
                  <span className="flex-shrink-0 text-green-500 font-bold">+18,500 GC</span>
                </li>
                <li className="flex justify-between items-center gap-3 border-b border-parchment-white/5 pb-2">
                  <span className="min-w-0 truncate text-parchment-white/70">Pajak Kastil Regional</span>
                  <span className="flex-shrink-0 text-red-400 font-bold">-1,200 GC</span>
                </li>
                <li className="flex justify-between items-center gap-3 pb-2">
                  <span className="min-w-0 truncate text-parchment-white/70">Pembelian "Potion of Agility"</span>
                  <span className="flex-shrink-0 text-red-400 font-bold">-3,500 GC</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* CTA to Jobs */}
        {copy.ctaLabel && (
          <div className="flex justify-start" data-reveal>
            <Button
              variant="primary"
              className="text-base py-4 min-w-[200px]"
              onClick={() => scrollToSection("#jobs")}
            >
              {copy.ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
