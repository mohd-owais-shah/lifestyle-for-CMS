import { Link } from 'react-router';

/**
 * Gen Z Hero Banner Component
 * Matches Lifestyle Stores Gen Z SIS top hero banner
 */
export function GenZHeroBanner({
  desktopImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-SIS-Desk-HeroBanner1-17Jun26.jpg',
  mobileImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-SIS-Mob-HeroBanner1-17Jun26.jpg',
  link = '/collections?q=genz',
}) {
  return (
    <section className="w-full max-w-[1276px] mx-auto p-0 mt-3 sm:mt-4" aria-label="Hero Banner">
      <div className="block relative w-full group overflow-hidden rounded-none md:rounded-[4px] shadow-sm">
        {/* Desktop Aspect Ratio (1276x430 or ~16:5.4) */}
        <div className="hidden md:block w-full aspect-[1276/430] relative overflow-hidden bg-neutral-900">
          <img
            src={desktopImage}
            alt="GEN Z - OG Styles to Slay"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>

        {/* Mobile Aspect Ratio */}
        <div className="block md:hidden w-full aspect-[1/1] relative overflow-hidden bg-neutral-900">
          <img
            src={mobileImage}
            alt="GEN Z - OG Styles to Slay"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
