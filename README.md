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

## Struktur Folder

```
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
