/**
 * Product Services highlight:
 * - Click & Collect
 * - Pay in installments
 * - 7 days easy returns
 * - Sold By Landmark Online India Pvt Ltd / Vendor
 */
export function ProductServices({ vendor }) {
  return (
    <div className="py-4 border-b border-[#EAEAEA] space-y-4">
      {/* Click & Collect */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222222"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#141414] leading-[20px]">Click & Collect</span>
            <span className="text-[14px] font-semibold text-[#FAA619] cursor-pointer hover:underline">
              Details
            </span>
          </div>
          <p className="text-[14px] font-normal text-[#000000] leading-[20px] font-sans mt-1">
            Order this product now and collect it from a store of your choice.
          </p>
        </div>
      </div>

      {/* Pay in installments */}
      <div className="flex items-start gap-3 pb-4 border-b border-[#EAEAEA]">
        <div className="mt-0.5 shrink-0">
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222222"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#141414] leading-[20px]">Pay in installments</span>
            <span className="text-[14px] font-semibold text-[#FAA619] cursor-pointer hover:underline">
              Details
            </span>
          </div>
          <p className="text-[14px] font-normal text-[#000000] leading-[20px] font-sans mt-1">
            Pay in easy installments on orders of ₹ 3,000 or more. Available for select banks.
          </p>
        </div>
      </div>

      {/* 7 Days Easy Returns */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#EAEAEA]">
        <div className="shrink-0">
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 6L3 12L10 18V14H21V10H10V6Z"
              stroke="#1A1A1A"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[13px] sm:text-[14px] font-bold text-[#141414] leading-[20px] whitespace-nowrap">
              7 days easy returns (conditions apply)
            </span>
            <span className="text-[13px] sm:text-[14px] font-semibold text-[#FAA619] cursor-pointer hover:underline shrink-0 ml-2">
              Details
            </span>
          </div>
        </div>
      </div>

      {/* Sold By */}
      <div className="pt-1 text-[14px] font-sans text-[#000000] leading-[20px]">
        <span className="font-semibold text-[#141414]">Sold By :</span>{' '}
        <span className="text-[14px] font-normal text-[#000000] leading-[20px]">
          {vendor ? `${vendor} (via Landmark Online India Pvt Ltd)` : 'Landmark Online India Pvt Ltd'}
        </span>
      </div>
    </div>
  );
}
