# Catatan: Fitur Komentar Bertingkat di Galeri

Catatan ini isinya penjelasan cara kerja fitur komentar yang ditambahin ke Gallery, ditulis biar gampang dibaca ulang kalau lupa nanti.

## Apa yang ditambahin

| File | Fungsinya |
|---|---|
| `netlify/database/migrations/0001_create_comments/migration.sql` | Skema tabel `comments` di Netlify Database. Ditaruh di lokasi ini (bukan folder `migrations/` biasa) karena Netlify otomatis mendeteksi & menjalankan migration di folder ini tiap kali deploy — nggak perlu jalanin manual lewat SQL console |
| `netlify/database/migrations/0002_ban_users/migration.sql` | Skema tabel `banned_users` — nyimpen akun yang diblokir admin |
| `netlify/functions/comments.ts` | "Server" (API) yang urus ambil, kirim, hapus komentar, plus blokir/cabut-blokir akun. Pakai `@netlify/database` (buat ambil connection string) + `pg` (client Postgres biasa). Verifikasi login dicek langsung ke endpoint GoTrue (`/.netlify/identity/user`), bukan pakai `context.clientContext` (soalnya nggak konsisten muncul di Netlify Function versi baru) |
| `netlify.toml` | Konfigurasi lokasi folder function buat Netlify |
| `src/components/sections/Gallery/GalleryComments.tsx` | Tampilan (UI) komentar, termasuk tombol Hapus & Blokir |
| `src/components/sections/Gallery/Gallery.tsx` | Ditempelin `GalleryComments` di lightbox foto |
| `src/data/galleryCopy.ts` | Data foto galeri — udah nambah 2 foto baru: "The Chronicle Begins" & "Awal Sebuah Petualangan" |

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

## Setup yang udah selesai

- ✅ **Netlify Identity** diaktifin lewat dashboard (`Project configuration` → cari halaman **Identity**; kalau nggak muncul di sidebar/pencarian, akses langsung lewat URL `https://app.netlify.com/projects/<nama-project>/configuration/identity`)
- ✅ **Google sebagai penyedia login** diaktifin di halaman Identity yang sama, bagian "Penyedia eksternal" → "Tambahkan penyedia" → Google → pilih **"Gunakan konfigurasi default"** (jadi nggak perlu bikin akun/kredensial Google Cloud Console sendiri sama sekali)
- ✅ **Netlify Database** — ternyata otomatis dibikinin Netlify sendiri (nggak perlu langkah manual)
- ✅ **Skema tabel `comments`** — awalnya dicoba lewat SQL console manual, tapi kena "read-only mode" terus (nggak ketemu cara matiinnya). Solusi akhir: pindah ke sistem migration resmi Netlify (`netlify/database/migrations/.../migration.sql`), yang otomatis dijalanin Netlify sendiri pas deploy — jadi nggak perlu SQL console sama sekali
- ✅ Ganti dependency dari `@netlify/neon` (cara lama/legacy) ke `@netlify/database` + `pg` (cara resmi yang didukung penuh sekarang)

## Fitur admin (email: frendigr.47@gmail.com)

- **Hapus komentar siapa aja** — tombol "Hapus" muncul di semua komentar (bukan cuma punya sendiri) kalau login pakai email admin
- **Blokir akun** — tombol "Blokir" muncul di komentar orang lain (bukan komentar sendiri). Sekali diblokir, akun itu nggak bisa kirim komentar baru lagi (server balikin error 403), tapi komentar lama yang udah ada tetap nggak kehapus
- Dua-duanya dicek di sisi server (`ADMIN_EMAILS` di `comments.ts`), bukan cuma disembunyiin di tampilan — jadi aman dari orang yang coba akalin dari luar
- Belum ada tombol "cabut blokir" di tampilan (API-nya udah ada, `POST /api/comments/unban/:userId`, cuma belum ada tombolnya di UI)

## Status: login & komentar

✅ Udah dikonfirmasi jalan normal di situs live (login Google, kirim komentar, tampil dengan nama & foto profil).

## Bug yang sempat ditemuin & cara benerinnya

- **Lightbox ketutup navbar / tombol X ilang pas di-scroll** — penyebabnya: `PageWrapper` (pembungkus Lenis buat smooth-scroll) kemungkinan punya CSS `transform`, dan itu bikin elemen `fixed` di dalamnya nggak beneran nempel ke layar. Solusinya: lightbox di-"portal"-kan pakai `createPortal` dari React, jadi dia dirender langsung ke `document.body`, keluar dari pembungkus Lenis.
- **2 scrollbar pas lightbox kebuka** — dibenerin dengan matiin scroll halaman belakang (`document.body.style.overflow = "hidden"`) selama lightbox terbuka.
- **Scroll di dalam lightbox nggak jalan** — Lenis "mencegat" semua gerakan scroll di halaman. Dibenerin dengan kasih atribut `data-lenis-prevent` di div yang bisa di-scroll.
- **Build gagal di Netlify (Vite versi nggak didukung)** — sempat nggak sengaja ke-upgrade ke Vite 8 lewat `npm audit fix --force`. Diturunin lagi ke Vite 7.
- **Build gagal (TypeScript error di GalleryComments)** — `netlify-identity-widget` nggak ada tipe data bawaan + ada parameter implicit `any`. Dibenerin dengan install `@types/netlify-identity-widget` + kasih tipe eksplisit di parameter.
- **SQL console Netlify Database selalu "read-only mode"** — nggak ketemu cara matiinnya (udah coba centang "izinkan akses penuh" di Kontrol Akses, tetap read-only). Solusi akhirnya: nggak pakai SQL console sama sekali, pindah ke sistem migration resmi (lihat "Setup yang udah selesai" di atas).
- **Pop-up login Netlify Identity ketutup lightbox** — iframe pop-up-nya defaultnya kekunci di belakang elemen `fixed` lain kalau z-index-nya lebih rendah. Dibenerin dengan CSS `iframe[title="Netlify identity widget" i] { z-index: 2147483647 !important; }` (perhatiin huruf besar/kecil di `title`, harus sama persis + tanda `i` di akhir biar nggak sensitif huruf besar/kecil).
- **Komentar nggak kesimpen walau udah login (401)** — `context.clientContext.user` ternyata nggak konsisten kepopulasi di Netlify Function versi baru (`export default` style). Solusinya: verifikasi token dilakuin manual dengan fetch ke `/.netlify/identity/user` pakai header Authorization yang sama, bukan mengandalkan `context.clientContext`.
