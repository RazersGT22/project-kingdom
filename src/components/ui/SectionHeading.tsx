import { cn } from "@/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  className?: string;
};

// Tech Bible Bab 3 — dipakai berulang lintas section untuk konsistensi tipografi.
export function SectionHeading({ eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-8", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm uppercase tracking-widest text-ember-gold">{eyebrow}</p>
      )}
      <h2 className="font-heading text-3xl md:text-5xl text-parchment-white">{title}</h2>
    </div>
  );
}
