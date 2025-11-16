import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

const EmailExtractor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleExtract = () => {
    if (!text.trim()) {
        alert("Please paste some text to extract emails from.");
        return;
    }
    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
      const foundEmails = text.match(emailRegex) || [];
      const uniqueEmails = [...new Set(foundEmails)];
      setResults(uniqueEmails);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(results.join('\n'));
    alert('Emails copied to clipboard!');
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.email_extractor.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.email_extractor.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
            <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.email_extractor.text_label')}</h3>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={15}
                className={`w-full mt-4 p-3 bg-dark-input border border-dark-border rounded-lg font-mono text-dark-text-primary placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
                placeholder={t('tools.email_extractor.text_placeholder')}
            ></textarea>
            <Button onClick={handleExtract} disabled={isLoading} className="w-full mt-4" icon={<i className="fa-solid fa-envelope-open-text"></i>}>
                {isLoading ? t('tools.email_extractor.extracting_button') : t('tools.email_extractor.extract_button')}
            </Button>
        </Card>
        <Card>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.email_extractor.results_title')}</h3>
                {results.length > 0 && <Button variant="secondary" onClick={handleCopy} icon={<i className="fa-solid fa-copy"></i>}>{t('tools.email_extractor.copy_button')}</Button>}
            </div>
             <div className="mt-4 overflow-auto">
                {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-whatsapp-green"></div>
                    <p className="mt-4 text-dark-text-secondary">{t('common.loading')}</p>
                </div>
                ) : results.length > 0 ? (
                    <textarea
                        readOnly
                        value={results.join('\n')}
                        rows={16}
                        className={`w-full p-3 bg-dark-input border border-dark-border rounded-lg font-mono text-dark-text-primary ${textAlignmentClass}`}
                    />
                ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-dark-text-secondary">
                    <i className="fa-solid fa-at text-5xl"></i>
                    <p className="mt-4">{t('common.results_placeholder')}</p>
                </div>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailExtractor;
