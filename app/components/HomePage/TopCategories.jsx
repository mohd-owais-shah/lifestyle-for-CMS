import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { SectionHeading } from '../small-uis/SectionHeading';
import { resolveTargetUrl } from '~/lib/urlUtils';

// Helper to extract text from simple string or rich text JSON
function getFieldValue(fields, keys) {
  if (!fields) return '';
  for (const key of keys) {
    const field = fields.find((f) => f.key.toLowerCase() === key.toLowerCase());
    if (field?.value) return field.value;
  }
  return '';
}

export function TopCategories({ data }) {
  const [activeTab, setActiveTab] = useState("");
  
  // Parse Data
  const headingText = data?.fields?.find(f => f.key === 'heading')?.reference?.fields?.find(f => f.key === 'heading')?.value 
                    || data?.fields?.find(f => f.key === 'heading')?.value
                    || "Top Categories";

  const sectionDataField = data?.fields?.find(f => 
    f.key.toLowerCase().replace(/_/g, '') === 'sectiondata'
  );
  
  const sectionDataRef = sectionDataField?.reference || sectionDataField?.references?.nodes?.[0];

  const categoriesField = sectionDataRef?.fields?.find(f => 
    f.key.toLowerCase() === 'categories'
  );
  
  const subcategoriesNodes = categoriesField?.references?.nodes || [];

  const parsedCategories = {};
  
  for (const node of subcategoriesNodes) {
    const fields = node.fields || [];
    const categoryName = getFieldValue(fields, ['category']) || 'Uncategorized';
    const name = getFieldValue(fields, ['name']);
    const img = fields.find(f => f.key === 'image')?.reference?.image?.url || '';
    const link = resolveTargetUrl(fields) || '#';
    const sortOrder = parseInt(getFieldValue(fields, ['sort_order', 'order']) || '0', 10);
    const id = node.id || name;

    if (!parsedCategories[categoryName]) {
      parsedCategories[categoryName] = { items: [] };
    }
    
    parsedCategories[categoryName].items.push({ id, title: name, link, img, sortOrder });
  }

  // Sort items by sortOrder
  for (const cat in parsedCategories) {
    parsedCategories[cat].items.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const DEFAULT_TABS_ORDER = ["Women", "Men", "Kids", "Shoes & Bags", "Glam", "Home"];
  const tabs = Object.keys(parsedCategories).sort((a, b) => {
    const indexA = DEFAULT_TABS_ORDER.indexOf(a);
    const indexB = DEFAULT_TABS_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  if (!data || tabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden pb-0 sm:pb-10">
      <section className="page-width">
        {/* Universal Heading Component */}
      <SectionHeading heading={headingText} />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row min-h-[400px]">
        {/* Sidebar */}
        <div className="w-[18%] max-w-[220px] bg-[var(--color-search-bg)] flex-shrink-0 pt-0">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <div 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`py-[12px] px-[20px] cursor-pointer transition-colors border-l-[3px] text-[15px] leading-[22px] ${
                  isActive 
                    ? 'border-[#FAA619] bg-[var(--color-light)] text-[#FAA619] font-bold' 
                    : 'border-transparent text-[var(--color-dark)] hover:bg-[#EAEBEA] font-medium'
                }`}
              >
                {tab}
              </div>
            );
          })}
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-[var(--color-light)] p-4 md:p-[24px] lg:pl-[48px] lg:pt-[0px]">
          <h3 className="text-[20px] leading-[28px] font-bold text-[var(--color-dark)] mb-[24px]">{activeTab}</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-[24px] gap-y-[48px]">
            {parsedCategories[activeTab]?.items?.length > 0 ? (
              parsedCategories[activeTab].items.map((item) => (
                <Link to={item.link} key={item.id} className="flex flex-col items-center group">
                  <div className="w-full flex justify-center">
                    {item.img ? (
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full max-w-[195px] aspect-square object-cover transition-transform duration-300" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full max-w-[195px] aspect-square bg-[var(--color-search-bg)] flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <span className="mt-[16px] text-[14px] leading-[20px] font-bold text-[var(--color-dark)] text-center group-hover:text-[#FAA619] transition-colors">{item.title}</span>
                </Link>
              ))
            ) : (
              <div className="text-gray-500 italic col-span-full">Content for {activeTab} coming soon...</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col">
        {tabs.map((tab) => {
          const items = parsedCategories[tab]?.items || [];
          if (items.length === 0) return null;
          return (
            <div key={tab} className="flex flex-col border-b border-gray-100 py-[16px] last:border-b-0">
              <h3 className="text-[16px] font-bold text-[var(--color-dark)] mb-[16px]">{tab}</h3>
              <div className="top-categories-slider no-scrollbar">
                {items.map((item) => (
                  <Link to={item.link} key={item.id} className="top-categories-slide" draggable="false">
                    <div className="top-categories-slide-img-wrap">
                      {item.img ? (
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className="top-categories-slide-img"
                          draggable="false"
                          loading="lazy"
                        />
                      ) : (
                        <div className="top-categories-slide-placeholder">
                          No Image
                        </div>
                      )}
                    </div>
                    <span className="top-categories-slide-title">
                      {item.title}
                    </span>
                  </Link>
                ))}

                {/* View All card */}
                <Link to="#" className="top-categories-slide" draggable="false">
                  <div className="top-categories-view-all-box">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FAA619" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="top-categories-view-all-text">
                    View All
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      </section>
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
    </div>
  );
}
