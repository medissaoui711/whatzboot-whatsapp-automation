
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Contact } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/contexts/ToastContext';
import { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { initialContacts } from '../data/contacts.data';

const ITEMS_PER_PAGE = 10;

const tagColors: { [key: string]: string } = {
    'Lead': 'bg-blue-500/20 text-blue-300',
    'VIP': 'bg-yellow-500/20 text-yellow-300',
    'Customer': 'bg-green-500/20 text-green-300',
    'Follow-up': 'bg-purple-500/20 text-purple-300',
    'default': 'bg-gray-500/20 text-gray-300'
};

const ContactManager: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [contactData, setContactData] = useState({ name: '', phone: '', tags: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTag, setFilterTag] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);

    // --- Bulk Actions State ---
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [tagToAdd, setTagToAdd] = useState('');
    const [isBulkDelete, setIsBulkDelete] = useState(false);


    const importFileRef = useRef<HTMLInputElement>(null);
    const { t, dir } = useLanguage();
    const { addToast } = useToast();
    
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { // Simulate data fetch
            setContacts(initialContacts);
            setIsLoading(false);
        }, 1000);
    }, []);
    
    useEffect(() => {
        // Clear selection when filters or page change
        setSelectedContacts([]);
    }, [searchTerm, filterTag, currentPage]);

    const uniqueTags = useMemo(() => ['All', ...new Set(contacts.flatMap(c => c.tags))], [contacts]);

    const filteredContacts = useMemo(() => {
        return contacts
            .filter(contact => filterTag === 'All' || contact.tags.includes(filterTag))
            .filter(contact => 
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                contact.phone.includes(searchTerm)
            );
    }, [contacts, filterTag, searchTerm]);

    const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);

    const paginatedContacts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredContacts, currentPage]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setContactData(prev => ({ ...prev, [id]: value }));
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
        if (!contactData.name.trim()) newErrors.name = t('validation.required');
        if (!contactData.phone.trim()) {
            newErrors.phone = t('validation.required');
        } else if (!/^\+?[1-9]\d{1,14}$/.test(contactData.phone)) {
            newErrors.phone = t('validation.valid_phone');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const openModal = (contact: Contact | null = null) => {
        setEditingContact(contact);
        if (contact) {
            setContactData({
                name: contact.name,
                phone: contact.phone,
                tags: contact.tags.join(', ')
            });
        } else {
            setContactData({ name: '', phone: '', tags: '' });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSaveContact = () => {
        if (!validateForm()) {
          addToast(t('notifications.form_submission_error'), { type: 'error' });
          return;
        }
        
        const newContact: Contact = {
            id: editingContact ? editingContact.id : Date.now().toString(),
            name: contactData.name,
            phone: contactData.phone,
            tags: contactData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };

        if (editingContact) {
            setContacts(contacts.map(c => c.id === newContact.id ? newContact : c));
        } else {
            setContacts([newContact, ...contacts]);
        }

        addToast(t('notifications.contact_saved'), { type: 'success' });
        setIsModalOpen(false);
    };

    const handleDeleteClick = (contactId: string) => {
        setContactToDelete(contactId);
        setIsBulkDelete(false);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (isBulkDelete) {
            setContacts(prev => prev.filter(c => !selectedContacts.includes(c.id)));
            addToast(t('notifications.contacts_deleted_success'), { type: 'success' });
            setSelectedContacts([]);
        } else if (contactToDelete) {
            setContacts(contacts.filter(c => c.id !== contactToDelete));
            addToast(t('notifications.contact_deleted'), { type: 'error' });
        }
        setIsConfirmModalOpen(false);
        setContactToDelete(null);
        setIsBulkDelete(false);
    }
    
    const handleExportCSV = () => {
        const dataToExport = selectedContacts.length > 0
            ? contacts.filter(c => selectedContacts.includes(c.id))
            : filteredContacts;
            
        const headers = "name,phone,tags";
        const rows = dataToExport.map(c => `${c.name},${c.phone},"${c.tags.join(',')}"`).join('\n');
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `whatzboot_contacts_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast(t('notifications.contact_export_success'), { type: 'success' });
    };

    const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImportFile(e.target.files[0]);
        }
    };
    
    const handleImportContacts = () => {
        if (!importFile) {
            addToast(t('validation.upload_csv'), { type: 'error' });
            return;
        }
        addToast(t('notifications.contact_import_success'), { type: 'success' });
        setIsImportModalOpen(false);
        setImportFile(null);
    };

    const handleDownloadSample = () => {
        const headers = "name,phone,tags";
        const rows = "John Doe,+1234567890,\"VIP,Lead\"\nJane Smith,+1987654321,Customer";
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample_contacts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Bulk Action Handlers ---
    const handleSelectContact = (id: string) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
        );
    };
    
    const handleSelectAll = () => {
        const currentPageIds = paginatedContacts.map(c => c.id);
        const allSelected = currentPageIds.every(id => selectedContacts.includes(id));
        if (allSelected) {
            setSelectedContacts(prev => prev.filter(id => !currentPageIds.includes(id)));
        } else {
            setSelectedContacts(prev => [...new Set([...prev, ...currentPageIds])]);
        }
    };
    
    const handleBulkAddTag = () => {
        if (!tagToAdd.trim()) {
            addToast(t('validation.required'), {type: 'error'});
            return;
        }
        setContacts(prev => prev.map(c => {
            if (selectedContacts.includes(c.id) && !c.tags.includes(tagToAdd)) {
                return { ...c, tags: [...c.tags, tagToAdd] };
            }
            return c;
        }));
        addToast(t('notifications.tags_added_success'), {type: 'success'});
        setIsTagModalOpen(false);
        setTagToAdd('');
    };
    
    const handleBulkDelete = () => {
        setIsBulkDelete(true);
        setIsConfirmModalOpen(true);
    };

    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

    const renderContent = () => {
        if (isLoading) {
            return <SkeletonTable rows={3} cols={5} />;
        }
        if (contacts.length === 0) {
            return (
                <EmptyState
                    icon={<i className="fa-solid fa-address-book"></i>}
                    title={t('empty_states.no_contacts_title')}
                    message={t('empty_states.no_contacts_message')}
                    action={<Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>{t('contact_manager.add_new')}</Button>}
                />
            );
        }
        if (paginatedContacts.length === 0) {
            return (
                <EmptyState
                    icon={<i className="fa-solid fa-search"></i>}
                    title={t('empty_states.no_results_title')}
                    message={t('empty_states.no_results_message')}
                />
            );
        }
        const isAllOnPageSelected = paginatedContacts.length > 0 && paginatedContacts.every(c => selectedContacts.includes(c.id));
        return (
            <table className={`w-full ${textAlignmentClass}`}>
                <thead className="bg-white/5">
                    <tr>
                        <th className="p-4 w-12">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-whatsapp-green focus:ring-whatsapp-teal-green border-dark-border rounded bg-dark-input"
                                checked={isAllOnPageSelected}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="p-4 font-semibold text-dark-text-secondary">{t('contact_manager.table_name')}</th>
                        <th className="p-4 font-semibold text-dark-text-secondary">{t('contact_manager.table_phone')}</th>
                        <th className="p-4 font-semibold text-dark-text-secondary">{t('contact_manager.table_tags')}</th>
                        <th className="p-4 font-semibold text-dark-text-secondary">{t('common.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedContacts.map((contact) => (
                        <tr key={contact.id} className={`border-b border-dark-border ${selectedContacts.includes(contact.id) ? 'bg-whatsapp-green/10' : 'hover:bg-white/5'}`}>
                            <td className="p-4">
                                 <input
                                    type="checkbox"
                                    className="h-4 w-4 text-whatsapp-green focus:ring-whatsapp-teal-green border-dark-border rounded bg-dark-input"
                                    checked={selectedContacts.includes(contact.id)}
                                    onChange={() => handleSelectContact(contact.id)}
                                />
                            </td>
                            <td className="p-4 text-dark-text-primary">{contact.name}</td>
                            <td className="p-4 text-dark-text-secondary font-mono">{contact.phone}</td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {contact.tags.map(tag => (
                                        <span key={tag} className={`px-2 py-1 text-xs rounded-md ${tagColors[tag] || tagColors.default}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-4">
                                <button onClick={() => openModal(contact)} className="text-dark-text-secondary hover:text-whatsapp-green me-4"><i className="fa-solid fa-pencil"></i></button>
                                <button onClick={() => handleDeleteClick(contact.id)} className="text-dark-text-secondary hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-semibold text-dark-text-primary">{t('contact_manager.title')}</h2>
                    <p className="mt-2 text-dark-text-secondary">{t('contact_manager.subtitle')}</p>
                </div>
                 <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button onClick={() => setIsImportModalOpen(true)} variant="secondary" icon={<i className="fa-solid fa-upload"></i>}>
                        {t('contact_manager.import_csv')}
                    </Button>
                    <Button onClick={handleExportCSV} variant="secondary" icon={<i className="fa-solid fa-download"></i>}>
                        {t('contact_manager.export_csv')}
                    </Button>
                    <Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>
                        {t('contact_manager.add_new')}
                    </Button>
                </div>
            </div>
            <Card className="mt-8">
                {selectedContacts.length > 0 ? (
                    <div className="mb-4 p-3 bg-dark-input rounded-lg flex justify-between items-center">
                        <span className="font-semibold text-dark-text-primary">{t('contact_manager.selected_count', { count: selectedContacts.length })}</span>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => setIsTagModalOpen(true)} variant="secondary" size="sm">{t('contact_manager.add_tag_action')}</Button>
                            <Button onClick={handleBulkDelete} variant="danger" size="sm">{t('contact_manager.delete_selected_action')}</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={`${t('common.search')}...`}
                            className="w-full sm:w-72 p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary"
                        />
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <label htmlFor="tag-filter" className="text-dark-text-secondary">{t('common.filter_by')}:</label>
                            <select
                                id="tag-filter"
                                value={filterTag}
                                onChange={e => {
                                    setFilterTag(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="p-2 border border-dark-border rounded-lg bg-dark-input text-dark-text-primary"
                            >
                                {uniqueTags.map(tag => <option key={tag} value={tag}>{tag === 'All' ? t('common.all') : tag}</option>)}
                            </select>
                        </div>
                    </div>
                )}
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

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
                    <Card className="w-full max-w-lg">
                        <h3 className="text-2xl font-semibold mb-4 text-dark-text-primary">
                            {editingContact ? t('contact_manager.modal_title_edit') : t('contact_manager.modal_title_add')}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <input id="name" type="text" value={contactData.name} onChange={handleInputChange} placeholder={t('contact_manager.name_placeholder')} className={`w-full p-2 bg-dark-input border ${errors.name ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`} />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <input id="phone" type="tel" value={contactData.phone} onChange={handleInputChange} placeholder={t('contact_manager.phone_placeholder')} className={`w-full p-2 bg-dark-input border ${errors.phone ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`} />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                             <div>
                                <input id="tags" type="text" value={contactData.tags} onChange={handleInputChange} placeholder={t('contact_manager.tags_placeholder')} className={`w-full p-2 bg-dark-input border ${errors.tags ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`} />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('contact_manager.modal_cancel')}</Button>
                            <Button onClick={handleSaveContact}>{t('contact_manager.modal_save')}</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
                    <Card className="w-full max-w-lg">
                        <h3 className="text-2xl font-semibold mb-2 text-dark-text-primary">{t('contact_manager.import_modal_title')}</h3>
                        <p className="text-dark-text-secondary mb-4">{t('contact_manager.import_modal_subtitle')}</p>
                        <button onClick={handleDownloadSample} className="text-sm text-whatsapp-green hover:underline">
                           <i className="fa-solid fa-download me-2"></i> {t('contact_manager.import_modal_download_sample')}
                        </button>

                        <div 
                            className="mt-4 border-2 border-dashed border-dark-border rounded-lg p-8 text-center cursor-pointer hover:border-whatsapp-green"
                            onClick={() => importFileRef.current?.click()}
                        >
                            <i className="fa-solid fa-cloud-upload text-4xl text-dark-text-secondary"></i>
                            <p className="mt-2 text-dark-text-secondary">
                               {importFile ? importFile.name : t('contact_manager.import_modal_upload_cta')}
                            </p>
                            <input
                                type="file"
                                ref={importFileRef}
                                onChange={handleImportFileChange}
                                className="hidden"
                                accept=".csv"
                            />
                        </div>

                        <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                            <Button variant="secondary" onClick={() => {setIsImportModalOpen(false); setImportFile(null);}}>{t('contact_manager.modal_cancel')}</Button>
                            <Button onClick={handleImportContacts} disabled={!importFile}>{t('contact_manager.import_modal_import_button')}</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Add Tag Modal */}
            {isTagModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
                    <Card className="w-full max-w-md">
                        <h3 className="text-2xl font-semibold mb-4">{t('contact_manager.tag_modal_title')}</h3>
                        <input
                            type="text"
                            value={tagToAdd}
                            onChange={e => setTagToAdd(e.target.value)}
                            placeholder={t('contact_manager.tag_modal_placeholder')}
                            className="w-full p-2 bg-dark-input border border-dark-border rounded-lg"
                        />
                         <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                            <Button variant="secondary" onClick={() => setIsTagModalOpen(false)}>{t('contact_manager.modal_cancel')}</Button>
                            <Button onClick={handleBulkAddTag}>{t('contact_manager.tag_modal_add_button')}</Button>
                        </div>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default ContactManager;
