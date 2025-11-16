import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

interface GroupResult {
  name: string;
  source: string;
  link: string;
}

const GroupFinder: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GroupResult[]>([]);
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleFind = () => {
    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { name: 'Global Marketing Pros', source: 'group-listing.com', link: '#' },
        { name: 'Crypto Traders Hub', source: 'findgroups.net', link: '#' },
        { name: 'Real Estate Investors', source: 'group-listing.com', link: '#' },
        { name: 'Startup Founders Network', source: 'join-a-group.io', link: '#' },
      ]);
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.group_finder.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.group_finder.subtitle')}</p>

      <Card className="mt-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full flex-grow">
                <label htmlFor="keyword-input" className="sr-only">{t('tools.group_finder.keyword_label')}</label>
                <input 
                    id="keyword-input"
                    type="text" 
                    placeholder={t('tools.group_finder.keyword_placeholder')} 
                    className={`block w-full px-4 py-3 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} 
                />
            </div>
            <Button onClick={handleFind} disabled={isLoading} className="w-full md:w-auto !py-3" icon={<i className="fa-solid fa-search"></i>}>
                {isLoading ? t('tools.group_finder.finding_button') : t('tools.group_finder.find_button')}
            </Button>
        </div>
      </Card>
      
      <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-whatsapp-green"></div>
              <p className="mt-4 text-dark-text-secondary">{t('common.loading')}</p>
            </div>
          ) : results.length > 0 ? (
            <Card>
                <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('common.results')}</h3>
                <table className={`w-full ${textAlignmentClass}`}>
                    <thead className="bg-white/5">
                    <tr>
                        <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.group_finder.table_group_name')}</th>
                        <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.group_finder.table_source')}</th>
                        <th className="p-4 font-semibold text-dark-text-secondary">{t('common.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((result, index) => (
                        <tr key={index} className="border-b border-dark-border hover:bg-white/5">
                        <td className="p-4 text-dark-text-primary font-semibold">{result.name}</td>
                        <td className="p-4 text-dark-text-secondary">{result.source}</td>
                        <td className="p-4">
                            <a href={result.link} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="sm" icon={<i className="fa-solid fa-arrow-right-to-bracket"></i>}>{t('tools.group_finder.join_button')}</Button>
                            </a>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
          ) : (
             <Card>
                <div className="flex flex-col items-center justify-center h-64 text-center text-dark-text-secondary">
                    <i className="fa-solid fa-magnifying-glass text-5xl"></i>
                    <p className="mt-4">{t('common.no_results')}</p>
                </div>
             </Card>
          )}
      </div>
    </div>
  );
};

export default GroupFinder;
