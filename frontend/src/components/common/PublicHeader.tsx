import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const PublicHeader = () => {
  return (
    <header className="w-full border-b border-dark-border bg-dark-card px-4 md:px-8">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/">
          <Image
            src="/brand/logo-dark-bg.svg"
            alt="WhatzBoot Logo"
            width={150}
            height={40}
            priority
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>
           <Link href="/login">
            <Button variant="primary">Sign Up Free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
