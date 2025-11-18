import React from 'react';
import EmptyState from '@/components/ui/EmptyState';

const AnalyticsPage = () => {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Analytics</h1>
      <EmptyState
        icon="fa-solid fa-chart-line"
        title="Analytics Coming Soon"
        description="We're building a powerful analytics dashboard to give you deep insights into your campaigns. Stay tuned!"
      />
    </div>
  );
};

export default AnalyticsPage;
