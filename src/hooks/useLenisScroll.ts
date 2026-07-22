import { useEffect, useRef } from "react";
import { createLenis, gsap, ScrollTrigger } from "@/lib";
import type Lenis from "lenis";

// Instance Lenis disimpan di level MODUL (bukan cuma di dalam hook), supaya
// komponen lain (mis. tombol pagination di Gallery) bisa manggil scroll yang
// SINKRON sama Lenis lewat scrollToWithLenis() di bawah — bukan native
// `window.scrollTo`/`scrollIntoView` biasa yang gerakannya bisa "dilawan"
// balik sama loop animasi RAF milik Lenis di frame berikutnya (bikin scroll
// jadi patah-patah/gagal).
let activeLenisInstance: Lenis | null = null;

/**
 * Scroll halus ke posisi/elemen tertentu, lewat Lenis kalau instance-nya lagi
 * aktif (biar smooth & nggak konflik), atau fallback ke scroll native browser
 * kalau Lenis belum/nggak aktif (mis. dipanggil sebelum mount selesai).
 */
export function scrollToWithLenis(target: number | HTMLElement, offset = 0) {
  if (activeLenisInstance) {
    activeLenisInstance.scrollTo(target, { offset });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

// Hook Lenis scroll yang disinkronkan dengan GSAP ticker dan rute halaman.
// Menjamin scroll dinormalisasi dan di-refresh setiap kali tinggi halaman berubah (ganti rute).
export function useLenisScroll(route?: string) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = createLenis();
    lenisRef.current = lenis;
    activeLenisInstance = lenis;

    // Integrasi resmi Lenis + ScrollTrigger: setiap tick scroll Lenis, beri tahu
    // ScrollTrigger agar animasi scrub (mis. parallax) update presisi per-frame,
    // bukan menunggu native scroll event browser yang bisa telat/tidak mulus.
    lenis.on("scroll", ScrollTrigger.update);

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
      activeLenisInstance = null;
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
