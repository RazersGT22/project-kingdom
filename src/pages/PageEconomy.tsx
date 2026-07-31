import { Marketplace } from "@/components/sections/Marketplace/Marketplace";
import { Economy } from "@/components/sections/Economy/Economy";
import { Jobs } from "@/components/sections/Jobs/Jobs";
import type { ArchetypeId } from "@/types";

export default function PageEconomy({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Marketplace activePath={activePath} />
      <Economy activePath={activePath} />
      <Jobs activePath={activePath} />
    </>
  );
}
