import { useRef, useState } from "react";
import { trailerCopy } from "@/data";
import { useScrollReveal } from "@/hooks";
import { SectionHeading, Button } from "@/components/ui";
import { scrollToSection } from "@/utils";

export function Trailer() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      id="trailer"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden"
    >
      {/* Background cinematic visuals */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-obsidian-night via-[#08080c] to-obsidian-night pointer-events-none"
      />
      
      {/* Dynamic light rays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="h-[700px] w-[700px] rounded-full bg-ember-gold/5 blur-[150px]" />
      </div>

      {/* Top Divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        <SectionHeading
          eyebrow="Cinematic Trailer"
          title={trailerCopy.headline}
          className="mb-6 flex flex-col items-center"
        />

        <p className="max-w-2xl text-base md:text-lg text-parchment-white/70 leading-relaxed mb-12">
          {trailerCopy.body}
        </p>

        {/* Embedded Video Placeholder Card */}
        <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden border border-ember-gold/20 bg-black/60 shadow-2xl mb-12">
          
          {!isPlaying ? (
            /* Cover Frame / Thumbnail simulator */
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b150c] via-[#09080c] to-[#0f0e15] flex flex-col items-center justify-center p-6">
              
              {/* Play Button with pulsing ring animation */}
              <button
                onClick={() => setIsPlaying(true)}
                className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-ember-gold text-obsidian-night transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ember-gold"
                aria-label="Putar video trailer"
              >
                {/* Pulse Ring */}
                <span className="absolute inset-0 rounded-full border-4 border-ember-gold opacity-30 animate-ping pointer-events-none" />
                
                {/* SVG Play Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 ml-1 transform group-hover:scale-105 transition-transform"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <span className="text-xs uppercase tracking-widest text-parchment-white/50 mt-6 font-bold">
                Click to Play Preview (Simulasi)
              </span>

              {/* Decorative corners */}
              <div aria-hidden="true" className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-ember-gold/30" />
              <div aria-hidden="true" className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-ember-gold/30" />
              <div aria-hidden="true" className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-ember-gold/30" />
              <div aria-hidden="true" className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-ember-gold/30" />
            </div>
          ) : (
            /* Played state simulator */
            <div className="absolute inset-0 bg-[#060608] flex flex-col items-center justify-center p-6">
              {/* Simulated Loading/Playing screen */}
              <div className="text-center">
                <span className="text-4xl animate-spin inline-block mb-4" aria-hidden="true">⏳</span>
                <h4 className="font-heading text-lg text-parchment-white">Memuat Media Sinematik...</h4>
                <p className="text-xs text-parchment-white/40 mt-1 max-w-sm mx-auto leading-relaxed">
                  (Video player terintegrasi YouTube/Vimeo akan disematkan di sini menggunakan Asset ID Anda)
                </p>
              </div>

              {/* Back to cover button */}
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 text-xs uppercase tracking-wider text-ember-gold border border-ember-gold/30 px-3 py-1 rounded bg-black/40 hover:bg-ember-gold hover:text-black transition-colors"
              >
                Tutup Player
              </button>
            </div>
          )}

        </div>

        {/* CTA to Join Server */}
        <div className="flex justify-center">
          <Button
            variant="secondary"
            className="text-base py-4 min-w-[220px]"
            onClick={() => scrollToSection("#join-server")}
          >
            Mulai Bermain Sekarang
          </Button>
        </div>

      </div>
    </section>
  );
}
