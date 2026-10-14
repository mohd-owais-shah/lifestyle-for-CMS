import {useState} from 'react';
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

export function PlpFilterSidebar({
  availableFilters = {},
  activeFilters = {},
  onFilterChange,
  onClearAll,
  priceRange = {min: 0, max: 10000},
  currentPriceRange,
  onPriceChange,
}) {
  // Track explicitly opened/closed sections
  const [openSections, setOpenSections] = useState({
    price: true,
  });

  // Track expanded '+ More' sections
  const [expandedSections, setExpandedSections] = useState({});

  // Search filter query per section (e.g. search in Brand or Browse)
  const [searchQueries, setSearchQueries] = useState({});
  const [activeSearchBars, setActiveSearchBars] = useState({});

  const isDefaultOpen = (key) => {
    if (key.toLowerCase().includes('price')) return true;
    const selected = activeFilters[key];
    if (selected && selected.length > 0) return true;
    return false;
  };

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => {
      const current = prev[sectionKey] !== undefined ? prev[sectionKey] : isDefaultOpen(sectionKey);
      return {
        ...prev,
        [sectionKey]: !current,
      };
    });
  };

  const toggleExpand = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleSearchBar = (sectionKey) => {
    setActiveSearchBars((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleCheckboxToggle = (filterKey, value) => {
    if (!onFilterChange) return;
    const currentList = activeFilters[filterKey] || [];
    const isSelected = currentList.includes(value);
    const updated = isSelected
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];
    onFilterChange(filterKey, updated);
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header with 'Clear all' action in brand amber color */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900">
          FILTERS
        </h2>
        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-[#FAA619] hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {/* 2. Price Filter matching Live Screenshot (Always open) */}
        <div className="py-3.5">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs sm:text-[13px] font-bold text-gray-900">
              Price
            </span>
          </div>

          <div className="mt-1">
            <PlpPriceRangeSlider
              min={priceRange.min}
              max={priceRange.max}
              currentMin={currentPriceRange?.min}
              currentMax={currentPriceRange?.max}
              onApply={(range) => {
                if (onPriceChange) onPriceChange(range);
              }}
            />
          </div>
        </div>

        {/* 3. Filter Accordion Sections matching Live Site Screenshot */}
        {Object.entries(availableFilters).map(([key, filterData], index) => {
          const isOpen = openSections[key] !== undefined ? openSections[key] : isDefaultOpen(key, index);
          const selectedValues = activeFilters[key] || [];
          const isExpanded = Boolean(expandedSections[key]);
          const isSearchOpen = Boolean(activeSearchBars[key]);
          const query = searchQueries[key] || '';

          let options = filterData.options || [];
          if (query) {
            options = options.filter((o) =>
              o.label.toLowerCase().includes(query.toLowerCase()),
            );
          }

          const visibleOptions = isExpanded ? options : options.slice(0, 5);
          const hiddenCount = options.length - 5;

          return (
            <div key={key} className="py-3.5">
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  onClick={() => toggleSection(key, index)}
                  className="flex items-center gap-2 cursor-pointer text-left flex-1"
                >
                  <span className="text-xs sm:text-[13px] font-bold text-gray-900">
                    {filterData.title || key}
                  </span>
                  {selectedValues.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                      {selectedValues.length}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2.5">
                  {/* Search Icon button for large lists */}
                  {isOpen && filterData.hasSearch !== false && options.length > 4 && (
                    <button
                      type="button"
                      onClick={() => toggleSearchBar(key)}
                      aria-label={`Search in ${filterData.title || key}`}
                      className="text-gray-500 hover:text-black cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleSection(key, index)}
                    aria-label={`Toggle ${filterData.title || key}`}
                    className="text-gray-500 hover:text-black cursor-pointer p-0.5"
                  >
                    {isOpen ? (
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-2.5">
                  {/* Inline Search Bar */}
                  {isSearchOpen && (
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder={`Search ${filterData.title || key}...`}
                        value={query}
                        onChange={(e) =>
                          setSearchQueries((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-xs focus:border-[#FAA619] focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Checkbox Options */}
                  <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
                    {visibleOptions.map((option) => {
                      const isChecked = selectedValues.includes(option.value);
                      const colorStyle = getColorStyle(option, filterData, key);
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 text-xs text-gray-800 hover:text-black cursor-pointer py-0.5 group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxToggle(key, option.value)}
                            className="sr-only"
                          />
                          {/* Styled Lifestyle Stores Checkbox (Amber when checked) */}
                          <span
                            aria-hidden="true"
                            className={`w-4 h-4 flex items-center justify-center rounded-xs border transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-[#FAA619] border-[#FAA619] text-white'
                                : 'bg-white border-gray-400 group-hover:border-gray-600'
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="w-2.5 h-2.5 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            )}
                          </span>

                          {/* Color Swatch Circle Preview */}
                          {colorStyle && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0 shadow-2xs"
                              style={colorStyle}
                            />
                          )}

                          {/* Label and Count inline matching live site screenshot */}
                          <span className={`text-xs ${isChecked ? 'font-bold text-black' : 'text-gray-800'}`}>
                            {option.label}
                          </span>
                          {option.count != null && (
                            <span className="text-gray-400 text-[11px] font-normal">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Expand / Collapse Button (+ X More) */}
                  {hiddenCount > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(key)}
                      className="mt-2.5 text-xs font-bold text-[#FAA619] hover:underline cursor-pointer block text-left"
                    >
                      {isExpanded ? '− Show Less' : `+ ${hiddenCount} More`}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
