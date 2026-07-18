import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";

type MusicContextType = {
  isPlaying: boolean;
  toggle: () => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const BGM_SRC = "/audio/bgm.mp3";
const FADE_DURATION_MS = 1500; // Sedikit lebih cepat (1.5 detik) agar responsif
const TARGET_VOLUME = 0.35;

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIdRef = useRef<number | null>(null);

  // Inisialisasi Audio element sekali di level global
  useEffect(() => {
    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "metadata";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const startFade = useCallback((toVolume: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Batalkan animasi fade yang sedang berjalan
    if (fadeIdRef.current !== null) {
      cancelAnimationFrame(fadeIdRef.current);
      fadeIdRef.current = null;
    }

    const start = performance.now();
    const fromVolume = audio.volume;
    const duration = FADE_DURATION_MS;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing smooth cubic
      const eased = progress < 0.5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2;

      audio.volume = fromVolume + (toVolume - fromVolume) * eased;

      if (progress < 1) {
        fadeIdRef.current = requestAnimationFrame(tick);
      } else {
        fadeIdRef.current = null;
        onDone?.();
      }
    };

    fadeIdRef.current = requestAnimationFrame(tick);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Ubah state UI langsung
      setIsPlaying(false);
      // Fading out dari volume saat ini ke 0, lalu pause
      startFade(0, () => {
        audio.pause();
      });
    } else {
      setIsPlaying(true);
      // Pastikan audio berputar sebelum fade-in
      if (audio.paused) {
        audio.currentTime = audio.currentTime || 0;
        audio.play().then(() => {
          startFade(TARGET_VOLUME);
        }).catch((err) => {
          console.warn("[MusicPlayer] Gagal play (Autoplay Policy):", err);
          setIsPlaying(false);
        });
      } else {
        // Jika sudah play (misal saat fading out), cukup arahkan volume ke target
        startFade(TARGET_VOLUME);
      }
    }
  }, [isPlaying, startFade]);

  return (
    <MusicContext.Provider value={{ isPlaying, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic harus digunakan di dalam MusicProvider");
  }
  return context;
}
