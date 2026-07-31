import { Opening } from "@/components/sections/Opening/Opening";
import { PathSelect } from "@/components/sections/PathSelect/PathSelect";
import { Castle } from "@/components/sections/Castle/Castle";
import type { ArchetypeId } from "@/types";

// Diimpor lewat React.lazy() di App.tsx (Tahap 3 — code-splitting). Sengaja
// import section LANGSUNG dari file masing-masing (bukan lewat barrel
// @/components/sections) supaya Rollup/Vite bisa misahin chunk halaman ini
// dengan bersih, nggak ketarik section punya halaman lain.
export default function PageHome({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Opening />
      <PathSelect />
      <Castle activePath={activePath} />
    </>
  );
}
