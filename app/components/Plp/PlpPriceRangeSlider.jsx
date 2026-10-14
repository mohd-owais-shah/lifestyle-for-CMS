import {useState, useEffect} from 'react';

export function PlpPriceRangeSlider({
  min = 0,
  max = 10000,
  currentMin,
  currentMax,
  onApply,
}) {
  const [minVal, setMinVal] = useState(currentMin != null ? currentMin : min);
  const [maxVal, setMaxVal] = useState(currentMax != null ? currentMax : max);

  useEffect(() => {
    if (currentMin != null) setMinVal(currentMin);
    else setMinVal(min);
  }, [currentMin, min]);

  useEffect(() => {
    if (currentMax != null) setMaxVal(currentMax);
    else setMaxVal(max);
  }, [currentMax, max]);

  const safeMin = Math.min(minVal, maxVal - 50);
  const safeMax = Math.max(maxVal, minVal + 50);

  const rangeSpan = max - min > 0 ? max - min : 1;
  const leftPercent = Math.max(0, Math.min(100, ((safeMin - min) / rangeSpan) * 100));
  const rightPercent = Math.max(0, Math.min(100, ((max - safeMax) / rangeSpan) * 100));

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - 50);
    setMinVal(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + 50);
    setMaxVal(value);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onApply) {
      onApply({min: minVal, max: maxVal});
    }
  };

  return (
    <div className="w-full pt-1 pb-3">
      {/* 1. Dual Slider Rail and Draggable Knobs */}
      <div className="relative w-full h-8 flex items-center">
        {/* Background Track */}
        <div className="absolute w-full h-[3px] bg-gray-200 rounded-full" />

        {/* Active Amber Highlight Bar */}
        <div
          className="absolute h-[3px] bg-[#FAA619] rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${rightPercent}%`,
          }}
        />

        {/* Min Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          onMouseUp={handleSubmit}
          onTouchEnd={handleSubmit}
          aria-label="Minimum price slider"
          className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent opacity-0 z-20 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-xs [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-gray-400"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          onMouseUp={handleSubmit}
          onTouchEnd={handleSubmit}
          aria-label="Maximum price slider"
          className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent opacity-0 z-30 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-xs [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-gray-400"
        />

        {/* Visual Knobs to ensure crisp rendering on all browsers */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border border-gray-400 shadow-xs -translate-x-1/2 pointer-events-none z-10 transition-transform"
          style={{left: `${leftPercent}%`}}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-white border border-gray-400 shadow-xs -translate-x-1/2 pointer-events-none z-10 transition-transform"
          style={{left: `${100 - rightPercent}%`}}
        />
      </div>

      {/* 2. Minimum & Maximum Input Form with Apply Button matching Image 4 */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 mt-2">
        <div className="flex-1">
          <label htmlFor="price-min-input" className="block text-[11px] text-gray-500 mb-1 font-normal">
            Minimum
          </label>
          <div className="relative flex items-center border border-gray-200 rounded-xs bg-white h-[34px] px-2.5 focus-within:border-gray-400">
            <span className="text-xs text-gray-400 mr-1 select-none font-normal">₹</span>
            <input
              id="price-min-input"
              type="number"
              value={minVal}
              onChange={(e) => setMinVal(Number(e.target.value) || 0)}
              className="w-full bg-transparent text-xs text-gray-800 outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="flex-1">
          <label htmlFor="price-max-input" className="block text-[11px] text-gray-500 mb-1 font-normal">
            Maximum
          </label>
          <div className="relative flex items-center border border-gray-200 rounded-xs bg-white h-[34px] px-2.5 focus-within:border-gray-400">
            <span className="text-xs text-gray-400 mr-1 select-none font-normal">₹</span>
            <input
              id="price-max-input"
              type="number"
              value={maxVal}
              onChange={(e) => setMaxVal(Number(e.target.value) || max)}
              className="w-full bg-transparent text-xs text-gray-800 outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <button
          type="submit"
          aria-label="Apply price filter"
          className="h-[34px] w-[34px] border border-gray-200 hover:border-gray-400 rounded-xs bg-white flex items-center justify-center text-[#FAA619] hover:text-[#E09010] cursor-pointer transition-colors shrink-0"
        >
          <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
