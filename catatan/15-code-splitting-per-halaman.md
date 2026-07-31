# Catatan: Code-Splitting per Halaman

Lanjutan dari `catatan/14-hover-tilt-3d-dan-fix-konflik-transform.md`. Langkah
kedua dari poin "Performa" di Tahap 3 `RENCANA.md` (langkah pertama: preload
musik utama, `CHANGELOG.md` v24).

## Masalah sebelum

`App.tsx` impor SEMUA komponen section dari SEMUA halaman secara statis di
bagian atas file:

```tsx
import {
  Opening, PathSelect, Castle, Village, Marketplace, Economy, Jobs,
  Dungeon, Boss, Trailer, Gallery, JoinServer, Faq,
} from "@/components/sections";
```

Karena ini import STATIS (bukan lazy/dynamic), Vite/Rollup nge-bundle SEMUANYA
jadi 1 file JS pas build (`index.js`, 578KB / gzip 188KB). File ini didownload
PENUH sama browser begitu halaman apapun dibuka — walau user cuma mau lihat
Beranda doang, kode buat Dungeon, Boss, Gallery, FAQ, dst tetep ikut kedownload
tanpa pernah dipakai.

## Solusi: React.lazy() + Suspense, per halaman

### Kenapa nggak lazy-load per SECTION aja (bukan per halaman)?

Kepikiran juga buat lazy-load tiap section satu-satu (13 section), tapi itu
kebanyakan boundary buat manfaat yang nggak jauh beda — section-section dalam 1
halaman (misal Dungeon+Boss+Trailer di halaman Gameplay) SELALU dibuka
bersamaan (user buka halaman Gameplay, otomatis butuh semua section di
dalamnya). Jadi lebih masuk akal nge-split per HALAMAN (6 titik split), bukan
per section (13 titik split) — kompleksitas lebih rendah, manfaatnya hampir
sama.

### Kenapa section-nya diimpor LANGSUNG dari file-nya, bukan lewat barrel

```ts
// src/components/sections/index.ts
export * from "./Opening";
export * from "./PathSelect";
export * from "./Castle";
// ...dst, SEMUA section
```

Barrel ini nge-export SEMUA section dari 1 file. Kalau file page baru (misal
`PageHome.tsx`) impor dari barrel ini (`import { Opening } from
"@/components/sections"`), ada risiko Rollup nganggep seluruh isi barrel
sebagai 1 kesatuan modul yang saling terhubung — bisa aja bikin section yang
SEHARUSNYA di halaman lain ikut ketarik masuk ke chunk yang salah (tergantung
seberapa bagus tree-shaking-nya jalan). Buat mastiin batas chunk-nya BERSIH
dan nggak ambigu, tiap file page impor section-nya LANGSUNG dari path
lengkapnya:

```tsx
// src/pages/PageHome.tsx
import { Opening } from "@/components/sections/Opening/Opening";
import { PathSelect } from "@/components/sections/PathSelect/PathSelect";
import { Castle } from "@/components/sections/Castle/Castle";
```

### Struktur baru

6 file baru di `src/pages/` (satu per halaman), masing-masing `export default`
komponennya:
- `PageHome.tsx` — Opening, PathSelect, Castle
- `PageWorld.tsx` — Village, Castle
- `PageEconomy.tsx` — Marketplace, Economy, Jobs
- `PageGameplay.tsx` — Dungeon, Boss, Trailer
- `PageGallery.tsx` — Gallery
- `PageFaq.tsx` — JoinServer, Faq

`App.tsx` sekarang:

```tsx
const PageHome = lazy(() => import("@/pages/PageHome"));
const PageWorld = lazy(() => import("@/pages/PageWorld"));
// ...dst

<Suspense fallback={<PageLoadingFallback />}>
  {renderPage()}
</Suspense>
```

`Castle` dipakai di 2 halaman (`PageHome` dan `PageWorld`) — ini nggak bikin
Castle ke-duplikat 2x di 2 chunk berbeda, karena Rollup otomatis ngedeteksi
modul yang dipakai lebih dari 1 dynamic-import point dan bikin **shared chunk**
sendiri buat Castle (kelihatan dari hasil build: `Castle-D4McKJpu.js` berdiri
sendiri, dipakai bareng sama `PageHome` & `PageWorld`).

## Hasil ukuran (hasil `npm run build`)

| File | Ukuran | Gzip |
|---|---|---|
| `index.js` (chunk utama) | 304.57 KB | 105.52 KB |
| `PageWorld.js` | 4.12 KB | 1.88 KB |
| `Castle.js` (shared) | 4.88 KB | 2.01 KB |
| `PageHome.js` | 9.83 KB | 3.43 KB |
| `PageFaq.js` | 14.22 KB | 4.50 KB |
| `PageGameplay.js` | 17.46 KB | 5.16 KB |
| `PageEconomy.js` | 18.39 KB | 4.97 KB |
| `PageGallery.js` | 204.48 KB | 66.68 KB |

Sebelum: `index.js` sendirian 578KB (gzip 188KB), semua orang download semuanya.

Sesudah: orang yang buka Beranda cuma download `index.js` (304KB) + `PageHome.js`
(9.8KB) + beberapa komponen UI kecil (Card, Button, dst, masing-masing <1KB) —
total kira-kira **~314KB**, dibanding 578KB sebelumnya.

### Kenapa `PageGallery.js` masih 204KB (jauh lebih gede dari page lain)?

Diselidiki — bukan bug, ini `GalleryComments.tsx` (fitur komentar per foto) yang
impor `netlify-identity-widget`, library pihak ketiga buat sistem login
komentator. Library ini emang berat (bawa UI widget login sendiri). Sebelumnya,
berat ini kebawa ke SEMUA halaman (nebeng di `index.js` yang 578KB itu).
Sekarang cuma kebawa kalau user beneran buka halaman Galeri — jadi tetap ada
peningkatan buat SEMUA halaman LAIN, cuma Galeri sendiri nggak banyak berubah
ukurannya (memang segitu beratnya, tapi sekarang terisolasi).

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses, output `dist/` dicek manual beneran kepecah jadi
  13 file JS (sebelumnya cuma 1)

## PENTING buat testing manual user

Paling penting dicek: **klik pindah-pindah SEMUA halaman dari navbar**
(Beranda → Wilayah → Ekonomi → Gameplay → Galeri → Bantuan). Yang perlu
dipastikan:
1. Semua halaman tetap muncul normal, nggak ada yang blank/kosong/error
2. Sempat kelihatan teks "Memuat..." sekilas pas pertama kali buka halaman
   tertentu — ini NORMAL (nunjukin chunk-nya lagi didownload), harusnya cuma
   sekejap di koneksi normal. Kalau mau lihat lebih jelas, bisa throttle
   network di DevTools (`F12` → Network → Slow 3G) baru coba pindah halaman
3. Cek Console (`F12`) nggak ada error merah pas pindah-pindah halaman

## Status checklist Tahap 3 poin "Performa"

- [x] Preload musik utama (v24)
- [x] Code-splitting per halaman (v25 — file ini)
- [ ] Lazy-load gambar galeri yang belum kena `loading="lazy"` — masih menyusul

File yang diubah/ditambah di langkah ini:
`src/pages/PageHome.tsx` (baru), `PageWorld.tsx` (baru), `PageEconomy.tsx` (baru),
`PageGameplay.tsx` (baru), `PageGallery.tsx` (baru), `PageFaq.tsx` (baru),
`src/App.tsx` (dirombak).
