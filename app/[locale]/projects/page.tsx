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
    description: '橫跨 15+ repositories 的 edge-to-cloud 工業整合架構，涵蓋 IPC 主程式、PLC 通訊、SCADA、AI 物件辨識與雲端 API 整合。',
    tags: ['Python', 'Node.js', 'React', 'OPC UA', 'YOLOv8', 'PostgreSQL', 'Docker'],
    link: '/case-studies/solar-panel-recycling-system',
    linkLabel: '查看案例分析',
    accent: 'amber',
  },
  {
    id: 'digital-humanities',
    category: 'Digital Humanities',
    title: '數位人文展示平台',
    description: '為學術機構建立的數位人文展示平台，結合文史資料、互動視覺化（D3.js）與多語系支援。',
    tags: ['React', 'D3.js', 'Node.js', 'SPARQL', 'Graph DB'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'literature-museum',
    category: 'Cultural Institution',
    title: '台灣文學館相關網站',
    description: '協助台灣文學館開發相關網站系統，處理文學資料展示、全文搜尋與後台管理功能。',
    tags: ['React', 'Node.js', 'MySQL', 'CMS'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'notary-system',
    category: 'Information System',
    title: '代書資訊系統',
    description: '為地政士設計的業務管理系統，涵蓋案件追蹤、文件管理與客戶資料管理，提升事務所工作效率。',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'line-chatbot',
    category: 'Automation',
    title: 'LINE Chatbot 自動化服務',
    description: '開發 LINE chatbot 系統，自動化處理客戶服務流程，整合後端 API 與業務邏輯，大幅降低人工作業量。',
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
    description: 'Edge-to-cloud industrial integration spanning 15+ repositories — IPC core program, PLC communication, SCADA, AI object recognition, and cloud API integration.',
    tags: ['Python', 'Node.js', 'React', 'OPC UA', 'YOLOv8', 'PostgreSQL', 'Docker'],
    link: '/case-studies/solar-panel-recycling-system',
    linkLabel: 'View Case Study',
    accent: 'amber',
  },
  {
    id: 'digital-humanities',
    category: 'Digital Humanities',
    title: 'Digital Humanities Platform',
    description: 'A digital humanities showcase platform for an academic institution, combining historical data, interactive D3.js visualisations, and multilingual support.',
    tags: ['React', 'D3.js', 'Node.js', 'SPARQL', 'Graph DB'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'literature-museum',
    category: 'Cultural Institution',
    title: 'Taiwan Literature Museum Website',
    description: 'Web systems for the National Museum of Taiwan Literature — literary data presentation, full-text search, and content management.',
    tags: ['React', 'Node.js', 'MySQL', 'CMS'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'notary-system',
    category: 'Information System',
    title: 'Notary Information System',
    description: 'Business management system for notaries — case tracking, document management, and client data, significantly improving office efficiency.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    link: null,
    linkLabel: null,
    accent: 'cyan',
  },
  {
    id: 'line-chatbot',
    category: 'Automation',
    title: 'LINE Chatbot Service',
    description: 'LINE chatbot automating customer service workflows with backend API integration and business logic, drastically reducing manual workload.',
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
