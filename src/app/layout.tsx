import type { Metadata } from 'next';
import Script from 'next/script';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://friendsassociates.in';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Friends Associates Insurance | Insurance Services in Coimbatore',
    template: '%s | Friends Associates Insurance',
  },
  description:
    'Friends Associates offers car, bike, health, home, commercial, and life insurance support in Coimbatore with renewals, claims guidance, and trusted insurer options.',
  keywords: [
    'Friends Associates',
    'insurance services in Coimbatore',
    'car insurance Coimbatore',
    'bike insurance Coimbatore',
    'health insurance Coimbatore',
    'life insurance Coimbatore',
    'commercial vehicle insurance',
    'insurance renewal support',
  ],
  authors: [{ name: 'Friends Associates' }],
  creator: 'Friends Associates',
  publisher: 'Friends Associates',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Friends Associates Insurance',
    title: 'Friends Associates Insurance | Insurance Services in Coimbatore',
    description:
      'Local insurance support in Coimbatore for vehicles, health, life, home, and business coverage.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Friends Associates logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Friends Associates Insurance | Insurance Services in Coimbatore',
    description:
      'Car, bike, health, life, home, and commercial insurance support from Friends Associates in Coimbatore.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`}
        </Script>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#faf9f5',
              color: '#141413',
              border: '1px solid #f0eee6',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.95rem',
            },
          }}
        />
      </body>
    </html>
  );
}
