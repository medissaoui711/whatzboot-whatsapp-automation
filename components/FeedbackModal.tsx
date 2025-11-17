
import React, { useState, useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from './contexts/ToastContext';
import { FeedbackCategory } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<FeedbackCategory>('Feature Suggestion');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, dir } = useLanguage();
  const { addToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  
  useModalAccessibility(isOpen, onClose, modalRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      addToast(t('validation.required'), { type: 'error' });
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      addToast(t('notifications.feedback_sent'), { type: 'success' });
      setDetails('');
      setCategory('Feature Suggestion');
      onClose();
    }, 1000);
  };

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card 
        ref={modalRef}
        className="w-full max-w-lg animate-toast-in-right" 
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            <i className="fa-solid fa-lightbulb-on text-4xl text-yellow-400 mb-3"></i>
            <h2 id="feedback-modal-title" className="text-2xl font-bold text-dark-text-primary">{t('feedback.modal_title')}</h2>
            <p className="mt-2 text-dark-text-secondary">{t('feedback.modal_subtitle')}</p>
          </div>

          <div className={`mt-6 space-y-4 ${textAlignmentClass}`}>
            <div>
              <label htmlFor="feedback-category" className="block text-sm font-medium text-dark-text-secondary mb-1">
                {t('feedback.category_label')}
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                className={`w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary ${textAlignmentClass}`}
              >
                <option value="Feature Suggestion">{t('feedback.category_feature')}</option>
                <option value="Bug Report">{t('feedback.category_bug')}</option>
                <option value="General Feedback">{t('feedback.category_general')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="feedback-details" className="block text-sm font-medium text-dark-text-secondary mb-1">
                {t('feedback.details_label')}
              </label>
              <textarea
                id="feedback-details"
                rows={6}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t('feedback.details_placeholder') as string}
                className={`w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`}
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('feedback.cancel_button')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('auto_responder.modal_generating') : t('feedback.submit_button')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackModal;
