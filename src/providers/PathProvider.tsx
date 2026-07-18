import { useMemo, useState, type ReactNode } from "react";
import { PathContext } from "@/context";
import type { ArchetypeId } from "@/types";

type PathProviderProps = {
  children: ReactNode;
};

// Implementation Guide Bagian 6 — provider tunggal untuk PathContext.
// Tidak dipersist (localStorage/sessionStorage) — default konservatif,
// reset tiap reload sampai ditentukan lain.
export function PathProvider({ children }: PathProviderProps) {
  const [activePath, setActivePath] = useState<ArchetypeId | null>(null);

  const value = useMemo(() => ({ activePath, setActivePath }), [activePath]);

  return <PathContext.Provider value={value}>{children}</PathContext.Provider>;
}
