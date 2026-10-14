import {useState, useMemo, useEffect} from 'react';
import {Link, useSearchParams} from 'react-router';
import {PlpHeader} from './PlpHeader';
import {PlpFilterSidebar} from './PlpFilterSidebar';
import {PlpProductGrid} from './PlpProductGrid';
import {PlpMobileFilter} from './PlpMobileFilter';
import {PlpMobileSortDrawer} from './PlpMobileSortDrawer';
import {PlpActiveFilterChips} from './PlpActiveFilterChips';
import {PlpSortDropdown} from './PlpSortDropdown';

// Helper to extract all sizes from a product
function getProductSizes(p) {
  const sizes = new Set();
  (p.variants?.nodes || []).forEach((v) => {
    (v.selectedOptions || []).forEach((opt) => {
      if (opt.name.toLowerCase() === 'size') {
        sizes.add(opt.value.toUpperCase().trim());
      }
    });
    if (v.title && v.title !== 'Default Title') {
      sizes.add(v.title.toUpperCase().trim());
    }
  });
  if (p.selectedOrFirstAvailableVariant) {
    (p.selectedOrFirstAvailableVariant.selectedOptions || []).forEach((opt) => {
      if (opt.name.toLowerCase() === 'size') {
        sizes.add(opt.value.toUpperCase().trim());
      }
    });
  }
  (p.tags || []).forEach((t) => {
    sizes.add(t.toUpperCase().trim());
  });
  return sizes;
}

// Helper to test if product matches any selected size filter value
function matchesSize(p, selectedValues) {
  const productSizes = getProductSizes(p);
  return selectedValues.some((selectedVal) => {
    const raw = selectedVal.toUpperCase().trim();
    if (productSizes.has(raw)) return true;

    // Check parenthesis content, e.g. "SMALL (S)" -> "S"
    const parenMatch = raw.match(/\(([^)]+)\)/);
    if (parenMatch && productSizes.has(parenMatch[1].trim())) {
      return true;
    }

    // Check text before parenthesis, e.g. "SMALL (S)" -> "SMALL"
    const textBefore = raw.replace(/\s*\([^)]*\)/, '').trim();
    if (textBefore && productSizes.has(textBefore)) {
      return true;
    }

    const SIZE_ALIASES = {
      'EXTRA SMALL': ['XS'],
      'SMALL': ['S'],
      'MEDIUM': ['M'],
      'LARGE': ['L'],
      'EXTRA LARGE': ['XL'],
      'DOUBLE EXTRA LARGE': ['XXL', '2XL'],
      'TRIPLE EXTRA LARGE': ['XXXL', '3XL'],
      'XS': ['EXTRA SMALL'],
      'S': ['SMALL'],
      'M': ['MEDIUM'],
      'L': ['LARGE'],
      'XL': ['EXTRA LARGE'],
      'XXL': ['DOUBLE EXTRA LARGE', '2XL'],
    };

    const aliases = SIZE_ALIASES[textBefore] || SIZE_ALIASES[raw] || [];
    for (const a of aliases) {
      if (productSizes.has(a)) return true;
    }

    for (const pSize of productSizes) {
      if (raw === pSize || raw.includes(pSize) || pSize.includes(raw)) return true;
    }

    return false;
  });
}

// Helper to extract colors
function getProductColors(p) {
  const colors = new Set();
  (p.variants?.nodes || []).forEach((v) => {
    (v.selectedOptions || []).forEach((opt) => {
      if (opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour') {
        colors.add(opt.value.toLowerCase().trim());
      }
    });
  });
  if (p.selectedOrFirstAvailableVariant) {
    (p.selectedOrFirstAvailableVariant.selectedOptions || []).forEach((opt) => {
      if (opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour') {
        colors.add(opt.value.toLowerCase().trim());
      }
    });
  }
  (p.tags || []).forEach((t) => {
    colors.add(t.toLowerCase().trim());
  });
  return colors;
}

function matchesColor(p, selectedValues) {
  const productColors = getProductColors(p);
  const title = (p.title || '').toLowerCase();
  return selectedValues.some((val) => {
    const target = val.toLowerCase().trim();
    if (productColors.has(target)) return true;
    for (const pc of productColors) {
      if (pc.includes(target) || target.includes(pc)) return true;
    }
    if (title.includes(target)) return true;
    return false;
  });
}

export function PlpView({
  collection,
  initialProducts = [],
  breadcrumbs = [],
  subcategories = [],
  storefrontFilters = [],
  categoryBanner,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(() => searchParams.get('subcat') || '');

  // Helper to extract active filters from search params
  const parseActiveFiltersFromParams = (params) => {
    const parsed = {};
    for (const [key, val] of params.entries()) {
      if (
        ![
          'q',
          'sort_by',
          'min_price',
          'max_price',
          'subcat',
          'cursor',
          'direction',
          'filters',
        ].includes(key)
      ) {
        parsed[key] = val.split(',').filter(Boolean);
      }
    }

    const qParam = params.get('q') || '';
    if (qParam.includes(':')) {
      const parts = qParam.split(':');
      for (let i = 1; i < parts.length; i += 2) {
        const rawKey = (parts[i] || '').toLowerCase();
        const rawVal = parts[i + 1] || '';
        if (rawVal) {
          let targetKey = rawKey;
          if (rawKey.includes('size')) targetKey = 'size';
          else if (rawKey.includes('brand') || rawKey.includes('vendor')) targetKey = 'brand';
          else if (rawKey.includes('color') || rawKey.includes('colour')) targetKey = 'color';
          else if (rawKey.includes('gender')) targetKey = 'gender';
          else if (rawKey.includes('discount')) targetKey = 'discount';
          else if (rawKey.includes('browse') || rawKey.includes('category')) targetKey = 'browse';

          if (!parsed[targetKey]) {
            parsed[targetKey] = [];
          }
          if (!parsed[targetKey].includes(rawVal)) {
            parsed[targetKey].push(rawVal);
          }
        }
      }
    }

    return parsed;
  };

  const [activeFilters, setActiveFilters] = useState(() =>
    parseActiveFiltersFromParams(searchParams),
  );

  const [priceFilter, setPriceFilter] = useState(() => {
    const min = searchParams.get('min_price');
    const max = searchParams.get('max_price');
    if (min || max) {
      return {
        min: min ? parseFloat(min) : 0,
        max: max ? parseFloat(max) : 10000,
      };
    }
    return null;
  });

  // Keep state synchronized with URL search params upon navigation
  useEffect(() => {
    setActiveFilters(parseActiveFiltersFromParams(searchParams));

    const min = searchParams.get('min_price');
    const max = searchParams.get('max_price');
    if (min || max) {
      setPriceFilter({
        min: min ? parseFloat(min) : 0,
        max: max ? parseFloat(max) : 10000,
      });
    } else {
      setPriceFilter(null);
    }

    setActiveSubcategory(searchParams.get('subcat') || '');
  }, [searchParams]);

  // Current sort selection from URL or default
  const currentSort = searchParams.get('sort_by') || 'relevance';

  const handleSortChange = (newSort) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newSort === 'relevance') {
      nextParams.delete('sort_by');
    } else {
      nextParams.set('sort_by', newSort);
    }
    setSearchParams(nextParams);
  };

  // Derive all facet options and price min/max dynamically from the products or Search & Discovery app
  const {availableFilters, globalPriceRange} = useMemo(() => {
    // 1. Calculate price range from initial products
    let minP = Infinity;
    let maxP = -Infinity;

    initialProducts.forEach((p) => {
      const price = parseFloat(
        p.priceRange?.minVariantPrice?.amount ||
        p.selectedOrFirstAvailableVariant?.price?.amount ||
        '0',
      );
      if (!isNaN(price) && price > 0) {
        if (price < minP) minP = price;
        if (price > maxP) maxP = price;
      }
    });

    const safeMin = minP === Infinity ? 0 : Math.floor(minP);
    const safeMax = maxP === -Infinity ? 10000 : Math.ceil(maxP);

    // 2. Dynamic Search & Discovery filters directly from GraphQL query response
    // 2. Dynamic Search & Discovery filters directly from GraphQL query response
    const rawParsedFilters = {};
    let storefrontMinP = safeMin;
    let storefrontMaxP = safeMax;

    if (storefrontFilters && Array.isArray(storefrontFilters)) {
      storefrontFilters.forEach((filter) => {
        if (filter.type === 'PRICE_RANGE') {
          const valObj = filter.values?.[0]?.input
            ? typeof filter.values[0].input === 'string'
              ? JSON.parse(filter.values[0].input)
              : filter.values[0].input
            : null;
          if (valObj?.price) {
            if (valObj.price.min != null) storefrontMinP = Math.floor(valObj.price.min);
            if (valObj.price.max != null) storefrontMaxP = Math.ceil(valObj.price.max);
          }
        } else {
          // Normalize key and label
          let normKey = filter.id;
          const rawLabel = (filter.label || filter.id).trim();
          let title = rawLabel;

          // Standardize titles to Title Case
          if (rawLabel.toLowerCase().includes('color') || rawLabel.toLowerCase().includes('colour')) {
            normKey = 'color';
            title = 'Color';
          } else if (rawLabel.toLowerCase().includes('size')) {
            normKey = 'size';
            title = 'Size';
          } else if (rawLabel.toLowerCase().includes('brand') || rawLabel.toLowerCase().includes('vendor')) {
            normKey = 'brand';
            title = 'Brand';
          } else if (rawLabel.toLowerCase().includes('fabric')) {
            normKey = 'fabric';
            title = 'Fabric';
          } else if (rawLabel.toLowerCase().includes('gender')) {
            normKey = 'gender';
            title = 'Gender';
          } else if (rawLabel.toLowerCase().includes('country')) {
            normKey = 'country_of_origin';
            title = 'Country Of Origin';
          } else if (rawLabel.toLowerCase().includes('design')) {
            normKey = 'design';
            title = 'Design';
          } else if (rawLabel.toLowerCase().includes('sleeve')) {
            normKey = 'sleeve_length';
            title = 'Sleeve Length';
          } else if (rawLabel.toLowerCase().includes('type')) {
            normKey = 'type';
            title = 'Type';
          } else if (rawLabel.toLowerCase().includes('fit')) {
            normKey = 'fit';
            title = 'Fit';
          }

          if (filter.values && filter.values.length > 0) {
            const newOptions = filter.values.map((v) => ({
              id: v.id,
              label: v.label,
              value: v.label,
              count: v.count,
              input: v.input,
              swatch: v.swatch,
            }));

            if (rawParsedFilters[normKey]) {
              // Merge options without duplicates
              const existingOptions = rawParsedFilters[normKey].options || [];
              const existingLabels = new Set(existingOptions.map((o) => o.label.toLowerCase()));
              newOptions.forEach((opt) => {
                if (!existingLabels.has(opt.label.toLowerCase())) {
                  existingOptions.push(opt);
                  existingLabels.add(opt.label.toLowerCase());
                }
              });
              rawParsedFilters[normKey].options = existingOptions;
            } else {
              rawParsedFilters[normKey] = {
                id: normKey,
                title,
                type: filter.type,
                presentation: filter.presentation,
                options: newOptions,
              };
            }
          }
        }
      });
    }

    // 3. Fallback / supplement facets from initial products
    if (initialProducts.length > 0) {
      // Brand
      if (!rawParsedFilters.brand) {
        const vendorCounts = {};
        initialProducts.forEach((p) => {
          if (p.vendor) {
            const v = p.vendor.trim();
            vendorCounts[v] = (vendorCounts[v] || 0) + 1;
          }
        });
        if (Object.keys(vendorCounts).length > 0) {
          rawParsedFilters.brand = {
            id: 'brand',
            title: 'Brand',
            type: 'LIST',
            options: Object.entries(vendorCounts).map(([label, count]) => ({
              id: label,
              label,
              value: label,
              count,
            })),
          };
        }
      }

      // Size from variants
      if (!rawParsedFilters.size) {
        const sizeCounts = {};
        initialProducts.forEach((p) => {
          (p.variants?.nodes || []).forEach((v) => {
            (v.selectedOptions || []).forEach((opt) => {
              if (opt.name.toLowerCase() === 'size') {
                const s = opt.value.trim();
                sizeCounts[s] = (sizeCounts[s] || 0) + 1;
              }
            });
          });
        });
        if (Object.keys(sizeCounts).length > 0) {
          rawParsedFilters.size = {
            id: 'size',
            title: 'Size',
            type: 'LIST',
            options: Object.entries(sizeCounts).map(([label, count]) => ({
              id: label,
              label,
              value: label,
              count,
            })),
          };
        }
      }

      // Color from variants
      if (!rawParsedFilters.color) {
        const colorCounts = {};
        initialProducts.forEach((p) => {
          (p.variants?.nodes || []).forEach((v) => {
            (v.selectedOptions || []).forEach((opt) => {
              if (opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour') {
                const c = opt.value.trim();
                colorCounts[c] = (colorCounts[c] || 0) + 1;
              }
            });
          });
        });
        if (Object.keys(colorCounts).length > 0) {
          rawParsedFilters.color = {
            id: 'color',
            title: 'Color',
            type: 'LIST',
            options: Object.entries(colorCounts).map(([label, count]) => ({
              id: label,
              label,
              value: label,
              count,
            })),
          };
        }
      }

      // Dynamic Discount filter calculation
      if (!rawParsedFilters.discount) {
        const discountThresholds = [10, 20, 30, 40, 50, 60, 70];
        const discountCounts = {10: 0, 20: 0, 30: 0, 40: 0, 50: 0, 60: 0, 70: 0};
        initialProducts.forEach((p) => {
          const pr = parseFloat(
            p.priceRange?.minVariantPrice?.amount ||
            p.selectedOrFirstAvailableVariant?.price?.amount ||
            '0',
          );
          const cp = parseFloat(
            p.compareAtPriceRange?.minVariantPrice?.amount ||
            p.selectedOrFirstAvailableVariant?.compareAtPrice?.amount ||
            '0',
          );
          if (cp > pr) {
            const pct = Math.round(((cp - pr) / cp) * 100);
            discountThresholds.forEach((t) => {
              if (pct >= t) discountCounts[t]++;
            });
          }
        });

        const discountOpts = discountThresholds
          .filter((t) => discountCounts[t] > 0)
          .map((t) => ({
            id: `discount-${t}`,
            label: `${t}% and above`,
            value: `${t}`,
            count: discountCounts[t],
          }));

        if (discountOpts.length > 0) {
          rawParsedFilters.discount = {
            id: 'discount',
            title: 'Discount',
            type: 'LIST',
            options: discountOpts,
          };
        }
      }
    }

    // 4. Sort filters by Canonical Live Site Order
    const CANONICAL_FILTER_ORDER = [
      'size',
      'brand',
      'color',
      'fabric',
      'gender',
      'country_of_origin',
      'discount',
      'design',
      'sleeve_length',
      'type',
      'fit',
      'availability',
    ];

    const sortedFilters = {};
    CANONICAL_FILTER_ORDER.forEach((orderKey) => {
      if (rawParsedFilters[orderKey]) {
        sortedFilters[orderKey] = rawParsedFilters[orderKey];
      }
    });
    // Add any remaining filters that were not in canonical order
    Object.keys(rawParsedFilters).forEach((k) => {
      if (!sortedFilters[k]) {
        sortedFilters[k] = rawParsedFilters[k];
      }
    });

    return {
      availableFilters: sortedFilters,
      globalPriceRange: {min: storefrontMinP, max: storefrontMaxP},
    };
  }, [initialProducts, storefrontFilters]);

  // Handle filter changes and sync to URL search params for Search & Discovery
  const handleFilterChange = (filterKey, nextSelectedValues) => {
    const nextActive = {
      ...activeFilters,
      [filterKey]: nextSelectedValues,
    };
    if (nextSelectedValues.length === 0) {
      delete nextActive[filterKey];
    }
    setActiveFilters(nextActive);

    // Build array of ProductFilter objects for Shopify Search & Discovery GraphQL query
    const filterObjects = [];
    Object.entries(nextActive).forEach(([k, vals]) => {
      const facet = availableFilters[k];
      if (facet?.options) {
        vals.forEach((val) => {
          const opt = facet.options.find((o) => o.value === val || o.label === val);
          if (opt?.input) {
            try {
              const parsedInput = typeof opt.input === 'string' ? JSON.parse(opt.input) : opt.input;
              filterObjects.push(parsedInput);
            } catch {
              // ignore
            }
          }
        });
      }
    });

    if (priceFilter) {
      filterObjects.push({
        price: {
          min: priceFilter.min,
          max: priceFilter.max,
        },
      });
    }

    const nextParams = new URLSearchParams(searchParams);
    if (nextSelectedValues.length > 0) {
      nextParams.set(filterKey, nextSelectedValues.join(','));
    } else {
      nextParams.delete(filterKey);
    }

    if (filterObjects.length > 0) {
      nextParams.set('filters', JSON.stringify(filterObjects));
    } else {
      nextParams.delete('filters');
    }

    setSearchParams(nextParams, {replace: true});
  };

  const handleRemoveSingleFilter = (groupKey, value) => {
    const current = activeFilters[groupKey] || [];
    const updated = current.filter((item) => item !== value);
    handleFilterChange(groupKey, updated);
  };

  const handlePriceChange = (range) => {
    setPriceFilter(range);

    const filterObjects = [];
    Object.entries(activeFilters).forEach(([k, vals]) => {
      const facet = availableFilters[k];
      if (facet?.options) {
        vals.forEach((val) => {
          const opt = facet.options.find((o) => o.value === val || o.label === val);
          if (opt?.input) {
            try {
              const parsedInput = typeof opt.input === 'string' ? JSON.parse(opt.input) : opt.input;
              filterObjects.push(parsedInput);
            } catch {
              // ignore
            }
          }
        });
      }
    });

    if (range) {
      filterObjects.push({
        price: {
          min: range.min,
          max: range.max,
        },
      });
    }

    const nextParams = new URLSearchParams(searchParams);
    if (range) {
      nextParams.set('min_price', String(range.min));
      nextParams.set('max_price', String(range.max));
    } else {
      nextParams.delete('min_price');
      nextParams.delete('max_price');
    }

    if (filterObjects.length > 0) {
      nextParams.set('filters', JSON.stringify(filterObjects));
    } else {
      nextParams.delete('filters');
    }

    setSearchParams(nextParams, {replace: true});
  };

  const handleClearAll = () => {
    setActiveFilters({});
    setPriceFilter(null);
    setActiveSubcategory('');
    const nextParams = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) nextParams.set('q', q);
    const sortBy = searchParams.get('sort_by');
    if (sortBy) nextParams.set('sort_by', sortBy);
    setSearchParams(nextParams, {replace: true});
  };


  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Subcategory filter ("Shop For")
    if (activeSubcategory) {
      const sub = activeSubcategory.toLowerCase().trim();
      result = result.filter((p) => {
        const text = `${p.title} ${p.productType || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
        if (text.includes(sub)) return true;
        if (sub === 'women') {
          return (
            text.includes('women') ||
            text.includes('kurta set') ||
            text.includes('salwar') ||
            text.includes('kurti') ||
            text.includes('suit')
          );
        } else if (sub === 'men') {
          return text.includes('men') && !text.includes('women');
        } else if (sub === 'kids') {
          return text.includes('kid') || text.includes('boy') || text.includes('girl');
        }
        return false;
      });
    }

    // 2. Price filter
    if (priceFilter) {
      result = result.filter((p) => {
        const price = parseFloat(
          p.priceRange?.minVariantPrice?.amount ||
          p.selectedOrFirstAvailableVariant?.price?.amount ||
          p.variants?.nodes?.[0]?.price?.amount ||
          '0',
        );
        return price >= priceFilter.min && price <= priceFilter.max;
      });
    }

    // 3. Facet Filters (Shopify Search & Discovery app filters + client facets)
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (!values || values.length === 0) return;
      const title = (availableFilters[key]?.title || key).toLowerCase();
      const lowerKey = key.toLowerCase();

      // Check if this filter is already being handled server-side by Shopify
      const facet = availableFilters[key];
      const hasServerInputs = facet?.options?.some(
        (opt) => opt?.input && values.includes(opt.value || opt.label),
      );
      const isServerFiltered =
        Boolean(searchParams.get('filters')) && hasServerInputs;

      // Size
      if (lowerKey === 'size' || lowerKey.includes('size') || title.includes('size')) {
        result = result.filter((p) => matchesSize(p, values));
      }
      // Color
      else if (lowerKey === 'color' || lowerKey.includes('color') || lowerKey.includes('colour') || title.includes('color') || title.includes('colour')) {
        result = result.filter((p) => matchesColor(p, values));
      }
      // Brand / Vendor
      else if (lowerKey === 'brand' || lowerKey.includes('vendor') || title.includes('brand') || title.includes('vendor')) {
        result = result.filter((p) => {
          const v = (p.vendor || '').trim().toLowerCase();
          const pTitle = (p.title || '').toLowerCase();
          const tags = (p.tags || []).map((t) => t.toLowerCase());
          return values.some((val) => {
            const target = val.toLowerCase().trim();
            return v === target || v.includes(target) || pTitle.includes(target) || tags.includes(target);
          });
        });
      }
      // Discount
      else if (lowerKey === 'discount' || title.includes('discount')) {
        result = result.filter((p) => {
          const price = parseFloat(
            p.priceRange?.minVariantPrice?.amount ||
            p.selectedOrFirstAvailableVariant?.price?.amount ||
            p.variants?.nodes?.[0]?.price?.amount ||
            '0',
          );
          const comparePrice = parseFloat(
            p.compareAtPriceRange?.minVariantPrice?.amount ||
            p.selectedOrFirstAvailableVariant?.compareAtPrice?.amount ||
            p.variants?.nodes?.[0]?.compareAtPrice?.amount ||
            '0',
          );
          if (comparePrice <= price) return false;
          const pct = Math.round(((comparePrice - price) / comparePrice) * 100);
          return values.some((d) => {
            const threshold = parseInt(d, 10);
            return !isNaN(threshold) ? pct >= threshold : false;
          });
        });
      }
      // Availability
      else if (lowerKey.includes('availab') || title.includes('availab')) {
        result = result.filter((p) => {
          return values.some((val) => {
            const isAvailable = val.toLowerCase().includes('in stock') || val.toLowerCase() === 'true';
            return isAvailable ? p.availableForSale !== false : true;
          });
        });
      }
      // Server-filtered facets (custom productMetafield for fabric, sleeve, design, type, fit)
      else if (isServerFiltered) {
        // Already filtered by Shopify
        return;
      }
      // Generic fallback
      else {
        result = result.filter((p) => {
          const searchable = `${p.title} ${(p.tags || []).join(' ')} ${p.vendor || ''} ${p.productType || ''}`.toLowerCase();
          return values.some((val) => searchable.includes(val.toLowerCase().trim()));
        });
      }
    });

    // 4. Sort
    switch (currentSort) {
      case 'price-low-to-high':
        result.sort((a, b) => {
          const pa = parseFloat(
            a.priceRange?.minVariantPrice?.amount ||
            a.selectedOrFirstAvailableVariant?.price?.amount ||
            '0',
          );
          const pb = parseFloat(
            b.priceRange?.minVariantPrice?.amount ||
            b.selectedOrFirstAvailableVariant?.price?.amount ||
            '0',
          );
          return pa - pb;
        });
        break;
      case 'price-high-to-low':
        result.sort((a, b) => {
          const pa = parseFloat(
            a.priceRange?.minVariantPrice?.amount ||
            a.selectedOrFirstAvailableVariant?.price?.amount ||
            '0',
          );
          const pb = parseFloat(
            b.priceRange?.minVariantPrice?.amount ||
            b.selectedOrFirstAvailableVariant?.price?.amount ||
            '0',
          );
          return pb - pa;
        });
        break;
      case 'discount':
        result.sort((a, b) => {
          const pa = parseFloat(
            a.priceRange?.minVariantPrice?.amount ||
            a.selectedOrFirstAvailableVariant?.price?.amount ||
            '0',
          );
          const capA = parseFloat(
            a.compareAtPriceRange?.minVariantPrice?.amount ||
            a.selectedOrFirstAvailableVariant?.compareAtPrice?.amount ||
            '0',
          );
          const discA = capA > pa ? ((capA - pa) / capA) * 100 : 0;

          const pb = parseFloat(
            b.priceRange?.minVariantPrice?.amount ||
            b.selectedOrFirstAvailableVariant?.price?.amount ||
            '0',
          );
          const capB = parseFloat(
            b.compareAtPriceRange?.minVariantPrice?.amount ||
            b.selectedOrFirstAvailableVariant?.compareAtPrice?.amount ||
            '0',
          );
          const discB = capB > pb ? ((capB - pb) / capB) * 100 : 0;

          return discB - discA;
        });
        break;
      case 'newest':
      case 'new-arrivals':
        result.sort((a, b) => {
          const dateA = new Date(a.publishedAt || 0).getTime();
          const dateB = new Date(b.publishedAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'popularity':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'alphabetical':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'ratings':
        result.sort((a, b) => {
          const charCodeA = (a.id || a.title || '1').charCodeAt(0) || 5;
          const ratingA = parseFloat(a.rating || (4.2 + (charCodeA % 7) * 0.1).toFixed(1));
          const charCodeB = (b.id || b.title || '1').charCodeAt(0) || 5;
          const ratingB = parseFloat(b.rating || (4.2 + (charCodeB % 7) * 0.1).toFixed(1));
          return ratingB - ratingA;
        });
        break;
      case 'relevance':
      default:
        break;
    }

    return result;
  }, [
    initialProducts,
    activeSubcategory,
    activeFilters,
    priceFilter,
    currentSort,
    availableFilters,
    searchParams,
  ]);

  const hasActiveFilters =
    Object.values(activeFilters).some((arr) => arr && arr.length > 0) ||
    Boolean(priceFilter) ||
    Boolean(activeSubcategory);

  const handleSubcategorySelect = (sub) => {
    const nextVal = activeSubcategory === sub.name ? '' : sub.name;
    setActiveSubcategory(nextVal);
    const nextParams = new URLSearchParams(searchParams);
    if (nextVal) {
      nextParams.set('subcat', nextVal);
    } else {
      nextParams.delete('subcat');
    }
    // Local filter: keep scroll position (no loader run, see plpRevalidation)
    setSearchParams(nextParams, {preventScrollReset: true});
  };

  return (
    <div className="w-full bg-white min-h-screen no-scrollbar">
      <div className="max-w-[1244px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Breadcrumbs (only if provided and not empty) */}
        {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden lg:block pt-3 pb-1">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li
                    key={crumb.url || crumb.label}
                    className="flex items-center gap-1.5"
                  >
                    {idx > 0 && <span className="text-gray-400">›</span>}
                    {isLast || !crumb.url ? (
                      <span className="text-gray-900 font-medium">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.url}
                        className="hover:text-black transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Mobile PLP Top Header (sticky nav, count & subcategory pills) */}
        <PlpHeader
          title={collection?.mobileTitle || collection?.title || 'Products'}
          totalCount={filteredAndSortedProducts.length}
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          onSubcategorySelect={handleSubcategorySelect}
        />

        {/* 2-Column PLP Layout matching Live Lifestyle Stores */}
        <div className="flex gap-6 lg:gap-8 pt-2 lg:pt-4 pb-12">
          {/* Desktop Filter Sidebar (Left, ~230px - 250px) */}
          <div className="w-[230px] lg:w-[250px] shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <PlpFilterSidebar
                availableFilters={availableFilters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
                priceRange={globalPriceRange}
                currentPriceRange={priceFilter}
                onPriceChange={handlePriceChange}
              />
            </div>
          </div>

          {/* Main Products Column (Right) */}
          <div className="flex-1 min-w-0 pb-16 lg:pb-0">
            {/* Desktop Row 1: "Shop For" Category Pills matching Live Site */}
            {Array.isArray(subcategories) && subcategories.length > 0 && (
              <div className="hidden lg:flex items-center gap-2 mb-3.5">
                <span className="text-xs sm:text-[13px] font-semibold text-gray-900 shrink-0 mr-1">
                  Shop For
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {subcategories.map((subcat) => {
                    const isActive =
                      activeSubcategory === subcat.handle ||
                      activeSubcategory === subcat.name;
                    return (
                      <button
                        type="button"
                        key={subcat.name}
                        onClick={() => handleSubcategorySelect(subcat)}
                        className={`px-3.5 py-1 text-xs rounded-[2px] border transition-colors cursor-pointer ${
                          isActive
                            ? 'border-gray-900 bg-white text-gray-900 font-semibold'
                            : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500 font-normal'
                        }`}
                      >
                        {subcat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Desktop Row 2: Title & Product Count (Left) + Sort By Dropdown (Right) */}
            <div className="hidden lg:flex items-center justify-between gap-3 mb-3">
              <div className="flex items-baseline gap-1 flex-wrap">
                <h1 className="text-xs sm:text-sm font-bold text-gray-900">
                  {collection?.title || 'Products'}
                </h1>
                {typeof filteredAndSortedProducts.length === 'number' && (
                  <span className="text-xs sm:text-sm text-gray-500 font-normal">
                    {' '}: {filteredAndSortedProducts.length}{' '}
                    {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} available
                  </span>
                )}
              </div>

              <div className="shrink-0">
                <PlpSortDropdown
                  currentSort={currentSort}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>

            {/* Row 3: Active Filter Applied Chips */}
            <PlpActiveFilterChips
              activeFilters={activeFilters}
              priceFilter={priceFilter}
              onRemoveFilter={handleRemoveSingleFilter}
              onRemovePriceFilter={() => setPriceFilter(null)}
            />

            {/* Category Hero Banner (from metafield or collection) */}
            {categoryBanner?.url && (
              <div className="w-full mb-4 overflow-hidden rounded-xs border border-gray-100">
                <img
                  src={categoryBanner.url}
                  alt={categoryBanner.altText || collection?.title || 'Category Banner'}
                  className="w-full h-auto object-cover max-h-[220px]"
                />
              </div>
            )}

            {/* Row 4: Product Grid */}
            <PlpProductGrid
              products={filteredAndSortedProducts}
              isLoading={false}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleClearAll}
            />
          </div>
        </div>
      </div>

      {/* Sticky Mobile Filter & Sort Action Bar (Matching Lifestyle Stores Image 1) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-3 px-4 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
        {/* Left Half: SORT */}
        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 cursor-pointer"
        >
          {/* Parallel up/down arrows icon matching Image 1 */}
          <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m10 4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span>SORT</span>
        </button>

        {/* Center Vertical Divider */}
        <div className="h-5 w-[1px] bg-gray-200 shrink-0" />

        {/* Right Half: FILTER */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 cursor-pointer"
        >
          {/* Sliders adjustment icon matching Image 1 */}
          <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            <circle cx="8" cy="6" r="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="16" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="10" cy="18" r="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span>FILTER</span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FAA619] shrink-0" />
          )}
        </button>
      </div>

      {/* Mobile Sort Dedicated Drawer (Matching Image 2) */}
      <PlpMobileSortDrawer
        isOpen={isMobileSortOpen}
        onClose={() => setIsMobileSortOpen(false)}
        currentSort={currentSort}
        onSortChange={handleSortChange}
      />

      {/* Mobile Filters Slide-in Drawer (Matching Image 3) */}
      <PlpMobileFilter
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        availableFilters={availableFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        priceRange={globalPriceRange}
        currentPriceRange={priceFilter}
        onPriceChange={handlePriceChange}
        totalMatchingProducts={filteredAndSortedProducts.length}
      />
    </div>
  );
}
