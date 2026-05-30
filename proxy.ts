import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude API, Next internals, dotted files (sitemap.xml, robots.txt, feed.xml,
  // manifest.webmanifest), and extensionless metadata image routes
  // (opengraph-image, twitter-image, icon, apple-icon) from locale rewriting.
  matcher: [
    '/((?!api|_next|_vercel|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)',
  ],
};
