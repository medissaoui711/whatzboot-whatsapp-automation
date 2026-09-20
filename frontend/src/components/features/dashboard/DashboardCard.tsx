import React from 'react';
import Card from '@/components/ui/Card';

type ChangeType = 'increase' | 'decrease' | 'neutral';

type DashboardCardProps = {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: string;
  accent?: 'green' | 'gold' | 'blue' | 'purple';
};

const accentStyles = {
  green: {
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: 'text-emerald-400',
    highlight: 'from-emerald-500/5 to-transparent',
  },
  gold: {
    badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    icon: 'text-amber-400',
    highlight: 'from-amber-500/5 to-transparent',
  },
  blue: {
    badge: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    icon: 'text-sky-400',
    highlight: 'from-sky-500/5 to-transparent',
  },
  purple: {
    badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    icon: 'text-indigo-400',
    highlight: 'from-indigo-500/5 to-transparent',
  },
};

const changeTypeClasses: Record<ChangeType, string> = {
    increase: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    decrease: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    neutral: 'text-dark-text-secondary bg-zinc-800/40 border-zinc-700/30',
};

const changeIcon: Record<ChangeType, string> = {
    increase: 'fa-solid fa-arrow-trend-up',
    decrease: 'fa-solid fa-arrow-trend-down',
    neutral: 'fa-solid fa-minus',
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, changeType, icon, accent = 'green' }) => {
  const currentAccent = accentStyles[accent] || accentStyles.green;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-dark-border bg-gradient-to-b ${currentAccent.highlight} bg-dark-card p-4 sm:p-5 transition-all duration-200 hover:border-dark-border/90 hover:shadow-lg shadow-sm flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs sm:text-sm font-bold text-dark-text-secondary">{title}</h3>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${currentAccent.badge}`}>
          <i className={`${icon} text-base ${currentAccent.icon}`}></i>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">{value}</p>
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full border text-[11px] ${changeTypeClasses[changeType]}`}>
            <i className={changeIcon[changeType]}></i>
            <span dir="ltr">{change}</span>
          </span>
          <span className="text-[11px] text-dark-text-muted">مقارنة بالفترة السابقة</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
