import { useState } from "react";
import { MusicToggle } from "@/components/ui";
import { useHashRouter, type AppRoute } from "@/hooks";

const NAV_LINKS: { label: string; route: AppRoute; emoji: string }[] = [
  { label: "Beranda",   route: "/",         emoji: "🏰" },
  { label: "Wilayah",  route: "/world",     emoji: "🗺️" },
  { label: "Ekonomi",  route: "/economy",   emoji: "⚖️" },
  { label: "Gameplay", route: "/gameplay",  emoji: "⚔️" },
  { label: "Galeri",   route: "/gallery",   emoji: "🎨" },
  { label: "Bantuan",  route: "/faq",       emoji: "📜" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentRoute, navigate } = useHashRouter();

  const handleNav = (route: AppRoute) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-obsidian-night/60 backdrop-blur-md border-b border-parchment-white/5">
      {/* Logo */}
      <button
        onClick={() => handleNav("/")}
        className="font-heading text-lg text-parchment-white hover:text-ember-gold transition-colors"
      >
        ⚜️ Project Kingdom
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-1 items-center" aria-label="Navigasi Utama">
        {NAV_LINKS.map(({ label, route, emoji }) => {
          const isActive = currentRoute === route;
          return (
            <button
              key={route}
              onClick={() => handleNav(route)}
              className={`flex items-center gap-1.5 text-xs uppercase tracking-wider px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "text-ember-gold bg-ember-gold/10 border border-ember-gold/30"
                  : "text-parchment-white/70 hover:text-ember-gold hover:bg-ember-gold/5 border border-transparent"
              }`}
            >
              <span aria-hidden="true">{emoji}</span>
              {label}
            </button>
          );
        })}
        <div className="h-4 w-px bg-parchment-white/10 mx-1" aria-hidden="true" />
        <MusicToggle />
      </nav>

      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center gap-3">
        <MusicToggle />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col justify-center items-center w-8 h-8 rounded border border-parchment-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-gold"
          aria-expanded={mobileMenuOpen}
          aria-label="Buka menu navigasi"
        >
          <span className={`h-0.5 w-5 bg-parchment-white transition-all duration-300 ${mobileMenuOpen ? "transform rotate-45 translate-y-1" : "mb-1"}`} />
          <span className={`h-0.5 w-5 bg-parchment-white transition-all duration-300 ${mobileMenuOpen ? "transform -rotate-45 -translate-y-0.5" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <nav
          className="absolute top-full left-0 right-0 bg-[#0d0d12]/95 border-b border-ember-gold/20 flex flex-col p-4 gap-1 md:hidden shadow-2xl z-50 animate-fade-in"
          aria-label="Navigasi Mobile"
        >
          {NAV_LINKS.map(({ label, route, emoji }) => {
            const isActive = currentRoute === route;
            return (
              <button
                key={route}
                onClick={() => handleNav(route)}
                className={`text-left flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "text-ember-gold bg-ember-gold/10"
                    : "text-parchment-white/80 hover:text-ember-gold hover:bg-ember-gold/5"
                }`}
              >
                <span aria-hidden="true" className="text-lg">{emoji}</span>
                <span className="uppercase tracking-wider font-heading">{label}</span>
                {isActive && <span className="ml-auto text-ember-gold text-xs">●</span>}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
