import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { useLanguage } from '../i18n/LanguageContext';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl animate-toast-in-right">
        <div className="text-center">
            <i className="fa-solid fa-rocket text-5xl text-whatsapp-green mb-4"></i>
            <h2 className="text-3xl font-bold text-dark-text-primary">{t('welcome_modal.title')}</h2>
            <p className="mt-2 text-dark-text-secondary">{t('welcome_modal.intro')}</p>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Step 1 */}
            <div className="bg-dark-input p-6 rounded-lg border border-dark-border">
                <i className="fa-solid fa-robot text-3xl text-whatsapp-blue"></i>
                <h3 className="font-semibold mt-3 text-dark-text-primary">{t('welcome_modal.step1_title')}</h3>
                <p className="text-sm text-dark-text-secondary mt-1 mb-4">{t('welcome_modal.step1_desc')}</p>
                <Link to="/auto-responder"><Button size="sm" variant="secondary">{t('welcome_modal.step1_button')}</Button></Link>
            </div>
            {/* Step 2 */}
            <div className="bg-dark-input p-6 rounded-lg border border-dark-border">
                <i className="fa-solid fa-toolbox text-3xl text-yellow-500"></i>
                <h3 className="font-semibold mt-3 text-dark-text-primary">{t('welcome_modal.step2_title')}</h3>
                <p className="text-sm text-dark-text-secondary mt-1 mb-4">{t('welcome_modal.step2_desc')}</p>
                 <Link to="/dashboard"><Button size="sm" variant="secondary">{t('welcome_modal.step2_button')}</Button></Link>
            </div>
             {/* Step 3 */}
            <div className="bg-dark-input p-6 rounded-lg border border-dark-border">
                <i className="fa-solid fa-book-open text-3xl text-purple-500"></i>
                <h3 className="font-semibold mt-3 text-dark-text-primary">{t('welcome_modal.step3_title')}</h3>
                <p className="text-sm text-dark-text-secondary mt-1 mb-4">{t('welcome_modal.step3_desc')}</p>
                 <Link to="/help-center"><Button size="sm" variant="secondary">{t('welcome_modal.step3_button')}</Button></Link>
            </div>
        </div>

        <div className="mt-8 text-center">
            <Button onClick={onClose} className="px-8">
                {t('welcome_modal.dismiss_button')}
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeModal;