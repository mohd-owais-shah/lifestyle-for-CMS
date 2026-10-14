import {useNavigate, Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {DeliveryLocationPicker} from '~/components/DeliveryLocationPicker';

/**
 * Mobile Top Header and Location Bar matching Live Lifestyle Store mobile PDP:
 * - Back button with Title
 * - Search, Wishlist, Cart Bag icons
 * - "Enable location for a better experience" banner
 * Strictly visible on mobile only (hidden on lg+ screens).
 */
export function PdpMobileHeader({ title = 'Product Details', hideLocationBar = false }) {
  const navigate = useNavigate();
  const { open } = useAside();

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#ECEDEB]">
      {/* 1. Main Navigation Row */}
      <div className="h-[52px] px-4 flex items-center justify-between">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1 -ml-1 text-[#141414] hover:text-[#FAA619] transition-colors cursor-pointer bg-transparent border-0"
            aria-label="Back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <span className="text-[16px] font-semibold text-[#141414] tracking-tight">
            {title}
          </span>
        </div>

        {/* Right: Search, Wishlist, Cart */}
        <div className="flex items-center gap-4 text-[#141414]">
          {/* Search */}
          <button onClick={() => open('search')} className="text-[#141414] hover:text-[#FAA619] transition-colors bg-transparent border-0" aria-label="Search">
            <svg viewBox="568 154 20 20" className="w-[22px] h-[22px]">
              <path d="M576.328 154C580.918 154 584.656 157.738 584.656 162.328C584.656 164.324 583.948 166.157 582.771 167.594L587.744 172.566C587.962 172.775 588.049 173.085 587.973 173.377C587.897 173.669 587.669 173.897 587.377 173.973C587.085 174.049 586.775 173.962 586.566 173.744L581.594 168.771C580.157 169.948 578.324 170.656 576.328 170.656C571.738 170.656 568 166.918 568 162.328C568 157.739 571.739 154 576.328 154ZM576.328 155.666C572.639 155.666 569.666 158.639 569.666 162.328C569.666 166.018 572.639 168.991 576.328 168.991C580.018 168.991 582.991 166.018 582.991 162.328C582.991 158.639 580.018 155.666 576.328 155.666Z" fill="currentColor" />
            </svg>
          </button>

          {/* Wishlist */}
          <Link to="/account" className="text-[#141414] hover:text-[#FAA619] transition-colors" aria-label="Wishlist">
            <svg viewBox="603 154 22 20" className="w-[24px] h-[24px]">
              <path fillRule="evenodd" clipRule="evenodd" d="M614 170.294L620.976 163.125C622.26 161.805 622.26 159.666 620.976 158.346C619.692 157.026 617.61 157.026 616.325 158.346L614.581 160.138C614.26 160.468 613.74 160.468 613.419 160.138L611.675 158.346C610.391 157.026 608.308 157.026 607.024 158.346C605.74 159.666 605.74 161.805 607.024 163.125L614 170.294ZM614 158.346L615.163 157.151C617.089 155.172 620.212 155.172 622.139 157.151C624.065 159.131 624.065 162.34 622.139 164.32L614.581 172.086C614.26 172.416 613.74 172.416 613.419 172.086L605.862 164.32C603.935 162.34 603.935 159.131 605.862 157.151C607.788 155.172 610.911 155.172 612.837 157.151L614 158.346Z" fill="currentColor" />
            </svg>
          </Link>

          {/* Cart Bag */}
          <Link
            to="/cart"
            className="text-[#141414] hover:text-[#FAA619] transition-colors relative"
            aria-label="Cart"
          >
            <svg viewBox="640 154 20 19" className="w-[24px] h-[24px]">
              <path fillRule="evenodd" clipRule="evenodd" d="M655.143 160.25H656.227C657.081 160.25 657.804 160.86 657.925 161.681L659.149 170.014C659.283 170.926 658.632 171.77 657.694 171.9C657.614 171.911 657.533 171.917 657.452 171.917H642.548C641.601 171.917 640.833 171.17 640.833 170.25C640.833 170.171 640.839 170.092 640.85 170.014L642.075 161.681C642.196 160.86 642.919 160.25 643.772 160.25H644.857C644.857 157.489 647.159 155.25 650 155.25C652.84 155.25 655.143 157.489 655.143 160.25ZM646.571 160.25H653.428C653.428 158.409 651.893 156.917 650 156.917C648.106 156.917 646.571 158.409 646.571 160.25ZM642.548 170.25L643.772 161.917H656.227L657.452 170.25H642.548Z" fill="currentColor" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 2. Delivery location bar (shared pincode across the store) */}
      {!hideLocationBar && <DeliveryLocationPicker variant="pdp" />}
    </div>
  );
}
