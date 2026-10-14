import { Link } from 'react-router';

/**
 * Section: G.O.A.T DEALS (4 Square Deal Cards: Under 299, 499, 699, 999)
 */
export function GenZGoatDeals({
  headerImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Header4-Banner1-Desk-17Jun26.jpg',
  deals = [
    {
      id: 'goat-299',
      title: 'Under ₹299',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot-6-Banner1-Desk-20Mar26.jpg',
      link: '/collections?q=under-299',
    },
    {
      id: 'goat-499',
      title: 'Under ₹499',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot-6-Banner2-Desk-20Mar26.jpg',
      link: '/collections?q=under-499',
    },
    {
      id: 'goat-699',
      title: 'Under ₹699',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot-6-Banner3-Desk-20Mar26.jpg',
      link: '/collections?q=under-699',
    },
    {
      id: 'goat-999',
      title: 'Under ₹999',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot-6-Banner4-Desk-20Mar26.jpg',
      link: '/collections?q=under-999',
    },
  ],
}) {
  return (
    <section className="w-full max-w-[1276px] mx-auto p-0 mt-0 flex flex-col" aria-label="GOAT Deals">
      {/* Header Banner */}
      <div className="w-full relative overflow-hidden rounded-none md:rounded-[4px] shadow-sm">
        <img
          src={headerImage}
          alt="G.O.A.T DEALS"
          className="w-full h-auto block object-cover"
          loading="lazy"
        />
      </div>

      {/* 4 Square Deals Grid (Exact 1244x309 container with 0px top padding, 16px horizontal, 18px bottom) */}
      <div className="w-full bg-black pt-0 pb-[18px] px-3 sm:px-4 rounded-b-none md:rounded-b-[4px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {deals.map((deal, i) => (
            <div
              key={deal.id || i}
              className="relative block w-full aspect-square overflow-hidden bg-neutral-900 shadow-sm rounded-[2px]"
            >
              <img
                src={deal.img}
                alt={deal.title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GenZGoatDeals;
