import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const HomePage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in-up">
        <h1 className="mb-4 text-5xl font-extrabold text-dark-text-primary md:text-6xl">
            The Future of <span className="text-whatsapp-green">WhatsApp Automation</span> is Here.
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-lg text-dark-text-secondary md:text-xl">
            WhatzBoot provides a comprehensive dashboard to automate messaging, manage groups, and engage contacts efficiently.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/login">
                <Button variant="primary" size="lg">Get Started for Free</Button>
            </Link>
        </div>
    </div>
  );
};

export default HomePage;
