import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { getAllCategories, getPostsByCategory } from '@/lib/mdx';
import { CategoryBar } from '@/components/blog/CategoryBar';
import { PostList } from '@/components/blog/PostList';
import { localeAlternates } from '@/lib/seo';
import { CATEGORY_KEYS, type CategoryKey, isCategoryKey } from '@/lib/taxonomy';
import type { Metadata } from 'next';

// Category keys are the same closed set across every locale.
export function generateStaticParams() {
  return CATEGORY_KEYS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isCategoryKey(category)) return {};
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t(`categories.${category}`),
    description: t('headline'),
    alternates: localeAlternates(locale, `/blog/category/${category}`),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isCategoryKey(category)) notFound();
  const posts = getPostsByCategory(category, locale);
  if (posts.length === 0) notFound();
  const categories = getAllCategories(locale);
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <CategoryHeader category={category} count={posts.length} />
      <CategoryBar categories={categories} active={category} />
      <PostList posts={posts} locale={locale} />
    </div>
  );
}

function CategoryHeader({ category, count }: { category: CategoryKey; count: number }) {
  const t = useTranslations('blog');
  return (
    <div className="mb-12 max-w-2xl">
      <p className="eyebrow mb-3">{t('eyebrow')}</p>
      <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
        {t(`categories.${category}`)}
      </h1>
      <p className="text-sm text-[var(--fg-muted)] mt-4">{t('post_count', { count })}</p>
    </div>
  );
}
