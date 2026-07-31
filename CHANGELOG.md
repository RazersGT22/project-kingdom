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

## v32 — 25/07/2026 — Lebar konten dilebarin (buat monitor lebar) + Gallery tambah tingkat 4 & 5 kolom

Request langsung dari user (di luar Tahap 3), yang pakai monitor 27" 1920×1080 — ngerasa website kebanyakan spasi kosong kiri-kanan.

### Lebar konten
- Hampir semua section (10 file: Boss, Castle, Dungeon, Economy, Gallery, Jobs, Marketplace, PathSelect, Trailer, Village) pakai wrapper lebar maksimal yang SAMA PERSIS: `max-w-6xl` (1152px)
- Dinaikkan jadi `max-w-[1400px]` (+~22% lebih lebar) di kesepuluh file itu, plus `Footer.tsx` (2 tempat) biar konten footer tetap sejajar sama section di atasnya
- **Sengaja TIDAK diubah:** section Faq, JoinServer, Opening — ini pakai wrapper yang emang didesain lebih sempit (max-w-4xl/5xl) buat konten yang berpusat di tengah (hero text, list FAQ), bukan grid lebar — lebih sempit itu pilihan desain yang disengaja, bukan "kelupaan"
- Navbar nggak disentuh — sudah full-width dari awal (`left-0 right-0`), nggak pakai constraint max-width

### Gallery — tingkat kolom baru
- Sebelumnya cuma 3 tingkat: mobile (1 kolom/10 foto), tablet (2 kolom/20 foto), desktop (3 kolom/30 foto)
- Ditambah 2 tingkat baru: **xl breakpoint (≥1280px) → 4 kolom, 40 foto/halaman** dan **2xl breakpoint (≥1536px) → 5 kolom, 50 foto/halaman**
- Monitor 27" 1920×1080 milik user masuk kategori **2xl (≥1536px)** → otomatis dapet **5 kolom, 50 foto/halaman**
- File yang diubah: `getColumnsForWidth()` (tambah 2 kondisi breakpoint baru) dan className grid (`xl:grid-cols-4 2xl:grid-cols-5` ditambah) — dua-duanya WAJIB tetap sinkron manual (satu ngatur breakpoint logic buat itungan jumlah foto, satu ngatur breakpoint CSS beneran buat tampilan grid)
- File yang diubah: `src/components/sections/Gallery/Gallery.tsx`, `src/components/sections/{Boss,Castle,Dungeon,Economy,Jobs,Marketplace,PathSelect,Trailer,Village}/*.tsx`, `src/components/layout/Footer.tsx`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** buka di monitor lebar (1920px+), cek konten section keliatan lebih lebar (nggak sekempit sebelumnya), dan cek Gallery — harusnya sekarang 5 foto per baris, 50 foto per halaman (dengan 13 foto yang ada sekarang cuma 1 halaman doang, belum kelihatan bedanya sampai foto ditambah lebih dari 50)

---

## v31 — 25/07/2026 — Review konten: fix bug bold, samain istilah Gold Coin, hapus FAQ dobel (Tahap 3, poin Review Konten — sebagian)

Hasil baca ulang semua file teks/copy di seluruh project. Ditemukan 4 masalah,
3 di antaranya di-fix di langkah ini (yang ke-4, deskripsi arketipe, **masih
ditunda** — user belum siap konfirmasi, ditandain `[ASUMSI]` tetap dibiarkan
di kode sampai user siap)

### Fix 1: Bug markdown bold di Economy (dicatat sejak v8, akhirnya di-fix)
- **Sebelum:** `**Gold Coins (GC)**` — ditulis pakai sintaks markdown tapi dirender sebagai teks JSX polos, jadi tanda bintangnya muncul literal di layar, bukan bold
- **Sesudah:** diganti `<strong className="text-parchment-white font-semibold">Gold Coin (GC)</strong>` — beneran bold di HTML

### Fix 2: Istilah mata uang disamain jadi "Gold Coin (GC)" (singular)
- Sebelumnya ada 2 variasi tertulis: "Gold Coins (GC)" (Marketplace, Economy — pakai "Coins") vs "Gold Coin (GC)" (FAQ — pakai "Coin" tanpa s)
- Disamain semua jadi **"Gold Coin (GC)"** (singular) — dipilih karena FAQ udah lebih dulu "mendefinisikan" istilah resmi ini ("Apa itu Gold Coin (GC) dan bagaimana cara mendapatkannya?")
- File yang diubah: `Economy.tsx`, `Marketplace.tsx`

### Fix 3: Mini-FAQ dobel di halaman Bantuan dihapus
- Section `JoinServer` (halaman Bantuan) punya accordion 3 pertanyaan sendiri ("Apakah berbayar?", "cara join Bedrock?", "versi Minecraft?") — PERSIS topik yang sama kayak yang udah dibahas lebih lengkap di section `Faq` yang ada TEPAT DI BAWAHNYA (masih halaman yang sama!). Bahkan detailnya beda (mini-FAQ nggak nyebut port fallback 25565 yang ada di FAQ lengkap) — berpotensi bikin bingung kalau user baca 2 jawaban beda buat pertanyaan yang sama
- Diganti jadi 1 kalimat pendek + tombol "Lihat Semua Pertanyaan (FAQ) ↓" yang scroll ke section Faq di bawahnya (`scrollToSection("#faq")`)
- Kode yang udah nggak kepake dibersihin: `faqList` const, `openFaqIndex` state, `toggleFaq` function
- File yang diubah: `JoinServer.tsx`

### Yang BELUM di-fix (ditunda, nunggu keputusan user)
- **Deskripsi 4 arketipe** (`archetypes.ts`) — ditandai `[ASUMSI]` sejak awal project (belum dikonfirmasi pemilik server), user diminta review tapi jawab "belum siap, masih lama" — dibiarkan apa adanya, komentar `[ASUMSI]` di kode TETAP ada sebagai pengingat buat sesi berikutnya
- Istilah "koin emas"/"Emas" di beberapa file data flavor text (`economyCopy.ts`, `dungeonCopy.ts`) TIDAK diseragamkan ke "Gold Coin (GC)" — ini flavor text naratif berbahasa Indonesia, bukan referensi UI teknis, jadi dibiarkan pakai istilah bahasa Indonesia yang natural

Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses.

**PENTING buat testing manual:** cek section Economy (paragraf "Sistem Keuangan Kerajaan" harus bold beneran di kata "Gold Coin (GC)"), cek Marketplace (istilah GC konsisten), dan cek halaman Bantuan — mini-FAQ sebelumnya harusnya udah ilang, gantiin sama tombol "Lihat Semua Pertanyaan (FAQ)" yang kalau diklik scroll ke bawah ke FAQ lengkap.

---

## v30 — 24/07/2026 — Aksesibilitas: hormatin "Kurangi Gerakan" / prefers-reduced-motion (Tahap 3, poin Aksesibilitas)

- Beberapa efek gerak yang ditambah di Tahap 2 (grain, hover tilt, magnetic cursor, reveal berlapis) sebelumnya SAMA SEKALI nggak peduli sama setting aksesibilitas OS/browser user ("Kurangi Gerakan" / `prefers-reduced-motion`) — semua user dapet animasi penuh, termasuk yang emang sensitif/gampang pusing liat animasi dan udah sengaja aktifin setting itu di perangkatnya
- **Bukan tombol manual di website** — ini otomatis mendeteksi setting yang SUDAH ADA di OS/browser user, nggak ada UI baru yang ditambah. Cuma memengaruhi user yang emang udah mengaktifkan setting itu sendiri (defaultnya mati buat hampir semua orang), user lain nggak ngerasain bedanya sama sekali
- **2 lapis penanganan**, tergantung jenis animasinya:
  1. **Animasi CSS murni** (grain-shift, card-in, fade-in, hover:scale via Tailwind, dst) — ditangani SEKALIGUS lewat 1 aturan CSS global baru di `global.css`: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; ... } }`. Ini "kill switch" yang otomatis nangkep SEMUA animasi/transisi berbasis CSS di seluruh situs tanpa perlu diubah 1-1 per komponen
  2. **Animasi berbasis JavaScript** (GSAP di `useStaggerReveal`, tilt 3D mouse-tracking di `TiltWrapper`, magnetic cursor di `Button`) — TIDAK kena aturan CSS di atas (karena dikontrol lewat `gsap.fromTo`/React state, bukan CSS `animation`/`transition` biasa), jadi masing-masing dicek manual pakai utility baru `prefersReducedMotion()` (`src/utils/prefersReducedMotion.ts`, based on `window.matchMedia("(prefers-reduced-motion: reduce)")`)
- **`useStaggerReveal.ts`**: kalau reduced-motion aktif, skip animasi `gsap.fromTo` (geser+scale), langsung `gsap.set(targets, { opacity: 1, y: 0, scale: 1 })` — konten tetap fully visible, cuma tanpa gerakan masuknya
- **`TiltWrapper.tsx`**: kalau reduced-motion aktif, `handleMouseMove` skip perhitungan rotasi (kartu nggak pernah miring, tetap flat)
- **`Button.tsx`**: kalau reduced-motion aktif, `handleMouseMove` skip perhitungan magnetic offset (tombol nggak pernah ketarik ke kursor)
- **`GrainLayer.tsx`**: TIDAK perlu diubah — animasinya (`animate-grain-shift`) murni CSS, otomatis ke-cover sama aturan global di atas
- File baru: `src/utils/prefersReducedMotion.ts`. File yang diubah: `src/styles/global.css`, `src/hooks/useStaggerReveal.ts`, `src/components/ui/TiltWrapper.tsx`, `src/components/ui/Button.tsx`, `src/utils/index.ts`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** aktifin dulu setting "Kurangi Gerakan"/"Reduce Motion" di OS (Windows: Settings → Aksesibilitas → Efek Visual; Chrome DevTools juga bisa: `F12` → `Ctrl+Shift+P` → ketik "Render" → "Show Rendering" → emulasi "prefers-reduced-motion: reduce"), refresh halaman, cek grain berhenti bergetar, kartu Village/Marketplace/Gallery nggak miring pas di-hover, tombol nggak ketarik ke kursor, dan section langsung muncul semua pas discroll (tanpa animasi geser masuk). Matikan lagi settingnya, refresh, pastikan semua animasi balik normal seperti biasa

---

## v29 — 23/07/2026 — Halaman 404 "Jalan Ini Berakhir di Kabut" (Tahap 3, poin Halaman 404)

- **Sebelum:** kalau user buka URL/hash yang nggak dikenal (misal salah ketik), `getRouteFromHash()` di `useHashRouter.ts` diam-diam balikin ke Beranda — user nggak pernah tau link-nya salah
- **Sesudah:** hash yang nggak cocok sama route manapun sekarang dikembalikan sebagai route baru `"/404"` (ditambah ke union type `AppRoute`), dan `App.tsx` nge-render komponen baru `PageNotFound` buat kasus itu
- Halaman 404 bertema medieval sesuai request user: judul **"Jalan Ini Berakhir di Kabut"**, ada angka 404 besar transparan di background, pesan singkat, dan tombol "← Kembali ke Beranda"
- **Sengaja TIDAK di-lazy-load** kayak halaman lain (`PageHome`, `PageWorld`, dst di v25) — komponen ini kecil, dan halaman error harus tampil INSTAN tanpa jeda "Memuat..." (jeda loading malah bikin bingung pas skenario "ada yang salah")
- Judul tab browser juga ditambah buat kasus ini: "Halaman Tidak Ditemukan — Project Kingdom" (`useDocumentTitle.ts`)
- File baru: `src/pages/PageNotFound.tsx`. File yang diubah: `src/hooks/useHashRouter.ts` (tambah tipe route `/404` + deteksi hash nggak dikenal), `src/App.tsx` (case baru di switch), `src/hooks/useDocumentTitle.ts`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** buka browser, ketik manual di address bar sesuatu kayak `webs.rzs.my.id/#/halaman-ngasal` (ganti bagian setelah `#/` sama teks acak apapun) — harusnya muncul halaman "Jalan Ini Berakhir di Kabut", BUKAN Beranda atau halaman kosong. Coba juga klik tombol "Kembali ke Beranda"-nya, pastikan beneran balik ke `/`

---

## v28 — 23/07/2026 — SEO: meta tags, Open Graph, judul tab dinamis (Tahap 3, poin SEO)

- **Meta description** ditambah di `index.html` — deskripsi singkat server buat mesin pencari
- **Open Graph tags** (`og:title`, `og:description`, `og:image`, dst) + **Twitter Card** ditambah — buat preview rapi pas link di-share ke WhatsApp/Discord/dll. Gambar preview pakai foto "Bridge of Triumph" (dipilih user), di-crop & resize ke ukuran standar 1200×630px (`public/assets/images/og-preview.jpg`)
- **Keterbatasan penting yang perlu dipahami:** karena web ini SPA (Single Page Application, semua halaman di-render lewat JavaScript di 1 file HTML), Open Graph tags **CUMA BISA 1 versi buat SELURUH website** — nggak bisa beda-beda per halaman (misal preview khusus buat Galeri beda dari Bantuan), soalnya aplikasi kayak WhatsApp/Discord baca HTML mentah doang, nggak jalanin JavaScript kita buat tau lagi di halaman/section mana. Ini batasan wajar SPA client-side, bukan bug — kalau mau preview beda per halaman butuh setup server-side rendering yang jauh lebih kompleks (di luar scope)
- **Judul tab browser** SEKARANG beda per halaman (`document.title`) — ini BEDA dari Open Graph di atas, karena cuma diliat pas browsing langsung (bukan pas link di-share): "Project Kingdom — RZ Survival" (Beranda), "Wilayah — Project Kingdom", "Ekonomi — Project Kingdom", "Gameplay — Project Kingdom", "Galeri — Project Kingdom", "Bantuan — Project Kingdom". Hook baru `useDocumentTitle.ts` (`src/hooks/`)
- Domain yang dipakai di `og:url`/`og:image`: `https://webs.rzs.my.id` (dikonfirmasi user)
- File baru: `src/hooks/useDocumentTitle.ts`, `public/assets/images/og-preview.jpg`. File yang diubah: `index.html` (meta tags), `src/hooks/index.ts` (export), `src/App.tsx` (pasang hook)
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- **PENTING buat testing manual:** buka DevTools (`F12`) → Elements/Inspect → cek `<head>` beneran ada tag `og:*`/`twitter:*`. Buat cek preview share beneran muncul bagus, bisa pakai tool online kayak [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) atau [metatags.io](https://metatags.io) (masukin URL `https://webs.rzs.my.id` setelah web-nya live). Buat judul tab, tinggal klik pindah-pindah halaman dari navbar, lihat judul di tab browser ikut berubah

---

## v27 — 23/07/2026 — Logo navbar & favicon baru

- User upload 2 logo hasil generate AI (background hitam solid), diminta background-nya dihapus jadi transparan lalu dipasang
- **Proses hapus background:** dilakukan manual pakai Python (Pillow) — deteksi piksel yang hampir hitam murni (`R+G+B < 30`) terus dijadiin transparan (`alpha = 0`). Dicek ulang hasilnya dengan nge-composite di atas background biru buat mastiin transparansinya beneran bersih (bukan cuma keliatan putih doang pas dilihat langsung)
- Kedua logo di-crop juga (`getbbox()` + padding tipis 8-10px) biar nggak ada spasi transparan kosong berlebih di pinggirnya
- **Logo navbar** (mahkota + siluet kastil) → dipasang di pojok kiri atas, gantiin emoji `⚜️` yang lama. File: `public/assets/images/logo-navbar.png`
- **Favicon** (mahkota bercahaya/glow) → dipasang buat ikon tab browser, gantiin `favicon.svg` yang lama. File: `public/assets/images/favicon.png`
- File yang diubah: `index.html` (link favicon), `src/components/layout/Navbar.tsx` (ganti emoji jadi `<img>`)
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses, dicek `dist/` beneran bawa kedua file gambar baru + link favicon di HTML udah bener
- **PENTING buat testing manual:** cek tab browser (favicon baru harus muncul di situ, mungkin perlu hard refresh `Ctrl+Shift+R` karena favicon sering ke-cache), sama cek pojok kiri atas navbar di semua halaman (logo harus muncul rapi di sebelah teks "Project Kingdom", bukan kegedean/kekecilan/ketarik aneh)

---

## v26 — 22/07/2026 — Lazy-load gambar galeri (Tahap 3, poin Performa — langkah 3, TERAKHIR) — dikonfirmasi sudah benar, tanpa perubahan kode

- Dicek 2 `<img>` di `Gallery.tsx`:
  1. Foto thumbnail di grid — **sudah** pakai `loading="lazy"` dari awal (kemungkinan sudah diterapkan di sesi sebelum percakapan ini)
  2. Foto full-size di lightbox (popup detail) — **sengaja TIDAK** pakai lazy, dan ini SUDAH BENAR: gambar itu cuma dirender ke DOM pas user beneran klik buka lightbox-nya, jadi otomatis langsung tampil di layar — lazy-load di sini nggak ada gunanya (`loading="lazy"` cuma bermanfaat buat gambar yang emang di luar layar/belum kelihatan)
- **Tidak ada file yang diubah** — cuma verifikasi & update checklist
- **Poin "Performa" di Tahap 3 SELESAI SEMUA** (3/3 langkah: preload musik v24, code-splitting v25, lazy-load gambar v26)
- Checklist `RENCANA.md` Tahap 3: 1 dari 5 poin besar selesai (Performa), sisa 4: Aksesibilitas, SEO, Halaman 404, Review konten

---

## v25 — 22/07/2026 — Code-splitting per halaman (Tahap 3, poin Performa — langkah 2)

- Sebelumnya `App.tsx` impor SEMUA section dari SEMUA halaman secara langsung (statis) — jadi Vite build-nya jadi 1 file JS raksasa (578KB / gzip 188KB) yang didownload PENUH oleh siapapun, walau cuma buka 1 halaman doang (misal Galeri)
- **Fix:** bikin folder baru `src/pages/` — tiap "halaman" (Beranda, Wilayah, Ekonomi, Gameplay, Galeri, Bantuan) sekarang jadi file terpisah (`PageHome.tsx`, `PageWorld.tsx`, dst), masing-masing impor section-nya LANGSUNG dari file section (bukan lewat barrel `@/components/sections` bersama) biar Vite/Rollup bisa misahin chunk-nya dengan bersih
- `App.tsx` sekarang pakai `React.lazy()` buat tiap halaman + dibungkus `<Suspense fallback={<PageLoadingFallback />}>` — chunk halaman baru BARU didownload pas rute-nya beneran dibuka, sambil nampilin fallback ringan ("Memuat...") kalau chunk-nya belum selesai kedownload
- **Hasil ukuran file JS utama turun dari 578KB → 304KB** (gzip 188KB → 105KB), sisanya kepecah jadi 12 chunk kecil per halaman/komponen (`PageHome` 9.8KB, `PageWorld` 4.1KB, `PageEconomy` 18KB, `PageGameplay` 17KB, `PageFaq` 14KB — semua jauh lebih ringan dari sebelumnya)
- **Pengecualian:** chunk `PageGallery` masih relatif besar (204KB) — ini WAJAR, bukan bug, karena fitur komentar galeri (`GalleryComments.tsx`) pakai library pihak ketiga `netlify-identity-widget` yang lumayan berat buat sistem login komentar. Sebelumnya library ini ikut ke-download semua orang di semua halaman; sekarang cuma orang yang buka halaman Galeri yang download itu — jadi tetap ada peningkatan buat SEMUA halaman lain
- File baru: `src/pages/PageHome.tsx`, `PageWorld.tsx`, `PageEconomy.tsx`, `PageGameplay.tsx`, `PageGallery.tsx`, `PageFaq.tsx`. File yang diubah: `src/App.tsx` (rombak total bagian import & render halaman jadi lazy-load)
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses, dicek output `dist/` beneran kepecah jadi banyak chunk kecil (bukan cuma 1 file besar kayak sebelumnya)
- Checklist `RENCANA.md` Tahap 3 poin "Performa": preload musik (v24) + code-splitting (langkah ini) selesai. Sisa: lazy-load gambar galeri yang belum kena `loading="lazy"`
- **PENTING buat testing manual:** ini yang PALING PENTING dicek — coba klik pindah-pindah SEMUA halaman dari navbar (Beranda → Wilayah → Ekonomi → Gameplay → Galeri → Bantuan), pastikan semuanya tetap muncul normal kayak biasa, nggak ada yang blank/error, dan sempat kelihatan tulisan "Memuat..." sekilas pas pertama kali buka halaman tertentu (terutama di koneksi lambat/pas throttle network di DevTools)

---

## v24 — 22/07/2026 — Musik utama (bgm.mp3) di-preload lebih awal (Tahap 3, poin Performa — langkah 1)

- Langkah pertama dari Tahap 3 (RENCANA.md, poin "Performa") — dimulai dari yang paling kerasa dampaknya buat user: musik
- **Sebelum:** `bgm.mp3` (~4MB, musik utama yang di-toggle lewat tombol "Musik ON/OFF" di navbar) di-set `preload="metadata"` — cuma metadata (durasi dll) yang di-load duluan, isi audionya baru mulai didownload pas user klik "Musik ON". Ada jeda kecil sebelum musik beneran kedengeran
- **Sesudah:** diganti `preload="auto"` — file audio-nya mulai di-download di BACKGROUND begitu halaman pertama kali dibuka, paralel sama proses loading lain (nggak ngeblokir render/interaksi apapun). Pas user klik "Musik ON" (biasanya beberapa detik setelah halaman kebuka), file-nya kemungkinan besar udah ke-buffer duluan, jadi musiknya langsung kedengeran tanpa jeda
- **Musik ambient per-halaman (`useAmbientPlayer.ts`) SENGAJA TIDAK disentuh** — itu tetap dimuat lazy (baru di-load pas user beneran buka halaman itu), biar nggak buang-buang bandwidth download audio buat halaman yang mungkin belum tentu dikunjungi user
- File yang diubah: `src/context/MusicContext.tsx`
- Sudah dites: `tsc --noEmit` bersih, `npm run build` sukses
- Checklist `RENCANA.md` Tahap 3 poin "Performa": ini baru sebagian (musik doang) — code-splitting & lazy-load gambar galeri masih menyusul kalau diminta lanjut
- **PENTING buat testing manual:** susah dites cuma dari "kerasa" doang karena efeknya soal kecepatan network — coba buka DevTools (`F12`) → tab **Network** → filter **Media** → refresh halaman, lihat `bgm.mp3` mulai ke-download OTOMATIS tanpa perlu klik apa-apa dulu (sebelumnya nggak akan muncul di situ sampai tombol "Musik ON" diklik)

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
