import React from 'react';
import PublicHeader from '@/components/common/PublicHeader';
import Footer from '@/components/common/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
