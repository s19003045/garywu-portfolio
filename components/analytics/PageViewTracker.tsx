'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * 每次 route change(含初次載入)手動送出 page_view。
 *
 * usePathname 回傳含 locale 的完整路徑(如 /zh/blog/x),故 zh/en 與各動態頁
 * (case-studies/[slug]、blog/[slug])會各自計為獨立 pageview。在 effect 中送出,
 * 確保 document.title 已更新為新頁標題。
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
