import {useSearchParams} from 'react-router';

const SORT_OPTIONS = [
  {label: 'Relevance', value: 'relevance'},
  {label: 'Price - Low to High', value: 'price-low-to-high'},
  {label: 'Price - High to Low', value: 'price-high-to-low'},
  {label: 'New Arrivals', value: 'new-arrivals'},
  {label: 'Discount', value: 'discount'},
  {label: 'Alphabetical', value: 'alphabetical'},
];

export function PlpSortDropdown({currentSort, onSortChange}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSort = currentSort || searchParams.get('sort_by') || 'relevance';

  const handleChange = (e) => {
    const nextValue = e.target.value;
    if (onSortChange) {
      onSortChange(nextValue);
    } else {
      const nextParams = new URLSearchParams(searchParams);
      if (nextValue === 'relevance') {
        nextParams.delete('sort_by');
      } else {
        nextParams.set('sort_by', nextValue);
      }
      setSearchParams(nextParams);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase font-medium text-gray-600 tracking-wider hidden sm:inline mr-0.5">
        SORT BY
      </span>
      <div className="relative inline-block">
        <select
          value={selectedSort}
          onChange={handleChange}
          aria-label="Sort products by"
          className="appearance-none bg-white border border-gray-300 text-xs font-normal text-gray-800 rounded-[2px] py-1.5 pl-3 pr-8 focus:outline-none focus:border-black cursor-pointer hover:border-gray-400"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
