import { Link } from '@/i18n/navigation';
import { formatDate } from '@/lib/utils';
import { Tag } from '@/components/ui/Tag';
import { tagHref } from '@/lib/tags';

type PostRow = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

/**
 * Shared post list, used by /blog and the tag/category filter pages.
 *
 * The post link wraps only the date/title/description; tag chips sit alongside
 * it as their own links (never nested inside the post anchor — nested anchors
 * are invalid HTML), so each tag can navigate to its filter page.
 */
export function PostList({ posts, locale }: { posts: PostRow[]; locale: string }) {
  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <article key={post.slug} className="py-8 border-t border-[var(--border)]">
          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-36 flex-shrink-0">
                <time className="text-xs font-mono text-[var(--fg-subtle)]">
                  {formatDate(post.date, locale)}
                </time>
              </div>
              <div className="flex-1">
                <h2 className="font-heading font-semibold text-lg text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {post.description}
                </p>
              </div>
              <span
                className="self-center text-[var(--fg-subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all"
                aria-hidden
              >
                →
              </span>
            </div>
          </Link>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 sm:pl-40">
              {post.tags.map((tag) => (
                <Tag key={tag} label={tag} href={tagHref(tag)} />
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
