# Changelog — Project Kingdom (RZ Survival)

> **ATURAN PENTING — berlaku untuk siapapun/apapun yang mengedit file ini, termasuk AI:**
> - File ini adalah **riwayat pembaruan project**, BUKAN dokumentasi statis yang boleh ditimpa.
> - **JANGAN** menghapus, menimpa, atau mengubah isi entry yang sudah ada di bawah.
> - Setiap ada pembaruan baru pada project, **TAMBAH entry baru di paling atas daftar** (tepat di bawah baris aturan ini, di atas entry sebelumnya), pakai format:
>   `## v[nomor] — [tanggal DD/MM/YYYY] [jam HH.MM] — [judul singkat]`
> - Isi tiap entry: ringkasan poin-poin apa yang ditambah/diubah/diperbaiki, dan (kalau ada) link ke catatan detail di folder `catatan/`.
> - Nomor versi naik terus (v1, v2, v3, ...) — jangan diulang atau di-reset.
> - Sumber tanggal: kalau tidak disebutkan user, pakai tanggal & jam sesi saat itu.

---

## v23 — 22/07/2026 — Gallery: navigasi halaman di atas grid juga + auto-scroll pas ganti halaman

- **Navigasi pagination sekarang muncul 2 kali** — di ATAS grid (baru) dan di BAWAH grid (sudah ada dari awal). Dipecah jadi komponen kecil `PaginationNav` (lokal di file yang sama) biar kode tombolnya nggak ditulis 2 kali
- **Auto-scroll ke atas pas ganti halaman** — sebelumnya kalau klik "Selanjutnya" di navigasi bawah, halaman baru ke-load tapi posisi scroll user tetap di bawah, jadi nggak keliatan foto-foto barunya tanpa scroll manual ke atas dulu. Sekarang tiap ganti halaman (dari kontrol atas maupun bawah), otomatis discroll halus ke bagian atas grid
- **Detail teknis penting:** scroll otomatis ini TIDAK pakai `window.scrollTo`/`scrollIntoView` browser biasa — soalnya project ini pakai Lenis (smooth-scroll library) yang jalanin animasi scroll-nya sendiri lewat RAF (`requestAnimationFrame`) tiap frame. Kalau dipaksa pakai scroll native biasa, animasinya bisa "dilawan balik"/di-override sama loop Lenis di frame berikutnya, jadi scrollnya patah-patah atau gagal. Makanya instance Lenis-nya di-expose ke level modul (`src/hooks/useLenisScroll.ts`) lewat fungsi baru `scrollToWithLenis()`, yang manggil `lenis.scrollTo()` resmi kalau instance-nya lagi aktif (ada fallback ke scroll native kalau belum aktif, buat jaga-jaga)
- File yang diubah: `src/hooks/useLenisScroll.ts` (expose instance + fungsi `scrollToWithLenis`), `src/components/sections/Gallery/Gallery.tsx` (komponen `PaginationNav`, `gridTopRef`, `handlePageChange`)
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** buka Galeri (pastiin ada lebih dari 1 halaman — kalau di layar HP sekarang harusnya udah otomatis 2 halaman berkat 4 foto baru di v22), coba klik navigasi halaman yang di ATAS grid, pastikan halamannya ganti DAN otomatis scroll ke atas grid dengan mulus (bukan patah-patah/loncat kasar). Coba juga dari navigasi bawah, hasilnya harus sama

---

## v22 — 22/07/2026 — Tambah 4 foto baru di Gallery

- User upload 4 foto Minecraft (dengan judul/deskripsi/lore lengkap sudah disiapkan) buat ditambahin ke galeri
- Gambar dipindah ke `public/assets/images/gallery/` dengan penamaan snake_case sesuai konvensi yang udah ada (mis. `bersama_menuju_horizon.jpeg`)
- 4 entry baru ditambahkan ke `galleryItems` (`src/data/galleryCopy.ts`), id 10-13:
  1. **Bersama Menuju Horizon** — kategori *Keindahan Alam* (cocok kategori existing)
  2. **Akhir Sebuah Era** — kategori BARU *Komunitas* (foto rame-rame, tema persahabatan/penutup Season 1 — nggak pas ke kategori Kastil/Dungeon/Pertempuran yang ada)
  3. **Bridge of Triumph** — kategori BARU *Arsitektur* (jembatan menang lomba, beda dari kategori "Kastil" yang spesifik soal benteng)
  4. **Sebuah Pertemuan, Ribuan Kenangan** — kategori *Komunitas* (sama kayak poin 2)
- 2 kategori filter baru (*Komunitas*, *Arsitektur*) otomatis muncul di bar filter — kode filter kategori (`ALL_CATEGORIES`) memang didesain generate otomatis dari isi data, jadi nggak perlu ubah kode apapun buat nambah kategori baru
- Total foto galeri sekarang **13** (dari 9) — otomatis jadi kesempatan bagus buat mastiin pagination responsif (v16) beneran kepakai: di layar HP (target 10/halaman) sekarang bakal kelihatan ke-generate 2 halaman (10 + 3), sebelumnya cuma ada 1 halaman terus karena stok foto belum tembus batas manapun
- File yang diubah: `src/data/galleryCopy.ts`. File baru (gambar): `public/assets/images/gallery/bersama_menuju_horizon.jpeg`, `akhir_sebuah_era.png`, `bridge_of_triumph.png`, `sebuah_pertemuan_ribuan_kenangan.png`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses, dicek juga hasil `dist/` beneran bawa ke-4 gambar baru
- **PENTING buat testing manual:** buka halaman Galeri, cek 4 foto baru muncul dengan judul/desc yang bener, coba klik buka lightbox-nya (pastikan cerita/lore panjang muncul lengkap), coba filter kategori "Komunitas" dan "Arsitektur" (baru), dan **coba persempit browser ke ukuran HP** buat lihat pagination-nya sekarang beneran kebagi 2 halaman

---

## v21 — 22/07/2026 — Kalibrasi reveal berlapis (Tahap 2, poin 1) — dikonfirmasi, tanpa perubahan kode — TAHAP 2 BENERAN SELESAI SEMUA (5/5)

- Poin terakhir yang masih terbuka dari Tahap 2, sengaja dibiarkan `[ ]` sejak awal karena user waktu itu belum tau maunya seperti apa ("cuma mau lihat dulu")
- Setelah dipakai beberapa hari, dikonfirmasi angka yang ada sekarang **udah pas, nggak perlu diubah**: durasi tiap elemen 0.9 detik, jeda antar elemen 0.12 detik, trigger mulai animasi pas section 75% masuk layar (angka ini sama dari awal `useStaggerReveal` dibikin di Castle, v4 — sebelum Tahap 1 dimulai)
- **Tidak ada file yang diubah** di langkah ini — cuma konfirmasi & update checklist, sama kayak poin 4 (progress indicator) di v19
- Checklist Tahap 2 `RENCANA.md`: **5 dari 5 poin selesai semua**, benar-benar tuntas

---

## v20 — 22/07/2026 — Hover tilt 3D di card (Tahap 2, poin 5 — TERAKHIR, Tahap 2 SELESAI)

- Komponen baru `TiltWrapper.tsx` (`src/components/ui/`) — efek kartu "miring" 3D ngikutin posisi kursor mouse
- **Sengaja TIDAK ditaruh di komponen `Card` bersama** (`src/components/ui/Card.tsx`) — kalau ditaruh di situ, section lain yang juga pakai `Card` (misalnya Jobs) bakal ikut kena efek yang nggak diminta. Jadi dibikin komponen wrapper terpisah, dipasang manual cuma di 3 tempat yang diminta RENCANA.md: **Village** (3 kartu fitur), **Marketplace** (3 kartu NPC), **Gallery** (kartu foto)
- **Cuma aktif di device dengan mouse asli** (`pointer: fine`), sama polanya kayak magnetic cursor di Button.tsx (v17) — otomatis nggak aktif di HP/tablet
- **Insiden teknis yang ketauan & diperbaiki SEBELUM dikirim** (bukan pas testing user, ketauan sendiri pas review kode): desain awal `TiltWrapper` cuma 1 div, tapi ternyata itu bakal BENTROK sama animasi reveal (`data-reveal` GSAP di Village/Marketplace, `animate-card-in` CSS di Gallery) — dua-duanya SAMA-SAMA ngatur properti `transform` di elemen yang sama, jadi bakal saling menimpa/rusak. **Fix:** `TiltWrapper` dirombak jadi 2 div bersarang — div LUAR nerima props apa adanya dari pemanggil (`data-reveal`, `className`, dst — transform-nya di-handle animasi reveal seperti biasa), div DALAM (baru) yang megang transform tilt-nya sendiri secara terpisah. Dengan dipisah gini, dua animasi jalan bebas di elemen yang beda tanpa rebutan
- File baru: `src/components/ui/TiltWrapper.tsx`. File yang diubah: `src/components/ui/index.ts` (export), `src/components/sections/Village/Village.tsx`, `src/components/sections/Marketplace/Marketplace.tsx`, `src/components/sections/Gallery/Gallery.tsx` (masing-masing bungkus kartunya dengan `<TiltWrapper>`)
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** ini WAJIB dites pakai MOUSE (nggak akan kelihatan di HP). Coba gerakin kursor di atas kartu di Village/Marketplace/Gallery — kartunya harus miring 3D dikit ngikutin posisi kursor (bukan cuma zoom/scale biasa), dan balik rata pas kursor keluar dari kartu. **Yang PALING PENTING dicek:** pastikan animasi "muncul berlapis" di 3 section ini MASIH JALAN NORMAL (nggak rusak gara-gara TiltWrapper) — soalnya itu potensi konflik yang barusan diperbaiki

## 🎉 TAHAP 2 SELESAI SEMUA (5/5 poin)
1. ✅ Kalibrasi reveal — di-skip, user belum nemu yang perlu diubah
2. ✅ Magnetic cursor di tombol (v17)
3. ✅ Grain/noise texture global (v18, direvisi di v18.1)
4. ✅ Progress indicator scroll — udah ada dari awal, dikonfirmasi (v19)
5. ✅ Hover tilt di card (v20)

---

## v19 — 22/07/2026 — Progress indicator scroll (Tahap 2, poin 4) — dikonfirmasi, tanpa perubahan kode

- Dicek ternyata fitur ini **udah ada dari awal**, sebelum Tahap 2 direncanakan:
  1. Garis progress tipis emas di paling atas layar (`PageWrapper.tsx`) — panjangnya nunjukin persentase scroll di halaman aktif
  2. Titik navigasi kanan (`NavDots`, sudah diperbaiki di v13-v14) — nunjukin posisi section aktif
- User dikonfirmasi dua-duanya udah cukup, nggak perlu tambahan apa-apa
- **Tidak ada file yang diubah** di langkah ini — cuma konfirmasi & update checklist
- Checklist `RENCANA.md` Tahap 2: tersisa 1 poin lagi (poin 5 — hover tilt di card, prioritas rendah)

---

## v18.1 — 22/07/2026 — Revisi GrainLayer: blend mode & animasi diperbaiki

Hasil testing manual browser setelah v18 dikirim — 2 masalah ditemukan & diperbaiki:

### Masalah 1: Grain nyaris invisible di background gelap
- **Penyebab:** `mix-blend-mode: overlay` punya sifat matematis nyaris nggak berefek kalau warna di bawahnya udah sangat gelap/hitam — dan tema web ini emang gelap banget (`obsidian-night`)
- **Fix:** ganti ke `mix-blend-mode: screen` — cocok buat nampilin tekstur terang di atas background gelap apapun

### Masalah 2: Animasi kerasa "jedag-jedug"/kedip kasar, bukan getar halus
- **Penyebab:** animasi awal pakai `transform: translate(persen%)` — persen itu dihitung dari ukuran ELEMENNYA (di sini selebar 1 layar penuh), jadi geseran "cuma" beberapa persen ternyata setara ratusan pixel sekali loncat. Padahal ubin tekstur noise-nya cuma 140px, jadi lompatan segede itu bikin pola berubah drastis tiap step, kelihatan kayak kedipan kasar
- **Fix:** ganti jadi animasi `background-position` dalam pixel kecil (maksimal 8px per step, dibanding ubin 140px) — ini yang bikin efeknya jadi getaran halus, bukan lompatan besar
- Opacity final dikunci di **0.07** (naik dikit dari rencana awal 0.045, karena kombinasi tema gelap + blend mode `screen` butuh sedikit lebih kuat biar kerasa)
- User tetap merasa efeknya cukup subtle/kurang kelihatan jelas di layarnya — diterima apa adanya karena sifatnya memang cuma "polesan" halus, bukan elemen utama yang wajib mencolok
- File yang diubah: `src/components/layers/GrainLayer.tsx`, `src/styles/global.css`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses

---

## v18 — 21/07/2026 — Grain/noise texture global (Tahap 2, poin 3)

- Komponen baru `GrainLayer.tsx` — overlay butiran film (noise) halus di SELURUH layar, termasuk di atas navbar, modal, dan konten apapun, biar kesan visualnya lebih "cinematic", nggak flat digital
- **Teknik:** SVG `feTurbulence` (fractal noise) di-encode jadi data URI, dipakai sebagai `background-image` yang di-tile berulang. Posisi noise-nya digeser "loncat-loncat" (bukan mulus/smooth) tiap ~0.14 detik pakai animasi CSS `steps(8)` — ini yang bikin efeknya kerasa kayak butiran film analog asli, beda dari tekstur statis diam
- **Nggak ganggu apapun:** `pointer-events: none` (nggak ngeblokir klik sama sekali), opacity sangat rendah (0.045) + `mix-blend-mode: overlay` (cuma nambah tekstur halus, bukan bikin layar jadi buram/gelap)
- Ditaruh di posisi paling atas susunan layer (`z-index: 9000`, di bawah `LoadingScreen` yang `z-[9999]`), jadi otomatis nggak nutupin loading screen tapi tetap di atas semua konten & UI lain
- File baru: `src/components/layers/GrainLayer.tsx`. File yang diubah: `src/components/layers/index.ts` (tambah export), `src/App.tsx` (pasang komponennya), `src/styles/global.css` (keyframe `grain-shift`)
- **Insiden kecil pas ngerjain:** sempat salah edit `global.css` — niatnya nambah keyframe baru di ATAS keyframe `fade-in` yang udah ada, tapi baris pembuka `@keyframes fade-in {`-nya kelewat kehapus, ninggalin CSS yang nggak lengkap (`from {...} to {...}` doang tanpa pembuka). Ketauan pas testing lanjutan, langsung diperbaiki sebelum lanjut ke build — dicatat di sini biar transparan
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** efek ini SANGAT halus by design (biar nggak ganggu), jadi mungkin butuh diperhatiin dengan teliti — coba lihat area gelap/polos (misal background section) dari jarak agak dekat ke layar, harusnya ada tekstur butiran halus yang sedikit "bergetar/loncat" (bukan diem)

---

## v17 — 21/07/2026 — Magnetic cursor di tombol (Tahap 2, poin 2)

- Item pertama dari Tahap 2 (RENCANA.md). Poin 1 (kalibrasi ulang reveal) di-skip dulu — user belum ketemu ada yang perlu diubah setelah testing v6-v16
- **Efek "magnetic cursor":** tombol (komponen `Button.tsx`, dipakai di SEMUA CTA lintas section — Village, Marketplace, Economy, Jobs, Dungeon, Boss, PathSelect, JoinServer, dll) sekarang dikit "ketarik" ke arah posisi kursor pas mouse di atasnya, kayak tombol punya gaya tarik magnetis ringan
- **Cara kerja:** `onMouseMove` ngitung jarak kursor dari titik tengah tombol, terus tombolnya digeser (`transform: translate()`) sebagian kecil (25%) ke arah itu. `onMouseLeave` ngembaliin ke posisi normal. Transisi pakai `cubic-bezier` biar terasa halus/kenyal, bukan patah-patah
- **Cuma aktif di perangkat dengan mouse asli** — dicek pakai `window.matchMedia("(pointer: fine)")`. Di HP/tablet (layar sentuh), efek ini otomatis nggak aktif (nggak ada konsep "posisi kursor" di touchscreen), jadi nggak ada resiko perilaku aneh di mobile
- Karena diterapkan di **komponen `Button.tsx` yang dipakai bersama**, efek ini otomatis kepakai ke SEMUA tombol CTA di seluruh project tanpa perlu ubah tiap section satu-satu
- Diprogram supaya aman kalau ada consumer yang kirim prop `style`/`onMouseMove`/`onMouseLeave` sendiri ke `<Button>` — semua digabung, bukan saling menimpa
- File yang diubah: `src/components/ui/Button.tsx` (satu file doang, karena sifatnya shared component)
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** ini paling kerasa dites pakai MOUSE (bukan HP) — coba gerakin kursor pelan-pelan di atas tombol mana aja (misal tombol "Lanjutkan Perjalanan" di Beranda, atau tombol CTA di section manapun), tombolnya harus dikit ketarik ngikutin arah kursor, terus balik normal pas kursor keluar

---

## v16 — 21/07/2026 — Gallery: jumlah foto per halaman jadi responsif (10/20/30)

- Sebelumnya `ITEMS_PER_PAGE` tetap 9 (grid 3×3) di semua ukuran layar
- Sekarang dinamis, target konsisten **10 baris** per halaman, jumlah foto menyesuaikan lebar layar (mengikuti breakpoint grid yang sudah ada: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`):
  - Mobile (1 kolom, < 640px) → **10 foto/halaman**
  - Tablet (2 kolom, 640–1023px) → **20 foto/halaman**
  - Desktop (3 kolom, ≥ 1024px) → **30 foto/halaman**
- Ikut update otomatis kalau user resize jendela browser lewat breakpoint (event `resize`), dan otomatis balik ke halaman 1 biar nggak nyangkut di halaman yang jadi kosong akibat perubahan jumlah item per halaman
- File yang diubah: `src/components/sections/Gallery/Gallery.tsx`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** karena data foto saat ini cuma 10 item, di layar desktop (target 30/halaman) otomatis cuma akan ada 1 halaman (nggak kelihatan bedanya sampai foto ditambah lebih dari 30). Paling gampang dites di **layar HP/sempit** (resize browser jadi sempit, atau buka lewat DevTools mobile view) — coba geser lebar jendela dari sempit ke lebar, jumlah foto per halaman & total halaman harus ikut berubah

---

## v15 — 21/07/2026 — Perlambat jeda animasi kartu Gallery

- User konfirmasi 2 fix NavDots di v14 (urutan titik + active-tracking scroll) sudah cocok/bagus
- Tapi jeda animasi "muncul satu-satu" di grid Gallery kecepetan
- Jeda antar kartu (`animationDelay`) dinaikkan dari **70ms → 150ms** per kartu (durasi animasi tiap kartu tetap 0.6 detik, tidak diubah)
- File yang diubah: `src/components/sections/Gallery/Gallery.tsx` (cuma 1 baris angka)
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses

---

## v14 — 21/07/2026 — Fix NavDots (urutan titik + active-tracking scroll) + Gallery reveal per-foto

Lanjutan dari v13, hasil testing manual browser lebih detail dari user.

### Fix 1: Urutan titik NavDots ikutin urutan tetap di kode, bukan urutan asli di halaman
- **Gejala:** di halaman Wilayah, urutan render section-nya Village dulu baru Castle, tapi titik navigasinya nampilin Castle di atas dan Village di bawah — kebalik
- **Akar masalah:** kode lama nyusun titik dengan iterasi `SECTION_IDS` (daftar tetap di `constants/sections.ts`, urutannya castle-sebelum-village karena itu urutan section di skema single-page-scroll awal project), bukan berdasarkan urutan section BENERAN muncul di halaman yang lagi aktif
- **Fix:** ganti cara deteksi section dari "iterasi daftar tetap" jadi `document.querySelectorAll("section[id]")` — otomatis ngikutin urutan asli DOM/render halaman yang aktif, apapun urutannya

### Fix 2: Titik aktif (yang nyala emas) nggak update pas scroll
- **Gejala:** di halaman Bantuan (2 section: Bergabung + Pertanyaan), titik yang nyala nggak ikut pindah pas discroll dari section Bergabung ke Pertanyaan
- **Fix:** ganti mekanisme deteksi "section aktif" dari `IntersectionObserver` (per-elemen, threshold+rootMargin yang rumit buat didebug) ke pendekatan yang lebih simpel & deterministik: tiap event `scroll`, hitung section mana yang batas atasnya paling dekat dari garis referensi ~35% tinggi layar (dan sudah terlewati) — itu yang jadi aktif
- File yang diubah: `src/components/ui/NavDots.tsx` (rombak total logic effect-nya, `SECTION_IDS` import dihapus karena nggak dipakai lagi)

### Fix 3: Gallery — foto sekarang muncul satu-satu
- Di v12 grid galeri sengaja dibuat 1 blok reveal (bukan per-foto) karena risiko GSAP `data-reveal` rusak kalau dipakai di elemen yang berubah-ubah (filter/pagination). User minta tetap muncul satu-satu, jadi dicari pendekatan lain yang aman
- **Solusi:** animasi CSS murni (`@keyframes card-in`, class `.animate-card-in`) di `src/styles/global.css` — beda dari `data-reveal` (GSAP `querySelectorAll` sekali di awal mount), animasi CSS ini otomatis "nyala ulang" tiap kali React memasang elemen BARU ke DOM (baik mount pertama kali maupun hasil ganti filter/halaman pagination), karena dipicu oleh CSS `animation` yang jalan otomatis begitu elemennya ada di DOM — bukan di-trigger manual lewat query sekali di awal
- Tiap kartu foto dikasih `animate-card-in` + `animationDelay` inline berjenjang per index (`Math.min(index, 8) * 70ms`, dibatasi maksimal 8 biar halaman dengan banyak foto per halaman nggak nunggu kelamaan)
- `data-reveal` di container grid **dihapus** (bukan didobel dengan animasi CSS) — nggak perlu nunggu scroll-trigger juga karena halaman Galeri berdiri sendiri (bukan section di tengah scroll panjang), langsung keliatan begitu halaman dibuka
- File yang diubah: `src/styles/global.css` (keyframe baru), `src/components/sections/Gallery/Gallery.tsx`

Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses.

**PENTING buat testing manual:**
1. Halaman Wilayah — cek urutan titik: Desa di atas, Kastil di bawah (sesuai urutan render)
2. Halaman Bantuan — scroll dari atas ke bawah, cek titik aktif (nyala emas) beneran pindah dari Bergabung ke Pertanyaan
3. Halaman Galeri — foto-foto muncul satu-satu berjenjang, coba juga ganti filter kategori & pindah halaman pagination, pastikan foto baru tetap muncul dengan animasi (bukan langsung nongol semua)

---

## v13 — 21/07/2026 — Fix bug NavDots (titik navigasi nyangkut) + reveal berlapis PathSelect & halaman Bantuan

Ini BUKAN bagian dari checklist 7 section Tahap 1 (yang sudah selesai di v12) — ini
laporan bug baru dari user setelah testing manual di browser.

### Bug 1: NavDots (titik navigasi kanan) nyangkut di halaman pertama
- **Gejala:** pas pindah halaman (Beranda → Wilayah/Ekonomi/Gameplay/Galeri/Bantuan), titik navigasi di kanan layar TIDAK ikut berubah — tetap nunjukin 3 titik punya halaman Beranda (Beranda/Pilih Jalur/Kastil), padahal harusnya beda-beda tiap halaman (misal Wilayah cuma 2: Desa+Kastil)
- **Akar masalah:** komponen `NavDots` punya instance `useHashRouter()` SENDIRI, terpisah dari instance yang dipakai `AppShell` buat nentuin halaman mana yang di-render. Dua instance ini secara teori sama-sama dengar event `hashchange`, tapi berpotensi nggak sinkron sempurna karena keduanya state React yang independen
- **Fix:** `NavDots` diubah jadi terima `currentRoute` sebagai **prop** dari `AppShell` (satu sumber kebenaran yang sama persis dipakai buat nge-render halaman), bukan bikin instance routing sendiri lagi
- File yang diubah: `src/components/ui/NavDots.tsx` (terima prop `currentRoute: AppRoute`), `src/App.tsx` (kirim `<NavDots currentRoute={currentRoute} />`)

### Bug 2: Section PathSelect (Beranda) belum reveal berlapis
- Section ini di luar 7 section Tahap 1 (sudah ada sebelum Tahap 1 dimulai, kelewat belum diupdate)
- `useScrollReveal` → `useStaggerReveal`; `data-reveal` di: judul+paragraf, 4 kartu archetype (Penakluk/Pedagang/Pengrajin/Penjelajah — dibungkus `<div data-reveal>` karena `PathCard` belum forward extra props), tombol CTA
- File: `src/components/sections/PathSelect/PathSelect.tsx`

### Bug 3: Halaman Bantuan (JoinServer + Faq) muncul langsung semua, nggak berlapis
- **JoinServer:** `useScrollReveal` → `useStaggerReveal`; `data-reveal` di: judul+body (1 blok), kartu IP server (1 blok), 3 tombol support Discord/Vote/Donasi (satu-satu), mini-FAQ (1 blok — accordion buka-tutup), CTA besar
- **Faq:** sebelumnya SAMA SEKALI belum ada reveal hook (nggak ada `ref` pun). Ditambah `useStaggerReveal` dari nol; `data-reveal` di: hero+search bar (1 blok), bar filter kategori (1 blok), daftar accordion FAQ (1 blok — karena daftarnya berubah-ubah kalau difilter/dicari, sama alasannya kayak Gallery v12), box "Masih Butuh Bantuan" (1 blok)
- File: `src/components/sections/JoinServer/JoinServer.tsx`, `src/components/sections/Faq/Faq.tsx`

### Catatan
- Section **Trailer** (halaman Gameplay) masih pakai `useScrollReveal` lama — TIDAK disentuh di langkah ini karena user tidak melaporkan ini sebagai bug. Dicatat sebagai potensi kerjaan lanjutan kalau diminta
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** selain cek reveal berlapis di Beranda & Bantuan, WAJIB cek juga navigasi titik kanan di SEMUA halaman (Beranda, Wilayah, Ekonomi, Gameplay, Galeri, Bantuan) — pastikan jumlah & label titik sesuai section yang ada di masing-masing halaman

---

## v12 — 21/07/2026 — Reveal berlapis di section Gallery (Tahap 1, langkah 7/7 — SELESAI SEMUA)

- Section **Gallery** sekarang pakai `useStaggerReveal` (sebelumnya `useScrollReveal`)
- Tidak ada fix overflow di langkah ini — Gallery tidak ada di daftar "sekalian fix overflow" pada `RENCANA.md`
- Gallery adalah section **paling kompleks** dari 7 section Tahap 1: ada filter kategori, pagination, dan lightbox modal (pakai `createPortal`)
- `data-reveal` ditambahkan HANYA di level blok (4 titik), sengaja TIDAK dipecah ke item individual:
  1. Judul section
  2. Paragraf body
  3. Bar filter kategori — **1 blok**, bukan per tombol kategori
  4. Grid galeri — **1 blok** mencakup semua kartu foto, bukan per kartu
  5. Navigasi pagination — **1 blok** (kalau totalPages > 1)
- **Alasan di-blok (bukan dipecah per item), sama logikanya kayak Dungeon v10:** kartu galeri di-`key` berdasarkan `item.id`, dan `item.id` yang tampil berubah tiap kali user ganti filter kategori atau pindah halaman pagination. Kalau dipecah `data-reveal` per kartu, GSAP (yang cuma nge-capture elemen `data-reveal` sekali di awal mount) nggak akan nge-animate kartu-kartu baru hasil ganti filter/halaman — berisiko ada elemen yang "nyangkut" di opacity aneh
- **Lightbox modal (popup detail foto) SAMA SEKALI TIDAK disentuh** — dirender lewat `createPortal(..., document.body)`, jadi berada di luar DOM tree section `ref` ini. `useStaggerReveal` query `querySelectorAll` dari `ref.current`, jadi otomatis nggak akan pernah menjangkau isi lightbox meskipun ditandai `data-reveal` — makanya lightbox dibiarkan apa adanya, tidak ada perubahan sama sekali
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- File yang diubah: `src/components/sections/Gallery/Gallery.tsx`
- Checklist `RENCANA.md` Tahap 1: **Gallery selesai — SEMUA 7 SECTION TAHAP 1 SELESAI.** Tunggu konfirmasi user aman (termasuk **test filter kategori, pindah halaman, dan buka/tutup lightbox**) sebelum mulai Tahap 2

---

## v11 — 21/07/2026 — Reveal berlapis di section Boss (Tahap 1, langkah 6/7)

- Section **Boss** sekarang pakai `useStaggerReveal` (sebelumnya `useScrollReveal`)
- Tidak ada fix overflow di langkah ini — Boss tidak ada di daftar "sekalian fix overflow" pada `RENCANA.md`
- `data-reveal` ditambahkan ke: judul section, paragraf body, kartu lore boss "Ignis the Dreadnought" (1 blok utuh), label "Jaminan Drop Item Legendaris" + 3 item drop (satu-satu: Dreadnought Greatsword, Heart of Ignis, Dragonscale Aegis), tombol CTA — total 7 titik reveal
- Section ini statis (tidak ada tab/state interaktif kayak Dungeon), jadi tidak ada risiko unmount/remount saat interaksi — granularitas `data-reveal` bisa langsung ke level item tanpa perlu treatment khusus
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- File yang diubah: `src/components/sections/Boss/Boss.tsx`
- Checklist `RENCANA.md` Tahap 1: **Boss selesai**, tunggu konfirmasi user aman sebelum lanjut ke Gallery (langkah terakhir Tahap 1)

---

## v10 — 21/07/2026 — Reveal berlapis di section Dungeon (Tahap 1, langkah 5/7)

- Section **Dungeon** sekarang pakai `useStaggerReveal` (sebelumnya `useScrollReveal`)
- Tidak ada fix overflow di langkah ini — Dungeon tidak ada di daftar "sekalian fix overflow" pada `RENCANA.md`
- `data-reveal` ditambahkan ke: judul section, paragraf body, label "Pilih Wilayah", 3 tombol tab wilayah (satu-satu), panel detail kanan (**1 blok utuh**, tidak dipecah lebih detail) — total 7 titik reveal
- **Keputusan desain penting:** panel detail kanan (nama dungeon, deskripsi, list monster, list reward, box "Mode Ekspedisi Aktif") sengaja ditandai sebagai **1 blok `data-reveal`** di level container terluar, BUKAN dipecah ke tiap item monster/reward. Alasannya: isi panel ini dinamis mengikuti tab yang dipilih user (state `selectedId`), dan list monster/reward pakai `key` berdasarkan nama item — kalau user ganti tab, React unmount+mount ulang elemen-elemen list itu (karena key berubah set-nya per dungeon). `useStaggerReveal` hanya nge-capture elemen `data-reveal` yang ada saat komponen pertama kali mount (lewat `querySelectorAll`), jadi kalau ditandai di level item, elemen baru hasil ganti tab nggak akan ke-capture animasinya. Dengan ditandai di level container terluar (yang TIDAK di-unmount saat ganti tab, cuma konten/class di dalamnya yang berubah), animasi reveal tetap konsisten dan interaksi ganti tab tetap mulus tanpa efek aneh
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- File yang diubah: `src/components/sections/Dungeon/Dungeon.tsx`
- Checklist `RENCANA.md` Tahap 1: **Dungeon selesai**, tunggu konfirmasi user aman di browser (termasuk **coba klik ganti tab** untuk pastikan interaksi masih normal) sebelum lanjut ke Boss

---

## v9 — 21/07/2026 — Reveal berlapis di section Jobs (Tahap 1, langkah 4/7) + fix overflow

- Section **Jobs** sekarang pakai `useStaggerReveal` (sebelumnya `useScrollReveal`), pola sama kayak section sebelumnya
- `data-reveal` ditambahkan ke: judul section, paragraf body, 4 kartu job (Royal Soldier, Master Miner, Grand Blacksmith, Beast Hunter — satu-satu), tombol CTA — total 6 titik reveal bergantian
- **Fix overflow** baris "Estimasi Upah" di tiap kartu job — kebalikan dari pola Marketplace/Economy: di sini yang berpotensi panjang adalah **nilai reward**-nya (mis. "1,500 GC + Bahan Pembuatan / Jam"), bukan labelnya. Label "Estimasi Upah" dikasih `flex-shrink-0`, nilai reward dikasih `min-w-0 truncate`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- File yang diubah: `src/components/sections/Jobs/Jobs.tsx`
- Checklist `RENCANA.md` Tahap 1: **Jobs selesai**, tunggu konfirmasi user aman di browser sebelum lanjut ke Dungeon

---

## v8 — 21/07/2026 — Reveal berlapis di section Economy (Tahap 1, langkah 3/7) + fix overflow

- Section **Economy** sekarang pakai `useStaggerReveal` (sebelumnya `useScrollReveal`), pola sama kayak Castle/Village/Marketplace
- `data-reveal` ditambahkan ke: judul section, paragraf body, blok "Sistem Keuangan Kerajaan", 2 item fitur (satu-satu), kartu "Brankas Kastil Utama" (1 blok, sama kayak pola "Sorotan Ekonomi" di Marketplace v7), tombol CTA — total 6 titik reveal bergantian
- **Fix overflow** 3 baris list "Transaksi Terakhir": span deskripsi transaksi dikasih `min-w-0 truncate`, span nominal GC (hijau/merah) dikasih `flex-shrink-0` — pola sama seperti fix Marketplace v7
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- File yang diubah: `src/components/sections/Economy/Economy.tsx`
- Checklist `RENCANA.md` Tahap 1: **Economy selesai**, tunggu konfirmasi user aman di browser sebelum lanjut ke Jobs
- Catatan sampingan (belum di-fix, di luar scope langkah ini): teks `**Gold Coins (GC)**` di paragraf "Sistem Keuangan Kerajaan" ditulis pakai format markdown tapi tidak dirender bold di JSX biasa — masih tampil literal tanda bintangnya

---

## v7 — 21/07/2026 — Reveal berlapis di section Marketplace (Tahap 1, langkah 2/7) + fix overflow

- Section **Marketplace** sekarang pakai `useStaggerReveal` (sebelumnya `useScrollReveal`), pola sama kayak Castle & Village
- `data-reveal` ditambahkan ke: judul section, paragraf body, label "Pedagang Terkenal Kerajaan" + 3 kartu NPC (satu-satu), label "Fitur Perdagangan" + 2 item fitur (satu-satu), box "Sorotan Ekonomi", tombol CTA — total 11 elemen reveal bergantian
- **Fix overflow** baris `Mata Uang Server: Gold Coins (GC)` / `Status Pasar: Stabil` di box Sorotan Ekonomi: span kiri (teks lebih panjang) dikasih `min-w-0 truncate`, span kanan (teks pendek, wajib utuh) dikasih `flex-shrink-0` — sesuai pola yang diminta di `RENCANA.md`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- File yang diubah: `src/components/sections/Marketplace/Marketplace.tsx`
- Checklist `RENCANA.md` Tahap 1: **Marketplace selesai**, tunggu konfirmasi user aman di browser sebelum lanjut ke Economy

---

## v6 — 21/07/2026 — Reveal berlapis di section Village (Tahap 1, langkah 1/7) + fix bug tsconfig lama

- Section **Village** sekarang pakai `useStaggerReveal` (sebelumnya `useScrollReveal`), mengikuti pola persis yang sudah dipakai di Castle (v4)
- `data-reveal` ditambahkan ke: judul section, paragraf body, 3 kartu fitur (masing-masing satu-satu, bukan container-nya sekaligus), tombol CTA — total 6 elemen yang reveal bergantian
- Tidak ada fix overflow di langkah ini (Village tidak ada di daftar "sekalian fix overflow" pada `RENCANA.md`)
- **Sekalian diperbaiki**: bug lama `tsconfig.app.json` opsi `baseUrl` deprecated (dicatat sejak v3, bikin `npm run build` gagal) — ditambah `"ignoreDeprecations": "5.0"` (sesuai versi TypeScript 5.9.3 yang terpasang), `baseUrl` tetap dipertahankan karena ternyata masih wajib untuk `paths` non-relative bekerja di setup ini
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses (dist ke-generate normal)
- File yang diubah: `src/components/sections/Village/Village.tsx`, `tsconfig.app.json`
- Checklist `RENCANA.md` Tahap 1: **Village selesai**, tunggu konfirmasi user aman di browser sebelum lanjut ke Marketplace

---

## v5 — 20/07/2026 — Percobaan reveal berlapis + fix overflow ke 7 section — DIBATALKAN

Sempat dicoba: reveal berlapis (`useStaggerReveal`) disebar dari Castle ke 7 section
lain (Village, Marketplace, Economy, Jobs, Dungeon, Boss, Gallery) sekaligus dalam
1 batch, bareng fix bug overflow horizontal di Economy/Marketplace/Jobs.

**Hasilnya: halaman jadi tidak bisa di-scroll, dan beberapa section (Server Economy,
Guild Pekerjaan/Jobs, kemungkinan lainnya) jadi tidak muncul kontennya.** Penyebab
pastinya belum ketemu (bukan salah struktur kode yang kelihatan — sudah dicek ESLint,
build, type-check, semua bersih). Karena terlalu banyak yang berubah sekaligus,
sulit dilacak penyebabnya, jadi project **direset ke kondisi v4** (reveal berlapis
cuma di Castle, section lain masih versi lama).

**Rencana lanjutan (pendekatan lebih hati-hati, bertahap per section, bukan borongan)
ada di `RENCANA.md` di root project.**

---

## v4 — 20/07/2026 21.00 — Reveal berlapis (staggered) — baru di section Castle (percobaan)

- Hook baru `useStaggerReveal.ts` — elemen dengan atribut `data-reveal` muncul bergantian (bukan 1 blok utuh sekaligus), stagger 0.12 detik per elemen, urutan sesuai posisi di DOM
- Diterapkan **baru di section Castle** sebagai contoh/percobaan: judul → gambar → paragraf → 3 fitur satu-satu → tombol CTA (7 elemen total)
- Section lain (Village, Marketplace, Economy, Jobs, Dungeon, Boss, Gallery) **masih pakai reveal blok tunggal** (`useScrollReveal`) — belum disebar, nunggu konfirmasi user dulu
- Detail lengkap: `catatan/04-reveal-berlapis-staggered.md`

---

## v3 — 20/07/2026 20.00 — Visual polish: font Cinzel, reveal dramatis, parallax 8 section

- Font heading diganti dari `Georgia` (placeholder) → **Cinzel** (heraldik)
- Reveal-on-scroll di-upgrade dari fade+geser simpel jadi lebih dramatis (scale-up + rise + fade)
- Parallax background ditambahkan ke 8 section: Castle, Village, Marketplace, Economy, Jobs, Dungeon, Boss, Gallery — dengan variasi warna glow sesuai tema tiap section
- Fix integrasi Lenis + GSAP ScrollTrigger yang sebelumnya kelewatan (`lenis.on("scroll", ScrollTrigger.update)`) — penting untuk semua animasi berbasis `scrub`
- Ditemukan bug `tsconfig.app.json` (opsi `baseUrl` deprecated di TypeScript 5.9+, bikin `npm run build` gagal) — **belum diperbaiki**, masih pending, `npm run dev` tidak terpengaruh
- Detail lengkap & histori keputusan: `catatan/03-visual-polish-font-reveal-parallax.md`

## v2 — 19/07/2026 — Fitur komentar bertingkat di Galeri

- Setiap foto di Gallery dikasih kolom komentar bertingkat (nested replies), login wajib pakai akun Google
- Setup: Netlify Identity + Google provider, Netlify Database (Postgres, otomatis dibuat Netlify), migration SQL resmi di `netlify/database/migrations/`
- Netlify Function (`comments.ts`) verifikasi token login di server sebelum simpan komentar
- Pagination galeri (9 foto/halaman), panel "Kelola Blokir" khusus admin, notifikasi email tiap komentar baru (via Resend)
- Fix: lightbox pakai `createPortal` biar nggak "terkunci" di dalam wrapper Lenis
- Detail lengkap: `catatan/01-fitur-komentar-dan-setup.md`, `catatan/02-lanjutan-pagination-blokir-email.md`

## v1 — 18/07/2026 — Skeleton project awal

- Setup awal React + Vite + TypeScript + Tailwind, GSAP (ScrollTrigger) + Lenis
- 12 section one-page-scroll: Opening, Path Select, Castle, Village, Marketplace, Economy, Jobs, Dungeon, Boss, Gallery, Trailer, Join Server
- Sistem archetype/path selection yang mengubah konten section sesuai pilihan user
- Referensi: `Project Bible (01)`, `Tech Bible (05)`, `Project Implementation Guide (03)`, `Sprint 4 Walkthrough.md`
