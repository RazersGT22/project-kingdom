# Rencana Kerja — Lanjutan dari Baseline v4 ke v10 Berikutnya

> **Ini dokumen RENCANA, bukan catatan histori.** Ditulis SEBELUM eksekusi, biar AI/sesi
> manapun yang lanjutin project ini tau urutan kerjanya tanpa perlu direncanain ulang
> dari nol (buang-buang waktu/prompt). Update checklist di bawah tiap 1 langkah selesai.

## Kenapa dokumen ini dibuat

Percobaan sebelumnya (lihat `CHANGELOG.md` entry v5) nyoba sebar 1 fitur besar
(reveal berlapis) ke **7 section sekaligus dalam 1 batch**, bareng fix bug lain di
batch yang sama. Hasilnya: halaman jadi nggak bisa di-scroll & beberapa section
hilang, dan karena terlalu banyak yang berubah bareng, penyebabnya susah dilacak.
Project di-reset ke kondisi sebelum itu (v4).

**Prinsip kerja mulai sekarang: 1 section per langkah, test dulu, baru lanjut.**

## Kondisi awal (baseline)

Setara `CHANGELOG.md` entry **v4** — reveal berlapis (`useStaggerReveal`) + parallax
(`useParallax`) **baru ada di section Castle**. 7 section lain (Village, Marketplace,
Economy, Jobs, Dungeon, Boss, Gallery) masih pakai reveal versi lama (`useScrollReveal`,
1 blok utuh) + parallax yang sudah lebih dulu ada dari v3.

## Rencana kerja (urutan wajib diikuti)

### Tahap 1 — Sebar reveal berlapis, 1 section per langkah

Urutan section (bebas diubah kalau user maunya beda, tapi tetap **1 per langkah**):

- [x] Village (selesai dikerjakan — v6, menunggu user konfirmasi aman sebelum lanjut Marketplace)
- [x] Marketplace (+ sekalian fix overflow "Mata Uang Server / Status Pasar") — selesai v7, menunggu konfirmasi user aman sebelum lanjut Economy
- [x] Economy (+ sekalian fix overflow "Transaksi Terakhir") — selesai v8, menunggu konfirmasi user aman sebelum lanjut Jobs
- [x] Jobs (+ sekalian fix overflow "Estimasi Upah / reward") — selesai v9, menunggu konfirmasi user aman sebelum lanjut Dungeon
- [x] Dungeon — selesai v10, menunggu konfirmasi user aman (termasuk test klik ganti tab) sebelum lanjut Boss
- [x] Boss — selesai v11, menunggu konfirmasi user aman sebelum lanjut Gallery
- [x] Gallery — selesai v12, menunggu konfirmasi user aman (termasuk test filter/pagination/lightbox) — **INI LANGKAH TERAKHIR TAHAP 1**

**Untuk TIAP section di atas, urutan kerjanya:**
1. Terapkan `useStaggerReveal` + tandai `data-reveal` di elemen-elemen anak (pola sama kayak Castle)
2. Kalau section itu ada di daftar "sekalian fix overflow" — terapkan juga fix `min-w-0 truncate` + `flex-shrink-0` di baris teks yang berpotensi overflow
3. `npm run build` + `tsc --noEmit` di sandbox (pastikan lolos)
4. Kasih zip **HANYA untuk section itu** (jangan digabung beberapa section dalam 1 zip)
5. **User test dulu:** timpa ke folder kerja, `npm run dev` (restart total, bukan cuma save-reload), buka browser tab baru, scroll seluruh halaman dari atas sampai bawah — pastikan scroll normal & semua section (termasuk yang sudah diubah sebelumnya) masih muncul
6. **Kalau ada yang aneh:** cek DevTools Console (`F12` → Console) dulu buat cari pesan error, baru lapor
7. Kalau user konfirmasi aman → update `CHANGELOG.md` (entry baru) + kalau perlu catatan detail di `catatan/`, baru lanjut section berikutnya
8. Kalau bermasalah → **jangan lanjut ke section berikutnya**, debug section itu dulu sampai beres

### Tahap 2 — Efek "wow" tambahan (setelah Tahap 1 selesai semua & stabil)

Urutan rekomendasi (dari diskusi sebelumnya, boleh diubah sesuai request user):

- [x] Reveal berlapis dikalibrasi ulang kalau perlu — dikonfirmasi user udah pas (durasi 0.9s, jeda 0.12s, trigger di 75% masuk layar), nggak ada perubahan kode
- [x] Magnetic cursor di tombol — selesai v17, menunggu konfirmasi user (tombol "ketarik" dikit ke arah kursor)
- [x] Grain/noise texture global — selesai v18, menunggu konfirmasi user (overlay film-grain halus)
- [x] Progress indicator scroll — udah ada dari awal (progress bar tipis di atas `PageWrapper.tsx` + titik navigasi `NavDots`), dikonfirmasi cukup oleh user, nggak ada perubahan kode (garis/dot di pinggir layar nunjukin posisi scroll)
- [x] Hover tilt di card (Village/Marketplace/Gallery) — selesai v20, menunggu konfirmasi user — **TAHAP 2 SELESAI SEMUA**

Setiap item di Tahap 2 juga tetap 1 langkah per waktu, sama disiplinnya kayak Tahap 1.

## Yang WAJIB diingat tiap langkah (dari `README.md`)

1. Update `CHANGELOG.md` (append, jangan timpa yang lama)
2. Update/buat file di `catatan/` kalau perubahannya cukup detail
3. Kasih hasil dalam bentuk **ZIP per section/langkah**, jangan digabung banyak sekaligus
4. **Baru:** minta user full-restart dev server (bukan cuma HMR reload) tiap habis test perubahan besar, dan cek DevTools Console kalau ada yang aneh — ini pelajaran dari kegagalan v5 kemarin
