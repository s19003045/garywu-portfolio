'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import {
  GA_ID,
  getStoredConsent,
  setConsent,
  subscribeConsent,
  type ConsentValue,
} from '@/lib/analytics';

/**
 * 輕量 cookie 同意橫幅(Precision Dark)。
 *
 * 僅在已設定 GA_ID 且使用者尚未選擇時顯示。同意狀態存於 localStorage(外部
 * 系統),透過 useSyncExternalStore 讀取:SSR 快照回傳 'denied' 以避免 server
 * 端就渲染橫幅造成 hydration mismatch 與閃爍;client hydrate 後讀取真實值,未
 * 選過(null)才顯示。選擇後寫入 localStorage、以 Consent Mode update 通知 GA,
 * 並 notify 訂閱者即時隱藏橫幅。預設 denied,故選擇前不會寫入分析 cookie。
 */
export function ConsentBanner() {
  const t = useTranslations('consent');
  const stored = useSyncExternalStore<ConsentValue | null>(
    subscribeConsent,
    () => getStoredConsent(),
    () => 'denied',
  );

  if (!GA_ID || stored !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={t('aria_label')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-start gap-2 text-xs font-mono leading-relaxed text-[var(--fg-muted)]">
          <span className="text-[var(--accent)]">&gt;</span>
          <span>{t('message')}</span>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => setConsent('denied')}
            className="rounded border border-[var(--border)] px-4 py-2 text-xs font-mono text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {t('decline')}
          </button>
          <button
            onClick={() => setConsent('granted')}
            className="rounded bg-[var(--accent)] px-4 py-2 text-xs font-heading font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
