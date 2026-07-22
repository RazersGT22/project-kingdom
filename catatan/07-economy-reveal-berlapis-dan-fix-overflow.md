# Catatan: Reveal Berlapis di Economy + Fix Overflow

Lanjutan dari `catatan/06-marketplace-reveal-berlapis-dan-fix-overflow.md`.
Langkah ketiga dari 7 di Tahap 1 `RENCANA.md`.

## Apa yang diubah di `Economy.tsx`

Pola reveal sama persis kayak Castle/Village/Marketplace:

1. Import & hook: `useScrollReveal(ref)` → `useStaggerReveal(ref)`
2. Titik `data-reveal` (6 total):
   - Wrapper `SectionHeading`
   - Paragraf body
   - Blok "Sistem Keuangan Kerajaan" (judul + paragraf dijadikan 1 titik reveal,
     bukan dipecah lagi — sama kayak treatment box "Sorotan Ekonomi" di
     Marketplace)
   - 2× item fitur (Official Castle Shop, Player Marketplace) — satu-satu
   - Kartu "Brankas Kastil Utama" (seluruh vault mockup card, 1 blok)
   - Wrapper tombol CTA

## Fix overflow — list "Transaksi Terakhir"

Sebelum, tiap `<li>` di list transaksi:
```tsx
<li className="flex justify-between items-center border-b ... pb-2">
  <span className="text-parchment-white/70">Penjualan "Damascus Blade +4"</span>
  <span className="text-green-500 font-bold">+18,500 GC</span>
</li>
```

Sama kayak kasus Marketplace v7 — `justify-between` tanpa `min-w-0`/`flex-shrink-0`
berisiko nominal GC terdorong keluar kalau deskripsi transaksi panjang (nama item
di game bisa variatif panjangnya).

Sesudah (pola identik dengan fix Marketplace v7, diterapkan ke 3 baris):
```tsx
<li className="flex justify-between items-center gap-3 border-b ... pb-2">
  <span className="min-w-0 truncate text-parchment-white/70">Penjualan "Damascus Blade +4"</span>
  <span className="flex-shrink-0 text-green-500 font-bold">+18,500 GC</span>
</li>
```

- Span deskripsi → `min-w-0 truncate` (dipotong "..." kalau kepanjangan)
- Span nominal → `flex-shrink-0` (warna hijau/merah + tebal harus selalu kelihatan
  utuh, ini bagian paling penting buat dibaca user)
- Tambah `gap-3` di tiap `<li>` biar ada jarak minimum

## Catatan sampingan (BELUM di-fix, di luar scope langkah ini)

Ada teks di paragraf "Sistem Keuangan Kerajaan":
```
Kerajaan menggunakan mata uang tunggal resmi yang disebut **Gold Coins (GC)**.
```
Ini ditulis pakai sintaks markdown (`**teks**`) tapi dirender sebagai teks polos
JSX (bukan lewat markdown renderer), jadi tampil literal dengan tanda bintangnya
di browser, bukan bold. Bukan bagian dari instruksi RENCANA.md untuk langkah ini
jadi tidak disentuh — dicatat di sini kalau user mau minta diperbaiki di langkah
lain.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## Status checklist `RENCANA.md` Tahap 1

- [x] Village
- [x] Marketplace
- [x] Economy — **selesai, menunggu user test di browser sebelum lanjut ke Jobs**
- [ ] Jobs (+ fix overflow "Estimasi Upah / reward")
- [ ] Dungeon, Boss, Gallery — belum

File yang diubah di langkah ini: `src/components/sections/Economy/Economy.tsx`.
