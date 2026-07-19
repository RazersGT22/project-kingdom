# Catatan Lanjutan (Bagian 2)

Ini lanjutan dari `catatan.md` — sengaja dipisah biar `catatan.md` yang lama nggak diutak-atik. Baca `catatan.md` dulu buat konteks awal (setup Identity, Database, dsb), ini isinya perkembangan setelah itu.

## 1. Pagination galeri

- Galeri sekarang dibagi per halaman, **9 foto per halaman** (3 baris x 3 kolom)
- Tombol "Sebelumnya" / nomor halaman / "Selanjutnya" muncul otomatis **cuma kalau foto lebih dari 9** — kalau masih sedikit, tampilannya sama kayak biasa tanpa tombol halaman
- Ganti kategori filter otomatis balik ke halaman 1

## 2. Panel "Kelola Blokir" (admin)

- Sebelumnya, tombol blokir/buka-blokir nempel di komentar — masalahnya kalau komentarnya dihapus, nggak ada lagi cara buka blokirnya
- Sekarang ada tombol **"Kelola Blokir"** di pojok kanan atas bagian Komentar (cuma keliatan buat admin). Diklik, muncul daftar **semua** akun yang diblokir di seluruh galeri (bukan cuma di 1 foto), dengan tombol "Buka Blokir" masing-masing — nggak peduli komentarnya masih ada atau udah dihapus

## 3. Notifikasi email tiap ada komentar baru

- Pakai **Resend** (resend.com) buat kirim email — akun dibikin pakai email `razergt44@gmail.com`
- API key disimpen di environment variable Netlify: `RESEND_API_KEY`
- Tiap ada komentar baru masuk (termasuk balasan), otomatis kirim email ke `razergt44@gmail.com` isinya: nama pengomentar, isi komentar, foto mana yang dikomentari
- Kalau pengiriman email gagal karena suatu hal, komentar tetap kesimpen normal (nggak saling ganggu)
- Udah dites & konfirmasi jalan ✅

## 4. Soal keamanan akun Google pemain (ringkasan penjelasan ke user)

- Situs nggak pernah lihat/nyimpen password Google siapapun — proses login 100% kejadian di server Google
- Izin yang diminta cuma dasar: nama, email, foto profil — bukan akses ke Gmail/Drive/dll
- Yang kesimpen di database cuma nama, foto profil, isi komentar — **email nggak ikut kesimpen**
- Orang bisa cabut izin kapan aja lewat `myaccount.google.com/permissions`
- 1 catatan: karena pakai konfigurasi default (bukan bikin Google Cloud Console sendiri), layar konfirmasi login nunjukin "Netlify Identity" sebagai peminta izin, bukan nama "RZ Survival" — ini soal tampilan doang, bukan soal keamanan

## 5. Fitur baru (SEDANG DIBANGUN, belum di-deploy): orang lain bisa upload galeri sendiri

Progress terakhir sebelum sesi ini berhenti — **belum ditest/dideploy**, lanjutkan dari sini:

**Konsep:** siapa aja yang login bisa upload foto + judul + kategori + deskripsi + cerita lewat form di situs. Foto yang diupload **wajib di-ACC admin dulu** sebelum tayang di galeri publik (bukan langsung otomatis tayang).

**File yang udah dibikin (belum ditimpa ke project asli):**
- `netlify/database/migrations/0003_gallery_submissions/migration.sql` — tabel `gallery_submissions` (title, category, desc_text, lore, image_key, user_id, user_name, status: pending/approved/rejected)
- `netlify/functions/gallery-submissions.ts` — API: upload (POST), lihat yang approved (GET, publik) / pending (GET, admin only), approve/reject (POST, admin only)
- `netlify/functions/gallery-image.ts` — nampilin foto yang disimpen di **Netlify Blobs** (bukan di folder biasa, soalnya foto upload-an user nggak lewat git)
- `src/components/sections/Gallery/GalleryUpload.tsx` — komponen baru: form upload (buat semua yang login) + panel "Tinjau Pengajuan" (khusus admin, approve/tolak)
- `src/components/sections/Gallery/Gallery.tsx` — diupdate biar gabungin foto bawaan (dari `galleryCopy.ts`) + foto upload-an yang udah di-ACC, dan nambah tombol "📤 Upload Galeri Kamu"

**Yang MASIH PERLU dikerjain sebelum ini bisa dipakai:**
1. Install dependency baru: `npm install @netlify/blobs`
2. Timpa/tambah 5 file di atas ke project asli
3. `npm run build` buat cek dulu
4. Commit & push (migration `0003` bakal otomatis jalan pas deploy)
5. **Tes:** login, coba upload foto lewat tombol baru, cek muncul di panel "Tinjau Pengajuan" pas login admin, coba approve, cek muncul di galeri publik

**Batasan yang perlu diinget:** ukuran foto dibatasi maksimal 5MB per upload (dicek di server).
