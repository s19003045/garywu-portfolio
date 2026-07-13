import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import { ContentLink } from '@/components/analytics/ContentLink';
import { localeAlternates } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'lab' });
  return { title: t('eyebrow'), description: t('intro'), alternates: localeAlternates(locale, '/lab') };
}

type Status = 'live' | 'planning' | 'poc';

interface SideProject {
  id: string;
  status: Status;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  articleSlug?: string;
  repo?: string;
}

const projectsZh: SideProject[] = [
  {
    id: 'fhir-poc',
    status: 'poc',
    title: 'FHIR POC — 從 HIS 到 TW Core 的醫療資料交換全鏈驗證',
    description:
      '把「醫院既有 HIS 資料 → 符合衛福部 TW Core IG 1.0.0 的 FHIR 資源 → 標準 API 供應用查詢」整條鏈打穿的 POC：模擬 HIS（SQLite＋台灣在地假資料）、TypeScript ETL（LOINC／SNOMED／ATC 術語對應、$validate 12 種 profile 0 error）、HAPI FHIR Server 與 React 查詢介面。結合 14 年醫檢師經驗與軟體工程，系列文章記錄每個階段的取捨與踩坑。',
    tags: ['FHIR', 'TW Core IG', 'HAPI FHIR', 'HL7', 'LOINC', 'TypeScript', 'React', 'Docker'],
    articleSlug: 'fhir-poc-0-why',
  },
  {
    id: 'battle-viz',
    status: 'live',
    title: 'Battle Visualizer — 互動式歷史戰役視覺化',
    description:
      '一個將歷史戰役以「地圖 + 時間軸」重現的互動式播映平台：支援戰役列表、Leaflet 地圖層、時間軸播放與事件標記，把抽象的戰史轉化為可探索的教育體驗。戰役資料以 GeoJSON 儲存並透過 Zod schema 驗證。目前為 React MVP。',
    tags: ['React 19', 'TypeScript', 'Vite', 'Leaflet', 'TanStack Query', 'Tailwind CSS', 'Zod'],
    url: 'https://battle.deepwaterslife.com/',
  },
  {
    id: 'line-rag-bot',
    status: 'planning',
    title: 'LINE 客服 AI 機器人 × RAG × GitHub Issue 自動化',
    description:
      '用於客戶 LINE 群組的 AI 客服機器人：結合 RAG（檢索公司內部與專案知識）與 LLM 即時回覆。當客戶反映符合條件的問題（如系統異常）時，自動建立 GitHub Issue 列入追蹤，交由 RD 團隊接手；RD 更可透過 AI Agent 追蹤 issue，並基於對專案的理解快速提出解法參考。',
    tags: ['LLM', 'RAG', 'Chatbot', 'LINE API', 'GitHub API', 'AI Agent'],
  },
  {
    id: 'webrtc-poc-roadmap',
    status: 'poc',
    title: 'WebRTC POC Roadmap — 從 1:1 通話到 SFU 叢集',
    description:
      '一個分階段拆解 WebRTC 架構演進的技術實驗：從 1:1 P2P、Firestore signaling、多人成員 mesh、React + TypeScript 前端、Go signaling server，到 Pion SFU 與多節點 Router、Redis、JWT、Prometheus。這個專案很適合作為系列技術文章，逐篇記錄每個 phase 的限制、痛點、取捨與解法。',
    tags: ['WebRTC', 'P2P', 'SFU', 'Pion', 'Go', 'React', 'Redis', 'Prometheus'],
    articleSlug: 'webrtc-poc-1-signaling-presence',
    repo: 'https://github.com/s19003045/webrtc-poc',
  },
];

const projectsEn: SideProject[] = [
  {
    id: 'fhir-poc',
    status: 'poc',
    title: 'FHIR POC — End-to-End Healthcare Data Exchange, from HIS to TW Core',
    description:
      'A POC that drives the full chain: legacy HIS data → FHIR resources conformant to Taiwan’s TW Core IG 1.0.0 → standard APIs for client apps. It includes a simulated HIS (SQLite with realistic Taiwanese data), a TypeScript ETL (LOINC/SNOMED/ATC terminology mapping, 12 profiles passing $validate with 0 errors), a HAPI FHIR server, and a React viewer. Built on 14 years of medical-lab experience plus software engineering; the article series documents every trade-off and pitfall.',
    tags: ['FHIR', 'TW Core IG', 'HAPI FHIR', 'HL7', 'LOINC', 'TypeScript', 'React', 'Docker'],
    articleSlug: 'fhir-poc-0-why',
  },
  {
    id: 'battle-viz',
    status: 'live',
    title: 'Battle Visualizer — Interactive Historical Battle Visualization',
    description:
      'An interactive playback platform that replays historical battles on maps and timelines: battle lists, Leaflet map layers, timeline playback, and event markers — turning abstract military history into an explorable educational experience. Battle data is stored as GeoJSON and validated via Zod schemas. Currently a React MVP.',
    tags: ['React 19', 'TypeScript', 'Vite', 'Leaflet', 'TanStack Query', 'Tailwind CSS', 'Zod'],
    url: 'https://battle.deepwaterslife.com/',
  },
  {
    id: 'line-rag-bot',
    status: 'planning',
    title: 'LINE Customer-Support AI Bot × RAG × GitHub Issue Automation',
    description:
      'An AI support bot for client LINE groups: combining RAG (retrieving internal company & project knowledge) with an LLM for real-time replies. When a client reports a qualifying issue (e.g. a system anomaly), it auto-creates a GitHub Issue for tracking and hands off to the RD team — who can further use an AI agent to track the issue and propose solutions quickly based on project understanding.',
    tags: ['LLM', 'RAG', 'Chatbot', 'LINE API', 'GitHub API', 'AI Agent'],
  },
  {
    id: 'webrtc-poc-roadmap',
    status: 'poc',
    title: 'WebRTC POC Roadmap — From 1:1 Calls to an SFU Cluster',
    description:
      'A staged technical experiment that breaks down the evolution of WebRTC architecture: 1:1 P2P, Firestore signaling, multi-user mesh, a React + TypeScript client, a Go signaling server, then a Pion SFU with multi-node routing, Redis, JWT, and Prometheus. The project is designed as a strong technical-writing source, with each phase documenting constraints, pain points, trade-offs, and solutions.',
    tags: ['WebRTC', 'P2P', 'SFU', 'Pion', 'Go', 'React', 'Redis', 'Prometheus'],
    repo: 'https://github.com/s19003045/webrtc-poc',
  },
];

export default async function LabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <LabContent locale={locale} />
    </div>
  );
}

function LabContent({ locale }: { locale: string }) {
  const t = useTranslations('lab');
  const projects = locale === 'zh' ? projectsZh : projectsEn;

  const statusLabel: Record<Status, string> = {
    live: t('status_live'),
    planning: t('status_planning'),
    poc: t('status_poc'),
  };

  return (
    <>
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[var(--fg)] leading-tight mb-6">
          {t('headline')}
        </h1>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{t('intro')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="group bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-6 flex flex-col hover:border-[var(--accent)] transition-all duration-300"
          >
            <div className="mb-3">
              <StatusBadge status={p.status} label={statusLabel[p.status]} />
            </div>
            <h2 className="font-heading font-semibold text-base text-[var(--fg)] mb-2">{p.title}</h2>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed mb-4 flex-1">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-auto">
              {p.articleSlug && (
                <ContentLink
                  href={`/${locale}/blog/${p.articleSlug}`}
                  contentType="lab"
                  itemId={p.id}
                  itemName={p.title}
                  className="text-xs font-mono text-[var(--accent)] hover:underline underline-offset-4"
                >
                  {t('read_article')} →
                </ContentLink>
              )}
              {p.url && (
                <ContentLink
                  href={p.url}
                  contentType="lab"
                  itemId={p.id}
                  itemName={p.title}
                  className="text-xs font-mono text-[var(--accent)] hover:underline underline-offset-4"
                >
                  {t('visit')} ↗
                </ContentLink>
              )}
              {p.repo && (
                <ContentLink
                  href={p.repo}
                  contentType="lab"
                  itemId={p.id}
                  itemName={p.title}
                  className="text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {t('view_repo')} ↗
                </ContentLink>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 py-6 border-t border-[var(--border)]">
        <p className="text-xs font-mono text-[var(--fg-subtle)]">{`// ${t('coming_soon')}`}</p>
      </div>
    </>
  );
}

function StatusBadge({ status, label }: { status: Status; label: string }) {
  const styles: Record<Status, { dot: string; text: string }> = {
    live: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
    planning: { dot: 'bg-[var(--accent-2)]', text: 'text-[var(--accent-2)]' },
    poc: { dot: 'bg-[var(--accent)]', text: 'text-[var(--accent)]' },
  };
  const s = styles[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-mono tracking-widest uppercase">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'live' ? 'animate-pulse' : ''}`} aria-hidden="true" />
      <span className={s.text}>{label}</span>
    </span>
  );
}
