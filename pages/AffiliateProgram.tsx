
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from '../components/contexts/UserContext';
import { useToast } from '../components/contexts/ToastContext';
import { AffiliateStats, Referral } from '../types';
import Skeleton, { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { initialStats, initialReferrals } from '../data/referrals.data';

const ITEMS_PER_PAGE = 10;

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
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

const AffiliateProgram: React.FC = () => {
    const { t, dir } = useLanguage();
    const { user } = useUser();
    const { addToast } = useToast();
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const referralLink = `https://whatzboot.com/register?ref=${user?.id || 'user'}`;
    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { // Simulate data fetch
            setStats(initialStats);
            setReferrals(initialReferrals);
            setIsLoading(false);
        }, 1500);
    }, []);
    
    const filteredReferrals = useMemo(() => {
        return referrals.filter(ref => 
            ref.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [referrals, searchTerm]);

    const totalPages = Math.ceil(filteredReferrals.length / ITEMS_PER_PAGE);

    const paginatedReferrals = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredReferrals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredReferrals, currentPage]);


    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        addToast(t('notifications.referral_link_copied'), { type: 'success' });
    };
    
    const statusColors: { [key in Referral['status']]: string } = {
        Pending: 'bg-yellow-500/20 text-yellow-300',
        Subscribed: 'bg-green-500/20 text-green-300',
        Canceled: 'bg-red-500/20 text-red-300',
    };

    const renderReferralsTable = () => {
        if (isLoading) return <SkeletonTable rows={5} cols={4} />;
        if (referrals.length === 0) return (
            <EmptyState
                icon={<i className="fa-solid fa-users-viewfinder"></i>}
                title={t('empty_states.no_referrals_title')}
                message={t('empty_states.no_referrals_message')}
            />
        );
        if (paginatedReferrals.length === 0 && searchTerm) {
             return (
                <EmptyState
                  icon={<i className="fa-solid fa-search"></i>}
                  title={t('empty_states.no_results_title')}
                  message={t('empty_states.no_results_message')}
                />
            );
        }

        return (
             <div className="overflow-x-auto">
                <table className={`w-full min-w-max ${textAlignmentClass}`}>
                    <thead className="bg-white/5">
                        <tr>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('affiliate_program.table_user')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('affiliate_program.table_signup_date')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('affiliate_program.table_status')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('affiliate_program.table_commission')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedReferrals.map(ref => (
                             <tr key={ref.id} className="border-b border-dark-border hover:bg-white/5">
                                <td className="p-4 text-dark-text-primary font-mono text-sm">{ref.email}</td>
                                <td className="p-4 text-dark-text-secondary">{ref.signupDate}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-md font-semibold ${statusColors[ref.status]}`}>
                                        {t(`affiliate_program.status_${ref.status.toLowerCase()}`)}
                                    </span>
                                </td>
                                <td className="p-4 text-green-400 font-semibold">${ref.commission.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <div className="text-center">
                <i className="fa-solid fa-handshake-angle text-5xl text-whatsapp-green mb-4"></i>
                <h2 className="text-3xl font-semibold text-dark-text-primary">{t('affiliate_program.title')}</h2>
                <p className="mt-2 text-dark-text-secondary max-w-3xl mx-auto">{t('affiliate_program.subtitle')}</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-5">
                 {isLoading || !stats ? (
                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)
                ) : (
                    <>
                        <StatCard title={t('affiliate_program.stats_clicks')} value={stats.clicks} icon={<i className="fa-solid fa-mouse-pointer text-white text-xl"></i>} color="bg-blue-500" />
                        <StatCard title={t('affiliate_program.stats_signups')} value={stats.signups} icon={<i className="fa-solid fa-user-plus text-white text-xl"></i>} color="bg-purple-500" />
                        <StatCard title={t('affiliate_program.stats_conversion_rate')} value={`${stats.conversionRate}%`} icon={<i className="fa-solid fa-percent text-white text-xl"></i>} color="bg-yellow-500" />
                        <StatCard title={t('affiliate_program.stats_total_earnings')} value={`$${stats.totalEarnings.toFixed(2)}`} icon={<i className="fa-solid fa-sack-dollar text-white text-xl"></i>} color="bg-green-500" />
                        <StatCard title={t('affiliate_program.stats_pending_payout')} value={`$${stats.pendingPayout.toFixed(2)}`} icon={<i className="fa-solid fa-hourglass-half text-white text-xl"></i>} color="bg-orange-500" />
                    </>
                )}
            </div>
            
            {/* Referral Link & Terms */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    <Card>
                        <label className={`block text-sm font-medium text-dark-text-secondary mb-2 ${textAlignmentClass}`}>{t('affiliate_program.your_referral_link')}</label>
                         <div className="flex rounded-md shadow-sm">
                            <input type="text" readOnly value={referralLink} className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none bg-dark-input border border-dark-border text-dark-text-secondary font-mono ${dir === 'rtl' ? 'rounded-r-md' : 'rounded-l-md'}`} />
                            <Button onClick={handleCopyLink} className={dir === 'rtl' ? '!rounded-r-none !rounded-l-md' : '!rounded-l-none !rounded-r-md'} icon={<i className="fa-solid fa-copy"></i>}>
                                {t('affiliate_program.copy_link_button')}
                            </Button>
                         </div>
                    </Card>
                </div>
                <Card>
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-3">{t('affiliate_program.terms_title')}</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                            <i className="fa-solid fa-percent text-green-400 mt-1"></i>
                            <div>
                                <h4 className="font-semibold text-dark-text-primary">{t('affiliate_program.term_commission_rate')}</h4>
                                <p className="text-dark-text-secondary">{t('affiliate_program.term_commission_rate_desc')}</p>
                            </div>
                        </div>
                         <div className="flex items-start space-x-3 rtl:space-x-reverse">
                            <i className="fa-solid fa-cookie-bite text-yellow-400 mt-1"></i>
                            <div>
                                <h4 className="font-semibold text-dark-text-primary">{t('affiliate_program.term_cookie_duration')}</h4>
                                <p className="text-dark-text-secondary">{t('affiliate_program.term_cookie_duration_desc')}</p>
                            </div>
                        </div>
                         <div className="flex items-start space-x-3 rtl:space-x-reverse">
                            <i className="fa-solid fa-money-check-dollar text-blue-400 mt-1"></i>
                            <div>
                                <h4 className="font-semibold text-dark-text-primary">{t('affiliate_program.term_payouts')}</h4>
                                <p className="text-dark-text-secondary">{t('affiliate_program.term_payouts_desc')}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Referrals Table */}
            <Card className="mt-8">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h3 className="text-xl font-semibold text-dark-text-primary">{t('affiliate_program.referrals_title')}</h3>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder={`${t('common.search')}...`}
                        className="w-full sm:w-72 p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary placeholder:text-dark-text-secondary"
                    />
                </div>
                {renderReferralsTable()}
            </Card>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default AffiliateProgram;
