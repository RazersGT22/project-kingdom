import { useState, useEffect, type ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state on mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }

      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Simple Global Loading Overlay */}
      {loading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-night transition-opacity duration-500"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-4xl animate-spin" aria-hidden="true">🪙</span>
            <span className="font-heading text-ember-gold text-sm tracking-widest uppercase">
              Memasuki Kerajaan RZ Survival...
            </span>
          </div>
        </div>
      )}

      {/* Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-50 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-ember-gold shadow-[0_0_8px_rgba(201,162,39,0.5)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="relative bg-obsidian-night">{children}</main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-ember-gold bg-obsidian-night/80 text-ember-gold shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-ember-gold hover:text-obsidian-night hover:scale-105"
          aria-label="Kembali ke atas"
        >
          ▲
        </button>
      )}
    </>
  );
}
