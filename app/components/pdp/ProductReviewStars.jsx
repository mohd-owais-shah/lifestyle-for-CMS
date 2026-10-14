const STAR_PATH =
  'M12 2.5l2.89 5.86 6.47.94-4.68 4.56 1.1 6.44L12 17.77l-5.78 3.03 1.1-6.44L2.64 9.3l6.47-.94L12 2.5z';

export function StarIcon({filled = false, className = ''}) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d={STAR_PATH}
        fill={filled ? '#FAA619' : 'none'}
        stroke={filled ? '#FAA619' : '#C4C4C4'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRatingRow({count = 5, filledCount = 0, sizeClass = 'w-4 h-4'}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({length: count}, (_, i) => (
        <StarIcon key={i} filled={i < filledCount} className={sizeClass} />
      ))}
    </div>
  );
}
