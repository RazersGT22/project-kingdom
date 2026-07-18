import { useRef, useEffect } from "react";
import { openingCopy } from "@/data";
import { useGsapReveal } from "@/hooks";
import { gsap } from "@/lib";
import { Button } from "@/components/ui";
import { scrollToSection } from "@/utils";

export function Opening() {
  const ref = useRef<HTMLElement>(null);
  const runeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, 0.2);

  // Mouse parallax effect — glow & rune follow cursor subtly
  useEffect(() => {
    const section = ref.current;
    const rune = runeRef.current;
    const glow = glowRef.current;
    if (!section || !rune || !glow) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY, currentTarget } = e;
      const el = currentTarget as HTMLElement;
      const { left, top, width, height } = el.getBoundingClientRect();
      const xPct = (clientX - left) / width - 0.5; // -0.5 to 0.5
      const yPct = (clientY - top) / height - 0.5;

      gsap.to(rune, {
        x: xPct * 60,
        y: yPct * 40,
        rotation: xPct * 15,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.to(glow, {
        x: xPct * 120,
        y: yPct * 80,
        duration: 1.8,
        ease: "power2.out",
      });
    };

    section.addEventListener("mousemove", onMouseMove);
    return () => section.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section
      id="opening"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#12100e] via-obsidian-night to-obsidian-night"
      />

      {/* Parallax glow orb — follows mouse */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="h-[700px] w-[700px] rounded-full bg-ember-gold/10 blur-[100px]" />
      </div>

      {/* Spinning Rune Wheel — more visible, follows mouse */}
      <div
        ref={runeRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-[600px] h-[600px] text-ember-gold animate-spin-slow"
          fill="none"
          stroke="currentColor"
        >
          {/* Outer dashed ring */}
          <circle cx="100" cy="100" r="96" strokeWidth="0.4" strokeDasharray="6,4" opacity="0.25" />
          {/* Middle solid ring */}
          <circle cx="100" cy="100" r="78" strokeWidth="0.6" opacity="0.15" />
          {/* Inner ring */}
          <circle cx="100" cy="100" r="55" strokeWidth="0.5" strokeDasharray="3,6" opacity="0.20" />
          {/* Star of David / hex — upward triangle */}
          <polygon points="100,15 162,120 38,120" strokeWidth="0.7" opacity="0.20" fill="none"/>
          {/* Downward triangle */}
          <polygon points="100,185 38,80 162,80" strokeWidth="0.7" opacity="0.20" fill="none"/>
          {/* Center cross */}
          <line x1="100" y1="48" x2="100" y2="152" strokeWidth="0.5" opacity="0.12" />
          <line x1="48" y1="100" x2="152" y2="100" strokeWidth="0.5" opacity="0.12" />
          {/* Center dot */}
          <circle cx="100" cy="100" r="4" strokeWidth="1" opacity="0.30" />
          {/* Rune tick marks */}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 90 * Math.cos(rad);
            const y1 = 100 + 90 * Math.sin(rad);
            const x2 = 100 + 96 * Math.cos(rad);
            const y2 = 100 + 96 * Math.sin(rad);
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" opacity="0.30" />;
          })}
        </svg>
      </div>

      {/* Top border line */}
      <div
        aria-hidden="true"
        data-reveal
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember-gold/50 to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <p
          data-reveal
          className="mb-6 text-xs md:text-sm uppercase tracking-[0.3em] text-ember-gold/90 font-body"
        >
          RZ Survival · Medieval Experience
        </p>

        <h1
          data-reveal
          className="font-heading text-5xl md:text-7xl lg:text-8xl leading-tight text-gradient-gold mb-6"
        >
          {openingCopy.headline}
        </h1>

        <div
          data-reveal
          aria-hidden="true"
          className="mb-8 h-px w-24 bg-ember-gold/60"
        />

        <p
          data-reveal
          className="mb-12 max-w-2xl text-base md:text-xl text-parchment-white/70 leading-relaxed font-body"
        >
          {openingCopy.body}
        </p>

        <div
          data-reveal
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Button
            variant="primary"
            className="w-full sm:w-auto min-w-[180px] text-base py-4 hover-shimmer"
            onClick={() => scrollToSection("#path-select")}
          >
            {openingCopy.ctaLabel}
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-auto min-w-[180px] text-base py-4 hover-shimmer"
            onClick={() => scrollToSection("#castle")}
          >
            Jelajahi Kerajaan
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-reveal
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-label="Scroll ke bawah"
      >
        <span className="text-xs uppercase tracking-widest text-parchment-white/40">
          Scroll
        </span>
        <div className="animate-bounce-slow flex flex-col items-center gap-1">
          <div className="h-8 w-px bg-gradient-to-b from-ember-gold/60 to-transparent" />
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="text-ember-gold/60">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
