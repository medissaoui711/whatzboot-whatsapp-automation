import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../i18n/LanguageContext';
import { SystemMetric, ErrorLog, FeatureUsage } from '../../types';

const MonitoringDashboard: React.FC = () => {
    const { t, dir } = useLanguage();
    const [metrics, setMetrics] = useState<SystemMetric | null>(null);
    const [errorLog, setErrorLog] = useState<ErrorLog[]>([]);
    const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
    
    const textAlignmentClass = dir === 'rtl' ? 'text-right' : 'text-left';

    useEffect(() => {
        // Initial data load
        const now = new Date();
        const initialLatencyData = Array.from({ length: 10 }, (_, i) => ({
            time: new Date(now.getTime() - (9 - i) * 5000).toLocaleTimeString(),
            latency: Math.random() * 50 + 20,
        }));
        setMetrics({
            apiStatus: 'Operational',
            activeConnections: 187,
            dbLatencyData: initialLatencyData,
            memoryUsage: 45.8,
        });

        setErrorLog([
            { id: 'err1', timestamp: new Date(now.getTime() - 10000).toISOString(), service: 'Broadcaster', message: 'Failed to connect to Redis cache', level: 'error' },
            { id: 'err2', timestamp: new Date(now.getTime() - 30000).toISOString(), service: 'API-Gateway', message: 'Upstream service timeout', level: 'warning' },
        ]);

        setFeatureUsage([
            { feature: t('nav.auto_responder'), usageCount: 12543 },
            { feature: t('nav.broadcaster'), usageCount: 3456 },
            { feature: t('nav.group_manager'), usageCount: 8765 },
            { feature: t('tools.google_maps_extractor.title'), usageCount: 1234 },
            { feature: t('nav.number_filter'), usageCount: 5678 },
        ].sort((a,b)=> b.usageCount - a.usageCount));

        // Simulate real-time updates
        const interval = setInterval(() => {
            setMetrics(prev => {
                if (!prev) return null;
                const newTime = new Date().toLocaleTimeString();
                const newLatency = Math.random() * 60 + 20;
                const newDbData = [...prev.dbLatencyData.slice(1), { time: newTime, latency: newLatency }];
                return {
                    ...prev,
                    activeConnections: prev.activeConnections + Math.floor(Math.random() * 11) - 5,
                    dbLatencyData: newDbData,
                    memoryUsage: Math.max(20, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 2)),
                };
            });
            // Occasionally add a new error
             if (Math.random() < 0.1) {
                const newError: ErrorLog = {
                    id: `err${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    service: 'AuthService',
                    message: 'Invalid JWT token detected',
                    level: 'critical'
                };
                setErrorLog(prev => [newError, ...prev].slice(0, 10)); // Keep log size manageable
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [t]);

    const StatusCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; }> = ({ title, children, icon }) => (
        <Card>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-dark-input border border-dark-border">
                    {icon}
                </div>
                <div className="ms-4">
                    <p className="text-sm font-medium text-dark-text-secondary uppercase tracking-wider">{title}</p>
                    {children}
                </div>
            </div>
        </Card>
    );
    
    const logLevelColors = {
        critical: 'bg-red-500',
        error: 'bg-orange-500',
        warning: 'bg-yellow-500',
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-dark-text-primary">{t('monitoring.title')}</h2>
            <p className="mt-2 text-dark-text-secondary">{t('monitoring.subtitle')}</p>

            {/* System Status Grid */}
            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
                <StatusCard title={t('monitoring.api_status')} icon={<i className="fa-solid fa-server text-whatsapp-green text-xl"></i>}>
                     <p className="text-lg font-semibold text-green-400 flex items-center">
                        <span className="relative flex h-3 w-3 me-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        {t('monitoring.status_operational')}
                    </p>
                </StatusCard>
                <StatusCard title={t('monitoring.active_connections')} icon={<i className="fa-solid fa-users text-whatsapp-blue text-xl"></i>}>
                     <p className="text-2xl font-semibold text-dark-text-primary">{metrics?.activeConnections.toLocaleString()}</p>
                </StatusCard>
                <StatusCard title={t('monitoring.memory_usage')} icon={<i className="fa-solid fa-memory text-yellow-400 text-xl"></i>}>
                    <div className="flex items-center space-x-2">
                        <p className="text-2xl font-semibold text-dark-text-primary">{metrics?.memoryUsage.toFixed(1)}%</p>
                         <div className="w-20 h-2 bg-dark-border rounded-full">
                            <div className="h-2 bg-yellow-400 rounded-full" style={{ width: `${metrics?.memoryUsage}%` }}></div>
                        </div>
                    </div>
                </StatusCard>
            </div>
            
            {/* DB Latency Chart */}
            <Card className="mt-8">
                <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('monitoring.db_latency')}</h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <AreaChart data={metrics?.dbLatencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34B7F1" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#34B7F1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#8b949e" fontSize={12} />
                            <YAxis stroke="#8b949e" fontSize={12} />
                            <CartesianGrid strokeDasharray="3 3" className="stroke-dark-border" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(22, 27, 34, 0.9)', border: '1px solid #30363d', borderRadius: '0.5rem' }} />
                            <Area type="monotone" dataKey="latency" stroke="#34B7F1" fill="url(#colorLatency)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Real-time Error Log */}
                <Card>
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('monitoring.realtime_errors')}</h3>
                    <div className="space-y-3 h-80 overflow-y-auto">
                        {errorLog.map(log => (
                             <div key={log.id} className="p-3 bg-dark-input rounded-md border-l-4 border-red-500">
                                <div className="flex justify-between items-center text-xs text-dark-text-secondary">
                                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                                     <span className="font-semibold">{log.service}</span>
                                    <span className={`px-2 py-0.5 rounded text-white text-xs ${logLevelColors[log.level]}`}>{t(`monitoring.level_${log.level}`)}</span>
                                </div>
                                <p className="text-sm text-dark-text-primary mt-1 font-mono">{log.message}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                 {/* Feature Usage */}
                <Card>
                    <h3 className="text-xl font-semibold text-dark-text-primary mb-4">{t('monitoring.feature_usage')}</h3>
                     <table className={`w-full ${textAlignmentClass}`}>
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-3 font-semibold text-dark-text-secondary">{t('monitoring.table_feature')}</th>
                                <th className="p-3 font-semibold text-dark-text-secondary">{t('monitoring.table_usage_count')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featureUsage.map((item, index) => (
                                <tr key={index} className="border-b border-dark-border">
                                    <td className="p-3 text-dark-text-primary">{item.feature}</td>
                                    <td className="p-3 text-dark-text-secondary font-mono">{item.usageCount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

        </div>
    );
};

export default MonitoringDashboard;