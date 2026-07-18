import { useCallback, useRef } from "react";

// Web Audio API Procedural Sound Effects (SFX)
// Tidak membutuhkan file audio eksternal. Semua disintesis secara langsung.

export function useSoundEffects() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (browser autoplay security policy)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // 1. SFX Gerbang Kastil Terbuka (Rantai, Gesekan Batu, & Derit Besi)
  const playGateOpenSFX = useCallback(() => {
    const ctx = getAudioContext();
    const duration = 2.0; // Durasi suara 2 detik
    const now = ctx.currentTime;

    // --- RUMBLE (Batu Bergeser & Deru Roda Gigi) ---
    const rumbleOsc = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    rumbleOsc.type = "sawtooth";
    rumbleOsc.frequency.setValueAtTime(45, now);
    // Pitch sedikit melorot ke bawah saat gerbang mulai terangkat
    rumbleOsc.frequency.linearRampToValueAtTime(35, now + duration);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + duration);

    rumbleGain.gain.setValueAtTime(0, now);
    rumbleGain.gain.linearRampToValueAtTime(0.3, now + 0.2); // Fade-in cepat
    rumbleGain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Fade-out pelan

    rumbleOsc.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);

    // --- CREAKS & CLANKS (Derit Rantai & Logam Berkarat) ---
    // Gunakan 4 generator harmonik acak untuk mensimulasikan getaran logam
    const squeakFreqs = [700, 1100, 1500, 1900];
    const squeakNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

    squeakFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      // Vibrato lambat untuk membuat suara mendecit bergetar
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(15 + idx * 3, now);
      lfoGain.gain.setValueAtTime(30, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0, now);
      // Nyalakan suara berdecit secara berselang-seling (simulasi derit dinamis)
      const delay = 0.2 + idx * 0.35;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.04, now + delay + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);
      osc.stop(now + duration);
      lfo.stop(now + duration);
    });

    rumbleOsc.start(now);
    rumbleOsc.stop(now + duration);
  }, []);

  // 2. SFX Klik Tombol (Koin Emas Abad Pertengahan / Sword Click)
  const playClickSFX = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Kombinasi nada tinggi metallic (bel / logam)
    const freqs = [850, 1075, 2200];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08 / (idx + 1), now);
      // Decay super cepat (logam berdenting singkat)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }, []);

  // 3. SFX Hover Menu/Tombol (Suara gesekan kertas perkamen / kayu ringan)
  const playHoverSFX = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Suara tick lembut frekuensi rendah
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }, []);

  return {
    playGateOpenSFX,
    playClickSFX,
    playHoverSFX,
  };
}
