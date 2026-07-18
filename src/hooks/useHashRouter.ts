import { useState, useEffect, useCallback } from "react";

// Daftar route halaman yang tersedia
export type AppRoute = "/" | "/world" | "/economy" | "/gameplay" | "/gallery" | "/faq";

const VALID_ROUTES: AppRoute[] = ["/world", "/economy", "/gameplay", "/gallery", "/faq"];

function getRouteFromHash(): AppRoute {
  // hash bisa berupa "#/world", "#/economy", dst.
  // Atau kosong / "#/" untuk home
  const raw = window.location.hash; // misal: "#/world"
  const path = raw.startsWith("#") ? raw.slice(1) : raw; // "/world"
  if (VALID_ROUTES.includes(path as AppRoute)) {
    return path as AppRoute;
  }
  return "/";
}

export function useHashRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      setCurrentRoute(route);
      // Scroll ke atas saat pindah halaman
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = useCallback((route: AppRoute) => {
    if (route === "/") {
      // Hapus hash untuk home
      history.pushState(null, "", window.location.pathname);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      window.location.hash = route;
    }
  }, []);

  return { currentRoute, navigate };
}
