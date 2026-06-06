import { getTranslations } from 'next-intl/server';
import { PrintButton } from '@/components/resume/PrintButton';
import { DownloadLink } from '@/components/analytics/DownloadLink';
import { siteConfig } from '@/lib/site';
import { localeAlternates } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resume' });
  return { title: t('eyebrow'), description: t('headline'), alternates: localeAlternates(locale, '/resume') };
}

// ─── Bilingual résumé data ───────────────────────────────────

const data = {
  zh: {
    name: '吳振銜',
    latin: 'Gary Wu',
    title: 'Senior Full-Stack Engineer · Industrial System Integration Architect',
    summary:
      '具備 5 年以上經驗的資深全端工程師，專注工業系統整合與 edge-to-cloud 架構。擅長將設備端資料、監控流程、AI 推論與雲端業務系統，整合為穩定、可維護、可長期演進的數位系統。',
    labels: {
      profile: 'PROFILE', highlights: 'HIGHLIGHTS', skills: 'CORE SKILLS',
      experience: 'EXPERIENCE', cases: 'SELECTED CASE STUDIES',
      certs: 'CERTIFICATIONS', education: 'EDUCATION', present: '至今',
    },
    hint: '提示：在列印對話框選擇「另存為 PDF」，並關閉「頁首及頁尾」以獲得最佳效果。',
    highlights: [
      { v: '15+', l: 'repositories 整合', a: 'cyan' },
      { v: '3x', l: '除錯定位效率', a: 'amber' },
      { v: '4x', l: 'IPC 部署效率', a: 'amber' },
      { v: '100%', l: '最終資料同步', a: 'cyan' },
      { v: '5+', l: '年資深經驗', a: 'cyan' },
    ],
    skills: [
      { g: 'Frontend', items: 'React · Next.js · TypeScript · Redux · D3.js · Tailwind CSS · Electron' },
      { g: 'Backend & DB', items: 'Node.js · Python (FastAPI / Flask) · Strapi · PostgreSQL · MySQL · MongoDB' },
      { g: 'Industrial & Edge', items: 'OPC UA / PLC · SCADA · IPC · Edge Computing · IPFS' },
      { g: 'AI & Dev', items: 'YOLOv8 / v11 · OpenCV · OpenAI API · AI Agent · SDD' },
      { g: 'Security', items: 'ISO 27001:2022 ISMS · 內部稽核 · 風險評估' },
    ],
    experience: [
      {
        role: 'Senior Full-Stack Engineer',
        period: '2020.10 – 至今',
        bullets: [
          '主導橫跨 15+ repositories 的太陽能板回收系統，負責 IPC 主程式架構與 edge-to-cloud 跨系統整合，並深入掌握 90%+ repositories，能快速定位跨服務問題',
          '串聯 SCADA、PLC (OPC UA)、5 個 IPC edge modules、YOLO AI 模型、3 個 Cloud APIs 與 IPFS 可驗證儲存，形成設備到雲端的完整資料閉環',
          '導入 config-driven 設計支援設備版本 1.0–2.x，減少約 75% 重複開發；並以 version manager 將 IPC 軟體部署由 1 小時縮短至 15 分鐘',
          '重構設備端 log 為 764 個結構化呼叫點（6 等級／61 模組／52 事件）並排程上拋雲端、於 SCADA 即時監測篩選，使除錯定位效率約提升 3x',
          '設計即時上傳＋排程重送的 Edge-to-Cloud 同步，達成 100% 最終資料同步與 99.9% 系統可用性；另建立 24 小時 RPO 雲端異地備援',
          '建立橫跨 7 個關鍵站點、每片板 21 個製程時間戳的全流程追溯機制，回收資料與系統日誌雲端保存至少 5 年',
          '支援 AI 物件辨識模型從資料準備、訓練、部署到 IPC 整合的完整流程；並作為公司與設備商工程部主要技術窗口釐清跨組織需求',
          '另參與台灣文學館相關網站（10+ repositories）及多個數位人文展示平台，以 D3.js／Leaflet／時間軸／圖表呈現文史資料',
        ],
      },
      {
        role: 'Full-Stack Engineer（獨立接案）',
        period: '2024.10 – 至今',
        bullets: [
          '獨立開發代書資訊系統（Rock System）：以單一主責工程師完成需求、架構、前後端、權限與容器化部署的完整 SDLC',
          '整合案件管理、零用金、統計報表、權限與系統監控於單一平台，建檔與案件查找效率分別提升約 2x 與 10x；以環境變數驅動權限配置支援多客戶差異化規則',
        ],
      },
      {
        role: 'Full-Stack Engineer · LINE Chatbot Developer · IT Lecturer',
        period: '2020.07 – 2020.12',
        bullets: [
          '開發 LINE chatbot 自動化服務流程；擔任資訊技術講師進行技術課程教學；參與全端應用程式開發',
        ],
      },
      {
        role: 'Adjunct Assistant',
        period: '2020.08 – 2020.10',
        bullets: ['協助學術研究與技術支援工作'],
      },
    ],
    cases: [
      { t: '太陽能板回收系統 — Edge-to-Cloud 工業整合架構', d: '橫跨 15+ repositories；config-driven 減 75% 重複開發、log 可觀測化使除錯定位提速約 3x。', tags: 'Edge-to-Cloud · IPC · SCADA · OPC UA · Python' },
      { t: '代書資訊系統 Rock System — 0→1 全端業務平台', d: '單一主責工程師完成整個 SDLC，細粒度權限、席位控管、2FA 與容器化交付。', tags: 'React · Strapi · PostgreSQL · Docker' },
      { t: '舊系統低網速效能搶救', d: '定位真正瓶頸為客戶端網路環境，重構傳輸策略將前端請求數降至 1/5–1/4。', tags: '效能優化 · API設計 · AI協作' },
      { t: '展場 iPad 離線方案', d: '於 iPad 自建本地 API 伺服器，使影片播放完全不受展場低網速影響。', tags: 'Edge · Alpine Linux · Python · React' },
    ],
    certs: [
      { t: 'ISO 27001:2022 ISMS', d: '資訊安全管理制度導入、內部稽核、風險評估與處理。' },
    ],
    education: {
      school: '國立陽明大學 National Yang Ming University',
      period: '2001 – 2005',
      detail: '學士 · 醫事技術學系（Clinical Laboratory Science / Medical Technology）',
    },
  },
  en: {
    name: 'Gary Wu',
    latin: '吳振銜',
    title: 'Senior Full-Stack Engineer · Industrial System Integration Architect',
    summary:
      'Senior full-stack engineer with 5+ years specialising in industrial system integration and edge-to-cloud architecture. I integrate edge device data, monitoring workflows, AI inference, and cloud business systems into stable, maintainable, long-term-evolvable digital systems.',
    labels: {
      profile: 'PROFILE', highlights: 'HIGHLIGHTS', skills: 'CORE SKILLS',
      experience: 'EXPERIENCE', cases: 'SELECTED CASE STUDIES',
      certs: 'CERTIFICATIONS', education: 'EDUCATION', present: 'Present',
    },
    hint: 'Tip: in the print dialog choose "Save as PDF" and turn off "Headers and footers" for the best result.',
    highlights: [
      { v: '15+', l: 'repositories integrated', a: 'cyan' },
      { v: '3x', l: 'debug localisation', a: 'amber' },
      { v: '4x', l: 'faster deployment', a: 'amber' },
      { v: '100%', l: 'eventual data sync', a: 'cyan' },
      { v: '5+', l: 'years experience', a: 'cyan' },
    ],
    skills: [
      { g: 'Frontend', items: 'React · Next.js · TypeScript · Redux · D3.js · Tailwind CSS · Electron' },
      { g: 'Backend & DB', items: 'Node.js · Python (FastAPI / Flask) · Strapi · PostgreSQL · MySQL · MongoDB' },
      { g: 'Industrial & Edge', items: 'OPC UA / PLC · SCADA · IPC · Edge Computing · IPFS' },
      { g: 'AI & Dev', items: 'YOLOv8 / v11 · OpenCV · OpenAI API · AI Agent · SDD' },
      { g: 'Security', items: 'ISO 27001:2022 ISMS · Internal Audit · Risk Assessment' },
    ],
    experience: [
      {
        role: 'Senior Full-Stack Engineer',
        period: '2020.10 – Present',
        bullets: [
          'Led the solar panel recycling system across 15+ repositories — IPC core architecture and edge-to-cloud cross-system integration; mastered 90%+ of repositories for rapid cross-service diagnosis',
          'Connected SCADA, PLC (OPC UA), 5 IPC edge modules, YOLO AI, 3 Cloud APIs, and IPFS verifiable storage into a complete device-to-cloud data loop',
          'Introduced config-driven design for device versions 1.0–2.x, cutting redundant development ~75%; a version manager cut IPC software deployment from 1 hour to 15 minutes',
          'Rebuilt edge logging into 764 structured call sites (6 levels / 61 modules / 52 events), scheduled to the cloud and filtered live on SCADA — improving debug localisation ~3x',
          'Designed an Edge-to-Cloud sync (real-time upload + scheduled retry) achieving 100% eventual data-sync success and 99.9% availability; plus off-site cloud DR within 24h RPO',
          'Built end-to-end traceability across 7 key stations with 21 process timestamps per panel; recycling data and system logs retained in the cloud for at least 5 years',
          'Supported AI object recognition end-to-end — data preparation, training, deployment, and IPC integration; served as primary technical liaison with the equipment manufacturer',
          'Also contributed to National Museum of Taiwan Literature web systems (10+ repositories) and several digital-humanities platforms using D3.js / Leaflet / timelines / charts',
        ],
      },
      {
        role: 'Freelance Full-Stack Engineer',
        period: '2024.10 – Present',
        bullets: [
          'Built the Rock System (notary / land-administration platform) end-to-end as sole engineer — requirements, architecture, full-stack, permissions, and containerised delivery',
          'Unified case management, petty cash, reporting, permissions, and monitoring in one platform — ~2x faster filing and ~10x faster lookups; env-driven permissions support per-client rules',
        ],
      },
      {
        role: 'Full-Stack Engineer · LINE Chatbot Developer · IT Lecturer',
        period: '2020.07 – 2020.12',
        bullets: [
          'Built LINE chatbot automation; served as IT lecturer delivering technical courses; participated in full-stack development',
        ],
      },
      {
        role: 'Adjunct Assistant',
        period: '2020.08 – 2020.10',
        bullets: ['Assisted with academic research and technical support'],
      },
    ],

    cases: [
      { t: 'Solar Panel Recycling System — Edge-to-Cloud Industrial Integration', d: 'Spanning 15+ repositories; config-driven design cut dev redundancy ~75%, and log observability made debug localisation ~3x faster.', tags: 'Edge-to-Cloud · IPC · SCADA · OPC UA · Python' },
      { t: 'Rock System — Full-Stack Business Platform (0→1)', d: 'Sole engineer across the SDLC: fine-grained permissions, seat control, 2FA, and containerised delivery.', tags: 'React · Strapi · PostgreSQL · Docker' },
      { t: 'Legacy System Performance Rescue', d: 'Located the real bottleneck (client network) and refactored transfer to cut frontend requests to 1/5–1/4.', tags: 'Performance · API Design · AI Collaboration' },
      { t: 'Offline iPad Exhibition Setup', d: 'Self-hosted a local API on the iPad so video playback became fully independent of venue bandwidth.', tags: 'Edge · Alpine Linux · Python · React' },
    ],
    certs: [
      { t: 'ISO 27001:2022 ISMS', d: 'ISMS implementation, internal audit, risk assessment & treatment.' },
    ],
    education: {
      school: 'National Yang Ming University',
      period: '2001 – 2005',
      detail: "Bachelor's degree · Clinical Laboratory Science / Medical Technology",
    },
  },
} as const;

// ─── Page ────────────────────────────────────────────────────

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resume' });
  const d = locale === 'en' ? data.en : data.zh;
  const L = d.labels;
  const pdfHref = locale === 'en' ? '/resume.en.pdf' : '/resume.pdf';

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Controls (not printed) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-3">{t('eyebrow')}</p>
          <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-[var(--fg)] leading-tight">
            {t('headline')}
          </h1>
        </div>
        <div className="no-print flex items-center gap-3">
          <DownloadLink
            href={pdfHref}
            format={locale === 'en' ? 'en' : 'zh'}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--bg)] text-sm font-heading font-semibold rounded hover:opacity-90 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6l3 3 3-3M1 10v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('download')}
          </DownloadLink>
          <PrintButton label={t('print_button')} />
        </div>
      </div>
      <p className="no-print text-xs font-mono text-[var(--fg-subtle)] mb-8">// {d.hint}</p>

      {/* Résumé sheets (printed) */}
      <div className="resume-stage flex flex-col items-center gap-8">
        {/* ── PAGE 1 ── */}
        <article className="resume-sheet w-full max-w-[820px] bg-white text-neutral-900 rounded-lg shadow-xl border border-neutral-200 p-10">
          {/* Header (div, not <header> — print CSS hides the site <header>) */}
          <div className="flex items-start gap-6 pb-6 border-b border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/AI_Headshot_1779021790446.png"
              alt={d.name}
              className="w-24 h-24 rounded-lg object-cover object-[center_28%] border border-neutral-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-3xl text-neutral-900 leading-none mb-1">
                {d.name} <span className="text-neutral-400 text-xl font-normal">{d.latin}</span>
              </h2>
              <p className="text-[#0369A1] font-medium text-sm mb-3">{d.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-neutral-600">
                <span>{siteConfig.email}</span>
                <span className="text-neutral-300">·</span>
                <span>linkedin.com/in/chen-hsien-wu</span>
                <span className="text-neutral-300">·</span>
                <span>github.com/s19003045</span>
                <span className="text-neutral-300">·</span>
                <span>{siteConfig.domain}</span>
              </div>
            </div>
          </div>

          {/* Profile */}
          <Section label={L.profile} first>
            <p className="text-sm text-neutral-700 leading-relaxed">{d.summary}</p>
          </Section>

          {/* Highlights */}
          <Section label={L.highlights}>
            <div className="flex flex-wrap gap-3">
              {d.highlights.map((h) => (
                <div key={h.l} className="flex items-baseline gap-1.5">
                  <span className={`font-mono font-bold text-lg ${h.a === 'amber' ? 'text-[#B45309]' : 'text-[#0369A1]'}`}>{h.v}</span>
                  <span className="text-xs text-neutral-600">{h.l}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section label={L.skills}>
            <div className="space-y-2">
              {d.skills.map((s) => (
                <div key={s.g} className="flex flex-col sm:flex-row sm:gap-3">
                  <span className="font-mono font-semibold text-xs text-neutral-900 sm:w-36 flex-shrink-0">{s.g}</span>
                  <span className="text-xs text-neutral-600 font-mono">{s.items}</span>
                </div>
              ))}
            </div>
          </Section>

        </article>

        {/* ── PAGE 2 ── */}
        <article className="resume-sheet resume-break w-full max-w-[820px] bg-white text-neutral-900 rounded-lg shadow-xl border border-neutral-200 p-10">
          {/* Experience */}
          <Section label={L.experience} first>
            <div className="space-y-4">
              {d.experience.map((e) => (
                <div key={e.role} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
                    <h3 className="font-heading font-semibold text-sm text-neutral-900">{e.role}</h3>
                    <span className="font-mono text-xs text-neutral-500 flex-shrink-0">{e.period}</span>
                  </div>
                  <ul className="space-y-1">
                    {e.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-xs text-neutral-700 leading-relaxed">
                        <span className="text-[#0369A1] flex-shrink-0">▪</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </article>

        {/* ── PAGE 3 ── */}
        <article className="resume-sheet resume-break w-full max-w-[820px] bg-white text-neutral-900 rounded-lg shadow-xl border border-neutral-200 p-10">
          {/* Selected case studies */}
          <Section label={L.cases} first>
            <div className="space-y-4">
              {d.cases.map((c) => (
                <div key={c.t} className="break-inside-avoid">
                  <h3 className="font-heading font-semibold text-sm text-neutral-900 mb-1">{c.t}</h3>
                  <p className="text-xs text-neutral-700 leading-relaxed mb-1">{c.d}</p>
                  <p className="text-xs font-mono text-[#0369A1]">{c.tags}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Certifications */}
          <Section label={L.certs}>
            <div className="space-y-2">
              {d.certs.map((c) => (
                <div key={c.t}>
                  <h3 className="font-heading font-semibold text-sm text-neutral-900">{c.t}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Education */}
          <Section label={L.education}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
              <div>
                <h3 className="font-heading font-semibold text-sm text-neutral-900">{d.education.school}</h3>
                <p className="text-xs text-neutral-600">{d.education.detail}</p>
              </div>
              <span className="font-mono text-xs text-neutral-500 flex-shrink-0">{d.education.period}</span>
            </div>
          </Section>
        </article>
      </div>
    </div>
  );
}

function Section({ label, children, first }: { label: string; children: React.ReactNode; first?: boolean }) {
  return (
    <section className={first ? 'pt-6' : 'pt-5 mt-5 border-t border-neutral-100'}>
      <p className="text-[0.65rem] font-mono font-semibold tracking-[0.18em] text-[#0369A1] uppercase mb-3">
        {label}
      </p>
      {children}
    </section>
  );
}
