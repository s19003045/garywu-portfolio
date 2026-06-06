import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getCaseStudy, getAllCaseStudies } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Tag } from '@/components/ui/Tag';
import { JsonLd } from '@/components/seo/JsonLd';
import { caseStudySchema, breadcrumbSchema } from '@/lib/structured-data';
import { siteConfig } from '@/lib/site';
import { localeAlternates } from '@/lib/seo';
import { coverImage, defaultSocialImage, type CoverImage } from '@/lib/post-image';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getAllCaseStudies('zh').map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getCaseStudy(slug, locale);
  if (!post) return {};
  // Use the per-case cover when present, else fall back to the site social card.
  const ogImage = coverImage('case-studies', slug) ?? { url: defaultSocialImage, width: 1200, height: 630 };
  return {
    title: post.title,
    description: post.description,
    alternates: localeAlternates(locale, `/case-studies/${slug}`),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage.url] },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getCaseStudy(slug, locale);
  if (!post) notFound();
  const cover = coverImage('case-studies', slug);
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <JsonLd data={caseStudySchema({ ...post, locale, slug, image: cover?.url ?? defaultSocialImage })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: `${siteConfig.url}/${locale}` },
          { name: 'Case Studies', url: `${siteConfig.url}/${locale}/case-studies` },
          { name: post.title, url: `${siteConfig.url}/${locale}/case-studies/${slug}` },
        ])}
      />
      <CaseStudyContent post={post} cover={cover} />
    </div>
  );
}

function CaseStudyContent({
  post,
  cover,
}: {
  post: { title: string; description: string; tags: string[]; content: string };
  cover: CoverImage | null;
}) {
  const t = useTranslations('caseStudies');
  const c = useTranslations('common');

  return (
    <>
      <Link href="/case-studies" className="inline-flex items-center gap-1 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors mb-12">
        ← {c('back')}
      </Link>

      <div className="max-w-3xl">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight mb-6">
          {post.title}
        </h1>
        <p className="text-base text-[var(--fg-muted)] leading-relaxed mb-6">
          {post.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag) => (
            <Tag key={tag} label={tag} />
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
        prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[var(--fg-muted)] prose-p:leading-relaxed
        prose-li:text-[var(--fg-muted)]
        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
        prose-code:font-mono prose-code:text-xs prose-code:text-[var(--accent)] prose-code:bg-[var(--bg-subtle)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-[var(--bg-subtle)] prose-pre:border prose-pre:border-[var(--border)]
        prose-strong:text-[var(--fg)]
        prose-table:text-sm prose-table:font-mono
        prose-th:text-[var(--fg)] prose-th:font-semibold prose-th:border-[var(--border)]
        prose-td:text-[var(--fg-muted)] prose-td:border-[var(--border)]
        prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--fg-muted)]
        prose-hr:border-[var(--border)]
      ">
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>
    </>
  );
}
