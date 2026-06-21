import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/mdx';
import { getSearchIndex } from '@/lib/search';
import { Link } from '@/i18n/navigation';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { CategoryBar } from '@/components/blog/CategoryBar';
import { PopularTags } from '@/components/blog/PopularTags';
import { PaginatedPostList } from '@/components/blog/PaginatedPostList';
import { localeAlternates } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('eyebrow'), description: t('headline'), alternates: localeAlternates(locale, '/blog') };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const categories = getAllCategories(locale);
  const tags = getAllTags(locale);
  const searchIndex = getSearchIndex(locale);
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <BlogHeader />
      <BlogSearch index={searchIndex} />
      <CategoryBar categories={categories} active="all" />
      <PopularTags tags={tags} />
      <PaginatedPostList posts={posts} locale={locale} />
      <ArchiveLink />
    </div>
  );
}

function ArchiveLink() {
  const t = useTranslations('blog');
  return (
    <div className="mt-12 pt-8 border-t border-[var(--border)]">
      <Link
        href="/blog/archive"
        className="text-sm font-mono text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
      >
        {t('view_archive')}
      </Link>
    </div>
  );
}

function BlogHeader() {
  const t = useTranslations('blog');
  return (
    <div className="mb-12 max-w-2xl">
      <p className="eyebrow mb-6">{t('eyebrow')}</p>
      <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
        {t('headline')}
      </h1>
    </div>
  );
}
