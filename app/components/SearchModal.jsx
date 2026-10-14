import {useState, useEffect, useRef} from 'react';
import {useNavigate, useFetcher} from 'react-router';

const POPULAR_SEARCH_TERMS = [
  'Melange Kurta Set Women',
  'watch',
  'tops for women',
  'dresses for women',
  'kurta sets for women',
  'Melange kurtas',
  'CODE Tops for Women',
  'Shirts for men',
  'melange',
  'CODE Dresses for Women',
];

const RECENT_SEARCHES_STORAGE_KEY = 'lifestyle_recent_searches';

export function SearchModal({isOpen, onClose, initialQuery = ''}) {
  const navigate = useNavigate();
  const fetcher = useFetcher({key: 'mobile-predictive-search'});
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSearches(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setRecentSearches([]);
    }
  }, [isOpen]);

  // Focus input and lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Predictive results on every keystroke; a newer load cancels the previous one.
  const {load: loadSuggestions} = fetcher;
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed || trimmed.length < 3) return;
    loadSuggestions(
      `/api/predictive-search?q=${encodeURIComponent(trimmed)}&limit=10`,
    );
  }, [searchTerm, loadSuggestions]);

  const suggestions =
    searchTerm.trim().length >= 3 && fetcher.data?.result?.items
      ? fetcher.data.result.items
      : {queries: [], products: [], collections: []};

  // Combine live query suggestions and collection titles into a unified vertical list
  const suggestionItems = [
    ...(suggestions?.queries?.map((item) => item.text) || []),
    ...(suggestions?.collections?.map((col) => col.title) || []),
  ].filter((val, idx, arr) => arr.indexOf(val) === idx && Boolean(val));

  // If queries and collections are empty but products match, include product titles as suggestion rows
  if (suggestionItems.length === 0 && suggestions?.products?.length > 0) {
    suggestions.products.slice(0, 8).forEach((prod) => {
      if (prod?.title && !suggestionItems.includes(prod.title)) {
        suggestionItems.push(prod.title);
      }
    });
  }

  if (!isOpen) return null;

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 10);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeSingleRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    const updated = recentSearches.filter((t) => t !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleExecuteSearch = (term) => {
    const clean = (term || searchTerm).trim();
    if (!clean) return;
    saveRecentSearch(clean);
    onClose();
    navigate(`/search?q=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col overflow-hidden animate-in fade-in duration-150">
      {/* Header bar: Back arrow, search input, clear button */}
      <div className="flex items-center px-4 h-[60px] border-b border-gray-200 shrink-0 gap-3 bg-white">
        <button
          type="button"
          onClick={onClose}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteSearch(searchTerm);
          }}
          className="flex-1 h-[42px] flex items-center bg-[#F2F4F7] rounded-md px-3"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, brands and more"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-900 placeholder-gray-500"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                if (inputRef.current) inputRef.current.focus();
              }}
              aria-label="Clear search"
              className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-gray-100">
        {/* 1. Live Predictive Search Suggestions List (Matching live site) */}
        {suggestionItems.length > 0 && (
          <div className="divide-y divide-gray-100">
            {suggestionItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleExecuteSearch(item)}
                className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <span className="text-sm font-normal text-gray-800 group-hover:text-black">
                  {item}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-gray-700 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* 2. Matching Products in Predictive Search */}
        {suggestions?.products?.length > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Matching Products
            </h3>
            <div className="flex flex-col gap-3">
              {suggestions.products.slice(0, 5).map((product) => {
                const minPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      navigate(`/products/${product.handle}`);
                    }}
                    className="flex items-center gap-3 cursor-pointer group p-1 rounded hover:bg-gray-50 transition-colors"
                  >
                    {product.featuredImage?.url ? (
                      <img
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        className="w-12 h-14 object-cover rounded bg-gray-50 border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-14 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 shrink-0">
                        No img
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-[#FAA619] line-clamp-2 leading-snug">
                        {product.title}
                      </p>
                      {minPrice > 0 && (
                        <p className="text-xs font-bold text-black mt-0.5">
                          ₹{Math.round(minPrice).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Recent Searches matching Screenshot 3 & 4 */}
        {recentSearches?.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">
                Recent searches
              </h3>
              <button
                type="button"
                onClick={clearAllRecentSearches}
                className="text-xs font-bold text-[#FAA619] hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentSearches.map((term) => (
                <div
                  key={term}
                  className="flex items-center justify-between py-2.5 text-left group"
                >
                  <button
                    type="button"
                    onClick={(e) => removeSingleRecentSearch(e, term)}
                    aria-label={`Remove recent search ${term}`}
                    className="p-1 -ml-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteSearch(term)}
                    className="flex-1 flex items-center justify-between ml-2 cursor-pointer text-left"
                  >
                    <span className="text-sm text-gray-800 group-hover:text-black truncate">
                      {term}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-700 shrink-0 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Popular Searches matching Screenshot 4 */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            Popular searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCH_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleExecuteSearch(term)}
                className="px-3.5 py-1.5 border border-gray-300 rounded-full text-xs font-normal text-gray-800 hover:bg-gray-50 hover:border-gray-400 bg-white cursor-pointer transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
