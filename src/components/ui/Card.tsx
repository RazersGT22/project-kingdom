import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

// Tech Bible Bab 3 — dipakai mis. di PathCard (PathSelect) dan konten section lain.
export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn("rounded-lg border border-ember-gold/30 bg-obsidian-night/60 p-6", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
