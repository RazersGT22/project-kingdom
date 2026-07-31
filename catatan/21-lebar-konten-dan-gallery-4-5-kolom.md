# Catatan: Lebar Konten Dilebarin + Gallery Tingkat 4-5 Kolom

Lanjutan dari `catatan/20-review-konten-fix-bold-istilah-faq-dobel.md`. Ini
request langsung dari user (di luar checklist Tahap 3), dipicu karena
website terasa kebanyakan spasi kosong kiri-kanan pas dibuka di monitor 27"
(1920×1080).

## Diagnosa lebar konten

```bash
grep -rn "max-w-" src/components/sections/*/[A-Z]*.tsx | grep -oP "max-w-\w+" | sort | uniq -c | sort -rn
```

Ketemu `max-w-6xl` (1152px di Tailwind default scale) dipakai **10 kali**,
semua persis pola yang sama: `<div className="relative z-10 max-w-6xl mx-auto w-full">`.
Ini wrapper utama section-section: Boss, Castle, Dungeon, Economy, Gallery,
Jobs, Marketplace, PathSelect, Trailer, Village.

Di monitor 1920px lebar, konten yang di-cap di 1152px otomatis nyisain
~(1920-1152)/2 = 384px kosong di KIRI dan KANAN masing-masing — total 768px
kosong dari 1920px (40% layar nggak kepake).

## Kenapa nggak semua section disamain lebarnya

3 section (`Faq`, `JoinServer`, `Opening`) pakai wrapper yang LEBIH SEMPIT
dengan sengaja (`max-w-4xl`=896px, `max-w-5xl`=1024px) — ini section yang
kontennya berpusat di tengah (hero text besar, search bar + list FAQ, IP
server + tombol), bukan grid yang butuh ruang horizontal lebar. Melebarkan
wrapper section semacam ini malah bisa bikin kesannya "kosong di tengah"
kalau nggak ada cukup konten buat ngisi ruang selebar itu — beda kasusnya
sama section yang emang punya grid kartu/foto yang natural makin lebar makin
kepake baik (Village 3 kartu, Marketplace 3 kartu, Gallery grid foto, dst).

Jadi ini BUKAN kelupaan, tapi keputusan sengaja mempertahankan lebar yang
lebih sempit di 3 section itu.

## Angka yang dipilih: 1152px → 1400px

Tailwind nggak punya kelas siap pakai antara `max-w-6xl` (1152px) dan
`max-w-7xl` (1280px) yang cukup jauh bedanya dari kebutuhan (~22% lebih
lebar terasa pas, nggak sampai terlalu ekstrem sampai bikin baris teks jadi
kepanjangan buat dibaca kalau ada section yang isinya paragraf panjang).
Dipakai custom arbitrary value Tailwind: `max-w-[1400px]`.

## Kenapa Footer juga ikut diubah

`Footer.tsx` pakai `max-w-6xl` juga (2 tempat, buat 2 baris konten footer).
Kalau nggak ikut disamain, footer bakal kelihatan "lebih sempit" dari
section-section di atasnya (nggak sejajar tepi kiri-kanannya) — keliatan
kayak salah pasang. Disamain jadi `max-w-[1400px]` juga.

## Navbar tidak disentuh

Navbar (`<header className="fixed top-0 left-0 right-0 ...">`) sudah
full-width dari desainnya (nggak pakai max-width constraint apapun,
`left-0 right-0` bikin dia selalu selebar viewport penuh) — nggak ada yang
perlu diubah di sini.

## Gallery — nambah 2 tingkat kolom baru

Sistem "kolom responsif" ini sebenarnya udah ada dari v16 (10/20/30 foto per
halaman berdasar 1/2/3 kolom). Di langkah ini cuma nambah 2 tingkat lagi di
ATAS yang udah ada, breakpoint-nya ngikutin standar Tailwind (`xl`=1280px,
`2xl`=1536px):

```ts
function getColumnsForWidth(width: number): number {
  if (width >= 1536) return 5; // breakpoint 2xl — BARU
  if (width >= 1280) return 4; // breakpoint xl — BARU
  if (width >= 1024) return 3; // breakpoint lg
  if (width >= 640) return 2; // breakpoint sm
  return 1; // mobile
}
```

```tsx
// className grid — HARUS SINKRON manual sama fungsi di atas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
```

**Penting dicatat buat sesi berikutnya:** breakpoint di `getColumnsForWidth()`
(logic JS, buat ngitung berapa item per halaman) dan className grid (CSS,
buat nentuin berapa kolom yang BENERAN dirender) itu **2 tempat terpisah yang
harus selalu disinkronkan manual**. Kalau salah satu diubah tanpa ubah yang
lain, jumlah "foto per halaman" yang dihitung bakal nggak cocok sama jumlah
kolom yang beneran ditampilin di layar (misal ngitung 5 kolom tapi CSS-nya
cuma render 3 kolom — hasilnya grid keliatan aneh, ada baris yang cuma keisi
sebagian).

## Kenapa monitor user (1920×1080) masuk ke tingkat 5 kolom, bukan 4

Breakpoint `2xl` di Tailwind = `min-width: 1536px`. Viewport 1920px LEBIH
BESAR dari 1536px, jadi otomatis kena breakpoint `2xl` (5 kolom), BUKAN `xl`
(1280-1535px, 4 kolom). Tingkat 4 kolom ini buat layar yang lebih kecil dari
1920 tapi masih lebih besar dari laptop biasa — misal laptop 14-15 inch
dengan resolusi scaled ~1280-1535px efektif, atau monitor yang di-split
jadi 2 window bersebelahan.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual

1. Buka di monitor lebar (1920px+, atau maximize browser window kalau di
   monitor lebar), bandingkan lebar konten section sekarang vs sebelumnya —
   harusnya kerasa lebih lebar, spasi kosong kiri-kanan berkurang
2. Buka Gallery, cek grid foto — di layar 1920px+ harusnya 5 foto per baris.
   **Catatan:** karena stok foto sekarang cuma 13 (dari v22), di layar lebar
   (target 50/halaman) otomatis cuma 1 halaman — belum kelihatan efek
   pagination-nya sampai foto ditambah lebih dari 50 ke depannya
3. Coba resize/persempit browser window dari lebar ke sempit, perhatikan
   jumlah kolom grid Gallery berubah bertahap: 5 → 4 → 3 → 2 → 1

File yang diubah:
`src/components/sections/{Boss,Castle,Dungeon,Economy,Gallery,Jobs,Marketplace,PathSelect,Trailer,Village}/*.tsx`,
`src/components/layout/Footer.tsx`.
