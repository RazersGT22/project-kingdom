import { useMusic } from "@/context";

// Toggle button music di Navbar — ikon lute/note berganti play/pause.
export function MusicToggle() {
  const { isPlaying, toggle } = useMusic();

  return (
    <button
      id="music-toggle"
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Matikan musik" : "Nyalakan musik ambient"}
      title={isPlaying ? "Matikan musik" : "Nyalakan musik"}
      className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-parchment-white/60 hover:text-ember-gold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-gold rounded px-2 py-1 border border-transparent hover:border-ember-gold/30 group"
    >
      {isPlaying ? (
        <>
          {/* Sound waves icon — playing */}
          <span className="relative w-4 h-4 flex items-end gap-[2px]">
            <span className="w-[3px] rounded-sm bg-ember-gold animate-[musicbar_0.8s_ease-in-out_infinite]" style={{ height: "40%" }} />
            <span className="w-[3px] rounded-sm bg-ember-gold animate-[musicbar_0.8s_ease-in-out_0.15s_infinite]" style={{ height: "100%" }} />
            <span className="w-[3px] rounded-sm bg-ember-gold animate-[musicbar_0.8s_ease-in-out_0.3s_infinite]" style={{ height: "60%" }} />
            <span className="w-[3px] rounded-sm bg-ember-gold animate-[musicbar_0.8s_ease-in-out_0.45s_infinite]" style={{ height: "80%" }} />
          </span>
          <span className="hidden sm:inline">Musik On</span>
        </>
      ) : (
        <>
          {/* Mute icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
            <path d="M2 5.5h2l4-3v11l-4-3H2V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <line x1="11" y1="5" x2="15" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="15" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Musik Off</span>
        </>
      )}
    </button>
  );
}
