import type { ReactNode } from "react";
import { PathProvider } from "./PathProvider";
import { MusicProvider } from "@/context";

type AppProvidersProps = {
  children: ReactNode;
};

// Satu titik masuk untuk seluruh provider global — memudahkan Antigravity
// menambah provider baru tanpa mengubah App.tsx secara langsung.
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PathProvider>
      <MusicProvider>{children}</MusicProvider>
    </PathProvider>
  );
}
