'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LocaleToggle } from '@/components/ui/LocaleToggle';

const navItems = [
  { key: 'about', href: '/about' },
  { key: 'experience', href: '/experience' },
  { key: 'caseStudies', href: '/case-studies' },
  { key: 'projects', href: '/projects' },
  { key: 'lab', href: '/lab' },
  { key: 'blog', href: '/blog' },
  { key: 'resume', href: '/resume' },
  { key: 'connect', href: '/connect' },
] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label={t('home')}
        className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Gary Wu — 回首頁"
          className="font-heading font-semibold text-base tracking-tight text-[var(--fg)] hover:text-[var(--accent)] transition-colors flex items-center gap-2"
        >
          <span className="text-[var(--accent)]" aria-hidden="true">&gt;</span>
          Gary Wu
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6" role="list">
          {navItems.map(({ key, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={key}
                href={href}
                role="listitem"
                aria-current={isActive ? 'page' : undefined}
                className={`text-xs font-mono tracking-wide transition-colors ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                }`}
              >
                {isActive && <span className="mr-1 opacity-60" aria-hidden="true">./</span>}
                {t(key)}
              </Link>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          {/* Mobile hamburger — 44×44px touch target */}
          <button
            className="md:hidden min-w-[44px] min-h-[44px] flex flex-col justify-center items-center gap-1.5 text-[var(--fg-muted)] rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true" className={`block w-4 h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span aria-hidden="true" className={`block w-4 h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span aria-hidden="true" className={`block w-4 h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[var(--bg-subtle)] border-b border-[var(--border)] px-6 pb-4"
          role="navigation"
          aria-label="行動裝置導覽"
        >
          {navItems.map(({ key, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={key}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className="flex items-center gap-2 py-3 min-h-[44px] text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent)] border-b border-[var(--border)] last:border-0 transition-colors"
              >
                <span aria-hidden="true" className="text-[var(--accent)] opacity-40">./</span>
                {t(key)}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
