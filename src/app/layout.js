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
  title: 'Swaras AI - Your AI Mentor Ecosystem',
  description:
    'Chat with specialized AI mentors across technology, business, health, and more. Get expert guidance tailored to your needs.',
  icons: {
    icon: '/favicon.svg',
  },
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
