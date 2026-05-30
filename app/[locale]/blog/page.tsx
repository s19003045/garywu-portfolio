import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getAllPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { Tag } from '@/components/ui/Tag';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('eyebrow'), description: t('headline') };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <BlogContent posts={posts} locale={locale} />
    </div>
  );
}

function BlogContent({
  posts,
  locale,
}: {
  posts: Array<{ slug: string; title: string; date: string; description: string; tags: string[] }>;
  locale: string;
}) {
  const t = useTranslations('blog');

  return (
    <>
      <div className="mb-16 max-w-2xl">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
          {t('headline')}
        </h1>
      </div>

      <div className="space-y-0">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block py-8 border-t border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-36 flex-shrink-0">
                <time className="text-xs font-mono text-[var(--fg-subtle)]">
                  {formatDate(post.date, locale)}
                </time>
              </div>
              <div className="flex-1">
                <h2 className="font-heading font-semibold text-lg text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed mb-3">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </div>
              <span className="self-center text-[var(--fg-subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
