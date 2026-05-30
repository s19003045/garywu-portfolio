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

  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--fg-subtle)]">
          <span className="text-[var(--accent)]">&gt;</span>
          <span>{t('rights')}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[var(--fg-subtle)]">
          <span>{t('built_with')}</span>
          <span className="text-[var(--border)]">/</span>
          {socials.map((s, i) => (
            <span key={s.label} className="flex items-center gap-4">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                {s.label}
              </a>
              {i < socials.length - 1 && <span className="text-[var(--border)]">/</span>}
            </span>
          ))}
          <span className="text-[var(--border)]">/</span>
          <Link href="/connect" className="hover:text-[var(--accent)] transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
