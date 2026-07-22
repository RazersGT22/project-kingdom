import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib";

// Reveal berlapis (staggered) — elemen dengan atribut data-reveal di dalam section
// muncul bergantian (bukan 1 blok utuh sekaligus), memberi kesan lebih "bercerita"/cinematic.
// Urutan reveal mengikuti urutan elemen di DOM (atas ke bawah / kiri ke kanan).
export function useStaggerReveal<T extends HTMLElement>(ref: RefObject<T>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
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
