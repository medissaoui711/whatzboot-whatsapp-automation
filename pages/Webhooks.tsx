
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/contexts/ToastContext';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonTable } from '../components/ui/Skeleton';
import { Webhook, WebhookEvent } from '../types';
import Pagination from '../components/ui/Pagination';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { initialWebhooks } from '../data/webhooks.data';

const WEBHOOK_EVENTS: WebhookEvent[] = [
    'message.received',
    'message.sent',
    'contact.created',
    'group.member.joined'
];

const ITEMS_PER_PAGE = 10;

const Webhooks: React.FC = () => {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
    const [webhookData, setWebhookData] = useState<{ name: string; url: string; events: WebhookEvent[] }>({ name: '', url: '', events: [] });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);

    const { t, dir } = useLanguage();
    const { addToast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { // Simulate fetching data
            setWebhooks(initialWebhooks);
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredWebhooks = useMemo(() => {
        return webhooks.filter(wh =>
            wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wh.url.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [webhooks, searchTerm]);

    const totalPages = Math.ceil(filteredWebhooks.length / ITEMS_PER_PAGE);

    const paginatedWebhooks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredWebhooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredWebhooks, currentPage]);

    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!webhookData.name.trim()) newErrors.name = t('validation.required');
        if (!webhookData.url.trim()) {
            newErrors.url = t('validation.required');
        } else {
            try {
                new URL(webhookData.url);
            } catch (_) {
                newErrors.url = t('validation.invalid_url');
            }
        }
        if (webhookData.events.length === 0) newErrors.events = t('validation.select_event');
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setWebhookData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
    };

    const handleEventChange = (event: WebhookEvent) => {
        setWebhookData(prev => {
            const newEvents = prev.events.includes(event)
                ? prev.events.filter(e => e !== event)
                : [...prev.events, event];
            return { ...prev, events: newEvents };
        });
        if (errors.events) setErrors(prev => ({ ...prev, events: '' }));
    };
    
    const openModal = (webhook: Webhook | null = null) => {
        setEditingWebhook(webhook);
        setWebhookData(webhook ? { name: webhook.name, url: webhook.url, events: webhook.events } : { name: '', url: '', events: [] });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSaveWebhook = () => {
        if (!validateForm()) {
            addToast(t('notifications.form_submission_error'), { type: 'error' });
            return;
        }
        addToast(t('notifications.webhook_saved'), { type: 'success' });
        setIsModalOpen(false);
    };

    const handleToggleStatus = (id: string) => {
        setWebhooks(webhooks.map(wh => wh.id === id ? { ...wh, status: wh.status === 'active' ? 'inactive' : 'active' } : wh));
    };
    
    const handleDeleteClick = (webhookId: string) => {
        setWebhookToDelete(webhookId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (webhookToDelete) {
            setWebhooks(webhooks.filter(wh => wh.id !== webhookToDelete));
            addToast(t('notifications.webhook_deleted'), { type: 'error' });
        }
        setIsConfirmModalOpen(false);
        setWebhookToDelete(null);
    };

    const handleTestWebhook = (webhook: Webhook) => {
        addToast(t('notifications.webhook_test_sent'), { type: 'info' });
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            if (success) {
                addToast(t('notifications.webhook_test_sent'), { type: 'success' });
            } else {
                 addToast(t('notifications.webhook_test_failed'), { type: 'error' });
            }
        }, 1500);
    };

    const renderContent = () => {
        if (isLoading) return <SkeletonTable rows={3} cols={5} />;
        if (webhooks.length === 0) return (
            <EmptyState
                icon={<i className="fa-solid fa-code-branch"></i>}
                title={t('empty_states.no_webhooks_title')}
                message={t('empty_states.no_webhooks_message')}
                action={<Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>{t('webhooks.create_button')}</Button>}
            />
        );
        if (paginatedWebhooks.length === 0 && searchTerm) {
             return (
                <EmptyState
                  icon={<i className="fa-solid fa-search"></i>}
                  title={t('empty_states.no_results_title')}
                  message={t('empty_states.no_results_message')}
                />
            );
        }
        return (
            <div className="overflow-x-auto">
                <table className={`w-full min-w-max ${textAlignmentClass}`}>
                    <thead className="bg-white/5">
                        <tr>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('webhooks.table_name')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('webhooks.table_url')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('webhooks.table_events')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('webhooks.table_status')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedWebhooks.map(wh => (
                            <tr key={wh.id} className="border-b border-dark-border hover:bg-white/5">
                                <td className="p-4 text-dark-text-primary font-semibold">{wh.name}</td>
                                <td className="p-4 text-dark-text-secondary font-mono text-sm">{wh.url}</td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {wh.events.map(event => <span key={event} className="px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300">{event}</span>)}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <label htmlFor={`status-${wh.id}`} className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" id={`status-${wh.id}`} className="sr-only peer" checked={wh.status === 'active'} onChange={() => handleToggleStatus(wh.id)} />
                                        <div className="w-11 h-6 bg-dark-border rounded-full peer peer-focus:ring-2 peer-focus:ring-whatsapp-green/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] rtl:peer-checked:after:-translate-x-full rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                                    </label>
                                </td>
                                <td className="p-4 space-x-4 rtl:space-x-reverse">
                                    <Button onClick={() => handleTestWebhook(wh)} variant="secondary" size="sm" icon={<i className="fa-solid fa-paper-plane"></i>}>{t('webhooks.test_button')}</Button>
                                    <button onClick={() => openModal(wh)} className="text-dark-text-secondary hover:text-whatsapp-green"><i className="fa-solid fa-pencil"></i></button>
                                    <button onClick={() => handleDeleteClick(wh.id)} className="text-dark-text-secondary hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-semibold text-dark-text-primary">{t('webhooks.title')}</h2>
                    <p className="mt-2 text-dark-text-secondary">{t('webhooks.subtitle')}</p>
                </div>
                <Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>{t('webhooks.create_button')}</Button>
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
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <Card className="w-full max-w-2xl">
                        <h3 className="text-2xl font-semibold mb-6 text-dark-text-primary">{editingWebhook ? t('webhooks.modal_title_edit') : t('webhooks.modal_title_create')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className={`block text-sm font-medium text-dark-text-secondary mb-1 ${textAlignmentClass}`}>{t('webhooks.name_label')}</label>
                                <input id="name" type="text" value={webhookData.name} onChange={handleInputChange} placeholder={t('webhooks.name_placeholder')} className={`w-full p-2 bg-dark-input border ${errors.name ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary ${textAlignmentClass}`} />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="url" className={`block text-sm font-medium text-dark-text-secondary mb-1 ${textAlignmentClass}`}>{t('webhooks.url_label')}</label>
                                <input id="url" type="url" value={webhookData.url} onChange={handleInputChange} placeholder={t('webhooks.url_placeholder')} className={`w-full p-2 bg-dark-input border ${errors.url ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary font-mono ${textAlignmentClass}`} />
                                {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                            </div>
                            <div>
                                <label className={`block text-sm font-medium text-dark-text-secondary mb-2 ${textAlignmentClass}`}>{t('webhooks.events_label')}</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-dark-input border border-dark-border rounded-lg">
                                    {WEBHOOK_EVENTS.map(event => (
                                        <label key={event} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                                            <input type="checkbox" checked={webhookData.events.includes(event)} onChange={() => handleEventChange(event)} className="h-4 w-4 rounded bg-dark-border border-gray-600 text-whatsapp-green focus:ring-whatsapp-green focus:ring-offset-dark-card" />
                                            <span className="text-dark-text-primary">{t(`webhooks.event_${event.replace('.', '_')}`)}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.events && <p className="text-red-500 text-sm mt-1">{errors.events}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end mt-8 space-x-4 rtl:space-x-reverse">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('webhooks.cancel_button')}</Button>
                            <Button onClick={handleSaveWebhook}>{t('webhooks.save_button')}</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Webhooks;
