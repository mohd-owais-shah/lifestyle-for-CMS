import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {resolveTargetUrl} from '~/lib/urlUtils';

/**
 * Helper to map metaobject fields array into a key-value object
 * @param {Array<{key: string, value: string, reference?: any, references?: any}>} fields
 */
function mapMetaobjectFields(fields = []) {
  const mapped = {};
  for (const field of fields) {
    mapped[field.key] = field;
  }
  return mapped;
}

/**
 * Helper to safely extract image object from various reference structures
 * @param {any} ref
 */
function extractImageFromReference(ref) {
  if (!ref) return null;
  if (ref.image) return ref.image;
  if (ref.reference?.image) return ref.reference.image;
  return null;
}

/**
 * Category cards from the `home_page` → `department-list` metaobject, sorted.
 * Each card's url is its Category URL with the store domain stripped
 * (https://…myshopify.com/departments/women_department ->
 * /departments/women_department), or its collection when there is no URL.
 * @param {any} data
 */
export function parseHeroCategories(data) {
  if (!data) return [];
  const fields = mapMetaobjectFields(data.fields);

  // Get the category nodes
  const sectionDataField = fields.section_data;
  let categoryNodes = [];
  if (sectionDataField?.references?.nodes?.length > 0) {
    categoryNodes = sectionDataField.references.nodes;
  } else if (sectionDataField?.reference?.fields) {
    const containerFields = mapMetaobjectFields(sectionDataField.reference.fields);
    for (const f of Object.values(containerFields)) {
      if (f?.references?.nodes?.length > 0) {
        categoryNodes = f.references.nodes;
        break;
      }
    }
  }

  // Process and sort cards
  const categories = categoryNodes.map((node) => {
    const nodeFields = mapMetaobjectFields(node.fields);
    
    // Extract Image
    const image =
      extractImageFromReference(nodeFields.categories_images_mobile?.reference) ||
      extractImageFromReference(nodeFields.image?.reference) ||
      extractImageFromReference(nodeFields.icon?.reference) ||
      nodeFields.categories_images_mobile?.reference?.image ||
      nodeFields.image?.reference?.image;
    
    const url = resolveTargetUrl(nodeFields) || resolveTargetUrl(node.fields) || '#';

    return {
      id: node.id,
      name:
        nodeFields.category_name?.value ||
        nodeFields.name?.value ||
        nodeFields.title?.value ||
        nodeFields.label?.value ||
        node.handle ||
        '',
      url,
      image,
      sortOrder: nodeFields.sort_order?.value ? parseInt(nodeFields.sort_order.value, 10) : 0,
    };
  });

  return categories.sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Department page links set in the admin, keyed by lowercase category name,
 * e.g. {women: '/departments/women_department'}. Only /departments/ links,
 * so placeholder links (LUXE -> /collections/all) don't replace menu routes.
 * @param {any} data
 * @returns {Record<string, string>}
 */
export function getDepartmentLinks(data) {
  const links = {};
  for (const cat of parseHeroCategories(data)) {
    if (cat.name && /^\/departments\//.test(cat.url)) {
      links[cat.name.trim().toLowerCase()] = cat.url;
    }
  }
  return links;
}

export function MobileHeroCategories({data}) {
  if (!data) return null;

  // If hide_section is true, don't render
  if (mapMetaobjectFields(data.fields).hide_section?.value === 'true') {
    return null;
  }

  const categories = parseHeroCategories(data);
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="block lg:hidden w-full bg-white overflow-hidden py-3 mb-1 border-b-[1px] border-gray-100">
      <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar">
        {categories.map((cat, index) => {
          const isExternal =
            typeof cat.url === 'string' &&
            (cat.url.startsWith('http://') || cat.url.startsWith('https://'));

          const cardContent = (
            <>
              <div className="w-[62px] min-h-[70px] rounded-[16px] overflow-hidden shrink-0 flex items-center justify-center">
                {cat.image ? (
                  <Image
                    data={cat.image}
                    alt={cat.name}
                    className="w-full min-h-[70px] object-cover rounded-[16px]"
                    sizes="62px"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full min-h-[70px] bg-gray-100 rounded-[16px]"></div>
                )}
              </div>
              <span className="text-[12px] font-semibold text-center text-[#000000] pt-[4px] whitespace-nowrap">
                {cat.name}
              </span>
            </>
          );

          if (isExternal) {
            return (
              <a
                key={cat.id || index}
                href={cat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center shrink-0 cursor-pointer"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <Link
              key={cat.id || index}
              to={cat.url}
              className="flex flex-col items-center shrink-0 cursor-pointer"
              prefetch="intent"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
