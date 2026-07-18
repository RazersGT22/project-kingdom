import { useEffect, useRef } from "react";
import type { AppRoute } from "./useHashRouter";
import { useMusic } from "@/context";

// Peta rute halaman ke file audio ambient-nya (sesuai format file riil di folder public/audio)
const AMBIENT_MAP: Partial<Record<AppRoute, string>> = {
  "/":         "/audio/castle_garden.mp3", // Beranda: Kicau Burung & Harpa
  "/world":    "/audio/campfire.wav",       // Wilayah: Api Unggun (format WAV bawaan)
  "/economy":  "/audio/marketplace.mp3",    // Ekonomi: Keramaian Pasar & Pandai Besi
  "/gameplay": "/audio/wind.wav",           // Gameplay: Desau Angin Lembah (format WAV bawaan)
  "/gallery":  "/audio/gallery_lore.mp3",   // Galeri: Gema Paduan Suara Katedral
  "/faq":      "/audio/faq_rain.mp3",       // Bantuan: Hujan Rileks di Jendela Kastil
};

const FADE_DURATION_MS = 1500;
const AMBIENT_VOLUME    = 0.18; // Volume ambient lirih agar menyatu dengan BGM utama

// Fungsi fade-in volume ambient
function fadeIn(audio: HTMLAudioElement, target: number, durationMs: number, fadeIdRef: React.MutableRefObject<number | null>) {
  if (fadeIdRef.current !== null) {
    cancelAnimationFrame(fadeIdRef.current);
  }
  const start = performance.now();
  audio.volume = 0;
  const tick = (now: number) => {
    const p = Math.min((now - start) / durationMs, 1);
    audio.volume = target * p;
    if (p < 1) {
      fadeIdRef.current = requestAnimationFrame(tick);
    } else {
      fadeIdRef.current = null;
    }
  };
  fadeIdRef.current = requestAnimationFrame(tick);
}

// Fungsi fade-out volume ambient
function fadeOut(audio: HTMLAudioElement, durationMs: number, fadeIdRef: React.MutableRefObject<number | null>, onDone: () => void) {
  if (fadeIdRef.current !== null) {
    cancelAnimationFrame(fadeIdRef.current);
  }
  const start = performance.now();
  const initial = audio.volume;
  const tick = (now: number) => {
    const p = Math.min((now - start) / durationMs, 1);
    audio.volume = initial * (1 - p);
    if (p < 1) {
      fadeIdRef.current = requestAnimationFrame(tick);
    } else {
      fadeIdRef.current = null;
      audio.pause();
      audio.currentTime = 0;
      onDone();
    }
  };
  fadeIdRef.current = requestAnimationFrame(tick);
}

export function useAmbientPlayer(currentRoute: AppRoute) {
  const { isPlaying } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIdRef = useRef<number | null>(null);

  useEffect(() => {
    const src = AMBIENT_MAP[currentRoute];

    // Jika musik global dimatikan (isPlaying = false), hentikan suara ambient halaman ini
    if (!isPlaying) {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        fadeOut(audio, FADE_DURATION_MS, fadeIdRef, () => {
          audioRef.current = null;
        });
      }
      return;
    }

    // Jika musik global dinyalakan (isPlaying = true), mainkan ambient halaman ini
    const stopCurrent = (cb: () => void) => {
      const audio = audioRef.current;
      if (!audio || audio.paused) {
        cb();
        return;
      }
      fadeOut(audio, FADE_DURATION_MS, fadeIdRef, () => {
        cb();
      });
    };

    stopCurrent(() => {
      if (!src) {
        audioRef.current = null;
        return;
      }

      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;

      audio.play().then(() => {
        fadeIn(audio, AMBIENT_VOLUME, FADE_DURATION_MS, fadeIdRef);
      }).catch((err) => {
        console.warn("[AmbientPlayer] Autoplay diblokir:", err);
        // Autoplay diblokir browser — pasang trigger klik pertama untuk mulai suara ambient
        const resume = () => {
          if (audioRef.current === audio && !audio.paused) return; // double check
          audio.play().then(() => fadeIn(audio, AMBIENT_VOLUME, FADE_DURATION_MS, fadeIdRef));
          window.removeEventListener("click", resume);
        };
        window.addEventListener("click", resume, { once: true });
      });
    });

    return () => {
      // Hentikan suara jika berpindah halaman
      if (fadeIdRef.current !== null) {
        cancelAnimationFrame(fadeIdRef.current);
      }
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [currentRoute, isPlaying]);
}
