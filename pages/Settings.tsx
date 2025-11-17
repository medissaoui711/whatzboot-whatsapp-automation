import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from '../components/contexts/UserContext';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { t, dir } = useLanguage();
  const { user } = useUser();
  
  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('settings.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('settings.subtitle')}</p>

      <div className="mt-8 space-y-8">
        <Card>
          <h3 className="text-xl font-semibold text-dark-text-primary border-b border-dark-border pb-4">{t('settings.profile_title')}</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('settings.full_name_label')}</label>
              <input type="text" defaultValue={user?.name} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('settings.email_label')}</label>
              <input type="email" defaultValue={user?.email} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} />
            </div>
          </div>
        </Card>

        <Card>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-dark-text-primary">{t('settings.affiliate_title')}</h3>
                    <p className="text-sm text-dark-text-secondary mt-1">{t('settings.affiliate_subtitle')}</p>
                </div>
                <Link to="/affiliate-program">
                    <Button variant='secondary'>{t('settings.affiliate_button')}</Button>
                </Link>
            </div>
        </Card>
        
         <Card>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-dark-text-primary">{t('settings.beta_title')}</h3>
                    <p className="text-sm text-dark-text-secondary mt-1">{t('settings.beta_subtitle')}</p>
                </div>
                <Link to="/settings/beta">
                    <Button variant='secondary'>{t('settings.beta_button')}</Button>
                </Link>
            </div>
        </Card>

        {user?.role === 'Admin' && (
          <>
            <Card>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-dark-text-primary">{t('settings.site_management_title')}</h3>
                        <p className="text-sm text-dark-text-secondary mt-1">{t('settings.site_management_subtitle')}</p>
                    </div>
                    <Link to="/admin/control-panel">
                        <Button variant='secondary'>{t('settings.site_management_button')}</Button>
                    </Link>
                </div>
            </Card>

             <Card>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-dark-text-primary">{t('settings.monitoring_title')}</h3>
                  <p className="text-sm text-dark-text-secondary mt-1">{t('settings.monitoring_subtitle')}</p>
                </div>
                <Link to="/admin/monitoring">
                  <Button variant='secondary'>{t('settings.monitoring_button')}</Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-dark-text-primary">{t('settings.billing_title')}</h3>
                  <p className="text-sm text-dark-text-secondary mt-1">{t('settings.billing_subtitle')}</p>
                </div>
                <Link to="/settings/billing">
                  <Button variant='secondary'>{t('settings.billing_button')}</Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-dark-text-primary">{t('settings.team_title')}</h3>
                  <p className="text-sm text-dark-text-secondary mt-1">{t('settings.team_subtitle')}</p>
                </div>
                <Link to="/settings/team">
                  <Button variant='secondary'>{t('settings.manage_team_button')}</Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-dark-text-primary">{t('settings.webhooks_title')}</h3>
                  <p className="text-sm text-dark-text-secondary mt-1">{t('settings.webhooks_subtitle')}</p>
                </div>
                <Link to="/settings/webhooks">
                  <Button variant='secondary'>{t('settings.webhooks_button')}</Button>
                </Link>
              </div>
            </Card>
          </>
        )}
        
        <Card>
          <h3 className="text-xl font-semibold text-dark-text-primary border-b border-dark-border pb-4">{t('settings.api_title')}</h3>
          <div className="mt-6">
             <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('settings.api_key_label')}</label>
             <div className="mt-1 flex rounded-md shadow-sm">
                <input type="text" readOnly value="******************" className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none bg-dark-input border border-dark-border text-dark-text-secondary ${dir === 'rtl' ? 'rounded-r-md' : 'rounded-l-md'}`} />
                <button className={`inline-flex items-center px-3 border border-dark-border bg-dark-card text-dark-text-secondary hover:bg-gray-800 ${dir === 'rtl' ? 'rounded-l-md border-r-0' : 'rounded-r-md border-l-0'}`}>
                    <i className="fa-solid fa-copy"></i>
                </button>
             </div>
          </div>
        </Card>
        
        <div className="flex justify-end">
            <Button>{t('common.save_button')}</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;