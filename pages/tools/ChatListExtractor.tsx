import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

interface ChatContact {
  name: string;
  phone: string;
  type: 'User' | 'Group';
}

const ChatListExtractor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ChatContact[]>([]);
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleExtract = () => {
    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { name: 'John Doe', phone: '+1234567890', type: 'User' },
        { name: 'Marketing Team', phone: 'group_id_1', type: 'Group' },
        { name: 'Jane Smith', phone: '+0987654321', type: 'User' },
        { name: 'Unsaved Contact', phone: '+1122334455', type: 'User' },
        { name: 'Project Alpha', phone: 'group_id_2', type: 'Group' },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.chat_list_extractor.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.chat_list_extractor.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Card className="md:col-span-1">
          <h3 className="text-xl font-semibold text-dark-text-primary">{t('common.settings')}</h3>
          <fieldset className="mt-4">
            <legend className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.chat_list_extractor.extract_from_label')}</legend>
            <div className={`mt-2 space-y-2 ${textAlignmentClass}`}>
              <div className="flex items-center">
                <input id="all-chats" name="extract-option" type="radio" defaultChecked className="h-4 w-4 text-whatsapp-green focus:ring-whatsapp-teal-green border-dark-border bg-dark-input" />
                <label htmlFor="all-chats" className="ms-3 block text-sm font-medium text-dark-text-primary">{t('tools.chat_list_extractor.option_all')}</label>
              </div>
              <div className="flex items-center">
                <input id="unsaved" name="extract-option" type="radio" className="h-4 w-4 text-whatsapp-green focus:ring-whatsapp-teal-green border-dark-border bg-dark-input" />
                <label htmlFor="unsaved" className="ms-3 block text-sm font-medium text-dark-text-primary">{t('tools.chat_list_extractor.option_unsaved')}</label>
              </div>
               <div className="flex items-center">
                <input id="groups" name="extract-option" type="radio" className="h-4 w-4 text-whatsapp-green focus:ring-whatsapp-teal-green border-dark-border bg-dark-input" />
                <label htmlFor="groups" className="ms-3 block text-sm font-medium text-dark-text-primary">{t('tools.chat_list_extractor.option_groups')}</label>
              </div>
            </div>
          </fieldset>
          <Button onClick={handleExtract} disabled={isLoading} className="w-full mt-6" icon={<i className="fa-solid fa-address-book"></i>}>
            {isLoading ? t('tools.chat_list_extractor.extracting_button') : t('tools.chat_list_extractor.extract_button')}
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
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.chat_list_extractor.table_name')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.chat_list_extractor.table_phone')}</th>
                    <th className="p-4 font-semibold text-dark-text-secondary">{t('tools.chat_list_extractor.table_type')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-dark-border hover:bg-white/5">
                      <td className="p-4 text-dark-text-primary">{result.name}</td>
                      <td className="p-4 text-dark-text-secondary font-mono">{result.phone}</td>
                      <td className="p-4 text-dark-text-secondary">
                        {result.type === 'User' ? t('tools.chat_list_extractor.type_user') : t('tools.chat_list_extractor.type_group')}
                      </td>
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

export default ChatListExtractor;
