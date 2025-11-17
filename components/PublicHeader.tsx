import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Button from './ui/Button';

const PublicHeader: React.FC = () => {
    const { t } = useLanguage();
    return (
        <header className="bg-dark-card/80 backdrop-blur-sm sticky top-0 z-40 border-b border-dark-border">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <i className="fa-brands fa-whatsapp text-3xl text-whatsapp-green"></i>
                    <h1 className="text-2xl font-bold text-white">
                        {t('whatzboot')}
                    </h1>
                </Link>
                <nav>
                    <Link to="/login">
                        <Button variant="secondary">
                            {t('home.public_header_login')}
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default PublicHeader;
