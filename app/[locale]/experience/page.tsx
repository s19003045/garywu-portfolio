import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experience' });
  return { title: t('headline') };
}

interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  type: string;
  summary?: string;
  /** Flat bullet list (used when a role doesn't need project grouping). */
  highlights?: string[];
  /** Grouped contributions — each group is one project / domain. */
  groups?: { label: string; items: string[] }[];
  tags: string[];
}

const experienceZh: ExperienceItem[] = [
  {
    id: 'senior-fse',
    period: '2020/10 — 至今',
    role: 'Senior Full-Stack Engineer',
    company: '工業系統整合 · 數位人文 · 文化機構專案',
    type: 'Full-time',
    summary:
      '5 年間橫跨工業系統整合、數位人文與文化機構等多種場景——從 IPC 邊緣端到雲端、從互動視覺化到全文搜尋，負責架構設計、跨系統整合與全端開發。',
    groups: [
      {
        label: '太陽能板回收系統 · Edge-to-Cloud 工業整合',
        items: [
          '主導橫跨 15+ repositories 的系統，負責 IPC 架構設計與 edge-to-cloud 跨系統整合',
          '串聯 SCADA、PLC（OPC UA）、5 個 IPC edge modules、YOLO AI 模型、3 個 Cloud APIs 與 IPFS 可驗證儲存',
          '導入 config-driven 設計支援設備版本 1.0–2.x，減少約 75% 重複開發工作',
          '重構設備端 log 為 764 個結構化呼叫點（6 等級／61 模組／52 事件），排程上拋雲端並於 SCADA 即時監測，使除錯定位效率約提升 3x（耗時縮短約 2/3）；另建立 24 小時 RPO 雲端異地備援',
          '導入 version manager 將 IPC 軟體部署由 1 小時縮短至 15 分鐘；以即時上傳＋排程重送的 Edge-to-Cloud 同步達成 100% 最終資料同步與 99.9% 系統可用性',
          '建立橫跨 7 個關鍵站點、每片板 21 個製程時間戳的追溯機制，所有回收資料與系統日誌上雲並保存至少 5 年',
          '支援 AI 物件辨識模型從資料準備、訓練到部署與 IPC 整合的完整流程',
          '作為公司與設備商工程部主要技術窗口釐清跨組織需求，並深入掌握 90%+ 系統 repositories，能快速定位跨服務問題',
        ],
      },
      {
        label: '數位人文與文化機構',
        items: [
          '參與台灣文學館相關網站系統開發（橫跨 10+ repositories），涵蓋文學資料展示、資料視覺化、全文搜尋與後台管理',
          '為多個學術機構打造數位人文展示平台，以 D3.js／Leaflet／時間軸／圖表呈現文史資料的多重面向，作為學者研究佐證',
        ],
      },
    ],
    tags: ['Python', 'Node.js', 'React', 'TypeScript', 'D3.js', 'Leaflet', 'OPC UA', 'SCADA', 'YOLO', 'PostgreSQL', 'Docker', 'IPFS'],
  },
  {
    id: 'freelance-rock',
    period: '2024/10 — 至今',
    role: 'Full-Stack Engineer（獨立接案）',
    company: '獨立接案 / Freelance',
    type: 'Freelance',
    summary: '與正職並行，獨立承接並交付可實際營運的商業系統。',
    highlights: [
      '獨立開發代書資訊系統（Rock System）：以單一主責工程師完成需求、架構、前後端、權限與容器化部署的完整 SDLC',
      '整合案件管理、零用金、統計報表、員工權限與系統監控於單一平台，將建檔與案件查找效率分別提升約 2 倍與 10 倍',
      '以環境變數驅動的權限配置，讓不同客戶在同一套系統套用不同規則；並以 Docker Compose 容器化交付',
    ],
    tags: ['React', 'Strapi', 'PostgreSQL', 'Docker', 'TypeScript'],
  },
  {
    id: 'fse-lecturer',
    period: '2020/07 — 2020/12',
    role: 'Full-Stack Engineer / LINE Chatbot Developer / IT Lecturer',
    company: '多元兼職',
    type: 'Part-time',
    highlights: [
      '開發 LINE chatbot 自動化服務流程',
      '擔任資訊技術講師，進行技術課程教學',
      '參與全端應用程式開發',
    ],
    tags: ['Node.js', 'LINE API', 'React', '教學'],
  },
  {
    id: 'adjunct',
    period: '2020/08 — 2020/10',
    role: 'Adjunct Assistant',
    company: '學術機構',
    type: 'Part-time',
    highlights: ['協助學術研究與技術支援工作'],
    tags: [],
  },
];

const experienceEn: ExperienceItem[] = [
  {
    id: 'senior-fse',
    period: '2020/10 — Present',
    role: 'Senior Full-Stack Engineer',
    company: 'Industrial Integration · Digital Humanities · Cultural Institutions',
    type: 'Full-time',
    summary:
      'Across five years spanning industrial system integration, digital humanities, and cultural institutions — from IPC edge to cloud, from interactive visualisation to full-text search — owning architecture, cross-system integration, and full-stack development.',
    groups: [
      {
        label: 'Solar Panel Recycling System · Edge-to-Cloud Integration',
        items: [
          'Led the system across 15+ repositories — IPC architecture and edge-to-cloud cross-system integration',
          'Connected SCADA, PLC (OPC UA), 5 IPC edge modules, YOLO AI, 3 Cloud APIs, and IPFS verifiable storage',
          'Config-driven design for device versions 1.0–2.x, reducing redundant development by ~75%',
          'Rebuilt edge logging into 764 structured call sites (6 levels / 61 modules / 52 events), scheduled to the cloud and monitored live on SCADA — improving debug localisation ~3x (≈⅔ less time); off-site cloud DR within 24h RPO',
          'Introduced a version manager cutting IPC software deployment from 1 hour to 15 minutes; an Edge-to-Cloud sync (real-time upload + scheduled retry) achieved 100% eventual data-sync success and 99.9% system availability',
          'Built traceability across 7 key stations with 21 process timestamps per panel, with all recycling data and system logs synced to the cloud and retained for at least 5 years',
          'Supported AI object recognition end-to-end — data preparation, training, deployment — and its IPC integration',
          'Primary technical liaison with the equipment manufacturer; mastered 90%+ of system repositories for rapid cross-service diagnosis',
        ],
      },
      {
        label: 'Digital Humanities & Cultural Institutions',
        items: [
          'Contributed to the National Museum of Taiwan Literature web systems (spanning 10+ repositories): literary-data display, visualisation, full-text search, and back-office management',
          'Built digital-humanities showcase platforms for multiple academic institutions, presenting historical data via D3.js / Leaflet / timelines / charts as scholarly evidence',
        ],
      },
    ],
    tags: ['Python', 'Node.js', 'React', 'TypeScript', 'D3.js', 'Leaflet', 'OPC UA', 'SCADA', 'YOLO', 'PostgreSQL', 'Docker', 'IPFS'],
  },
  {
    id: 'freelance-rock',
    period: '2024/10 — Present',
    role: 'Freelance Full-Stack Engineer',
    company: 'Independent / Freelance',
    type: 'Freelance',
    summary: 'Alongside my full-time role, independently delivering production-ready commercial systems.',
    highlights: [
      'Independently built the Rock System (notary information platform): sole engineer across the full SDLC — requirements, architecture, frontend/backend, permissions, and containerised deployment',
      'Unified case management, petty cash, statistical reports, staff permissions, and system monitoring into one platform; case filing ~2x faster and lookups ~10x faster',
      'Env-driven permission configuration lets different clients apply different rules on one core system; delivered via Docker Compose',
    ],
    tags: ['React', 'Strapi', 'PostgreSQL', 'Docker', 'TypeScript'],
  },
  {
    id: 'fse-lecturer',
    period: '2020/07 — 2020/12',
    role: 'Full-Stack Engineer / LINE Chatbot Developer / IT Lecturer',
    company: 'Multiple Part-time Roles',
    type: 'Part-time',
    highlights: [
      'Developed LINE chatbot automated service workflows',
      'Delivered technical curriculum as IT Lecturer',
      'Participated in full-stack application development',
    ],
    tags: ['Node.js', 'LINE API', 'React', 'Teaching'],
  },
  {
    id: 'adjunct',
    period: '2020/08 — 2020/10',
    role: 'Adjunct Assistant',
    company: 'Academic Institution',
    type: 'Part-time',
    highlights: ['Assisted with academic research and technical support'],
    tags: [],
  },
];

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <ExperienceContent locale={locale} />
    </div>
  );
}

function ExperienceContent({ locale }: { locale: string }) {
  const t = useTranslations('experience');
  const items = locale === 'zh' ? experienceZh : experienceEn;

  return (
    <>
      <div className="mb-16">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight">
          {t('headline')}
        </h1>
      </div>

      <div className="relative">
        <div className="absolute left-0 sm:left-36 top-0 bottom-0 w-px bg-[var(--border)]" />

        <div className="space-y-16">
          {items.map((item) => (
            <div key={item.id} className="relative flex flex-col sm:flex-row gap-6">
              <div className="sm:w-36 flex-shrink-0 pt-1">
                <time className="text-xs font-mono text-[var(--fg-muted)] leading-relaxed">
                  {item.period}
                </time>
              </div>

              <div className="hidden sm:block absolute left-36 top-1.5 w-2 h-2 rounded-full bg-[var(--accent)] -translate-x-1/2 ring-2 ring-[var(--bg)]" />

              <div className="flex-1 pl-0 sm:pl-8">
                <div className="mb-2">
                  <span className="text-xs font-mono text-[var(--fg-subtle)] border border-[var(--border)] px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
                <h2 className="font-heading font-semibold text-xl sm:text-2xl text-[var(--fg)] mb-1">
                  {item.role}
                </h2>
                <p className="text-xs font-mono text-[var(--fg-muted)] mb-3">{item.company}</p>
                {item.summary && (
                  <p className="text-sm text-[var(--fg)] leading-relaxed mb-4 border-l-2 border-[var(--accent)] pl-3">
                    {item.summary}
                  </p>
                )}
                {item.groups ? (
                  <div className="space-y-5 mb-5">
                    {item.groups.map((g) => (
                      <div key={g.label}>
                        <p className="text-xs font-mono font-semibold text-[var(--accent)] tracking-wide mb-2.5">
                          {g.label}
                        </p>
                        <ul className="space-y-2.5">
                          {g.items.map((h, j) => (
                            <li key={j} className="flex gap-2 text-sm text-[var(--fg-muted)] leading-relaxed">
                              <span className="text-[var(--accent)] flex-shrink-0 font-mono text-xs mt-1">✓</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2.5 mb-5">
                    {(item.highlights ?? []).map((h, j) => (
                      <li key={j} className="flex gap-2 text-sm text-[var(--fg-muted)] leading-relaxed">
                        <span className="text-[var(--accent)] flex-shrink-0 font-mono text-xs mt-1">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
