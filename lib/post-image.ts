import fs from 'fs';
import path from 'path';
import { siteConfig } from './site';

/** Where cover images live, by content type. Files are named `<slug>.png`. */
const IMAGE_DIRS = {
  blog: 'post_image',
  'case-studies': 'caseStudy_image',
} as const;

/** Fallback social card (the site-wide OG image route) for posts without a cover. */
export const defaultSocialImage = `${siteConfig.url}/opengraph-image`;

export interface CoverImage {
  /** Absolute URL — for og:image / JSON-LD (crawlers need a full URL). */
  url: string;
  /** Root-relative path — for `next/image` on-page (served from /public). */
  path: string;
  width: number;
  height: number;
}

/** Read pixel dimensions from a PNG's IHDR chunk (bytes 16–23, big-endian). */
function pngSize(absPath: string): { width: number; height: number } | null {
  try {
    const buf = Buffer.alloc(24);
    const fd = fs.openSync(absPath, 'r');
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

/**
 * Cover image for a post/case-study, resolved by slug convention:
 *   public/post_image/<slug>.png        (blog)
 *   public/caseStudy_image/<slug>.png   (case studies)
 *
 * Returns the absolute URL plus real pixel dimensions, or null when no file
 * exists — callers then fall back to {@link defaultSocialImage}.
 */
export function coverImage(type: 'blog' | 'case-studies', slug: string): CoverImage | null {
  const dir = IMAGE_DIRS[type];
  const abs = path.join(process.cwd(), 'public', dir, `${slug}.png`);
  if (!fs.existsSync(abs)) return null;
  const size = pngSize(abs);
  const rel = `/${dir}/${slug}.png`;
  return {
    url: `${siteConfig.url}${rel}`,
    path: rel,
    width: size?.width ?? 1200,
    height: size?.height ?? 630,
  };
}
