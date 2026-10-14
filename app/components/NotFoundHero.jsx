import {Link} from 'react-router';

/**
 * 404 Not Found Hero Component
 * Matches the official Lifestyle Stores 404 page layout and responsiveness:
 * Displays the 404 shopping cart image with an overlaid semi-transparent dark box,
 * headline, message, and "TAKE ME HOME" action button.
 */
export function NotFoundHero() {
  return (
    <section className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] flex items-center lg:items-end justify-center lg:justify-start overflow-hidden bg-[#e4ded6]">
      {/* Background 404 Banner Image */}
      <img
        src="https://assets-cloud.landmarkshops.in/website_images/common/404.jpg"
        alt="404 - Page Not Found"
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-[70%_center]"
        loading="eager"
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:pb-16 xl:pb-20">
        <div className="mx-auto lg:mx-0 w-full max-w-[360px] sm:max-w-[430px] bg-black/65 backdrop-blur-[1px] p-6 sm:p-8 text-left shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase mb-3 font-sans">
            HMM, THIS ISN&#39;T RIGHT
          </h1>
          <p className="text-[13px] sm:text-[14px] text-white/95 leading-relaxed mb-6 font-normal font-sans">
            The link may be broken, we&#39;ve taken the page down or you may have
            typed the link incorrectly. The truth is out there.
          </p>
          <Link
            to="/"
            className="block sm:inline-block w-full sm:w-auto text-center bg-[#faa61a] hover:bg-[#e09214] text-white font-bold text-xs sm:text-sm py-3 px-8 uppercase tracking-wider transition-colors"
          >
            TAKE ME HOME
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundHero;
