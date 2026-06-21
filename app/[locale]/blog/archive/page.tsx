import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getPostsByYear } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { localeAlternates } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('archive_eyebrow'),
    description: t('archive_headline'),
    alternates: localeAlternates(locale, '/blog/archive'),
  };
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const groups = getPostsByYear(locale);
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <ArchiveHeader />
      <div className="space-y-12 max-w-3xl">
        {groups.map(({ year, posts }) => (
          <section key={year}>
            <h2 className="font-heading font-semibold text-2xl text-[var(--fg)] mb-4">{year}</h2>
            <ul className="space-y-0">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex items-baseline gap-4 py-3 border-t border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                  >
                    <time className="text-xs font-mono text-[var(--fg-subtle)] w-28 flex-shrink-0">
                      {formatDate(post.date, locale)}
                    </time>
                    <span className="text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function ArchiveHeader() {
  const t = useTranslations('blog');
  return (
    <div className="mb-12 max-w-2xl">
      <Link
        href="/blog"
        className="text-xs font-mono text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors"
      >
        {t('all_posts')}
      </Link>
      <p className="eyebrow mt-6 mb-3">{t('archive_eyebrow')}</p>
      <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
        {t('archive_headline')}
      </h1>
    </div>
  );
}
