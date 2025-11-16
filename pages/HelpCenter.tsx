import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQItem } from '../types';
import Card from '../components/ui/Card';

const CategoryCard: React.FC<{ icon: React.ReactNode; title: string; path: string; }> = ({ icon, title, path }) => {
    const { dir } = useLanguage();
    return (
        <Link to={path} className="block bg-dark-card p-6 rounded-lg border border-dark-border hover:border-whatsapp-green hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="text-3xl text-whatsapp-green">{icon}</div>
                <h3 className="font-semibold text-dark-text-primary text-lg">{title}</h3>
                <i className={`fa-solid ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} text-dark-text-secondary ml-auto rtl:mr-auto`}></i>
            </div>
        </Link>
    )
};

const FAQAccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-dark-border">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-dark-text-primary hover:bg-white/5"
            >
                <span>{item.question}</span>
                <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-5 pt-0 text-dark-text-secondary leading-relaxed">
                    {item.answer}
                </div>
            </div>
        </div>
    )
};

const HelpCenter: React.FC = () => {
    const { t, dir } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const faqs: FAQItem[] = t('help_center.faqs');

    const filteredFaqs = useMemo(() => {
        if (!searchTerm) return faqs;
        return faqs.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, faqs]);

    const categories = [
        { id: 'getting_started', icon: <i className="fa-solid fa-flag"></i>, path: '/how-it-works' },
        { id: 'auto_responder', icon: <i className="fa-solid fa-robot"></i>, path: '/auto-responder' },
        { id: 'broadcasting', icon: <i className="fa-solid fa-bullhorn"></i>, path: '/broadcaster' },
        { id: 'groups', icon: <i className="fa-solid fa-users"></i>, path: '/group-manager' },
        { id: 'account_billing', icon: <i className="fa-solid fa-user-circle"></i>, path: '/settings/billing' },
        { id: 'tools', icon: <i className="fa-solid fa-wrench"></i>, path: '/dashboard' },
    ];
    
    return (
        <div>
            {/* Header Section */}
            <div className="text-center py-12 bg-dark-card rounded-lg border border-dark-border">
                 <i className="fa-solid fa-life-ring text-5xl text-whatsapp-green"></i>
                <h1 className="mt-4 text-4xl font-bold text-dark-text-primary">{t('help_center.title')}</h1>
                <p className="mt-2 text-lg text-dark-text-secondary max-w-2xl mx-auto">{t('help_center.subtitle')}</p>
                <div className="mt-8 mx-auto max-w-lg relative">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('help_center.search_placeholder')}
                        className={`w-full p-4 ${dir === 'rtl' ? 'pr-12' : 'pl-12'} bg-dark-input border-2 border-dark-border rounded-full text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-whatsapp-green`}
                    />
                    <i className={`fa-solid fa-search text-dark-text-secondary absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-5' : 'left-5'}`}></i>
                </div>
            </div>

            {/* Categories Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-dark-text-primary mb-6 text-center">{t('help_center.categories_title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {categories.map(cat => (
                       <CategoryCard 
                         key={cat.id} 
                         icon={cat.icon} 
                         title={t(`help_center.category_${cat.id}`)}
                         path={cat.path}
                        />
                   ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
                 <h2 className="text-2xl font-semibold text-dark-text-primary mb-6 text-center">{t('help_center.faq_title')}</h2>
                 <Card>
                    <div className="divide-y divide-dark-border">
                        {filteredFaqs.length > 0 ? (
                           filteredFaqs.map((faq, index) => <FAQAccordionItem key={index} item={faq} />)
                        ) : (
                            <p className="p-5 text-center text-dark-text-secondary">{t('common.no_results')}</p>
                        )}
                    </div>
                 </Card>
            </div>
        </div>
    );
};

export default HelpCenter;
