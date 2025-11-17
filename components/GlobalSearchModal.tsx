import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import { useLanguage } from '../i18n/LanguageContext';
import { categorizeSearchQuery } from '../services/geminiService';
import { GlobalSearchResults, GlobalSearchResultItem, AutoResponderBot, Contact, CampaignPerformance } from '../types';

// --- Data Co-location to resolve Vite build warnings ---
// By defining the mock data here, we break the module dependency
// between this component (part of the main bundle) and the lazy-loaded pages.

const initialBots: AutoResponderBot[] = [
  { id: '1', name: 'Welcome Bot', trigger: 'hello, hi', response: 'Welcome to our service! How can I help you?', status: 'active', lastTriggered: '2 hours ago' },
  { id: '2', name: 'Support Hours Bot', trigger: 'hours, support time', response: 'Our support hours are 9 AM to 5 PM, Mon-Fri.', status: 'active', lastTriggered: '1 day ago' },
  { id: '3', name: 'Pricing Bot', trigger: 'price, pricing', response: 'You can find our pricing details at ourwebsite.com/pricing.', status: 'inactive', lastTriggered: '1 week ago' },
];

const initialContacts: Contact[] = [
  { id: '1', name: 'John Doe', phone: '+1234567890', tags: ['Lead', 'VIP'] },
  { id: '2', name: 'Jane Smith', phone: '+1987654321', tags: ['Customer'] },
  { id: '3', name: 'Peter Jones', phone: '+1122334455', tags: ['Follow-up', 'Lead'] },
];

const initialPerformance: CampaignPerformance[] = [
    { id: '1', name: 'Q4 Holiday Sale', sentDate: '2023-12-15', recipients: 1250, deliveryRate: 99.1, readRate: 82.5, replyRate: 20.3 },
    { id: '2', name: 'Black Friday Preview', sentDate: '2023-11-20', recipients: 1100, deliveryRate: 98.7, readRate: 78.1, replyRate: 18.5 },
    { id: '3', name: 'New Product Launch', sentDate: '2023-11-05', recipients: 950, deliveryRate: 97.5, readRate: 65.4, replyRate: 12.1 },
    { id: '4', name: 'October Newsletter', sentDate: '2023-10-28', recipients: 890, deliveryRate: 99.5, readRate: 71.9, replyRate: 10.5 },
    { id: '5', name: 'Customer Feedback Request', sentDate: '2023-10-10', recipients: 850, deliveryRate: 96.0, readRate: 70.1, replyRate: 22.4 },
];


interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, query }) => {
  const { t } = useLanguage();
  const [isSearching, setIsSearching] = useState(true);
  const [results, setResults] = useState<GlobalSearchResults>({ contacts: [], bots: [], campaigns: [] });

  useEffect(() => {
    if (isOpen && query) {
      performSearch(query);
    }
  }, [isOpen, query]);

  const performSearch = async (currentQuery: string) => {
    setIsSearching(true);
    try {
      const { category, searchTerm } = await categorizeSearchQuery(currentQuery);
      
      let searchResults: GlobalSearchResults = { contacts: [], bots: [], campaigns: [] };

      const lowerSearchTerm = searchTerm.toLowerCase();

      // Search Contacts
      if (category === 'contacts' || category === 'general') {
          searchResults.contacts = initialContacts
              .filter(c => c.name.toLowerCase().includes(lowerSearchTerm) || c.phone.includes(lowerSearchTerm))
              .map(c => ({ id: c.id, title: c.name, description: c.phone, path: '/contact-manager' }));
      }

      // Search Bots
      if (category === 'bots' || category === 'general') {
          searchResults.bots = initialBots
              .filter(b => b.name.toLowerCase().includes(lowerSearchTerm) || b.trigger.toLowerCase().includes(lowerSearchTerm))
              .map(b => ({ id: b.id, title: b.name, description: `Trigger: ${b.trigger}`, path: '/auto-responder' }));
      }

      // Search Campaigns
      if (category === 'campaigns' || category === 'general') {
          searchResults.campaigns = initialPerformance
              .filter(p => p.name.toLowerCase().includes(lowerSearchTerm))
              .map(p => ({ id: p.id, title: p.name, description: `Sent: ${p.sentDate}`, path: '/analytics' }));
      }

      setResults(searchResults);
    } catch (error) {
      console.error("Failed to perform global search:", error);
      // Fallback to a simple general search
      setResults({
        contacts: initialContacts
            .filter(c => c.name.toLowerCase().includes(currentQuery.toLowerCase()))
            .map(c => ({ id: c.id, title: c.name, description: c.phone, path: '/contact-manager' })),
        bots: [], campaigns: []
      });
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) {
    return null;
  }
  
  const ResultSection: React.FC<{ title: string; items: GlobalSearchResultItem[]; searchTerm: string }> = ({ title, items, searchTerm }) => {
    if (items.length === 0) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-dark-text-primary mb-2">{title}</h3>
                <p className="text-sm text-dark-text-secondary">{t('empty_states.search_no_results_for_category', { searchTerm, category: title })}</p>
            </div>
        )
    }
    return (
        <div>
            <h3 className="text-lg font-semibold text-dark-text-primary mb-2">{title} ({items.length})</h3>
            <ul className="space-y-2">
                {items.map(item => (
                    <li key={item.id}>
                        <Link 
                            to={item.path} 
                            onClick={onClose} 
                            className="block p-3 bg-dark-input rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-dark-border"
                        >
                            <p className="font-semibold text-dark-text-primary">{item.title}</p>
                            <p className="text-sm text-dark-text-secondary">{item.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start p-4 pt-20" onClick={onClose}>
      <Card className="w-full max-w-2xl animate-toast-in-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
             <div>
                <h2 className="text-xl font-bold text-dark-text-primary">{t('global_search.title')}</h2>
                <p className="text-sm text-dark-text-secondary">{t('global_search.subtitle', { query })}</p>
             </div>
             <button onClick={onClose} className="text-dark-text-secondary text-2xl">&times;</button>
        </div>
       
        {isSearching ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-green"></div>
            <p className="mt-4 text-dark-text-secondary">{t('global_search.searching')}</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <ResultSection title={t('global_search.category_contacts')} items={results.contacts} searchTerm={query} />
            <ResultSection title={t('global_search.category_bots')} items={results.bots} searchTerm={query}/>
            <ResultSection title={t('global_search.category_campaigns')} items={results.campaigns} searchTerm={query} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default GlobalSearchModal;