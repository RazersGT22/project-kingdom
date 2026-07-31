# Catatan: Review Konten — Fix Bold, Istilah GC, FAQ Dobel

Lanjutan dari `catatan/19-aksesibilitas-prefers-reduced-motion.md`. Poin
"Review konten" dari Tahap 3 `RENCANA.md` — SEBAGIAN dikerjakan, ada 1 hal
yang ditunda atas keputusan user sendiri.

## Metode review

Dibaca semua file `src/data/*.ts` (isi copy tiap section) satu-satu, plus
grep manual buat nyari inkonsistensi istilah (`"Gold Coin"`) lintas file
`.tsx` komponen section. Bukan cuma baca sekilas — dicek juga komentar kode
yang ninggalin jejak keputusan yang belum final (`[ASUMSI]`, dst).

## Temuan 1 (PALING PENTING, DITUNDA): `archetypes.ts` ditandai `[ASUMSI]`

```ts
// Implementation Guide Bagian 5. Nama & deskripsi masih [ASUMSI] — lihat
// Project Bible Bab 5 (🔍 open question, belum dikonfirmasi pemilik server).
export const archetypes: Archetype[] = [ ... ];
```

Komentar ini nunjukin deskripsi 4 arketipe (Penakluk/Pedagang/Pengrajin/
Penjelajah) ditulis oleh sesi/AI SEBELUMNYA sebagai tebakan sementara, dan
secara eksplisit minta dikonfirmasi ke pemilik server (user). Ini ditampilin
ke user buat direview, tapi jawabannya: **"jangan di-finish-in dulu, masih
lama nanti"** — artinya user belum siap mutusin, bukan berarti udah oke.

**Keputusan:** komentar `[ASUMSI]` di kode SENGAJA DIBIARKAN apa adanya
(tidak dihapus, tidak diubah jadi "dikonfirmasi"), supaya sesi berikutnya
(siapapun yang lanjutin project ini) tetap tau bahwa bagian ini masih
menunggu keputusan, bukan udah final.

## Temuan 2: Bug markdown bold di Economy — akhirnya di-fix

Sudah dicatat sejak `catatan/07-economy-reveal-berlapis-dan-fix-overflow.md`
(v8) sebagai "di luar scope langkah itu", nggak pernah di-follow-up sampai
review konten ini:

```tsx
// SEBELUM
Kerajaan menggunakan mata uang tunggal resmi yang disebut **Gold Coins (GC)**.

// SESUDAH
Kerajaan menggunakan mata uang tunggal resmi yang disebut{" "}
<strong className="text-parchment-white font-semibold">Gold Coin (GC)</strong>.
```

## Temuan 3: Istilah "Gold Coin(s)" nggak konsisten — disamain

Ditemukan lewat `grep -rn "Gold Coin"` di seluruh `src/`:

| Lokasi | Istilah sebelumnya |
|---|---|
| `Marketplace.tsx` | "Gold Coins (GC)" (pakai s) |
| `Economy.tsx` | "Gold Coins (GC)" (pakai s, plus bug bold di atas) |
| `Faq.tsx` | "Gold Coin (GC)" (TANPA s) — 2 tempat |

Dipilih **"Gold Coin (GC)"** (singular, tanpa s) sebagai istilah resmi,
soalnya FAQ udah lebih dulu "mendefinisikan" istilah ini secara eksplisit
lewat pertanyaan "Apa itu Gold Coin (GC) dan bagaimana cara mendapatkannya?"
— jadi Marketplace & Economy disamain ngikutin FAQ, bukan sebaliknya.

**Yang SENGAJA TIDAK disamain:** file data flavor text (`economyCopy.ts`,
`dungeonCopy.ts`, dll) yang pakai istilah Indonesia natural kayak "koin emas"
atau "Emas" tanpa nyebut singkatan GC. Ini teks naratif/cerita, bukan
referensi teknis UI — nggak masalah pakai bahasa Indonesia yang luwes di
konteks kayak gitu, beda sama label UI yang emang harus konsisten persis.

## Temuan 4: Mini-FAQ dobel di halaman Bantuan — dihapus

`JoinServer.tsx` (bagian atas halaman Bantuan) punya accordion FAQ sendiri:

```ts
const faqList = [
  { q: "Apakah server ini berbayar?", ... },
  { q: "Bagaimana cara bergabung di Minecraft Bedrock (HP/Konsol)?", ... },
  { q: "Versi Minecraft berapa yang didukung?", ... },
];
```

3 pertanyaan ini **PERSIS** topiknya sama kayak yang udah ada lebih lengkap di
`Faq.tsx` (`FAQ_DATA`), yang notabene section-nya ada TEPAT DI BAWAH JoinServer
di halaman yang sama (`PageFaq.tsx` render `<JoinServer/>` lalu `<Faq/>`).
Bahkan ada perbedaan detail antara 2 jawaban buat "pertanyaan sama": mini-FAQ
bilang port Bedrock `19132` doang, FAQ lengkap nambahin fallback port `25565`
kalau gagal — user bisa baca 2 jawaban berbeda buat pertanyaan yang identik,
berpotensi bingung mana yang lebih akurat.

**Solusi:** accordion 3 pertanyaan dihapus total, diganti 1 kalimat pendek +
tombol yang scroll ke section Faq di bawahnya:

```tsx
<div className="max-w-3xl mx-auto mb-16 text-center" data-reveal>
  <p className="text-sm text-parchment-white/60 mb-4">
    Punya pertanyaan lain seputar server? Cek arsip pengetahuan lengkap kami di bawah.
  </p>
  <button onClick={() => scrollToSection("#faq")} className="...">
    Lihat Semua Pertanyaan (FAQ) ↓
  </button>
</div>
```

Kode yang jadi nggak kepake dibersihin: `faqList` const, `openFaqIndex` state,
`toggleFaq` function — semua dihapus dari `JoinServer.tsx`.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual

1. Buka halaman Ekonomi, cek paragraf "Sistem Keuangan Kerajaan" — kata
   "Gold Coin (GC)" harus BENERAN bold (tebal), bukan ada tanda bintang
2. Cek istilah "Gold Coin (GC)" konsisten di Marketplace & Economy (nggak ada
   yang pakai "Coins" lagi)
3. Buka halaman Bantuan — accordion 3 pertanyaan yang dulu ada di atas
   (sebelum FAQ lengkap) harusnya udah GANTI jadi 1 kalimat + tombol "Lihat
   Semua Pertanyaan (FAQ)". Coba klik tombolnya, pastikan scroll ke FAQ
   lengkap di bawahnya

## Status checklist Tahap 3 poin "Review Konten"

SEBAGIAN selesai — 3 dari 4 temuan sudah di-fix. Sisa 1: deskripsi arketipe,
ditunda atas permintaan user sendiri, akan di-follow-up di sesi
lain/berikutnya kalau user sudah siap memutuskan.

File yang diubah: `src/components/sections/Economy/Economy.tsx`,
`src/components/sections/Marketplace/Marketplace.tsx`,
`src/components/sections/JoinServer/JoinServer.tsx`.
