import { useRef, useState } from "react";
import { joinServerCopy } from "@/data";
import { useScrollReveal } from "@/hooks";
import { SectionHeading, Card, Button } from "@/components/ui";

const faqList = [
  {
    q: "Apakah server ini berbayar?",
    a: "Tidak, RZ Survival 100% gratis dimainkan untuk semua pemain Java maupun Bedrock. Semua fitur gameplay dasar dapat diakses tanpa biaya.",
  },
  {
    q: "Bagaimana cara bergabung di Minecraft Bedrock (HP/Konsol)?",
    a: "Gunakan alamat IP yang sama: play.rzsurvival.com dengan port default Bedrock: 19132. Server akan otomatis mendeteksi perangkat Anda.",
  },
  {
    q: "Versi Minecraft berapa yang didukung?",
    a: "Kami mendukung klien Minecraft versi 1.20 hingga versi rilis resmi paling terbaru untuk menjamin fitur-fitur blok terbaru dapat dinikmati.",
  },
];

export function JoinServer() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const ipAddress = "play.rzsurvival.com";

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(ipAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section
      id="join-server"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
    >
      {/* Background visual styles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0c0d12] to-obsidian-night pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-ember-gold/5 blur-[120px] pointer-events-none"
      />

      {/* Top Divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <SectionHeading
            eyebrow="Gerbang Masuk"
            title={joinServerCopy.headline}
            className="flex flex-col items-center"
          />
          <p className="max-w-2xl text-base md:text-lg text-parchment-white/70 leading-relaxed mx-auto">
            {joinServerCopy.body}
          </p>
        </div>

        {/* IP and Connection Box */}
        <div className="relative mb-16 max-w-3xl mx-auto">
          {/* Accent glow behind box */}
          <div className="absolute inset-0 bg-ember-gold/10 rounded-2xl blur-lg pointer-events-none" />
          
          <Card className="relative border border-ember-gold/30 bg-[#120f0a]/90 p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                <span className="text-xs uppercase tracking-widest text-green-400 font-bold">Server Online</span>
              </div>
              <h3 className="text-xs uppercase tracking-widest text-parchment-white/40">Alamat IP Server</h3>
              <div className="text-2xl md:text-3xl font-heading text-ember-gold mt-1 tracking-wider">
                {ipAddress}
              </div>
              <p className="text-xs text-parchment-white/50 mt-2">
                Mendukung penuh <span className="text-parchment-white">Minecraft Java</span> & <span className="text-parchment-white">Bedrock Edition (PE)</span>
              </p>
            </div>

            <Button
              onClick={handleCopyIp}
              variant="primary"
              className="w-full md:w-auto text-sm py-4 px-8 min-w-[180px] font-bold"
            >
              {copied ? "IP Tersalin! ✦" : "Salin IP Server"}
            </Button>
          </Card>
        </div>

        {/* Support Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto text-center">
          <a
            href="#discord"
            onClick={(e) => e.preventDefault()}
            className="group block border border-parchment-white/10 bg-obsidian-night/30 hover:border-ember-gold/40 hover:bg-ember-gold/5 p-6 rounded-xl transition-all duration-300"
          >
            <span className="text-3xl block mb-2" aria-hidden="true">💬</span>
            <h4 className="font-heading text-sm text-parchment-white group-hover:text-ember-gold transition-colors">Discord Server</h4>
            <span className="text-[10px] uppercase text-parchment-white/40">Gabung Komunitas</span>
          </a>

          <a
            href="#vote"
            onClick={(e) => e.preventDefault()}
            className="group block border border-parchment-white/10 bg-obsidian-night/30 hover:border-ember-gold/40 hover:bg-ember-gold/5 p-6 rounded-xl transition-all duration-300"
          >
            <span className="text-3xl block mb-2" aria-hidden="true">🗳️</span>
            <h4 className="font-heading text-sm text-parchment-white group-hover:text-ember-gold transition-colors">Vote Server</h4>
            <span className="text-[10px] uppercase text-parchment-white/40">Dapatkan Hadiah Harian</span>
          </a>

          <a
            href="#donate"
            onClick={(e) => e.preventDefault()}
            className="group block border border-parchment-white/10 bg-obsidian-night/30 hover:border-ember-gold/40 hover:bg-ember-gold/5 p-6 rounded-xl transition-all duration-300"
          >
            <span className="text-3xl block mb-2" aria-hidden="true">💎</span>
            <h4 className="font-heading text-sm text-parchment-white group-hover:text-ember-gold transition-colors">Donasi / Toko</h4>
            <span className="text-[10px] uppercase text-parchment-white/40">Dukung Operasional</span>
          </a>
        </div>

        {/* FAQs Short Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="font-heading text-xl text-ember-gold mb-6 text-center">Pertanyaan Umum (FAQ)</h3>
          
          <div className="flex flex-col gap-4">
            {faqList.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="border border-parchment-white/10 bg-obsidian-night/20 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 flex justify-between items-center text-sm font-heading text-parchment-white hover:text-ember-gold transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-ember-gold">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs md:text-sm text-parchment-white/60 leading-relaxed border-t border-parchment-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Big Final CTA */}
        <div className="text-center pt-4">
          <a
            href="#join"
            onClick={handleCopyIp}
            className="inline-block bg-ember-gold text-obsidian-night font-heading text-lg md:text-xl px-12 py-5 rounded-md hover:scale-105 transition-transform duration-300 shadow-2xl"
          >
            {joinServerCopy.ctaLabel} NOW ⚔️
          </a>
          <span className="block text-[10px] text-parchment-white/40 mt-3">
            Klik tombol untuk menyalin IP dan luncurkan game Minecraft Anda
          </span>
        </div>

      </div>
    </section>
  );
}
