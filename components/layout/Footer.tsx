import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/site';

export function Footer() {
  const t = useTranslations('footer');

  const socials = [
    { label: 'LinkedIn', href: siteConfig.links.linkedin },
    { label: 'GitHub', href: siteConfig.links.github },
    { label: 'Medium', href: siteConfig.links.medium },
  ];
  const footerLinks = [
    ...socials.map((social) => ({
      label: social.label,
      href: social.href,
      external: true,
    })),
    { label: 'Contact', href: '/connect', external: false },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex max-w-full items-center justify-center gap-2 text-center text-xs font-mono text-[var(--fg-subtle)] sm:justify-start sm:text-left">
          <span className="text-[var(--accent)]">&gt;</span>
          <span className="min-w-0 break-words">{t('rights')}</span>
        </div>
        <div className="flex max-w-full flex-col items-center gap-2 text-xs font-mono text-[var(--fg-subtle)] sm:items-end">
          <span className="text-center sm:text-right">{t('built_with')}</span>
          <div className="flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center sm:justify-end">
            {footerLinks.map((link, index) => (
              <div key={link.label} className="flex items-center gap-3">
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href="/connect" className="transition-colors hover:text-[var(--accent)]">
                    {link.label}
                  </Link>
                )}
                {index < footerLinks.length - 1 && <span className="text-[var(--border)]">/</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
