import { useEffect, useState, useRef } from "react";
import { gsap } from "@/lib";
import { useSoundEffects } from "@/hooks";

// Loading screen — portcullis (gerbang) kastil naik ke atas sebelum masuk halaman.
// Ditampilkan sekali per sesi (sessionStorage).
export function LoadingScreen() {
  const [visible, setVisible] = useState(() => {
    return !sessionStorage.getItem("rz-loaded");
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");
  const { playGateOpenSFX } = useSoundEffects();

  useEffect(() => {
    if (!visible) return;

    // Brief pause then auto-animate gate open
    const timer = setTimeout(() => {
      setPhase("opening");
    }, 1200);

    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (phase !== "opening") return;

    // Play procedural gate sound
    playGateOpenSFX();

    const overlay = overlayRef.current;
    const gate = gateRef.current;
    const content = contentRef.current;
    if (!overlay || !gate || !content) return;

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("rz-loaded", "1");
        setVisible(false);
        setPhase("done");
      },
    });

    // 1. Fade out the title text
    tl.to(content, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" });

    // 2. Gate bars slide upward
    tl.to(gate, { y: "-110%", duration: 1.2, ease: "power3.in" }, "-=0.1");

    // 3. Full overlay fade out
    tl.to(overlay, { opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");
  }, [phase]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      id="loading-screen"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0808 0%, #0B0B0F 50%, #0a0808 100%)" }}
      aria-live="polite"
      aria-label="Memuat Project Kingdom"
    >
      {/* Stone texture vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Corner ornaments */}
      {[
        "top-4 left-4",
        "top-4 right-4 rotate-90",
        "bottom-4 left-4 -rotate-90",
        "bottom-4 right-4 rotate-180",
      ].map((pos, i) => (
        <div key={i} aria-hidden="true" className={`absolute ${pos} w-12 h-12`}>
          <svg viewBox="0 0 48 48" fill="none" className="text-ember-gold/30 w-full h-full">
            <path d="M4 4 L4 20 M4 4 L20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="4" cy="4" r="2" fill="currentColor" />
          </svg>
        </div>
      ))}

      {/* Portcullis Gate SVG */}
      <svg
        ref={gateRef}
        aria-hidden="true"
        viewBox="0 0 400 600"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl pointer-events-none"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Top arch of gate */}
        <path
          d="M0 300 Q0 0 200 0 Q400 0 400 300 L400 600 L0 600 Z"
          fill="#1a1209"
          stroke="#C9A227"
          strokeWidth="2"
          opacity="0.95"
        />
        {/* Vertical bars */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
          <rect key={x} x={x - 8} y="0" width="16" height="600" fill="#0d0c0a" stroke="#C9A227" strokeWidth="1" opacity="0.9" rx="2" />
        ))}
        {/* Horizontal bars */}
        {[80, 180, 280, 380, 480].map((y) => (
          <rect key={y} x="0" y={y - 8} width="400" height="16" fill="#0d0c0a" stroke="#C9A227" strokeWidth="1" opacity="0.9" rx="2" />
        ))}
        {/* Spike tips at top */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
          <polygon key={x} points={`${x - 8},0 ${x + 8},0 ${x},${-20}`} fill="#C9A227" opacity="0.8" />
        ))}
        {/* Inner glow */}
        <path
          d="M30 290 Q30 40 200 40 Q370 40 370 290 L370 600 L30 600 Z"
          fill="none"
          stroke="#C9A227"
          strokeWidth="1"
          opacity="0.15"
        />
      </svg>

      {/* Loading content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-8"
      >
        {/* Crest */}
        <svg viewBox="0 0 80 80" width="80" height="80" fill="none" className="mb-6 text-ember-gold">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeDasharray="4 3" />
          <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
          <polygon points="40,14 48,34 68,34 52,46 58,66 40,54 22,66 28,46 12,34 32,34" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
          <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.5" />
        </svg>

        <h1 className="font-heading text-4xl md:text-5xl text-gradient-gold mb-3 tracking-wide">
          RZ Survival
        </h1>
        <p className="font-body text-parchment-white/50 text-sm uppercase tracking-[0.3em] mb-8">
          Project Kingdom
        </p>

        {/* Loading dots */}
        <div className="flex gap-2" aria-label="Memuat…">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-ember-gold/60 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Skip / Enter button */}
      <button
        id="loading-skip"
        onClick={() => {
          if (phase === "idle") setPhase("opening");
        }}
        className="absolute bottom-8 text-xs uppercase tracking-widest text-parchment-white/30 hover:text-parchment-white/60 transition-colors"
      >
        Lewati →
      </button>
    </div>
  );
}
