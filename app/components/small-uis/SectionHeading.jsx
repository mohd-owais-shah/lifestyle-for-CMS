export function SectionHeading({ heading }) {
  if (!heading) return null;

  return (
    <div className="flex flex-col items-start pt-4 sm:pt-0 mb-3 sm:mb-6">
      <h2 className="text-[18px] sm:text-[24px] font-bold sm:font-semibold leading-[26px] sm:leading-[32px] text-[#000000] tracking-normal">
        {heading}
      </h2>
      <span className="w-[38px] sm:w-[48px] border-b-2 sm:border-b-[3px] border-[#FAA619] mt-1 block" />
    </div>
  );
}

export default SectionHeading;
