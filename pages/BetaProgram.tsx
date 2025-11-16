import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from '../components/contexts/UserContext';

const BetaProgram: React.FC = () => {
    const { t } = useLanguage();
    const { user, toggleBetaStatus } = useUser();

    return (
        <div>
            <div className="text-center">
                <i className="fa-solid fa-flask-vial text-5xl text-whatsapp-blue mb-4"></i>
                <h2 className="text-3xl font-semibold text-dark-text-primary">{t('beta_program.title')}</h2>
                <p className="mt-2 text-dark-text-secondary max-w-3xl mx-auto">{t('beta_program.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <Card>
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-3">{t('beta_program.what_is_it_title')}</h3>
                    <p className="text-dark-text-secondary">{t('beta_program.what_is_it_desc')}</p>
                    
                    <h3 className="text-xl font-semibold text-dark-text-primary mt-6 mb-3">{t('beta_program.benefits_title')}</h3>
                    <ul className="space-y-2 list-disc list-inside text-dark-text-secondary">
                        <li>{t('beta_program.benefit_1')}</li>
                        <li>{t('beta_program.benefit_2')}</li>
                        <li>{t('beta_program.benefit_3')}</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-dark-text-primary mt-6 mb-3">{t('beta_program.expectations_title')}</h3>
                    <ul className="space-y-2 list-disc list-inside text-dark-text-secondary">
                        <li>{t('beta_program.expectation_1')}</li>
                        <li>{t('beta_program.expectation_2')}</li>
                    </ul>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center">
                    <div className="flex-grow flex flex-col items-center justify-center">
                        {user?.betaTester ? (
                            <>
                                <i className="fa-solid fa-user-check text-6xl text-green-500 mb-4"></i>
                                <p className="text-lg text-dark-text-primary font-semibold">{t('beta_program.current_status_on')}</p>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus text-6xl text-dark-text-secondary mb-4"></i>
                                <p className="text-lg text-dark-text-secondary">{t('beta_program.current_status_off')}</p>
                            </>
                        )}
                    </div>
                    <Button 
                        onClick={toggleBetaStatus} 
                        variant={user?.betaTester ? 'danger' : 'primary'}
                        className="w-full mt-8"
                        icon={user?.betaTester ? <i className="fa-solid fa-arrow-right-from-bracket"></i> : <i className="fa-solid fa-arrow-right-to-bracket"></i>}
                    >
                        {user?.betaTester ? t('beta_program.leave_button') : t('beta_program.join_button')}
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default BetaProgram;