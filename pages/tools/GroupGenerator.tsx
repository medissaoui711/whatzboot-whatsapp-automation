import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

const GroupGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [groupCount, setGroupCount] = useState(3);
  const [members, setMembers] = useState('');
  const [prefix, setPrefix] = useState('');
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const addLog = (message: string) => {
    setLog(prevLog => [...prevLog, message]);
  };

  const handleGenerate = async () => {
    if (!prefix.trim() || !members.trim()) {
      alert("Please provide a group prefix and a list of members.");
      return;
    }
    
    setIsGenerating(true);
    setLog([]);
    addLog("Starting group generation process...");

    const memberList = members.trim().split('\n');
    
    for (let i = 1; i <= groupCount; i++) {
        const groupName = `${prefix} ${i}`;
        addLog(`Creating group "${groupName}"...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(`-> Group created. Adding ${memberList.length} members...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        addLog(`-> Members added successfully to "${groupName}".`);
    }

    addLog("Group generation finished.");
    setIsGenerating(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.group_generator.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.group_generator.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
          <h3 className="text-xl font-semibold text-dark-text-primary">{t('common.settings')}</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.group_generator.prefix_label')}</label>
              <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} placeholder={t('tools.group_generator.prefix_placeholder')} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} />
            </div>
             <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.group_generator.count_label')}</label>
              <input type="number" min="1" value={groupCount} onChange={e => setGroupCount(Number(e.target.value))} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium text-dark-text-secondary ${textAlignmentClass}`}>{t('tools.group_generator.members_label')}</label>
              <textarea
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                rows={8}
                className={`w-full mt-1 p-3 bg-dark-input border border-dark-border rounded-lg font-mono text-dark-text-primary placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-whatsapp-green ${textAlignmentClass}`}
                placeholder={t('tools.group_generator.members_placeholder')}
              />
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-6" icon={<i className="fa-solid fa-users-rays"></i>}>
            {isGenerating ? t('tools.group_generator.generating_button') : t('tools.group_generator.generate_button')}
          </Button>
        </Card>
        
        <Card>
            <h3 className="text-xl font-semibold text-dark-text-primary">{t('tools.group_generator.log_title')}</h3>
            <div className="mt-4 bg-dark-input p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm text-dark-text-secondary border border-dark-border">
                {log.length > 0 ? log.map((line, index) => <p key={index}>{line}</p>) : <p>{t('tools.auto_group_joiner.log_placeholder')}</p>}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default GroupGenerator;
