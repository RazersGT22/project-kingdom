import { AppProviders } from "@/providers";
import { usePathContext } from "@/context";
import { useLenisScroll, useHashRouter, useAmbientPlayer } from "@/hooks";
import { Navbar, Footer, PageWrapper } from "@/components/layout";
import {
  TransitionLayer,
  CursorLayer,
  AmbientLayer,
  CursorTrailLayer,
  LoadingScreen,
  GrainLayer,
} from "@/components/layers";
import {
  // Halaman Beranda (/)
  Opening,
  PathSelect,
  // Halaman Wilayah (/world)
  Castle,
  Village,
  // Halaman Ekonomi (/economy)
  Marketplace,
  Economy,
  Jobs,
  // Halaman Gameplay (/gameplay)
  Dungeon,
  Boss,
  Trailer,
  // Halaman Galeri (/gallery)
  Gallery,
  // Halaman Bergabung (join-server + FAQ)
  JoinServer,
  Faq,
} from "@/components/sections";
import { NavDots } from "@/components/ui";
import type { ArchetypeId } from "@/types";

function PageHome({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Opening />
      <PathSelect />
      <Castle activePath={activePath} />
    </>
  );
}

function PageWorld({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Village activePath={activePath} />
      <Castle activePath={activePath} />
    </>
  );
}

function PageEconomy({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Marketplace activePath={activePath} />
      <Economy activePath={activePath} />
      <Jobs activePath={activePath} />
    </>
  );
}

function PageGameplay({ activePath }: { activePath: ArchetypeId | null }) {
  return (
    <>
      <Dungeon activePath={activePath} />
      <Boss activePath={activePath} />
      <Trailer />
    </>
  );
}

function PageGallery() {
  return <Gallery />;
}

function PageFaq() {
  return (
    <>
      <JoinServer />
      <Faq />
    </>
  );
}

function AppShell() {
  const { currentRoute } = useHashRouter();
  useLenisScroll(currentRoute);
  const { activePath } = usePathContext();
  useAmbientPlayer(currentRoute);

  const renderPage = () => {
    switch (currentRoute) {
      case "/world":    return <PageWorld    activePath={activePath} />;
      case "/economy":  return <PageEconomy  activePath={activePath} />;
      case "/gameplay": return <PageGameplay activePath={activePath} />;
      case "/gallery":  return <PageGallery />;
      case "/faq":      return <PageFaq />;
      default:          return <PageHome     activePath={activePath} />;
    }
  };

  return (
    <>
      <LoadingScreen />
      <GrainLayer />
      <CursorLayer />
      <CursorTrailLayer />
      <AmbientLayer />
      <TransitionLayer />
      <Navbar />
      <PageWrapper>
        {renderPage()}
      </PageWrapper>
      <Footer />
      <NavDots currentRoute={currentRoute} />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
