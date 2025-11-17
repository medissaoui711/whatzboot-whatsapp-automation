import React, { useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { Update, UpdateType } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tagColors: { [key in UpdateType]: string } = {
    'New': 'bg-green-500/20 text-green-300 border-green-500/50',
    'Improvement': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    'Fix': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
};

const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const updates: Update[] = t('changelog.updates');
  const modalRef = useRef<HTMLDivElement>(null);

  useModalAccessibility(isOpen, onClose, modalRef);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card 
        ref={modalRef}
        className="w-full max-w-2xl animate-toast-in-right max-h-[90vh] flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-modal-title"
      >
        <div className="text-center">
          <i className="fa-solid fa-gift text-5xl text-whatsapp-green mb-4"></i>
          <h2 id="changelog-modal-title" className="text-3xl font-bold text-dark-text-primary">{t('changelog.title')}</h2>
          <p className="mt-2 text-dark-text-secondary">{t('changelog.subtitle')}</p>
        </div>

        <div className="mt-8 space-y-6 overflow-y-auto px-2 -mx-2 flex-grow">
          {updates.map((update) => (
            <div key={update.version} className="bg-dark-input p-4 rounded-lg border border-dark-border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-dark-text-primary">Version {update.version}</h3>
                <span className="text-sm text-dark-text-secondary">{update.date}</span>
              </div>
              <ul className="space-y-2">
                {update.changes.map((change, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md border ${tagColors[change.type]} me-3 mt-1`}>
                      {t(`changelog.types.${change.type}`)}
                    </span>
                    <p className="text-dark-text-secondary">{change.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center flex-shrink-0">
          <Button onClick={onClose} className="px-8">
            {t('changelog.dismiss_button')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChangelogModal;