export function stripDomain(url) {
  if (!url) return '#';
  try {
    if (url.startsWith('http')) {
      const parsed = new URL(url);
      url = parsed.pathname + parsed.search + parsed.hash;
    }
  } catch {
    return '#';
  }
  return url;
}

/**
 * Department pages use Shopify's metaobject URL format, the same links the
 * admin stores: /departments/women_department.
 * @param {string} key department key, e.g. "women" or "homeliving"
 */
export function departmentPath(key) {
  return `/departments/${key}_department`;
}

/**
 * Department key from a URL slug: "women_department", "women",
 * "home_living_department" and "home-living" -> "women" / "homeliving".
 * @param {string | undefined} slug
 */
export function departmentKeyFromSlug(slug) {
  return String(slug || '')
    .toLowerCase()
    .replace(/[-_]department$/, '')
    .replace(/[-_]/g, '');
}

/**
 * Normalize any department link (/department/women, /departments/women,
 * /departments/home-living_department) to the canonical departmentPath().
 * @param {string} path
 */
export function normalizeDepartmentPath(path) {
  const match = path.match(/^\/departments?\/([a-z0-9_-]+)\/?(?=$|[?#])/i);
  if (!match) return path;
  return (
    departmentPath(departmentKeyFromSlug(match[1])) +
    path.slice(match[0].length)
  );
}

/**
 * Resolves destination URL from metaobject fields, giving precedence to URL and falling back to Collection.
 *
 * Logic:
 * 1. Checks if a custom URL/link field is available and non-empty. If available, normalizes and returns it.
 * 2. If URL is missing or empty, checks if a Collection reference (or collection handle/value) is available.
 *    If available, returns `/collections/${collectionHandle}`.
 * 3. Returns empty string '' if neither is available.
 *
 * @param {Record<string, any> | Array<{key: string, value?: string, reference?: any, references?: any}>} fieldsInput
 * @returns {string} The resolved destination link (e.g. '/collections/women')
 */
export function resolveTargetUrl(fieldsInput) {
  if (!fieldsInput) return '';

  // Normalize fieldsInput into a lowercase key-value map with stripped separators
  const fieldsMap = {};
  if (Array.isArray(fieldsInput)) {
    for (const f of fieldsInput) {
      if (f?.key) {
        const lower = f.key.toLowerCase();
        fieldsMap[lower] = f;
        fieldsMap[lower.replace(/[-_\s]/g, '')] = f;
      }
    }
  } else if (typeof fieldsInput === 'object') {
    for (const [k, v] of Object.entries(fieldsInput)) {
      if (k) {
        const lower = k.toLowerCase();
        fieldsMap[lower] = v;
        fieldsMap[lower.replace(/[-_\s]/g, '')] = v;
      }
    }
  }

  // 1. Check URL first: explicit keys
  const urlCandidateKeys = [
    'url',
    'link',
    'category_url',
    'categoryurl',
    'category_link',
    'categorylink',
    'target_url',
    'targeturl',
    'target',
    'custom_url',
    'customurl',
    'button_link',
    'buttonlink',
    'banner_link',
    'bannerlink',
    'redirect_url',
    'redirecturl',
    'redirect',
    'href',
  ];
  let rawUrl = '';
  for (const k of urlCandidateKeys) {
    const val = fieldsMap[k]?.value;
    if (typeof val === 'string' && val.trim() && val.trim() !== '#') {
      rawUrl = val.trim();
      break;
    }
  }

  // If not found in known candidate keys, check ANY field key containing 'url' or 'link'
  if (!rawUrl) {
    for (const [k, field] of Object.entries(fieldsMap)) {
      if (
        (k.includes('url') || k.includes('link')) &&
        typeof field?.value === 'string' &&
        field.value.trim() &&
        field.value.trim() !== '#'
      ) {
        rawUrl = field.value.trim();
        break;
      }
    }
  }

  // If a valid URL is available, normalize and return it
  if (rawUrl) {
    let normalized = rawUrl;
    try {
      if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        const parsed = new URL(normalized);
        const host = parsed.hostname.toLowerCase();
        // If internal store domain or localhost, extract relative pathname
        if (
          host.includes('myshopify.com') ||
          host.endsWith('shopifypreview.com') ||
          host.includes('lifestylestores.com') ||
          host.includes('landmark') ||
          host === 'localhost' ||
          host === '127.0.0.1'
        ) {
          normalized = parsed.pathname + parsed.search + parsed.hash;
        } else {
          // External third-party URL: return full URL intact
          return normalized;
        }
      }
    } catch {
      // ignore URL parsing failures and use rawUrl as-is
    }

    normalized = normalized.replace(/(^\/?collection\/)/, '/collections/');
    if (normalized && !normalized.startsWith('/') && !normalized.startsWith('http')) {
      normalized = `/${normalized}`;
    }
    return normalizeDepartmentPath(normalized);
  }

  // 2. If URL is not available, check Collection reference/value
  const collectionCandidateKeys = [
    'collection',
    'collection_reference',
    'collectionreference',
    'collections',
    'category_collection',
    'categorycollection',
    'target_collection',
    'targetcollection',
  ];
  let collectionHandle = '';

  for (const k of collectionCandidateKeys) {
    const field = fieldsMap[k];
    if (!field) continue;

    // A. Single reference to Collection
    if (field.reference?.handle) {
      collectionHandle = field.reference.handle;
      break;
    }

    // B. Reference list of Collections
    if (field.references?.nodes?.length > 0) {
      const nodeWithHandle = field.references.nodes.find((n) => n?.handle);
      if (nodeWithHandle?.handle) {
        collectionHandle = nodeWithHandle.handle;
        break;
      }
    }

    // C. Field value contains handle directly (plain string, not GID or JSON)
    if (
      typeof field.value === 'string' &&
      field.value.trim() &&
      !field.value.startsWith('gid://') &&
      !field.value.startsWith('{') &&
      !field.value.startsWith('[')
    ) {
      const val = field.value.trim();
      if (val.includes('/collections/')) {
        return val.replace(/(^\/?collection\/)/, '/collections/');
      }
      collectionHandle = val;
      break;
    }
  }

  // Fallback: search all fields for any reference with a Collection handle
  if (!collectionHandle) {
    for (const field of Object.values(fieldsMap)) {
      if (
        field?.reference?.handle &&
        (field.reference.__typename === 'Collection' || !field.reference.image)
      ) {
        collectionHandle = field.reference.handle;
        break;
      }
      if (field?.references?.nodes?.length > 0) {
        const colNode = field.references.nodes.find(
          (n) => n?.handle && (n.__typename === 'Collection' || !n.image),
        );
        if (colNode?.handle) {
          collectionHandle = colNode.handle;
          break;
        }
      }
    }
  }

  if (collectionHandle) {
    const cleanHandle = collectionHandle
      .replace(/(^\/?collections\/)/, '')
      .replace(/(^\/?collection\/)/, '')
      .replace(/^\//, '');
    return `/collections/${cleanHandle}`;
  }

  return '';
}

