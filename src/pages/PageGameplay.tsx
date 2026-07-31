import { Dungeon } from "@/components/sections/Dungeon/Dungeon";
import { Boss } from "@/components/sections/Boss/Boss";
import { Trailer } from "@/components/sections/Trailer/Trailer";
import type { ArchetypeId } from "@/types";

export default function PageGameplay({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Dungeon activePath={activePath} />
      <Boss activePath={activePath} />
      <Trailer />
    </>
  );
}
