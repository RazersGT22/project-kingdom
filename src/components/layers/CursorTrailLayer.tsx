import { useEffect } from "react";
import { gsap } from "@/lib";

// Cursor trail — percikan api yang muncul di sepanjang jalur mouse.
// Setiap spark dibuang ke DOM, dianimasikan dengan GSAP, lalu dihapus.
export function CursorTrailLayer() {
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let frameId: number;
    let spawnThrottle = 0;

    const COLORS = ["#C9A227", "#F0D060", "#FF8C00", "#FFD700", "#E8A020"];

    const spawnSpark = (x: number, y: number) => {
      const spark = document.createElement("div");
      const size = Math.random() * 6 + 3; // 3-9px
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const vx = (Math.random() - 0.5) * 60; // horizontal drift
      const vy = -(Math.random() * 60 + 20); // upward velocity

      spark.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 9998;
        filter: blur(0.5px) drop-shadow(0 0 ${size / 2}px ${color});
        transform: translate(-50%, -50%);
      `;

      document.body.appendChild(spark);

      gsap.to(spark, {
        x: vx,
        y: vy + Math.random() * 20,
        opacity: 0,
        scale: 0.1,
        duration: Math.random() * 0.6 + 0.4,
        ease: "power2.out",
        onComplete: () => {
          if (spark.parentNode) spark.parentNode.removeChild(spark);
        },
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const tick = () => {
      spawnThrottle++;
      // Spawn spark every ~2 frames for performance
      if (spawnThrottle % 2 === 0) {
        spawnSpark(
          lastX + (Math.random() - 0.5) * 8,
          lastY + (Math.random() - 0.5) * 8,
        );
      }
      frameId = requestAnimationFrame(tick);
    };

    // Only start trail on first mouse move
    const startTrail = () => {
      window.addEventListener("mousemove", onMouseMove);
      frameId = requestAnimationFrame(tick);
      window.removeEventListener("mousemove", startTrail);
    };

    window.addEventListener("mousemove", startTrail);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousemove", startTrail);
    };
  }, []);

  return null;
}
