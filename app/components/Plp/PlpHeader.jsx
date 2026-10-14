import {useState} from 'react';
import {Link} from 'react-router';
import {SearchModal} from '~/components/SearchModal';

export function PlpHeader({
  title = 'Products',
  totalCount = 0,
  subcategories = [],
  activeSubcategory = '',
  onSubcategorySelect,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* 1. MOBILE PLP TOP HEADER (Matching Live Site Screenshot 1) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between -mx-4 sm:-mx-6">
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Back"
            className="p-1 -ml-1 text-gray-900 cursor-pointer shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-gray-900">
          {/* Search Icon */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="cursor-pointer text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/account/favourites"
            prefetch="intent"
            aria-label="Wishlist"
            className="cursor-pointer text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </Link>

          {/* Cart Bag Icon */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="cursor-pointer text-gray-900 relative"
          >
            <svg viewBox="640 154 20 19" className="w-5 h-5 fill-current">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M655.143 160.25H656.227C657.081 160.25 657.804 160.86 657.925 161.681L659.149 170.014C659.283 170.926 658.632 171.77 657.694 171.9C657.614 171.911 657.533 171.917 657.452 171.917H642.548C641.601 171.917 640.833 171.17 640.833 170.25C640.833 170.171 640.839 170.092 640.85 170.014L642.075 161.681C642.196 160.86 642.919 160.25 643.772 160.25H644.857C644.857 157.489 647.159 155.25 650 155.25C652.84 155.25 655.143 157.489 655.143 160.25ZM646.571 160.25H653.428C653.428 158.409 651.893 156.917 650 156.917C648.106 156.917 646.571 158.409 646.571 160.25ZM642.548 170.25L643.772 161.917H656.227L657.452 170.25H642.548Z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* 2. MOBILE COUNT & SUBCATEGORY PILLS (Matching Live Site Screenshot 1) */}
      <div className="lg:hidden pt-3 pb-2">
        <div className="text-xs text-gray-500 font-medium mb-3">
          {totalCount} Products
        </div>

        {Array.isArray(subcategories) && subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {subcategories.map((subcat) => {
              const isActive =
                activeSubcategory === subcat.handle ||
                activeSubcategory === subcat.name;
              return (
                <button
                  type="button"
                  key={subcat.name}
                  onClick={() =>
                    onSubcategorySelect && onSubcategorySelect(subcat)
                  }
                  className={`shrink-0 px-4 py-2 text-xs font-semibold rounded-xs border transition-colors cursor-pointer ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-500'
                  }`}
                >
                  {subcat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Predictive Search Modal Component */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
