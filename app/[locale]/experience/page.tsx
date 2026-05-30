import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experience' });
  return { title: t('headline') };
}

const experienceZh = [
  {
    id: 'senior-fse',
    period: '2020/10 — 至今',
    role: 'Senior Full-Stack Engineer',
    company: '工業系統整合專案',
    type: 'Full-time',
    highlights: [
      '主導橫跨 15+ repositories 的太陽能板回收系統，負責 IPC 架構設計與 edge-to-cloud 跨系統整合',
      '串聯 SCADA、PLC（OPC UA）、5 個 IPC edge modules、YOLOv8 AI 模型、3 個 Cloud APIs 與 IPFS 可驗證儲存',
      '導入 config-driven 設計支援設備版本 1.0–2.x，減少約 75% 重複開發工作',
      '設計離線備份與排程同步機制，資料同步控制於 24 小時內，降低約 50% 現場排查時間',
      '掌握 90%+ 系統 repositories，能快速定位跨服務問題並評估影響範圍',
      '作為公司與設備商工程部主要技術窗口，長期參與週會並釐清跨組織需求',
      '支援 AI 物件辨識模型從資料準備、訓練到部署與 IPC 整合的完整流程',
    ],
    tags: ['Python', 'Node.js', 'React', 'OPC UA', 'SCADA', 'YOLOv8', 'PostgreSQL', 'Docker', 'IPFS'],
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

const experienceEn = [
  {
    id: 'senior-fse',
    period: '2020/10 — Present',
    role: 'Senior Full-Stack Engineer',
    company: 'Industrial System Integration Project',
    type: 'Full-time',
    highlights: [
      'Led solar panel recycling system spanning 15+ repositories, responsible for IPC architecture and edge-to-cloud cross-system integration',
      'Connected SCADA, PLC (OPC UA), 5 IPC edge modules, YOLOv8 AI, 3 Cloud APIs, and IPFS verifiable storage',
      'Config-driven design for device versions 1.0–2.x, reducing redundant development by ~75%',
      'Offline backup and scheduled sync mechanisms, data sync within 24h, troubleshooting time reduced ~50%',
      'Mastered 90%+ of system repositories for rapid cross-service diagnosis',
      'Primary technical interface between company and equipment manufacturer in weekly meetings',
      'Supported AI object recognition from data preparation, training, deployment through IPC integration',
    ],
    tags: ['Python', 'Node.js', 'React', 'OPC UA', 'SCADA', 'YOLOv8', 'PostgreSQL', 'Docker', 'IPFS'],
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
                <p className="text-xs font-mono text-[var(--fg-muted)] mb-5">{item.company}</p>
                <ul className="space-y-2.5 mb-5">
                  {item.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2 text-sm text-[var(--fg-muted)] leading-relaxed">
                      <span className="text-[var(--accent)] flex-shrink-0 font-mono text-xs mt-1">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
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
