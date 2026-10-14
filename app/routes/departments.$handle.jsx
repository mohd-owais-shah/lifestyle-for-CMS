import {redirect, useLoaderData} from 'react-router';
import {DepartmentPage} from '~/components/DepartmentPages/DepartmentPage';
import {getDepartmentPage} from '~/lib/departmentPage.server';
import {departmentKeyFromSlug, departmentPath} from '~/lib/urlUtils';
import {
  seoMeta,
  DEPARTMENT_SEO,
  breadcrumbJsonLd,
  originFromMatches,
} from '~/lib/seo';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data, location, matches}) =>
  seoMeta({
    ...(DEPARTMENT_SEO[data?.page?.handle] || {title: 'Lifestyle Stores'}),
    location,
    matches,
    jsonLd: data?.page
      ? breadcrumbJsonLd(originFromMatches(matches), [
          {name: 'Home', path: '/'},
          {name: data.page.name, path: departmentPath(data.page.handle)},
        ])
      : undefined,
  });

/**
 * /departments/:handle — Shopify's metaobject URL format, e.g.
 * /departments/women_department. All data comes from getDepartmentPage().
 * @param {Route.LoaderArgs} args
 */
export async function loader({params, request, context}) {
  const key = departmentKeyFromSlug(params.handle);

  // One URL per department: /departments/women, /departments/home_living_department
  // and other spellings go to the canonical /departments/<key>_department.
  const url = new URL(request.url);
  const canonical = departmentPath(key);
  if (url.pathname !== canonical) {
    throw redirect(canonical + url.search, 301);
  }

  const page = await getDepartmentPage(context.storefront, key);
  if (!page) {
    throw new Response(`Department "${params.handle}" not found`, {
      status: 404,
    });
  }
  return {page};
}

/**
 * Department content only depends on the handle, so skip re-running the
 * loader after cart/account actions or same-page navigations.
 * @type {Route.ShouldRevalidateFunction}
 */
export function shouldRevalidate({currentParams, nextParams}) {
  return (
    departmentKeyFromSlug(currentParams.handle) !==
    departmentKeyFromSlug(nextParams.handle)
  );
}

export default function Department() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  return <DepartmentPage page={page} />;
}

/** @typedef {import('./+types/departments.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
