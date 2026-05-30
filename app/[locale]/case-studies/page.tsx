import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getAllCaseStudies } from '@/lib/mdx';
import { Tag } from '@/components/ui/Tag';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'caseStudies' });
  return { title: t('eyebrow'), description: t('headline') };
}

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cases = getAllCaseStudies(locale);
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <CaseStudiesContent cases={cases} locale={locale} />
    </div>
  );
}

function CaseStudiesContent({
  cases,
  locale,
}: {
  cases: Array<{ slug: string; title: string; description: string; tags: string[] }>;
  locale: string;
}) {
  const t = useTranslations('caseStudies');

  return (
    <>
      <div className="mb-16 max-w-2xl">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
          {t('headline')}
        </h1>
      </div>

      <div className="space-y-0">
        {cases.map((item) => (
          <Link
            key={item.slug}
            href={`/case-studies/${item.slug}`}
            className="group block py-10 border-t border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors mb-3 leading-snug">
                  {item.title}
                </h2>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4 max-w-2xl">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </div>
              <span className="self-center text-xl text-[var(--fg-subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" aria-hidden>→</span>
            </div>
            <p className="mt-5 text-xs font-mono text-[var(--accent)] group-hover:underline underline-offset-4">
              {t('read_more')} →
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
