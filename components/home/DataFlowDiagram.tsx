/**
 * Hero data-flow diagram — an animated edge-to-cloud pipeline
 * (device floor → IPC → cloud) mirroring the industrial systems Gary builds.
 *
 * Pure SVG, no client JS: packets travel via SMIL <animateMotion>, status
 * LEDs pulse via the `.led` CSS keyframe (globals.css). SMIL ignores the
 * global reduced-motion animation kill switch, so `.flow-dot` is hidden
 * explicitly under `prefers-reduced-motion` in globals.css.
 *
 * Decorative only (aria-hidden at the call site); labels stay in English
 * mono for both locales, matching the site's terminal idiom.
 */

const box = {
  fill: 'var(--bg-subtle)',
  stroke: 'var(--border)',
  strokeWidth: 1.2,
  rx: 6,
} as const;

const label = {
  textAnchor: 'middle',
  fill: 'var(--fg-muted)',
  fontSize: 10,
} as const;

const layerLabel = {
  fill: 'var(--fg-subtle)',
  fontSize: 9,
  letterSpacing: '0.1em',
} as const;

const line = {
  fill: 'none',
  stroke: 'var(--border)',
  strokeWidth: 1.2,
} as const;

function FlowDot({
  path,
  dur,
  begin,
  color = 'var(--accent)',
}: {
  path: string;
  dur: string;
  begin: string;
  color?: string;
}) {
  return (
    <circle r="3" fill={color} className="flow-dot">
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} />
    </circle>
  );
}

// Elbow paths, drawn bottom-up so packets flow toward the cloud.
const FLOOR_TO_IPC = [
  'M 75 330 V 285 H 140 V 235',
  'M 200 330 V 235',
  'M 325 330 V 285 H 260 V 235',
];
const IPC_TO_CLOUD = [
  'M 140 185 V 130 H 75 V 74',
  'M 200 185 V 74',
  'M 260 185 V 130 H 325 V 74',
];

export function DataFlowDiagram() {
  return (
    <svg viewBox="0 0 400 404" className="w-full h-auto select-none font-mono" aria-hidden="true">
      {/* ── status readout ── */}
      <text x="380" y="24" textAnchor="end" fontSize={8} fill="var(--fg-subtle)">
        <tspan fill="var(--accent)" className="led">●</tspan>
        <tspan dx="4">uptime 99.9%</tspan>
      </text>

      {/* ── cloud layer ── */}
      <text x="20" y="24" {...layerLabel}>// cloud</text>
      <rect x="20" y="36" width="110" height="38" {...box} />
      <text x="75" y="59" {...label}>CLOUD API</text>
      <circle cx="120" cy="46" r="2.5" fill="var(--accent)" className="led" />
      <rect x="145" y="36" width="110" height="38" {...box} />
      <text x="200" y="59" {...label}>ORDER / PLANT</text>
      <circle cx="245" cy="46" r="2.5" fill="var(--accent)" className="led" />
      <rect x="270" y="36" width="110" height="38" {...box} />
      <text x="325" y="59" {...label}>IPFS</text>
      <circle cx="370" cy="46" r="2.5" fill="var(--accent)" className="led" />

      {/* ── sync bus: IPC → cloud ── */}
      {IPC_TO_CLOUD.map((d) => (
        <path key={d} d={d} {...line} />
      ))}
      <text x="208" y="118" fontSize={8} fill="var(--fg-subtle)">realtime + retry</text>

      {/* ── edge layer ── */}
      <text x="20" y="176" {...layerLabel}>// edge</text>
      <rect x="110" y="185" width="180" height="50" rx={6} fill="var(--bg-subtle)" stroke="var(--accent)" strokeOpacity={0.55} strokeWidth={1.2} />
      <text x="200" y="207" textAnchor="middle" fill="var(--fg)" fontSize={11} fontWeight={600}>IPC · MAIN</text>
      <text x="200" y="223" textAnchor="middle" fill="var(--fg-muted)" fontSize={8}>5 edge modules · ver.manager</text>
      <circle cx="280" cy="195" r="2.5" fill="var(--accent-2)" className="led" />

      {/* ── field bus: device floor → IPC ── */}
      {FLOOR_TO_IPC.map((d) => (
        <path key={d} d={d} {...line} />
      ))}
      <text x="208" y="300" fontSize={8} fill="var(--fg-subtle)">OPC UA</text>

      {/* ── device floor ── */}
      <rect x="20" y="330" width="110" height="38" {...box} />
      <text x="75" y="353" {...label}>PLC · OPC UA</text>
      <circle cx="120" cy="340" r="2.5" fill="var(--accent)" className="led" />
      <rect x="145" y="330" width="110" height="38" {...box} />
      <text x="200" y="353" {...label}>SCADA</text>
      <circle cx="245" cy="340" r="2.5" fill="var(--accent)" className="led" />
      <rect x="270" y="330" width="110" height="38" {...box} />
      <text x="325" y="353" {...label}>YOLO v11</text>
      <circle cx="370" cy="340" r="2.5" fill="var(--accent)" className="led" />
      <text x="20" y="394" {...layerLabel}>// device floor</text>

      {/* ── packets ── */}
      <FlowDot path={FLOOR_TO_IPC[0]} dur="3s" begin="0s" />
      <FlowDot path={FLOOR_TO_IPC[1]} dur="2.2s" begin="0.9s" />
      <FlowDot path={FLOOR_TO_IPC[2]} dur="3s" begin="1.7s" color="var(--accent-2)" />
      <FlowDot path={IPC_TO_CLOUD[0]} dur="3s" begin="0.5s" />
      <FlowDot path={IPC_TO_CLOUD[1]} dur="2.4s" begin="1.4s" />
      <FlowDot path={IPC_TO_CLOUD[2]} dur="3s" begin="2.3s" color="var(--accent-2)" />
    </svg>
  );
}
