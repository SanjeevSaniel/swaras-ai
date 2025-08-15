// src/app/layout.js - Enhanced with complete social media metadata
import { ThemeProvider } from '@/providers/theme-provider';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// App configuration
const APP_NAME = 'Swaras AI';
const APP_DESCRIPTION =
  'AI-powered coding mentorship with legendary Indian developers Hitesh Choudhary and Piyush Garg. Learn JavaScript, React, Node.js through personalized chat experiences.';
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://swaras-ai.vercel.app';
const APP_AUTHOR = 'Swaras AI Team';
const APP_KEYWORDS = [
  'AI coding mentor',
  'Hitesh Choudhary',
  'Piyush Garg',
  'JavaScript learning',
  'React tutorial',
  'Node.js guidance',
  'coding education',
  'programming mentor',
  'chai aur code',
  'Indian developers',
  'tech education',
  'MERN stack',
  'full stack development',
  'career guidance',
  'coding interview prep',
];

export const metadata = {
  // Basic metadata
  title: {
    default: `${APP_NAME} - Code with Legends`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS.join(', '),
  authors: [{ name: APP_AUTHOR }],
  creator: APP_AUTHOR,
  publisher: APP_AUTHOR,

  // App metadata
  applicationName: APP_NAME,
  category: 'education',
  classification: 'Educational Technology',

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph metadata for Facebook, LinkedIn, WhatsApp
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - AI-Powered Coding Mentorship`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/OG_Image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Learn coding with AI mentors Hitesh Choudhary and Piyush Garg`,
        type: 'image/png',
      },
      {
        url: `${APP_URL}/icon-512x512.png`,
        width: 1080,
        height: 1080,
        alt: `${APP_NAME} Square Logo`,
        type: 'image/png',
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    site: '@swarasai', // Your Twitter handle
    creator: '@swarasai',
    title: `${APP_NAME} - Code with Legends`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/OG_Image.png`],
  },

  // LinkedIn metadata (uses Open Graph)
  // WhatsApp metadata (uses Open Graph)

  // Apple metadata
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
    startupImage: [
      {
        url: `${APP_URL}/OG_Image.png`,
        media:
          '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: `${APP_URL}/images/apple-splash-1668-2388.png`,
        media:
          '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: `${APP_URL}/OG_Image.png`,
        media:
          '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: `${APP_URL}/OG_Image.png`,
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },

  // Favicon and icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#1f2937',
      },
    ],
  },

  // Microsoft metadata
  msApplication: {
    tileColor: '#1f2937',
    tileImage: '/OG_Image.png',
    config: '/browserconfig.xml',
  },

  // Theme color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],

  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
    ],
  },

  // // Verification tags (add your own)
  // verification: {
  //   google: 'your-google-site-verification',
  //   yandex: 'your-yandex-verification',
  //   yahoo: 'your-yahoo-verification',
  //   other: {
  //     'facebook-domain-verification': 'your-facebook-domain-verification',
  //   },
  // },

  // Additional metadata
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    HandheldFriendly: 'True',
    MobileOptimized: '320',
    'target-densitydpi': 'device-dpi',
    'theme-color': '#1f2937',
    'color-scheme': 'light dark',
  },

  // Alternate languages (if you plan to support multiple languages)
  alternates: {
    canonical: APP_URL,
    languages: {
      'en-US': APP_URL,
      'hi-IN': `${APP_URL}/hi`,
    },
  },

  // Category for app stores
  category: 'education',
};

const RootLayout = ({ children }) => {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className='scroll-smooth'>
      <head>
        {/* Additional meta tags */}
        <meta
          name='application-name'
          content={APP_NAME}
        />
        <meta
          name='apple-mobile-web-app-title'
          content={APP_NAME}
        />
        <meta
          name='format-detection'
          content='telephone=no'
        />
        <meta
          name='mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='apple-mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='default'
        />

        {/* Preconnect to external domains */}
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          rel='preconnect'
          href='https://api.openai.com'
        />

        {/* DNS prefetch */}
        <link
          rel='dns-prefetch'
          href='https://fonts.googleapis.com'
        />

        {/* Manifest file */}
        <link
          rel='manifest'
          href='/manifest.json'
        />

        {/* Browser configuration */}
        <meta
          name='msapplication-config'
          content='/browserconfig.xml'
        />

        {/* Schema.org structured data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: APP_NAME,
              description: APP_DESCRIPTION,
              url: APP_URL,
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: APP_AUTHOR,
              },
              about: {
                '@type': 'Thing',
                name: 'Programming Education',
                description: 'AI-powered coding mentorship and education',
              },
            }),
          }}
        />
      </head>
      <body className={`${manrope.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
