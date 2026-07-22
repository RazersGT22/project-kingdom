import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib";

// Parallax depth — dipakai pada layer background section (bukan konten utama).
// Background bergerak lebih lambat dari scroll asli, menciptakan kesan kedalaman/3D.
// Hanya pakai transform (GPU-friendly), scrub mengikuti posisi scroll secara langsung (bukan sekali jalan).
export function useParallax<T extends HTMLElement>(
  ref: RefObject<T>,
  speed = 0.3,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [ref, speed]);
}
