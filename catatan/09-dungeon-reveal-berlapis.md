# Catatan: Reveal Berlapis di Dungeon

Lanjutan dari `catatan/08-jobs-reveal-berlapis-dan-fix-overflow.md`. Langkah
kelima dari 7 di Tahap 1 `RENCANA.md`. Tidak ada fix overflow di langkah ini
(Dungeon tidak masuk daftar).

## Kompleksitas khusus: Dungeon punya tab interaktif

Beda dari section-section sebelumnya, Dungeon punya `useState` (`selectedId`)
buat nentuin dungeon mana yang lagi ditampilkan di panel kanan. User bisa klik
salah satu dari 3 tombol "Pilih Wilayah" (kiri) buat ganti isi panel detail
(kanan) — nama, deskripsi, list monster, list reward, semuanya ganti sesuai
dungeon yang dipilih.

## Kenapa panel kanan ditandai 1 blok `data-reveal`, bukan dipecah ke tiap monster/reward

Awalnya kepikiran buat dipecah granular kayak section lain (tiap monster/reward
dapet `data-reveal` sendiri-sendiri, biar reveal-nya lebih detail). Tapi ini
berisiko karena cara kerja `useStaggerReveal`:

```ts
// useStaggerReveal.ts — dijalankan SEKALI saat komponen mount
const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
gsap.fromTo(targets, {...}, {...});
```

Hook ini nge-query elemen `data-reveal` cuma **sekali** pas mount (dependency
array cuma `[ref]`, dan `ref` objek nggak berubah identitasnya antar render).
GSAP nyimpen referensi ke elemen DOM spesifik yang ke-capture waktu itu.

Masalahnya, list monster & reward di-render pakai `.map()` dengan `key` dari
NAMA item (`key={mob}`, `key={rew}`). Nama-nama ini beda-beda tiap dungeon
(`Cave Spider` vs `Undead Guardian` vs `Fire Golem`, dst). Jadi kalau user klik
ganti tab dari "Forgotten Mines" ke "Crypt of the Ancestors":
- React lihat key lama (`Cave Spider`, `Skeleton Miner`, dst) sudah nggak ada
  di render baru
- React **unmount** elemen `<li>` lama, terus **mount** elemen `<li>` baru buat
  `Undead Guardian`, `Wraith`, dst — ini elemen DOM yang BENAR-BENAR baru, beda
  dari yang di-capture GSAP waktu mount pertama

Kalau elemen baru ini ditandai `data-reveal`, GSAP nggak akan pernah nge-animate
mereka (karena nggak ada di `targets` original) — dan kalau GSAP sempat set
`opacity: 0` di CSS/style sebelumnya buat elemen lama yang mirip (nggak akan,
tapi buat jaga-jaga), elemen baru bisa aja ketiban style yang salah. Paling aman:
**jangan taruh `data-reveal` di elemen yang bisa ke-unmount/mount ulang akibat
perubahan state.**

## Solusi yang dipakai

Container terluar panel kanan (`<div className="lg:col-span-8">`) TIDAK
ke-unmount saat ganti tab — dia tetap sama, cuma className (`activeDungeon.bg`)
dan konten teks di dalamnya yang berubah lewat reconciliation biasa (bukan
unmount/mount). Jadi `data-reveal` ditaruh di level ini saja, sebagai 1 blok:

```tsx
<div className="lg:col-span-8" data-reveal>
  <div className={`... bg-gradient-to-br ${activeDungeon.bg} ...`}>
    {/* semua isi panel: nama, desc, mob list, reward list, mode ekspedisi */}
  </div>
</div>
```

Efeknya: panel kanan reveal sebagai 1 kesatuan pas pertama kali scroll ke section
ini. Pas user klik ganti tab setelahnya, kontennya langsung ganti tanpa animasi
fade (karena reveal cuma sekali di awal, bukan tiap ganti tab) — ini behavior yang
wajar dan aman, bukan bug.

## Titik `data-reveal` lengkap (7 total)

1. Wrapper `SectionHeading`
2. Paragraf body
3. Label "Pilih Wilayah"
4. 3× tombol tab wilayah (key = `dun.id`, STABIL — tidak berubah walau
   `selectedId` berubah, jadi aman dipecah satu-satu tanpa risiko unmount)
5. Panel detail kanan (1 blok utuh, lihat penjelasan di atas)
6. Wrapper tombol CTA

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

**Penting buat user:** pas test manual, selain scroll biasa, tolong juga coba
**klik ganti tab** (Forgotten Mines → Crypt → Volcanic Citadel) buat mastiin
interaksinya tetap mulus dan nggak ada elemen yang hilang/aneh pas ganti konten.

## Status checklist `RENCANA.md` Tahap 1

- [x] Village, Marketplace, Economy, Jobs
- [x] Dungeon — **selesai, menunggu user test (scroll + klik ganti tab) sebelum
      lanjut ke Boss**
- [ ] Boss, Gallery — belum

File yang diubah di langkah ini: `src/components/sections/Dungeon/Dungeon.tsx`.
