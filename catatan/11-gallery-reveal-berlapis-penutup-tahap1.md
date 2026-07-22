# Catatan: Reveal Berlapis di Gallery (Penutup Tahap 1)

Lanjutan dari `catatan/10-boss-reveal-berlapis.md`. Langkah ketujuh (terakhir)
dari Tahap 1 `RENCANA.md`. Tidak ada fix overflow di langkah ini.

## Kenapa Gallery butuh perlakuan paling hati-hati

Gallery adalah section paling kompleks dari 7 section Tahap 1:
- Filter kategori (`activeCategory` state)
- Pagination (`currentPage` state, reset ke halaman 1 tiap ganti kategori)
- Lightbox modal pas klik foto (`selectedItem` state, dirender via
  `createPortal` ke `document.body`, plus efek matiin scroll body)
- Komponen anak `GalleryComments` (form komentar per foto)

Kombinasi filter + pagination bikin kartu galeri yang tampil (`paginated`)
berubah-ubah komposisinya, dan tiap kartu di-`key={item.id}` — sama persis
pola risikonya kayak Dungeon v10 (list monster/reward yang key-nya berubah per
tab), cuma di sini triggernya 2 macam (filter DAN pagination).

## Kenapa `data-reveal` cuma di 4 titik level blok

1. Judul section
2. Paragraf body
3. Bar filter kategori — **1 blok**. Sebenarnya tombol-tombol kategori
   (`ALL_CATEGORIES.map`) key-nya stabil (nggak berubah based state), jadi
   secara teknis aman dipecah satu-satu. Tapi saya pilih tetap 1 blok biar
   konsisten & lebih sederhana — bar filter cuma kumpulan tombol kecil, nggak
   terlalu berguna kalau direveal satu-satu
4. Grid galeri — **1 blok WAJIB**, bukan pilihan gaya. Kartu di dalamnya
   (`paginated.map`, key = `item.id`) unmount+mount ulang tiap kali:
   - User klik filter kategori beda → `paginated` berubah isi & jumlahnya
   - User klik halaman pagination beda → `paginated` berubah slice-nya
   Kalau `data-reveal` ditaruh di level kartu, GSAP (yang cuma capture sekali di
   mount pertama) nggak akan pernah animate kartu-kartu hasil filter/page baru
5. Navigasi pagination — **1 blok**, cuma render kalau `totalPages > 1`

## Lightbox — SAMA SEKALI TIDAK disentuh

```tsx
{selectedItem && createPortal(
  <div className="fixed inset-0 z-[100] ...">...</div>,
  document.body
)}
```

`createPortal` merender konten ini ke `document.body`, BUKAN sebagai anak DOM
dari `<section ref={ref}>`. Karena `useStaggerReveal` query elemen lewat
`ref.current.querySelectorAll("[data-reveal]")`, dia otomatis nggak akan pernah
menjangkau isi lightbox — mau ditandai `data-reveal` atau nggak, hasilnya sama
saja (nggak akan animate). Jadi lightbox dibiarkan 100% apa adanya, nol
perubahan, biar nggak ada risiko sama sekali di bagian paling interaktif ini.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual (lebih detail dari section lain)

Selain scroll biasa + cek Console, khusus Gallery tolong juga:
1. **Klik ganti filter kategori** (misal dari "Semua" ke kategori lain) —
   pastikan grid foto berubah normal, nggak ada yang aneh
2. **Kalau ada lebih dari 1 halaman**, coba klik pindah halaman — pastikan
   transisi antar halaman foto normal
3. **Klik salah satu foto buat buka lightbox**, pastikan modal muncul dengan
   benar, foto+lore+komentar tampil, lalu **tutup lightbox** (klik ✕ atau klik
   area luar) — pastikan scroll halaman utama balik normal setelah ditutup

## Status checklist `RENCANA.md` — TAHAP 1 SELESAI SEMUA 🎉

- [x] Village, Marketplace, Economy, Jobs, Dungeon, Boss, Gallery — **7 dari 7
      section selesai**

Setelah user konfirmasi Gallery aman (termasuk 3 poin testing tambahan di
atas), Tahap 1 resmi selesai. Langkah berikutnya nunggu arahan user soal Tahap
2 (efek "wow" tambahan) sesuai `RENCANA.md`.

File yang diubah di langkah ini: `src/components/sections/Gallery/Gallery.tsx`.
