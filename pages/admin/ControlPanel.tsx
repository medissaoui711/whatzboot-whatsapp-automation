import React, { useState, useEffect, useMemo, DragEvent } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { useToast } from '../../components/contexts/ToastContext';
import { useSiteSettings } from '../../components/contexts/SiteSettingsContext';
import { HeroSettings, SectionSettings } from '../../types';
import { ALL_NAV_ITEMS } from '../../data/nav.data';

const ControlPanel: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const { settings, updateHeroSettings, updateSections, resetSettings } = useSiteSettings();

    const [hero, setHero] = useState<HeroSettings>({ titleKey: '', subtitleKey: '' });
    const [sections, setSections] = useState<SectionSettings[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        if (settings) {
            setHero(settings.hero);
            setSections(settings.sections);
        }
    }, [settings]);

    const sectionDetailsMap = useMemo(() => {
        return new Map(ALL_NAV_ITEMS.map(item => [item.path, { nameKey: item.nameKey, icon: item.icon }]));
    }, []);

    const orderedSections = useMemo(() => {
        return [...sections].sort((a, b) => a.order - b.order);
    }, [sections]);

    const handleHeroSave = () => {
        updateHeroSettings(hero);
        addToast(t('notifications.settings_saved'), { type: 'success' });
    };
    
    const handleVisibilityChange = (path: string, visible: boolean) => {
        const newSections = sections.map(s => s.path === path ? { ...s, visible } : s);
        updateSections(newSections);
    };

    const handleDragStart = (e: DragEvent<HTMLLIElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragOver = (e: DragEvent<HTMLLIElement>) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if(draggedItemIndex === null || draggedItemIndex === index) {
            setDraggedItemIndex(null);
            return;
        };

        const draggedItem = orderedSections[draggedItemIndex];
        const newOrderedList = orderedSections.filter((_, i) => i !== draggedItemIndex);
        newOrderedList.splice(index, 0, draggedItem);
        
        const newSectionsWithOrder = newOrderedList.map((section, newIndex) => {
            const originalSection = sections.find(s => s.path === section.path)!;
            return { ...originalSection, order: newIndex };
        });
        
        updateSections(newSectionsWithOrder);
        addToast(t('notifications.settings_saved'), { type: 'success' });
        setDraggedItemIndex(null);
    };
    
    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    if (!settings) {
        return <div>Loading settings...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-semibold text-dark-text-primary">{t('control_panel.title')}</h2>
                    <p className="mt-2 text-dark-text-secondary">{t('control_panel.subtitle')}</p>
                </div>
                 <Button onClick={resetSettings} variant="danger" icon={<i className="fa-solid fa-undo"></i>}>
                    {t('control_panel.reset_button')}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('control_panel.hero_section_title')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-1">{t('control_panel.hero_title_label')}</label>
                            <input type="text" value={hero.titleKey} onChange={e => setHero({...hero, titleKey: e.target.value})} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg" />
                             <p className="text-xs text-dark-text-secondary mt-1">{t('control_panel.translation_key_note')}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-1">{t('control_panel.hero_subtitle_label')}</label>
                            <input type="text" value={hero.subtitleKey} onChange={e => setHero({...hero, subtitleKey: e.target.value})} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg" />
                        </div>
                    </div>
                    <Button onClick={handleHeroSave} className="mt-6 w-full">{t('common.save_button')}</Button>
                </Card>
                <Card>
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-2">{t('control_panel.sections_title')}</h3>
                    <p className="text-sm text-dark-text-secondary mb-4">{t('control_panel.reorder_tip')}</p>
                    <ul className="space-y-2">
                        {orderedSections.map((section, index) => (
                            <li key={section.path}
                                draggable
                                onDragStart={e => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center p-3 bg-dark-input rounded-lg border border-dark-border cursor-grab transition-opacity ${draggedItemIndex === index ? 'opacity-50' : ''}`}
                            >
                                <i className="fa-solid fa-grip-vertical text-dark-text-secondary me-3"></i>
                                <span className="w-6 text-center text-lg flex-shrink-0 text-dark-text-secondary">{sectionDetailsMap.get(section.path)?.icon}</span>
                                <span className="mx-4 font-semibold text-dark-text-primary flex-grow">{t(sectionDetailsMap.get(section.path)?.nameKey ?? section.path)}</span>
                                <label htmlFor={`vis-${section.path}`} className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id={`vis-${section.path}`} className="sr-only peer" checked={section.visible} onChange={(e) => handleVisibilityChange(section.path, e.target.checked)} />
                                    <div className="w-11 h-6 bg-dark-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] rtl:peer-checked:after:-translate-x-full rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                                </label>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default ControlPanel;
