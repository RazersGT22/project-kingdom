import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib";
import { prefersReducedMotion } from "@/utils";

// Reveal berlapis (staggered) — elemen dengan atribut data-reveal di dalam section
// muncul bergantian (bukan 1 blok utuh sekaligus), memberi kesan lebih "bercerita"/cinematic.
// Urutan reveal mengikuti urutan elemen di DOM (atas ke bawah / kiri ke kanan).
// RENCANA.md Tahap 3 (Aksesibilitas) — kalau user udah nyalain "Kurangi Gerakan"
// (prefers-reduced-motion), animasi geser/scale-nya di-skip; elemen langsung
// ditampilkan penuh (opacity 1) tanpa gerakan, kontennya tetap sama tapi tanpa
// motion yang berpotensi bikin nggak nyaman.
export function useStaggerReveal<T extends HTMLElement>(ref: RefObject<T>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
        return;
      }

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
