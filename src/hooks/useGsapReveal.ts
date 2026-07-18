import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib";

// Dipakai di Opening — reveal elemen-elemen hero secara berurutan (stagger).
// Berjalan sekali saat mount, tidak bergantung scroll.
export function useGsapReveal<T extends HTMLElement>(ref: RefObject<T>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const children = el.querySelectorAll("[data-reveal]");
      gsap.fromTo(
        children,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          delay,
        },
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [ref, delay]);
}
