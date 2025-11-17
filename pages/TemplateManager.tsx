
import React, { useState } from 'react';
import { MessageTemplate } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/contexts/ToastContext';
import { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { initialTemplates } from '../data/templates.data';

const ITEMS_PER_PAGE = 10;

const statusColors: { [key in MessageTemplate['approvalStatus']]: string } = {
    Approved: 'bg-green-500/20 text-green-300',
    Pending: 'bg-yellow-500/20 text-yellow-300',
    Rejected: 'bg-red-500/20 text-red-300',
};

const TemplateManager: React.FC = () => {
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
    const [templateData, setTemplateData] = useState({ name: '', message: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [testPhoneNumber, setTestPhoneNumber] = useState('');
    const [templateToTest, setTemplateToTest] = useState<MessageTemplate | null>(null);

    const { t, dir } = useLanguage();
    const { addToast } = useToast();
    
    useState(() => {
        setIsLoading(true);
        setTimeout(() => {
            setTemplates(initialTemplates);
            setIsLoading(false);
        }, 1000);
    });

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSaveTemplate = () => {
        // Validation logic
        addToast(t('notifications.template_saved'), { type: 'success' });
        setIsModalOpen(false);
    };

    const handleDeleteClick = (id: string) => {
        setTemplateToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (templateToDelete) {
            setTemplates(templates.filter(t => t.id !== templateToDelete));
            addToast(t('notifications.template_deleted'), { type: 'error' });
        }
        setIsConfirmModalOpen(false);
        setTemplateToDelete(null);
    };
    
    const openTestModal = (template: MessageTemplate) => {
        setTemplateToTest(template);
        setTestPhoneNumber('');
        setIsTestModalOpen(true);
    };

    const sendTestMessage = () => {
        if (!/^\+?[1-9]\d{1,14}$/.test(testPhoneNumber)) {
            addToast(t('validation.valid_phone'), { type: 'error' });
            return;
        }
        addToast(t('notifications.template_test_sent'), { type: 'success' });
        setIsTestModalOpen(false);
    }
    
    const openModal = (template: MessageTemplate | null = null) => {
        setEditingTemplate(template);
        if (template) {
            setTemplateData({ name: template.name, message: template.message });
        } else {
            setTemplateData({ name: '', message: '' });
        }
        setErrors({});
        setIsModalOpen(true);
    }
    
    const insertVariable = (variable: string) => {
        setTemplateData(prev => ({...prev, message: prev.message + ` {${variable}}`}));
    };

    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-semibold text-dark-text-primary">{t('template_manager.title')}</h2>
                    <p className="mt-2 text-dark-text-secondary">{t('template_manager.subtitle')}</p>
                </div>
                <Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>
                    {t('template_manager.create_new')}
                </Button>
            </div>

            <Card className="mt-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder={`${t('common.search')}...`}
                    className="w-full sm:w-72 p-2 mb-4 bg-dark-input border border-dark-border rounded-lg"
                />
                {isLoading ? <SkeletonTable rows={3} cols={4} /> : paginatedTemplates.length > 0 ? (
                     <table className={`w-full ${textAlignmentClass}`}>
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4 font-semibold">{t('template_manager.table_name')}</th>
                                <th className="p-4 font-semibold">{t('template_manager.table_message')}</th>
                                <th className="p-4 font-semibold">{t('template_manager.table_status')}</th>
                                <th className="p-4 font-semibold">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTemplates.map(template => (
                                <tr key={template.id} className="border-b border-dark-border hover:bg-white/5">
                                    <td className="p-4 font-semibold">{template.name}</td>
                                    <td className="p-4 text-dark-text-secondary italic">"{template.message.substring(0, 50)}..."</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-md font-semibold ${statusColors[template.approvalStatus]}`}>
                                            {t(`template_manager.status_${template.approvalStatus.toLowerCase()}`)}
                                        </span>
                                    </td>
                                    <td className="p-4 space-x-4 rtl:space-x-reverse">
                                        <Button onClick={() => openTestModal(template)} variant="secondary" size="sm" icon={<i className="fa-solid fa-vial"></i>}>{t('template_manager.actions_test')}</Button>
                                        <button onClick={() => openModal(template)} className="text-dark-text-secondary hover:text-whatsapp-green"><i className="fa-solid fa-pencil"></i></button>
                                        <button onClick={() => handleDeleteClick(template.id)} className="text-dark-text-secondary hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState
                        icon={<i className="fa-solid fa-layer-group"></i>}
                        title={t('empty_states.no_templates_title')}
                        message={t('empty_states.no_templates_message')}
                        action={<Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>{t('template_manager.create_new')}</Button>}
                    />
                )}
            </Card>
            
            <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE)} onPageChange={setCurrentPage} />
            
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title={t('confirmation.title')} message={t('confirmation.delete_message')} />
            
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                     <Card className="w-full max-w-2xl">
                        <h3 className="text-2xl font-semibold mb-6">{editingTemplate ? t('template_manager.modal_title_edit') : t('template_manager.modal_title_create')}</h3>
                        <div className="space-y-4">
                            <input type="text" value={templateData.name} onChange={e => setTemplateData({...templateData, name: e.target.value})} placeholder={t('template_manager.name_placeholder')} className={`w-full p-2 bg-dark-input border rounded-lg ${textAlignmentClass}`} />
                            <textarea value={templateData.message} onChange={e => setTemplateData({...templateData, message: e.target.value})} placeholder={t('template_manager.message_placeholder')} rows={6} className={`w-full p-2 bg-dark-input border rounded-lg ${textAlignmentClass}`}></textarea>
                            <div>
                                <h4 className="text-sm font-semibold text-dark-text-secondary">{t('template_manager.variables_title')}</h4>
                                <p className="text-xs text-dark-text-secondary mb-2">{t('template_manager.variables_subtitle')}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => insertVariable('name')} className="px-2 py-1 text-xs bg-dark-input border rounded-md hover:bg-white/10">{`{name}`}</button>
                                    <button onClick={() => insertVariable('phone')} className="px-2 py-1 text-xs bg-dark-input border rounded-md hover:bg-white/10">{`{phone}`}</button>
                                </div>
                            </div>
                        </div>
                         <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                             <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('template_manager.cancel_button')}</Button>
                             <Button onClick={handleSaveTemplate}>{t('template_manager.save_button')}</Button>
                         </div>
                     </Card>
                 </div>
            )}
            
            {isTestModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                     <Card className="w-full max-w-md">
                        <h3 className="text-2xl font-semibold mb-2">{t('template_manager.test_modal_title')}</h3>
                        <p className="text-sm text-dark-text-secondary mb-4">{t('template_manager.test_modal_subtitle')}</p>
                        <p className="text-sm bg-dark-input p-3 rounded-md border text-dark-text-secondary mb-4 italic">"{templateToTest?.message}"</p>
                        <input type="tel" value={testPhoneNumber} onChange={e => setTestPhoneNumber(e.target.value)} placeholder={t('template_manager.phone_placeholder')} className={`w-full p-2 bg-dark-input border rounded-lg ${textAlignmentClass}`} />
                        <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                            <Button variant="secondary" onClick={() => setIsTestModalOpen(false)}>{t('template_manager.cancel_button')}</Button>
                            <Button onClick={sendTestMessage}>{t('template_manager.send_test_button')}</Button>
                        </div>
                     </Card>
                 </div>
            )}

        </div>
    );
};

export default TemplateManager;
