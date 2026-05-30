import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { siteConfig } from '@/lib/site';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('eyebrow'), description: t('bio_1') };
}

const skills = {
  frontend: ['React.js', 'Next.js', 'TypeScript', 'Redux', 'D3.js', 'Electron.js', 'Tailwind CSS', 'Webpack / Vite'],
  backend: ['Node.js (Express)', 'Python (FastAPI / Flask)', 'MySQL', 'PostgreSQL', 'MongoDB', 'SPARQL (Graph DB)'],
  industrial: ['OPC UA / PLC 通訊', 'SCADA 系統整合', 'IPC 主程式開發', 'Edge Computing', 'Web3 / IPFS'],
  ai: ['YOLOv8 / YOLOv11', 'OpenCV', 'Google Vision AI', 'OpenAI API', 'AI Agent 協作', 'SDD'],
  security: ['ISO 27001:2022 ISMS', '內部稽核', '風險評估與處理', '資訊安全管理制度'],
};

const skillsEn = {
  frontend: ['React.js', 'Next.js', 'TypeScript', 'Redux', 'D3.js', 'Electron.js', 'Tailwind CSS', 'Webpack / Vite'],
  backend: ['Node.js (Express)', 'Python (FastAPI / Flask)', 'MySQL', 'PostgreSQL', 'MongoDB', 'SPARQL (Graph DB)'],
  industrial: ['OPC UA / PLC Communication', 'SCADA System Integration', 'IPC Core Development', 'Edge Computing', 'Web3 / IPFS'],
  ai: ['YOLOv8 / YOLOv11', 'OpenCV', 'Google Vision AI', 'OpenAI API', 'AI Agent Collaboration', 'SDD'],
  security: ['ISO 27001:2022 ISMS', 'Internal Audit', 'Risk Assessment', 'InfoSec Management'],
};

const testimonialsZh = [
  {
    quote: '一位值得信任的 mentor。遇到問題時，他不只給答案，更會帶著你理解問題的本質。',
    source: '共事夥伴',
  },
  {
    quote: '團隊裡那種穩定而紮實的力量——不張揚，但你知道交給他的事情，一定會被穩穩接住。',
    source: '共事夥伴',
  },
  {
    quote: '對技術新知有著純粹的熱情，總是樂於把學到的東西整理出來，分享給身邊每一個人。',
    source: '共事夥伴',
  },
];

const testimonialsEn = [
  {
    quote: 'A mentor you can genuinely trust. When you hit a problem, he doesn\'t just hand you the answer — he walks you through understanding its essence.',
    source: 'Colleague',
  },
  {
    quote: 'That steady, solid presence on a team — never showy, but you know whatever you hand him will be caught and held firmly.',
    source: 'Colleague',
  },
  {
    quote: 'A pure enthusiasm for new technology. He always loves to organise what he\'s learned and share it with everyone around him.',
    source: 'Colleague',
  },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <AboutContent locale={locale} />
    </div>
  );
}

function AboutContent({ locale }: { locale: string }) {
  const t = useTranslations('about');
  const currentSkills = locale === 'zh' ? skills : skillsEn;
  const testimonials = locale === 'zh' ? testimonialsZh : testimonialsEn;

  const skillCategories = [
    { key: 'frontend' as const, label: t('frontend') },
    { key: 'backend' as const, label: t('backend') },
    { key: 'industrial' as const, label: t('industrial') },
    { key: 'ai' as const, label: t('ai_tools') },
    { key: 'security' as const, label: t('security') },
  ];

  const socials = [
    { label: 'LinkedIn', href: siteConfig.links.linkedin },
    { label: 'GitHub', href: siteConfig.links.github },
    { label: 'Medium', href: siteConfig.links.medium },
  ];

  return (
    <>
      {/* Intro: avatar + bio */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 mb-20 items-start">
        <div className="flex flex-col gap-5">
          <div className="relative aspect-square w-full max-w-[280px] rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-subtle)]">
            <Image
              src="/garywu.webp"
              alt="Gary Wu"
              fill
              sizes="280px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors border border-[var(--border)] px-3 py-1.5 rounded hover:border-[var(--accent)]"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-6">{t('eyebrow')}</p>
          <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-[var(--fg)] leading-tight mb-8">
            {t('headline')}
          </h1>
          <div className="space-y-5 text-sm text-[var(--fg-muted)] leading-relaxed">
            <p>{t('bio_1')}</p>
            <p>{t('bio_2')}</p>
            <p>{t('bio_3')}</p>
          </div>
        </div>
      </div>

      <div className="rule mb-16" />

      {/* Skills */}
      <div className="mb-20">
        <p className="eyebrow mb-10">{t('skills_eyebrow')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          {skillCategories.map(({ key, label }) => (
            <div key={key} className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)] transition-colors">
              <h3 className="text-xs font-mono font-semibold text-[var(--accent)] mb-4 uppercase tracking-widest">
                {label}
              </h3>
              <ul className="space-y-2">
                {(currentSkills[key] ?? []).map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-mono text-[var(--fg-muted)]">
                    <span className="text-[var(--accent)] opacity-50">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rule mb-16" />

      {/* Testimonials */}
      <div>
        <p className="eyebrow mb-3">{t('testimonials_eyebrow')}</p>
        <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[var(--fg)] leading-tight mb-10">
          {t('testimonials_heading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item, i) => (
            <figure
              key={i}
              className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-6 flex flex-col gap-4"
            >
              <span className="text-[var(--accent)] text-3xl font-heading leading-none" aria-hidden="true">&ldquo;</span>
              <blockquote className="text-sm text-[var(--fg)] leading-relaxed flex-1">
                {item.quote}
              </blockquote>
              <figcaption className="text-xs font-mono text-[var(--fg-subtle)]">
                — {item.source}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
