import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { SeriesNavInfo } from '@/lib/mdx';

/**
 * Series context shown on a post that belongs to a 連載: which series and part
 * this is, a link to the whole series, and previous/next links so readers can
 * move through the arc in order.
 */
export function SeriesNav({ nav }: { nav: SeriesNavInfo }) {
  const t = useTranslations('blog');

  return (
    <nav
      className="my-12 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5"
      aria-label={t('series_eyebrow')}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href={`/blog/series/${nav.series}`}
          className="text-xs font-mono text-[var(--accent)] hover:underline"
        >
          {t('series_eyebrow')} · {t(`series.${nav.series}`)}
        </Link>
        <span className="text-xs font-mono text-[var(--fg-subtle)] flex-shrink-0">
          {t('series_part', { index: nav.index + 1, total: nav.total })}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {nav.prev ? (
          <Link
            href={`/blog/${nav.prev.slug}`}
            className="group block rounded border border-[var(--border)] hover:border-[var(--accent)] p-3 transition-colors"
          >
            <span className="block text-xs font-mono text-[var(--fg-subtle)] mb-1">
              ← {t('series_prev')}
            </span>
            <span className="block text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug">
              {nav.prev.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden />
        )}
        {nav.next ? (
          <Link
            href={`/blog/${nav.next.slug}`}
            className="group block rounded border border-[var(--border)] hover:border-[var(--accent)] p-3 transition-colors sm:text-right"
          >
            <span className="block text-xs font-mono text-[var(--fg-subtle)] mb-1">
              {t('series_next')} →
            </span>
            <span className="block text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug">
              {nav.next.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden />
        )}
      </div>
    </nav>
  );
}
