import { ImageResponse } from 'next/og';

export const alt = 'Gary Wu — Senior Full-Stack Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0D1117',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(34,211,238,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          padding: '72px',
        }}
      >
        {/* Top: prompt mark + role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#22D3EE', fontSize: 40, fontWeight: 700 }}>&gt;</span>
          <span
            style={{
              color: '#8B949E',
              fontSize: 26,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Senior Full-Stack Engineer
          </span>
        </div>

        {/* Middle: name + headline (Latin only — default OG font lacks CJK glyphs) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ color: '#F0F6FC', fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
            AI × Industrial Systems
          </div>
          <div style={{ color: '#22D3EE', fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
            Turning Complexity into Advantage
          </div>
        </div>

        {/* Bottom: name + domain */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ color: '#F0F6FC', fontSize: 36, fontWeight: 600 }}>Gary Wu</span>
          <span style={{ color: '#6E7781', fontSize: 24, fontFamily: 'monospace' }}>
            garywudev.deepwaterslife.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
