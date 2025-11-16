import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

interface SocialResult {
  name: string;
  profileUrl: string;
  phone: string;
}

const SocialMediaExtractor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SocialResult[]>([]);
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleScrape = () => {
    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { name: 'John Smith', profileUrl: 'https://facebook.com/john.smith', phone: '+15550001111' },
        { name: 'Maria Garcia', profileUrl: 'https://facebook.com/maria.garcia', phone: '+15550002222' },
        { name: 'Chen Wei', profileUrl: 'https://facebook.com/chen.wei', phone: '+15550003333' },
      ]);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.social_media_extractor.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.social_media_extractor.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Card className="md:col-span-1">
          <h3 className="text-xl font-semibold text-dark-text-primary">{t('common.settings')}</h3>
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="platform-select" className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.social_media_extractor.platform_label')}</label>
              <select id="platform-select" className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`}>
                <option>Facebook</option>
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>Twitter (X)</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.social_media_extractor.url_label')}</label>
              <input type="url" placeholder={t('tools.social_media_extractor.url_placeholder')} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} />
            </div>
          </div>
          <Button onClick={handleScrape} disabled={isLoading} className="w-full mt-6" icon={<i className="fa-solid fa-share-nodes"></i>}>
            {isLoading ? t('tools.social_media_extractor.scraping_button') : t('tools.social_media_extractor.scrape_button')}
          </Button>
        </Card>
        
        <Card className="md:col-span-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-dark-text-primary">{t('common.results')}</h3>
            {results.length > 0 && <Button variant="secondary" icon={<i className="fa-solid fa-file-csv"></i>}>{t('common.export_csv')}</Button>}
          </div>
          <div className="mt-4 overflow-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-whatsapp-green"></div>
                <p className="mt-4 text-dark-text-secondary">{t('common.loading')}</p>
              </div>
            ) : results.length > 0 ? (
              <table className={`w-full ${textAlignmentClass}`}>
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.social_media_extractor.table_name')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.social_media_extractor.table_profile_url')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.social_media_extractor.table_phone')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-dark-border hover:bg-white/5">
                      <td className="p-4 text-dark-text-primary">{result.name}</td>
                      <td className="p-4 text-dark-text-secondary truncate max-w-xs"><a href={result.profileUrl} className="hover:text-whatsapp-blue" target="_blank" rel="noopener noreferrer">{result.profileUrl}</a></td>
                      <td className="p-4 text-dark-text-secondary font-mono">{result.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-dark-text-secondary">
                <i className="fa-solid fa-table-list text-5xl"></i>
                <p className="mt-4">{t('common.results_placeholder')}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SocialMediaExtractor;
