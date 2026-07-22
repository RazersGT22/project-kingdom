# Catatan: Reveal Berlapis di Jobs + Fix Overflow

Lanjutan dari `catatan/07-economy-reveal-berlapis-dan-fix-overflow.md`. Langkah
keempat dari 7 di Tahap 1 `RENCANA.md`.

## Apa yang diubah di `Jobs.tsx`

Pola reveal sama persis kayak section-section sebelumnya:

1. Import & hook: `useScrollReveal(ref)` → `useStaggerReveal(ref)`
2. Titik `data-reveal` (6 total):
   - Wrapper `SectionHeading`
   - Paragraf body
   - 4× `<Card>` job (Royal Soldier, Master Miner, Grand Blacksmith, Beast
     Hunter) — satu-satu, bukan grid-nya sekaligus
   - Wrapper tombol CTA

## Fix overflow — baris "Estimasi Upah"

Sebelum:
```tsx
<div className="flex justify-between items-center text-xs">
  <span className="text-parchment-white/40">Estimasi Upah</span>
  <span className="font-heading text-ember-gold">{job.reward}</span>
</div>
```

**Beda arah dibanding fix Marketplace v7 & Economy v8:** di kasus sebelumnya,
yang panjang adalah teks di kiri (label/deskripsi) dan yang pendek+wajib-utuh ada
di kanan (nominal GC). Di Jobs, situasinya kebalik — labelnya ("Estimasi Upah")
pendek dan tetap, sementara **nilai reward** yang variatif panjangnya, contoh:
- `"850 GC + Mineral Langka / Jam"` (pendek)
- `"1,500 GC + Bahan Pembuatan / Jam"` (lebih panjang)

Jadi arah `min-w-0 truncate` dan `flex-shrink-0`-nya ditukar dari pola
sebelumnya:

```tsx
<div className="flex justify-between items-center gap-3 text-xs">
  <span className="flex-shrink-0 text-parchment-white/40">Estimasi Upah</span>
  <span className="min-w-0 truncate font-heading text-ember-gold">{job.reward}</span>
</div>
```

- Label "Estimasi Upah" → `flex-shrink-0` (pendek, harus selalu utuh)
- Nilai reward → `min-w-0 truncate` (bisa panjang, dipotong "..." kalau perlu)
- Tambah `gap-3` biar ada jarak minimum antara label dan nilai

**Catatan buat langkah selanjutnya:** kalau ketemu pola serupa lagi (baris
label+nilai berpotensi overflow), jangan asumsikan arahnya selalu sama — cek dulu
sisi mana yang datanya variatif/berpotensi panjang, baru tentukan mana yang dapat
`truncate` dan mana yang `flex-shrink-0`.

Baris "Progres Kemajuan" (di atas progress bar) tidak disentuh — isinya cuma
label pendek + angka persen, risiko overflow-nya rendah dan tidak disebut di
`RENCANA.md`.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## Status checklist `RENCANA.md` Tahap 1

- [x] Village
- [x] Marketplace
- [x] Economy
- [x] Jobs — **selesai, menunggu user test di browser sebelum lanjut ke Dungeon**
- [ ] Dungeon, Boss, Gallery — belum

File yang diubah di langkah ini: `src/components/sections/Jobs/Jobs.tsx`.
