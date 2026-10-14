import {useRouteLoaderData} from 'react-router';
import {DepartmentHero} from '~/components/DepartmentPages/reusable-component/DepartmentHero';
import {DepartmentShowcase} from '~/components/DepartmentPages/reusable-component/DepartmentShowcase';
import {PdpMobileHeader} from '~/components/pdp/PdpMobileHeader';
import {MobileFooter} from '~/components/small-uis/MobileFooter';
import {AnnouncementBar} from '~/components/AnnouncementBar';

/**
 * Response section `type` -> component. `props` from the response are passed
 * straight through; add a type here to support a new kind of section.
 */
const SECTION_COMPONENTS = {
  hero: DepartmentHero,
  showcase: DepartmentShowcase,
};

/**
 * Renders any department page from the getDepartmentPage() response.
 * @param {{page: {name: string, sections: Array<{type: string, key: string, props: object}>}}} props
 */
export function DepartmentPage({page}) {
  const rootData = useRouteLoaderData('root');

  const announcements =
    rootData?.header?.announcementBarMetaobjects?.nodes?.length > 0
      ? rootData.header.announcementBarMetaobjects.nodes
      : rootData?.header?.announcementBarMetaobject
        ? [rootData.header.announcementBarMetaobject]
        : [];

  return (
    <div className="w-full flex flex-col pb-0 lg:pb-12 bg-white">
      <PdpMobileHeader title={page.name} hideLocationBar={true} />
      <div className="lg:hidden">
        <AnnouncementBar announcements={announcements} />
      </div>

      {page.sections.map(({type, key, props}) => {
        const Section = SECTION_COMPONENTS[type];
        return Section ? <Section key={key} {...props} /> : null;
      })}

      <MobileFooter />
    </div>
  );
}

export default DepartmentPage;
