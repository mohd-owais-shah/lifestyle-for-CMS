/**
 * Focused regression tests for pure logic used by the storefront.
 * Run with: npm test   (Node's built-in test runner, no extra dependencies)
 */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {safeRedirect} from '../app/lib/safeRedirect.js';
import {plpShouldRevalidate} from '../app/lib/plpRevalidation.js';
import {seoMeta, getPublicOrigin, truncate} from '../app/lib/seo.js';
import {parseIndianPincode} from '../app/lib/pincode.js';

test('safeRedirect keeps same-site paths', () => {
  assert.equal(safeRedirect('/checkout'), '/checkout');
  assert.equal(safeRedirect('/account/orders?x=1'), '/account/orders?x=1');
});

test('safeRedirect rejects off-site and malformed targets', () => {
  for (const bad of [
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
    'javascript:alert(1)',
    '',
    null,
    undefined,
    42,
  ]) {
    assert.equal(safeRedirect(bad, '/account'), '/account', String(bad));
  }
});

const url = (path) => new URL(`https://shop.test${path}`);
const revalidate = (from, to, extra = {}) =>
  plpShouldRevalidate({
    currentUrl: url(from),
    nextUrl: url(to),
    defaultShouldRevalidate: true,
    ...extra,
  });

test('PLP: subcategory-only change does not refetch', () => {
  assert.equal(revalidate('/collections/all', '/collections/all?subcat=Dresses'), false);
  assert.equal(
    revalidate('/search?q=shirt&subcat=Men', '/search?subcat=Women&q=shirt'),
    false,
  );
});

test('PLP: sort, filter, query and path changes still refetch', () => {
  assert.equal(revalidate('/collections/all', '/collections/all?sort_by=price-low-to-high'), true);
  assert.equal(revalidate('/search?q=shirt', '/search?q=dress'), true);
  assert.equal(revalidate('/collections/all', '/collections/men'), true);
  assert.equal(
    revalidate('/collections/all', '/collections/all', {formMethod: 'POST'}),
    true,
  );
});

const rootMatches = (siteUrl) => [{id: 'root', data: {siteUrl}}];
const tag = (tags, predicate) => tags.find(predicate);

test('seoMeta: indexable page gets canonical and robots index', () => {
  const tags = seoMeta({
    title: 'T',
    description: 'D',
    path: '/collections/men',
    matches: rootMatches('https://www.example.com'),
  });
  assert.equal(
    tag(tags, (t) => t.rel === 'canonical')?.href,
    'https://www.example.com/collections/men',
  );
  assert.equal(tag(tags, (t) => t.name === 'robots')?.content, 'index,follow');
});

test('seoMeta: noindex pages have no canonical', () => {
  const tags = seoMeta({noindex: true, path: '/missing', matches: rootMatches('https://x.test')});
  assert.equal(tag(tags, (t) => t.rel === 'canonical'), undefined);
  assert.equal(tag(tags, (t) => t.name === 'robots')?.content, 'noindex,nofollow');
});

test('getPublicOrigin prefers configured storefront URL', () => {
  const request = new Request('https://preview.myshopify.dev/products/x');
  assert.equal(getPublicOrigin(request, {}), 'https://preview.myshopify.dev');
  assert.equal(
    getPublicOrigin(request, {PUBLIC_STOREFRONT_URL: 'https://www.example.com/'}),
    'https://www.example.com',
  );
  assert.equal(
    getPublicOrigin(request, {PUBLIC_STOREFRONT_URL: 'not a url'}),
    'https://preview.myshopify.dev',
  );
});

test('truncate keeps short text and cuts long text on a word boundary', () => {
  assert.equal(truncate('  short   text '), 'short text');
  const long = 'word '.repeat(100);
  const out = truncate(long, 50);
  assert.ok(out.length <= 50);
  assert.ok(out.endsWith('…'));
});

test('parseIndianPincode accepts 6-digit pincodes (with spaces) only', () => {
  assert.equal(parseIndianPincode('385001'), '385001');
  assert.equal(parseIndianPincode('385 001'), '385001');
  assert.equal(parseIndianPincode(385001), '385001');
  for (const bad of ['SW1A 1AA', '38500', '3850011', 'd{6}', 'sss', '', null, undefined]) {
    assert.equal(parseIndianPincode(bad), '', String(bad));
  }
});
