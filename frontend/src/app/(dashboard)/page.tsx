'use client';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import DashboardCard from '@/components/features/dashboard/DashboardCard';
import MessageChart from '@/components/features/dashboard/MessageChart';
import Card from '@/components/ui/Card';
import { performanceData } from '@/data/performance.data';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardPage = () => {
    const layout = [
        { i: 'messagesSent', x: 0, y: 0, w: 1, h: 1 },
        { i: 'messagesReceived', x: 1, y: 0, w: 1, h: 1 },
        { i: 'automationRate', x: 2, y: 0, w: 1, h: 1 },
        { i: 'groupsManaged', x: 3, y: 0, w: 1, h: 1 },
        { i: 'messagePerformance', x: 0, y: 1, w: 4, h: 3 },
    ];
    
    const layouts = { lg: layout };

    return (
        <div className="animate-fade-in-up">
            <h1 className="mb-6 text-3xl font-bold text-dark-text-primary">Dashboard</h1>
            
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 4, md: 2, sm: 1, xs: 1, xxs: 1 }}
                rowHeight={150}
                isDraggable={true}
                isResizable={true}
            >
                <div key="messagesSent">
                    <DashboardCard 
                        title="Messages Sent"
                        value="12,450"
                        change="+5.4%"
                        changeType="increase"
                        icon="fa-solid fa-paper-plane"
                    />
                </div>
                <div key="messagesReceived">
                     <DashboardCard 
                        title="Messages Received"
                        value="8,920"
                        change="-1.2%"
                        changeType="decrease"
                        icon="fa-solid fa-inbox"
                    />
                </div>
                <div key="automationRate">
                    <DashboardCard 
                        title="Automation Rate"
                        value="85.7%"
                        change="+2.1%"
                        changeType="increase"
                        icon="fa-solid fa-robot"
                    />
                </div>
                 <div key="groupsManaged">
                    <DashboardCard 
                        title="Groups Managed"
                        value="128"
                        change="0%"
                        changeType="neutral"
                        icon="fa-solid fa-users"
                    />
                </div>

                <div key="messagePerformance">
                    <Card title="Message Performance" className="h-full">
                         <div className="h-[90%] w-full">
                            <MessageChart data={performanceData} />
                         </div>
                    </Card>
                </div>
            </ResponsiveGridLayout>
        </div>
    );
};

export default DashboardPage;
