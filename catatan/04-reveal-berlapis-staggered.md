# Catatan: Reveal Berlapis (Staggered)

Lanjutan dari `catatan/03-visual-polish-font-reveal-parallax.md`. Kalau `useScrollReveal`
di catatan 03 itu bikin 1 section muncul sebagai **1 blok utuh** (semua elemen zoom+fade
bareng), yang ini beda: elemen di dalam section muncul **bergantian satu-satu**, ngasih
kesan lebih "bercerita"/cinematic.

## Kenapa dibikin terpisah dari `useScrollReveal` (bukan diganti langsung)

Section yang cuma punya 1-2 elemen (misal CTA sederhana) nggak butuh staggering — malah
bisa kelihatan aneh kalau dipaksa. Jadi 2 hook ini sengaja dipisah, dipilih sesuai
kebutuhan tiap section:
- `useScrollReveal(ref)` — reveal 1 blok utuh, buat section simpel
- `useStaggerReveal(ref)` — reveal berlapis, buat section dengan banyak elemen anak (judul + gambar + list + tombol, dst)

## Cara kerja

`useStaggerReveal` cari semua elemen yang punya atribut `data-reveal` **di dalam** section
(pakai `querySelectorAll`), terus animasikan bareng-bareng lewat 1 GSAP timeline dengan
`stagger: 0.12` (jeda 0.12 detik antar elemen, urutannya ngikutin urutan elemen di HTML/DOM,
dari atas ke bawah).

**Cara pakai di komponen section:**
1. Ganti `useScrollReveal(ref)` jadi `useStaggerReveal(ref)`
2. Tambahin atribut `data-reveal` di tiap elemen/wrapper yang mau reveal sendiri-sendiri

Contoh (disederhanakan):
```tsx
<div data-reveal><SectionHeading ... /></div>
<div data-reveal>{/* gambar */}</div>
<p data-reveal>{/* paragraf */}</p>
{items.map((item) => (
  <li data-reveal key={item.id}>{/* tiap item fitur reveal sendiri2 */}</li>
))}
<div data-reveal>{/* tombol CTA */}</div>
```

## Status penerapan

**Sudah diterapkan:** Castle (7 elemen: judul, gambar, paragraf, 3 fitur, CTA)

**Belum diterapkan (masih pakai `useScrollReveal` versi lama):** Village, Marketplace,
Economy, Jobs, Dungeon, Boss, Gallery — sengaja belum disebar, nunggu user cek dulu hasil
di Castle sebelum diterapkan ke section lain. Kalau user setuju, tinggal ulangi pola yang
sama: ganti import & pemanggilan hook, tambah `data-reveal` di elemen-elemen anak yang mau
di-stagger.

## Catatan teknis

- Parallax (`useParallax`) di Castle **tidak berubah**, tetap jalan bareng staggered reveal — dua-duanya independen, nggak saling ganggu
- Angka `duration: 0.9` dan `stagger: 0.12` di hook ini belum sempat dikalibrasi ulang kayak reveal blok tunggal dulu (yang sempat dicoba 3 versi: subtle → ekstrem → final). Kalau nanti user rasa kurang/kelebihan, tinggal adjust 2 angka ini
