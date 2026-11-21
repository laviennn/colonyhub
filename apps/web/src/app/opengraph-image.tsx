import { ImageResponse } from 'next/og';

export const alt = 'colonyhub: Integrated Creative & Technology Agency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0B1230',
          color: '#F6F4EE',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="56" height="56" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="21"
                fill="none"
                stroke="#8A94F2"
                strokeWidth="6"
                strokeDasharray="104 28"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="8" fill="#C6F432" />
              <circle cx="50" cy="20" r="4" fill="#F6F4EE" />
            </svg>
            <div style={{ display: 'flex', fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em' }}>
              <span>colony</span>
              <span style={{ color: '#8A94F2' }}>hub</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#C6F432',
              border: '1px solid rgba(138, 148, 242, 0.35)',
              padding: '8px 18px',
              borderRadius: 999,
            }}
          >
            colonyhub.id
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 920 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.035em' }}>
            Grow together. Move as one.
          </div>
          <div style={{ fontSize: 26, color: '#BFC3D9', lineHeight: 1.45 }}>
            Integrated digital agency: Strategy, Creative, Build, Growth, Social, and Data units working as one hub.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(138, 148, 242, 0.24)',
            paddingTop: 24,
            fontSize: 18,
            color: '#8A94F2',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span>Creative × Technology</span>
          <span>EN · ID</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
