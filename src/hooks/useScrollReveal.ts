import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib";

// Implementation Guide Bagian 7 — pola reveal-on-scroll per section.
// Animasi terbatas pada transform & opacity (GPU-friendly), sesuai Tech Bible Bab 5.
// Reveal "berat" ala cinematic: scale-up + rise + fade, easing power4 (lebih dramatis dari power2).
export function useScrollReveal<T extends HTMLElement>(ref: RefObject<T>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 100, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [ref]);
}

export { ScrollTrigger };
