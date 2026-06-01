/**
 * Google Analytics 4 事件追蹤 helper(自管 gtag)。
 *
 * 搭配 `components/analytics/Analytics.tsx`:後者以 config `send_page_view: false`
 * 載入 gtag,故 pageview 完全由 `trackPageView`(初次 + 每次 route change)手動送出,
 * 不依賴 GA 對 SPA history 的偵測,也避免與自動 pageview 重複。
 *
 * Consent Mode v2:使用者尚未同意時 GA 只送無 cookie 的 ping,同意後才寫 _ga。
 * 未設定 NEXT_PUBLIC_GA_ID 時,所有追蹤函式皆為 no-op(本機開發預設關閉)。
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 Measurement ID(形如 G-XXXXXXXXXX);build 時 inline 進 client bundle。 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** localStorage 鍵:記住使用者的 cookie 同意選擇。 */
export const CONSENT_KEY = 'ga-consent';

export type ConsentValue = 'granted' | 'denied';
export type ContentType = 'project' | 'lab' | 'case_study';

/** 內部:安全送出 GA 事件(GA 未啟用或 gtag 尚未就緒時為 no-op)。 */
function gaEvent(name: string, params: Record<string, unknown>) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/** 手動送出 page_view(初次與每次導航皆由此送;config 已關自動 pageview)。 */
export function trackPageView(path?: string) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * 點選清單中的某一項作品(GA4 推薦事件 select_content)。
 * 用於 /projects、/lab —— 這些是單一列表頁、項目無獨立 URL,改以事件區分顆粒度。
 */
export function trackSelectContent(params: {
  contentType: ContentType;
  itemId: string;
  itemName: string;
  linkType: 'internal' | 'external';
  linkUrl?: string;
}) {
  gaEvent('select_content', {
    content_type: params.contentType,
    item_id: params.itemId,
    item_name: params.itemName,
    link_type: params.linkType,
    ...(params.linkUrl ? { link_url: params.linkUrl } : {}),
  });
}

/** 履歷 PDF 下載(最強的雇主意圖訊號)。 */
export function trackResumeDownload(format: 'zh' | 'en') {
  gaEvent('resume_download', { format });
}

/** 外部連結點擊(GitHub / LinkedIn / Medium 等);location 標示點擊發生處。 */
export function trackOutbound(label: string, url: string, location: string) {
  gaEvent('outbound_click', {
    link_label: label,
    link_url: url,
    link_location: location,
  });
}

/**
 * 同意狀態的訂閱者(localStorage 是外部系統,故以 store 模式暴露給
 * useSyncExternalStore;選擇後通知訂閱者即時重渲染)。
 */
const consentListeners = new Set<() => void>();

/** 訂閱同意狀態變更;回傳取消訂閱函式。供 useSyncExternalStore 使用。 */
export function subscribeConsent(callback: () => void): () => void {
  consentListeners.add(callback);
  return () => consentListeners.delete(callback);
}

/** 更新 Consent Mode 狀態並記住選擇,供下次造訪沿用。 */
export function setConsent(value: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* localStorage 不可用(隱私模式等)時忽略,僅本次 session 套用 */
  }
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: value });
  }
  consentListeners.forEach((cb) => cb());
}

/** 讀取已儲存的同意選擇;未選過回傳 null(用於決定是否顯示同意橫幅)。 */
export function getStoredConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}
