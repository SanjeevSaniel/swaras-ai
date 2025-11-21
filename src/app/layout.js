// src/app/layout.js
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/providers/theme-provider';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

// Professional font system with multiple weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: 'Swaras AI - Your AI Mentor Ecosystem',
  description:
    'Chat with specialized AI mentors across technology, business, health, and more. Get expert guidance tailored to your needs.',
  icons: {
    icon: '/favicon.ico',
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
            href='/favicon.ico'
            sizes='any'
          />
        </head>
        <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
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
