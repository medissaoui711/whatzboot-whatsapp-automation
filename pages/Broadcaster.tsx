

import React, { useState, useRef } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/contexts/ToastContext';
import { MessageTemplate } from '../types';
import { generateBroadcastMessage } from '../services/geminiService';

const Broadcaster: React.FC = () => {
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [templates, setTemplates] = useState<MessageTemplate[]>([
      { id: '1', name: 'Monthly Promotion', message: 'Hello! Check out our monthly promotion for a 20% discount!', approvalStatus: 'Approved' },
      { id: '2', name: 'Holiday Greeting', message: 'Happy holidays from the WhatzBoot team!', approvalStatus: 'Approved' },
  ]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, dir } = useLanguage();
  const { addToast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleSendBroadcast = () => {
    if (!message) {
        addToast(t('validation.compose_message'), { type: 'error' });
        return;
    }
    if (!fileName) {
        addToast(t('validation.upload_csv'), { type: 'error' });
        return;
    }

    if (isScheduled) {
        addToast(t('notifications.broadcast_scheduled'), { type: 'success' });
    } else {
        addToast(t('notifications.broadcast_sent'), { type: 'success' });
    }
  };

  const handleSaveTemplate = () => {
    if (!message) {
        addToast(t('validation.compose_message'), { type: 'error' });
        return;
    }
    setIsTemplateModalOpen(true);
  };
  
  const confirmSaveTemplate = () => {
     if (!newTemplateName.trim()) {
        addToast(t('validation.required'), { type: 'error' });
        return;
    }
    // In a real app, this would save to a shared state/backend
    // For now, it just adds to the local list.
    addToast(t('notifications.template_saved'), { type: 'success' });
    setIsTemplateModalOpen(false);
    setNewTemplateName('');
  }

  const handleLoadTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId);
    if (template) {
        setMessage(template.message);
    }
  }

  const handleGenerateAiMessage = async () => {
    if (!aiPrompt.trim()) {
        addToast(t('validation.required'), {type: 'error'});
        return;
    }
    setIsGenerating(true);
    setGeneratedMessage('');
    try {
        const result = await generateBroadcastMessage(aiPrompt);
        setGeneratedMessage(result);
        addToast(t('notifications.broadcast_message_generated'), {type: 'success'});
    } catch (error) {
        addToast(t('notifications.generic_error'), {type: 'error'});
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleUseAiMessage = () => {
      setMessage(generatedMessage);
      setIsAiModalOpen(false);
  };

  const openAiModal = () => {
    setAiPrompt('');
    setGeneratedMessage('');
    setIsAiModalOpen(true);
  };

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('broadcaster.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('broadcaster.subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-dark-text-primary">{t('broadcaster.compose_title')}</h3>
                     <Button variant="secondary" size="sm" onClick={openAiModal} icon={<i className="fa-solid fa-wand-magic-sparkles"></i>}>
                        {t('broadcaster.ai_assistant_button')}
                    </Button>
                </div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={10}
                    className={`w-full mt-4 p-3 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
                    placeholder={t('broadcaster.compose_placeholder')}
                ></textarea>
                <div className="flex justify-between items-center mt-4">
                     <div className="flex items-center space-x-2 rtl:space-x-reverse">
                         <label htmlFor="template-select" className="sr-only">{t('broadcaster.load_template')}</label>
                         <select id="template-select" onChange={handleLoadTemplate} className={`p-2 border border-dark-border rounded-lg bg-dark-input text-dark-text-primary text-sm ${textAlignmentClass}`}>
                            <option value="">{t('broadcaster.load_template')}</option>
                            {templates.filter(t => t.approvalStatus === 'Approved').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                         </select>
                     </div>
                     <Button variant="secondary" size="sm" onClick={handleSaveTemplate} icon={<i className="fa-solid fa-save"></i>}>
                        {t('broadcaster.save_template')}
                    </Button>
                </div>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <h3 className="text-xl font-semibold text-dark-text-primary">{t('broadcaster.audience_title')}</h3>
                <div 
                    className="mt-4 border-2 border-dashed border-dark-border rounded-lg p-6 text-center cursor-pointer hover:border-whatsapp-green"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <i className="fa-solid fa-file-csv text-4xl text-dark-text-secondary"></i>
                    <p className="mt-2 text-dark-text-secondary">
                        {fileName ? fileName : t('broadcaster.audience_upload')}
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv"
                    />
                </div>
                <p className="text-xs text-dark-text-secondary mt-2">{t('broadcaster.audience_hint')}</p>
            </Card>
             <Card>
                <h3 className="text-xl font-semibold text-dark-text-primary">{t('broadcaster.scheduling_title')}</h3>
                <div className="flex items-center justify-between mt-4">
                    <label htmlFor="schedule-toggle" className="text-dark-text-secondary">{t('broadcaster.schedule_toggle')}</label>
                    <label htmlFor="schedule-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="schedule-toggle" className="sr-only peer" checked={isScheduled} onChange={() => setIsScheduled(!isScheduled)} />
                        <div className="w-11 h-6 bg-dark-border rounded-full peer peer-focus:ring-4 peer-focus:ring-whatsapp-green/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] rtl:peer-checked:after:-translate-x-full rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                    </label>
                </div>
                {isScheduled && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary" />
                        <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary" />
                    </div>
                )}
                 <Button 
                    onClick={handleSendBroadcast} 
                    className="w-full mt-6"
                    icon={<i className={`fa-solid ${isScheduled ? 'fa-clock' : 'fa-paper-plane'}`}></i>}
                >
                    {isScheduled ? t('broadcaster.schedule_broadcast') : t('broadcaster.send_now')}
                </Button>
            </Card>
        </div>
      </div>
      
      {isTemplateModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4 text-dark-text-primary">{t('broadcaster.template_modal_title')}</h3>
                <input 
                    type="text" 
                    value={newTemplateName} 
                    onChange={e => setNewTemplateName(e.target.value)} 
                    placeholder={t('broadcaster.template_name_placeholder')} 
                    className={`w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`}
                />
            <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
              <Button variant="secondary" onClick={() => setIsTemplateModalOpen(false)}>{t('auto_responder.modal_cancel')}</Button>
              <Button onClick={confirmSaveTemplate}>{t('auto_responder.modal_save')}</Button>
            </div>
          </Card>
        </div>
      )}

       {isAiModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <Card className="w-full max-w-lg">
            <h3 className="text-2xl font-semibold mb-4 text-dark-text-primary">{t('broadcaster.ai_modal_title')}</h3>
            <div className="space-y-4">
                <div>
                    <label className={`block text-sm font-medium text-dark-text-secondary mb-1 ${textAlignmentClass}`}>{t('broadcaster.ai_modal_prompt')}</label>
                    <textarea 
                        value={aiPrompt} 
                        onChange={e => setAiPrompt(e.target.value)} 
                        placeholder={t('broadcaster.ai_modal_placeholder')} 
                        rows={3}
                        className={`w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary ${textAlignmentClass}`}
                    />
                </div>
                <Button onClick={handleGenerateAiMessage} disabled={isGenerating} className="w-full" icon={<i className="fa-solid fa-wand-magic-sparkles"></i>}>
                    {isGenerating ? t('auto_responder.modal_generating') : t('broadcaster.ai_modal_generate')}
                </Button>
                 {isGenerating && (
                    <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
                    </div>
                )}
                {generatedMessage && (
                    <div className="mt-4">
                        <label className={`block text-sm font-medium text-dark-text-secondary mb-1 ${textAlignmentClass}`}>{t('common.results')}</label>
                        <div className="p-4 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary whitespace-pre-wrap">{generatedMessage}</div>
                        <Button onClick={handleUseAiMessage} className="w-full mt-4">{t('broadcaster.ai_modal_use_message')}</Button>
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setIsAiModalOpen(false)}>{t('auto_responder.modal_cancel')}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Broadcaster;