import { Village } from "@/components/sections/Village/Village";
import { Castle } from "@/components/sections/Castle/Castle";
import type { ArchetypeId } from "@/types";

export default function PageWorld({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Village activePath={activePath} />
      <Castle activePath={activePath} />
    </>
  );
}
