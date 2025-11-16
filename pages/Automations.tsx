import React, { useState } from 'react';
import { DripCampaign, DripCampaignStep, MessageTemplate } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/contexts/ToastContext';
import EmptyState from '../components/ui/EmptyState';

const initialCampaigns: DripCampaign[] = [
  {
    id: 'camp1',
    name: 'New User Onboarding',
    status: 'active',
    triggerType: 'tag_added',
    triggerValue: 'new-lead',
    steps: [
      { id: 'step1', delayDays: 0, delayHours: 1, templateId: '1' },
      { id: 'step2', delayDays: 2, delayHours: 0, templateId: '2' },
    ],
  },
   {
    id: 'camp2',
    name: 'Post-Purchase Follow-up',
    status: 'paused',
    triggerType: 'tag_added',
    triggerValue: 'purchased-item-x',
    steps: [
      { id: 'step3', delayDays: 7, delayHours: 0, templateId: '1' },
    ],
  },
];

const mockTemplates: MessageTemplate[] = [
    { id: '1', name: 'Welcome Message', message: 'Hi there! Welcome to WhatzBoot. Let us know if you have any questions.', approvalStatus: 'Approved' },
    { id: '2', name: 'Feature Check-in', message: 'Just checking in! Have you tried our new Team Inbox feature yet?', approvalStatus: 'Approved' },
];

const defaultStep: DripCampaignStep = { id: '', delayDays: 1, delayHours: 0, templateId: '' };

const Automations: React.FC = () => {
    const { t, dir } = useLanguage();
    const { addToast } = useToast();
    const [campaigns, setCampaigns] = useState<DripCampaign[]>(initialCampaigns);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<DripCampaign | null>(null);

    const openModal = (campaign: DripCampaign | null = null) => {
        if (campaign) {
            setEditingCampaign(campaign);
        } else {
            setEditingCampaign({
                id: `camp${Date.now()}`,
                name: '',
                status: 'paused',
                triggerType: 'tag_added',
                triggerValue: '',
                steps: [{ ...defaultStep, id: `step${Date.now()}` }],
            });
        }
        setIsModalOpen(true);
    };
    
    const handleSave = () => {
        if (!editingCampaign || !editingCampaign.name || !editingCampaign.triggerValue) {
            addToast(t('validation.required'), {type: 'error'});
            return;
        }
        // Save logic here
        addToast(t('notifications.automation_saved'), {type: 'success'});
        setIsModalOpen(false);
        setEditingCampaign(null);
    };

    const handleFieldChange = (field: keyof DripCampaign, value: any) => {
        if (editingCampaign) {
            setEditingCampaign({ ...editingCampaign, [field]: value });
        }
    };

    const handleStepChange = (stepId: string, field: keyof DripCampaignStep, value: any) => {
         if (editingCampaign) {
            const updatedSteps = editingCampaign.steps.map(step => 
                step.id === stepId ? { ...step, [field]: value } : step
            );
            setEditingCampaign({ ...editingCampaign, steps: updatedSteps });
        }
    };
    
    const addStep = () => {
        if (editingCampaign) {
            const newStep = { ...defaultStep, id: `step${Date.now()}`};
            setEditingCampaign({ ...editingCampaign, steps: [...editingCampaign.steps, newStep] });
        }
    }

    const removeStep = (stepId: string) => {
        if (editingCampaign && editingCampaign.steps.length > 1) {
            const updatedSteps = editingCampaign.steps.filter(step => step.id !== stepId);
            setEditingCampaign({ ...editingCampaign, steps: updatedSteps });
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-semibold text-dark-text-primary">{t('automations.title')}</h2>
                    <p className="mt-2 text-dark-text-secondary">{t('automations.subtitle')}</p>
                </div>
                <Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>
                    {t('automations.create_new')}
                </Button>
            </div>
            
            <div className="mt-8">
                {campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map(campaign => (
                            <Card key={campaign.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-dark-text-primary">{campaign.name}</h3>
                                        <span className={`px-2 py-0.5 mt-2 inline-block text-xs rounded-md font-semibold ${campaign.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {t(`automations.status_${campaign.status}`)}
                                        </span>
                                    </div>
                                    <Button variant="secondary" size="sm" onClick={() => openModal(campaign)}>{t('common.view')}</Button>
                                </div>
                                <div className="mt-4 border-t border-dark-border pt-4 text-sm text-dark-text-secondary">
                                    <p><strong>{t('automations.trigger')}:</strong> {t('automations.trigger_type_tag_added')} "{campaign.triggerValue}"</p>
                                    <p className="mt-2"><strong>{t('automations.steps')}:</strong> {campaign.steps.length}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState 
                        icon={<i className="fa-solid fa-gears"></i>}
                        title={t('empty_states.no_automations_title')}
                        message={t('empty_states.no_automations_message')}
                        action={<Button onClick={() => openModal()} icon={<i className="fa-solid fa-plus"></i>}>{t('automations.create_new')}</Button>}
                    />
                )}
            </div>

            {isModalOpen && editingCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
                    <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-semibold mb-6 text-dark-text-primary flex-shrink-0">
                            {editingCampaign.name ? t('automations.modal_title_edit') : t('automations.modal_title_create')}
                        </h3>
                        <div className="overflow-y-auto space-y-6 pr-2 -mr-2 flex-grow">
                             <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-1">{t('automations.campaign_name')}</label>
                                <input type="text" value={editingCampaign.name} onChange={e => handleFieldChange('name', e.target.value)} placeholder={t('automations.campaign_name_placeholder')} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary" />
                            </div>

                             <Card>
                                <h4 className="font-semibold text-dark-text-primary">{t('automations.trigger')}</h4>
                                <p className="text-sm text-dark-text-secondary">{t('automations.trigger_desc')}</p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <select value={editingCampaign.triggerType} onChange={e => handleFieldChange('triggerType', e.target.value)} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary">
                                        <option value="tag_added">{t('automations.trigger_type_tag_added')}</option>
                                    </select>
                                     <input type="text" value={editingCampaign.triggerValue} onChange={e => handleFieldChange('triggerValue', e.target.value)} placeholder={t('automations.trigger_tag_placeholder')} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary" />
                                </div>
                            </Card>

                            <div>
                                 <h4 className="font-semibold text-dark-text-primary mb-2">{t('automations.steps')}</h4>
                                 <div className="space-y-4">
                                     {editingCampaign.steps.map((step, index) => (
                                         <Card key={step.id} className="relative">
                                              <button onClick={() => removeStep(step.id)} className={`absolute top-3 ${dir === 'rtl' ? 'left-3' : 'right-3'} text-dark-text-secondary hover:text-red-500`}><i className="fa-solid fa-trash-can"></i></button>
                                             <p className="font-semibold text-dark-text-secondary mb-3">Step {index + 1}</p>
                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                                <div className="col-span-1">
                                                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">{t('automations.step_wait')}</label>
                                                    <div className="flex gap-2">
                                                        <input type="number" min="0" value={step.delayDays} onChange={e => handleStepChange(step.id, 'delayDays', parseInt(e.target.value))} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg" />
                                                         <span className="p-2 text-dark-text-secondary">{t('automations.step_days')}</span>
                                                        <input type="number" min="0" max="23" value={step.delayHours} onChange={e => handleStepChange(step.id, 'delayHours', parseInt(e.target.value))} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg" />
                                                         <span className="p-2 text-dark-text-secondary">{t('automations.step_hours')}</span>
                                                    </div>
                                                </div>
                                                 <div className="col-span-2">
                                                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">{t('automations.step_send_message')}</label>
                                                    <select value={step.templateId} onChange={e => handleStepChange(step.id, 'templateId', e.target.value)} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary">
                                                        <option value="">{t('automations.step_select_template')}</option>
                                                        {mockTemplates.filter(t => t.approvalStatus === 'Approved').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                    </select>
                                                </div>
                                             </div>
                                         </Card>
                                     ))}
                                     <Button variant="secondary" onClick={addStep} icon={<i className="fa-solid fa-plus"></i>}>{t('automations.add_step')}</Button>
                                 </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8 space-x-4 rtl:space-x-reverse flex-shrink-0">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('automations.cancel_button')}</Button>
                            <Button onClick={handleSave}>{t('automations.save_button')}</Button>
                        </div>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default Automations;