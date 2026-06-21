import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getPost, getAllPosts, getSeriesNav, type SeriesNavInfo } from '@/lib/mdx';
import { formatDate, readingTime } from '@/lib/utils';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Tag } from '@/components/ui/Tag';
import { SeriesNav } from '@/components/blog/SeriesNav';
import { tagHref } from '@/lib/tags';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleSchema, breadcrumbSchema } from '@/lib/structured-data';
import { siteConfig } from '@/lib/site';
import { localeAlternates } from '@/lib/seo';
import { coverImage, defaultSocialImage, type CoverImage } from '@/lib/post-image';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getAllPosts('zh').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug, locale);
  if (!post) return {};
  // Use the per-post cover when present, else fall back to the site social card.
  const ogImage = coverImage('blog', slug) ?? { url: defaultSocialImage, width: 1200, height: 630 };
  return {
    title: post.title,
    description: post.description,
    alternates: localeAlternates(locale, `/blog/${slug}`),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage.url] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getPost(slug, locale);
  if (!post) notFound();
  const cover = coverImage('blog', slug);
  const seriesNav = getSeriesNav(slug, locale);
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <JsonLd data={articleSchema({ ...post, locale, slug, image: cover?.url ?? defaultSocialImage })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: `${siteConfig.url}/${locale}` },
          { name: 'Writing', url: `${siteConfig.url}/${locale}/blog` },
          { name: post.title, url: `${siteConfig.url}/${locale}/blog/${slug}` },
        ])}
      />
      <PostContent post={post} locale={locale} cover={cover} seriesNav={seriesNav} />
    </div>
  );
}

function PostContent({
  post,
  locale,
  cover,
  seriesNav,
}: {
  post: { title: string; date: string; description: string; tags: string[]; content: string };
  locale: string;
  cover: CoverImage | null;
  seriesNav: SeriesNavInfo | null;
}) {
  const t = useTranslations('blog');
  const c = useTranslations('common');
  const mins = readingTime(post.content, locale);

  return (
    <>
      <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors mb-12">
        ← {c('back')}
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <time className="text-xs font-mono text-[var(--fg-subtle)]">{formatDate(post.date, locale)}</time>
          <span className="text-[var(--border)]">·</span>
          <span className="text-xs font-mono text-[var(--fg-subtle)]">{mins} {t('min_read')}</span>
        </div>

        <h1 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl text-[var(--fg)] leading-tight mb-6">
          {post.title}
        </h1>

        <p className="text-base text-[var(--fg-muted)] leading-relaxed mb-6">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag) => (
            <Tag key={tag} label={tag} href={tagHref(tag)} />
          ))}
        </div>
      </div>

      {cover && (
        <Image
          src={cover.path}
          alt={post.title}
          width={cover.width}
          height={cover.height}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="max-w-3xl w-full h-auto rounded-lg border border-[var(--border)] mb-12"
        />
      )}

      <div className="rule mb-12" />

      <article className="prose-editorial prose prose-invert max-w-3xl
        prose-headings:font-heading prose-headings:font-semibold prose-headings:text-[var(--fg)]
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[var(--fg-muted)] prose-p:leading-relaxed prose-p:mb-5
        prose-li:text-[var(--fg-muted)] prose-li:leading-relaxed
        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
        prose-code:font-mono prose-code:text-xs prose-code:text-[var(--accent)] prose-code:bg-[var(--bg-subtle)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-[var(--bg-subtle)] prose-pre:border prose-pre:border-[var(--border)]
        prose-strong:text-[var(--fg)]
        prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--fg-muted)]
        prose-hr:border-[var(--border)]
        prose-table:text-sm prose-table:font-mono
        prose-th:text-[var(--fg)] prose-th:font-semibold prose-th:border-[var(--border)]
        prose-td:text-[var(--fg-muted)] prose-td:border-[var(--border)]
      ">
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>

      {seriesNav && (
        <div className="max-w-3xl">
          <SeriesNav nav={seriesNav} />
        </div>
      )}
    </>
  );
}
