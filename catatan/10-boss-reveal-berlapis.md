# Catatan: Reveal Berlapis di Boss

Lanjutan dari `catatan/09-dungeon-reveal-berlapis.md`. Langkah keenam dari 7 di
Tahap 1 `RENCANA.md`. Tidak ada fix overflow di langkah ini (Boss tidak masuk
daftar).

## Apa yang diubah di `Boss.tsx`

Section ini **statis** — tidak ada `useState`/tab interaktif kayak Dungeon,
jadi tidak ada risiko unmount/remount elemen akibat perubahan state. Granularitas
`data-reveal` bisa langsung ke level item tanpa perlu treatment "1 blok" khusus.

1. Import & hook: `useScrollReveal(ref)` → `useStaggerReveal(ref)`
2. Titik `data-reveal` (7 total):
   - Wrapper `SectionHeading`
   - Paragraf body
   - Kartu lore boss "Ignis the Dreadnought" (1 blok utuh — mirip treatment
     "Sorotan Ekonomi"/vault card di section sebelumnya, isinya cuma 1 kartu
     deskriptif, kurang berguna kalau dipecah lebih detail lagi)
   - Label "Jaminan Drop Item Legendaris"
   - 3× item drop (Dreadnought Greatsword, Heart of Ignis, Dragonscale Aegis) —
     satu-satu, key = `item.name` yang STATIS (array `dropItems` tidak berubah
     berdasar state apapun, jadi aman)
   - Wrapper tombol CTA

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## Status checklist `RENCANA.md` Tahap 1

- [x] Village, Marketplace, Economy, Jobs, Dungeon
- [x] Boss — **selesai, menunggu user test di browser sebelum lanjut ke Gallery**
- [ ] Gallery — belum (langkah terakhir Tahap 1)

File yang diubah di langkah ini: `src/components/sections/Boss/Boss.tsx`.
