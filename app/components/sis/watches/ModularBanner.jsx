import { Link } from 'react-router';

/**
 * 2. ModularBanner (Responsive Feature Campaign Banner)
 */
export function ModularBanner({
  desktopImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-ModBlock3-17Nov25.jpg',
  mobileHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Header3-Mob-11Dec24A.jpg',
  mobileImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-ModBlock3-17Nov25.jpg',
  link = '/collections?q=watches',
  alt = 'Watches Collection Feature',
}) {
  return (
    <section className="w-full max-w-[1232px] mx-auto p-0 m-0 flex flex-col" aria-label="Watches Feature Banner">
      {/* Mobile Header Banner */}
      {mobileHeader && (
        <div className="block md:hidden w-full overflow-hidden shadow-sm">
          <img
            src={mobileHeader}
            alt="Watches Header"
            className="w-full h-auto block object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Main Responsive Modular Banner */}
      <div className="block w-full overflow-hidden shadow-sm">
        <picture className="w-full block">
          <source media="(min-width: 768px)" srcSet={desktopImage} />
          <img
            src={mobileImage || desktopImage}
            alt={alt}
            className="w-full h-auto block object-cover"
            loading="lazy"
          />
        </picture>
      </div>
    </section>
  );
}

export default ModularBanner;
