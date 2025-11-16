import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

interface MapResult {
  name: string;
  phone: string;
  address: string;
  rating: number;
}

const GoogleMapsExtractor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MapResult[]>([]);
  const { t, dir } = useLanguage();
  
  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleExtract = () => {
    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { name: 'The Pizza Place', phone: '+1-555-123-4567', address: '123 Main St, Anytown', rating: 4.5 },
        { name: 'Burger Joint', phone: '+1-555-987-6543', address: '456 Oak Ave, Anytown', rating: 4.8 },
        { name: 'Taco Town', phone: '+1-555-321-7654', address: '789 Pine Ln, Anytown', rating: 4.2 },
        { name: 'Sushi Spot', phone: '+1-555-555-5555', address: '101 Maple Rd, Anytown', rating: 4.9 },
      ]);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.google_maps_extractor.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.google_maps_extractor.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Card className="md:col-span-1">
          <h3 className="text-xl font-semibold text-dark-text-primary">{t('common.settings')}</h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.google_maps_extractor.keyword_label')}</label>
              <input type="text" placeholder={t('tools.google_maps_extractor.keyword_placeholder')} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.google_maps_extractor.location_label')}</label>
              <input type="text" placeholder={t('tools.google_maps_extractor.location_placeholder')} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} />
            </div>
          </div>
          <Button onClick={handleExtract} disabled={isLoading} className="w-full mt-6" icon={<i className="fa-solid fa-magnifying-glass-location"></i>}>
            {isLoading ? t('tools.google_maps_extractor.extracting_button') : t('tools.google_maps_extractor.extract_button')}
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
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.google_maps_extractor.table_business_name')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.google_maps_extractor.table_phone')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.google_maps_extractor.table_address')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.google_maps_extractor.table_rating')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-dark-border hover:bg-white/5">
                      <td className="p-4 text-dark-text-primary">{result.name}</td>
                      <td className="p-4 text-dark-text-secondary font-mono">{result.phone}</td>
                      <td className="p-4 text-dark-text-secondary">{result.address}</td>
                      <td className="p-4 text-yellow-400 font-semibold">{result.rating} <i className="fa-solid fa-star text-xs"></i></td>
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

export default GoogleMapsExtractor;
