export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#09090c] border-t border-parchment-white/5 px-6 py-12 text-center md:text-left">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <span className="font-heading text-lg text-ember-gold">RZ Survival</span>
          <p className="text-xs text-parchment-white/40 mt-2 max-w-sm">
            Sebuah server Minecraft abad pertengahan yang menawarkan petualangan imersif, ekonomi kompleks, dan pertempuran klan epik.
          </p>
        </div>

        {/* Footer link lists */}
        <div className="flex flex-wrap justify-center gap-8 text-xs font-heading">
          <div className="flex flex-col gap-2">
            <span className="text-parchment-white/30 uppercase tracking-widest text-[10px]">Tautan Cepat</span>
            <a href="#discord" onClick={(e) => e.preventDefault()} className="text-parchment-white/60 hover:text-ember-gold transition-colors">Discord</a>
            <a href="#vote" onClick={(e) => e.preventDefault()} className="text-parchment-white/60 hover:text-ember-gold transition-colors">Vote Server</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-parchment-white/30 uppercase tracking-widest text-[10px]">Dukungan</span>
            <a href="#rules" onClick={(e) => e.preventDefault()} className="text-parchment-white/60 hover:text-ember-gold transition-colors">Aturan Server</a>
            <a href="#store" onClick={(e) => e.preventDefault()} className="text-parchment-white/60 hover:text-ember-gold transition-colors">Toko Donasi</a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-parchment-white/5 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-parchment-white/35">
        <p>&copy; {currentYear} RZ Survival. Seluruh Hak Cipta Dilindungi.</p>
        <p>Tidak berafiliasi dengan Mojang Studios atau Microsoft.</p>
      </div>
    </footer>
  );
}
