import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import { useLanguage } from '../i18n/LanguageContext';
import { categorizeSearchQuery } from '../services/geminiService';
import { GlobalSearchResults, GlobalSearchResultItem } from '../types';

// Mock data imports for client-side search demonstration
import { initialBots, initialContacts, initialPerformance } from '../data/mockData';
import Button from './ui/Button';

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