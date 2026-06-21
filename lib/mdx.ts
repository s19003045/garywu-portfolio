import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  CATEGORY_KEYS,
  type CategoryKey,
  isCategoryKey,
  type SeriesKey,
  isSeriesKey,
} from './taxonomy';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  /** Primary browsing bucket; one of the closed CATEGORY_KEYS. */
  category?: CategoryKey;
  /** Optional series this post belongs to; one of the closed SERIES_KEYS. */
  series?: SeriesKey;
  /** Optional ordering among posts with the same date (ascending; lower = earlier). */
  order?: number;
  /** Pin to the top of the case-study list. */
  featured?: boolean;
  /** Manual ordering among featured items (ascending; lower = first). */
}

export interface Post extends PostMeta {
  content: string;
}

const contentRoot = path.join(process.cwd(), 'content');

function shouldIncludeFuturePosts() {
  if (process.env.SHOW_FUTURE_POSTS === 'true') return true;
  if (process.env.SHOW_FUTURE_POSTS === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

function isPublished(date: string) {
  if (shouldIncludeFuturePosts()) return true;
  if (!date) return true;

  const publishedAt = new Date(`${date}T23:59:59.999Z`);
  if (Number.isNaN(publishedAt.getTime())) return true;

  return publishedAt.getTime() <= Date.now();
}

function getDir(type: 'blog' | 'case-studies', locale: string) {
  return path.join(contentRoot, type, locale);
}

/**
 * Read a post's `category`, validating it against the closed taxonomy.
 * Warns (rather than throws) on a missing/unknown value so an in-progress draft
 * never breaks the build — the warning is enough to catch drift in CI logs.
 */
function readCategory(value: unknown, slug: string, locale: string): CategoryKey | undefined {
  if (value === undefined || value === '') {
    console.warn(`[taxonomy] blog post "${locale}/${slug}" is missing a category`);
    return undefined;
  }
  if (!isCategoryKey(value)) {
    console.warn(`[taxonomy] blog post "${locale}/${slug}" has unknown category "${value}"`);
    return undefined;
  }
  return value;
}

/**
 * Read a post's optional `series`. Missing is normal (most posts aren't part of
 * a series); only a present-but-unknown key warns.
 */
function readSeries(value: unknown, slug: string, locale: string): SeriesKey | undefined {
  if (value === undefined || value === '') return undefined;
  if (!isSeriesKey(value)) {
    console.warn(`[taxonomy] blog post "${locale}/${slug}" has unknown series "${value}"`);
    return undefined;
  }
  return value;
}

export function getAllPosts(locale: string): PostMeta[] {
  const dir = getDir('blog', locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        category: readCategory(data.category, slug, locale),
        series: readSeries(data.series, slug, locale),
        order: typeof data.order === 'number' ? data.order : undefined,
      };
    })
    .filter((post) => isPublished(post.date))
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      const ao = a.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.order ?? Number.MAX_SAFE_INTEGER;
      return bo - ao;
    });
}

export function getPost(slug: string, locale: string): Post | null {
  const filePath = path.join(getDir('blog', locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  if (!isPublished(data.date ?? '')) return null;
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    category: readCategory(data.category, slug, locale),
    series: readSeries(data.series, slug, locale),
    order: typeof data.order === 'number' ? data.order : undefined,
    content,
  };
}

/** Posts for a locale carrying the given tag (case-insensitive match). */
export function getPostsByTag(tag: string, locale: string): PostMeta[] {
  const needle = tag.toLowerCase();
  return getAllPosts(locale).filter((post) =>
    post.tags.some((t) => t.toLowerCase() === needle),
  );
}

/** All tags for a locale with their post counts, most-used first. */
export function getAllTags(locale: string): Array<{ tag: string; count: number }> {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags) {
      const key = tag.toLowerCase();
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { tag, count: 1 });
    }
  }
  return [...counts.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
}

/** Posts for a locale in the given category. */
export function getPostsByCategory(category: CategoryKey, locale: string): PostMeta[] {
  return getAllPosts(locale).filter((post) => post.category === category);
}

/** Categories present for a locale, in display order, with post counts. */
export function getAllCategories(locale: string): Array<{ key: CategoryKey; count: number }> {
  const counts = new Map<CategoryKey, number>();
  for (const post of getAllPosts(locale)) {
    if (post.category) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return CATEGORY_KEYS.filter((key) => counts.has(key)).map((key) => ({
    key,
    count: counts.get(key) ?? 0,
  }));
}

/** Reading order within a series: earliest date first, then `order` ascending. */
function bySeriesReadingOrder(a: PostMeta, b: PostMeta): number {
  const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
  if (dateDiff !== 0) return dateDiff;
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  return ao - bo;
}

/** Posts in a series, in reading order (part 1 first). */
export function getSeries(series: SeriesKey, locale: string): PostMeta[] {
  return getAllPosts(locale)
    .filter((post) => post.series === series)
    .sort(bySeriesReadingOrder);
}

export interface SeriesNavInfo {
  series: SeriesKey;
  /** Zero-based position of this post within the series. */
  index: number;
  total: number;
  prev?: PostMeta;
  next?: PostMeta;
}

/** Series context (position + neighbours) for a post, or null if it has none. */
export function getSeriesNav(slug: string, locale: string): SeriesNavInfo | null {
  const post = getAllPosts(locale).find((p) => p.slug === slug);
  if (!post?.series) return null;
  const ordered = getSeries(post.series, locale);
  const index = ordered.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    series: post.series,
    index,
    total: ordered.length,
    prev: ordered[index - 1],
    next: ordered[index + 1],
  };
}

export function getAllCaseStudies(locale: string): PostMeta[] {
  const dir = getDir('case-studies', locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        featured: data.featured ?? false,
        order: typeof data.order === 'number' ? data.order : undefined,
      };
    })
    .sort((a, b) => {
      // 1. Featured items come first.
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      // 2. Among featured, honour manual `order` (ascending).
      if (a.featured && b.featured) {
        const ao = a.order ?? Number.MAX_SAFE_INTEGER;
        const bo = b.order ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
      }
      // 3. Fallback: newest first by date.
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getCaseStudy(slug: string, locale: string): Post | null {
  const filePath = path.join(getDir('case-studies', locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    content,
  };
}
