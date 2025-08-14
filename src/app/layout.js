// src/app/layout.js (Root layout)
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Swaras AI - Code with Legends',
  description:
    'AI-powered chat with coding legends Hitesh Choudhary and Piyush Garg',
};

const RootLayout = ({ children }) => {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className='scroll-smooth'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
      </head>
      <body className={`${inter.className} antialiased`}>
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
