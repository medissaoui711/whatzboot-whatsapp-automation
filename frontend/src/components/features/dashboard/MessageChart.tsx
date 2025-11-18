'use client';
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid
} from 'recharts';
import { PerformanceData } from '@/types';

type MessageChartProps = {
  data: PerformanceData[];
};

const MessageChart: React.FC<MessageChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
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
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis dataKey="name" stroke="#8b949e" />
        <YAxis stroke="#8b949e" />
        <Tooltip
            contentStyle={{
                backgroundColor: '#161B22',
                border: '1px solid #30363d',
                color: '#c9d1d9'
            }}
        />
        <Area type="monotone" dataKey="sent" stroke="#25D366" fillOpacity={1} fill="url(#colorSent)" />
        <Area type="monotone" dataKey="received" stroke="#34B7F1" fillOpacity={1} fill="url(#colorReceived)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MessageChart;
