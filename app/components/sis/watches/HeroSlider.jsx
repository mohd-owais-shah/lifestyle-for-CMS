import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

/**
 * 1. HeroSlider (10 Hero Banners Full-Width Responsive Carousel)
 */
export function HeroSlider({
  banners = [
    {
      id: 'hero-1',
      title: 'Watches Hero 1',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner5-30Sep26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner5-30Sep26.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-2',
      title: 'Watches Hero 2',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner10-14Jul26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner10-14Jul26.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-3',
      title: 'Watches Hero 3',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner3-18Jun26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner3-18Jun26.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-4',
      title: 'Watches Hero 4',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner2-04May26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner2-04May26.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-5',
      title: 'Watches Hero 5',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner9-20Jan26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner9-20Jan26.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-6',
      title: 'Watches Hero 6',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner8-25May26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner8-25May26.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-7',
      title: 'Watches Hero 7',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner1-16Apr26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner1-16Apr26.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-8',
      title: 'Watches Hero 8',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner7-12Nov25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner7-12Nov25.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-9',
      title: 'Watches Hero 9',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner4-06Oct25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner4-06Oct25.jpg',
      link: '/collections?q=watches',
    },
    {
      id: 'hero-10',
      title: 'Watches Hero 10',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-HeroBanner6-03Apr25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-HeroBanner6-03Apr25.jpg',
      link: '/collections?q=watches',
    },
  ],
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  // Auto-play every 4 seconds when not hovered
  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, banners.length]);

  return (
    <section
      className="w-full max-w-[1232px] mx-auto p-0 m-0 relative overflow-hidden group"
      aria-label="Watches Hero Banner Slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container (Aspect: Mobile 668/557, Desktop 1232/415) */}
      <div className="relative w-full aspect-[668/557] md:aspect-[1232/415] overflow-hidden bg-neutral-900">
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <picture className="w-full h-full block">
              <source media="(min-width: 768px)" srcSet={banner.desktopImg} />
              <img
                src={banner.mobileImg || banner.desktopImg}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        type="button"
        aria-label="Previous Hero Slide"
        onClick={prevSlide}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg items-center justify-center text-gray-800 hover:text-black border border-gray-100 transition-all cursor-pointer backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        type="button"
        aria-label="Next Hero Slide"
        onClick={nextSlide}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg items-center justify-center text-gray-800 hover:text-black border border-gray-100 transition-all cursor-pointer backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicator Dots (Exact Live Site Match: 4x4px, #C8C9C6, 0px 2px margin) */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrentIndex(i)}
            className={`mx-[2px] transition-all duration-300 rounded-full cursor-pointer p-0 border-none outline-none ${
              i === currentIndex
                ? 'w-[18px] h-[4px] bg-black'
                : 'w-[4px] h-[4px] bg-[#C8C9C6] hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;
