'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
        addToast({
            type: 'error',
            title: 'Registration Failed',
            message: 'Password must be at least 8 characters long.',
            position: 'top-right',
        });
        return;
    }
    setLoading(true);
    try {
      await authService.register({ email, password });
      addToast({
        type: 'success',
        title: 'Registration Successful',
        message: 'Please log in with your new account.',
        position: 'top-right',
      });
      router.push('/login');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        addToast({
            type: 'error',
            title: 'Registration Failed',
            message: errorMessage,
            position: 'top-right',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-sm animate-fade-in-up flex-col items-center rounded-lg border border-dark-border bg-dark-card p-8 shadow-lg">
      <Image
        src="/brand/logo-dark-bg.svg"
        alt="WhatzBoot Logo"
        width={180}
        height={40}
        className="mb-8"
      />
      <h1 className="mb-2 text-2xl font-bold text-dark-text-primary">
        Create Your Account
      </h1>
      <p className="mb-8 text-center text-dark-text-secondary">
        Start your automation journey with WhatzBoot today.
      </p>

      <form onSubmit={handleRegister} className="w-full">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-dark-text-secondary">Email</label>
          <input 
            type="email" 
            className="w-full rounded-md border border-dark-border bg-dark-input px-3 py-2 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
         <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-dark-text-secondary">Password</label>
          <input 
            type="password" 
            className="w-full rounded-md border border-dark-border bg-dark-input px-3 py-2 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          variant="primary"
          isLoading={loading}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-dark-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-whatsapp-green hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
