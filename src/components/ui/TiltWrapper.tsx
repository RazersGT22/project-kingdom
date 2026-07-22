import { useRef, useState, type HTMLAttributes, type ReactNode } from "react";

type TiltWrapperProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  maxTilt?: number; // derajat rotasi maksimal, default 8
};

// RENCANA.md Tahap 2 poin 5 — hover tilt 3D di card (Village/Marketplace/Gallery).
// Bukan diterapkan ke komponen Card bersama (src/components/ui/Card.tsx) supaya
// section lain yang juga pakai Card (mis. Jobs) TIDAK ikut kena efek ini —
// dibungkus manual cuma di 3 tempat yang diminta.
//
// PENTING — struktur 2 DIV bersarang (bukan 1 div doang):
// Div LUAR nerima semua props dari pemanggil apa adanya (data-reveal, className,
// style buat animationDelay, dst) — TiltWrapper SAMA SEKALI nggak nyentuh
// transform-nya. Div DALAM (baru, nggak ada dari caller) yang punya ref +
// listener mouse + transform tilt-nya sendiri.
// Alasannya: animasi "muncul berlapis" (baik GSAP data-reveal maupun CSS
// animate-card-in di Gallery) SAMA-SAMA ngatur properti `transform` buat efek
// masuknya. Kalau tilt-nya ditaruh di elemen YANG SAMA, dua mekanisme itu bakal
// rebutan nulis `transform` ke elemen yang sama dan saling tabrakan (salah satu
// animasinya bisa nggak jalan/rusak). Dengan dipisah ke elemen yang beda,
// masing-masing bebas ngatur transform-nya sendiri tanpa saling ganggu — efeknya
// tetap ke-compose visual dengan benar (entrance dari luar + tilt dari dalam).
//
// Cuma aktif buat device dengan mouse asli (pointer: fine), sama kayak pola
// magnetic cursor di Button.tsx — otomatis nggak aktif di HP/tablet (layar
// sentuh, nggak ada konsep "posisi kursor").
export function TiltWrapper({ children, maxTilt = 8, ...outerProps }: TiltWrapperProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const hasRealMouse =
      typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches;
    const el = innerRef.current;
    if (hasRealMouse && el) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1 dari kiri ke kanan
      const py = (e.clientY - rect.top) / rect.height; // 0..1 dari atas ke bawah
      setTilt({
        rotateY: (px - 0.5) * maxTilt * 2, // kursor di kanan → miring ke kanan
        rotateX: (0.5 - py) * maxTilt * 2, // kursor di atas → miring ke atas
      });
    }
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <div {...outerProps}>
      <div
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: "transform 0.25s cubic-bezier(0.33, 1, 0.68, 1)",
          willChange: "transform",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
