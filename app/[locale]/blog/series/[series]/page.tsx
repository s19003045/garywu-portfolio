import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { getSeries } from '@/lib/mdx';
import { PostList } from '@/components/blog/PostList';
import { localeAlternates } from '@/lib/seo';
import { SERIES_KEYS, type SeriesKey, isSeriesKey } from '@/lib/taxonomy';
import type { Metadata } from 'next';

// Series keys are the same closed set across every locale.
export function generateStaticParams() {
  return SERIES_KEYS.map((series) => ({ series }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; series: string }>;
}): Promise<Metadata> {
  const { locale, series } = await params;
  if (!isSeriesKey(series)) return {};
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t(`series.${series}`),
    description: t('headline'),
    alternates: localeAlternates(locale, `/blog/series/${series}`),
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ locale: string; series: string }>;
}) {
  const { locale, series } = await params;
  if (!isSeriesKey(series)) notFound();
  const posts = getSeries(series, locale);
  if (posts.length === 0) notFound();
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <SeriesHeader series={series} count={posts.length} />
      <PostList posts={posts} locale={locale} />
    </div>
  );
}

function SeriesHeader({ series, count }: { series: SeriesKey; count: number }) {
  const t = useTranslations('blog');
  return (
    <div className="mb-12 max-w-2xl">
      <p className="eyebrow mb-3">{t('series_eyebrow')}</p>
      <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
        {t(`series.${series}`)}
      </h1>
      <p className="text-sm text-[var(--fg-muted)] mt-4">{t('post_count', { count })}</p>
    </div>
  );
}
