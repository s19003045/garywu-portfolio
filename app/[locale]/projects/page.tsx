import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return { title: t('eyebrow'), description: t('headline') };
}

const projectsZh = [
  {
    id: 'solar-recycling',
    category: 'Industrial System',
    title: '太陽能板回收系統',
    description: '橫跨 15+ repositories 的 edge-to-cloud 工業整合架構，把 IPC 主程式、PLC 通訊（OPC UA）、SCADA 監控、YOLO 物件辨識與雲端 API 串成從現場設備到雲端業務的完整資料閉環。以 config-driven 設計讓單一主程式因應設備 1.0 到 2.x，省去為每個版本維護一套程式碼的重複開發；再把設備 log 分級上拋雲端、於 SCADA 即時監測與篩選，讓工程師除錯定位的速度約快上 3 倍。另以 version manager 把 IPC 軟體部署從 1 小時壓到 15 分鐘，並以即時上傳加排程重送，在不穩定的工廠網路下達成 100% 最終資料同步與 99.9% 系統可用性。',
    tags: ['Python', 'Node.js', 'React', 'OPC UA', 'YOLO', 'PostgreSQL', 'Docker'],
    link: '/case-studies/solar-panel-recycling-system',
    linkLabel: '查看案例分析',
    accent: 'amber',
  },
  {
    id: 'digital-humanities',
    category: 'Digital Humanities',
    title: '數位人文展示平台',
    description: '為多個學術機構打造的數位人文展示平台，結合文史資料與互動視覺化（D3.js、Leaflet 地圖、時間軸、圖表）。它把文史資料轉化為可互動探索的研究佐證，讓學者能從地理、時間、統計等不同面向呈現論點，也以視覺化凸顯同一份資料的多重觀點。',
    tags: ['React', 'D3.js', 'Leaflet', 'SPARQL', 'Graph DB'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'literature-museum',
    category: 'Cultural Institution',
    title: '台灣文學館相關網站',
    description: '協助台灣文學館開發網站系統，涵蓋文學資料展示、資料視覺化、全文搜尋與後台管理。全文搜尋讓深藏的典藏變得可被發現，視覺化則降低了親近文學的門檻，一步步拉近民眾與文學的距離——也讓館藏從「被保存」走向「被使用」。',
    tags: ['React', 'Node.js', 'MySQL', 'CMS', '全文搜尋'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'notary-system',
    category: 'Information System',
    title: '代書資訊系統',
    description: '為地政士事務所打造的一站式業務管理平台，整合案件管理、零用金、統計分析、報表使用統計、員工權限、網站／公司設定與硬碟監控，把原本散落在各檔案的資料收斂到單一系統。建檔時間從約 60 分鐘縮短到 30 分鐘、案件查找從 10 分鐘壓到 1 分鐘以內——以每日新增 1 案、查找 5 案估算，等於每年替事務所省下逾 300 小時的行政工時。',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    link: '/case-studies/rock-system',
    linkLabel: '查看案例分析',
    accent: 'cyan',
  },
  {
    id: 'line-chatbot',
    category: 'Healthcare',
    title: '導入 LINE Chatbot 於母嬰照護之應用',
    description: '將 LINE chatbot 導入母嬰照護場景，自動化照護相關的資訊互動與服務流程，串接後端 API 與業務邏輯，提供更即時、可擴充的照護支援。',
    tags: ['Node.js', 'LINE API', 'Express', 'MySQL'],
    link: null,
    linkLabel: null,
    accent: 'amber',
  },
];

const projectsEn = [
  {
    id: 'solar-recycling',
    category: 'Industrial System',
    title: 'Solar Panel Recycling System',
    description: 'An edge-to-cloud industrial integration spanning 15+ repositories, weaving the IPC core program, PLC communication (OPC UA), SCADA monitoring, YOLO object recognition, and cloud APIs into a complete data loop from device floor to business cloud. A config-driven design lets one core program serve device versions 1.0 through 2.x — sparing the redundant work of maintaining a separate codebase per version — while levelled logs streamed to SCADA for live monitoring and filtering make engineers roughly 3x faster at pinpointing bugs. A version manager also cut IPC software deployment from an hour to 15 minutes, and real-time upload with scheduled retry delivered 100% eventual data-sync success and 99.9% system availability on unstable factory networks.',
    tags: ['Python', 'Node.js', 'React', 'OPC UA', 'YOLOv8', 'PostgreSQL', 'Docker'],
    link: '/case-studies/solar-panel-recycling-system',
    linkLabel: 'View Case Study',
    accent: 'amber',
  },
  {
    id: 'digital-humanities',
    category: 'Digital Humanities',
    title: 'Digital Humanities Platform',
    description: 'A digital-humanities showcase platform built for multiple academic institutions, combining historical and literary data with interactive visualisation (D3.js, Leaflet maps, timelines, charts). It turns raw historical data into interactive evidence for scholarly research, letting researchers argue across geographic, temporal, and statistical dimensions while surfacing the many facets within a single dataset.',
    tags: ['React', 'D3.js', 'Leaflet', 'SPARQL', 'Graph DB'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'literature-museum',
    category: 'Cultural Institution',
    title: 'Taiwan Literature Museum Website',
    description: 'Helped the National Museum of Taiwan Literature build web systems spanning literary-data display, data visualisation, full-text search, and back-office management. Full-text search makes long-buried collections discoverable, while visualisation lowers the barrier to engaging with literature — bringing the public closer to it and moving the archive from merely "preserved" toward actively "used".',
    tags: ['React', 'Node.js', 'MySQL', 'CMS', 'Full-text Search'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'notary-system',
    category: 'Information System',
    title: 'Notary Information System',
    description: 'A one-stop business management platform for land-administration (notary) firms — unifying case management, petty cash, statistics, report-usage analytics, staff permissions, site/company settings, and disk monitoring, consolidating data once scattered across files into a single system. Case filing dropped from ~60 to 30 minutes and lookups from 10 minutes to under one — which, at roughly one new case and five lookups a day, saves a firm 300+ admin hours a year.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    link: '/case-studies/rock-system',
    linkLabel: 'View Case Study',
    accent: 'cyan',
  },
  {
    id: 'line-chatbot',
    category: 'Healthcare',
    title: 'LINE Chatbot for Maternal & Infant Care',
    description: 'Introduced a LINE chatbot into a maternal-and-infant care context — automating care-related information exchange and service workflows, integrated with backend APIs and business logic for more responsive, scalable care support.',
    tags: ['Node.js', 'LINE API', 'Express', 'MySQL'],
    link: null,
    linkLabel: null,
    accent: 'amber',
  },
];

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <ProjectsContent locale={locale} />
    </div>
  );
}

function ProjectsContent({ locale }: { locale: string }) {
  const t = useTranslations('projects');
  const projects = locale === 'zh' ? projectsZh : projectsEn;

  return (
    <>
      <div className="mb-16 max-w-2xl">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
          {t('headline')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-6 flex flex-col hover:border-[var(--accent)] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-mono tracking-widest uppercase ${project.accent === 'amber' ? 'text-[var(--accent-2)]' : 'text-[var(--accent)]'}`}>
                {project.category}
              </span>
            </div>
            <h2 className="font-heading font-semibold text-base text-[var(--fg)] mb-2">
              {project.title}
            </h2>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed mb-4 flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
            {project.link && (
              <a href={project.link} className="text-xs font-mono text-[var(--accent)] hover:underline underline-offset-4 mt-auto">
                {project.linkLabel} →
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 py-6 border-t border-[var(--border)]">
        <p className="text-xs font-mono text-[var(--fg-subtle)]">// {t('coming_soon')}</p>
      </div>
    </>
  );
}
