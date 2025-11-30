import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'SwarAI - Intelligent AI Persona Chat';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #FA8072, #FF8E8E)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="150" cy="150" r="140" fill="white" fillOpacity="0.2" />
            <path
              d="M150 50C130 50 110 60 100 75C90 70 80 75 80 90C70 95 65 105 65 115C65 130 75 140 90 140C90 160 100 175 115 185"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeOpacity="0.95"
            />
            <path
              d="M150 50C170 50 190 60 200 75C210 70 220 75 220 90C230 95 235 105 235 115C235 130 225 140 210 140C210 160 200 175 185 185"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeOpacity="0.95"
            />
            <path
              d="M110 195H190C200 195 210 205 210 215V245C210 255 200 265 190 265H170L150 285L130 265H110C100 265 90 255 90 245V215C90 205 100 195 110 195Z"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.95"
            />
            <circle cx="130" cy="230" r="6" fill="white" fillOpacity="0.95" />
            <circle cx="150" cy="230" r="6" fill="white" fillOpacity="0.95" />
            <circle cx="170" cy="230" r="6" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            marginBottom: 20,
            fontFamily: 'sans-serif',
          }}
        >
          SwarAI
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'sans-serif',
          }}
        >
          Learn with AI Mentors
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
