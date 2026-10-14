import { Link } from 'react-router';

/**
 * Reusable Stacked Full-Width Banners Component (Used in GenZ and Watches SIS)
 */
export function GenZBragworthy({
  headerImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Header3-Banner1-Desk-17Jun26.jpg',
  cards = [
    {
      id: 'char-1',
      title: 'Marvel',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot5-Banner1-Desk-13Mar26.jpg',
      link: '/collections?q=marvel',
    },
    {
      id: 'char-2',
      title: 'DC',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot5-Banner2-Desk-13Mar26.jpg',
      link: '/collections?q=dc',
    },
    {
      id: 'char-3',
      title: 'Naruto',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot5-Banner3-Desk-13Mar26.jpg',
      link: '/collections?q=naruto',
    },
    {
      id: 'char-4',
      title: 'Garfield',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot5-Banner4-Desk-13Mar26.jpg',
      link: '/collections?q=garfield',
    },
  ],
  maxWidth = 'max-w-[1276px]',
  ariaLabel = 'Bragworthy',
}) {
  return (
    <section className={`w-full ${maxWidth} mx-auto p-0 mt-0 flex flex-col`} aria-label={ariaLabel}>
      {/* Header Banner */}
      {headerImage && (
        <div className="w-full relative overflow-hidden rounded-none md:rounded-[4px] shadow-sm">
          <img
            src={headerImage}
            alt={ariaLabel}
            className="w-full h-auto block object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Stacked Full-Width Banners */}
      <div className="w-full flex flex-col gap-0">
        {cards.map((look, i) => (
          <div
            key={look.id || i}
            className="block w-full overflow-hidden shadow-sm"
          >
            <img
              src={look.img}
              alt={look.title}
              className="w-full h-auto block object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default GenZBragworthy;
