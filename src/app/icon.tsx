import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Image generation
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
          background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
          borderRadius: '6px',
        }}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
          <circle cx="10" cy="16.5" r="1" fill="white" opacity="0.95" />
          <circle cx="12" cy="16.5" r="1" fill="white" opacity="0.95" />
          <circle cx="14" cy="16.5" r="1" fill="white" opacity="0.95" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
