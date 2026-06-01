import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ConnectForm } from '@/components/connect/ConnectForm';
import { siteConfig } from '@/lib/site';
import { OutboundLink } from '@/components/analytics/OutboundLink';
import { mintToken } from '@/lib/anti-spam';
import type { Metadata } from 'next';

// Dynamic so each visit gets a fresh anti-spam timing token.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'connect' });
  return { title: t('eyebrow'), description: t('description') };
}

export default async function ConnectPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <ConnectContent />
    </div>
  );
}

function ConnectContent() {
  const t = useTranslations('connect');
  const formEnabled = siteConfig.features.contactForm;

  return (
    <>
      <div className="mb-16 max-w-2xl">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight mb-6">
          {t('headline')}
        </h1>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-4xl">
        {formEnabled ? (
          <ConnectForm token={mintToken()} />
        ) : (
          <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-8 flex flex-col gap-3 self-start">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-2)]" aria-hidden="true" />
              <h2 className="font-heading font-semibold text-base text-[var(--fg)]">
                {t('form_closed_title')}
              </h2>
            </div>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
              {t('form_closed_desc')}
            </p>
          </div>
        )}

        <div className="space-y-5">
          <p className="text-xs font-mono text-[var(--fg-muted)]">// {t('or')}</p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition-colors">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="m3 6 9 7 9-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-mono text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition-colors break-all">
              {siteConfig.email}
            </span>
          </a>

          <OutboundLink
            href={siteConfig.links.linkedin}
            location="connect"
            label="LinkedIn"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition-colors">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="text-sm font-mono text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition-colors">
              {t('linkedin')}
            </span>
          </OutboundLink>

          <OutboundLink
            href={siteConfig.links.github}
            location="connect"
            label="GitHub"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition-colors">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
              </svg>
            </div>
            <span className="text-sm font-mono text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition-colors">
              GitHub
            </span>
          </OutboundLink>
        </div>
      </div>
    </>
  );
}
