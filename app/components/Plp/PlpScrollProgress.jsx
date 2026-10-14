import {useEffect, useState} from 'react';

/** Height of the fixed SORT / FILTER bar the pill sits above (px). */
const BOTTOM_BAR_PX = 48;
/** Scroll distance before the pill appears (px). */
const SHOW_AFTER_PX = 200;

/**
 * Mobile "↑ 12/2557 Products" pill (live site): how many products have been
 * scrolled into view out of the total, with a button back to the top.
 * @param {{
 *   gridRef: React.RefObject<HTMLElement | null>;
 *   total: number;
 * }}
 */
export function PlpScrollProgress({gridRef, total}) {
  const [seen, setSeen] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const grid = gridRef.current;
      if (!grid) return;
      const cards = grid.children;
      const viewportBottom = window.innerHeight - BOTTOM_BAR_PX;

      // Cards are in page order, so their tops only increase: binary search
      // for the first card that starts below the visible area.
      let low = 0;
      let high = cards.length;
      while (low < high) {
        const mid = (low + high) >> 1;
        if (cards[mid].getBoundingClientRect().top < viewportBottom) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }

      setSeen(Math.min(low, total));
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [gridRef, total]);

  if (total === 0) return null;

  return (
    <div
      className={`lg:hidden fixed left-1/2 -translate-x-1/2 z-40 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{bottom: `${BOTTOM_BAR_PX + 12}px`}}
      aria-hidden={!visible}
    >
      <div className="flex items-center h-9 rounded-md bg-[#4D4D4D]/90 text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] backdrop-blur-sm overflow-hidden">
        <button
          type="button"
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          aria-label="Back to top"
          tabIndex={visible ? 0 : -1}
          className="h-full px-2.5 flex items-center justify-center border-r border-white/30 cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
        <span
          className="px-3 text-[13px] font-medium whitespace-nowrap tabular-nums"
          aria-live="polite"
        >
          {seen}/{total} Products
        </span>
      </div>
    </div>
  );
}
