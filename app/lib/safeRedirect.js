/**
 * Only allow same-site paths (e.g. `/checkout`) as redirect targets, so
 * `return_to` / `redirect` params can't bounce shoppers to another domain.
 * Rejects `//host` and `/\host` (browsers treat `\` like `/`).
 * @param {unknown} value
 * @param {string} [fallback]
 */
export function safeRedirect(value, fallback = '/') {
  const path = typeof value === 'string' ? value.trim() : '';
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return fallback;
  }
  return path;
}
