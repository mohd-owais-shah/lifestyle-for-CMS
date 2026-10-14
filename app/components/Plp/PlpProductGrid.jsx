import {useRef} from 'react';
import {PlpProductCard} from './PlpProductCard';
import {PlpScrollProgress} from './PlpScrollProgress';

export function PlpProductGrid({
  products = [],
  isLoading = false,
  onResetFilters,
  hasActiveFilters = false,
}) {
  const gridRef = useRef(null);

  if (products.length === 0 && !isLoading) {
    return (
      <div className="w-full py-16 px-4 text-center bg-gray-50 rounded-sm border border-gray-100 my-4">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
          No matching products found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto">
          We couldn&apos;t find any items matching your selected criteria. Try adjusting or clearing your filters.
        </p>
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-black text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 -mx-4 sm:mx-0 gap-x-[2px] sm:gap-x-4 gap-y-4 sm:gap-y-8">
        {products.map((product, index) => (
          <PlpProductCard
            key={product.id || `plp-product-${index}`}
            product={product}
            loading={index < 8 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <PlpScrollProgress gridRef={gridRef} total={products.length} />
    </div>
  );
}
