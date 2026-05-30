'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
    >
      {isDark ? (
        /* Sun icon */
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
          <line x1="7.5" y1="0.5" x2="7.5" y2="2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="7.5" y1="12.5" x2="7.5" y2="14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="0.5" y1="7.5" x2="2.5" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="12.5" y1="7.5" x2="14.5" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="2.4" y1="2.4" x2="3.8" y2="3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="11.2" y1="11.2" x2="12.6" y2="12.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="12.6" y1="2.4" x2="11.2" y2="3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="3.8" y1="11.2" x2="2.4" y2="12.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <path
            d="M13 8A6 6 0 0 1 7 14 6 6 0 0 1 1 8 6 6 0 0 1 7 2a4.5 4.5 0 0 0 6 6z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
