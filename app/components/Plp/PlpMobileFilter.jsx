import {useState, useEffect} from 'react';
import {PlpPriceRangeSlider} from './PlpPriceRangeSlider';

const COLOR_MAP = {
  black: '#000000',
  white: '#FFFFFF',
  blue: '#005BD3',
  navy: '#1E2952',
  beige: '#EAD8AB',
  brown: '#795548',
  green: '#05AA3D',
  grey: '#9E9E9E',
  gray: '#9E9E9E',
  maroon: '#800000',
  orange: '#FF9800',
  pink: '#F472B6',
  purple: '#9C27B0',
  red: '#E11D48',
  yellow: '#FFE500',
  multicolor: 'linear-gradient(135deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF)',
  multi: 'linear-gradient(135deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF)',
  olive: '#808000',
  peach: '#FFDAB9',
  khaki: '#F0E68C',
  charcoal: '#36454F',
  cream: '#FFFDD0',
  teal: '#008080',
  burgundy: '#800020',
  mustard: '#FFDB58',
  rust: '#B7410E',
  coral: '#FF7F50',
  lavender: '#E6E6FA',
  magenta: '#FF00FF',
  turquoise: '#40E0D0',
};

function getColorStyle(option, filterData, key) {
  const isColor =
    filterData.presentation === 'SWATCH' ||
    Boolean(option.swatch) ||
    key.toLowerCase().includes('color') ||
    key.toLowerCase().includes('colour') ||
    (filterData.title || '').toLowerCase().includes('color');

  if (!isColor) return null;

  if (option.swatch?.image?.previewImage?.url) {
    return {
      backgroundImage: `url(${option.swatch.image.previewImage.url})`,
      backgroundSize: 'cover',
    };
  }

  if (option.swatch?.color) {
    return {backgroundColor: option.swatch.color};
  }

  const name = (option.label || '').toLowerCase().trim();
  const hex = COLOR_MAP[name];
  if (hex) {
    if (hex.startsWith('linear-gradient')) {
      return {background: hex};
    }
    return {backgroundColor: hex};
  }

  return {backgroundColor: '#CCCCCC'};
}

export function PlpMobileFilter({
  isOpen,
  onClose,
  availableFilters = {},
  activeFilters = {},
  onFilterChange,
  onClearAll,
  priceRange = {min: 0, max: 10000},
  currentPriceRange,
  onPriceChange,
  totalMatchingProducts = 0,
}) {
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent background scrolling when mobile filter drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveCategoryKey(null);
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getSelectedValues = (key, catData) => {
    if (activeFilters[key] && activeFilters[key].length > 0) {
      return activeFilters[key];
    }
    const catTitle = (catData?.title || key || '').toLowerCase();
    for (const [k, vals] of Object.entries(activeFilters)) {
      const lowerK = k.toLowerCase();
      if (
        (catTitle.includes('size') && lowerK.includes('size')) ||
        (catTitle.includes('brand') && (lowerK.includes('brand') || lowerK.includes('vendor'))) ||
        (catTitle.includes('color') && (lowerK.includes('color') || lowerK.includes('colour'))) ||
        (catTitle.includes('browse') && (lowerK.includes('browse') || lowerK.includes('type') || lowerK.includes('category'))) ||
        (catTitle.includes('discount') && lowerK.includes('discount')) ||
        (catTitle.includes('gender') && lowerK.includes('gender'))
      ) {
        if (vals && vals.length > 0) return vals;
      }
    }
    return [];
  };

  const handleCheckboxToggle = (filterKey, value) => {
    if (!onFilterChange) return;
    const currentList = getSelectedValues(filterKey, activeCategoryData);
    const isSelected = currentList.includes(value);
    const updated = isSelected
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];
    onFilterChange(filterKey, updated);
  };

  const handleClearCategory = (filterKey) => {
    if (filterKey === 'price') {
      if (onPriceChange) onPriceChange(null);
    } else if (onFilterChange) {
      onFilterChange(filterKey, []);
      const catTitle = (activeCategoryData?.title || filterKey || '').toLowerCase();
      for (const k of Object.keys(activeFilters)) {
        if (
          (catTitle.includes('size') && k.toLowerCase().includes('size')) ||
          (catTitle.includes('brand') && (k.toLowerCase().includes('brand') || k.toLowerCase().includes('vendor'))) ||
          (catTitle.includes('color') && (k.toLowerCase().includes('color') || k.toLowerCase().includes('colour'))) ||
          (catTitle.includes('discount') && k.toLowerCase().includes('discount'))
        ) {
          if (k !== filterKey) {
            onFilterChange(k, []);
          }
        }
      }
    }
  };



  // Active category data if drilldown is open
  const activeCategoryData = activeCategoryKey
    ? availableFilters[activeCategoryKey]
    : null;

  // Unified sorted category entries matching Lifestyle Stores mobile order (Image 3)
  const sortedCategoryEntries = Object.entries(availableFilters).map(([key, filterData]) => ({
      key,
      title: filterData.title || key,
      filterData,
      isPrice: false,
    }));

  // Include Price entry
  sortedCategoryEntries.push({
    key: 'price',
    title: 'Price',
    filterData: null,
    isPrice: true,
  });

  // Priority order matching live site screenshot: Size, Browse, Brand, Color, Gender, Country Of Origin, Price, Discount, Type, Promotions
  const categoryPriority = [
    'size',
    'browse',
    'category',
    'brand',
    'vendor',
    'color',
    'colour',
    'gender',
    'country',
    'price',
    'discount',
    'type',
    'promotions',
    'promo',
    'fabric',
    'design',
    'sleeve',
    'fit',
    'availability',
  ];

  sortedCategoryEntries.sort((a, b) => {
    const aLower = a.title.toLowerCase();
    const bLower = b.title.toLowerCase();
    const aIdx = categoryPriority.findIndex((p) => aLower.includes(p));
    const bIdx = categoryPriority.findIndex((p) => bLower.includes(p));
    const aScore = aIdx === -1 ? 999 : aIdx;
    const bScore = bIdx === -1 ? 999 : bIdx;
    return aScore - bScore;
  });

  const isDiscountCategory =
    (activeCategoryKey || '').toLowerCase().includes('discount') ||
    (activeCategoryData?.title || '').toLowerCase().includes('discount');

  const isSizeCategory =
    (activeCategoryKey || '').toLowerCase().includes('size') ||
    (activeCategoryData?.title || '').toLowerCase().includes('size');

  const isColorCategory =
    (activeCategoryKey || '').toLowerCase().includes('color') ||
    (activeCategoryKey || '').toLowerCase().includes('colour') ||
    (activeCategoryData?.title || '').toLowerCase().includes('color') ||
    (activeCategoryData?.title || '').toLowerCase().includes('colour') ||
    activeCategoryData?.presentation === 'SWATCH';

  return (
    <div className="fixed inset-0 z-50 flex sm:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Full-screen Filter Drawer matching Lifestyle Stores */}
      <div className="relative w-full bg-white h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* ROOT CATEGORIES VIEW (Matching Live Site Screenshot) */}
        {!activeCategoryKey ? (
          <>
            {/* Header: Close button, Filter title, Clear All */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-base font-bold text-gray-900">
                Filter
              </h2>

              <button
                type="button"
                onClick={onClearAll}
                className="text-xs sm:text-sm font-semibold text-[#FAA619] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* List of Filter Categories */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
              {sortedCategoryEntries.map((cat) => {
                if (cat.isPrice) {
                  const hasPriceActive =
                    currentPriceRange &&
                    (currentPriceRange.min > priceRange.min ||
                      currentPriceRange.max < priceRange.max);

                  return (
                    <button
                      type="button"
                      key="price"
                      onClick={() => {
                        setActiveCategoryKey('price');
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          Price
                        </span>
                        {hasPriceActive && (
                          <span className="w-2 h-2 rounded-full bg-[#FAA619]" />
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  );
                }

                const selected = getSelectedValues(cat.key, cat.filterData);
                const activeCount = selected.length;

                return (
                  <button
                    type="button"
                    key={cat.key}
                    onClick={() => {
                      setActiveCategoryKey(cat.key);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {cat.title}
                      </span>
                      {activeCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FAA619] text-white">
                          {activeCount}
                        </span>
                      )}
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Sticky Bottom Apply Action Button */}
            <div className="p-3 border-t border-gray-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-[#FAA619] hover:bg-[#e09514] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer text-center"
              >
                SEE ALL {totalMatchingProducts} PRODUCTS
              </button>
            </div>
          </>
        ) : (
          /* DRILL-DOWN CATEGORY OPTIONS VIEW */
          <>
            {/* Header: Back button, Title, Clear Category */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryKey(null);
                  setSearchQuery('');
                }}
                aria-label="Back to categories"
                className="p-1 -ml-1 text-gray-800 hover:text-black cursor-pointer flex items-center gap-1"
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

              <h2 className="text-base font-bold text-gray-900">
                {activeCategoryKey === 'price'
                  ? 'Price'
                  : activeCategoryData?.title || activeCategoryKey}
              </h2>

              <button
                type="button"
                onClick={() => handleClearCategory(activeCategoryKey)}
                className="text-xs font-semibold text-[#FAA619] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Drilldown Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-white">
              {activeCategoryKey === 'price' ? (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm font-medium text-gray-900 pb-3">
                    <span>Price</span>
                    <span className="text-gray-500 font-normal text-xs">
                      ₹{currentPriceRange?.min ?? priceRange.min} - ₹{currentPriceRange?.max ?? priceRange.max}
                    </span>
                  </div>
                  <PlpPriceRangeSlider
                    min={priceRange.min}
                    max={priceRange.max}
                    currentMin={currentPriceRange?.min}
                    currentMax={currentPriceRange?.max}
                    onApply={(range) => {
                      if (onPriceChange) onPriceChange(range);
                      setActiveCategoryKey(null);
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Search box with light gray background matching Live Site */}
                  <div className="relative mb-3">
                    <svg
                      className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none"
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
                    <input
                      type="text"
                      placeholder={`Search ${(activeCategoryData?.title || 'options').toLowerCase()}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#F0F0F0] text-gray-800 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FAA619]"
                    />
                  </div>

                  {/* 1. SIZE FACET: 4-Column Grid matching Screenshot 4 & 5 */}
                  {isSizeCategory ? (
                    <div className="grid grid-cols-4 gap-2.5 my-3">
                      {(activeCategoryData?.options || [])
                        .filter((opt) =>
                          searchQuery
                            ? opt.label
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            : true,
                        )
                        .map((option) => {
                          const selectedValues = getSelectedValues(
                            activeCategoryKey,
                            activeCategoryData,
                          );
                          const isChecked = selectedValues.includes(
                            option.value,
                          );
                          return (
                            <button
                              type="button"
                              key={option.value}
                              onClick={() =>
                                handleCheckboxToggle(
                                  activeCategoryKey,
                                  option.value,
                                )
                              }
                              className={`py-2.5 px-1 text-center rounded-xs transition-colors cursor-pointer text-xs font-semibold ${
                                isChecked
                                  ? 'border-2 border-[#FAA619] bg-white text-[#FAA619] font-bold'
                                  : 'border border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                    </div>
                  ) : isDiscountCategory ? (
                    /* 2. DISCOUNT FACET: Radio buttons on the right matching Screenshot */
                    <div className="divide-y divide-gray-100">
                      {(activeCategoryData?.options || [])
                        .filter((opt) =>
                          searchQuery
                            ? opt.label
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            : true,
                        )
                        .map((option) => {
                          const selectedValues = getSelectedValues(
                            activeCategoryKey,
                            activeCategoryData,
                          );
                          const isSelected = selectedValues.includes(
                            option.value,
                          );

                          return (
                            <button
                              type="button"
                              key={option.value}
                              onClick={() => {
                                // Single select for discount radio button
                                if (isSelected) {
                                  handleClearCategory(activeCategoryKey);
                                } else {
                                  onFilterChange &&
                                    onFilterChange(activeCategoryKey, [
                                      option.value,
                                    ]);
                                }
                              }}
                              className="w-full flex items-center justify-between py-3.5 cursor-pointer select-none group text-left"
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-sm ${
                                    isSelected
                                      ? 'font-bold text-gray-900'
                                      : 'font-normal text-gray-800'
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {option.count != null && (
                                  <span className="text-gray-400 text-xs font-normal">
                                    ({option.count})
                                  </span>
                                )}
                              </div>

                              {/* Radio Button on the right */}
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? 'border-2 border-[#FAA619] bg-white'
                                    : 'border border-gray-400 bg-white group-hover:border-gray-600'
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#FAA619]" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    /* 3. LIST FACETS (Brand, Color, Browse, Gender, Country, Type, Promotions): Right-aligned Checkbox */
                    <div className="divide-y divide-gray-100">
                      {(activeCategoryData?.options || [])
                        .filter((opt) =>
                          searchQuery
                            ? opt.label
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            : true,
                        )
                        .map((option) => {
                          const selectedValues = getSelectedValues(
                            activeCategoryKey,
                            activeCategoryData,
                          );
                          const isChecked = selectedValues.includes(
                            option.value,
                          );
                          const colorStyle = isColorCategory
                            ? getColorStyle(
                                option,
                                activeCategoryData,
                                activeCategoryKey,
                              )
                            : null;

                          return (
                            <button
                              type="button"
                              key={option.value}
                              onClick={() =>
                                handleCheckboxToggle(
                                  activeCategoryKey,
                                  option.value,
                                )
                              }
                              className="w-full flex items-center justify-between py-3.5 cursor-pointer select-none group text-left"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {/* Color horizontal pill swatch preview on left */}
                                {colorStyle && (
                                  <span
                                    className="w-5 h-1.5 rounded-full border border-black/10 shrink-0"
                                    style={colorStyle}
                                  />
                                )}

                                <span
                                  className={`text-sm truncate ${
                                    isChecked
                                      ? 'font-bold text-black'
                                      : 'font-normal text-gray-800'
                                  }`}
                                >
                                  {option.label}
                                </span>

                                {option.count != null && (
                                  <span className="text-gray-400 text-xs font-normal shrink-0">
                                    ({option.count})
                                  </span>
                                )}
                              </div>

                              {/* Square Checkbox on the right matching Live Site */}
                              <div
                                className={`w-5 h-5 rounded-xs flex items-center justify-center shrink-0 transition-colors ml-3 ${
                                  isChecked
                                    ? 'bg-[#FAA619] border border-[#FAA619] text-white'
                                    : 'bg-white border border-gray-300 group-hover:border-gray-500'
                                }`}
                              >
                                {isChecked && (
                                  <svg
                                    className="w-3 h-3 fill-current"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M16.707 5.293a1 1 0 011.414 0l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Sticky Action Button in drill-down view */}
            <div className="p-3 border-t border-gray-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-[#FAA619] hover:bg-[#e09514] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer text-center"
              >
                SEE ALL {totalMatchingProducts} PRODUCTS
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
