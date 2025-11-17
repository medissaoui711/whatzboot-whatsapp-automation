import React, { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ALL_TOOLS } from '../data/tools.data';
import ToolCard from '../components/ui/ToolCard';

const Tools: React.FC = () => {
    const { t, dir } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTools = useMemo(() => {
        if (!searchTerm) {
            return ALL_TOOLS;
        }
        return ALL_TOOLS.filter(tool => 
            t(`tools.${tool.id}.title`).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, t]);

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-dark-text-primary">{t('tools_page.title')}</h2>
                <p className="mt-2 text-lg text-dark-text-secondary">{t('tools_page.subtitle')}</p>
                <div className="mt-6 mx-auto max-w-lg relative">
                     <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('tools_page.search_placeholder') as string}
                        className={`w-full p-3 ${dir === 'rtl' ? 'pr-12' : 'pl-12'} bg-dark-card border-2 border-dark-border rounded-full text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-whatsapp-green`}
                    />
                    <i className={`fa-solid fa-search text-dark-text-secondary absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-5' : 'left-5'}`}></i>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTools.map(tool => (
                    <ToolCard 
                        key={tool.id}
                        title={t(`tools.${tool.id}.title`)}
                        icon={tool.icon}
                        path={tool.path}
                        buttonText={t(`tools.${tool.id}.button`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Tools;