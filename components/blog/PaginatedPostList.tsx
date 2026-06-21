'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PostList } from './PostList';

type PostRow = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

/**
 * The main /blog list with incremental "load more". Shows the first `pageSize`
 * posts and reveals more on demand, so the page stays light as the archive
 * grows. Below the threshold (the common case today) no button renders, so it's
 * invisible until there are actually enough posts to warrant it.
 */
export function PaginatedPostList({
  posts,
  locale,
  pageSize = 20,
}: {
  posts: PostRow[];
  locale: string;
  pageSize?: number;
}) {
  const t = useTranslations('blog');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const hasMore = visibleCount < posts.length;

  return (
    <>
      <PostList posts={posts.slice(0, visibleCount)} locale={locale} />
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + pageSize)}
            className="text-sm font-mono px-5 py-2 rounded-full border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors"
          >
            {t('load_more')} ({posts.length - visibleCount})
          </button>
        </div>
      )}
    </>
  );
}
