import { useEffect, useRef, useState, useCallback } from "react";

// Hook musik background menggunakan HTML5 Audio API.
// File: /audio/bgm.mp3 (di public/ folder, diakses langsung via Vite).
// Fade-in/fade-out via requestAnimationFrame agar transisi halus.

const BGM_SRC = "/audio/bgm.mp3";
const FADE_DURATION_MS = 2000; // 2 detik fade
const TARGET_VOLUME = 0.35;    // 35% volume — ambient, tidak mendominasi

function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
  onDone?: () => void,
) {
  const start = performance.now();
  const tick = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / durationMs, 1);
    // Ease in-out cubic
    const eased = progress < 0.5
      ? 4 * progress ** 3
      : 1 - (-2 * progress + 2) ** 3 / 2;
    audio.volume = from + (to - from) * eased;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      onDone?.();
    }
  };
  requestAnimationFrame(tick);
}

export function useMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadingRef = useRef(false);

  // Inisialisasi Audio element sekali
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

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || fadingRef.current) return;

    if (isPlaying) {
      // Fade out → pause
      fadingRef.current = true;
      fadeVolume(audio, audio.volume, 0, FADE_DURATION_MS, () => {
        audio.pause();
        fadingRef.current = false;
      });
      setIsPlaying(false);
    } else {
      // Play → fade in
      audio.currentTime = audio.currentTime || 0;
      audio.volume = 0;
      audio.play().then(() => {
        fadingRef.current = true;
        fadeVolume(audio, 0, TARGET_VOLUME, FADE_DURATION_MS, () => {
          fadingRef.current = false;
        });
        setIsPlaying(true);
      }).catch((err) => {
        // Browser autoplay policy — tetap tampilkan state yang benar
        console.warn("[MusicPlayer] Gagal play:", err);
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  return { isPlaying, toggle };
}
