import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatDate } from '@/lib/utils';
import type { PostMeta } from '@/lib/mdx';

/**
 * "Related posts" shown at the foot of an article — up to a few posts that
 * share tags or category, to keep readers moving through the writing.
 */
export function RelatedPosts({ posts, locale }: { posts: PostMeta[]; locale: string }) {
  const t = useTranslations('blog');
  if (posts.length === 0) return null;

  return (
    <section className="my-12 max-w-3xl">
      <p className="eyebrow mb-6">{t('related')}</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded border border-[var(--border)] hover:border-[var(--accent)] p-4 transition-colors"
          >
            <time className="block text-xs font-mono text-[var(--fg-subtle)] mb-2">
              {formatDate(post.date, locale)}
            </time>
            <span className="block text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug">
              {post.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
