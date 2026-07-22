import { useRef, useState, useMemo } from "react";
import { SectionHeading } from "@/components/ui";
import { useStaggerReveal } from "@/hooks";

const FAQ_CATEGORIES = ["Semua", "Koneksi & Teknis", "Aturan & Gameplay", "Klan & Donasi"] as const;
type FaqCategory = (typeof FAQ_CATEGORIES)[number];

interface FaqItem {
  q: string;
  a: string;
  cat: Exclude<FaqCategory, "Semua">;
}

const FAQ_DATA: FaqItem[] = [
  // Koneksi & Teknis
  {
    q: "Bagaimana cara bergabung ke server RZ Survival?",
    a: "Buka Minecraft (Java atau Bedrock), pilih Multiplayer, lalu tambahkan server dengan alamat IP: play.rzsurvival.com. Server mendukung versi 1.20 ke atas.",
    cat: "Koneksi & Teknis",
  },
  {
    q: "Port berapa yang digunakan untuk Minecraft Bedrock (HP/Konsol)?",
    a: "Gunakan port default Bedrock: 19132. Jika tidak berhasil terhubung, coba port 25565 yang merupakan port Java standar.",
    cat: "Koneksi & Teknis",
  },
  {
    q: "Versi Minecraft apa saja yang didukung?",
    a: "Server mendukung klien Minecraft versi 1.20 hingga versi rilis resmi terbaru untuk Java Edition, dan versi setara untuk Bedrock Edition.",
    cat: "Koneksi & Teknis",
  },
  {
    q: "Saya tidak bisa connect, apa yang harus saya lakukan?",
    a: "Pastikan koneksi internet stabil, periksa kembali ejaan IP (play.rzsurvival.com), dan pastikan firewall atau antivirus tidak memblokir Minecraft. Jika masalah berlanjut, hubungi admin di Discord.",
    cat: "Koneksi & Teknis",
  },
  // Aturan & Gameplay
  {
    q: "Apakah server ini berbayar untuk dimainkan?",
    a: "Tidak. RZ Survival 100% gratis untuk semua pemain. Semua fitur gameplay inti dapat diakses tanpa biaya sama sekali.",
    cat: "Aturan & Gameplay",
  },
  {
    q: "Apakah diizinkan menggunakan mod atau cheat?",
    a: "Dilarang keras menggunakan cheat, hack client, atau exploit. Mod kosmetik seperti Optifine atau Sodium diizinkan. Pelanggaran akan berujung pada banned permanen.",
    cat: "Aturan & Gameplay",
  },
  {
    q: "Bagaimana cara memilih jalur profesi/archetype?",
    a: "Setelah pertama kali masuk server, Anda akan diarahkan ke ruang pemilihan jalur. Pilih salah satu dari empat jalur: Penakluk, Pedagang, Pengrajin, atau Penjelajah. Pilihan ini dapat diubah setelah mencapai level tertentu.",
    cat: "Aturan & Gameplay",
  },
  {
    q: "Apakah ada sistem PvP (Player vs Player)?",
    a: "PvP hanya aktif di zona-zona tertentu seperti Arena Gladiator dan Medan Perang Klan. Di luar zona tersebut, pemain aman dari serangan pemain lain.",
    cat: "Aturan & Gameplay",
  },
  {
    q: "Bagaimana cara membentuk atau bergabung dengan klan?",
    a: "Ketik /clan create [nama] untuk membentuk klan baru, atau /clan join [nama] untuk melamar bergabung ke klan yang sudah ada. Klan membutuhkan minimal 2 anggota untuk aktif.",
    cat: "Aturan & Gameplay",
  },
  // Klan & Donasi
  {
    q: "Apa keuntungan melakukan donasi ke server?",
    a: "Donatur mendapatkan rank khusus, akses ke fitur kosmetik eksklusif (elytra skin, particle trail), serta bonus GC (Gold Coin) awal. Donasi sama sekali tidak memberikan keunggulan P2W (Pay to Win).",
    cat: "Klan & Donasi",
  },
  {
    q: "Bagaimana cara melakukan donasi?",
    a: "Kunjungi halaman toko kami di store.rzsurvival.com atau ketik /store di dalam game untuk melihat semua paket donasi yang tersedia beserta metode pembayaran.",
    cat: "Klan & Donasi",
  },
  {
    q: "Apa itu Gold Coin (GC) dan bagaimana cara mendapatkannya?",
    a: "Gold Coin (GC) adalah mata uang utama server yang didapatkan dari menyelesaikan quest, berdagang di pasar, membunuh boss, dan memenangkan turnamen klan. GC digunakan untuk membeli properti, peralatan, dan layanan premium dari NPC.",
    cat: "Klan & Donasi",
  },
];

export function Faq() {
  const ref = useRef<HTMLElement>(null);
  useStaggerReveal(ref);
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCat = activeCategory === "Semua" || item.cat === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#0c0c12] to-obsidian-night pointer-events-none"
      />
      <div aria-hidden="true" className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent" />

      {/* Hero banner */}
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div data-reveal>
          <SectionHeading
            eyebrow="Pusat Bantuan"
            title="Arsip Pengetahuan Kerajaan"
            className="mb-4 flex flex-col items-center text-center"
          />
          <p className="text-center text-parchment-white/60 text-base mb-12 max-w-xl mx-auto">
            Temukan jawaban atas pertanyaan umum seputar koneksi, aturan bermain, sistem klan, dan donasi di sini.
          </p>

          {/* Search bar */}
          <div className="relative mb-8 max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-ember-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Cari pertanyaan, misal: 'cara join', 'PvP', 'klan'…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenIndex(null); }}
              className="w-full bg-[#14131a]/80 border border-parchment-white/10 focus:border-ember-gold/50 focus:outline-none rounded-xl pl-11 pr-5 py-3.5 text-sm text-parchment-white placeholder:text-parchment-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" data-reveal>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-heading transition-all duration-300 border ${
                activeCategory === cat
                  ? "border-ember-gold bg-ember-gold/10 text-ember-gold"
                  : "border-parchment-white/10 bg-obsidian-night/40 text-parchment-white/60 hover:border-ember-gold/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="flex flex-col gap-3" data-reveal>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 text-parchment-white/40">
              <span className="text-4xl block mb-4">📜</span>
              <p className="text-sm">Tidak ada pertanyaan yang cocok. Coba kata kunci lain.</p>
            </div>
          ) : (
            filteredFaqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.q}
                  className="border border-parchment-white/10 bg-obsidian-night/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-ember-gold/20"
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full text-left p-5 flex justify-between items-start gap-4 text-sm font-heading text-parchment-white hover:text-ember-gold transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1">{item.q}</span>
                    <span
                      className={`text-ember-gold transition-transform duration-300 flex-shrink-0 mt-0.5 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="px-5 pb-5 pt-0 text-sm text-parchment-white/60 leading-relaxed border-t border-parchment-white/5">
                      <p className="pt-3">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Still need help? */}
        <div className="mt-14 border border-ember-gold/20 bg-ember-gold/5 rounded-2xl p-6 md:p-8 text-center" data-reveal>
          <h3 className="font-heading text-lg text-ember-gold mb-2">Masih Butuh Bantuan?</h3>
          <p className="text-sm text-parchment-white/60 mb-6">
            Bergabunglah ke Discord kami dan ajukan pertanyaan langsung kepada tim admin RZ Survival.
          </p>
          <a
            href="#discord"
            onClick={(e) => e.preventDefault()}
            className="inline-block bg-ember-gold text-obsidian-night font-heading text-sm px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            💬 Gabung Discord Server
          </a>
        </div>
      </div>
    </section>
  );
}
