'use client';

import { trackSelectContent, type ContentType } from '@/lib/analytics';

type Props = {
  href: string;
  contentType: ContentType;
  /** 作品的穩定識別子(資料中的 id / slug)。 */
  itemId: string;
  /** 作品標題,作為 select_content 的 item_name。 */
  itemName: string;
  /** 站外連結(新分頁開啟);省略時依 href 是否以 http(s) 開頭自動判斷。 */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * 作品清單項目的連結,點擊時送出 GA4 select_content 事件。
 * 用於 /projects、/lab 等無獨立 URL 的列表頁,以事件追蹤每個項目的熱度。
 */
export function ContentLink({
  href,
  contentType,
  itemId,
  itemName,
  external,
  className,
  children,
}: Props) {
  const isExternal = external ?? /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      className={className}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={() =>
        trackSelectContent({
          contentType,
          itemId,
          itemName,
          linkType: isExternal ? 'external' : 'internal',
          linkUrl: href,
        })
      }
    >
      {children}
    </a>
  );
}
