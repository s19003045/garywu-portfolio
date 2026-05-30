/**
 * Tag taxonomy.
 *
 * Two kinds of tags across the site:
 *  - "tech"  — concrete technologies / tools / protocols (Python, SCADA, OPC UA…)
 *              → rendered neutral (grey outline).
 *  - "topic" — concepts, domains, themes (效能優化, AI協作, System Architecture…)
 *              → rendered with a cyan tint and a `#` prefix.
 *
 * Classification is allowlist-based: anything NOT in TECH_TAGS is treated as a
 * topic. To add a new technology, append its lowercased form below.
 */

const TECH_TAGS = new Set<string>([
  // Languages / runtimes
  'python', 'node.js', 'node', 'typescript', 'javascript',
  // Frontend
  'react', 'react.js', 'react 19', 'next.js', 'redux', 'd3.js',
  'electron', 'electron.js', 'material ui', 'tailwind css',
  'webpack / vite', 'vite', 'webpack',
  'leaflet', 'react-leaflet', 'tanstack query', 'react query', 'zod',
  // Backend / databases / headless CMS
  'express', 'mysql', 'postgresql', 'mongodb',
  'sparql (graph db)', 'sparql', 'strapi', 'firebase',
  // Frontend frameworks (admin / data)
  'refine', 'refine.dev',
  // Industrial / protocols
  'opc ua', 'opc ua / plc', 'plc', 'scada', 'ipc', 'modbus',
  // AI / computer vision / LLM
  'yolov8', 'yolov11', 'yolov8 / v11', 'yolov8 / yolov11',
  'opencv', 'openai api', 'google vision ai', 'ai agent',
  'llm', 'rag', 'chatbot', 'line api', 'github api',
  // Infra / devops
  'docker', 'nginx', 'pm2', 'linux', 'alpine linux', 'git', 'github',
  // Web3 / storage
  'ipfs', 'web3 / ipfs', 'web3',
  // Integrations / misc
  'line api', 'cms', 'sdd',
]);

function normalize(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, ' ');
}

export type TagKind = 'tech' | 'topic';

export function tagKind(tag: string): TagKind {
  return TECH_TAGS.has(normalize(tag)) ? 'tech' : 'topic';
}

export function isTechTag(tag: string): boolean {
  return tagKind(tag) === 'tech';
}
