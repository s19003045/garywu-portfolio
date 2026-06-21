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
