import Lenis from "lenis";

// Tech Bible Bab 4 — Lenis dipasang di level root, bukan per section.
export function createLenis(): Lenis {
  return new Lenis({
    autoRaf: false, // raf di-drive manual lewat useLenisScroll agar sinkron dengan GSAP ticker
  });
}
