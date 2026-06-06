import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Analytics } from '@/components/analytics/Analytics';
import { personSchema, websiteSchema } from '@/lib/structured-data';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s | Gary Wu',
  },
  description: siteConfig.description,
  keywords: [
    'Gary Wu', '吳振銜', 'Full-Stack Engineer', '全端工程師',
    'Industrial System Integration', 'Edge-to-Cloud', 'SCADA', 'IPC',
    'AI Engineering', 'Next.js', 'TypeScript', 'React',
  ],
  authors: [{ name: 'Gary Wu' }],
  creator: 'Gary Wu',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    alternateLocale: 'en_US',
    siteName: 'Gary Wu',
    title: 'Gary Wu — Senior Full-Stack Engineer',
    description:
      '運用 AI 與現代技術優化工業系統、提升效能、強韌架構。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gary Wu — Senior Full-Stack Engineer',
    description: '運用 AI 與現代技術優化工業系統、提升效能、強韌架構。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    types: { 'application/rss+xml': '/feed.xml' },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve the active locale so `<html lang>` matches the page language
  // (next-intl falls back to the default locale outside localized routes).
  const locale = await getLocale();
  const lang = locale === 'zh' ? 'zh-TW' : 'en';
  return (
    <html
      lang={lang}
      className={`${spaceGrotesk.variable} ${jakarta.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        {/* Locale-independent structured data — kept in the root (server-only)
            layout so it isn't re-rendered client-side on locale switch. */}
        <JsonLd data={personSchema()} />
        <JsonLd data={websiteSchema()} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#22D3EE] focus:text-[#0D1117] focus:text-sm focus:font-semibold focus:rounded focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
