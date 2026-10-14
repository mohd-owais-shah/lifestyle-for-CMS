export function PlpActiveFilterChips({
  activeFilters = {},
  priceFilter,
  onRemoveFilter,
  onRemovePriceFilter,
}) {
  const chips = [];

  // Price range active chip (matching Screenshot 1: ₹ 1299 ⟷ ₹ 4187 ✕)
  if (priceFilter) {
    chips.push({
      key: `price-${priceFilter.min}-${priceFilter.max}`,
      label: `₹ ${priceFilter.min} ⟷ ₹ ${priceFilter.max}`,
      onRemove: onRemovePriceFilter,
    });
  }

  // Facet filter chips (Size, Brand, Color, etc. matching Screenshot 2: XS ✕)
  Object.entries(activeFilters).forEach(([groupKey, values]) => {
    if (Array.isArray(values)) {
      values.forEach((val) => {
        chips.push({
          key: `${groupKey}-${val}`,
          label: val,
          onRemove: () => onRemoveFilter && onRemoveFilter(groupKey, val),
        });
      });
    }
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-3.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-50 text-xs text-gray-800 rounded-full border border-gray-300 transition-colors"
        >
          <span className="font-normal">{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
            className="text-gray-400 hover:text-black font-normal text-xs cursor-pointer ml-1"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}
