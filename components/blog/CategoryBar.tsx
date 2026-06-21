import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CategoryKey } from '@/lib/taxonomy';

/**
 * Category filter bar — the primary browsing axis for /blog.
 *
 * Rendered as plain navigation links (one per present category, plus "All"), so
 * every filter is server-rendered, indexable, and shareable. Counts come from
 * the caller via {@link getAllCategories}.
 */
export function CategoryBar({
  categories,
  active = 'all',
}: {
  categories: Array<{ key: CategoryKey; count: number }>;
  active?: CategoryKey | 'all';
}) {
  const t = useTranslations('blog');

  const base =
    'inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border transition-colors';
  const on = 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)]';
  const off =
    'border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--fg)]';

  return (
    <nav className="flex flex-wrap gap-2 mb-12" aria-label={t('browse_by')}>
      <Link href="/blog" className={`${base} ${active === 'all' ? on : off}`}>
        {t('all')}
      </Link>
      {categories.map(({ key, count }) => (
        <Link
          key={key}
          href={`/blog/category/${key}`}
          className={`${base} ${active === key ? on : off}`}
          aria-current={active === key ? 'page' : undefined}
        >
          {t(`categories.${key}`)}
          <span className="opacity-50">{count}</span>
        </Link>
      ))}
    </nav>
  );
}
