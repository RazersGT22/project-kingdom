import { lazy, Suspense } from "react";
import { AppProviders } from "@/providers";
import { usePathContext } from "@/context";
import { useLenisScroll, useHashRouter, useAmbientPlayer, useDocumentTitle } from "@/hooks";
import { Navbar, Footer, PageWrapper } from "@/components/layout";
import {
  TransitionLayer,
  CursorLayer,
  AmbientLayer,
  CursorTrailLayer,
  LoadingScreen,
  GrainLayer,
} from "@/components/layers";
import { NavDots } from "@/components/ui";
import { PageNotFound } from "@/pages/PageNotFound";
import type { ArchetypeId } from "@/types";

// Tahap 3 (RENCANA.md, poin Performa) — code-splitting per halaman.
// Sebelumnya SEMUA section dari SEMUA halaman diimpor langsung di file ini,
// jadi kebawa 1 bundle JS raksasa yang didownload penuh walau user cuma buka
// 1 halaman (misal Galeri doang). Sekarang tiap halaman jadi chunk terpisah
// yang BARU didownload pas rute-nya beneran dibuka.
const PageHome = lazy(() => import("@/pages/PageHome"));
const PageWorld = lazy(() => import("@/pages/PageWorld"));
const PageEconomy = lazy(() => import("@/pages/PageEconomy"));
const PageGameplay = lazy(() => import("@/pages/PageGameplay"));
const PageGallery = lazy(() => import("@/pages/PageGallery"));
const PageFaq = lazy(() => import("@/pages/PageFaq"));

// Fallback ringan pas nunggu chunk halaman baru selesai didownload (beda dari
// LoadingScreen yang cuma buat boot pertama kali aplikasi dibuka).
function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <span className="text-ember-gold text-xs uppercase tracking-[0.3em] animate-pulse">
        Memuat...
      </span>
    </div>
  );
}

function AppShell() {
  const { currentRoute } = useHashRouter();
  useLenisScroll(currentRoute);
  useDocumentTitle(currentRoute);
  const { activePath } = usePathContext();
  useAmbientPlayer(currentRoute);

  const renderPage = () => {
    switch (currentRoute) {
      case "/world":    return <PageWorld    activePath={activePath} />;
      case "/economy":  return <PageEconomy  activePath={activePath} />;
      case "/gameplay": return <PageGameplay activePath={activePath} />;
      case "/gallery":  return <PageGallery />;
      case "/faq":      return <PageFaq />;
      case "/404":      return <PageNotFound />;
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
        <Suspense fallback={<PageLoadingFallback />}>
          {renderPage()}
        </Suspense>
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
