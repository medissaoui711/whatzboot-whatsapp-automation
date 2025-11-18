import React from 'react';
import Card from '@/components/ui/Card';

type ChangeType = 'increase' | 'decrease' | 'neutral';

type DashboardCardProps = {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: string;
};

const changeTypeClasses: Record<ChangeType, string> = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-dark-text-secondary',
};

const changeIcon: Record<ChangeType, string> = {
    increase: 'fa-solid fa-arrow-trend-up',
    decrease: 'fa-solid fa-arrow-trend-down',
    neutral: 'fa-solid fa-minus',
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, changeType, icon }) => {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-text-secondary">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-border">
            <i className={`${icon} text-lg text-whatsapp-green`}></i>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-dark-text-primary">{value}</p>
        <div className="mt-1 flex items-center text-sm">
          <i className={`${changeIcon[changeType]} mr-1 ${changeTypeClasses[changeType]}`}></i>
          <span className={changeTypeClasses[changeType]}>{change}</span>
          <span className="ml-1 text-dark-text-secondary">vs last month</span>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
