import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getAllTags, getPostsByTag } from '@/lib/mdx';
import { PostList } from '@/components/blog/PostList';
import { localeAlternates } from '@/lib/seo';
import type { Metadata } from 'next';

// Tags differ per locale, so generate each locale's tags from its own posts.
// Return the raw tag — Next.js URL-encodes it into the path; the matching link
// is built with the same encoding via tagHref(), so the two line up.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllTags(params.locale).map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: `${t('tag_eyebrow')}: ${tag}`,
    description: t('headline'),
    alternates: localeAlternates(locale, `/blog/tag/${encodeURIComponent(tag)}`),
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag, locale);
  if (posts.length === 0) notFound();
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <FilterHeader tag={tag} count={posts.length} />
      <PostList posts={posts} locale={locale} />
    </div>
  );
}

function FilterHeader({ tag, count }: { tag: string; count: number }) {
  const t = useTranslations('blog');
  return (
    <div className="mb-12">
      <Link
        href="/blog"
        className="text-xs font-mono text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors"
      >
        {t('all_posts')}
      </Link>
      <p className="eyebrow mt-6 mb-3">{t('tag_eyebrow')}</p>
      <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
        <span className="text-[var(--accent)]">#</span>
        {tag}
      </h1>
      <p className="text-sm text-[var(--fg-muted)] mt-4">{t('post_count', { count })}</p>
    </div>
  );
}
