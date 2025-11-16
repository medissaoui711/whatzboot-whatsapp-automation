import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

const AccountWarmup: React.FC = () => {
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [delay, setDelay] = useState(5);
  const [contacts, setContacts] = useState('');
  const [messages, setMessages] = useState('');
  const { t, dir } = useLanguage();
  const intervalRef = useRef<number | null>(null);

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const startWarmup = () => {
    if (!contacts.trim() || !messages.trim()) {
      alert("Please provide contacts and messages for the warm-up process.");
      return;
    }
    setIsWarmingUp(true);
    addLog("Warm-up process started.");

    const contactList = contacts.trim().split('\n');
    const messageList = messages.trim().split('\n');

    intervalRef.current = window.setInterval(() => {
      const randomContact = contactList[Math.floor(Math.random() * contactList.length)];
      const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
      addLog(`Sending message "${randomMessage}" to ${randomContact}...`);
      setTimeout(() => addLog(`Message sent successfully.`), 500);
    }, delay * 60 * 1000);
  };

  const stopWarmup = () => {
    setIsWarmingUp(false);
    addLog("Warm-up process stopped by user.");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.account_warmup.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.account_warmup.subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.account_warmup.contacts_label')}</h3>
                <textarea
                    value={contacts}
                    onChange={(e) => setContacts(e.target.value)}
                    rows={8}
                    className={`w-full mt-4 p-3 bg-dark-input border border-dark-border rounded-lg font-mono text-dark-text-primary placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
                    placeholder={t('tools.account_warmup.contacts_placeholder')}
                ></textarea>
            </Card>
             <Card>
                <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.account_warmup.messages_label')}</h3>
                <textarea
                    value={messages}
                    onChange={(e) => setMessages(e.target.value)}
                    rows={8}
                    className={`w-full mt-4 p-3 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
                    placeholder={t('tools.account_warmup.messages_placeholder')}
                ></textarea>
            </Card>
        </div>
        <Card>
            <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.account_warmup.settings_title')}</h3>
            <div className="mt-4 space-y-4">
                 <div>
                    <label htmlFor="delay-range" className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>
                        {t('tools.account_warmup.delay_label')}: <span className="font-bold text-whatsapp-green">{delay}</span>
                    </label>
                    <input
                        id="delay-range"
                        type="range"
                        min="1"
                        max="60"
                        value={delay}
                        onChange={(e) => setDelay(Number(e.target.value))}
                        className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer accent-whatsapp-green"
                    />
                </div>
            </div>
             <div className="mt-6">
                {isWarmingUp ? (
                    <Button onClick={stopWarmup} variant="danger" className="w-full" icon={<i className="fa-solid fa-stop"></i>}>
                        {t('tools.account_warmup.stop_button')}
                    </Button>
                ) : (
                    <Button onClick={startWarmup} className="w-full" icon={<i className="fa-solid fa-play"></i>}>
                        {t('tools.account_warmup.start_button')}
                    </Button>
                )}
            </div>
             <h3 className="text-xl font-semibold text-dark-text-primary mt-8 mb-4">{t('tools.account_warmup.log_title')}</h3>
             <div className="bg-dark-input p-4 rounded-lg h-80 overflow-y-auto font-mono text-sm text-dark-text-secondary border border-dark-border">
                {log.length > 0 ? log.map((line, index) => <p key={index}>{line}</p>) : <p>{t('tools.auto_group_joiner.log_placeholder')}</p>}
             </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountWarmup;
