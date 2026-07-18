# Project Kingdom

Skeleton project React untuk **RZ Survival: Interactive Medieval Experience**.
Dibangun sesuai `Project Bible (01)`, `Tech Bible (05)`, dan `Project Implementation Guide (03)`.

Status: **skeleton/pondasi**. Copy, asset, dan animasi final belum diimplementasikan —
ditandai `TODO` di seluruh project. Kelanjutan pengerjaan dilakukan oleh Google Antigravity AI.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- GSAP (ScrollTrigger) + Lenis

## Instalasi

```bash
npm install
```

## Menjalankan dev server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint & Format

```bash
npm run lint
npm run format
```

## Fitur Komentar Galeri (baru)

Setiap foto di Gallery sekarang punya kolom komentar bertingkat (nested replies), dengan login wajib pakai akun Google.

**File yang ditambahkan/diubah:**
- `migrations/0001_create_comments.sql` — skema tabel `comments` di Netlify Database (Postgres)
- `netlify/functions/comments.ts` — API serverless: `GET/POST /api/comments`, `DELETE /api/comments/:id`
- `netlify.toml` — konfigurasi build & lokasi folder function
- `src/components/sections/Gallery/GalleryComments.tsx` — komponen UI komentar
- `src/components/sections/Gallery/Gallery.tsx` — diintegrasikan, `GalleryComments` muncul di lightbox foto

**Cara kerja singkat:**
1. User klik "Login dengan Google" → Netlify Identity buka popup login Google → dapat token sesi
2. Nama & foto profil Google user tersimpan otomatis di tiap komentar yang mereka kirim
3. Komentar/balasan disimpan di tabel `comments`, kolom `parent_id` mendukung balasan dari balasan tanpa batas kedalaman
4. Sebelum komentar tersimpan, Netlify Function memverifikasi token login di server (bukan cuma di frontend)

**Dependency yang perlu di-install:**
```bash
npm install netlify-identity-widget @netlify/neon
npm install -D @netlify/functions
```

**Environment variable & setup dashboard** — lihat instruksi step-by-step yang dikirim terpisah (setup Netlify Database, Google OAuth di Google Cloud Console, dan Netlify Identity provider).

**Catatan teknis (bug yang sempat ketemu & solusinya):** karena project ini pakai Lenis (smooth-scroll) yang dipasang di `PageWrapper`, elemen `position: fixed` biasa (lightbox & tombolnya) jadi "terkunci" di dalam pembungkus Lenis dan nggak beneran nempel ke layar — bikin navbar nutupin bagian atas lightbox dan tombol close ikut ke-scroll hilang. Solusinya: lightbox di-render pakai `createPortal` (React) langsung ke `document.body`, keluar dari pembungkus Lenis. Selain itu, Lenis juga "mencegat" semua gerakan scroll di halaman — biar scroll di dalam lightbox tetap jalan normal, div-nya dikasih atribut `data-lenis-prevent` yang bikin Lenis nggak ikut campur di situ. Detail lengkap ada di `catatan.md`.

## Struktur Folder

```
migrations/                 # SQL migration untuk Netlify Database
netlify/
└── functions/               # Netlify Functions (API komentar, dsb)
src/
├── components/
│   ├── layout/       # Navbar, Footer, PageWrapper
│   ├── sections/      # 12 section (Opening ... JoinServer)
│   ├── ui/             # Button, Card, Icon, SectionHeading
│   └── layers/          # TransitionLayer, CursorLayer, AmbientLayer
├── hooks/                # useScrollReveal, useLenisScroll, usePathSelection
├── context/               # PathContext (activePath global)
├── providers/              # PathProvider, AppProviders
├── data/                    # copy per section/archetype (placeholder TODO)
├── constants/                # SECTION_IDS, ANCHORS
├── lib/                       # setup GSAP & Lenis
├── utils/                      # cn, scrollToSection
├── types/                       # ArchetypeId, SectionCopy, dsb
├── styles/                       # global.css (Tailwind entry)
├── App.tsx
└── main.tsx
```

Referensi lengkap: lihat `Project Implementation Guide (03)`.
