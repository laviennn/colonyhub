import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0B1230',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="128" height="128" viewBox="0 0 64 64">
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
      </div>
    ),
    { ...size },
  );
}
