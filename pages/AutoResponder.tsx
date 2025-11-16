import React, { useState, useEffect, useMemo } from 'react';
import { AutoResponderBot } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { generateSmartReply } from '../services/geminiService';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/contexts/ToastContext';
import { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import ConfirmationModal from '../components/ui/ConfirmationModal';

// FIX: Export initialBots to be used in other components like GlobalSearchModal.
export const initialBots: AutoResponderBot[] = [
  { id: '1', name: 'Welcome Bot', trigger: 'hello, hi', response: 'Welcome to our service! How can I help you?', status: 'active', lastTriggered: '2 hours ago' },
  { id: '2', name: 'Support Hours Bot', trigger: 'hours, support time', response: 'Our support hours are 9 AM to 5 PM, Mon-Fri.', status: 'active', lastTriggered: '1 day ago' },
  { id: '3', name: 'Pricing Bot', trigger: 'price, pricing', response: 'You can find our pricing details at ourwebsite.com/pricing.', status: 'inactive', lastTriggered: '1 week ago' },
];

const ITEMS_PER_PAGE = 10;

const AutoResponder: React.FC = () => {
  const [bots, setBots] = useState<AutoResponderBot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBotData, setNewBotData] = useState({ name: '', trigger: '', response: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState<string | null>(null);

  const { t, dir } = useLanguage();
  const { addToast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simulate fetching data
        setBots(initialBots);
        setIsLoading(false);
    }, 1000);
  }, []);
  
  const filteredBots = useMemo(() => {
    return bots.filter(bot =>
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.trigger.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bots, searchTerm]);

  const totalPages = Math.ceil(filteredBots.length / ITEMS_PER_PAGE);

  const paginatedBots = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBots.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBots, currentPage]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewBotData(prev => ({ ...prev, [id]: value }));
    if(errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newBotData.name.trim()) newErrors.name = t('validation.required');
    if (!newBotData.trigger.trim()) newErrors.trigger = t('validation.required');
    if (!newBotData.response.trim()) newErrors.response = t('validation.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateReply = async () => {
    if (!newBotData.trigger) {
      addToast(t('validation.enter_trigger'), { type: 'error' });
      return;
    }
    setIsGenerating(true);
    try {
        const reply = await generateSmartReply(newBotData.trigger);
        setNewBotData(prev => ({ ...prev, response: reply }));
        addToast(t('notifications.reply_generated'), { type: 'success' });
    } catch (error) {
        addToast(t('notifications.reply_failed'), { type: 'error' });
    }
    setIsGenerating(false);
  };

  const handleSaveBot = () => {
    if (!validateForm()) {
      addToast(t('notifications.form_submission_error'), { type: 'error' });
      return;
    }
    // Logic to save the new bot
    addToast(t('notifications.bot_saved'), { type: 'success' });
    setIsModalOpen(false);
    setNewBotData({ name: '', trigger: '', response: '' });
    setErrors({});
  };

  const handleDeleteClick = (botId: string) => {
    setBotToDelete(botId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (botToDelete) {
      setBots(bots.filter(b => b.id !== botToDelete));
      addToast(t('notifications.bot_deleted'), { type: 'error' });
    }
    setIsConfirmModalOpen(false);
    setBotToDelete(null);
  };


  const openModal = () => {
    setNewBotData({ name: '', trigger: '', response: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const renderContent = () => {
    if (isLoading) {
      return <SkeletonTable rows={3} cols={5} />;
    }
    if (bots.length === 0) {
      return (
        <EmptyState
          icon={<i className="fa-solid fa-robot"></i>}
          title={t('empty_states.no_bots_title')}
          message={t('empty_states.no_bots_message')}
          action={<Button onClick={openModal} icon={<i className="fa-solid fa-plus"></i>}>{t('auto_responder.create_new')}</Button>}
        />
      );
    }
    if (paginatedBots.length === 0 && searchTerm) {
        return (
            <EmptyState
              icon={<i className="fa-solid fa-search"></i>}
              title={t('empty_states.no_results_title')}
              message={t('empty_states.no_results_message')}
            />
        );
    }
    return (
       <table className={`w-full ${textAlignmentClass}`}>
          <thead className="bg-white/5">
            <tr>
              <th className="p-4 font-semibold text-dark-text-secondary">{t('auto_responder.table_name')}</th>
              <th className="p-4 font-semibold text-dark-text-secondary">{t('auto_responder.table_keywords')}</th>
              <th className="p-4 font-semibold text-dark-text-secondary">{t('auto_responder.table_status')}</th>
              <th className="p-4 font-semibold text-dark-text-secondary">{t('auto_responder.table_last_triggered')}</th>
              <th className="p-4 font-semibold text-dark-text-secondary">{t('auto_responder.table_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBots.map((bot) => (
              <tr key={bot.id} className="border-b border-dark-border hover:bg-white/5">
                <td className="p-4 text-dark-text-primary">{bot.name}</td>
                <td className="p-4 text-dark-text-secondary font-mono text-sm">{bot.trigger}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${bot.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {t(`auto_responder.status_${bot.status}`)}
                  </span>
                </td>
                <td className="p-4 text-dark-text-secondary">{bot.lastTriggered}</td>
                <td className="p-4">
                  <button className="text-dark-text-secondary hover:text-whatsapp-green me-4"><i className="fa-solid fa-pencil"></i></button>
                  <button onClick={() => handleDeleteClick(bot.id)} className="text-dark-text-secondary hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-semibold text-dark-text-primary">{t('auto_responder.title')}</h2>
            <p className="mt-2 text-dark-text-secondary">{t('auto_responder.subtitle')}</p>
        </div>
        <Button onClick={openModal} icon={<i className="fa-solid fa-plus"></i>}>
            {t('auto_responder.create_new')}
        </Button>
      </div>

      <Card className="mt-8">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`${t('common.search')}...`}
            className="w-full sm:w-72 p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary"
          />
        </div>
        {renderContent()}
      </Card>

      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('confirmation.title')}
        message={t('confirmation.delete_message')}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <Card className="w-full max-w-lg">
            <h3 className="text-2xl font-semibold mb-4 text-dark-text-primary">{t('auto_responder.modal_title')}</h3>
            <div className="space-y-4">
                <div>
                    <input id="name" type="text" value={newBotData.name} onChange={handleInputChange} placeholder={t('auto_responder.modal_name_placeholder')} className={`w-full p-2 bg-dark-input border ${errors.name ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`}/>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                 <div>
                    <input id="trigger" type="text" value={newBotData.trigger} onChange={handleInputChange} placeholder={t('auto_responder.modal_trigger_placeholder')} className={`w-full p-2 bg-dark-input border ${errors.trigger ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`}/>
                    {errors.trigger && <p className="text-red-500 text-sm mt-1">{errors.trigger}</p>}
                </div>
                <div className="relative">
                     <div>
                        <textarea id="response" value={newBotData.response} onChange={handleInputChange} placeholder={t('auto_responder.modal_response_placeholder')} rows={4} className={`w-full p-2 bg-dark-input border ${errors.response ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`}></textarea>
                        {errors.response && <p className="text-red-500 text-sm mt-1">{errors.response}</p>}
                     </div>
                    <Button onClick={handleGenerateReply} disabled={isGenerating} icon={<i className="fa-solid fa-wand-magic-sparkles"></i>} className={`absolute bottom-3 ${dir === 'rtl' ? 'left-3' : 'right-3'} !px-3 !py-1 text-sm`}>
                        {isGenerating ? t('auto_responder.modal_generating') : t('auto_responder.modal_generate_ai')}
                    </Button>
                </div>
            </div>
            <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('auto_responder.modal_cancel')}</Button>
              <Button onClick={handleSaveBot}>{t('auto_responder.modal_save')}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AutoResponder;
