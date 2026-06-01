'use client';

import { trackResumeDownload } from '@/lib/analytics';

type Props = {
  href: string;
  /** 履歷語系版本,作為 resume_download 事件參數。 */
  format: 'zh' | 'en';
  className?: string;
  children: React.ReactNode;
};

/** 履歷 PDF 下載連結,點擊時送出 resume_download 事件。 */
export function DownloadLink({ href, format, className, children }: Props) {
  return (
    <a
      href={href}
      download
      className={className}
      onClick={() => trackResumeDownload(format)}
    >
      {children}
    </a>
  );
}
