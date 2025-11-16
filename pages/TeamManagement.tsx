import React, { useState, useMemo } from 'react';
import { User, Role } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/contexts/ToastContext';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const initialTeam: User[] = [
  { id: '2', name: 'Marketing Molly', email: 'molly@example.com', role: 'Marketer', avatar: 'https://picsum.photos/seed/molly/100' },
  { id: '3', name: 'Support Steve', email: 'steve@example.com', role: 'Agent', avatar: 'https://picsum.photos/seed/steve/100' },
];

const ITEMS_PER_PAGE = 10;

const TeamManagement: React.FC = () => {
    const [team, setTeam] = useState<User[]>(initialTeam);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<Role>('Agent');
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState<string | null>(null);

    const { t, dir } = useLanguage();
    const { addToast } = useToast();

    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

    const filteredTeam = useMemo(() => {
        return team.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [team, searchTerm]);

    const totalPages = Math.ceil(filteredTeam.length / ITEMS_PER_PAGE);

    const paginatedTeam = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTeam.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTeam, currentPage]);


    const validateInvite = () => {
        const newErrors: { email?: string } = {};
        if (!inviteEmail.trim()) {
            newErrors.email = t('validation.required');
        } else if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
            newErrors.email = t('validation.invalid_email');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendInvite = () => {
        if (!validateInvite()) {
            addToast(t('notifications.form_submission_error'), { type: 'error' });
            return;
        }
        addToast(t('notifications.user_invited'), { type: 'success' });
        // In a real app, you would send an API request here.
        // For demo, we'll just close the modal.
        setIsModalOpen(false);
        setInviteEmail('');
        setInviteRole('Agent');
    };
    
    const handleRoleChange = (userId: string, newRole: Role) => {
        setTeam(team.map(user => user.id === userId ? { ...user, role: newRole } : user));
        addToast(t('notifications.user_updated'), { type: 'success' });
    };

    const handleRemoveClick = (userId: string) => {
        setUserToRemove(userId);
        setIsConfirmModalOpen(true);
    };
    
    const confirmRemove = () => {
        if (userToRemove) {
            setTeam(team.filter(user => user.id !== userToRemove));
            addToast(t('notifications.user_removed'), { type: 'error' });
        }
        setIsConfirmModalOpen(false);
        setUserToRemove(null);
    };

    const renderContent = () => {
        if (team.length === 0) {
            return (
                 <EmptyState
                    icon={<i className="fa-solid fa-users"></i>}
                    title={t('empty_states.no_team_members_title')}
                    message={t('empty_states.no_team_members_message')}
                    action={<Button onClick={() => setIsModalOpen(true)} icon={<i className="fa-solid fa-plus"></i>}>{t('team_management.invite_button')}</Button>}
                />
            );
        }

        if (paginatedTeam.length === 0 && searchTerm) {
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
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('team_management.table_member')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('team_management.table_role')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTeam.map(user => (
                            <tr key={user.id} className="border-b border-dark-border hover:bg-white/5">
                                <td className="p-4">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-dark-text-primary">{user.name}</p>
                                            <p className="text-sm text-dark-text-secondary">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                        className="p-2 border border-dark-border rounded-lg bg-dark-input text-dark-text-primary"
                                    >
                                        <option value="Admin">{t('roles.Admin')}</option>
                                        <option value="Marketer">{t('roles.Marketer')}</option>
                                        <option value="Agent">{t('roles.Agent')}</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleRemoveClick(user.id)} className="text-dark-text-secondary hover:text-red-500">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
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
                    <h2 className="text-3xl font-semibold text-dark-text-primary">{t('team_management.title')}</h2>
                    <p className="mt-2 text-dark-text-secondary">{t('team_management.subtitle')}</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={<i className="fa-solid fa-user-plus"></i>}>
                    {t('team_management.invite_button')}
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
                onConfirm={confirmRemove}
                title={t('confirmation.title')}
                message={t('confirmation.remove_message')}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
                    <Card className="w-full max-w-md">
                        <h3 className="text-2xl font-semibold mb-6 text-dark-text-primary">{t('team_management.modal_title')}</h3>
                        <div className="space-y-4">
                            <div>
                                <input 
                                    type="email" 
                                    value={inviteEmail} 
                                    onChange={(e) => {
                                        setInviteEmail(e.target.value)
                                        if (errors.email) setErrors({});
                                    }}
                                    placeholder={t('team_management.email_placeholder')} 
                                    className={`w-full p-3 bg-dark-input border ${errors.email ? 'border-red-500' : 'border-dark-border'} rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                             <div>
                                <label className={`block text-sm font-medium text-dark-text-secondary mb-2 ${textAlignmentClass}`}>{t('team_management.role_label')}</label>
                                <select 
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as Role)}
                                    className={`w-full p-3 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary ${textAlignmentClass}`}
                                >
                                    <option value="Agent">{t('roles.Agent')}</option>
                                    <option value="Marketer">{t('roles.Marketer')}</option>
                                    <option value="Admin">{t('roles.Admin')}</option>
                                </select>
                             </div>
                        </div>
                        <div className="flex justify-end mt-8 space-x-4 rtl:space-x-reverse">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('team_management.modal_cancel')}</Button>
                            <Button onClick={handleSendInvite}>{t('team_management.send_invite_button')}</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;