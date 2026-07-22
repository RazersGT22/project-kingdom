# Catatan: Hover Tilt 3D (TiltWrapper) + Fix Konflik Transform

Poin terakhir Tahap 2 (RENCANA.md), sekaligus penutup seluruh Tahap 2. Ini juga
contoh kasus di mana masalah teknis ketemu & diperbaiki SENDIRI pas review kode,
sebelum sempat dikirim ke user buat testing — dicatat detail di sini biar kalau
ada pola serupa lagi di masa depan, bisa langsung kenal gejalanya.

## Kenapa nggak ditaruh di komponen `Card` bersama

`Card.tsx` dipakai di banyak section: Village, Marketplace, **Jobs**, dan
lain-lain. RENCANA.md eksplisit nyebut cuma 3 tempat yang perlu tilt: Village,
Marketplace, Gallery — TIDAK termasuk Jobs. Kalau efek ditaruh langsung di
`Card.tsx`, otomatis semua section yang pakai `Card` ikut kena, termasuk Jobs
yang nggak diminta. Makanya dibikin komponen terpisah (`TiltWrapper`) yang
dibungkus manual cuma di section yang diminta.

## Bug yang ketemu & diperbaiki: rebutan properti `transform`

### Gejala yang HAMPIR kejadian (ketauan sebelum dikirim)

Desain awal `TiltWrapper` cuma 1 `<div>` — ref, listener mouse, DAN transform
tilt semua di elemen yang sama:

```tsx
// DESAIN AWAL (SALAH, sempat dibuat lalu diperbaiki sebelum dikirim)
<div
  ref={ref}
  onMouseMove={...}
  style={{ transform: `perspective(...) rotateX(...) rotateY(...)`, ...style }}
  {...rest} // <-- data-reveal / className / style animationDelay dari caller ikut masuk sini
>
```

Dipakai gini di Village.tsx:
```tsx
<TiltWrapper key={feat.title} data-reveal>
  <Card>...</Card>
</TiltWrapper>
```

Masalahnya: `data-reveal` bikin `useStaggerReveal` (GSAP) nge-`querySelectorAll`
elemen ini dan APPLY `gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0
})` — GSAP nulis properti `transform` (buat `y: 40 → 0`) ke elemen ini. Tapi
elemen yang SAMA PERSIS juga punya `style.transform` yang di-set React tiap kali
`tilt` state berubah (dari `perspective(800px) rotateX() rotateY()`, default
`rotateX(0) rotateY(0)` sebelum di-hover).

Dua mekanisme berbeda (GSAP inline-style manipulation vs React inline-style
re-render) SAMA-SAMA nulis ke `element.style.transform` di elemen yang PERSIS
SAMA. Ini rawan race/override — siapa yang nulis terakhir "menang", dan karena
React re-render bisa kejadian kapan aja (termasuk pas GSAP lagi di tengah
animasi entrance), efeknya bisa: animasi entrance keputus di tengah jalan,
kartu nggak sempat translateY(0) sepenuhnya, atau reset kepaksa balik ke posisi
awal animasi.

Kasus yang sama juga bakal kejadian di Gallery, tapi mekanismenya beda dikit:
`animate-card-in` (CSS `@keyframes` yang animate `transform: translateY(24px) →
translateY(0)`) ditaruh di elemen yang SAMA kayak `TiltWrapper` punya
`style.transform` tilt. CSS animation vs inline style yang di-set React,
keduanya berebut kontrol atas `transform` di elemen yang sama — potensi konflik
serupa, cuma beda mekanisme (CSS animation vs GSAP).

### Fix: pisah jadi 2 div bersarang

```tsx
// SESUDAH — TiltWrapper.tsx
export function TiltWrapper({ children, maxTilt = 8, ...outerProps }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  ...
  return (
    <div {...outerProps}>              {/* LUAR: data-reveal/className/style dari caller, TIDAK disentuh TiltWrapper */}
      <div
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`, ... }}
      >
        {children}                      {/* DALAM: transform tilt SENDIRI, elemen BEDA dari yang di atas */}
      </div>
    </div>
  );
}
```

Sekarang ada 2 elemen DOM terpisah:
- **Div luar** — nerima `data-reveal` (Village/Marketplace) atau
  `className="animate-card-in" style={{animationDelay}}` (Gallery) apa adanya.
  `TiltWrapper` SAMA SEKALI nggak nyentuh `transform` elemen ini — jadi GSAP
  atau CSS animation bebas ngatur `transform`-nya sendiri tanpa gangguan
- **Div dalam** — elemen BARU (nggak ada campur tangan dari caller), khusus
  buat tilt. Transform di sini independen, nggak akan pernah ketiban animasi
  reveal apapun karena elemen ini nggak pernah ditandai `data-reveal` atau
  `animate-card-in`

Karena keduanya elemen DOM yang beda (nested), transform masing-masing tetap
ke-compose visual dengan benar — dari luar keliatan kayak 1 kesatuan efek
(entrance dari luar + tilt dari dalam), padahal teknisnya dikontrol 2 mekanisme
independen di 2 elemen berbeda.

## Kenapa ini penting dicatat

Prinsip umumnya: **kalau mau nambahin efek visual baru yang manipulasi
`transform` (atau properti CSS apapun) ke elemen yang SUDAH punya animasi lain
yang juga manipulasi properti yang SAMA, JANGAN taruh di elemen yang sama** —
pisahkan ke elemen anak/turunan baru. Ini pola yang bakal kepake lagi kalau
nanti ada permintaan efek visual serupa (misal parallax tambahan, shake effect,
dll) di elemen yang udah punya animasi entrance.

## Penerapan di 3 section

### Village.tsx & Marketplace.tsx
Pola sama: `data-reveal` dipindah dari `<Card>` ke `<TiltWrapper>` (outer),
`<Card>` sendiri nggak lagi punya `data-reveal` (biar nggak dobel-reveal di 2
elemen bersarang untuk 1 kartu yang sama).

```tsx
<TiltWrapper key={feat.title} data-reveal>
  <Card className="...">...</Card>
</TiltWrapper>
```

### Gallery.tsx
Struktur agak beda karena kartu galeri bentuknya `<button>` (bukan langsung
`<Card>`). `TiltWrapper` membungkus SELURUH `<button>`:

```tsx
<TiltWrapper
  key={item.id}
  className="animate-card-in rounded-xl"
  style={{ animationDelay: `${Math.min(index, 8) * 150}ms` }}
>
  <button onClick={...} className="group ... w-full">
    <Card>...</Card>
  </button>
</TiltWrapper>
```

`animate-card-in` + `animationDelay` (dari v14/v15) dipindah dari `<button>` ke
`<TiltWrapper>` (outer) — button sendiri sekarang polos, cuma nambah `w-full`
biar tetap ngisi lebar penuh dari TiltWrapper.

## Hasil test di sandbox

- `tsc --noEmit` — bersih
- `npm run build` — sukses

## PENTING buat testing manual user

1. **Wajib pakai MOUSE** — efek ini nggak akan pernah muncul di HP/tablet
   (sengaja, karena `pointer: fine` check)
2. Gerakin kursor pelan-pelan di atas kartu Village/Marketplace/Gallery, kartu
   harus miring 3D dikit (bukan cuma scale/zoom), balik rata pas kursor keluar
3. **PALING PENTING:** pastikan animasi "muncul berlapis" pas scroll pertama
   kali ke section ini MASIH JALAN NORMAL — kartu-kartu masih muncul satu-satu
   kayak biasa, BUKAN langsung nongol semua atau kepotong di tengah animasi.
   Ini yang jadi concern utama karena potensi konflik `transform` yang baru aja
   diperbaiki

## Status Tahap 2 — SELESAI SEMUA (5/5)

1. Kalibrasi reveal — di-skip (belum ada yang perlu diubah)
2. Magnetic cursor (v17)
3. Grain/noise texture (v18, direvisi v18.1)
4. Progress indicator scroll — udah ada dari awal (v19)
5. Hover tilt di card (v20) — **INI**

File yang diubah/ditambah di langkah ini:
`src/components/ui/TiltWrapper.tsx` (baru),
`src/components/ui/index.ts`,
`src/components/sections/Village/Village.tsx`,
`src/components/sections/Marketplace/Marketplace.tsx`,
`src/components/sections/Gallery/Gallery.tsx`.
