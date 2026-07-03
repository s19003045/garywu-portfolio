import http from 'k6/http';

/**
 * Discovers real pages to hit by reading /sitemap.xml at test start, instead of
 * hardcoding slugs. `sitemap.ts` always emits absolute URLs on the production
 * domain (siteConfig.url) regardless of which host we're actually load
 * testing, so every <loc> is rewritten onto BASE_URL before use.
 *
 * Falls back to a small hand-picked set of paths if the sitemap can't be
 * fetched or parsed, so a broken sitemap doesn't take down the whole test run.
 */

const LOCALES = ['zh', 'en'];

const FALLBACK_PATHS = LOCALES.flatMap((locale) => [
  { locale, type: 'home', path: `/${locale}` },
  { locale, type: 'blogList', path: `/${locale}/blog` },
  { locale, type: 'caseStudyList', path: `/${locale}/case-studies` },
]);

function toPath(absoluteUrl) {
  const match = absoluteUrl.match(/^https?:\/\/[^/]+(\/.*)$/);
  return match ? match[1] : null;
}

/** Classify a path into a route type + locale, or null if it's not a locale route. */
function classify(path) {
  const match = path.match(/^\/(zh|en)(\/.*)?$/);
  if (!match) return null;
  const [, locale, rest = ''] = match;

  if (rest === '') return { locale, type: 'home', path };
  if (rest === '/blog') return { locale, type: 'blogList', path };
  if (rest === '/blog/archive') return { locale, type: 'blogArchive', path };
  if (rest === '/case-studies') return { locale, type: 'caseStudyList', path };

  let m;
  if ((m = rest.match(/^\/blog\/category\/.+$/))) return { locale, type: 'blogCategory', path };
  if ((m = rest.match(/^\/blog\/tag\/.+$/))) return { locale, type: 'blogTag', path };
  if ((m = rest.match(/^\/blog\/series\/.+$/))) return { locale, type: 'blogSeries', path };
  if ((m = rest.match(/^\/blog\/.+$/))) return { locale, type: 'blogPost', path };
  if ((m = rest.match(/^\/case-studies\/.+$/))) return { locale, type: 'caseStudy', path };
  if (['/about', '/experience', '/projects', '/lab', '/resume', '/connect'].includes(rest)) {
    return { locale, type: 'staticPage', path };
  }
  return { locale, type: 'other', path };
}

function emptyBucketSet() {
  const perLocale = () => ({
    home: [],
    staticPage: [],
    blogList: [],
    blogArchive: [],
    blogPost: [],
    blogCategory: [],
    blogTag: [],
    blogSeries: [],
    caseStudyList: [],
    caseStudy: [],
  });
  return { zh: perLocale(), en: perLocale() };
}

function bucketize(entries) {
  const buckets = emptyBucketSet();
  for (const entry of entries) {
    buckets[entry.locale][entry.type].push(entry.path);
  }
  return buckets;
}

/**
 * Fetch and classify every page linked from /sitemap.xml.
 * Returns `{ zh: { home: [...], blogPost: [...], ... }, en: { ... } }`.
 */
export function discoverPages(baseUrl) {
  const res = http.get(`${baseUrl}/sitemap.xml`, { tags: { name: 'sitemap-discovery' } });

  if (res.status !== 200 || !res.body) {
    console.warn(`[discover] could not fetch sitemap.xml (status ${res.status}); using fallback paths`);
    return bucketize(FALLBACK_PATHS);
  }

  const locs = [...res.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const entries = locs
    .map(toPath)
    .filter((p) => p !== null)
    .map(classify)
    .filter((e) => e !== null && e.type !== 'other');

  if (entries.length < 5) {
    console.warn('[discover] sitemap.xml yielded too few usable pages; using fallback paths');
    return bucketize(FALLBACK_PATHS);
  }

  return bucketize(entries);
}

/** Pick a random element from a (possibly empty) array, or null. */
export function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}
