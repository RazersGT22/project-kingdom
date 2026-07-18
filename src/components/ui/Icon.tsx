import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  name?: string;
};

// Tech Bible Bab 1 — ikon SVG custom/inline gaya heraldik, bukan library generik.
// Placeholder shape (shield outline sederhana) — bentuk final menunggu Asset Brief.
export function Icon({ name = "placeholder", className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      data-icon-name={name}
      {...rest}
    >
      {/* TODO: ganti dengan set ikon heraldik final dari Asset Brief */}
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
    </svg>
  );
}
