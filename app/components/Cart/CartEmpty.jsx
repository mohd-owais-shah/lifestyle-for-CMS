import {Link} from 'react-router';

const DEPARTMENTS = [
  {name: 'Last Day', handle: '/collections/all'},
  {name: 'Women', handle: '/collections/women'},
  {name: 'Men', handle: '/collections/men'},
  {name: 'Footwear', handle: '/collections/footwear'},
  {name: 'Kids', handle: '/collections/kids'},
  {name: 'Bags', handle: '/collections/bags'},
  {name: 'Gen Z', handle: '/collections/women'},
  {name: 'Watches', handle: '/collections/men'},
  {name: 'Sportswear', handle: '/collections/all'},
  {name: 'Fragrance', handle: '/collections/beauty'},
  {name: 'Beauty', handle: '/collections/beauty'},
  {name: 'Luxe', handle: '/collections/all'},
  {name: 'Home & Living', handle: '/collections/home-living'},
  {name: 'Babyshop', handle: '/collections/babyshop'},
  {name: 'Gift Card', handle: '/collections/all'},
  {name: 'Plus Size', handle: '/collections/women'},
];

export function CartEmpty() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-left mb-8">
        Your Shopping Basket
      </h1>

      <div className="bg-white border border-gray-100 rounded-lg p-8 sm:p-14 shadow-2xs flex flex-col items-center">
        {/* Shopping Bag Artwork */}
        <div className="relative mb-6">
          <svg
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bag Shadow */}
            <ellipse cx="100" cy="180" rx="60" ry="8" fill="#E5E7EB" />
            
            {/* Bag Body */}
            <path
              d="M55 75L40 170H160L145 75H55Z"
              fill="#D1D5DB"
            />
            <path
              d="M60 75L48 170H152L140 75H60Z"
              fill="#9CA3AF"
            />

            {/* Bag Handles */}
            <path
              d="M75 75V55C75 42 86 32 100 32C114 32 125 42 125 55V75"
              stroke="#4B5563"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Floral / Tag Accents */}
            <path
              d="M140 145C155 130 170 145 155 160C140 160 140 145 140 145Z"
              fill="#E11D48"
            />
            <path
              d="M145 135C160 120 175 135 160 150C145 150 145 135 145 135Z"
              fill="#FAA619"
            />
          </svg>
        </div>

        {/* Message matching Screenshot */}
        <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-2">
          The best fashion is waiting to be added in your cart !
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-md">
          Choose from the departments below and start shopping now
        </p>

        {/* Department Pills matching Screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.name}
              to={dept.handle}
              className="px-4 py-2 border border-[#FAA619] rounded-xs text-xs font-semibold text-[#FAA619] hover:bg-[#FFF7ED] transition-colors"
            >
              {dept.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
