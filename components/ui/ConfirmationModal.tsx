import React, { useRef } from 'react';
import Card from './Card';
import Button from './Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { useModalAccessibility } from '../../hooks/useModalAccessibility';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    const { t } = useLanguage();
    const modalRef = useRef<HTMLDivElement>(null);

    useModalAccessibility(isOpen, onClose, modalRef);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <Card 
                ref={modalRef}
                className="w-full max-w-md animate-toast-in-right" 
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-description"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20">
                        <i className="fa-solid fa-triangle-exclamation text-2xl text-red-500"></i>
                    </div>
                    <h3 id="confirmation-modal-title" className="text-2xl font-semibold mt-4 text-dark-text-primary">{title}</h3>
                    <p id="confirmation-modal-description" className="mt-2 text-dark-text-secondary">{message}</p>
                </div>
                <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
                    <Button variant="secondary" onClick={onClose}>
                        {cancelText || t('confirmation.cancel_button')}
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        {confirmText || t('confirmation.confirm_button')}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ConfirmationModal;