import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { getAllPosts, getAllCategories } from '@/lib/mdx';
import { CategoryBar } from '@/components/blog/CategoryBar';
import { PostList } from '@/components/blog/PostList';
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
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <BlogHeader />
      <CategoryBar categories={categories} active="all" />
      <PostList posts={posts} locale={locale} />
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
