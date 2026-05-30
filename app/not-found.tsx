import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-6">
          Error 404
        </p>
        <h1 className="font-heading font-semibold text-5xl sm:text-6xl text-[var(--fg)] mb-4">
          404
        </h1>
        <p className="text-sm text-[var(--fg-muted)] mb-2 font-mono">
          // 找不到這個頁面
        </p>
        <p className="text-sm text-[var(--fg-muted)] mb-8 font-mono">
          // The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/zh"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-sm font-heading font-semibold rounded hover:opacity-90 transition-opacity"
          >
            ← 回首頁
          </Link>
          <Link
            href="/en"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] text-sm font-mono text-[var(--fg-muted)] rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            Home (EN)
          </Link>
        </div>
      </div>
    </div>
  );
}
