import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";
import { useSoundEffects } from "@/hooks";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

// Tech Bible Bab 3 — UI primitive dipakai berulang lintas section, radius/shadow/spacing konsisten.
export function Button({
  children,
  variant = "primary",
  className,
  onClick,
  onMouseEnter,
  ...rest
}: ButtonProps) {
  const base = "px-6 py-3 rounded-md font-heading transition-colors duration-200";
  const variants: Record<string, string> = {
    primary: "bg-ember-gold text-obsidian-night hover:opacity-90",
    secondary: "bg-transparent border border-ember-gold text-ember-gold hover:bg-ember-gold/10",
  };
  const { playClickSFX, playHoverSFX } = useSoundEffects();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSFX();
    if (onClick) onClick(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    playHoverSFX();
    if (onMouseEnter) onMouseEnter(e);
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      {children}
    </button>
  );
}
