import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resume' });
  return { title: t('eyebrow'), description: t('headline') };
}

export default async function ResumePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <ResumeContent />
    </div>
  );
}

function ResumeContent() {
  const t = useTranslations('resume');

  return (
    <>
      <div className="mb-16 max-w-2xl">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
          {t('headline')}
        </h1>
      </div>

      <div className="max-w-md">
        <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-10 text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[var(--fg-muted)]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm text-[var(--fg-muted)] font-mono mb-6">// {t('coming_soon')}</p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] text-xs font-mono text-[var(--fg-subtle)] rounded cursor-not-allowed opacity-50"
          >
            ↓ {t('download')}
          </button>
        </div>

        <div className="rule mb-8" />

        <p className="text-sm text-[var(--fg-muted)] mb-6 font-mono">
          // {t('contact_cta')}
        </p>
        <Link
          href="/connect"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-sm font-heading font-semibold rounded hover:opacity-90 transition-opacity"
        >
          Connect →
        </Link>
      </div>
    </>
  );
}
