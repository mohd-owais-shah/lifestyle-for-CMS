/**
 * Applies a home page section's admin settings (see homeSectionSettings.js):
 * desktop / mobile visibility, background colour and padding. Desktop starts
 * at lg (1024px), the same breakpoint as the site header.
 * Settings that are unset add nothing, so the section looks as it did.
 * @param {{
 *   settings: import('~/lib/homeSectionSettings').SectionSettings;
 *   id?: string;
 *   children: React.ReactNode;
 * }}
 */
export function HomeSection({settings, id, children}) {
  if (!settings.desktopEnable && !settings.mobileEnable) return null;

  let visibilityClass = '';
  if (!settings.desktopEnable) visibilityClass = 'lg:hidden';
  else if (!settings.mobileEnable) visibilityClass = 'hidden lg:block';

  // Padding values are px from the admin, passed as CSS variables so any
  // number works without generating a Tailwind class per value.
  const className = [
    'w-full',
    visibilityClass,
    // Sections paint their own white background; let the admin colour through
    settings.bgColor && '[&>*]:bg-transparent!',
    settings.mobileTopPadding !== null && 'pt-[var(--section-pt-mobile)]',
    settings.mobileBottomPadding !== null && 'pb-[var(--section-pb-mobile)]',
    settings.desktopTopPadding !== null && 'lg:pt-[var(--section-pt-desktop)]',
    settings.desktopBottomPadding !== null &&
      'lg:pb-[var(--section-pb-desktop)]',
  ]
    .filter(Boolean)
    .join(' ');

  const style = {
    ...(settings.bgColor ? {backgroundColor: settings.bgColor} : {}),
    ...cssVar('--section-pt-mobile', settings.mobileTopPadding),
    ...cssVar('--section-pb-mobile', settings.mobileBottomPadding),
    ...cssVar('--section-pt-desktop', settings.desktopTopPadding),
    ...cssVar('--section-pb-desktop', settings.desktopBottomPadding),
  };

  return (
    <div className={className} style={style} data-home-section={id}>
      {children}
    </div>
  );
}

/** @param {string} name @param {number | null} px */
function cssVar(name, px) {
  return px !== null ? {[name]: `${px}px`} : {};
}
