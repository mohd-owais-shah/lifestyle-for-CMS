import {shopifyImageUrl} from '~/lib/shopifyImage';
import { useEffect } from 'react';

/**
 * Toast matching Live Lifestyle Store PDP:
 * - Exact Dimensions: 311.56px x 76px (~312px x 76px)
 * - Background: #323232
 * - Padding: 6px 16px
 * - Mobile (< lg): Fixed top under header
 * - Desktop (>= lg): Fixed top-right below category navigation bar, positioned over right column
 */
export function AddedToBasketToast({ isOpen, onClose, image, title }) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-[64px] left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:top-[135px] lg:right-[max(48px,calc((100vw-1276px)/2+70px))] z-[1000] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="bg-[#323232] text-white px-[16px] py-[6px] w-[312px] h-[76px] rounded-[4px] shadow-[0px_3px_5px_-1px_rgba(0,0,0,0.2),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_1px_18px_0px_rgba(0,0,0,0.12)] flex items-center gap-[12px] pointer-events-auto max-w-[calc(100vw-24px)]">
        {/* Product Thumbnail inside card */}
        {image && (
          <div className="w-[44px] h-[58px] bg-white rounded-[2px] p-[2px] shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={shopifyImageUrl(image, {width: 80})}
              alt={title || 'Product'}
              className="w-full h-full object-contain rounded-[1px]"
            />
          </div>
        )}

        {/* Message */}
        <span className="text-[14px] font-medium text-white leading-[20px] tracking-normal">
          Nice pick! Product added to basket.
        </span>
      </div>
    </div>
  );
}

export default AddedToBasketToast;

