# Catatan: Fitur Komentar Bertingkat di Galeri

Catatan ini isinya penjelasan cara kerja fitur komentar yang ditambahin ke Gallery, ditulis biar gampang dibaca ulang kalau lupa nanti.

## Apa yang ditambahin

| File | Fungsinya |
|---|---|
| `migrations/0001_create_comments.sql` | Skema tabel `comments` di database |
| `netlify/functions/comments.ts` | "Server" (API) yang urus ambil, kirim, hapus komentar |
| `netlify.toml` | Konfigurasi lokasi folder function buat Netlify |
| `src/components/sections/Gallery/GalleryComments.tsx` | Tampilan (UI) komentar |
| `src/components/sections/Gallery/Gallery.tsx` | Ditempelin `GalleryComments` di lightbox foto |

## Alur singkat: dari klik login sampai komentar tersimpan

1. User buka salah satu foto galeri → lightbox kebuka, muncul bagian "Komentar" di bawah
2. User klik **"Login dengan Google"** → Netlify Identity buka pop-up Google → user pilih akun
3. Setelah login, Netlify Identity kasih **token** (semacam kartu identitas digital) ke browser
4. User tulis komentar, klik Kirim → frontend kirim isi komentar + token itu ke `POST /api/comments`
5. Netlify Function (`comments.ts`) **cek dulu tokennya sah atau nggak** sebelum nyimpen ke database — ini yang bikin orang nggak bisa ngaku-ngaku jadi orang lain
6. Kalau sah, komentar (+ nama & foto profil Google user) disimpan ke tabel `comments`
7. Tiap foto dibuka lagi, `GET /api/comments?photo_id=xxx` ambil semua komentar buat foto itu, disusun jadi pohon (komentar + balasan-balasannya)

## Kenapa bisa "balasan dari balasan" tanpa batas

Kolom `parent_id` di tabel `comments` nunjuk balik ke tabel itu sendiri. Jadi 1 komentar bisa jadi "induk" buat komentar lain, dan itu bisa berantai terus — nggak dibatasi cuma 2 level kayak kebanyakan sistem komentar sederhana.

## `photo_id` pakai apa?

Bukan angka ID galeri, tapi **path file foto** (misal `/assets/images/gallery/benteng_sang_raja.jpeg`). Alasannya: ini udah pasti unik per foto dan nggak berubah walau urutan galeri di-acak/diedit nanti.

## Yang masih perlu di-setup manual (belum otomatis)

- Bikin Netlify Database dari dashboard Netlify
- Bikin Google OAuth credentials di Google Cloud Console
- Pasang environment variable di Netlify
- Aktifin Netlify Identity + provider Google di dashboard Netlify

(Instruksi detail langkah-langkah ini dikirim terpisah waktu proses setup, bukan di catatan ini.)

## Bug yang sempat ditemuin & cara benerinnya

- **Lightbox ketutup navbar / tombol X ilang pas di-scroll** — penyebabnya: `PageWrapper` (pembungkus Lenis buat smooth-scroll) kemungkinan punya CSS `transform`, dan itu bikin elemen `fixed` di dalamnya nggak beneran nempel ke layar. Solusinya: lightbox di-"portal"-kan pakai `createPortal` dari React, jadi dia dirender langsung ke `document.body`, keluar dari pembungkus Lenis.
- **2 scrollbar pas lightbox kebuka** — dibenerin dengan matiin scroll halaman belakang (`document.body.style.overflow = "hidden"`) selama lightbox terbuka.
