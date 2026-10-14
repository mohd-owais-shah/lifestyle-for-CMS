import {Link} from 'react-router';

/**
 * Dynamic Breadcrumb navigation for PDP matching Live Lifestyle Stores:
 * Format: ▸ Department ▸ Category ▸ Subcategory
 * (e.g. ▸ Women ▸ Ethnic Wear ▸ Kurtas and Kurtis)
 * Zero static hardcoding: dynamically derived from product data
 */
export function PdpBreadcrumbs({product}) {
  if (!product) return null;

  const titleLower = (product.title || '').toLowerCase();
  const typeLower = (product.productType || '').toLowerCase();
  const tagsLower = (product.tags || []).map((t) => t.toLowerCase());

  // Filter collections to exclude generic ones
  const validCollections = (product.collections?.nodes || []).filter((col) => {
    const colName = col.title.toLowerCase();
    const handle = (col.handle || '').toLowerCase();
    return (
      colName !== 'home page' &&
      colName !== 'homepage' &&
      colName !== 'all' &&
      colName !== 'all products' &&
      handle !== 'frontpage' &&
      handle !== 'all'
    );
  });

  const checkKeyword = (keywords) => {
    return keywords.some(
      (k) =>
        typeLower.includes(k) ||
        titleLower.includes(k) ||
        tagsLower.some((t) => t.includes(k)) ||
        validCollections.some((c) => c.title.toLowerCase().includes(k))
    );
  };

  // 1. Determine Department (Department / Gender)
  let department = {label: 'Women', url: '/departments/women_department'};

  if (checkKeyword(['men', 'gent', 'boys', 'male', 'polo', 'trunks']) && !checkKeyword(['women', 'ladies', 'girls', 'female'])) {
    department = {label: 'Men', url: '/departments/men_department'};
  } else if (checkKeyword(['kids', 'infant', 'baby', 'babyshop', 'toddler'])) {
    department = {label: 'Kids', url: '/departments/kids_department'};
  } else if (checkKeyword(['beauty', 'makeup', 'skincare', 'primer', 'concealer', 'nail', 'cosmetic'])) {
    department = {label: 'Beauty', url: '/departments/beauty_department'};
  } else if (checkKeyword(['footwear', 'shoes', 'running shoes', 'sandals', 'sneakers'])) {
    department = {label: 'Footwear', url: '/departments/footwear_department'};
  } else if (checkKeyword(['bags', 'backpack', 'handbag', 'sling', 'pouch', 'wallet'])) {
    department = {label: 'Bags', url: '/departments/bags_department'};
  } else if (checkKeyword(['watch', 'watches', 'chronograph'])) {
    department = {label: 'Watches', url: '/sis/watches'};
  } else if (checkKeyword(['women', 'ladies', 'girls', 'female', 'kurta', 'kurti', 'saree', 'salwar', 'bra', 'panty'])) {
    department = {label: 'Women', url: '/departments/women_department'};
  } else if (validCollections.length > 0) {
    department = {
      label: validCollections[0].title,
      url: `/collections/${validCollections[0].handle}`,
    };
  }

  // 2. Determine Category
  let category = null;

  if (department.label === 'Women') {
    if (checkKeyword(['kurta', 'kurti', 'salwar', 'suit', 'ethnic', 'saree', 'lehenga', 'anarkali', 'palazzo', 'dupatta'])) {
      category = {label: 'Ethnic Wear', url: '/collections/all?q=Ethnic+Wear'};
    } else if (checkKeyword(['lingerie', 'bra', 'panty', 'sleepwear', 'brief'])) {
      category = {label: 'Lingerie/Sleepwear', url: '/collections/all?q=Lingerie'};
    } else if (checkKeyword(['top', 'tee', 'dress', 'jeans', 'trouser', 'skirt', 'shirt', 'jacket'])) {
      category = {label: 'Western Wear', url: '/collections/all?q=Western+Wear'};
    }
  } else if (department.label === 'Men') {
    if (checkKeyword(['shirt', 't-shirt', 'polo', 'jacket', 'hoodie', 'sweater', 'kurta', 'top'])) {
      category = {label: 'Topwear', url: '/collections/all?q=Topwear'};
    } else if (checkKeyword(['jeans', 'trouser', 'trousers', 'chinos', 'shorts', 'joggers'])) {
      category = {label: 'Bottomwear', url: '/collections/all?q=Bottomwear'};
    }
  } else if (department.label === 'Beauty') {
    category = {label: 'Makeup & Cosmetics', url: '/collections/all?q=Beauty'};
  } else if (department.label === 'Bags') {
    category = {label: 'Handbags & Backpacks', url: '/collections/all?q=Bags'};
  } else if (department.label === 'Footwear') {
    category = {label: 'Casual & Sports Shoes', url: '/collections/all?q=Footwear'};
  }

  // Fallback category from valid collections or productType
  if (!category && validCollections.length > 0) {
    category = {
      label: validCollections[0].title,
      url: `/collections/${validCollections[0].handle}`,
    };
  }

  // 3. Determine Subcategory (Final Crumb)
  let subcategory = null;
  if (checkKeyword(['kurta', 'kurti'])) {
    subcategory = 'Kurtas and Kurtis';
  } else if (checkKeyword(['polo'])) {
    subcategory = 'Polo T-shirts';
  } else if (checkKeyword(['t-shirt', 'tee'])) {
    subcategory = 'T-Shirts';
  } else if (checkKeyword(['jeans'])) {
    subcategory = 'Jeans';
  } else if (checkKeyword(['trouser', 'trousers'])) {
    subcategory = 'Trousers';
  } else if (checkKeyword(['dress', 'dresses'])) {
    subcategory = 'Dresses';
  } else if (checkKeyword(['backpack'])) {
    subcategory = 'Backpacks';
  } else if (product.productType) {
    subcategory = product.productType;
  } else if (validCollections.length > 1) {
    subcategory = validCollections[1].title;
  }

  // Build the crumbs array
  const crumbs = [department];
  if (category && category.label.toLowerCase() !== department.label.toLowerCase()) {
    crumbs.push(category);
  }

  return (
    <nav aria-label="Breadcrumb" className="pt-[12px] pb-0 px-0 text-[12px] sm:text-[13px] text-[#666666] font-normal flex items-center flex-wrap gap-1 select-none">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.url + idx} className="flex items-center gap-1">
          <span className="text-[#8E8E93] text-[9px] leading-none">▸</span>
          <Link
            to={crumb.url}
            className="text-[#666666] hover:text-[#000000] hover:underline transition-colors"
          >
            {crumb.label}
          </Link>
        </span>
      ))}

      {subcategory && (
        <span className="flex items-center gap-1">
          <span className="text-[#8E8E93] text-[9px] leading-none">▸</span>
          <span className="text-[#141414] font-medium">
            {subcategory}
          </span>
        </span>
      )}
    </nav>
  );
}
