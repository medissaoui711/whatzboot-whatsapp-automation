import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';

const GoogleContactsTool: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [source, setSource] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('Marketing Team');
  const { t, dir } = useLanguage();

  const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
        const headers = "Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,Phone 1 - Type,Phone 1 - Value";
        const contacts = [
            `"John Doe", "John", "", "Doe", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "WhatsApp Contact", "", "", "* myContacts", "Mobile", "+1234567890"`,
            `"Jane Smith", "Jane", "", "Smith", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "From group: ${selectedGroup}", "", "", "* myContacts", "Mobile", "+0987654321"`
        ];
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + contacts.join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "whatzboot_google_contacts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsGenerating(false);
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-dark-text-primary">{t('tools.google_contacts_tool.title')}</h2>
      <p className="mt-2 text-dark-text-secondary">{t('tools.google_contacts_tool.subtitle')}</p>

      <Card className="mt-8 max-w-2xl mx-auto">
        <div className="text-center">
            <i className="fa-solid fa-file-csv text-7xl text-whatsapp-green"></i>
            <h3 className="mt-4 text-2xl font-semibold text-dark-text-primary">{t('tools.google_contacts_tool.generate_button')}</h3>
        </div>
        
        <div className={`mt-6 space-y-4 ${textAlignmentClass}`}>
            <div>
              <label htmlFor="source-select" className="block text-sm font-medium text-dark-text-secondary">{t('tools.google_contacts_tool.source_label')}</label>
              <select id="source-select" value={source} onChange={e => setSource(e.target.value)} className={`mt-1 block w-full px-3 py-2 bg-dark-input border border-dark-border rounded-md shadow-sm text-dark-text-primary focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green ${textAlignmentClass}`}>
                <option value="all">{t('tools.google_contacts_tool.source_all')}</option>
                <option value="group">{t('tools.google_contacts_tool.source_group')}</option>
              </select>
            </div>
            
            {source === 'group' && (
                 <div>
                    <label htmlFor="group-select" className="block text-sm font-medium text-dark-text-secondary">{t('group_manager.select_group')}</label>
                    <select 
                        id="group-select"
                        value={selectedGroup} 
                        onChange={e => setSelectedGroup(e.target.value)}
                        className={`mt-1 block w-full p-2 border border-dark-border rounded-lg bg-dark-input text-dark-text-primary ${textAlignmentClass}`}
                    >
                        <option>Marketing Team</option>
                        <option>Sales Q4 Campaign</option>
                        <option>Product Feedback</option>
                    </select>
                </div>
            )}
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-8" icon={<i className="fa-solid fa-download"></i>}>
            {isGenerating ? t('tools.google_contacts_tool.generating_button') : t('tools.google_contacts_tool.generate_button')}
        </Button>
      </Card>
    </div>
  );
};

export default GoogleContactsTool;
