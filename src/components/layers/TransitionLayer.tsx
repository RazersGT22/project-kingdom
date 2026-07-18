import { useEffect, useRef } from "react";
import { usePathContext } from "@/context";
import { gsap } from "@/lib";

export function TransitionLayer() {
  const { activePath } = usePathContext();
  const flashRef = useRef<HTMLDivElement>(null);
  const initialMount = useRef(true);

  useEffect(() => {
    // Skip transition on initial render
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    const flash = flashRef.current;
    if (!flash || !activePath) return;

    // Play a gold select flash on change
    gsap.fromTo(
      flash,
      { opacity: 0.8, scale: 0.95 },
      {
        opacity: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }, [activePath]);

  return (
    <>
      {/* Fullscreen Golden Vignette Flash on selection change */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-50 border-[16px] border-ember-gold/30 bg-ember-gold/5 opacity-0 rounded-2xl"
        aria-hidden="true"
      />
    </>
  );
}
