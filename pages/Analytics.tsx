import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../components/ui/Card';
import { useLanguage } from '../i18n/LanguageContext';
import { CampaignAnalytics, CampaignPerformance } from '../types';
import Skeleton, { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import { analyzeCampaignData } from '../services/geminiService';
import { useToast } from '../components/contexts/ToastContext';
import { initialPerformance } from '../data/performance.data';

const initialAnalytics: CampaignAnalytics = {
    totalCampaigns: 12,
    deliveryRate: 98.5,
    readRate: 75.2,
    replyRate: 15.8,
};

const ITEMS_PER_PAGE = 10;

const AnalyticsCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ms-4">
          <p className="text-sm font-medium text-dark-text-secondary uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold text-dark-text-primary">{value}</p>
        </div>
      </div>
    </Card>
);

const Analytics: React.FC = () => {
    const [stats, setStats] = useState<CampaignAnalytics | null>(null);
    const [performance, setPerformance] = useState<CampaignPerformance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const { t, dir } = useLanguage();
    const { addToast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { // Simulate fetching data
            setStats(initialAnalytics);
            setPerformance(initialPerformance);
            setIsLoading(false);
        }, 1500);
    }, []);

    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';
    
    const filteredPerformance = useMemo(() => {
        return performance.filter(campaign => 
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [performance, searchTerm]);

    const totalPages = Math.ceil(filteredPerformance.length / ITEMS_PER_PAGE);

    const paginatedPerformance = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPerformance.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPerformance, currentPage]);

    const handleAnalyze = async () => {
        setIsAnalysisModalOpen(true);
        setIsAnalyzing(true);
        setAnalysisResult('');
        try {
            const result = await analyzeCampaignData(performance);
            setAnalysisResult(result);
        } catch (error) {
            addToast(t('notifications.analysis_failed'), { type: 'error' });
            setIsAnalysisModalOpen(false);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderTable = () => {
        if (performance.length === 0) {
            return (
                 <EmptyState
                    icon={<i className="fa-solid fa-chart-pie"></i>}
                    title={t('empty_states.no_campaigns_title')}
                    message={t('empty_states.no_campaigns_message')}
                />
            )
        }
        
        return (
            <div className="overflow-x-auto">
                <table className={`w-full min-w-max ${textAlignmentClass}`}>
                    <thead className="bg-white/5">
                        <tr>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('analytics.table_campaign_name')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('analytics.table_sent_date')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('analytics.table_recipients')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('analytics.delivery_rate')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('analytics.read_rate')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('analytics.reply_rate')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPerformance.map((campaign) => (
                            <tr key={campaign.id} className="border-b border-dark-border hover:bg-white/5">
                                <td className="p-4 text-dark-text-primary font-semibold">{campaign.name}</td>
                                <td className="p-4 text-dark-text-secondary">{campaign.sentDate}</td>
                                <td className="p-4 text-dark-text-secondary">{campaign.recipients.toLocaleString()}</td>
                                <td className="p-4 text-green-400">{campaign.deliveryRate.toFixed(1)}%</td>
                                <td className="p-4 text-blue-400">{campaign.readRate.toFixed(1)}%</td>
                                <td className="p-4 text-yellow-400">{campaign.replyRate.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-semibold text-dark-text-primary">{t('analytics.title')}</h2>
                    <p className="mt-2 text-dark-text-secondary">{t('analytics.subtitle')}</p>
                </div>
                <Button onClick={handleAnalyze} disabled={isLoading || performance.length === 0} icon={<i className="fa-solid fa-wand-magic-sparkles"></i>}>
                    {t('analytics.ai_analyze_button')}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    <>
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                    </>
                ) : stats && (
                    <>
                        <AnalyticsCard title={t('analytics.total_campaigns')} value={stats.totalCampaigns.toString()} icon={<i className="fa-solid fa-bullhorn text-white text-xl"></i>} color="bg-indigo-500" />
                        <AnalyticsCard title={t('analytics.delivery_rate')} value={`${stats.deliveryRate}%`} icon={<i className="fa-solid fa-truck-fast text-white text-xl"></i>} color="bg-green-500" />
                        <AnalyticsCard title={t('analytics.read_rate')} value={`${stats.readRate}%`} icon={<i className="fa-solid fa-eye text-white text-xl"></i>} color="bg-blue-500" />
                        <AnalyticsCard title={t('analytics.reply_rate')} value={`${stats.replyRate}%`} icon={<i className="fa-solid fa-reply text-white text-xl"></i>} color="bg-yellow-500" />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                <Card className="lg:col-span-3">
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('analytics.chart_title')}</h3>
                    <div style={{ width: '100%', height: 300 }}>
                         {isLoading ? <Skeleton className="h-full" /> : (
                            <ResponsiveContainer>
                                <BarChart data={performance.slice(0, 5).reverse()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-dark-border" />
                                    <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(22, 27, 34, 0.9)', 
                                            border: '1px solid #30363d',
                                            borderRadius: '0.5rem',
                                            color: '#c9d1d9'
                                        }} 
                                    />
                                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                                    <Bar dataKey="readRate" name={t('analytics.read_rate')} fill="#34B7F1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="replyRate" name={t('analytics.reply_rate')} fill="#FFC107" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                         )}
                    </div>
                </Card>
                 <Card className="lg:col-span-2">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-dark-text-primary">{t('dashboard.tools_title')}</h3>
                        <Link to="/dashboard"><Button variant="secondary" size="sm">View All</Button></Link>
                     </div>
                      <div className="space-y-3">
                        <ToolLink icon={<i className="fa-solid fa-robot"></i>} title={t('nav.auto_responder')} path="/auto-responder" />
                        <ToolLink icon={<i className="fa-solid fa-bullhorn"></i>} title={t('nav.broadcaster')} path="/broadcaster" />
                        <ToolLink icon={<i className="fa-solid fa-map-location-dot"></i>} title={t('tools.google_maps_extractor.title')} path="/tools/google-maps-extractor" />
                        <ToolLink icon={<i className="fa-solid fa-user-check"></i>} title={t('tools.active_member_extractor.title')} path="/tools/active-member-extractor" />
                    </div>
                 </Card>
            </div>

            <Card className="mt-8">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h3 className="text-xl font-semibold text-dark-text-primary">{t('analytics.performance_title')}</h3>
                    <div className="flex items-center gap-4">
                         <input
                            type="text"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={`${t('common.search')}...`}
                            className="w-full sm:w-64 p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary"
                        />
                         {!isLoading && performance.length > 0 && <Button variant="secondary" icon={<i className="fa-solid fa-file-csv"></i>}>{t('common.export_csv')}</Button>}
                    </div>
                </div>
                 {isLoading ? <SkeletonTable rows={5} cols={6} /> : renderTable()}
            </Card>
             <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {isAnalysisModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
                     <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <h3 className="text-2xl font-semibold mb-4 text-dark-text-primary text-center">{t('analytics.ai_modal_title')}</h3>
                        <div className="overflow-y-auto flex-grow">
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center h-48">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-green"></div>
                                    <p className="mt-4 text-dark-text-secondary">{t('analytics.ai_modal_generating')}</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-p:text-dark-text-secondary prose-headings:text-dark-text-primary prose-strong:text-dark-text-primary bg-dark-input p-4 rounded-lg">
                                   <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end mt-6 flex-shrink-0">
                            <Button variant="secondary" onClick={() => setIsAnalysisModalOpen(false)}>
                                {t('analytics.ai_modal_close')}
                            </Button>
                        </div>
                     </Card>
                 </div>
            )}
        </div>
    );
};

const ToolLink: React.FC<{icon: React.ReactNode, title: string, path: string}> = ({icon, title, path}) => {
    const { dir } = useLanguage();
    return (
        <Link to={path} className="flex items-center p-3 bg-dark-input rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-dark-border">
            <span className="text-xl text-whatsapp-green">{icon}</span>
            <span className={`font-semibold text-dark-text-primary ${dir === 'rtl' ? 'mr-4' : 'ml-4'}`}>{title}</span>
            <i className={`fa-solid fa-arrow-right text-dark-text-secondary ${dir === 'rtl' ? 'mr-auto' : 'ml-auto'}`}></i>
        </Link>
    )
}

export default Analytics;