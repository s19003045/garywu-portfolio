import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function readingTime(content: string, locale: string): number {
  const wpm = locale === 'zh' ? 400 : 200;
  const words = locale === 'zh'
    ? content.replace(/\s/g, '').length
    : content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wpm));
}
