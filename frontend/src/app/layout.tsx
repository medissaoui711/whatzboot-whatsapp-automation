// Fix: Import React to resolve the 'React.ReactNode' type which was causing a compilation error.
import React from 'react';
import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import AppProviders from './providers';
import '../styles/globals.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'WhatzBoot - WhatsApp Automation',
  description: 'The Future of WhatsApp Automation is Here.',
  icons: {
    icon: '/brand/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  // Fix: Removed the Readonly<> utility type which can sometimes cause issues with type inference for props.
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${tajawal.variable} bg-dark-bg font-sans text-dark-text-primary`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}