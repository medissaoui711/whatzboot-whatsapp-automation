import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useLanguage();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-6">
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="secondary"
                size="sm"
            >
                 <i className={`fa-solid ${t('dir') === 'rtl' ? 'fa-arrow-right' : 'fa-arrow-left'} me-2`}></i>
                {t('common.previous')}
            </Button>
            <span className="text-sm text-dark-text-secondary">
                {t('common.page_of', { currentPage, totalPages })}
            </span>
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="secondary"
                size="sm"
            >
                {t('common.next')}
                <i className={`fa-solid ${t('dir') === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} ms-2`}></i>
            </Button>
        </div>
    );
};

export default Pagination;
