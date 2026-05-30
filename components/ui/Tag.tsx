import { tagKind } from '@/lib/tags';

/**
 * Unified tag chip.
 *  - tech  → neutral grey outline
 *  - topic → cyan tint + `#` prefix (accessible: shape cue, not colour alone)
 */
export function Tag({ label }: { label: string }) {
  const kind = tagKind(label);

  if (kind === 'tech') {
    return (
      <span className="inline-flex items-center text-xs font-mono text-[var(--fg-muted)] border border-[var(--border)] px-2 py-0.5 rounded">
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-xs font-mono text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent-dim)] px-2 py-0.5 rounded">
      <span className="opacity-60 mr-0.5" aria-hidden="true">#</span>
      {label}
    </span>
  );
}
