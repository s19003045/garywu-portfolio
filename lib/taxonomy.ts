/**
 * Blog content taxonomy — the browsing backbone.
 *
 * Two axes, deliberately different in shape:
 *  - `category` (this file) — the single, primary bucket a post belongs to
 *    (exactly one per post). A small CLOSED set, used as the main browsing axis
 *    on /blog. Adding a post whose category is outside CATEGORY_KEYS warns at
 *    read time (see lib/mdx.ts) so the vocabulary never drifts.
 *  - `tags` (see lib/tags.ts) — free-form, many-per-post, for fine-grained
 *    filtering. Tags may grow; categories stay curated.
 *
 * Frontmatter stores the stable *key* (e.g. "go-notes"). Human-readable labels
 * live in the `blog.categories` message namespace so zh/en both render right —
 * never hard-code a display label here.
 *
 * Order below is the display order in the category filter bar.
 */

export const CATEGORY_KEYS = [
  'go-notes',
  'webrtc-system',
  'ai-collaboration',
  'career',
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

const CATEGORY_SET = new Set<string>(CATEGORY_KEYS);

export function isCategoryKey(value: unknown): value is CategoryKey {
  return typeof value === 'string' && CATEGORY_SET.has(value);
}

/**
 * Series — an *ordered* reading sequence (a 連載) layered over a subset of posts.
 *
 * Distinct from `category`: a category is a thematic bucket (every post has
 * one); a series adds reading order, "part N of M", and prev/next navigation,
 * and only the posts that belong to a multi-part arc carry one. `series` is
 * therefore optional in frontmatter. Labels live in the `blog.series` message
 * namespace; sequence within a series is derived from date + `order`.
 */
export const SERIES_KEYS = ['go-with-ai-agent', 'webrtc-poc'] as const;

export type SeriesKey = (typeof SERIES_KEYS)[number];

const SERIES_SET = new Set<string>(SERIES_KEYS);

export function isSeriesKey(value: unknown): value is SeriesKey {
  return typeof value === 'string' && SERIES_SET.has(value);
}
