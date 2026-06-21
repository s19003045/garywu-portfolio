'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { SearchDoc } from '@/lib/search';

/**
 * Client-side blog search.
 *
 * Filters an in-memory index (passed from the server) by case-insensitive
 * substring across title / tags / description — which also handles CJK, where
 * there are no word boundaries to tokenise. Title matches rank first, then tag,
 * then description. Results show in a dropdown; nothing here touches the
 * server-rendered list below it.
 */
export function BlogSearch({ index }: { index: SearchDoc[] }) {
  const t = useTranslations('blog');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const needle = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!needle) return [];
    const scored: Array<{ doc: SearchDoc; score: number }> = [];
    for (const doc of index) {
      const inTitle = doc.title.toLowerCase().includes(needle);
      const inTag = doc.tags.some((tag) => tag.toLowerCase().includes(needle));
      const inDesc = doc.description.toLowerCase().includes(needle);
      if (!inTitle && !inTag && !inDesc) continue;
      scored.push({ doc, score: inTitle ? 0 : inTag ? 1 : 2 });
    }
    return scored
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((s) => s.doc);
  }, [index, needle]);

  // Dismiss the dropdown when clicking outside the widget.
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const showPanel = open && needle.length > 0;

  return (
    <div ref={containerRef} role="search" className="relative mb-8 max-w-md">
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setQuery('');
            setOpen(false);
          }
        }}
        placeholder={t('search_placeholder')}
        aria-label={t('search_placeholder')}
        className="w-full bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
      {showPanel && (
        <div className="absolute z-20 mt-2 w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[var(--fg-subtle)]">{t('search_no_results')}</p>
          ) : (
            <ul>
              {results.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/blog/${doc.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery('');
                    }}
                    className="block px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <span className="block text-sm font-medium text-[var(--fg)]">{doc.title}</span>
                    {doc.tags.length > 0 && (
                      <span className="block text-xs font-mono text-[var(--fg-subtle)] mt-1">
                        {doc.tags.slice(0, 4).join(' · ')}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
