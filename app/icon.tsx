import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Favicon: terminal prompt "❯" + blinking-cursor block, in brand cyan
 * on the dark background. Chevron is drawn with CSS borders (no font
 * dependency) so it renders reliably at small sizes.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          backgroundColor: '#0D1117',
          borderRadius: '7px',
        }}
      >
        {/* Chevron ❯ — top+right borders rotated 45° */}
        <div
          style={{
            width: '11px',
            height: '11px',
            borderTop: '3px solid #22D3EE',
            borderRight: '3px solid #22D3EE',
            transform: 'rotate(45deg)',
            marginLeft: '-2px',
          }}
        />
        {/* Cursor block */}
        <div
          style={{
            width: '7px',
            height: '3px',
            backgroundColor: '#22D3EE',
            alignSelf: 'flex-end',
            marginBottom: '7px',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
