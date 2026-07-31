# Rencana Kerja — Project Kingdom (RZ Survival)

> **Ini dokumen RENCANA, bukan catatan histori.** Ditulis SEBELUM eksekusi, biar AI/sesi
> manapun yang lanjutin project ini tau urutan kerjanya tanpa perlu direncanain ulang
> dari nol (buang-buang waktu/prompt).
>
> **Format dokumen ini numpuk ke atas** (sama kayak `CHANGELOG.md`): Tahap terbaru
> selalu ditaruh PALING ATAS, tahap-tahap lama didorong ke bawah. Kalau nanti ada
> Tahap 4, 5, dst — tinggal tambah section baru di ATAS Tahap 3, jangan timpa/hapus
> tahap yang udah ada di bawahnya (biar riwayat rencananya tetap kebaca).

## ⚠️ WAJIB DIINGAT setiap langkah (berlaku untuk SEMUA tahap di bawah)

1. **1 section/fitur per langkah** — jangan gabung banyak perubahan sekaligus dalam 1 batch (pelajaran dari kegagalan v5: 7 section sekaligus bikin halaman rusak & susah dilacak penyebabnya)
2. Update `CHANGELOG.md` tiap langkah selesai (append entry baru di paling atas, **jangan timpa** yang lama)
3. Update/buat file di `catatan/` kalau perubahannya cukup detail (bug ditemukan, keputusan desain, dst)
4. Kasih hasil dalam bentuk **ZIP per section/langkah**, jangan digabung banyak sekaligus
5. `npm run build` + `tsc --noEmit` di sandbox dulu, pastikan lolos, baru kirim zip
6. **Minta user full-restart dev server** (bukan cuma HMR reload) tiap habis test perubahan besar, dan cek DevTools Console (`F12`) kalau ada yang aneh
7. Kalau user konfirmasi aman → baru lanjut ke langkah berikutnya. Kalau bermasalah → **jangan lanjut**, debug dulu sampai beres

---

## Tahap 3 — Penyempurnaan produksi (DRAFT, belum dieksekusi)

Diusulkan setelah Tahap 1 & 2 selesai total. Fokusnya bukan fitur baru yang "keliatan",
tapi kualitas & kesiapan produksi di balik layar. Urutan boleh diubah sesuai request user,
tetap **1 poin per langkah**.

- [x] **Performa** — SELESAI SEMUA: preload musik utama (v24), code-splitting per halaman (v25), lazy-load gambar galeri (dicek — udah bener dari awal, `loading="lazy"` di grid, sengaja tidak di-lazy di lightbox karena langsung tampil)
- [x] **Aksesibilitas** — SELESAI (v30): hormatin `prefers-reduced-motion` di grain, hover tilt, magnetic cursor, reveal berlapis — otomatis mendeteksi setting OS, bukan tombol manual
- [x] **SEO & meta tag** — SELESAI (v28): meta description, Open Graph + Twitter Card (1 versi buat seluruh site, keterbatasan SPA), judul tab browser dinamis per halaman
- [x] **Halaman 404** — SELESAI (v29): "Jalan Ini Berakhir di Kabut", muncul kalau hash URL nggak dikenal, tombol balik ke Beranda
- [ ] **Review konten** — SEBAGIAN selesai (v31): fix bug bold "Gold Coin", samain istilah mata uang, hapus FAQ dobel di halaman Bantuan. SISA: deskripsi 4 arketipe (`archetypes.ts`, ditandai `[ASUMSI]`) masih nunggu keputusan user, belum dikonfirmasi

---

## Tahap 2 — Efek "wow" tambahan (SELESAI SEMUA ✅)

Urutan rekomendasi (dari diskusi sebelumnya, boleh diubah sesuai request user):

- [x] Reveal berlapis dikalibrasi ulang kalau perlu — dikonfirmasi user udah pas (durasi 0.9s, jeda 0.12s, trigger di 75% masuk layar), nggak ada perubahan kode
- [x] Magnetic cursor di tombol — selesai v17, dikonfirmasi user (tombol "ketarik" dikit ke arah kursor)
- [x] Grain/noise texture global — selesai v18 (direvisi v18.1: blend mode & animasi diperbaiki), dikonfirmasi user (overlay film-grain halus)
- [x] Progress indicator scroll — udah ada dari awal (progress bar tipis di atas `PageWrapper.tsx` + titik navigasi `NavDots`), dikonfirmasi cukup oleh user, nggak ada perubahan kode
- [x] Hover tilt di card (Village/Marketplace/Gallery) — selesai v20, dikonfirmasi user

Setiap item di Tahap 2 tetap 1 langkah per waktu, sama disiplinnya kayak Tahap 1.

Di luar checklist ini, sepanjang Tahap 2 juga ada beberapa bug fix & penambahan konten
yang masuk lewat laporan user langsung (tercatat lengkap di `CHANGELOG.md` v13-v23):
fix `NavDots` (urutan titik + active-tracking scroll), pagination Gallery jadi responsif
(10/20/30 sesuai lebar layar) + navigasi di atas grid + auto-scroll pas ganti halaman,
dan penambahan 4 foto baru ke Gallery.

---

## Tahap 1 — Sebar reveal berlapis ke 7 section (SELESAI SEMUA ✅)

### Kondisi awal (baseline)

Setara `CHANGELOG.md` entry **v4** — reveal berlapis (`useStaggerReveal`) + parallax
(`useParallax`) **baru ada di section Castle**. 7 section lain (Village, Marketplace,
Economy, Jobs, Dungeon, Boss, Gallery) masih pakai reveal versi lama (`useScrollReveal`,
1 blok utuh) + parallax yang sudah lebih dulu ada dari v3.

Percobaan sebelumnya (lihat `CHANGELOG.md` entry v5) nyoba sebar 1 fitur besar
(reveal berlapis) ke **7 section sekaligus dalam 1 batch**, bareng fix bug lain di
batch yang sama. Hasilnya: halaman jadi nggak bisa di-scroll & beberapa section
hilang, dan karena terlalu banyak yang berubah bareng, penyebabnya susah dilacak.
Project di-reset ke kondisi sebelum itu (v4). **Prinsip kerja sejak itu: 1 section
per langkah, test dulu, baru lanjut** — makanya ada dokumen RENCANA.md ini.

### Checklist section (urutan yang dijalankan)

- [x] Village — selesai v6
- [x] Marketplace (+ fix overflow "Mata Uang Server / Status Pasar") — selesai v7
- [x] Economy (+ fix overflow "Transaksi Terakhir") — selesai v8
- [x] Jobs (+ fix overflow "Estimasi Upah / reward") — selesai v9
- [x] Dungeon — selesai v10
- [x] Boss — selesai v11
- [x] Gallery — selesai v12 — **PENUTUP TAHAP 1**

**Untuk TIAP section di atas, urutan kerjanya:**
1. Terapkan `useStaggerReveal` + tandai `data-reveal` di elemen-elemen anak (pola sama kayak Castle)
2. Kalau section itu ada di daftar "sekalian fix overflow" — terapkan juga fix `min-w-0 truncate` + `flex-shrink-0` di baris teks yang berpotensi overflow
3. `npm run build` + `tsc --noEmit` di sandbox (pastikan lolos)
4. Kasih zip **HANYA untuk section itu** (jangan digabung beberapa section dalam 1 zip)
5. User test: timpa ke folder kerja, `npm run dev` (restart total), scroll seluruh halaman, pastikan semua section masih muncul normal
6. Kalau ada yang aneh: cek DevTools Console dulu
7. Kalau user konfirmasi aman → update `CHANGELOG.md` + `catatan/`, baru lanjut section berikutnya
8. Kalau bermasalah → jangan lanjut, debug dulu
