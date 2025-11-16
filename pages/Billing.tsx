import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Invoice } from '../types';

const initialInvoices: Invoice[] = [
    { id: 'inv_1', date: '2024-07-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_2', date: '2024-06-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_3', date: '2024-05-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_4', date: '2024-04-01', amount: 49.00, status: 'Paid' },
    { id: 'inv_5', date: '2024-03-01', amount: 49.00, status: 'Failed' },
];

const Billing: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, dir } = useLanguage();
    
    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { // Simulate fetching data
            setInvoices(initialInvoices);
            setIsLoading(false);
        }, 1000);
    }, []);

    const nextInvoiceDate = new Date();
    nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
    nextInvoiceDate.setDate(1);

    const renderInvoiceHistory = () => {
        if (isLoading) return <SkeletonTable rows={5} cols={4} />;
        if (invoices.length === 0) return (
            <EmptyState
                icon={<i className="fa-solid fa-file-invoice-dollar"></i>}
                title={t('empty_states.no_invoices_title')}
                message={t('empty_states.no_invoices_message')}
            />
        );
        return (
             <div className="overflow-x-auto">
                <table className={`w-full min-w-max ${textAlignmentClass}`}>
                    <thead className="bg-white/5">
                        <tr>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('billing.table_date')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('billing.table_amount')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('billing.table_status')}</th>
                            <th className="p-4 font-semibold text-dark-text-secondary">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="border-b border-dark-border hover:bg-white/5">
                                <td className="p-4 text-dark-text-primary">{invoice.date}</td>
                                <td className="p-4 text-dark-text-secondary">${invoice.amount.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-sm rounded-full ${invoice.status === 'Paid' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                        {t(`billing.status_${invoice.status.toLowerCase()}`)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Button variant="secondary" size="sm" icon={<i className="fa-solid fa-download"></i>}>
                                        {t('billing.download_invoice')}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-dark-text-primary">{t('billing.title')}</h2>
            <p className="mt-2 text-dark-text-secondary">{t('billing.subtitle')}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-dark-text-primary">{t('billing.current_plan_title')}</h3>
                                <div className="mt-4">
                                    <p className="text-3xl font-bold text-white">{t('billing.pro_plan')}</p>
                                    <p className="text-dark-text-secondary font-semibold">{t('billing.plan_price')}</p>
                                </div>
                                <p className="text-sm text-dark-text-secondary mt-2">
                                    {t('billing.next_invoice', { date: nextInvoiceDate.toLocaleDateString() })}
                                </p>
                            </div>
                            <Button>{t('billing.change_plan_button')}</Button>
                        </div>
                    </Card>
                     <Card>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-dark-text-primary">{t('billing.payment_method_title')}</h3>
                                <div className="mt-4 flex items-center space-x-4 rtl:space-x-reverse">
                                    <i className="fa-brands fa-cc-visa text-4xl text-white"></i>
                                    <div>
                                        <p className="font-semibold text-dark-text-primary">{t('billing.card_ending_in', { last4: '4242' })}</p>
                                        <p className="text-sm text-dark-text-secondary">{t('billing.expires_on', { date: '12/26' })}</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary">{t('billing.update_payment_button')}</Button>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                     <Card className="h-full">
                         <h3 className="text-xl font-semibold text-dark-text-primary">Summary</h3>
                         <div className="mt-4 space-y-3 text-dark-text-secondary">
                             <div className="flex justify-between"><span>Plan</span><span>Pro Monthly</span></div>
                             <div className="flex justify-between"><span>Users</span><span>2 / 5 Seats</span></div>
                             <div className="flex justify-between border-t border-dark-border pt-3 mt-3">
                                <span className="font-semibold text-dark-text-primary">Next Payment</span>
                                <span className="font-semibold text-white">$49.00</span>
                             </div>
                         </div>
                     </Card>
                </div>
            </div>

            <Card className="mt-8">
                <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('billing.billing_history_title')}</h3>
                {renderInvoiceHistory()}
            </Card>
        </div>
    );
};

export default Billing;