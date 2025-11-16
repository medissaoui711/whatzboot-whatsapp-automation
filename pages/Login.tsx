import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from '../components/contexts/UserContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { setUser } = useUser();

  const handleLogin = () => {
    // In a real app, you'd fetch user data from an API
    setUser({
      id: '1',
      name: 'Admin User',
      email: 'admin@whatzboot.com',
      role: 'Admin', // Can be 'Admin', 'Marketer', or 'Agent'
      avatar: 'https://picsum.photos/100'
    });
    navigate('/dashboard');
  };

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-dark-card rounded-2xl shadow-lg border border-dark-border">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-white">
                <i className="fa-brands fa-whatsapp me-2 text-whatsapp-green"></i>
                {t('whatzboot')}
            </h1>
          <p className="mt-2 text-dark-text-secondary">{t('login.title')}</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="sr-only">{t('login.email_placeholder')}</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`relative block w-full px-3 py-3 bg-dark-input border border-dark-border placeholder-dark-text-secondary text-dark-text-primary rounded-md focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green focus:z-10 sm:text-sm ${textAlignmentClass}`}
                placeholder={t('login.email_placeholder')}
                defaultValue="admin@whatzboot.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('login.password_placeholder')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`relative block w-full px-3 py-3 bg-dark-input border border-dark-border placeholder-dark-text-secondary text-dark-text-primary rounded-md focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green focus:z-10 sm:text-sm ${textAlignmentClass}`}
                placeholder={t('login.password_placeholder')}
                defaultValue="password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-whatsapp-green focus:ring-whatsapp-teal-green border-dark-border rounded bg-dark-input" />
              <label htmlFor="remember-me" className="ms-2 block text-sm text-dark-text-primary">{t('login.remember_me')}</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-whatsapp-teal-green hover:text-whatsapp-green">{t('login.forgot_password')}</a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {t('login.signin_button')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;