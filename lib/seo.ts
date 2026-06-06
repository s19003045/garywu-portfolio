import { siteConfig } from './site';

/**
 * Build self-referencing canonical + hreflang alternates for a given locale and
 * a locale-agnostic path (e.g. '', '/blog', '/blog/my-post').
 *
 * Each language version is canonical to itself; `languages` wires up the zh/en
 * equivalents plus an `x-default` pointing at the default locale. URLs are
 * returned relative — Next.js resolves them against `metadataBase`.
 */
export function localeAlternates(locale: string, path = '') {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      zh: `/zh${path}`,
      en: `/en${path}`,
      'x-default': `/${siteConfig.defaultLocale}${path}`,
    },
  };
}
