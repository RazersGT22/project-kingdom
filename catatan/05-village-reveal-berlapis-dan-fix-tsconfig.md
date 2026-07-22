# Catatan: Reveal Berlapis di Village + Fix Bug tsconfig Lama

Lanjutan dari `catatan/04-reveal-berlapis-staggered.md`. Ini langkah pertama dari
Tahap 1 di `RENCANA.md`: sebar `useStaggerReveal` ke 7 section satu-satu, dimulai
dari **Village**.

## Apa yang diubah di `Village.tsx`

Pola yang dipakai sama persis kayak Castle (v4), cuma disesuaikan sama struktur
elemen Village yang beda (Castle 2-kolom, Village grid 3 kartu):

1. Import & pemanggilan hook: `useScrollReveal(ref)` → `useStaggerReveal(ref)`
2. `data-reveal` ditambahkan di 6 titik (urutan reveal ngikutin urutan DOM):
   - Wrapper `SectionHeading` (judul + eyebrow)
   - Paragraf body copy
   - Tiap 1 dari 3 `<Card>` fitur (bukan div grid pembungkusnya — biar masing-masing
     kartu reveal sendiri-sendiri, bukan bareng sebagai 1 blok)
   - Wrapper tombol CTA

`Card` komponennya sendiri nggak diubah — dia sudah nerima extra props lewat
`...rest` (lihat `src/components/ui/Card.tsx`), jadi `data-reveal` bisa langsung
ditaruh di `<Card data-reveal>` tanpa perlu ubah komponennya.

**Yang TIDAK diubah:** `useParallax` di background tetap jalan seperti sebelumnya,
tidak disentuh sama sekali. Tidak ada fix overflow di langkah ini — Village tidak
masuk daftar "sekalian fix overflow" di `RENCANA.md` (itu baru mulai dari
Marketplace).

## Bug tsconfig lama — sekalian diperbaiki (atas persetujuan user)

Bug ini sudah dicatat sejak `CHANGELOG.md` v3 (20/07/2026), belum sempat diperbaiki:
opsi `baseUrl` di `tsconfig.app.json` dianggap deprecated oleh TypeScript 5.9.3,
bikin `npm run build` gagal di step `tsc -b` (paling awal, sebelum sempat ke `vite
build`). `npm run dev` tidak kena karena dev server nggak lewat `tsc -b`.

**Proses cari solusinya (dicatat karena sempat 2x salah coba):**
1. Percobaan pertama: hapus `baseUrl` sepenuhnya → gagal, muncul error baru
   `TS5090: Non-relative paths are not allowed when 'baseUrl' is not set` — ternyata
   `paths: { "@/*": [...] }` di setup ini (moduleResolution `bundler`) masih butuh
   `baseUrl` supaya alias `@/` bisa di-resolve.
2. Percobaan kedua: pakai saran resmi dari pesan error TS (`ignoreDeprecations:
   "6.0"`) → masih gagal, `TS5103: Invalid value for '--ignoreDeprecations'` — versi
   `"6.0"` belum dikenali TypeScript 5.9.3 yang terpasang di project ini.
3. **Solusi final:** `baseUrl` dikembalikan (tetap ada), ditambah
   `"ignoreDeprecations": "5.0"` (versi yang valid untuk TS 5.9.3) sebagai baris
   terpisah. Build lolos bersih setelahnya.

```jsonc
// tsconfig.app.json — compilerOptions
"ignoreDeprecations": "5.0",
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
}
```

**Catatan buat ke depan:** kalau nanti project upgrade TypeScript ke versi yang jauh
lebih baru dan opsi `ignoreDeprecations: "5.0"` juga mulai dianggap invalid/expired,
cek dulu versi `npx tsc --version` lalu sesuaikan value-nya (bukan langsung dihapus,
karena `baseUrl` masih dipakai aktif oleh `paths`).

## Hasil test di sandbox

- `tsc --noEmit` — bersih, tanpa error
- `npm run build` — sukses, `dist/` ke-generate normal (index.html, css ~43kB,
  js ~570kB gzip ~185kB). Ada warning ukuran chunk >500kB dari Vite, tapi itu cuma
  saran optimasi (code-splitting), bukan error, dan di luar scope langkah ini.

## Status checklist `RENCANA.md` Tahap 1

- [x] Village — **selesai dikerjakan, menunggu user test di browser (full restart
      dev server + scroll penuh halaman + cek DevTools Console) sebelum lanjut ke
      Marketplace**
- [ ] Marketplace (+ fix overflow "Mata Uang Server / Status Pasar")
- [ ] Economy, Jobs, Dungeon, Boss, Gallery — belum

File yang diubah di langkah ini: `src/components/sections/Village/Village.tsx`,
`tsconfig.app.json`.
