import { Link } from '@/i18n/navigation';
import { tagKind } from '@/lib/tags';

/**
 * Unified tag chip.
 *  - tech  → neutral grey outline
 *  - topic → cyan tint + `#` prefix (accessible: shape cue, not colour alone)
 *
 * Pass `href` to render the chip as a link (e.g. a tag filter page); without it
 * the chip is plain inline text, so existing non-clickable call sites are
 * unaffected.
 */
export function Tag({ label, href }: { label: string; href?: string }) {
  const kind = tagKind(label);

  const className =
    kind === 'tech'
      ? 'inline-flex items-center text-xs font-mono text-[var(--fg-muted)] border border-[var(--border)] px-2 py-0.5 rounded'
      : 'inline-flex items-center text-xs font-mono text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent-dim)] px-2 py-0.5 rounded';

  const inner =
    kind === 'tech' ? (
      label
    ) : (
      <>
        <span className="opacity-60 mr-0.5" aria-hidden="true">#</span>
        {label}
      </>
    );

  if (href) {
    return (
      <Link href={href} className={`${className} hover:border-[var(--accent)] transition-colors`}>
        {inner}
      </Link>
    );
  }

  return <span className={className}>{inner}</span>;
}
