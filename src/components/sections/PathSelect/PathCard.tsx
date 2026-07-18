import type { Archetype } from "@/types";
import { cn } from "@/utils";

// Ikon SVG per archetype (sederhana, inline — gaya heraldik minimal)
const archetypeIcons: Record<Archetype["id"], JSX.Element> = {
  conqueror: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-8 w-8">
      <path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7L3 8h6z" strokeLinejoin="round" />
    </svg>
  ),
  merchant: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-8 w-8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
  citizen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-8 w-8">
      <path d="M3 21V9l9-6 9 6v12H3z" strokeLinejoin="round" />
      <rect x="9" y="13" width="6" height="8" rx="0.5" />
    </svg>
  ),
  explorer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-8 w-8">
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" strokeLinecap="round" />
    </svg>
  ),
};

type PathCardProps = {
  archetype: Archetype;
  isActive: boolean;
  onSelect: (id: Archetype["id"]) => void;
};

// Project Bible Bab 5 — titik personalisasi utama (pilih 1 dari 4 archetype).
export function PathCard({ archetype, isActive, onSelect }: PathCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      onClick={() => onSelect(archetype.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(archetype.id);
      }}
      className={cn(
        "group relative w-full text-left rounded-xl border p-6 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-gold hover-shimmer",
        isActive
          ? "border-ember-gold bg-ember-gold/10 animate-glow-pulse"
          : "border-parchment-white/10 bg-obsidian-night/60 hover:border-ember-gold/50 hover:bg-ember-gold/5",
      )}
    >
      {/* Active indicator dot */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-4 right-4 h-2 w-2 rounded-full transition-all duration-300",
          isActive ? "bg-ember-gold scale-100" : "bg-transparent scale-0",
        )}
      />

      {/* Icon */}
      <span
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-lg border transition-all duration-300",
          isActive
            ? "border-ember-gold/60 text-ember-gold animate-float-slow"
            : "border-parchment-white/20 text-parchment-white/50 group-hover:border-ember-gold/40 group-hover:text-ember-gold/80 group-hover:scale-105",
        )}
      >
        {archetypeIcons[archetype.id]}
      </span>

      {/* Label */}
      <h3
        className={cn(
          "font-heading text-xl mb-2 transition-colors duration-300",
          isActive ? "text-ember-gold" : "text-parchment-white group-hover:text-ember-gold/90",
        )}
      >
        {archetype.label}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-parchment-white/60">
        {archetype.description}
      </p>
    </button>
  );
}
