import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MessageTrend } from '../types';
import Card from './ui/Card';
import { useLanguage } from '../i18n/LanguageContext';

interface MessageChartProps {
  data: MessageTrend[];
}

const MessageChart: React.FC<MessageChartProps> = ({ data }) => {
  const { t } = useLanguage();
  return (
    <Card className="mt-8">
        <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('dashboard.message_activity')}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25D366" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#25D366" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34B7F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34B7F1" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <CartesianGrid strokeDasharray="3 3" className="stroke-dark-border" />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(22, 27, 34, 0.9)', 
                        border: '1px solid #30363d',
                        borderRadius: '0.5rem',
                        color: '#c9d1d9'
                    }} 
                />
                <Legend 
                  wrapperStyle={{color: '#8b949e'}}
                  payload={[
                    { value: t('dashboard.sent'), type: 'line', color: '#25D366' },
                    { value: t('dashboard.received'), type: 'line', color: '#34B7F1' }
                  ]}
                />
                <Area type="monotone" dataKey="sent" stroke="#25D366" fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="received" stroke="#34B7F1" fillOpacity={1} fill="url(#colorReceived)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default MessageChart;