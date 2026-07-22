# Catatan: Visual Polish — Font Cinzel, Reveal Dramatis, Parallax

Catatan ini isinya penjelasan sesi "bikin tampilan lebih premium ala activetheory.net",
ditulis biar gampang dibaca ulang kalau lupa nanti atau mau lanjut ke tahap berikutnya.

## Apa yang ditambahin/diubah

| File | Fungsinya |
|---|---|
| `index.html` | Tambah link Google Fonts **Cinzel** (font heraldik untuk semua heading) |
| `tailwind.config.ts` | `font-heading` diganti dari `Georgia` (placeholder lama) ke `Cinzel`, fallback tetap ke Georgia/serif kalau font gagal load |
| `src/hooks/useScrollReveal.ts` | Reveal-on-scroll di-upgrade dari fade+geser simpel (`opacity 0→1`, `y 40→0`) jadi lebih dramatis: scale-up (`0.85→1`) + rise (`y 100→0`) + fade, easing `power4.out`, durasi 1.4s. Dipakai otomatis di **semua section** (hook global) |
| `src/hooks/useParallax.ts` (baru) | Hook baru — background section bergerak lebih lambat dari scroll asli (efek kedalaman/3D). Pakai `gsap.fromTo` + `ScrollTrigger` dengan `scrub: true`, cuma transform (`yPercent`), GPU-friendly |
| `src/hooks/useLenisScroll.ts` | **Bug fix penting**: ditambah `lenis.on("scroll", ScrollTrigger.update)`. Tanpa baris ini, animasi `scrub` (kayak parallax) update-nya telat/nggak presisi karena Lenis nggak ngasih tau ScrollTrigger tiap kali dia gerakin scroll. Ini integrasi resmi Lenis+GSAP yang sebelumnya kelewatan |
| `src/components/sections/Castle/`, `Village/`, `Marketplace/`, `Economy/`, `Jobs/`, `Dungeon/`, `Boss/`, `Gallery/` | Tiap section: tambah `bgRef` + `useParallax(bgRef, 0.6)`, `overflow-hidden` di section wrapper, dan layer dekoratif baru (motif titik + 2 radial glow) yang jadi target parallax-nya |

## Section yang SUDAH dan BELUM dapat parallax

**Sudah:** Castle, Village, Marketplace, Economy, Jobs, Dungeon, Boss, Gallery (8 section)

**Belum (sengaja di-skip):** Opening (hero), Path Select, Trailer, Join Server —
alasan: biar section ini tetap punya karakter beda sendiri, nggak semua section harus seragam.
Kalau nanti berubah pikiran, tinggal terapkan pola yang sama dari salah satu section di atas.

## Variasi warna glow parallax per section

Sengaja dibedain dikit biar nyambung sama tema tiap section, bukan disamain semua:
- Village, Marketplace, Economy, Jobs, Gallery, Castle → glow keemasan (`rgba(201,162,39,...)`, sesuai token `ember-gold`)
- Dungeon → glow ungu redup (`rgba(88,60,120,...)`) — kesan misterius
- Boss → glow merah magma (`rgba(153,27,27,...)`) — sesuai tema api/pertarungan

## Kalibrasi reveal — histori keputusan

Sempat dicoba 3 versi buat nemuin titik yang pas:
1. Subtle awal: `scale 0.94`, `y 64px` → user rasa "sama aja, ga berubah"
2. Ekstrem (testing): `scale 0.7`, `y 150px`, durasi 1.8s → user: "zoom-nya keliatan, keren, tapi kegedean"
3. **Final (dipakai sekarang):** `scale 0.85`, `y 100px`, durasi 1.4s — titik tengah, disukai

## Bug ditemukan (belum diperbaiki, belum diminta user)

`tsconfig.app.json` — opsi `baseUrl` sudah **deprecated** di TypeScript 5.9+ dan bikin
`npm run build` gagal di step `tsc -b` (error `TS5101`). Ini bukan dari perubahan visual
di atas — ini bug lama yang muncul karena project pakai `"typescript": "^5.5.3"` (caret),
jadi otomatis ke-upgrade ke versi terbaru (5.9.3) tiap `npm install`.

**Dampak:** `npm run dev` aman-aman aja (nggak kena bug ini). Cuma `npm run build`
(dipakai Netlify pas deploy) yang bakal gagal kalau `node_modules` di-install ulang
dengan TypeScript 5.9+.

**User belum minta diperbaiki** — masih pending, jadi belum disentuh.

## Ide lanjutan yang sudah didiskusikan (belum dikerjakan)

Ini rencana buat nambah kesan "premium" lebih jauh, urut dari yang paling kerasa dampaknya:

1. **Magnetic cursor di tombol** — tombol "ketarik" dikit ke arah kursor pas didekatin
2. **Reveal berlapis (staggered)** — judul/gambar/list muncul bergantian, bukan 1 blok utuh
3. **Progress indicator scroll** — garis tipis di pinggir layar nunjukin posisi scroll
4. **Grain/noise texture global** — overlay film-grain halus di seluruh halaman
5. **Hover tilt di card** — card miring dikit ngikutin kursor pas di-hover (Village/Marketplace/Gallery)

Belum ada yang dipilih user buat dikerjain duluan — masih tahap diskusi.
