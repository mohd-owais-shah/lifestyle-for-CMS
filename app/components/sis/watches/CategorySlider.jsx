import { Link } from 'react-router';

/**
 * 0. CategorySlider (Mobile Category Pills / Circles Carousel)
 */
export function CategorySlider({
  categories = [
    {
      id: 'cat-men',
      title: 'Men',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=150,q=85,fit=cover/LS-Fest/LS-new/LSSIS-WatchesL2-Carousel-Banner1-23Oct24A.png',
      link: '/collections?q=watches-men',
    },
    {
      id: 'cat-women',
      title: 'Women',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=150,q=85,fit=cover/LS-Fest/LS-new/LSSIS-WatchesL2-Carousel-Banner2-23Oct24A.png',
      link: '/collections?q=watches-women',
    },
    {
      id: 'cat-gift',
      title: 'Gift Sets',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=150,q=85,fit=cover/LS-Fest/LS-new/LSSIS-WatchesL2-Carousel-Banner6-23Oct24A.png',
      link: '/collections?q=watches-gift-sets',
    },
    {
      id: 'cat-luxe',
      title: 'Luxe',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=150,q=85,fit=cover/LS-Fest/LS-new/LSSIS-WatchesL2-Carousel-Banner4-23Oct24A.png',
      link: '/collections?q=watches-luxe',
    },
    {
      id: 'cat-kids',
      title: 'Kids',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=150,q=85,fit=cover/LS-Fest/LS-new/LSSIS-WatchesL2-Carousel-Banner5-23Oct24A.png',
      link: '/collections?q=watches-kids',
    },
    {
      id: 'cat-smart',
      title: 'Smart',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=150,q=85,fit=cover/LS-Fest/LS-new/LSSIS-WatchesL2-Carousel-Banner3-23Oct24A.png',
      link: '/collections?q=smartwatches',
    },
  ],
}) {
  return (
    <section className="w-full max-w-[1232px] mx-auto p-0 m-0 py-2 sm:py-3 bg-white" aria-label="Watches Category Navigation">
      <div
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto scroll-smooth no-scrollbar px-3 sm:px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat.id || i}
            className="flex-none flex flex-col items-center group text-center cursor-default"
          >
            <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-sm border border-gray-100 bg-[#F9F9F9] flex items-center justify-center">
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="mt-1.5 text-[11px] sm:text-xs font-semibold text-gray-800 tracking-tight">
              {cat.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySlider;
