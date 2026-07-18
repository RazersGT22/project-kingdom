import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib";

// Implementation Guide Bagian 7 — pola reveal-on-scroll per section.
// Animasi terbatas pada transform & opacity (GPU-friendly), sesuai Tech Bible Bab 5.
// Detail easing/durasi final masih TODO — menunggu Experience Design Bible.
export function useScrollReveal<T extends HTMLElement>(ref: RefObject<T>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
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
