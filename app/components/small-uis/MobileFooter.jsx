import {useRouteLoaderData} from 'react-router';
import {Footer} from '~/components/Footer';

export function MobileFooter() {
  const rootData = useRouteLoaderData('root');

  if (!rootData) return null;

  return (
    <div className="lg:hidden">
      <Footer 
        footer={rootData.footer} 
        header={rootData.header} 
        publicStoreDomain={rootData.publicStoreDomain} 
        departmentMobile={true}
      />
    </div>
  );
}
