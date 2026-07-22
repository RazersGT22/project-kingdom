# Catatan: Fix Urutan & Active-Tracking NavDots + Gallery Reveal Per-Foto

Lanjutan dari `catatan/12-fix-navdots-dan-reveal-pathselect-bantuan.md`. Hasil
testing manual browser yang lebih detail dari user, nemuin 2 lapis bug baru di
NavDots (beda dari bug "nyangkut di halaman pertama" yang sudah difix di v13)
plus permintaan Gallery direvisi.

## Fix 1: Urutan titik ikut daftar tetap, bukan urutan render asli

### Root cause
```ts
// constants/sections.ts — urutan TETAP, didesain buat skema single-page-scroll awal
export const SECTION_IDS = [
  "opening", "path-select", "castle", "village", "marketplace", ...
] as const;
```

NavDots versi v13 masih iterasi `SECTION_IDS` ini secara berurutan buat nyari
section mana yang ada di halaman aktif — otomatis nyusun `castle` sebelum
`village` karena itu urutannya di daftar konstanta. Padahal `PageWorld` di
`App.tsx` me-render:

```tsx
function PageWorld({ activePath }) {
  return (
    <>
      <Village activePath={activePath} />
      <Castle activePath={activePath} />
    </>
  );
}
```

Village duluan, Castle belakangan — KEBALIK dari urutan di `SECTION_IDS`. Titik
navigasi jadinya nampilin urutan yang salah (Castle di atas, harusnya Village).

### Fix
```ts
// SESUDAH
const sectionEls = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
const present = sectionEls.map((el) => el.id).filter((id) => KNOWN_SECTION_IDS.has(id));
```

`querySelectorAll` otomatis ngembaliin elemen dalam **urutan asli DOM** (yang
notabene = urutan render React = urutan visual di layar), jadi apapun urutan
section di halaman manapun, titik navigasinya otomatis ngikutin urutan yang
bener tanpa perlu tau urutan "seharusnya" dari konstanta.

`KNOWN_SECTION_IDS` (Set dari key `SECTION_LABELS`) dipakai buat filter, jaga-jaga
kalau ada elemen `<section id="...">` lain yang bukan section utama (harusnya sih
nggak ada, tapi tetap aman kalau ada penambahan section di masa depan yang belum
dikasih label).

## Fix 2: Titik aktif (highlight emas) nggak update pas scroll

### Root cause (dugaan kuat, sudah diverifikasi lewat perbaikan)
Versi lama pakai `IntersectionObserver` PER elemen section, dengan konfigurasi
`{ threshold: 0.3, rootMargin: "-20% 0px -20% 0px" }`. Setup kayak gini secara
teori valid, tapi kombinasi banyak observer + margin yang saling tumpang tindih
antar section (apalagi section-nya `min-h-screen`, jadi lebih dari satu section
bisa "kepenuhi" syarat 30% visible di waktu yang hampir bersamaan pas scroll
cepat) bikin behavior-nya nggak konsisten — kadang observer callback nggak
kepanggil pas transisi karena race antar section, kadang macet di section yang
udah kelewat dari layar.

### Fix
Ganti total ke pendekatan yang jauh lebih simpel & gampang dipastikan benar:
tiap event `scroll` (native, jadi tetap kepicu meskipun Lenis yang ngatur smooth
scroll-nya — Lenis pada dasarnya masih manggil `window.scrollTo` di belakang
layar, jadi native scroll event tetap jalan normal), hitung ULANG dari nol section
mana yang paling relevan:

```ts
function updateActiveByScroll() {
  const referenceY = window.innerHeight * 0.35; // garis referensi: 35% tinggi layar dari atas
  let closestId = present[0];
  let closestDist = Infinity;

  present.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top <= referenceY) {           // section ini SUDAH terlewati garis referensi
      const dist = referenceY - top;    // seberapa jauh udah kelewat
      if (dist < closestDist) {         // ambil yang PALING BARU terlewati (paling dekat)
        closestDist = dist;
        closestId = id;
      }
    }
  });

  setActiveId(closestId);
}
```

Logikanya: bayangin garis horizontal di 35% tinggi layar dari atas. Section mana
yang batas atasnya udah "lewat" garis itu (dari bawah ke atas) DAN paling deket
sama garis itu — itu section yang lagi paling dominan dilihat user, jadi itu yang
di-highlight. Ini dihitung ULANG di setiap event scroll (bukan cuma sekali di
awal kayak versi lama), jadi selalu akurat dan gampang dites manual (tinggal
scroll pelan-pelan, lihat kapan titiknya pindah).

## Fix 3: Gallery — balik ke per-foto, tapi pakai cara yang beda (bukan data-reveal)

### Kenapa nggak langsung pakai `data-reveal` per kartu

Sudah dijelasin di `catatan/11-gallery-reveal-berlapis-penutup-tahap1.md`: kartu
galeri di-key oleh `item.id`, dan `useStaggerReveal` (GSAP) cuma nge-query
elemen `data-reveal` SEKALI pas section mount. Kalau dipecah per kartu, kartu
hasil ganti filter/halaman nggak akan ke-capture animasinya sama sekali (nggak
akan animate, atau lebih parah kalau ada bug residual style).

### Solusi baru: animasi CSS murni, bukan GSAP

```css
/* global.css */
@keyframes card-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-card-in {
  animation: card-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

```tsx
// Gallery.tsx
{paginated.map((item, index) => (
  <button
    key={item.id}
    className="... animate-card-in"
    style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    ...
  >
```

**Kenapa ini aman dipakai di elemen yang berubah-ubah:** beda fundamental sama
`data-reveal`, animasi CSS `animation` property itu otomatis jalan begitu elemen
ke-attach ke DOM — nggak butuh JS query manual sama sekali. Jadi setiap kali
React mount elemen `<button>` BARU (baik pas load pertama, ganti filter, atau
pindah halaman pagination), CSS animation-nya otomatis "nyala ulang" dari nol
buat elemen itu, TANPA perlu ada kode tambahan yang "re-trigger" secara manual.
Ini prinsip dasar CSS animation vs GSAP-query-sekali yang jadi solusi paling
robust buat kasus grid dinamis kayak gini.

`Math.min(index, 8)` dipakai biar delay-nya nggak keterusan nambah kalau grid-nya
gede — dibatasi maksimal 8×70ms = 560ms delay terlama, biar kartu ke-9 dst nggak
nunggu kelamaan.

`data-reveal` di container grid **dihapus total** (bukan ditumpuk dobel sama
animasi CSS baru) — dan memang nggak perlu scroll-trigger sama sekali di sini,
karena halaman Galeri adalah **halaman berdiri sendiri** (`PageGallery` cuma
render `<Gallery/>`, langsung jadi konten paling atas halaman), beda dari
section-section lain yang emang perlu nunggu di-scroll ke dalam sebuah halaman
panjang.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual user

1. **Halaman Wilayah**: cek urutan titik navigasi — Desa di atas, Kastil di
   bawah (sesuai urutan section beneran muncul di halaman ini)
2. **Halaman Bantuan**: scroll pelan dari atas ke bawah, perhatikan titik yang
   nyala emas — harus beneran pindah dari "Bergabung" ke "Pertanyaan" pas
   scroll melewati section itu
3. **Halaman Galeri**: buka halaman ini, foto-foto harus muncul satu-satu
   berjenjang (bukan langsung semua sekaligus). Coba juga ganti filter kategori
   dan pindah halaman pagination — foto-foto baru di grid juga harus tetap
   muncul dengan animasi yang sama, nggak langsung nongol semua

File yang diubah di langkah ini:
`src/components/ui/NavDots.tsx`,
`src/styles/global.css`,
`src/components/sections/Gallery/Gallery.tsx`.
