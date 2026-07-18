import { useEffect, useRef } from "react";
import { createLenis, gsap, ScrollTrigger } from "@/lib";
import type Lenis from "lenis";

// Hook Lenis scroll yang disinkronkan dengan GSAP ticker dan rute halaman.
// Menjamin scroll dinormalisasi dan di-refresh setiap kali tinggi halaman berubah (ganti rute).
export function useLenisScroll(route?: string) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = createLenis();
    lenisRef.current = lenis;

    function onTick(time: number) {
      // time dikali 1000 karena Lenis mengharapkan milidetik
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Setiap kali rute berubah: reset scroll ke atas, resize Lenis, dan kalkulasi ulang ScrollTrigger GSAP
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Reset posisi scroll ke atas secara instan
    lenis.scrollTo(0, { immediate: true });

    // Berikan sedikit jeda agar React selesai melakukan render DOM halaman baru
    const timer = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 120);

    return () => clearTimeout(timer);
  }, [route]);
}
