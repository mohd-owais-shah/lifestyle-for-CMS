/**
 * Section settings shared by every home page section. Each `home_page`
 * metaobject entry can set:
 *
 *   desktop_enable / mobile_enable   show the section on that breakpoint
 *   bg_color                         section background (e.g. #FFFFFF)
 *   desktop_top_padding / desktop_bottom_padding   px
 *   mobile_top_padding / mobile_bottom_padding     px
 *   sort_order                       position on the page
 *   hide_section (or hidden)         hide everywhere without deleting
 *
 * Unset fields keep the section's built-in behaviour.
 */

/**
 * Parse a metaobject boolean value, falling back when unset
 * @param {string | undefined | null} value
 * @param {boolean} fallback
 */
export function parseBooleanSetting(value, fallback) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

/**
 * Parse a metaobject integer value; returns null when unset/invalid
 * @param {string | undefined | null} value
 */
export function parseIntegerSetting(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Metaobject fields as a key -> field map (accepts the raw array or a map)
 * @param {Array<{key: string, value?: string}> | Record<string, any> | undefined} fields
 * @returns {Record<string, any>}
 */
export function toFieldMap(fields) {
  if (!fields) return {};
  if (!Array.isArray(fields)) return fields;
  const mapped = {};
  for (const field of fields) {
    if (field?.key) mapped[field.key] = field;
  }
  return mapped;
}

/**
 * @typedef {{
 *   desktopEnable: boolean;
 *   mobileEnable: boolean;
 *   bgColor: string;
 *   desktopTopPadding: number | null;
 *   desktopBottomPadding: number | null;
 *   mobileTopPadding: number | null;
 *   mobileBottomPadding: number | null;
 * }} SectionSettings
 */

/**
 * Section-level settings from a home_page metaobject's fields
 * @param {Array<any> | Record<string, any> | undefined} fields
 * @returns {SectionSettings}
 */
export function parseSectionSettings(fields) {
  const f = toFieldMap(fields);
  return {
    desktopEnable: parseBooleanSetting(f.desktop_enable?.value, true),
    mobileEnable: parseBooleanSetting(f.mobile_enable?.value, true),
    bgColor: f.bg_color?.value || '',
    desktopTopPadding: parseIntegerSetting(f.desktop_top_padding?.value),
    desktopBottomPadding: parseIntegerSetting(f.desktop_bottom_padding?.value),
    mobileTopPadding: parseIntegerSetting(f.mobile_top_padding?.value),
    mobileBottomPadding: parseIntegerSetting(f.mobile_bottom_padding?.value),
  };
}

/**
 * Position and visibility from a home_page metaobject's fields
 * @param {Array<any> | Record<string, any> | undefined} fields
 */
export function parseSectionMeta(fields) {
  const f = toFieldMap(fields);
  const sortOrder = parseIntegerSetting(f.sort_order?.value);
  return {
    sortOrder: sortOrder ?? 999,
    hidden:
      f.hide_section?.value === 'true' || f.hidden?.value === 'true',
  };
}

/**
 * Per-item toggles on a section's cards / slides. Only an explicit "false"
 * hides an item, so items without these fields keep showing.
 * @param {Array<any> | Record<string, any> | undefined} fields
 */
export function parseItemVisibility(fields) {
  const f = toFieldMap(fields);
  const enabled = parseBooleanSetting(
    (f.enable || f.enabled)?.value,
    true,
  );
  return {
    enabled,
    desktopEnable: enabled && parseBooleanSetting(f.desktop_enable?.value, true),
    mobileEnable: enabled && parseBooleanSetting(f.mobile_enable?.value, true),
  };
}
