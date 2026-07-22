# Catatan: Fix NavDots + Reveal Berlapis PathSelect & Bantuan

Ini bukan lanjutan checklist Tahap 1 (7 section sudah selesai total di v12/catatan
11). Ini laporan bug baru dari user hasil testing manual browser setelah Tahap 1
kelar.

## Bug 1: NavDots nyangkut — analisis akar masalah

### Gejala yang dilaporkan user
Titik navigasi di kanan layar (`NavDots`) seharusnya berubah sesuai halaman yang
lagi dibuka:
- Beranda → 3 titik (Beranda, Pilih Jalur, Kastil)
- Wilayah → 2 titik (Desa, Kastil)
- Ekonomi → 3 titik (Pasar, Ekonomi, Pekerjaan)
- Gameplay → 3 titik (Dungeon, Boss, Trailer)
- Galeri → titik disembunyikan otomatis (cuma 1 section, sesuai kode
  `if (presentIds.length <= 1) return null`)
- Bantuan → 2 titik (Bergabung, Pertanyaan)

Yang terjadi: di SEMUA halaman selain Beranda, titiknya tetap nunjukin 3 titik
punya Beranda. User awalnya ngira ini "section Galeri ketiban konten Bergabung
& Pertanyaan" — padahal itu cuma titik navigasinya doang yang nyangkut/stale,
bukan konten section-nya beneran ketuker.

### Kenapa ini bisa kejadian (root cause)

```tsx
// SEBELUM — NavDots.tsx
export function NavDots() {
  const { currentRoute } = useHashRouter(); // instance hook SENDIRI
  ...
  useEffect(() => {
    // query document.getElementById buat cari section yang ada
  }, [currentRoute]);
}
```

```tsx
// SEBELUM — App.tsx
function AppShell() {
  const { currentRoute } = useHashRouter(); // instance hook LAIN LAGI
  ...
  const renderPage = () => { switch (currentRoute) { ... } };
  return (
    <>
      ...
      <PageWrapper>{renderPage()}</PageWrapper>
      ...
      <NavDots /> {/* tidak dikasih tau currentRoute apa-apa */}
    </>
  );
}
```

`useHashRouter()` itu **custom hook biasa** (bukan React Context/store global) —
tiap komponen yang manggil dia dapet `useState` sendiri-sendiri yang independen.
`AppShell` manggil sekali, `NavDots` manggil lagi secara terpisah. Keduanya
sama-sama pasang listener `window.addEventListener("hashchange", ...)` di
`useEffect` masing-masing, dan secara teori harusnya tetap update bareng karena
denger event yang sama. Tapi karena ini 2 instance state yang independen (bukan
1 sumber kebenaran tunggal), ini rawan desync — dan di praktiknya user
ngonfirmasi ini emang kejadian.

### Fix

Daripada NavDots punya "otak" routing sendiri, dia sekarang cuma terima
`currentRoute` sebagai **prop** dari `AppShell` — persis instance yang sama yang
dipakai buat mutusin section mana yang di-render. Nggak ada lagi 2 sumber
kebenaran yang bisa beda pendapat.

```tsx
// SESUDAH — NavDots.tsx
type NavDotsProps = { currentRoute: AppRoute };
export function NavDots({ currentRoute }: NavDotsProps) {
  // TIDAK ADA lagi useHashRouter() di sini
  useEffect(() => { ... }, [currentRoute]); // sekarang currentRoute dari PROP
}
```

```tsx
// SESUDAH — App.tsx
<NavDots currentRoute={currentRoute} />
```

Ini menjamin `NavDots` SELALU tau halaman aktif yang PERSIS sama dengan yang lagi
di-render `AppShell`, nggak mungkin beda lagi.

## Bug 2 & 3: PathSelect + Bantuan (JoinServer, Faq) belum reveal berlapis

Ini section-section yang **sudah ada sebelum Tahap 1 dimulai** — makanya nggak
masuk daftar 7 section RENCANA.md (yang isinya cuma section yang "belum punya
reveal apapun" pas Tahap 1 direncanakan). Ternyata PathSelect, JoinServer, Faq,
dan Trailer juga masih pakai cara lama / belum ada reveal sama sekali, kelewat
kecatat.

### PathSelect
Pola sama kayak section grid lainnya, cuma `PathCard` (komponen kartu-nya) belum
di-desain buat forward extra props (`data-reveal`) kayak komponen `Card` biasa —
dia langsung `<button>` tanpa `{...rest}`. Solusinya, tiap `<PathCard>` dibungkus
`<div data-reveal>` di level pemanggilnya (`PathSelect.tsx`), bukan ubah isi
`PathCard.tsx` (lebih aman, komponennya nggak disentuh sama sekali).

### JoinServer
6 titik `data-reveal`: judul+body (1 blok), kartu IP server (1 blok), 3 tombol
support (satu-satu, key stabil/statis), mini-FAQ (1 blok — ini accordion,
key = `faq.q` stabil TAPI karena cuma buka-tutup bukan filter, sebenarnya aman
dipecah juga — saya pilih 1 blok aja biar konsisten & simpel), CTA besar.

### Faq (halaman Bantuan)
Section ini SEBELUMNYA sama sekali nggak punya `ref` atau reveal hook apapun —
ditambah dari nol. 4 titik `data-reveal`:
1. Hero + search bar (1 blok)
2. Bar filter kategori (1 blok)
3. Daftar accordion FAQ (1 blok — **wajib** diblok karena `filteredFaqs` berubah
   isi & jumlahnya tiap user ganti kategori/ngetik di search box, sama persis
   alasan risiko yang sama kayak Gallery grid v12 dan Dungeon panel v10 — kalau
   dipecah per item, item hasil filter baru nggak akan ke-animate)
4. Box "Masih Butuh Bantuan" (1 blok)

## Yang SENGAJA TIDAK disentuh

Section **Trailer** (di halaman Gameplay) masih pakai `useScrollReveal` lama.
User tidak melaporkan ini sebagai bug, jadi dibiarkan dulu — dicatat di sini kalau
suatu saat mau diminta sekalian diperbaiki.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual user

Selain cek reveal berlapis muncul satu-satu di Beranda (PathSelect) dan Bantuan
(JoinServer+Faq), yang PALING PENTING dicek di langkah ini: **buka satu-satu
SEMUA halaman dari navbar** (Beranda → Wilayah → Ekonomi → Gameplay → Galeri →
Bantuan) dan pastikan titik navigasi kanan **berubah jumlah & labelnya** sesuai
section yang ada di masing-masing halaman, bukan nyangkut di 3 titik punya
Beranda terus.

File yang diubah di langkah ini:
`src/components/ui/NavDots.tsx`,
`src/App.tsx`,
`src/components/sections/PathSelect/PathSelect.tsx`,
`src/components/sections/JoinServer/JoinServer.tsx`,
`src/components/sections/Faq/Faq.tsx`.
