# Catatan: Reveal Berlapis di Marketplace + Fix Overflow

Lanjutan dari `catatan/05-village-reveal-berlapis-dan-fix-tsconfig.md`. Langkah
kedua dari 7 di Tahap 1 `RENCANA.md`.

## Apa yang diubah di `Marketplace.tsx`

Pola reveal sama persis kayak Castle & Village, cuma section ini punya lebih
banyak sub-bagian (2 grid + 1 box highlight), jadi granularitas `data-reveal`-nya
lebih banyak titik:

1. Import & hook: `useScrollReveal(ref)` → `useStaggerReveal(ref)`
2. Titik `data-reveal` (11 total, urut sesuai DOM):
   - Wrapper `SectionHeading`
   - Paragraf body
   - Label "Pedagang Terkenal Kerajaan" (beda dari Castle/Village — section ini
     punya sub-heading di tengah, jadi ikut ditandai biar reveal-nya nyambung)
   - 3× `<Card>` NPC merchant (satu-satu, bukan grid-nya sekaligus)
   - Label "Fitur Perdagangan"
   - 2× item fitur (satu-satu)
   - Box "Sorotan Ekonomi" (di-treat sebagai 1 blok, bukan dipecah lagi — isinya
     cuma 1 paragraf + 1 baris data, kurang berguna kalau dipecah lebih detail)
   - Wrapper tombol CTA

## Fix overflow — baris "Mata Uang Server / Status Pasar"

Sebelum:
```tsx
<div className="flex items-center justify-between border-t ... pt-4 text-sm ...">
  <span>Mata Uang Server: Gold Coins (GC)</span>
  <span>Status Pasar: Stabil</span>
</div>
```

Masalahnya: `justify-between` tanpa aturan shrink/wrap bikin 2 span itu bisa saling
dorong kalau container menyempit (misal di layar kecil atau kalau teksnya nanti
diganti jadi lebih panjang) — berpotensi bikin elemen keluar dari box-nya.

Sesudah — ikut pola yang diminta persis di `RENCANA.md` (`min-w-0 truncate` +
`flex-shrink-0`):
```tsx
<div className="flex items-center justify-between gap-4 border-t ... pt-4 text-sm ...">
  <span className="min-w-0 truncate">Mata Uang Server: Gold Coins (GC)</span>
  <span className="flex-shrink-0">Status Pasar: Stabil</span>
</div>
```

Logikanya:
- Span kiri ("Mata Uang Server...") teksnya lebih panjang dan lebih mungkin
  berubah-ubah (nama mata uang bisa beda per server) → dikasih `min-w-0 truncate`
  supaya kalau kepanjangan, dia dipotong dengan "..." dan tidak mendorong layout
- Span kanan ("Status Pasar...") teksnya pendek dan statusnya penting buat selalu
  kelihatan utuh → dikasih `flex-shrink-0` supaya tidak pernah ikut menyusut/kepotong
- Ditambah `gap-4` di parent supaya ada jarak minimum antara 2 span walau salah
  satu truncate

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses, `dist/` ke-generate normal

## Status checklist `RENCANA.md` Tahap 1

- [x] Village
- [x] Marketplace — **selesai, menunggu user test di browser sebelum lanjut ke
      Economy**
- [ ] Economy (+ fix overflow "Transaksi Terakhir")
- [ ] Jobs (+ fix overflow "Estimasi Upah / reward")
- [ ] Dungeon, Boss, Gallery — belum

File yang diubah di langkah ini: `src/components/sections/Marketplace/Marketplace.tsx`.
