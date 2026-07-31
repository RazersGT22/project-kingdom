# Catatan: SEO — Meta Tags, Open Graph, Judul Tab Dinamis

*(Ditulis susulan — sempat kelewat nggak dicatat pas v28 dikerjain.)*

## Konteks

Poin "SEO & meta tag" dari Tahap 3 `RENCANA.md`. Ada 1 hal teknis penting yang
perlu dipahami betul sebelum eksekusi: **batasan SPA (Single Page Application)
soal Open Graph**.

## Kenapa Open Graph nggak bisa beda-beda per halaman di project ini

Project ini SPA murni — 1 file `index.html`, semua "halaman" (Beranda, Wilayah,
Galeri, dst) sebenarnya JavaScript yang nge-render konten beda-beda ke DOM yang
SAMA, berdasarkan hash URL (`#/world`, `#/gallery`, dst), semuanya dijalanin di
BROWSER user (client-side).

Aplikasi kayak WhatsApp/Discord/Telegram, pas nge-generate preview link,
NGGAK menjalankan JavaScript sama sekali — mereka cuma minta HTML mentah dari
server terus baca tag `<meta property="og:...">` yang ADA di HTML itu apa
adanya. Karena `index.html` di project ini CUMA SATU FILE yang sama dipakai
buat SEMUA route (hash URL beda-beda cuma diproses SETELAH JavaScript jalan di
browser), tag `og:title`/`og:image`/dst yang keliatan sama persis nggak peduli
URL hash-nya apa.

**Ini bukan bug yang bisa diperbaiki gampang** — solusi sesungguhnya butuh
server-side rendering (SSR) atau pre-rendering per-route (misal pakai Vite SSG
plugin atau framework kayak Next.js/Astro), yang berarti ubah arsitektur
fundamental project. Di luar scope langkah ini — cukup didokumentasikan biar
user paham batasannya, bukan dikira "belum selesai dikerjain".

## Yang BISA beda per halaman: `document.title`

`document.title` itu beda cerita — ini di-set lewat JavaScript SETELAH halaman
dimuat di browser user sendiri, jadi bisa berubah-ubah bebas sesuai route aktif.
Bedanya sama Open Graph: ini cuma keliatan pas user LAGI BUKA browser-nya
langsung (nentuin judul di tab), BUKAN pas link di-share ke aplikasi lain.

Hook baru `useDocumentTitle.ts`:

```tsx
const PAGE_TITLES: Record<AppRoute, string> = {
  "/": "Project Kingdom — RZ Survival",
  "/world": "Wilayah — Project Kingdom",
  // ...dst
};

export function useDocumentTitle(route: AppRoute) {
  useEffect(() => {
    document.title = PAGE_TITLES[route] ?? "Project Kingdom — RZ Survival";
  }, [route]);
}
```

Dipasang di `AppShell` (App.tsx), jalan tiap kali `currentRoute` berubah.

## Gambar Open Graph (og-preview.jpg)

User pilih foto "Bridge of Triumph" (dari 4 foto baru yang ditambah di v22)
buat jadi gambar preview. Di-crop & resize ke ukuran standar rekomendasi buat
Open Graph (1200×630px, rasio ~1.91:1 — dipakai hampir semua platform: Facebook,
WhatsApp, Discord, LinkedIn):

```python
target_w, target_h = 1200, 630
target_ratio = target_w / target_h
w, h = img.size
current_ratio = w / h

if current_ratio > target_ratio:
    # gambar lebih lebar dari target rasio → crop kiri-kanan
    new_w = int(h * target_ratio)
    left = (w - new_w) // 2
    img = img.crop((left, 0, left + new_w, h))
else:
    # gambar lebih tinggi dari target rasio → crop atas-bawah
    ...

img = img.resize((target_w, target_h), Image.LANCZOS)
```

Disimpan di `public/assets/images/og-preview.jpg`.

## Domain yang dipakai

`https://webs.rzs.my.id` — dikonfirmasi langsung oleh user, dipakai di
`og:url` dan URL absolut gambar (`og:image`, `twitter:image`). URL absolut
WAJIB (bukan path relatif kayak `/assets/...`) karena aplikasi chat yang baca
tag ini butuh URL lengkap buat bisa fetch gambarnya dari server manapun dia
berada, nggak tau base URL dari konteks apapun.

## Meta tags yang ditambah (ringkasan)

- `<meta name="description">` — deskripsi buat mesin pencari
- `<meta name="theme-color">` — warna tema browser mobile (address bar dll)
- `og:type`, `og:site_name`, `og:title`, `og:description`, `og:image` (+ width/height),
  `og:url`, `og:locale`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual

- Cek tag di DevTools (`F12` → Elements → lihat isi `<head>`)
- Buat cek preview share BENERAN muncul bagus (bukan cuma ngecek tag doang),
  bisa pakai [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
  atau [metatags.io](https://metatags.io) — masukin URL `https://webs.rzs.my.id`
  SETELAH web-nya live/di-deploy (nggak bisa dites dari localhost)
- Buat judul tab: klik pindah-pindah halaman navbar, lihat judul di tab
  berubah-ubah

File yang diubah: `index.html`, `src/hooks/index.ts`, `src/App.tsx`.
File baru: `src/hooks/useDocumentTitle.ts`, `public/assets/images/og-preview.jpg`.
