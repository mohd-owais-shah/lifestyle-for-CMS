import { useState, useMemo, useEffect } from 'react';

// Master Apparel Size Data matching Live Lifestyle Store (Screenshot 1)
const MASTER_APPAREL_DATA = {
  'XS': { bustCm: 82, bustIn: 32, shoulderCm: 34, shoulderIn: 13.5, waistCm: 67, waistIn: 26.5, hipCm: 89, hipIn: 35 },
  'S': { bustCm: 87, bustIn: 34, shoulderCm: 35, shoulderIn: 14, waistCm: 72, waistIn: 28.5, hipCm: 94, hipIn: 37 },
  'M': { bustCm: 92, bustIn: 36, shoulderCm: 36, shoulderIn: 14.5, waistCm: 77, waistIn: 30.5, hipCm: 100, hipIn: 39.5 },
  'L': { bustCm: 97, bustIn: 38, shoulderCm: 37, shoulderIn: 15, waistCm: 82, waistIn: 32.5, hipCm: 105, hipIn: 41.5 },
  'XL': { bustCm: 102, bustIn: 40, shoulderCm: 39, shoulderIn: 15.5, waistCm: 87, waistIn: 34.5, hipCm: 110, hipIn: 43.5 },
  'XXL': { bustCm: 107, bustIn: 42, shoulderCm: 40, shoulderIn: 16, waistCm: 92, waistIn: 36.5, hipCm: 115, hipIn: 45.5 },
  '2XL': { bustCm: 107, bustIn: 42, shoulderCm: 40, shoulderIn: 16, waistCm: 92, waistIn: 36.5, hipCm: 115, hipIn: 45.5 },
  '3XL': { bustCm: 112, bustIn: 44, shoulderCm: 41, shoulderIn: 16.5, waistCm: 97, waistIn: 38.5, hipCm: 120, hipIn: 47.5 },
  'XXXL': { bustCm: 112, bustIn: 44, shoulderCm: 41, shoulderIn: 16.5, waistCm: 97, waistIn: 38.5, hipCm: 120, hipIn: 47.5 },
  '28': { bustCm: 82, bustIn: 32, shoulderCm: 34, shoulderIn: 13.5, waistCm: 67, waistIn: 26.5, hipCm: 89, hipIn: 35 },
  '30': { bustCm: 87, bustIn: 34, shoulderCm: 35, shoulderIn: 14, waistCm: 72, waistIn: 28.5, hipCm: 94, hipIn: 37 },
  '32': { bustCm: 92, bustIn: 36, shoulderCm: 36, shoulderIn: 14.5, waistCm: 77, waistIn: 30.5, hipCm: 100, hipIn: 39.5 },
  '34': { bustCm: 97, bustIn: 38, shoulderCm: 37, shoulderIn: 15, waistCm: 82, waistIn: 32.5, hipCm: 105, hipIn: 41.5 },
  '36': { bustCm: 102, bustIn: 40, shoulderCm: 39, shoulderIn: 15.5, waistCm: 87, waistIn: 34.5, hipCm: 110, hipIn: 43.5 },
  '38': { bustCm: 107, bustIn: 42, shoulderCm: 40, shoulderIn: 16, waistCm: 92, waistIn: 36.5, hipCm: 115, hipIn: 45.5 },
  '40': { bustCm: 112, bustIn: 44, shoulderCm: 41, shoulderIn: 16.5, waistCm: 97, waistIn: 38.5, hipCm: 120, hipIn: 47.5 },
};

const DEFAULT_ROWS = [
  { size: 'XS', bustCm: 82, bustIn: 32, shoulderCm: 34, shoulderIn: 13.5, waistCm: 67, waistIn: 26.5, hipCm: 89, hipIn: 35 },
  { size: 'S', bustCm: 87, bustIn: 34, shoulderCm: 35, shoulderIn: 14, waistCm: 72, waistIn: 28.5, hipCm: 94, hipIn: 37 },
  { size: 'M', bustCm: 92, bustIn: 36, shoulderCm: 36, shoulderIn: 14.5, waistCm: 77, waistIn: 30.5, hipCm: 100, hipIn: 39.5 },
  { size: 'L', bustCm: 97, bustIn: 38, shoulderCm: 37, shoulderIn: 15, waistCm: 82, waistIn: 32.5, hipCm: 105, hipIn: 41.5 },
  { size: 'XL', bustCm: 102, bustIn: 40, shoulderCm: 39, shoulderIn: 15.5, waistCm: 87, waistIn: 34.5, hipCm: 110, hipIn: 43.5 },
  { size: 'XXL', bustCm: 107, bustIn: 42, shoulderCm: 40, shoulderIn: 16, waistCm: 92, waistIn: 36.5, hipCm: 115, hipIn: 45.5 },
];

const FemaleMeasurementDiagram = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <svg
        className="w-full max-w-[280px] sm:max-w-[290px] h-auto"
        viewBox="0 0 290 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hair Outline */}
        <path
          d="M80 50 C74 34 82 18 96 12 C110 6 128 10 134 22 C140 34 138 50 136 60 C128 48 122 42 114 42 C106 42 100 48 96 58 C90 52 84 50 80 50 Z"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />
        <path
          d="M74 65 C68 84 76 102 82 112 C84 105 86 96 86 88 C80 84 78 74 78 65"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />
        <path
          d="M140 65 C146 84 138 102 132 112 C130 105 128 96 128 88 C134 84 136 74 136 65"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />

        {/* Head / Face */}
        <path
          d="M88 52 C88 70 96 86 107 89 C118 86 126 70 126 52"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />

        {/* Neck */}
        <path
          d="M101 88 L101 106 M113 88 L113 106"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />

        {/* Outer Shoulders, Torso & Arms */}
        <path
          d="M101 106 C88 110 60 118 44 128 C38 132 35 140 34 154 L32 205 C31 232 33 268 37 300 L39 360 C40 385 42 410 43 415"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />
        <path
          d="M113 106 C126 110 154 118 170 128 C176 132 179 140 180 154 L182 205 C183 232 181 268 177 300 L175 360 C174 385 172 410 171 415"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />

        {/* Inner Torso & Armpit */}
        <path
          d="M48 165 C52 185 53 205 51 225 C49 240 44 265 41 295"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />
        <path
          d="M166 165 C162 185 161 205 163 225 C165 240 170 265 173 295"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />

        {/* Waist & Hip Curve */}
        <path
          d="M51 225 C49 245 45 270 47 295 C49 320 54 345 56 370 L58 415"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />
        <path
          d="M163 225 C165 245 169 270 167 295 C165 320 160 345 158 370 L156 415"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />

        {/* Crotch / Inner Leg Divider */}
        <path
          d="M107 300 L104 415 M107 300 L110 415"
          fill="none"
          stroke="#BBBBBB"
          strokeWidth="1.3"
        />

        {/* --- Dashed Measurement Lines & Labels --- */}

        {/* 1. Shoulder */}
        <line
          x1="36"
          y1="128"
          x2="178"
          y2="128"
          stroke="#555555"
          strokeWidth="1.3"
          strokeDasharray="3 3"
        />
        <text x="190" y="132" fill="#333333" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          Shoulder
        </text>

        {/* 2. Overbust */}
        <line
          x1="46"
          y1="162"
          x2="168"
          y2="162"
          stroke="#555555"
          strokeWidth="1.3"
          strokeDasharray="3 3"
        />
        <text x="190" y="159" fill="#333333" fontSize="11" fontWeight="600" fontFamily="sans-serif">
          Overbust
        </text>

        {/* 3. Chest */}
        <line
          x1="48"
          y1="174"
          x2="166"
          y2="174"
          stroke="#555555"
          strokeWidth="1.3"
          strokeDasharray="3 3"
        />
        <text x="190" y="173" fill="#333333" fontSize="11" fontWeight="600" fontFamily="sans-serif">
          Chest
        </text>

        {/* 4. Underbust */}
        <line
          x1="50"
          y1="187"
          x2="164"
          y2="187"
          stroke="#555555"
          strokeWidth="1.3"
          strokeDasharray="3 3"
        />
        <text x="190" y="188" fill="#333333" fontSize="11" fontWeight="600" fontFamily="sans-serif">
          Underbust
        </text>

        {/* 5. Waist */}
        <line
          x1="51"
          y1="225"
          x2="163"
          y2="225"
          stroke="#555555"
          strokeWidth="1.3"
          strokeDasharray="3 3"
        />
        <text x="190" y="229" fill="#333333" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          Waist
        </text>

        {/* 6. Hips */}
        <line
          x1="47"
          y1="290"
          x2="167"
          y2="290"
          stroke="#555555"
          strokeWidth="1.3"
          strokeDasharray="3 3"
        />
        <text x="190" y="294" fill="#333333" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          Hips
        </text>

        {/* 7. Inseam */}
        <line
          x1="107"
          y1="300"
          x2="107"
          y2="415"
          stroke="#555555"
          strokeWidth="1.3"
          strokeDasharray="3 3"
        />
        <text x="190" y="415" fill="#333333" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          Inseam
        </text>
      </svg>
    </div>
  );
};

/**
 * Size & Fitting / Fit Guide Modal matching Live Lifestyle Store PDP
 */
export function ProductSizeGuideModal({ isOpen, onClose, sizes = [] }) {
  const [unit, setUnit] = useState('CM'); // 'CM' | 'INCH'

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow || 'unset';
      };
    }
  }, [isOpen]);

  const tableRows = useMemo(() => {
    // If product options are passed, try to map standard sizes
    if (sizes && sizes.length > 0) {
      const mapped = sizes
        .map((s) => {
          const label = (typeof s === 'string' ? s : s?.name || s?.size || '').trim().toUpperCase();
          const matched = MASTER_APPAREL_DATA[label];
          if (matched) {
            return {
              size: label,
              ...matched,
            };
          }
          return null;
        })
        .filter(Boolean);

      if (mapped.length > 0) {
        return mapped;
      }
    }
    return DEFAULT_ROWS;
  }, [sizes]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] bg-black/60 flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 backdrop-blur-[1px] animate-in fade-in duration-200"
    >
      <style>{`
        @media (max-width: 639px) {
          .size-guide-modal-container {
            height: 100vh !important;
            max-height: 100vh !important;
            margin-top: 0 !important;
            border-radius: 0px !important;
          }
        }
        @media (min-width: 640px) {
          .size-guide-modal-container {
            max-width: 984px !important;
            height: 580px !important;
            max-height: 580px !important;
            border-radius: 0px !important;
            margin-top: 0 !important;
          }
        }
        .custom-fitguide-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-fitguide-scrollbar::-webkit-scrollbar-track {
          background: #F4F4F4;
        }
        .custom-fitguide-scrollbar::-webkit-scrollbar-thumb {
          background: #A0A0A0;
          border-radius: 4px;
        }
        .custom-fitguide-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #707070;
        }
      `}</style>
      <div
        className="size-guide-modal-container bg-white w-full flex flex-col relative shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:pt-7 sm:pb-2 border-b border-[#F0F0F0] sm:border-b-0 shrink-0 bg-white">
          <h2 className="text-[17px] sm:text-[26px] font-bold text-[#111111] tracking-tight">
            <span className="block sm:hidden">Size &amp; Fitting</span>
            <span className="hidden sm:block font-serif text-[26px]">Fit guide</span>
          </h2>
          <button
            type="button"
            className="text-gray-500 hover:text-black text-2xl font-light leading-none p-1 cursor-pointer bg-transparent border-0 outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content (visible scrollbar on desktop, no-scrollbar on mobile) */}
        <div className="p-4 sm:px-8 sm:pb-8 sm:pt-1 overflow-y-auto max-sm:no-scrollbar sm:custom-fitguide-scrollbar flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8 md:gap-10">
            {/* Left Column (Desktop Web Only): Diagram on side */}
            <div className="hidden sm:flex sm:w-[280px] md:w-[320px] shrink-0 items-start justify-center pt-2">
              <FemaleMeasurementDiagram />
            </div>

            {/* Right Column (Desktop) / Main Column (Mobile) */}
            <div className="flex-1 min-w-0">
              {/* Unit Toggle */}
              <div className="flex justify-end mb-3">
                <div className="flex border border-[#E5E7EB] rounded-[4px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setUnit('CM')}
                    className={`px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer border-0 ${unit === 'CM'
                        ? 'bg-[#F5A623] text-white font-bold'
                        : 'bg-white text-[#666666] hover:bg-gray-50'
                      }`}
                  >
                    CM-M
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('INCH')}
                    className={`px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer border-0 ${unit === 'INCH'
                        ? 'bg-[#F5A623] text-white font-bold'
                        : 'bg-white text-[#666666] hover:bg-gray-50'
                      }`}
                  >
                    INCH
                  </button>
                </div>
              </div>

              {/* 5-Column Measurement Table */}
              <div className="border border-[#EAEAEA] rounded-[2px] bg-white mb-5 overflow-hidden">
                {/* Table Header */}
                <div className="flex bg-white border-b border-[#EAEAEA]">
                  <div className="flex-1 py-2.5 px-1.5 border-r border-[#EAEAEA] text-center">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#333333]">Brand Size</span>
                  </div>
                  <div className="flex-1 py-2.5 px-1.5 border-r border-[#EAEAEA] text-center">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#333333]">Bust</span>
                  </div>
                  <div className="flex-1 py-2.5 px-1.5 border-r border-[#EAEAEA] text-center">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#333333]">Shoulder</span>
                  </div>
                  <div className="flex-1 py-2.5 px-1.5 border-r border-[#EAEAEA] text-center">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#333333]">Waist</span>
                  </div>
                  <div className="flex-1 py-2.5 px-1.5 text-center">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#333333]">Hip</span>
                  </div>
                </div>

                {/* Table Data Rows */}
                {tableRows.map((row, idx) => {
                  const bustVal = unit === 'CM' ? row.bustCm : row.bustIn;
                  const shoulderVal = unit === 'CM' ? row.shoulderCm : row.shoulderIn;
                  const waistVal = unit === 'CM' ? row.waistCm : row.waistInch || row.waistIn;
                  const hipVal = unit === 'CM' ? row.hipCm : row.hipIn;
                  const isLast = idx === tableRows.length - 1;

                  return (
                    <div
                      key={`row-${row.size}-${idx}`}
                      className={`flex bg-white ${!isLast ? 'border-b border-[#EAEAEA]' : ''}`}
                    >
                      <div className="flex-1 py-2 px-1.5 border-r border-[#EAEAEA] text-center flex items-center justify-center">
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#111111]">{row.size}</span>
                      </div>
                      <div className="flex-1 py-2 px-1.5 border-r border-[#EAEAEA] text-center flex items-center justify-center">
                        <span className="text-[12px] sm:text-[13px] font-normal text-[#444444]">{bustVal}</span>
                      </div>
                      <div className="flex-1 py-2 px-1.5 border-r border-[#EAEAEA] text-center flex items-center justify-center">
                        <span className="text-[12px] sm:text-[13px] font-normal text-[#444444]">{shoulderVal}</span>
                      </div>
                      <div className="flex-1 py-2 px-1.5 border-r border-[#EAEAEA] text-center flex items-center justify-center">
                        <span className="text-[12px] sm:text-[13px] font-normal text-[#444444]">{waistVal}</span>
                      </div>
                      <div className="flex-1 py-2 px-1.5 text-center flex items-center justify-center">
                        <span className="text-[12px] sm:text-[13px] font-normal text-[#444444]">{hipVal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* How to Measure Section */}
              <div className="mb-2">
                <h3 className="text-[13px] sm:text-[14px] font-bold text-[#111111] mb-2 font-serif sm:font-sans">
                  How to Measure :
                </h3>
                <div className="text-[11.5px] sm:text-[12px] font-normal text-[#444444] leading-relaxed space-y-1.5">
                  <p>
                    <strong className="font-bold text-[#111111]">Bust:</strong> Measure around the body under the arms at the fullest part of the bust with your arms relaxed at both sides
                  </p>
                  <p>
                    <strong className="font-bold text-[#111111]">Shoulder:</strong> Measure the shoulder at the back, from edge to edge with arms relaxed on both sides
                  </p>
                  <p>
                    <strong className="font-bold text-[#111111]">Waist:</strong> Measure around the narrowest point of your natural waistline
                  </p>
                  <p>
                    <strong className="font-bold text-[#111111]">Hip:</strong> Measure around the widest part of your natural hip line
                  </p>
                  <p className="text-[11px] text-[#666666] pt-0.5">
                    Above size chart is for body measurements.
                  </p>
                </div>
              </div>

              {/* Mobile Only: Body Silhouette Vector Diagram at bottom */}
              <div className="block sm:hidden mt-4">
                <FemaleMeasurementDiagram />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSizeGuideModal;
