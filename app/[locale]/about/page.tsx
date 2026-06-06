import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/site';
import { OutboundLink } from '@/components/analytics/OutboundLink';
import { localeAlternates } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('eyebrow'), description: t('meta_description'), alternates: localeAlternates(locale, '/about') };
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

interface Story {
  eyebrow: string;
  heading: string;
  intro: string;
  sections: { h: string; body: string[] }[];
  workHeading: string;
  work: { name: string; href: string; desc: string }[];
  valuesHeading: string;
  valuesBody: string[];
  ctaText: string;
  ctaLabel: string;
}

const storyZh: Story = {
  eyebrow: 'Brand Story',
  heading: '從醫檢到工業系統整合：我如何工作',
  intro:
    '我是吳振銜（Gary Wu），一位擁有 5 年以上實戰經驗的資深全端工程師，專注於工業系統整合與 Edge-to-Cloud 架構。我的工作不只是把功能寫出來，而是把設備端資料、現場作業流程、AI 推論與雲端業務系統，整合成可維護、可追蹤、可長期演進的軟體系統。',
  sections: [
    {
      h: '我擅長解決的問題',
      body: [
        '一般全端開發多半圍繞 Web Application，但我的場景更常橫跨設備端、工業現場、資料流程與業務系統。我擅長在網路不穩定、邊緣端資源受限、設備多版本並行、跨公司協作這類真實限制下，設計能落地執行、穩定運行的系統——從 IPC 主程式、PLC 通訊（OPC UA）、SCADA 監控，到雲端 API 與 AI 物件辨識，始終從整體架構思考資料的產生、處理、儲存與同步。',
      ],
    },
    {
      h: '一段不太典型的起點',
      body: [
        '我的背景並非資工科班出身——我畢業於國立陽明大學醫事技術學系。醫檢訓練給我的，是對「資料正確性」與「流程嚴謹」的高度敏感；後來轉向軟體工程，我把這份對精準與系統性的要求，帶進了每一個專案。',
      ],
    },
  ],
  workHeading: '代表作與實戰',
  work: [
    { name: '太陽能板回收系統', href: '/case-studies/solar-panel-recycling-system', desc: '主導橫跨 15+ repositories 的 edge-to-cloud 工業整合，以 config-driven 省去重複開發、log 上雲讓除錯約快 3 倍。' },
    { name: '台灣文學館相關網站', href: '/projects', desc: '橫跨 10+ repositories，涵蓋資料展示、視覺化、全文搜尋與後台管理。' },
    { name: '代書資訊系統（Rock System）', href: '/case-studies/rock-system', desc: '以單一主責工程師從 0 到 1 完成完整 SDLC。' },
    { name: '數位人文展示平台', href: '/projects', desc: '以 D3.js、Leaflet、時間軸與圖表，讓文史資料成為學者研究的有力佐證。' },
  ],
  valuesHeading: '不只是寫程式',
  valuesBody: [
    '我相信，真正能區分一位資深工程師的，不是他用哪個框架，而是他最擅長在哪一種場景中解決問題。這幾年我刻意訓練自我覺察，也持續探索 AI 協作的邊界——把 AI 當成放大思考的鏡子，而非只是產出答案的工具；並透過帶夥伴面試、團隊分享與技術寫作，持續輸出觀點。',
  ],
  ctaText: '如果你正在尋找能把複雜工業流程、跨系統整合或全端產品真正落地的工程師，歡迎與我聊聊。',
  ctaLabel: '一起合作',
};

const storyEn: Story = {
  eyebrow: 'Brand Story',
  heading: 'From Clinical Labs to Industrial Systems: How I Work',
  intro:
    "I'm Gary Wu (吳振銜), a senior full-stack engineer with 5+ years of hands-on experience, specialising in industrial system integration and edge-to-cloud architecture. My work isn't just shipping features — it's integrating edge-device data, on-site workflows, AI inference, and cloud business systems into software that stays maintainable, traceable, and able to evolve over years.",
  sections: [
    {
      h: 'The Problems I Solve',
      body: [
        "Beyond conventional web development, my work spans edge devices, the industrial floor, data pipelines, and business systems. I'm at my best designing systems that hold up under real constraints — unstable networks, resource-limited edge hardware, multiple concurrent device versions, cross-company collaboration — thinking in architecture from the IPC core program, PLC communication (OPC UA), and SCADA to cloud APIs and AI object recognition.",
      ],
    },
    {
      h: 'An Unconventional Start',
      body: [
        "I didn't come from a computer-science background — I graduated in Clinical Laboratory Science from National Yang Ming University. Lab work gave me a sharp instinct for data correctness and procedural rigour, and I carried that demand for precision into software engineering.",
      ],
    },
  ],
  workHeading: 'Selected Work',
  work: [
    { name: 'Solar Panel Recycling System', href: '/case-studies/solar-panel-recycling-system', desc: 'Led an edge-to-cloud integration across 15+ repositories; config-driven design and cloud-streamed logs made debugging ~3x faster.' },
    { name: 'National Museum of Taiwan Literature', href: '/projects', desc: 'Spanning 10+ repositories — data display, visualisation, full-text search, and back-office management.' },
    { name: 'Rock System (notary platform)', href: '/case-studies/rock-system', desc: 'Sole engineer from 0→1 across the full SDLC.' },
    { name: 'Digital-humanities platforms', href: '/projects', desc: 'Turning historical data into interactive scholarly evidence with D3.js, Leaflet, timelines, and charts.' },
  ],
  valuesHeading: 'More Than Code',
  valuesBody: [
    "What distinguishes a senior engineer isn't the framework they use, but the kind of problem they solve best. I deliberately practise self-awareness and explore the boundaries of AI-augmented development — treating AI as a mirror that amplifies thinking rather than just an answer machine — and keep sharing through mentoring, interviewing, and writing.",
  ],
  ctaText: "If you're looking for an engineer who can make complex industrial processes, cross-system integration, or full-stack products genuinely land in production, let's talk.",
  ctaLabel: "Let's work together",
};

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
              <OutboundLink
                key={s.label}
                href={s.href}
                location="about"
                label={s.label}
                className="text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors border border-[var(--border)] px-3 py-1.5 rounded hover:border-[var(--accent)]"
              >
                {s.label} ↗
              </OutboundLink>
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

      {/* Brand story (E-E-A-T) — independent block, original bio kept above */}
      <StorySection story={locale === 'en' ? storyEn : storyZh} />

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

function StorySection({ story }: { story: Story }) {
  return (
    <section className="mb-20 max-w-3xl">
      <p className="eyebrow mb-6">{story.eyebrow}</p>
      <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[var(--fg)] leading-tight mb-6">
        {story.heading}
      </h2>
      <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-10">{story.intro}</p>

      <div className="space-y-8">
        {story.sections.map((s) => (
          <div key={s.h}>
            <h3 className="font-heading font-semibold text-base text-[var(--fg)] mb-2">{s.h}</h3>
            {s.body.map((p, i) => (
              <p key={i} className="text-sm text-[var(--fg-muted)] leading-relaxed">{p}</p>
            ))}
          </div>
        ))}

        <div>
          <h3 className="font-heading font-semibold text-base text-[var(--fg)] mb-3">{story.workHeading}</h3>
          <ul className="space-y-2.5">
            {story.work.map((w) => (
              <li key={w.name} className="flex gap-2 text-sm text-[var(--fg-muted)] leading-relaxed">
                <span className="text-[var(--accent)] flex-shrink-0 mt-1">·</span>
                <span>
                  <Link href={w.href} className="text-[var(--accent)] hover:underline underline-offset-4">
                    {w.name}
                  </Link>
                  {' — '}
                  {w.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-base text-[var(--fg)] mb-2">{story.valuesHeading}</h3>
          {story.valuesBody.map((p, i) => (
            <p key={i} className="text-sm text-[var(--fg-muted)] leading-relaxed">{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">{story.ctaText}</p>
        <Link
          href="/connect"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-sm font-heading font-semibold rounded hover:opacity-90 transition-opacity"
        >
          {story.ctaLabel} →
        </Link>
      </div>
    </section>
  );
}
