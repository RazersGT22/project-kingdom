import { useEffect, useRef } from "react";
import { gsap } from "@/lib";

export function CursorLayer() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    // Hide original cursor
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      // Direct position for inner dot
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      
      // Lagging position for outer ring
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(ring, {
        scale: 1.8,
        borderColor: "#C9A227",
        backgroundColor: "rgba(201, 162, 39, 0.1)",
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 0.5,
        backgroundColor: "#C9A227",
        duration: 0.2,
      });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(201, 162, 39, 0.4)",
        backgroundColor: "transparent",
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: "#C9A227",
        duration: 0.2,
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Track all buttons, links, and cards
    const updateInteractiveListeners = () => {
      const interactives = document.querySelectorAll("button, a, [role='button'], [role='radio']");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };

    updateInteractiveListeners();
    // Re-bind when DOM changes
    const observer = new MutationObserver(updateInteractiveListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-gold pointer-events-none z-50 transition-transform duration-100 ease-out hidden md:block"
        aria-hidden="true"
      />
      {/* Outer Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ember-gold/40 pointer-events-none z-50 transition-transform duration-100 ease-out hidden md:block"
        aria-hidden="true"
      />
    </>
  );
}
