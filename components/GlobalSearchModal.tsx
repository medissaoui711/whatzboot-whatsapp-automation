import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import { useLanguage } from '../i18n/LanguageContext';
import { categorizeSearchQuery } from '../services/geminiService';
import { GlobalSearchResults, GlobalSearchResultItem } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const SearchResultItem: React.FC<{ item: GlobalSearchResultItem; onClose: () => void; }> = ({ item, onClose }) => (
    <li>
        <Link to={item.path} onClick={onClose} className="block p-3 rounded-lg hover:bg-white/5 transition-colors">
            <p className="font-semibold text-dark-text-primary">{item.title}</p>
            <p className="text-sm text-dark-text-secondary">{item.description}</p>
        </Link>
    </li>
);


const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, query }) => {
  const { t } = useLanguage();
  const [isSearching, setIsSearching] = useState(true);
  const [results, setResults] = useState<GlobalSearchResults>({ contacts: [], bots: [], campaigns: [] });
  const modalRef = useRef<HTMLDivElement>(null);

  useModalAccessibility(isOpen, onClose, modalRef);

  useEffect(() => {
    if (isOpen && query) {
      performSearch(query);
    }
  }, [isOpen, query]);

  const performSearch = async (currentQuery: string) => {
    setIsSearching(true);
    setResults({ contacts: [], bots: [], campaigns: [] }); // Clear previous results

    try {
      const { category, searchTerm } = await categorizeSearchQuery(currentQuery);
      
      const lowerSearchTerm = searchTerm.toLowerCase();

      // This is a mock search, in a real app this would be an API call
      setTimeout(() => {
        const dummyContacts: GlobalSearchResultItem[] = [
            { id: '1', title: 'John Doe', description: '+1234567890', path: '/contact-manager' },
            { id: '2', title: 'Jane Smith', description: '+1987654321', path: '/contact-manager' },
        ];

        const dummyBots: GlobalSearchResultItem[] = [
            { id: '1', title: 'Welcome Bot', description: 'Triggers on: hello, hi', path: '/auto-responder' },
            { id: '2', title: 'Support Hours Bot', description: 'Triggers on: hours', path: '/auto-responder' },
        ];

        const dummyCampaigns: GlobalSearchResultItem[] = [
            { id: '1', title: 'Q4 Holiday Sale', description: 'Sent: 2023-12-15', path: '/analytics' },
            { id: '2', title: 'Black Friday Preview', description: 'Sent: 2023-11-20', path: '/analytics' },
        ];
          
        const newResults: GlobalSearchResults = { contacts: [], bots: [], campaigns: [] };

        if (category === 'contacts' || category === 'general') {
            newResults.contacts = dummyContacts.filter(c => c.title.toLowerCase().includes(lowerSearchTerm));
        }
        if (category === 'bots' || category === 'general') {
            newResults.bots = dummyBots.filter(b => b.title.toLowerCase().includes(lowerSearchTerm));
        }
        if (category === 'campaigns' || category === 'general') {
            newResults.campaigns = dummyCampaigns.filter(c => c.title.toLowerCase().includes(lowerSearchTerm));
        }

        setResults(newResults);
        setIsSearching(false);
      }, 1000); // simulate network delay

    } catch (error) {
      console.error("Error during AI search:", error);
      setIsSearching(false);
    }
  };

  if (!isOpen) {
      return null;
  }
  
  const hasResults = results.contacts.length > 0 || results.bots.length > 0 || results.campaigns.length > 0;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start pt-20 p-4" onClick={onClose}>
        <Card
            ref={modalRef}
            className="w-full max-w-2xl animate-fade-in-up max-h-[70vh] flex flex-col"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
        >
            <h2 id="global-search-title" className="text-xl font-semibold text-dark-text-primary mb-2">{t('global_search.title')}</h2>
            <p className="text-sm text-dark-text-secondary mb-4">{t('global_search.subtitle', { query })}</p>

            <div className="flex-grow overflow-y-auto -mx-6 px-6">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-green"></div>
                        <p className="mt-4 text-dark-text-secondary">{t('global_search.searching')}</p>
                    </div>
                ) : hasResults ? (
                    <div className="space-y-6">
                        {results.contacts.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-dark-text-secondary mb-2">{t('global_search.category_contacts')}</h3>
                                <ul className="space-y-2">
                                    {results.contacts.map(item => <SearchResultItem key={`contact-${item.id}`} item={item} onClose={onClose} />)}
                                </ul>
                            </div>
                        )}
                        {results.bots.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-dark-text-secondary mb-2">{t('global_search.category_bots')}</h3>
                                <ul className="space-y-2">
                                    {results.bots.map(item => <SearchResultItem key={`bot-${item.id}`} item={item} onClose={onClose} />)}
                                </ul>
                            </div>
                        )}
                        {results.campaigns.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-dark-text-secondary mb-2">{t('global_search.category_campaigns')}</h3>
                                <ul className="space-y-2">
                                    {results.campaigns.map(item => <SearchResultItem key={`campaign-${item.id}`} item={item} onClose={onClose} />)}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-dark-text-secondary py-10">{t('common.no_results')}</p>
                )}
            </div>
        </Card>
    </div>
  );
};

export default GlobalSearchModal;
