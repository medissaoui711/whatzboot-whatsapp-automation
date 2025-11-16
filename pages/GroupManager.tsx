import React, { useState, useEffect, useMemo } from 'react';
import { GroupMember } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const initialMembers: GroupMember[] = [
  { id: '1', name: 'Alice Johnson', phone: '+1234567890', joined: '2023-10-15', isAdmin: true },
  { id: '2', name: 'Bob Williams', phone: '+1987654321', joined: '2023-10-16', isAdmin: false },
  { id: '3', name: 'Charlie Brown', phone: '+1122334455', joined: '2023-10-17', isAdmin: false },
  { id: '4', name: 'Diana Miller', phone: '+1555666777', joined: '2023-10-18', isAdmin: false },
  { id: '5', name: 'Eve Davis', phone: '+1444333222', joined: '2023-10-19', isAdmin: false },
];

const ITEMS_PER_PAGE = 10;

const GroupManager: React.FC = () => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('Marketing Team');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const { t, dir } = useLanguage();
  
  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simulate fetching data
        setMembers(initialMembers);
        setIsLoading(false);
    }, 1000);
  }, [selectedGroup]);

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
    );
  }, [members, searchTerm]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);
  
  const handleRemoveClick = (memberId: string) => {
    setMemberToRemove(memberId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmRemove = () => {
    if (memberToRemove) {
      setMembers(members.filter(m => m.id !== memberToRemove));
      // Add toast notification if needed
    }
    setIsConfirmModalOpen(false);
    setMemberToRemove(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <SkeletonTable rows={5} cols={5} />;
    }
    if (members.length === 0) {
      return (
        <EmptyState
          icon={<i className="fa-solid fa-users"></i>}
          title={t('empty_states.no_members_title')}
          message={t('empty_states.no_members_message')}
        />
      );
    }
    if (paginatedMembers.length === 0 && searchTerm) {
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
            <th className="p-4 font-semibold text-dark-text-secondary">{t('group_manager.table_name')}</th>
            <th className="p-4 font-semibold text-dark-text-secondary">{t('group_manager.table_phone')}</th>
            <th className="p-4 font-semibold text-dark-text-secondary">{t('group_manager.table_joined')}</th>
            <th className="p-4 font-semibold text-dark-text-secondary">{t('group_manager.table_role')}</th>
            <th className="p-4 font-semibold text-dark-text-secondary">{t('group_manager.table_actions')}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMembers.map((member) => (
            <tr key={member.id} className="border-b border-dark-border hover:bg-white/5">
              <td className="p-4 text-dark-text-primary">{member.name}</td>
              <td className="p-4 text-dark-text-secondary">{member.phone}</td>
              <td className="p-4 text-dark-text-secondary">{member.joined}</td>
              <td className="p-4">
                {member.isAdmin ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-900/50 text-blue-300">{t('group_manager.role_admin')}</span>
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300">{t('group_manager.role_member')}</span>
                )}
              </td>
              <td className="p-4">
                <button onClick={() => handleRemoveClick(member.id)} className="text-dark-text-secondary hover:text-red-500"><i className="fa-solid fa-user-minus"></i> {t('group_manager.action_remove')}</button>
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
            <h2 className="text-3xl font-semibold text-dark-text-primary">{t('group_manager.title')}</h2>
            <p className="mt-2 text-dark-text-secondary">{t('group_manager.subtitle')}</p>
        </div>
        <div className="flex space-x-4 rtl:space-x-reverse">
            <Button variant="secondary" icon={<i className="fa-solid fa-link"></i>}>{t('group_manager.generate_link')}</Button>
            <Button icon={<i className="fa-solid fa-file-csv"></i>}>{t('group_manager.export_members')}</Button>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <label htmlFor="group-select" className="font-semibold text-dark-text-primary">{t('group_manager.select_group')}</label>
              <select 
                id="group-select"
                value={selectedGroup} 
                onChange={e => setSelectedGroup(e.target.value)}
                className="p-2 border border-dark-border rounded-lg bg-dark-input text-dark-text-primary"
              >
                <option>Marketing Team</option>
                <option>Sales Q4 Campaign</option>
                <option>Product Feedback</option>
              </select>
          </div>
          <div className="w-full sm:w-72">
             <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`${t('common.search')}...`}
                className="w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary"
             />
          </div>
      </div>

      <Card className="mt-4">
        <h3 className="text-xl font-semibold mb-4 text-dark-text-primary">{t('group_manager.members_of', { groupName: selectedGroup, count: filteredMembers.length })}</h3>
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

    </div>
  );
};

export default GroupManager;