import {useEffect} from 'react';

const SORT_OPTIONS = [
  {label: 'New Arrivals', value: 'new-arrivals'},
  {label: 'Discount', value: 'discount'},
  {label: 'Price - Low to High', value: 'price-low-to-high'},
  {label: 'Price - High to Low', value: 'price-high-to-low'},
  {label: 'Relevance', value: 'relevance'},
  {label: 'Alphabetical', value: 'alphabetical'},
  {label: 'Ratings', value: 'ratings'},
];

export function PlpMobileSortDrawer({
  isOpen,
  onClose,
  currentSort = 'relevance',
  onSortChange,
}) {
  // Prevent background scrolling when sort drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (sortValue) => {
    if (onSortChange) {
      onSortChange(sortValue);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex sm:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up / Full-screen Sort Drawer matching Lifestyle Stores */}
      <div className="relative w-full bg-white h-full flex flex-col z-10 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-200 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to products"
            className="p-1 -ml-1 text-gray-800 hover:text-black cursor-pointer"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="flex-1 text-center text-base font-bold text-gray-900 pr-5">
            Sort
          </h2>
        </div>

        {/* Sort Options List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {SORT_OPTIONS.map((option) => {
            const isSelected = currentSort === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span
                  className={`text-sm ${
                    isSelected
                      ? 'font-bold text-black'
                      : 'font-normal text-gray-800'
                  }`}
                >
                  {option.label}
                </span>

                {/* Custom Lifestyle Stores Amber Radio Button */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-2 border-[#FAA619]'
                      : 'border border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FAA619]" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
