import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

interface ActiveMember {
  name: string;
  phone: string;
  lastActive: string;
}

const ActiveMemberExtractor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ActiveMember[]>([]);
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleExtract = () => {
    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { name: 'Active Alice', phone: '+1112223331', lastActive: '1 day ago' },
        { name: 'Busy Bob', phone: '+1112223332', lastActive: '3 days ago' },
        { name: 'Chatty Charlie', phone: '+1112223333', lastActive: '6 days ago' },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.active_member_extractor.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.active_member_extractor.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Card className="md:col-span-1">
          <h3 className="text-xl font-semibold text-dark-text-primary">{t('common.settings')}</h3>
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="group-select" className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.active_member_extractor.group_label')}</label>
              <select id="group-select" className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`}>
                <option>Marketing Team</option>
                <option>Sales Q4 Campaign</option>
                <option>Product Feedback</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeframe-select" className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.active_member_extractor.timeframe_label')}</label>
              <select id="timeframe-select" className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`}>
                <option value="7">{t('tools.active_member_extractor.timeframe_7_days')}</option>
                <option value="30">{t('tools.active_member_extractor.timeframe_30_days')}</option>
                <option value="90">{t('tools.active_member_extractor.timeframe_90_days')}</option>
              </select>
            </div>
          </div>
          <Button onClick={handleExtract} disabled={isLoading} className="w-full mt-6" icon={<i className="fa-solid fa-user-clock"></i>}>
            {isLoading ? t('tools.active_member_extractor.extracting_button') : t('tools.active_member_extractor.extract_button')}
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
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.active_member_extractor.table_name')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.active_member_extractor.table_phone')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.active_member_extractor.table_last_active')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-dark-border hover:bg-white/5">
                      <td className="p-4 text-dark-text-primary">{result.name}</td>
                      <td className="p-4 text-dark-text-secondary font-mono">{result.phone}</td>
                      <td className="p-4 text-dark-text-secondary">{result.lastActive}</td>
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

export default ActiveMemberExtractor;
