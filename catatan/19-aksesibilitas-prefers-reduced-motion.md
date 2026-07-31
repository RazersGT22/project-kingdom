# Catatan: Aksesibilitas — prefers-reduced-motion

Lanjutan dari `catatan/18-halaman-404-jalan-berakhir-di-kabut.md`. Poin
"Aksesibilitas" dari Tahap 3 `RENCANA.md`.

## Konteks

User sempat bingung ini maksudnya "kasih tombol on/off" — perlu diluruskan:
ini BUKAN UI baru di website, tapi deteksi OTOMATIS terhadap setting
aksesibilitas yang SUDAH ADA di level OS/browser user ("Kurangi Gerakan" / ing:
"Reduce Motion"). Defaultnya MATI buat hampir semua orang — cuma kepakai buat
user yang emang sengaja mengaktifkannya sendiri (biasanya karena sensitif
motion/vestibular disorder). User lain nggak kena dampak apapun.

## Kenapa butuh 2 cara penanganan berbeda

Ada 2 KATEGORI animasi di project ini, dan masing-masing butuh cara beda buat
dimatikan:

### Kategori 1: Animasi CSS murni (via `@keyframes` + class, atau Tailwind `transition-*`)
Contoh: `animate-grain-shift`, `animate-card-in`, `animate-fade-in`,
`hover:scale-*`, `transition-colors`, dst.

Ini bisa dimatikan SEKALIGUS lewat 1 aturan CSS aja, karena browser sendiri
yang punya media query `prefers-reduced-motion` — nggak butuh JavaScript sama
sekali:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Ini pola umum/best-practice yang sering dipakai (bukan pola yang saya karang
sendiri) — nge-set durasi ke nyaris-nol (`0.01ms`, bukan `0` biar nggak ada
edge-case di browser tertentu yang nganggep durasi 0 = "nggak ada animasi
sama sekali" beda perlakuannya) daripada nge-`display: none` animasinya,
karena target-nya cuma "matiin gerakannya", bukan "sembunyiin elemennya".

### Kategori 2: Animasi berbasis JavaScript (GSAP, atau React state yang diubah lewat mouse event)

Contoh: `useStaggerReveal` (pakai `gsap.fromTo`), `TiltWrapper` (state React
`tilt` diubah tiap `onMouseMove`), `Button` magnetic cursor (state `magnet`
diubah tiap `onMouseMove`).

Ini **TIDAK** kena aturan CSS di atas — karena GSAP dan React inline style
bukan `animation`/`transition` CSS biasa yang dikontrol lewat CSS engine
browser, tapi kode JS yang secara aktif ngubah `style.transform` tiap frame/
tiap event. Aturan CSS `!important` di atas cuma berlaku buat CSS property
yang di-declare dengan `animation`/`transition`, nggak bisa "mencegat" kode JS
yang manggil `element.style.transform = ...` secara langsung.

Makanya butuh utility terpisah:

```ts
// src/utils/prefersReducedMotion.ts
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

Dipanggil manual di titik-titik yang relevan:

1. **`useStaggerReveal.ts`** — sebelum manggil `gsap.fromTo` (animasi geser+scale
   masuk), dicek dulu; kalau `true`, langsung `gsap.set(targets, { opacity: 1,
   y: 0, scale: 1 })` — pindah dari "animasi transisi" ke "langsung set nilai
   akhir", kontennya tetap 100% muncul, cuma tanpa gerakan masuknya
2. **`TiltWrapper.tsx`** — di dalam `handleMouseMove`, ditambah ke kondisi yang
   udah ada (`hasRealMouse`): `if (hasRealMouse && !prefersReducedMotion() &&
   el)`. Kalau true, blok kalkulasi rotasi di-skip sepenuhnya — `tilt` state
   nggak pernah di-set, jadi kartu tetap flat/rata terus
3. **`Button.tsx`** — pola sama persis, ditambah ke kondisi `hasRealMouse`
   yang udah ada di `handleMouseMove`

### `GrainLayer.tsx` — TIDAK perlu diubah sama sekali

Sempat dicek dulu apakah perlu ditambah pengecualian manual juga, tapi
ternyata TIDAK — animasinya (`.animate-grain-shift`, di `global.css`) itu
murni CSS `@keyframes` + `animation` property, jadi udah otomatis ke-cover
sama aturan global Kategori 1 di atas. Nggak ada kode JS yang perlu disentuh.

## Kenapa nggak sekalian bikin tombol manual di UI (sempat ditanya user)

Dibahas dengan user — user sempat mikir ini bakal "mubazir" (mengurangi efek
buat semua orang). Diluruskan: `prefers-reduced-motion` itu OPT-IN dari sisi
user sendiri (mereka yang aktifin duluan di device-nya, bukan kita yang
nawarin), jadi 99%+ pengunjung yang nggak pernah oprek setting itu tetap dapet
semua efek penuh seperti biasa. User akhirnya setuju cukup versi otomatis
(deteksi OS), tanpa perlu nambah toggle manual di website — biar tetep simpel,
nggak nambah state/UI baru yang harus di-maintain.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual

Aktifin dulu setting "Kurangi Gerakan"/"Reduce Motion":
- **Windows**: Settings → Aksesibilitas → Efek Visual → "Animasi di Windows"
  (matikan)
- **Chrome DevTools** (lebih gampang buat testing tanpa ubah setting OS beneran):
  `F12` → `Ctrl+Shift+P` (Command Menu) → ketik "rendering" → pilih "Show
  Rendering" → di panel yang muncul, cari dropdown "Emulate CSS media feature
  prefers-reduced-motion" → pilih "reduce"

Setelah aktif, refresh halaman, cek:
1. Grain berhenti bergetar (background tetap ada teksturnya, tapi diam)
2. Kartu Village/Marketplace/Gallery nggak miring pas di-hover mouse
3. Tombol nggak ketarik ke arah kursor
4. Section langsung muncul semua pas discroll, TANPA animasi geser dari bawah

Matikan lagi settingnya, refresh, pastikan semua animasi balik ke perilaku
normal (grain bergetar lagi, kartu miring lagi, dst).

File yang diubah/ditambah di langkah ini:
`src/utils/prefersReducedMotion.ts` (baru), `src/utils/index.ts`,
`src/styles/global.css`, `src/hooks/useStaggerReveal.ts`,
`src/components/ui/TiltWrapper.tsx`, `src/components/ui/Button.tsx`.
