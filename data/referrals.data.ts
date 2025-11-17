
import { AffiliateStats, Referral } from '../types';

export const initialStats: AffiliateStats = {
    clicks: 482,
    signups: 38,
    conversionRate: 7.88,
    totalEarnings: 450.80,
    pendingPayout: 112.70,
};

export const initialReferrals: Referral[] = [
    { id: 'ref1', email: 'new.user.1@example.com', signupDate: '2024-07-20', status: 'Subscribed', commission: 14.70 },
    { id: 'ref2', email: 'another.user@example.com', signupDate: '2024-07-18', status: 'Subscribed', commission: 14.70 },
    { id: 'ref3', email: 'trial.user@example.com', signupDate: '2024-07-15', status: 'Pending', commission: 0.00 },
    { id: 'ref4', email: 'past.customer@example.com', signupDate: '2024-06-10', status: 'Canceled', commission: 29.40 },
    { id: 'ref5', email: 'latest.signup@example.com', signupDate: '2024-07-21', status: 'Pending', commission: 0.00 },
];
