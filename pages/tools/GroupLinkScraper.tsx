import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

const GroupLinkScraper: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleScrape = () => {
    if (!url.trim()) {
      alert("Please enter a website URL.");
      return;
    }
    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        'https://chat.whatsapp.com/INVITE_LINK_1',
        'https://chat.whatsapp.com/INVITE_LINK_2',
        'https://chat.whatsapp.com/INVITE_LINK_3',
        'https://chat.whatsapp.com/INVITE_LINK_4',
      ]);
      setIsLoading(false);
    }, 2500);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(results.join('\n'));
    alert('Links copied to clipboard!');
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.group_link_scraper.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.group_link_scraper.subtitle')}</p>

      <Card className="mt-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full flex-grow">
                <label htmlFor="url-input" className="sr-only">{t('tools.group_link_scraper.url_label')}</label>
                <input 
                    id="url-input"
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={t('tools.group_link_scraper.url_placeholder')} 
                    className={`block w-full px-4 py-3 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} 
                />
            </div>
            <Button onClick={handleScrape} disabled={isLoading} className="w-full md:w-auto !py-3" icon={<i className="fa-solid fa-link"></i>}>
                {isLoading ? t('tools.group_link_scraper.scraping_button') : t('tools.group_link_scraper.scrape_button')}
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
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.group_link_scraper.results_title')} ({results.length})</h3>
                    <Button variant="secondary" onClick={handleCopy} icon={<i className="fa-solid fa-copy"></i>}>{t('tools.group_link_scraper.copy_button')}</Button>
                </div>
                <textarea
                    readOnly
                    value={results.join('\n')}
                    rows={12}
                    className={`w-full p-3 bg-dark-input border border-dark-border rounded-lg font-mono text-dark-text-primary ${textAlignmentClass}`}
                />
            </Card>
          ) : (
            <Card>
                <div className="flex flex-col items-center justify-center h-64 text-center text-dark-text-secondary">
                    <i className="fa-solid fa-file-lines text-5xl"></i>
                    <p className="mt-4">{t('common.results_placeholder')}</p>
                </div>
            </Card>
          )}
      </div>
    </div>
  );
};

export default GroupLinkScraper;
