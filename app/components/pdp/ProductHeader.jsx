/**
 * Product Header displaying Title
 * Matches Live Lifestyle Store PDP layout (no vendor label above title)
 */
export function ProductHeader({title}) {
  if (!title) return null;

  return (
    <div className="mb-2 sm:mb-2.5">
      <h1 className="text-[15px] sm:text-[16px] font-normal text-[#141414] leading-[18px] tracking-tight">
        {title}
      </h1>
    </div>
  );
}
