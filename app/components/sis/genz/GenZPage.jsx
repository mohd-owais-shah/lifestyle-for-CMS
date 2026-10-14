import { GenZHeroBanner } from './GenZHeroBanner';
import { GenZHottestFinds } from './GenZHottestFinds';
import { GenZSlayinAllDays } from './GenZSlayinAllDays';
import { GenZCharacterStore } from './GenZCharacterStore';
import { GenZBragworthy } from './GenZBragworthy';
import { GenZGoatDeals } from './GenZGoatDeals';
import { GenZNewInTheHood } from './GenZNewInTheHood';

/**
 * Main Gen Z SIS Landing Page Component
 * Modular architecture matching exact Landmark live SIS layout
 */
export function GenZPage() {
  return (
    <div className="w-full flex flex-col bg-white">
      {/* 1. Hero Banner */}
      <GenZHeroBanner />

      {/* 2. Section 2 — HOTTEST FINDS */}
      <GenZHottestFinds />

      {/* 3. Section 3 — SLAYIN' ALL DAYS */}
      <GenZSlayinAllDays />

      {/* 4. Section 4 — Character Store / Slot 3 (Header + Snoopy ModBlock + 5 Cards) */}
      <GenZCharacterStore />

      {/* 5. Section 5 — BRAGWORTHY (Header + Stacked Full-Width Banners) */}
      <GenZBragworthy />

      {/* 6. Section 6 — G.O.A.T DEALS (Header + 4 Square Deals: 299, 499, 699, 999) */}
      <GenZGoatDeals />

      {/* 7. Section 7 — NEW IN THE HOOD */}
      <GenZNewInTheHood />
    </div>
  );
}

export default GenZPage;
