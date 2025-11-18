import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-border bg-dark-card py-6 px-4 md:px-8">
      <div className="container mx-auto flex flex-col items-center justify-between text-center md:flex-row">
        <div className="mb-4 md:mb-0">
          <Link href="/">
            <Image
              src="/brand/logo-dark-bg.svg"
              alt="WhatzBoot Logo"
              width={120}
              height={30}
            />
          </Link>
        </div>
        <p className="text-sm text-dark-text-secondary">
          &copy; {currentYear} WhatzBoot. All rights reserved.
        </p>
        <div className="mt-4 flex space-x-4 md:mt-0">
          <a href="#" className="text-dark-text-secondary hover:text-whatsapp-green">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-dark-text-secondary hover:text-whatsapp-green">
            <i className="fab fa-github"></i>
          </a>
          <a href="#" className="text-dark-text-secondary hover:text-whatsapp-green">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
