import { ImageResponse } from 'next/og';

/**
 * Shared social-card renderer used by both `app/opengraph-image` and
 * `app/twitter-image`, so og:image and twitter:image stay identical and in
 * sync with the homepage hero.
 *
 * Latin-only: the default next/og font ships no CJK glyphs, so we mirror the
 * English hero copy (messages/en.json → home.eyebrow / headline_1 / headline_2)
 * rather than the Traditional Chinese headline.
 */

export const ogAlt =
  'Gary Wu — Senior Full-Stack Engineer · Industrial System Integration';
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

export function renderOgImage() {
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
          padding: '64px',
        }}
      >
        {/* Top: prompt mark + role (mirrors home.eyebrow) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#22D3EE', fontSize: 36, fontWeight: 700 }}>&gt;</span>
          <span
            style={{
              color: '#8B949E',
              fontSize: 21,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Senior Full-Stack Engineer · Industrial System Integration
          </span>
        </div>

        {/* Middle: homepage headline (home.headline_1 / headline_2).
            Sized so the longest line (~40 chars) stays on one line within the
            1072px content width — larger sizes wrap awkwardly in Satori. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#F0F6FC', fontSize: 46, fontWeight: 700, lineHeight: 1.12 }}>
            Between the Factory Floor and the Cloud
          </div>
          <div style={{ color: '#22D3EE', fontSize: 46, fontWeight: 700, lineHeight: 1.12 }}>
            Building Maintainable Integrated Systems
          </div>
        </div>

        {/* Bottom: name + domain */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ color: '#F0F6FC', fontSize: 34, fontWeight: 600 }}>Gary Wu</span>
          <span style={{ color: '#6E7781', fontSize: 22, fontFamily: 'monospace' }}>
            garywudev.deepwaterslife.com
          </span>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
