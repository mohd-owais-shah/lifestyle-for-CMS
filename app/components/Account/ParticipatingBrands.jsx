/**
 * ParticipatingBrands
 * Displays participating brand logos at the bottom of account pages
 */
export function ParticipatingBrands({className = ''}) {
  return (
    <footer className={`mt-14 pt-8 text-center ${className}`}>
      <p className="text-xs text-gray-500 font-normal mb-3.5">
        Manage your account across all participating brands from one place.
      </p>
      <div
        className="flex flex-wrap items-center justify-center gap-6 min-h-[2.25rem]"
        aria-label="Participating brands"
      >
        <span className="text-base font-bold tracking-wider text-black font-sans select-none">
          LIFESTYLE
        </span>
        <span className="bg-[#cfaa89] text-white font-bold text-sm px-2.5 py-0.5 rounded-xs tracking-tight select-none">
          max
        </span>
        <span className="text-[#5c6874] font-serif text-base font-medium select-none">
          homecentre
        </span>
        <span className="text-[#252525] font-bold text-base tracking-tighter select-none">
          babyshop
        </span>
      </div>
    </footer>
  );
}
