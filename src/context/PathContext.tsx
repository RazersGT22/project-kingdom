import { createContext, useContext } from "react";
import type { ArchetypeId } from "@/types";

// Tech Bible Bab 3 & 5 / Implementation Guide Bagian 6 —
// satu-satunya global state: activePath (archetype terpilih).
export type PathContextValue = {
  activePath: ArchetypeId | null;
  setActivePath: (path: ArchetypeId) => void;
};

export const PathContext = createContext<PathContextValue | undefined>(undefined);

export function usePathContext(): PathContextValue {
  const ctx = useContext(PathContext);
  if (!ctx) {
    throw new Error("usePathContext harus dipakai di dalam PathProvider");
  }
  return ctx;
}
