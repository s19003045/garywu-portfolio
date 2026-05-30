'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = locale === 'zh' ? 'en' : 'zh';
    startTransition(() => { router.replace(pathname, { locale: next }); });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="min-h-[44px] min-w-[44px] text-[0.65rem] font-mono font-medium tracking-widest text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors disabled:opacity-40 uppercase"
    >
      {locale === 'zh' ? 'EN' : '中文'}
    </button>
  );
}
