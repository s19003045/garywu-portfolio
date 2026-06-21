import { getAllPosts } from './mdx';
import type { CategoryKey } from './taxonomy';

/** One searchable post record shipped to the client search widget. */
export interface SearchDoc {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category?: CategoryKey;
}

/**
 * Lightweight client-search index for a locale.
 *
 * Holds title / description / tags only (not full content) so the payload stays
 * small even at hundreds of posts — enough to find a post by topic or keyword.
 * Built on the server and passed to {@link BlogSearch} as a prop; no extra
 * request or external indexer needed.
 */
export function getSearchIndex(locale: string): SearchDoc[] {
  return getAllPosts(locale).map(({ slug, title, description, tags, category }) => ({
    slug,
    title,
    description,
    tags,
    category,
  }));
}
