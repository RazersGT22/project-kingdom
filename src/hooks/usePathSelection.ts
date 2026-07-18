import { usePathContext } from "@/context";
import type { ArchetypeId } from "@/types";

// Implementation Guide Bagian 3/6 — dipakai di PathSelect untuk memilih archetype.
export function usePathSelection() {
  const { activePath, setActivePath } = usePathContext();

  function selectPath(id: ArchetypeId) {
    setActivePath(id);
  }

  return { activePath, selectPath };
}
