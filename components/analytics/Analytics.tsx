import Script from 'next/script';
import { GA_ID, CONSENT_KEY } from '@/lib/analytics';
import { PageViewTracker } from './PageViewTracker';

/**
 * gtag 初始化(自管,SSR 同步輸出於 HTML、解析時立即執行,早於 afterInteractive
 * 的 gtag.js 處理 dataLayer queue):
 * - 先設 Consent Mode v2 預設 `analytics_storage: denied`;若先前已同意則升級。
 * - `send_page_view: false` 關閉自動 pageview,改由 PageViewTracker 手動送出
 *   (含初次),確保 SPA 導航每頁可靠且不重複。
 */
const initScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'denied', wait_for_update: 500 });
try {
  if (localStorage.getItem('${CONSENT_KEY}') === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: false });
`;

/**
 * Google Analytics 4 + Consent Mode v2,掛在 root layout。
 * 未設定 NEXT_PUBLIC_GA_ID 時完全不載入(本機開發預設關閉)。
 */
export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <script id="ga-init" dangerouslySetInnerHTML={{ __html: initScript }} />
      <Script
        id="ga-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <PageViewTracker />
    </>
  );
}
