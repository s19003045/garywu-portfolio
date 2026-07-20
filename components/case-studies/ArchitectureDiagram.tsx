'use client';

import { useState } from 'react';
import { Tag } from '@/components/ui/Tag';

/**
 * Interactive architecture diagram for the solar-panel-recycling case study.
 * Three stacked layers (cloud / edge / device floor) of clickable nodes; the
 * detail panel below shows each node's role and Gary's contribution there.
 *
 * Facts mirror the MDX body — keep the two in sync when metrics change.
 * Rendered inside the case-study prose, hence `not-prose` on the root.
 */

type Locale = 'zh' | 'en';
type Layer = 'cloud' | 'edge' | 'floor';

interface ArchNode {
  id: string;
  label: string; // short mono chip label, English in both locales
  layer: Layer;
  owner: boolean; // true = primary author, false = integrated with
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  mine: Record<Locale, string[]>;
  tech: string[];
}

const NODES: ArchNode[] = [
  // ── cloud ──
  {
    id: 'cloud-apis',
    label: 'CLOUD APIs ×3',
    layer: 'cloud',
    owner: false,
    title: { zh: '3 個 Cloud APIs', en: '3 Cloud APIs' },
    summary: {
      zh: '雲端側的資料入口，接收設備端上傳的回收紀錄、製程時間戳與系統 log。',
      en: 'Cloud-side data entry points, receiving recycling records, process timestamps, and system logs uploaded from the edge.',
    },
    mine: {
      zh: [
        '設計 edge-to-cloud 同步機制：即時上傳＋失敗後定時排程重送雙軌',
        '在不穩定的工廠網路下達成 100% 最終資料同步、99.9% 系統可用性',
        '回收資料與 log 上雲後至少保存 5 年，支撐長期回查',
      ],
      en: [
        'Designed the edge-to-cloud sync: realtime upload + scheduled retry on failure',
        'Achieved 100% eventual data sync and 99.9% availability over unstable factory networks',
        'Recycling data and logs retained in the cloud for at least 5 years',
      ],
    },
    tech: ['REST APIs'],
  },
  {
    id: 'business',
    label: 'ORDER / PLANT',
    layer: 'cloud',
    owner: false,
    title: { zh: '訂單管理與廠務系統', en: 'Order & Plant Management' },
    summary: {
      zh: '雲端業務端——訂單管理與生產追蹤，是整條資料閉環的終點。',
      en: 'The cloud business end — order management and production tracking, the terminus of the data loop.',
    },
    mine: {
      zh: ['確保設備端資料完整、可靠地送達業務系統，形成完整的 edge-to-cloud 資料閉環'],
      en: ['Ensured device-side data arrives at business systems completely and reliably, closing the edge-to-cloud data loop'],
    },
    tech: [],
  },
  {
    id: 'ipfs',
    label: 'IPFS',
    layer: 'cloud',
    owner: false,
    title: { zh: 'IPFS 可驗證儲存', en: 'IPFS Verifiable Storage' },
    summary: {
      zh: '檔案的可驗證儲存層，讓回收紀錄具備可稽核性。',
      en: 'Verifiable file storage layer, making recycling records auditable.',
    },
    mine: {
      zh: ['整合 IPFS 至雲端儲存流程，支援回收紀錄的可驗證保存'],
      en: ['Integrated IPFS into the cloud storage flow for verifiable record keeping'],
    },
    tech: ['IPFS'],
  },
  // ── edge ──
  {
    id: 'ipc-main',
    label: 'IPC MAIN',
    layer: 'edge',
    owner: true,
    title: { zh: 'IPC 主程式（邊緣核心）', en: 'IPC Core Program (Edge Heart)' },
    summary: {
      zh: '整個系統的邊緣端核心，串起 PLC 通訊、AI 推論、影像擷取與雲端上傳。',
      en: 'The edge-side heart of the system, bridging PLC communication, AI inference, image capture, and cloud uploads.',
    },
    mine: {
      zh: [
        '設計並開發整套主程式架構',
        '串聯 PLC 通訊，即時讀取設備狀態與控制指令',
        '協調 5 個 edge modules 的工作流程',
        '整合 AI 推論結果到回收決策流程',
        'Config-driven 設計讓設備 1.0–2.x 共用同一套程式，減少約 75% 重複開發',
      ],
      en: [
        'Designed and built the entire core program architecture',
        'Bridged PLC communication for realtime device status and control commands',
        'Coordinated the workflows of 5 edge modules',
        'Integrated AI inference results into the recycling decision flow',
        'Config-driven design let device 1.0–2.x share one codebase, cutting duplicated work by ~75%',
      ],
    },
    tech: ['Python', 'OPC UA / PLC'],
  },
  {
    id: 'edge-modules',
    label: 'EDGE MODULES ×5',
    layer: 'edge',
    owner: false,
    title: { zh: '5 個 IPC Edge Modules', en: '5 IPC Edge Modules' },
    summary: {
      zh: '分工處理影像、辨識、資料處理等子任務的邊緣模組。',
      en: 'Edge modules handling sub-tasks such as imaging, recognition, and data processing.',
    },
    mine: {
      zh: ['由主程式統一協調模組間的工作流程與資料交換', '隨版本管理器受控部署，避免逐台人工安裝'],
      en: ['Coordinated inter-module workflows and data exchange from the core program', 'Deployed under the version manager instead of manual per-device installs'],
    },
    tech: ['Python'],
  },
  {
    id: 'ver-manager',
    label: 'VER. MANAGER',
    layer: 'edge',
    owner: true,
    title: { zh: 'IPC 軟體版本管理器', en: 'IPC Software Version Manager' },
    summary: {
      zh: '主程式、edge modules 與 AI 模型的受控部署工具。',
      en: 'Controlled deployment tooling for the core program, edge modules, and AI models.',
    },
    mine: {
      zh: [
        '導入 version manager，把整套軟體部署變成受控、可重複的流程',
        '單台設備部署時間從約 1 小時縮短到 15 分鐘',
        '大幅降低多版本、多站點並行更新時的人工操作錯誤',
      ],
      en: [
        'Introduced the version manager, turning deployment into a controlled, repeatable process',
        'Cut per-device deployment time from ~1 hour to 15 minutes',
        'Sharply reduced manual errors across multi-version, multi-site rollouts',
      ],
    },
    tech: [],
  },
  {
    id: 'ipc-db',
    label: 'LOCAL DB + DR',
    layer: 'edge',
    owner: true,
    title: { zh: 'IPC 資料庫與雲端異地備援', en: 'IPC Database & Cloud DR' },
    summary: {
      zh: '邊緣端資料落地，加上雲端異地備援（DR），對抗現場故障。',
      en: 'Edge-side data persistence plus cloud disaster recovery against on-site failures.',
    },
    mine: {
      zh: ['設計排程備份機制，定期將 IPC 資料庫備份上傳雲端', '備援週期（RPO）控制在 24 小時內'],
      en: ['Designed scheduled backups uploading the IPC database to the cloud', 'Kept the recovery point objective (RPO) within 24 hours'],
    },
    tech: ['PostgreSQL'],
  },
  // ── device floor ──
  {
    id: 'plc',
    label: 'PLC · OPC UA',
    layer: 'floor',
    owner: false,
    title: { zh: 'PLC 通訊（OPC UA）', en: 'PLC Communication (OPC UA)' },
    summary: {
      zh: '產線設備的控制核心，主程式透過 OPC UA 與其對話。',
      en: 'The control core of the production line; the IPC talks to it over OPC UA.',
    },
    mine: {
      zh: ['設計 OPC 通訊串接：設備狀態讀取、控制指令、連線狀態監測', '結構化 log 事件涵蓋 OPC 通訊與設備讀寫，通訊異常可追可查'],
      en: ['Designed the OPC integration: status reads, control commands, connection monitoring', 'Structured log events cover OPC communication and device I/O, making faults traceable'],
    },
    tech: ['OPC UA / PLC'],
  },
  {
    id: 'scada',
    label: 'SCADA',
    layer: 'floor',
    owner: false,
    title: { zh: 'SCADA 監控', en: 'SCADA Monitoring' },
    summary: {
      zh: '廠區級即時監控介面，掌握整體產線狀態。',
      en: 'Plant-level realtime monitoring of the whole production line.',
    },
    mine: {
      zh: [
        '重構整套 log 機制：764 呼叫點 / 6 等級 / 61 模組 / 52 事件，排程上拋雲端',
        '工程師直接在 SCADA 即時監測設備 log，免遠端登入翻找，除錯定位效率約提升 3 倍',
      ],
      en: [
        'Rebuilt the logging system: 764 call sites / 6 levels / 61 modules / 52 events, scheduled cloud upload',
        'Engineers monitor device logs directly in SCADA — no more remote logins — roughly 3x faster fault isolation',
      ],
    },
    tech: ['SCADA'],
  },
  {
    id: 'yolo',
    label: 'YOLO AI',
    layer: 'floor',
    owner: false,
    title: { zh: 'AI 物件辨識（YOLO）', en: 'AI Object Recognition (YOLO)' },
    summary: {
      zh: '板片辨識模型，推論跑在邊緣端。',
      en: 'Panel recognition model with inference running at the edge.',
    },
    mine: {
      zh: ['將 AI 推論結果整合進回收決策流程', 'AI 模型納入版本管理器統一部署'],
      en: ['Integrated AI inference results into the recycling decision flow', 'Brought AI models under the version manager for unified deployment'],
    },
    tech: ['YOLOv8 / v11', 'OpenCV'],
  },
  {
    id: 'stations',
    label: '7 STATIONS',
    layer: 'floor',
    owner: true,
    title: { zh: '7 站點製程追溯', en: '7-Station Process Traceability' },
    summary: {
      zh: '回收流程橫跨 7 個關鍵站點，每片板記錄 21 個製程時間戳。',
      en: 'The recycling flow spans 7 key stations, recording 21 process timestamps per panel.',
    },
    mine: {
      zh: ['設計廠區／設備／站點／單片四級追溯顆粒度', '任何一片板、任何一段製程，事後都能被精準回查與異常分析'],
      en: ['Designed four-level traceability: plant / device / station / panel', 'Any panel, any process segment can be precisely audited after the fact'],
    },
    tech: [],
  },
];

const LAYERS: { id: Layer; label: string }[] = [
  { id: 'cloud', label: '// cloud' },
  { id: 'edge', label: '// edge' },
  { id: 'floor', label: '// device floor' },
];

const UI = {
  zh: {
    legendOwner: '主責開發',
    legendIntegration: '整合串接',
    contribution: '// 我的貢獻',
    bus_cloud: 'REST APIs · 即時上傳＋排程重送',
    bus_floor: 'OPC UA · 設備狀態與控制',
    hint: '點擊節點查看細節',
  },
  en: {
    legendOwner: 'primary author',
    legendIntegration: 'integrated with',
    contribution: '// my contribution',
    bus_cloud: 'REST APIs · realtime upload + scheduled retry',
    bus_floor: 'OPC UA · device status & control',
    hint: 'click a node for details',
  },
} as const;

function BusDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4" aria-hidden="true">
      <div className="h-px flex-1 bg-[var(--border)]" />
      <span className="text-[10px] font-mono text-[var(--fg-subtle)] tracking-wide">↑ {label}</span>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}

export function ArchitectureDiagram({ locale }: { locale: string }) {
  const lang: Locale = locale === 'zh' ? 'zh' : 'en';
  const ui = UI[lang];
  const [selectedId, setSelectedId] = useState('ipc-main');
  const selected = NODES.find((n) => n.id === selectedId) ?? NODES[0];

  return (
    <div className="not-prose border border-[var(--border)] rounded-lg bg-[var(--bg-subtle)]/40 p-5 sm:p-6 my-8">
      {/* legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <span className="text-[10px] font-mono text-[var(--fg-subtle)]">{ui.hint} ↓</span>
        <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--fg-muted)]">
          <span><span className="text-[var(--accent-2)]" aria-hidden="true">●</span> {ui.legendOwner}</span>
          <span><span className="text-[var(--fg-subtle)]" aria-hidden="true">○</span> {ui.legendIntegration}</span>
        </div>
      </div>

      {/* layered nodes, data flows bottom → top */}
      {LAYERS.map((layer, i) => (
        <div key={layer.id}>
          {i > 0 && <BusDivider label={i === 1 ? ui.bus_cloud : ui.bus_floor} />}
          <p className="text-[10px] font-mono text-[var(--fg-subtle)] tracking-widest mb-2">{layer.label}</p>
          <div className="flex flex-wrap gap-2">
            {NODES.filter((n) => n.layer === layer.id).map((node) => {
              const active = node.id === selectedId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded border text-xs font-mono transition-colors ${
                    active
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)]'
                      : 'border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                >
                  <span className={node.owner ? 'text-[var(--accent-2)]' : 'text-[var(--fg-subtle)]'} aria-hidden="true">
                    {node.owner ? '●' : '○'}
                  </span>
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* detail panel */}
      <div className="border-t border-[var(--border)] mt-6 pt-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <h3 className="font-heading font-semibold text-base text-[var(--fg)]">{selected.title[lang]}</h3>
          <span className={`text-[10px] font-mono ${selected.owner ? 'text-[var(--accent-2)]' : 'text-[var(--fg-subtle)]'}`}>
            {selected.owner ? `● ${ui.legendOwner}` : `○ ${ui.legendIntegration}`}
          </span>
        </div>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">{selected.summary[lang]}</p>
        <p className="text-[10px] font-mono text-[var(--accent)] tracking-widest uppercase mb-2">{ui.contribution}</p>
        <ul className="space-y-1.5 mb-4">
          {selected.mine[lang].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-[var(--fg-muted)] leading-relaxed">
              <span className="text-[var(--accent)] opacity-60 flex-shrink-0" aria-hidden="true">·</span>
              {item}
            </li>
          ))}
        </ul>
        {selected.tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.tech.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
