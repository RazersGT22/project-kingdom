# Catatan: Halaman 404 "Jalan Ini Berakhir di Kabut"

*(Ditulis susulan — sempat kelewat nggak dicatat pas v29 dikerjain.)*

## Konteks

Poin "Halaman 404" dari Tahap 3 `RENCANA.md`. Sebelum ini, kalau user buka
URL/hash yang nggak dikenal, `getRouteFromHash()` diam-diam ngembaliin ke
Beranda — user nggak pernah dikasih tau kalau link-nya salah/rusak.

## Perubahan di `useHashRouter.ts`

Tipe `AppRoute` ditambah 1 nilai baru:

```ts
// SEBELUM
export type AppRoute = "/" | "/world" | "/economy" | "/gameplay" | "/gallery" | "/faq";

// SESUDAH
export type AppRoute = "/" | "/world" | "/economy" | "/gameplay" | "/gallery" | "/faq" | "/404";
```

Penting: `"/404"` BUKAN route yang bisa dituju langsung lewat navbar/link
manapun di aplikasi — dia CUMA muncul secara otomatis lewat logic di
`getRouteFromHash()`:

```ts
// SEBELUM — hash nggak dikenal diam-diam jadi "/"
function getRouteFromHash(): AppRoute {
  const raw = window.location.hash;
  const path = raw.startsWith("#") ? raw.slice(1) : raw;
  if (VALID_ROUTES.includes(path as AppRoute)) {
    return path as AppRoute;
  }
  return "/"; // <- di sini masalahnya, semua yang nggak valid jadi Beranda
}

// SESUDAH
function getRouteFromHash(): AppRoute {
  const raw = window.location.hash;
  const path = raw.startsWith("#") ? raw.slice(1) : raw;
  if (path === "" || path === "/") return "/"; // hash kosong = Beranda (normal)
  if (VALID_ROUTES.includes(path as AppRoute)) {
    return path as AppRoute;
  }
  return "/404"; // ada isinya tapi nggak dikenal = 404
}
```

Bedanya krusial: hash KOSONG (`""` atau `"/"`, kondisi normal pas buka web
tanpa hash sama sekali) tetap dianggap Beranda seperti biasa. Tapi hash yang
ADA ISINYA tapi nggak cocok sama route manapun (misal `#/halaman-ngasal`)
sekarang jadi `/404`, bukan otomatis Beranda.

## Komponen `PageNotFound.tsx`

Ditaruh di `src/pages/` (folder yang sama kayak halaman lain dari code-splitting
v25), TAPI **sengaja TIDAK di-lazy-load**. Alasannya: halaman error harus
tampil INSTAN — kalau pakai `React.lazy()` + `Suspense`, ada kemungkinan
sekilas muncul "Memuat..." dulu sebelum halaman 404-nya kelihatan, yang
malah nambah bingung user di skenario "ada yang salah" (harusnya feedback-nya
cepat & jelas).

Konten sesuai request user — judul **"Jalan Ini Berakhir di Kabut"**, angka
404 besar transparan di background (dekoratif), pesan singkat bertema
petualang/kerajaan, tombol "← Kembali ke Beranda" yang manggil
`navigate("/")` dari `useHashRouter()`.

## Perubahan di `App.tsx`

Tambah 1 case baru di switch `renderPage()`, sebelum `default`:

```tsx
case "/404": return <PageNotFound />;
default:     return <PageHome activePath={activePath} />;
```

## Perubahan di `useDocumentTitle.ts`

Tambah 1 entry: `"/404": "Halaman Tidak Ditemukan — Project Kingdom"`.

## Efek samping yang otomatis udah aman (nggak perlu diubah)

- **NavDots**: di halaman 404 nggak ada elemen `<section id="...">` sama
  sekali, jadi `presentIds` bakal kosong, dan kode NavDots yang udah ada
  (`if (presentIds.length <= 1) return null`) otomatis nyembunyiin titik
  navigasi — nggak perlu ada penanganan khusus tambahan
- **Navbar**: nggak ada nav link yang match `"/404"`, jadi otomatis nggak ada
  menu yang ke-highlight aktif — perilaku yang wajar buat halaman error

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual

Ketik manual di address bar browser sesuatu kayak `localhost:5173/#/ngasal`
(ganti bagian setelah `#/` bebas teks apa aja) — harus muncul halaman "Jalan
Ini Berakhir di Kabut", BUKAN Beranda atau halaman blank. Coba juga klik
tombol "Kembali ke Beranda", pastikan beneran pindah ke `/`.

File yang diubah: `src/hooks/useHashRouter.ts`, `src/App.tsx`,
`src/hooks/useDocumentTitle.ts`. File baru: `src/pages/PageNotFound.tsx`.
