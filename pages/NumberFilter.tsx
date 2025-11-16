import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';

const NumberFilter: React.FC = () => {
  const [numbers, setNumbers] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [results, setResults] = useState<{ active: number; inactive: number } | null>(null);
  const { t, dir } = useLanguage();

  const handleFilter = () => {
    if (!numbers) {
        alert("Please paste some numbers to filter.");
        return;
    }
    setIsFiltering(true);
    setResults(null);
    setTimeout(() => {
        const lines = numbers.split('\n').filter(line => line.trim() !== '').length;
        const active = Math.floor(Math.random() * lines);
        const inactive = lines - active;
        setResults({ active, inactive });
        setIsFiltering(false);
    }, 2000);
  };
  
  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('number_filter.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('number_filter.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
            <h3 className="text-xl font-semibold text-dark-text-primary">{t('number_filter.input_title')}</h3>
            <p className="text-sm text-dark-text-secondary mt-1">{t('number_filter.input_subtitle')}</p>
            <textarea
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                rows={12}
                className={`w-full mt-4 p-3 bg-dark-input border border-dark-border rounded-lg font-mono text-dark-text-primary placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
                placeholder={t('number_filter.input_placeholder')}
            ></textarea>
            <Button onClick={handleFilter} disabled={isFiltering} className="w-full mt-4" icon={<i className="fa-solid fa-filter"></i>}>
                {isFiltering ? t('number_filter.filtering_button') : t('number_filter.start_button')}
            </Button>
        </Card>
        <Card>
            <h3 className="text-xl font-semibold text-dark-text-primary">{t('number_filter.results_title')}</h3>
            {isFiltering && (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-whatsapp-green"></div>
                    <p className="mt-4 text-dark-text-secondary">{t('number_filter.analyzing')}</p>
                </div>
            )}
            {results && (
                <div className="space-y-6 mt-6">
                    <div className="flex items-center p-4 bg-green-900/20 rounded-lg">
                        <i className="fa-solid fa-circle-check text-3xl text-green-500"></i>
                        <div className="ms-4">
                            <p className="font-semibold text-dark-text-primary">{t('number_filter.active_numbers')}</p>
                            <p className="text-2xl font-bold text-green-400">{results.active}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-red-900/20 rounded-lg">
                        <i className="fa-solid fa-circle-xmark text-3xl text-red-500"></i>
                        <div className="ms-4">
                            <p className="font-semibold text-dark-text-primary">{t('number_filter.inactive_numbers')}</p>
                            <p className="text-2xl font-bold text-red-400">{results.inactive}</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="w-full" icon={<i className="fa-solid fa-download"></i>}>{t('number_filter.download_button')}</Button>
                </div>
            )}
            {!isFiltering && !results && (
                <div className="flex flex-col items-center justify-center h-full text-center text-dark-text-secondary">
                    <i className="fa-solid fa-chart-pie text-5xl"></i>
                    <p className="mt-4">{t('number_filter.results_placeholder')}</p>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default NumberFilter;