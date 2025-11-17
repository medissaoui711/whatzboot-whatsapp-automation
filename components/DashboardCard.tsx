
import React from 'react';
import Card from './ui/Card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
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
};

export default React.memo(DashboardCard);
