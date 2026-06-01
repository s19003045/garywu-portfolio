'use client';

import { trackOutbound } from '@/lib/analytics';

type Props = {
  href: string;
  /** 點擊發生的位置(如 'footer'、'about'),用於區分同一連結的來源。 */
  location: string;
  /** 事件標籤;省略時以 href 代之。 */
  label?: string;
  className?: string;
  children: React.ReactNode;
};

/** 在新分頁開啟的外部連結,點擊時送出 outbound_click 事件。 */
export function OutboundLink({ href, location, label, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackOutbound(label ?? href, href, location)}
    >
      {children}
    </a>
  );
}
