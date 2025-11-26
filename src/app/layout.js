// src/app/layout.js
import { ThemeProvider } from '@/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Zain } from 'next/font/google';
import './globals.css';

// Zain font for modern, elegant typography
const zain = Zain({
  subsets: ['latin'],
  weight: ['200', '300', '400', '700', '800', '900'],
  variable: '--font-zain',
  display: 'swap',
});

// Inter as fallback
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  title: {
    default: 'Swaras AI - Intelligent AI Persona Chat',
    template: '%s | Swaras AI',
  },
  description:
    'Your personal AI companion for meaningful conversations. Chat, learn, and get expert guidance from AI personas designed to help you grow.',
  keywords: [
    'AI mentorship',
    'AI personas',
    'Hitesh Choudhary AI',
    'MKBHD AI',
    'Samantha Ruth Prabhu AI',
    'coding mentor',
    'tech learning',
    'AI chat',
    'personalized learning',
    'expert guidance',
    'free AI mentor',
    'GPT-4',
    'UX design mentor',
    'mythology learning',
    'wellness AI',
    'storytelling AI',
  ],
  authors: [{ name: 'Swaras AI Team' }],
  creator: 'Swaras AI',
  publisher: 'Swaras AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Swaras AI',
    title: 'Intelligent AI Persona Chat',
    description:
      'Your personal AI companion for meaningful conversations. Chat, learn, and get expert guidance from AI personas designed to help you grow.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swaras AI - Learn from AI versions of real experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intelligent AI Persona Chat',
    description:
      'Your personal AI companion for meaningful conversations. Chat, learn, and get expert guidance from AI personas designed to help you grow.',
    images: ['/og-image.png'],
    creator: '@swarasai',
  },
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
  alternates: {
    canonical: '/',
  },
  category: 'technology',
};

const RootLayout = ({ children }) => {
  return (
    <ClerkProvider>
      <html
        lang='en'
        suppressHydrationWarning
        className='scroll-smooth'>
        <head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1'
          />
          <link
            rel='icon'
            href='/favicon.svg'
            type='image/svg+xml'
          />
        </head>
        <body
          className={`${zain.variable} ${inter.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange={false}>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
