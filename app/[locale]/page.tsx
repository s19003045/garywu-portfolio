import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { Tag } from '@/components/ui/Tag';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: 'Gary Wu — Senior Full-Stack Engineer',
    description: t('subheadline'),
  };
}

const stats = [
  { value: '15+', labelKey: 'stats_repos', accent: 'cyan' },
  { value: '3x', labelKey: 'stats_downtime', accent: 'amber' },
  { value: '↓75%', labelKey: 'stats_redundancy', accent: 'amber' },
  { value: '24h', labelKey: 'stats_sync', accent: 'cyan' },
] as const;

const techBrief = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'D3.js', 'Electron'],
  backend: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'MySQL'],
  industrial: ['OPC UA / PLC', 'SCADA', 'IPC', 'Edge Computing', 'IPFS'],
  ai: ['YOLOv8 / v11', 'OpenCV', 'OpenAI API', 'AI Agent', 'SDD'],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getAllPosts(locale).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <HeroSection locale={locale} />
      <StatsRow locale={locale} />
      <FeaturedWork locale={locale} />
      <LatestWriting posts={posts} locale={locale} />
      <TechBrief locale={locale} />
    </div>
  );
}

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('home');

  return (
    <section className="pt-24 pb-16 border-b border-[var(--border)]">
      <p className="eyebrow mb-8">{t('eyebrow')}</p>

      <h1 className="font-heading font-semibold leading-[1.05] tracking-tight mb-8">
        <span className="block text-5xl sm:text-6xl lg:text-7xl text-[var(--fg)]">
          {t('headline_1')}
        </span>
        <span className="block text-5xl sm:text-6xl lg:text-7xl text-[var(--accent)]">
          {t('headline_2')}
        </span>
      </h1>

      <p className="text-base text-[var(--fg-muted)] max-w-xl leading-relaxed mb-10">
        {t('subheadline')}
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-sm font-heading font-semibold rounded hover:opacity-90 transition-opacity"
        >
          {t('cta_primary')}
          <span aria-hidden>→</span>
        </Link>
        <Link
          href="/resume"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] text-sm font-heading font-medium rounded text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          {t('cta_secondary')}
        </Link>
      </div>
    </section>
  );
}

function StatsRow({ locale }: { locale: string }) {
  const t = useTranslations('home');

  return (
    <section className="py-10 border-b border-[var(--border)]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ value, labelKey, accent }) => (
          <div key={labelKey} className="flex flex-col gap-1">
            <span
              className={`font-mono font-semibold text-2xl sm:text-3xl ${
                accent === 'cyan' ? 'text-[var(--accent)]' : 'text-[var(--accent-2)]'
              }`}
            >
              {value}
            </span>
            <span className="text-xs text-[var(--fg-muted)] font-mono tracking-wide">
              {t(labelKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedWork({ locale }: { locale: string }) {
  const t = useTranslations('home');

  const featured = locale === 'zh'
    ? {
        slug: 'solar-panel-recycling-system',
        eyebrow: 'Industrial System Integration',
        title: '太陽能板回收系統',
        description: '橫跨 15+ repositories 的 edge-to-cloud 工業整合架構，串聯 IPC、PLC、SCADA、YOLO AI 模型與雲端 API——從設備端到雲端業務的完整資料閉環。',
        tags: ['Edge-to-Cloud', 'IPC', 'SCADA', 'OPC UA', 'YOLO', 'Python'],
      }
    : {
        slug: 'solar-panel-recycling-system',
        eyebrow: 'Industrial System Integration',
        title: 'Solar Panel Recycling System',
        description: 'An edge-to-cloud industrial integration spanning 15+ repositories — connecting IPC, PLC, SCADA, YOLO AI, and cloud APIs into a complete data loop from device floor to business cloud.',
        tags: ['Edge-to-Cloud', 'IPC', 'SCADA', 'OPC UA', 'YOLO', 'Python'],
      };

  return (
    <section className="py-16 border-b border-[var(--border)] scan-line">
      <p className="eyebrow mb-10">{t('featured_label')}</p>

      <Link
        href={`/case-studies/${featured.slug}`}
        className="group block bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-8 hover:border-[var(--accent)] transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex-1">
            <p className="text-xs font-mono text-[var(--accent)] mb-3 tracking-widest uppercase">
              {featured.eyebrow}
            </p>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors mb-3">
              {featured.title}
            </h2>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-5">
              {featured.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </div>
          <span className="self-center text-2xl text-[var(--fg-subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" aria-hidden>
            →
          </span>
        </div>
      </Link>
    </section>
  );
}

function LatestWriting({
  posts,
  locale,
}: {
  posts: Array<{ slug: string; title: string; date: string }>;
  locale: string;
}) {
  const t = useTranslations('home');
  const b = useTranslations('blog');

  return (
    <section className="py-16 border-b border-[var(--border)]">
      <p className="eyebrow mb-10">{t('writing_label')}</p>
      <div className="space-y-0">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-5 border-t border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <time className="text-xs font-mono text-[var(--fg-subtle)] sm:w-28 flex-shrink-0">
              {formatDate(post.date, locale)}
            </time>
            <span className="flex-1 text-sm text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors leading-snug">
              {post.title}
            </span>
            <span className="text-[var(--fg-subtle)] group-hover:text-[var(--accent)] transition-colors text-sm" aria-hidden>→</span>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/blog" className="text-xs font-mono text-[var(--accent)] hover:underline underline-offset-4">
          {b('read_more')} →
        </Link>
      </div>
    </section>
  );
}

function TechBrief({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const a = useTranslations('about');

  const categories = [
    { label: a('frontend'), items: techBrief.frontend },
    { label: a('backend'), items: techBrief.backend },
    { label: a('industrial'), items: techBrief.industrial },
    { label: a('ai_tools'), items: techBrief.ai },
  ];

  return (
    <section className="py-16">
      <p className="eyebrow mb-10">{t('skills_label')}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map(({ label, items }) => (
          <div key={label}>
            <h3 className="text-xs font-mono font-semibold text-[var(--fg)] mb-4 uppercase tracking-wider">
              {label}
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs font-mono text-[var(--fg-muted)]">
                  <span className="text-[var(--accent)] opacity-60">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
