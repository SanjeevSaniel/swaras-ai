// src/app/layout.js
import { ThemeProvider } from '@/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Zain, Raleway } from 'next/font/google';
import './globals.css';

// Raleway font for logo branding
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-raleway',
  display: 'swap',
});

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
    default: 'SwarAI - Intelligent AI Persona Chat',
    template: '%s | SwarAI',
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
  authors: [{ name: 'SwarAI Team' }],
  creator: 'SwarAI',
  publisher: 'SwarAI',
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
    siteName: 'SwarAI',
    title: 'Intelligent AI Persona Chat',
    description:
      'Your personal AI companion for meaningful conversations. Chat, learn, and get expert guidance from AI personas designed to help you grow.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intelligent AI Persona Chat',
    description:
      'Your personal AI companion for meaningful conversations. Chat, learn, and get expert guidance from AI personas designed to help you grow.',
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
    <ClerkProvider
      signInUrl='/login'
      signUpUrl='/signup'
      signInFallbackRedirectUrl='/chat'
      signUpFallbackRedirectUrl='/chat'>
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
          className={`${raleway.variable} ${zain.variable} ${inter.variable} font-sans antialiased`}>
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
