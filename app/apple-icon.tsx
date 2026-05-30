import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon: same "❯_" mark scaled up for iOS home screen. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          backgroundColor: '#0D1117',
        }}
      >
        <div
          style={{
            width: '62px',
            height: '62px',
            borderTop: '16px solid #22D3EE',
            borderRight: '16px solid #22D3EE',
            transform: 'rotate(45deg)',
            marginLeft: '-12px',
          }}
        />
        <div
          style={{
            width: '40px',
            height: '16px',
            backgroundColor: '#22D3EE',
            alignSelf: 'flex-end',
            marginBottom: '46px',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
