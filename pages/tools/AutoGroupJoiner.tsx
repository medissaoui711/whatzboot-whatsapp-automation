import React, { useState, useRef } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

const AutoGroupJoiner: React.FC = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [links, setLinks] = useState('');
  const [delay, setDelay] = useState(5);
  const [log, setLog] = useState<string[]>([]);
  const { t, dir } = useLanguage();
  const logRef = useRef<HTMLDivElement>(null);
  
  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const addLog = (message: string) => {
    setLog(prevLog => [...prevLog, message]);
    setTimeout(() => {
        if(logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, 100);
  };
  
  const handleJoin = async () => {
    const linkList = links.split('\n').filter(link => link.trim() !== '');
    if (linkList.length === 0) {
      alert("Please paste some group links.");
      return;
    }
    
    setIsJoining(true);
    setLog([]);
    addLog("Starting auto-join process...");

    for (let i = 0; i < linkList.length; i++) {
      const link = linkList[i];
      addLog(`Attempting to join group from link: ${link.substring(0, 30)}...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        addLog(`-> Successfully joined group.`);
      } else {
        addLog(`-> Failed to join group. It might be full or the link is invalid.`);
      }

      if (i < linkList.length - 1) {
        addLog(`Waiting for ${delay} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
      }
    }

    addLog("Auto-join process finished.");
    setIsJoining(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.auto_group_joiner.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.auto_group_joiner.subtitle')}</p>

      <Card className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-dark-text-primary">{t('common.settings')}</h3>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="group-links" className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.auto_group_joiner.links_label')}</label>
                        <textarea
                            id="group-links"
                            value={links}
                            onChange={(e) => setLinks(e.target.value)}
                            rows={10}
                            className={`w-full mt-1 p-3 bg-dark-input border border-dark-border rounded-lg font-mono text-dark-text-primary placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
                            placeholder={t('tools.auto_group_joiner.links_placeholder')}
                        />
                    </div>
                     <div>
                        <label htmlFor="delay-input" className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.auto_group_joiner.delay_label')}</label>
                         <input
                            id="delay-input"
                            type="number"
                            min="1"
                            value={delay}
                            onChange={(e) => setDelay(Number(e.target.value))}
                            className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`}
                        />
                    </div>
                </div>
                 <Button onClick={handleJoin} disabled={isJoining} className="w-full mt-6" icon={<i className="fa-solid fa-person-walking-arrow-right"></i>}>
                    {isJoining ? t('tools.auto_group_joiner.joining_button') : t('tools.auto_group_joiner.start_button')}
                </Button>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.auto_group_joiner.log_title')}</h3>
                <div ref={logRef} className="mt-4 bg-dark-input p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm text-dark-text-secondary border border-dark-border">
                    {log.length > 0 ? log.map((line, index) => <p key={index}>{line}</p>) : <p>{t('tools.auto_group_joiner.log_placeholder')}</p>}
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default AutoGroupJoiner;
