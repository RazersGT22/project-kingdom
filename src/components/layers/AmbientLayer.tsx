import { useEffect, useRef } from "react";
import { gsap } from "@/lib";

export function AmbientLayer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 50;
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("span");

      // Vary size: some bigger (embers), some tiny (dust)
      const isBig = i < 15;
      const size = isBig ? Math.random() * 4 + 3 : Math.random() * 2 + 1;

      p.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${isBig ? "#C9A227" : "#f0d060"};
        pointer-events: none;
        z-index: 5;
        filter: ${isBig ? "blur(0.5px) drop-shadow(0 0 4px #C9A227)" : "none"};
        opacity: 0;
      `;

      container.appendChild(p);
      particles.push(p);
    }

    const ctx = gsap.context(() => {
      particles.forEach((p, idx) => {
        const runAnimation = () => {
          const startX = Math.random() * window.innerWidth;
          const driftX = (Math.random() - 0.5) * 300;
          const duration = Math.random() * 12 + 8;
          const delay = idx === 0 ? 0 : Math.random() * 5;
          const maxOpacity = idx < 15 ? Math.random() * 0.6 + 0.3 : Math.random() * 0.3 + 0.1;

          gsap.fromTo(
            p,
            { x: startX, y: window.innerHeight + 10, opacity: 0 },
            {
              x: startX + driftX,
              y: -20,
              opacity: maxOpacity,
              duration,
              delay,
              ease: "none",
              onComplete: runAnimation,
            }
          );
        };
        runAnimation();
      });
    }, container);

    return () => {
      ctx.revert();
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="ambient-layer"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 5 }}
    />
  );
}
