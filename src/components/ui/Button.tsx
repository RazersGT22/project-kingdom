import { useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils";
import { useSoundEffects } from "@/hooks";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

// Tech Bible Bab 3 — UI primitive dipakai berulang lintas section, radius/shadow/spacing konsisten.
// RENCANA.md Tahap 2 poin 2 — efek "magnetic cursor": tombol dikit "ketarik" ke
// arah posisi kursor pas di-hover. Cuma aktif buat perangkat dengan mouse asli
// (pointer: fine) — otomatis nggak aktif di HP/tablet (layar sentuh).
export function Button({
  children,
  variant = "primary",
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  const base = "px-6 py-3 rounded-md font-heading transition-colors duration-200";
  const variants: Record<string, string> = {
    primary: "bg-ember-gold text-obsidian-night hover:opacity-90",
    secondary: "bg-transparent border border-ember-gold text-ember-gold hover:bg-ember-gold/10",
  };
  const { playClickSFX, playHoverSFX } = useSoundEffects();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSFX();
    if (onClick) onClick(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    playHoverSFX();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const hasRealMouse =
      typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches;
    const btn = buttonRef.current;
    if (hasRealMouse && btn) {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      setMagnet({ x: relX * 0.25, y: relY * 0.25 });
    }
    if (onMouseMove) onMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMagnet({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <button
      ref={buttonRef}
      className={cn(base, variants[variant], className)}
      style={{
        transform: `translate(${magnet.x}px, ${magnet.y}px)`,
        transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </button>
  );
}
