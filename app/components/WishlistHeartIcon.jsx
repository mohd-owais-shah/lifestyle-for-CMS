/**
 * Favourite (wishlist) heart used on product cards and the product page.
 * Heart outline with plus badge when not saved, solid red heart with checkmark badge when saved.
 * @param {{saved?: boolean, width?: number|string, height?: number|string, className?: string}}
 */
export function WishlistHeartIcon({
  saved = false,
  width = 18,
  height = 20,
  className = '',
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Heart */}
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={saved ? '#E53935' : 'none'}
        stroke={saved ? '#E53935' : '#1A1A1A'}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circle Badge */}
      <circle
        cx="17"
        cy="18"
        r="5.4"
        fill={saved ? '#E53935' : '#FFFFFF'}
        stroke={saved ? '#FFFFFF' : '#1A1A1A'}
        strokeWidth={1.5}
      />
      {/* Plus (unfaved) or Checkmark (faved) */}
      {saved ? (
        <path
          d="M14.7 17.9L16.4 19.6L19.3 16.3"
          stroke="#FFFFFF"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M14.7 18H19.3M17 15.7V20.3"
          stroke="#1A1A1A"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
