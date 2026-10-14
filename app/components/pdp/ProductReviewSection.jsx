import React, { useEffect, useMemo, useRef, useState } from 'react';

const StarFillIcon = ({ width = 16, height = 16, className = '' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="#F5A623"
    stroke="#F5A623"
    strokeWidth="1"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StarOutlineIcon = ({ width = 16, height = 16, className = '' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4C4C4"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const CheckboxCheckedIcon = ({ width = 32, height = 32 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#16A34A" />
    <path
      d="M8 12.5l2.5 2.5 5.5-5.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = ({ width = 20, height = 20, stroke = '#111111' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const DownIcon = ({ width = 13, height = 13 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#111111"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const AccountIcon = ({ width = 20, height = 20 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#666666"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UploadIcon = ({ width = 48, height = 48 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#999999"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export function ProductReviewSection({ review, reviews, data }) {
  const initialReviews = review || reviews || [];
  const [localReviews, setLocalReviews] = useState(initialReviews);

  useEffect(() => {
    setLocalReviews(review || reviews || []);
  }, [review, reviews]);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasEverHadReviews, setHasEverHadReviews] = useState(false);

  useEffect(() => {
    if (localReviews && localReviews.length > 0) {
      setHasEverHadReviews(true);
    }
  }, [localReviews]);

  const [successTitle, setSuccessTitle] = useState('Review Submitted!');
  const [successBody, setSuccessBody] = useState(
    'Thank you! Your review will be published as soon as it is approved by the shop admin.'
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Most Recent');

  const reviewSortOptions = useMemo(
    () => [
      'Most Recent',
      'Highest Rating',
      'Lowest Rating',
      'Only Pictures',
      'Pictures First',
      'Videos First',
      'Most Helpful',
    ],
    []
  );

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '', name: '', email: '' });

  useEffect(() => {
    setErrors({ title: '', content: '', name: '', email: '' });
  }, [isModalVisible]);

  const renderModalStars = () => {
    return [1, 2, 3, 4, 5].map((starIndex) => {
      const isFilled = starIndex <= rating;
      const StarComponent = isFilled ? StarFillIcon : StarOutlineIcon;

      return (
        <button
          key={starIndex}
          type="button"
          onClick={() => setRating(starIndex)}
          className={`cursor-pointer bg-transparent border-0 p-0 ${
            starIndex > 1 ? 'ml-1' : ''
          }`}
          aria-label={`Rate ${starIndex} stars`}
        >
          <StarComponent width={24} height={24} />
        </button>
      );
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    let valid = true;
    let newErrors = { title: '', content: '', name: '', email: '' };

    if (!title.trim()) {
      newErrors.title = 'Review title is mandatory';
      valid = false;
    }
    if (!content.trim()) {
      newErrors.content = 'Review content is mandatory';
      valid = false;
    }
    if (!displayName.trim()) {
      newErrors.name = 'Display name is mandatory';
      valid = false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setIsLoading(true);

    // Simulate review submission with local state update
    setTimeout(() => {
      setIsLoading(false);
      setIsModalVisible(false);

      const newReview = {
        id: `local-rev-${Date.now()}`,
        rating: rating || 5,
        title: title.trim(),
        body: content.trim(),
        created_at: new Date().toISOString(),
        reviewer: {
          name: displayName.trim(),
        },
      };

      setLocalReviews((prev) => [newReview, ...prev]);
      setSuccessTitle('Review Submitted!');
      setSuccessBody(
        'Thank you! Your review will be published as soon as it is approved by the shop admin.'
      );
      setIsSubmitted(true);

      // Reset form
      setTitle('');
      setContent('');
      setDisplayName('');
      setEmail('');
      setRating(0);
    }, 600);
  };

  const totalReviews = localReviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? localReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalReviews
      : 0;

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    localReviews.forEach((r) => {
      if (dist[r.rating] !== undefined) {
        dist[r.rating]++;
      }
    });
    return dist;
  }, [localReviews]);

  const renderStaticStars = (ratingVal) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= Math.round(ratingVal) ? (
            <StarFillIcon key={star} width={16} height={16} />
          ) : (
            <StarOutlineIcon key={star} width={16} height={16} />
          )
        )}
      </div>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }
    return d.toLocaleDateString();
  };

  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  };

  const renderSuccessUI = () => (
    <div className="mt-6 flex flex-col items-center px-4 w-full text-center">
      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4">
        <CheckboxCheckedIcon width={32} height={32} />
      </div>
      <h4 className="text-[20px] font-bold text-black mb-3 text-center">{successTitle}</h4>
      <p className="text-[14px] text-black text-center leading-[22px] max-w-sm">{successBody}</p>
    </div>
  );

  return (
    <div className="px-[15px] py-5 bg-white font-sans">
      <div className="bg-white rounded-[12px] p-5 border border-[#eaeaea]">
        <h3 className="text-[18px] font-bold text-black text-center mb-[15px] tracking-[0.5px]">
          CUSTOMER REVIEWS
        </h3>

        {totalReviews === 0 && !hasEverHadReviews ? (
          <>
            <div className="h-[1px] bg-[#eaeaea] mb-5" />

            <div className="flex items-center justify-center mb-[25px]">
              <div className="flex mr-2.5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <StarOutlineIcon key={item} width={16} height={16} />
                ))}
              </div>
              <span className="text-[15px] text-black font-normal">
                Be the first to write a review
              </span>
            </div>

            <div className="h-[1px] bg-[#eaeaea] mb-5" />

            <button
              type="button"
              onClick={() => setIsModalVisible(true)}
              className="w-full bg-[#008080] h-[45px] rounded-[4px] flex items-center justify-center text-white text-[12px] font-semibold tracking-wider uppercase border-0 cursor-pointer hover:opacity-95"
            >
              WRITE A REVIEW
            </button>

            {isSubmitted && renderSuccessUI()}
          </>
        ) : (
          <div className="w-full mt-4">
            <div className="flex items-center justify-center mb-1">
              {renderStaticStars(averageRating)}
              <span className="text-[16px] text-black ml-3 font-semibold">
                {averageRating.toFixed(2)} out of 5
              </span>
            </div>
            <p className="text-[14px] text-gray-500 text-center mb-6">
              Based on {totalReviews} review{totalReviews > 1 ? 's' : ''}
            </p>

            <div className="w-full mb-6">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center mb-2">
                    {renderStaticStars(star)}
                    <div className="flex-1 h-2 bg-[#eaeaea] mx-3 rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-black rounded-[2px] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[14px] text-gray-500 w-5 text-right font-medium">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsModalVisible(true)}
              className="w-full bg-[#008080] h-[45px] rounded-[4px] flex items-center justify-center text-white text-[12px] font-semibold tracking-wider uppercase border-0 cursor-pointer hover:opacity-95"
            >
              Write a review
            </button>

            {isSubmitted ? (
              renderSuccessUI()
            ) : (
              <>
                {/* Filter sort button */}
                <div className="relative mt-6">
                  <button
                    type="button"
                    onClick={() => setIsDropdownVisible((prev) => !prev)}
                    className="w-full flex items-center py-4 border-b border-[#eaeaea] bg-transparent border-t-0 border-x-0 cursor-pointer text-left"
                  >
                    <span className="text-[14px] text-black mr-2.5 font-medium">{selectedSort}</span>
                    <DownIcon width={13} height={13} />
                  </button>

                  {isDropdownVisible && (
                    <>
                      <div
                        className="fixed inset-0 z-30 bg-transparent"
                        onClick={() => setIsDropdownVisible(false)}
                      />
                      <div className="absolute left-0 top-full mt-1 bg-white rounded-[8px] py-2 w-[200px] max-h-[240px] overflow-y-auto border border-gray-200 shadow-xl z-40">
                        {reviewSortOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedSort(option);
                              setIsDropdownVisible(false);

                              let sorted = [...localReviews];
                              if (option === 'Highest Rating') {
                                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                              } else if (option === 'Lowest Rating') {
                                sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
                              } else if (option === 'Most Recent') {
                                sorted.sort(
                                  (a, b) =>
                                    new Date(b.created_at || 0).getTime() -
                                    new Date(a.created_at || 0).getTime()
                                );
                              }
                              setLocalReviews(sorted);
                              setActiveIndex(0);
                            }}
                            className="w-full text-left py-3 px-4 text-[14px] text-black border-b border-gray-100 last:border-b-0 bg-transparent cursor-pointer hover:bg-gray-50"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Reviews List Carousel */}
                {localReviews.length > 0 ? (
                  <div className="w-full mt-4">
                    <div
                      ref={carouselRef}
                      onScroll={handleScroll}
                      className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {localReviews.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="shrink-0 w-full snap-start border-b border-gray-200 pb-4 mb-4"
                        >
                          <div className="flex justify-between items-center mb-3">
                            {renderStaticStars(item.rating || 5)}
                            <span className="text-[14px] text-gray-400">
                              {formatDate(item.created_at)}
                            </span>
                          </div>

                          <div className="flex items-center mb-3">
                            <div className="w-[30px] h-[30px] bg-gray-200 flex items-center justify-center mr-2 rounded-full overflow-hidden">
                              <AccountIcon width={20} height={20} />
                            </div>
                            <span className="text-[14px] text-black font-semibold">
                              {item.reviewer?.name || item.name || 'Anonymous'}
                            </span>
                          </div>

                          {item.title && (
                            <h4 className="text-[16px] font-bold text-black mb-1">{item.title}</h4>
                          )}
                          <p className="text-[14px] text-gray-600 leading-5 whitespace-pre-line">
                            {item.body || item.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {localReviews.length > 1 && (
                      <div className="flex justify-center items-center mt-2 mb-6">
                        {localReviews.map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full mx-1 transition-all ${
                              activeIndex === index ? 'w-5 bg-black' : 'w-2 bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full text-center py-10">
                    <p className="text-[16px] text-gray-500 mb-6">
                      No reviews found for this filter.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {isModalVisible && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 flex flex-col justify-end lg:justify-center items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-t-[16px] lg:rounded-[16px] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-[20px] font-bold text-[#222222] text-center flex-1">
                Write a review
              </h3>
              <button
                type="button"
                onClick={() => setIsModalVisible(false)}
                className="bg-transparent border-0 cursor-pointer p-1 text-gray-800"
                aria-label="Close modal"
              >
                <CloseIcon width={20} height={20} stroke="#111111" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5">
              <div className="text-center mb-6">
                <label className="block text-[16px] text-black font-semibold mb-2">
                  Rating
                </label>
                <div className="flex justify-center gap-1">
                  {renderModalStars()}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[14px] font-bold text-[#333333] mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  placeholder="Give your review a title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  className={`w-full border rounded-[6px] p-2.5 text-[14px] text-[#333333] bg-[#f9f9f9] outline-none ${
                    errors.title ? 'border-red-500' : 'border-[#cccccc]'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-[14px] font-bold text-[#333333] mb-2">
                  Review content
                </label>
                <textarea
                  rows={4}
                  placeholder="Start writing here..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors({ ...errors, content: '' });
                  }}
                  className={`w-full border rounded-[6px] p-2.5 text-[14px] text-[#333333] bg-[#f9f9f9] outline-none resize-none ${
                    errors.content ? 'border-red-500' : 'border-[#cccccc]'
                  }`}
                />
                {errors.content && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.content}</p>
                )}
              </div>

              <div className="mb-6 text-center">
                <label className="block text-[14px] font-bold text-[#333333] mb-2 text-left">
                  Picture/Video (optional)
                </label>
                <div className="w-[130px] h-[130px] border border-dashed border-gray-300 rounded-[8px] mx-auto flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                  <UploadIcon width={40} height={40} />
                  <span className="text-[12px] text-gray-500 mt-2">Upload File</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[14px] text-black mb-2">
                  Display name ( displayed publicly like{' '}
                  <span className="text-[#008080] font-bold">John Smith</span> )
                </label>
                <input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full border rounded-[6px] p-2.5 text-[14px] text-[#333333] bg-[#f9f9f9] outline-none ${
                    errors.name ? 'border-red-500' : 'border-[#cccccc]'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#333333] mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full border rounded-[6px] p-2.5 text-[14px] text-[#333333] bg-[#f9f9f9] outline-none ${
                    errors.email ? 'border-red-500' : 'border-[#cccccc]'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
                )}
              </div>

              <p className="text-[14px] text-black text-center leading-5 mb-6">
                How we use your data: We'll only contact you about the review you left, and only
                if necessary. By submitting your review, you agree to Judge.me's{' '}
                <span className="text-blue-600 underline cursor-pointer">terms</span>,{' '}
                <span className="text-blue-600 underline cursor-pointer">privacy</span> and{' '}
                <span className="text-blue-600 underline cursor-pointer">content</span> policies.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#008080] text-white h-[50px] rounded-[4px] font-bold text-[16px] mb-3 border-0 cursor-pointer hover:opacity-95 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Review'}
              </button>

              <button
                type="button"
                onClick={() => setIsModalVisible(false)}
                className="w-full bg-transparent border border-[#008080] text-[#008080] h-[50px] rounded-[4px] font-bold text-[16px] mb-6 cursor-pointer hover:bg-teal-50"
              >
                Cancel review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProductReviewSection;
