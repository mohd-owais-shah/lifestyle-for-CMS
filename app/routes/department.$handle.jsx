import {redirect} from 'react-router';
import {departmentKeyFromSlug, departmentPath} from '~/lib/urlUtils';

/**
 * Old department URL (/department/women): department pages now live at
 * Shopify's metaobject URL, /departments/women_department.
 * @param {Route.LoaderArgs} args
 */
export async function loader({params, request}) {
  const {search} = new URL(request.url);
  throw redirect(
    departmentPath(departmentKeyFromSlug(params.handle)) + search,
    301,
  );
}

/** @typedef {import('./+types/department.$handle').Route} Route */
