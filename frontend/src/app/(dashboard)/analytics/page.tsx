'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type PeriodType = '7d' | '30d' | '90d' | 'ytd';

interface PeriodDataset {
  label: string;
  totalRevenue: string;
  totalRevenueDelta: string;
  recoveredRevenue: string;
  recoveredRevenueDelta: string;
  recoveryRate: string;
  recoveryRateDelta: string;
  roas: string;
  roasDelta: string;
  aov: string;
  aovDelta: string;
  totalOrders: number;
  recoveredOrders: number;
  chartData: { date: string; totalRevenue: number; recoveredRevenue: number; orders: number }[];
  funnelData: { stage: string; count: number; rate: string; drop: string }[];
}

const analyticsDatasets: Record<PeriodType, PeriodDataset> = {
  '7d': {
    label: 'آخر 7 أيام',
    totalRevenue: '24,850 $',
    totalRevenueDelta: '+18.4% ↗',
    recoveredRevenue: '8,420 $',
    recoveredRevenueDelta: '+29.1% ↗',
    recoveryRate: '38.6%',
    recoveryRateDelta: '+6.2% ↗',
    roas: '16.2x',
    roasDelta: '+2.8x ↗',
    aov: '235 $',
    aovDelta: '+8.4% ↗',
    totalOrders: 108,
    recoveredOrders: 36,
    chartData: [
      { date: 'السبت', totalRevenue: 2800, recoveredRevenue: 950, orders: 12 },
      { date: 'الأحد', totalRevenue: 3400, recoveredRevenue: 1100, orders: 15 },
      { date: 'الاثنين', totalRevenue: 3100, recoveredRevenue: 850, orders: 14 },
      { date: 'الثلاثاء', totalRevenue: 3900, recoveredRevenue: 1400, orders: 17 },
      { date: 'الأربعاء', totalRevenue: 4200, recoveredRevenue: 1620, orders: 18 },
      { date: 'الخميس', totalRevenue: 4850, recoveredRevenue: 1800, orders: 21 },
      { date: 'الجمعة', totalRevenue: 2600, recoveredRevenue: 700, orders: 11 },
    ],
    funnelData: [
      { stage: 'السلات المتروكة المسجلة', count: 180, rate: '100%', drop: '0%' },
      { stage: 'رسائل التذكير المستلمة', count: 176, rate: '97.7%', drop: '2.3%' },
      { stage: 'الرسائل المقروءة على واتساب', count: 152, rate: '84.4%', drop: '13.3%' },
      { stage: 'النقر على روابط السداد', count: 98, rate: '54.4%', drop: '30.0%' },
      { stage: 'الطلبات المسددة بنجاح ✅', count: 36, rate: '38.6%', drop: '15.8%' },
    ],
  },
  '30d': {
    label: 'آخر 30 يوماً',
    totalRevenue: '98,650 $',
    totalRevenueDelta: '+26.8% ↗',
    recoveredRevenue: '34,800 $',
    recoveredRevenueDelta: '+38.4% ↗',
    recoveryRate: '39.2%',
    recoveryRateDelta: '+7.5% ↗',
    roas: '15.8x',
    roasDelta: '+3.4x ↗',
    aov: '248 $',
    aovDelta: '+12.5% ↗',
    totalOrders: 425,
    recoveredOrders: 142,
    chartData: [
      { date: '01 يوليو', totalRevenue: 9800, recoveredRevenue: 3200, orders: 42 },
      { date: '06 يوليو', totalRevenue: 14200, recoveredRevenue: 4800, orders: 60 },
      { date: '11 يوليو', totalRevenue: 18600, recoveredRevenue: 6400, orders: 78 },
      { date: '16 يوليو', totalRevenue: 22400, recoveredRevenue: 7900, orders: 94 },
      { date: '21 يوليو', totalRevenue: 26900, recoveredRevenue: 9800, orders: 112 },
      { date: '26 يوليو', totalRevenue: 31500, recoveredRevenue: 11200, orders: 135 },
      { date: '30 يوليو', totalRevenue: 38850, recoveredRevenue: 14100, orders: 165 },
    ],
    funnelData: [
      { stage: 'السلات المتروكة المسجلة', count: 750, rate: '100%', drop: '0%' },
      { stage: 'رسائل التذكير المستلمة', count: 732, rate: '97.6%', drop: '2.4%' },
      { stage: 'الرسائل المقروءة على واتساب', count: 644, rate: '85.8%', drop: '11.8%' },
      { stage: 'النقر على روابط السداد', count: 412, rate: '54.9%', drop: '30.9%' },
      { stage: 'الطلبات المسددة بنجاح ✅', count: 142, rate: '39.2%', drop: '15.7%' },
    ],
  },
  '90d': {
    label: 'آخر 90 يوماً (الربع الحالي)',
    totalRevenue: '284,200 $',
    totalRevenueDelta: '+34.2% ↗',
    recoveredRevenue: '96,500 $',
    recoveredRevenueDelta: '+44.0% ↗',
    recoveryRate: '41.0%',
    recoveryRateDelta: '+8.8% ↗',
    roas: '17.4x',
    roasDelta: '+4.1x ↗',
    aov: '260 $',
    aovDelta: '+16.2% ↗',
    totalOrders: 1180,
    recoveredOrders: 385,
    chartData: [
      { date: 'مايو', totalRevenue: 78000, recoveredRevenue: 26000, orders: 320 },
      { date: 'يونيو', totalRevenue: 94000, recoveredRevenue: 32500, orders: 390 },
      { date: 'يوليو', totalRevenue: 112200, recoveredRevenue: 38000, orders: 470 },
    ],
    funnelData: [
      { stage: 'السلات المتروكة المسجلة', count: 2150, rate: '100%', drop: '0%' },
      { stage: 'رسائل التذكير المستلمة', count: 2095, rate: '97.4%', drop: '2.6%' },
      { stage: 'الرسائل المقروءة على واتساب', count: 1840, rate: '85.5%', drop: '11.9%' },
      { stage: 'النقر على روابط السداد', count: 1190, rate: '55.3%', drop: '30.2%' },
      { stage: 'الطلبات المسددة بنجاح ✅', count: 385, rate: '41.0%', drop: '14.3%' },
    ],
  },
  'ytd': {
    label: 'العام الحالي (YTD)',
    totalRevenue: '645,800 $',
    totalRevenueDelta: '+42.5% ↗',
    recoveredRevenue: '218,400 $',
    recoveredRevenueDelta: '+58.2% ↗',
    recoveryRate: '42.8%',
    recoveryRateDelta: '+10.4% ↗',
    roas: '18.2x',
    roasDelta: '+5.5x ↗',
    aov: '272 $',
    aovDelta: '+19.8% ↗',
    totalOrders: 2650,
    recoveredOrders: 890,
    chartData: [
      { date: 'الربع 1', totalRevenue: 180000, recoveredRevenue: 58000, orders: 740 },
      { date: 'الربع 2', totalRevenue: 225000, recoveredRevenue: 76000, orders: 920 },
      { date: 'الربع 3', totalRevenue: 240800, recoveredRevenue: 84400, orders: 990 },
    ],
    funnelData: [
      { stage: 'السلات المتروكة المسجلة', count: 5400, rate: '100%', drop: '0%' },
      { stage: 'رسائل التذكير المستلمة', count: 5260, rate: '97.4%', drop: '2.6%' },
      { stage: 'الرسائل المقروءة على واتساب', count: 4620, rate: '85.5%', drop: '11.9%' },
      { stage: 'النقر على روابط السداد', count: 3010, rate: '55.7%', drop: '29.8%' },
      { stage: 'الطلبات المسددة بنجاح ✅', count: 890, rate: '42.8%', drop: '12.9%' },
    ],
  },
};

const peakHoursSalesData = [
  { hour: '08:00', sales: 650, recovered: 200 },
  { hour: '10:00', sales: 1820, recovered: 550 },
  { hour: '12:00', sales: 2940, recovered: 920 },
  { hour: '14:00', sales: 2100, recovered: 700 },
  { hour: '16:00', sales: 3450, recovered: 1200 },
  { hour: '18:00', sales: 4900, recovered: 1950 },
  { hour: '20:00', sales: 5800, recovered: 2400 },
  { hour: '22:00', sales: 3750, recovered: 1450 },
];

const channelShareData = [
  { name: 'استرداد السلات المتروكة', value: 34800, color: '#10b981', share: '35.3%' },
  { name: 'مبيعات الكتالوج المباشر', value: 29400, color: '#f59e0b', share: '29.8%' },
  { name: 'روابط الدفع السريع بالمحادثة', value: 21200, color: '#06b6d4', share: '21.5%' },
  { name: 'عروض البث الترويجي (Broadcaster)', value: 13250, color: '#8b5cf6', share: '13.4%' },
];

const topAbandonedProductsData = [
  {
    name: 'عطر اللافندر الملكي الفاخر (100 مل)',
    category: 'عطور ومستحضرات',
    abandonedCount: 142,
    recoveredCount: 68,
    recoveryRate: '47.9%',
    recoveredRevenue: '6,460 $',
    actionRecommendation: 'شحن مجاني فوري (FREESHIP)',
    actionBadge: 'green',
  },
  {
    name: 'ساعة ذكية رياضية Ultra + سوار إضافي',
    category: 'إلكترونيات',
    abandonedCount: 98,
    recoveredCount: 41,
    recoveryRate: '41.8%',
    recoveredRevenue: '8,610 $',
    actionRecommendation: 'تقسيط تابي 4 دفعات (SPLIT4)',
    actionBadge: 'blue',
  },
  {
    name: 'طقم مفارش قطن مصري ملكي فاخر',
    category: 'مفارش ومنزل',
    abandonedCount: 76,
    recoveredCount: 32,
    recoveryRate: '42.1%',
    recoveredRevenue: '4,800 $',
    actionRecommendation: 'كوبون 10% (SAVE10)',
    actionBadge: 'amber',
  },
  {
    name: 'سوار ذهبي عيار 18 بتصميم ماسي',
    category: 'مجوهرات وحلي',
    abandonedCount: 45,
    recoveredCount: 22,
    recoveryRate: '48.8%',
    recoveredRevenue: '12,540 $',
    actionRecommendation: 'متابعة خاصة VIP ومستشار مبيعات',
    actionBadge: 'purple',
  },
  {
    name: 'ماكينة إسبريسو احترافية إيطالية',
    category: 'أجهزة منزلية',
    abandonedCount: 38,
    recoveredCount: 18,
    recoveryRate: '47.3%',
    recoveredRevenue: '7,560 $',
    actionRecommendation: 'هدية مجانية باقة بن (FREEGIFT)',
    actionBadge: 'green',
  },
];

const abandonmentReasonsData = [
  { reason: 'ارتفاع تكلفة الشحن عند الدفع', percent: '42%', count: '315 سلة', icon: 'fa-truck', color: 'rose' },
  { reason: 'تردد في وسائل الدفع أو عدم توفر تابي/تمارا', percent: '28%', count: '210 سلة', icon: 'fa-credit-card', color: 'amber' },
  { reason: 'مقارنة الأسعار أو التفكير بالطلب', percent: '18%', count: '135 سلة', icon: 'fa-magnifying-glass-dollar', color: 'sky' },
  { reason: 'انقطاع الاتصال أو صعوبة تقنية بالبوابة', percent: '12%', count: '90 سلة', icon: 'fa-wifi', color: 'purple' },
];

const agentPerformance = [
  {
    name: 'روبوت المبيعات الذكي (WhatzBoot AI)',
    role: 'روبوت أتمتة السلات والمبيعات',
    ordersClosed: 420,
    recoveredRevenue: '34,800 $',
    avgTime: '0.4 ثانية',
    conversionRate: '39.2%',
    avatar: '🤖',
  },
  {
    name: 'فاطمة الزهراني',
    role: 'استشارية مبيعات VIP',
    ordersClosed: 148,
    recoveredRevenue: '18,650 $',
    avgTime: '1.2 دقيقة',
    conversionRate: '34.2%',
    avatar: '👩‍💼',
  },
  {
    name: 'عبدالله السعيد',
    role: 'أخصائي إغلاق الصفقات',
    ordersClosed: 112,
    recoveredRevenue: '12,400 $',
    avgTime: '1.6 دقيقة',
    conversionRate: '31.0%',
    avatar: '👨‍💼',
  },
  {
    name: 'عمر القحطاني',
    role: 'منسق طلبيات وتوصيل',
    ordersClosed: 74,
    recoveredRevenue: '8,200 $',
    avgTime: '2.0 دقيقة',
    conversionRate: '24.5%',
    avatar: '👨‍💼',
  },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [chartViewMode, setChartViewMode] = useState<'both' | 'recovered' | 'total'>('both');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentData = analyticsDatasets[period];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real CSV Export Generator
  const handleExportCSV = () => {
    const headers = ['التاريخ', 'إجمالي الإيرادات ($)', 'الإيرادات المستردة ($)', 'عدد الطلبات'];
    const rows = currentData.chartData.map((d) => [
      d.date,
      d.totalRevenue,
      d.recoveredRevenue,
      d.orders,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `whatzboot-sales-report-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportModalOpen(false);
    showToast('تم تحميل ملف CSV الشامل لبيانات المبيعات بنجاح!');
  };

  const handlePrintReport = () => {
    setIsExportModalOpen(false);
    window.print();
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 rounded-2xl bg-[#181922] border-2 border-whatsapp-green px-5 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 animate-fade-in-up">
          <span className="flex h-3 w-3 rounded-full bg-whatsapp-green animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              تحليلات المبيعات ونمو الإيرادات المستردة
            </h1>
            <Badge variant="gold">تقارير الذكاء التجاري الحية</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
            مؤشرات النمو، عوائد استرداد السلات المتروكة، قمع تحويل واتساب، وأداء القنوات البيعية.
          </p>
        </div>

        {/* Date Filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl border border-dark-border bg-dark-card p-1 text-xs">
            {(['7d', '30d', '90d', 'ytd'] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1 font-bold transition-all ${
                  period === p
                    ? 'bg-whatsapp-green text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'text-dark-text-secondary hover:text-white'
                }`}
              >
                {p === '7d' ? '7 أيام' : p === '30d' ? '30 يوماً' : p === '90d' ? '90 يوماً' : 'العام YTD'}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <i className="fa-solid fa-file-arrow-down text-xs"></i>
            تصدير التقرير المالي
          </Button>
        </div>
      </div>

      {/* Primary KPI Cards with Period Comparison */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-dark-card to-dark-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-dark-text-muted">
            <span className="font-medium">إجمالي مبيعات واتساب</span>
            <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
              {currentData.totalRevenueDelta}
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-mono font-extrabold text-white mt-2">
            {currentData.totalRevenue}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-dark-text-muted border-t border-dark-border/40 pt-1.5 font-mono">
            <span>عدد الطلبات المكتملة:</span>
            <span className="text-amber-300 font-bold">{currentData.totalOrders} طلب</span>
          </div>
        </div>

        {/* Recovered Cart Revenue (High Priority) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-dark-card to-dark-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-dark-text-muted">
            <span className="font-bold text-whatsapp-green flex items-center gap-1">
              <i className="fa-solid fa-cart-arrow-down text-xs"></i>
              الإيراد المسترد من السلات
            </span>
            <span className="text-whatsapp-green font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
              {currentData.recoveredRevenueDelta}
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-mono font-extrabold text-whatsapp-green mt-2">
            {currentData.recoveredRevenue}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-dark-text-muted border-t border-dark-border/40 pt-1.5 font-mono">
            <span>سلات تم إنقاذها:</span>
            <span className="text-white font-bold">{currentData.recoveredOrders} سلة ناجحة</span>
          </div>
        </div>

        {/* Recovery Rate */}
        <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-dark-card to-dark-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-dark-text-muted">
            <span className="font-medium">معدل استرداد السلات (Recovery Rate)</span>
            <span className="text-sky-400 font-mono font-bold bg-sky-500/10 px-1.5 py-0.5 rounded">
              {currentData.recoveryRateDelta}
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-mono font-extrabold text-sky-300 mt-2">
            {currentData.recoveryRate}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-dark-text-muted border-t border-dark-border/40 pt-1.5 font-mono">
            <span>عائد الاستثمار (ROAS):</span>
            <span className="text-sky-300 font-bold">{currentData.roas}</span>
          </div>
        </div>

        {/* Recovered AOV */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-dark-card to-dark-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-dark-text-muted">
            <span className="font-medium">متوسط قيمة الطلب (AOV)</span>
            <span className="text-purple-300 font-mono font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
              {currentData.aovDelta}
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-mono font-extrabold text-purple-200 mt-2">
            {currentData.aov}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-dark-text-muted border-t border-dark-border/40 pt-1.5 font-mono">
            <span>بفضل قوالب الخصم والكوبونات</span>
          </div>
        </div>
      </div>

      {/* Main Growth Chart: Total Revenue vs Recovered Cart Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <i className="fa-solid fa-chart-area text-whatsapp-green"></i>
                  اتجاهات نمو المبيعات والإيرادات المستردة ({currentData.label})
                </h3>
                <span className="text-xs text-dark-text-muted">
                  مقارنة بين إجمالي المبيعات وقيمة السلات التي استعادها نظام واتساب الآلي
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-dark-bg/80 border border-dark-border rounded-xl p-0.5 text-[11px]">
                <button
                  onClick={() => setChartViewMode('both')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    chartViewMode === 'both' ? 'bg-dark-card text-white shadow' : 'text-dark-text-muted'
                  }`}
                >
                  كلا المسارين
                </button>
                <button
                  onClick={() => setChartViewMode('recovered')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    chartViewMode === 'recovered' ? 'bg-emerald-500/20 text-emerald-300' : 'text-dark-text-muted'
                  }`}
                >
                  السلات المستردة فقط
                </button>
                <button
                  onClick={() => setChartViewMode('total')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    chartViewMode === 'total' ? 'bg-amber-500/20 text-amber-300' : 'text-dark-text-muted'
                  }`}
                >
                  إجمالي المبيعات
                </button>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.chartData}>
                  <defs>
                    <linearGradient id="colorTotalRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRecovRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22303c" />
                  <XAxis dataKey="date" stroke="#71767b" fontSize={11} />
                  <YAxis stroke="#71767b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161e27',
                      borderColor: '#22303c',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  {(chartViewMode === 'both' || chartViewMode === 'total') && (
                    <Area
                      type="monotone"
                      dataKey="totalRevenue"
                      name="إجمالي الإيرادات ($)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTotalRev)"
                    />
                  )}
                  {(chartViewMode === 'both' || chartViewMode === 'recovered') && (
                    <Area
                      type="monotone"
                      dataKey="recoveredRevenue"
                      name="إيرادات السلات المستردة ($)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRecovRev)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Channel Share Donut (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="p-4 sm:p-5 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <i className="fa-solid fa-pie-chart text-amber-400"></i>
                توزيع مصادر الإيرادات عبر واتساب
              </h3>
              <span className="text-xs text-dark-text-muted">
                مساهمة كل مسار بيعي في إجمالي الإيراد
              </span>
            </div>

            <div className="h-56 w-full flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {channelShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161e27',
                      borderColor: '#22303c',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 border-t border-dark-border/50 pt-3">
              {channelShareData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-dark-text-secondary truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    <span className="text-dark-text-muted text-[11px]">{item.share}</span>
                    <span className="font-bold text-white">{item.value.toLocaleString()} $</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Conversion Funnel Suite: Cart Abandoned -> WhatsApp Read -> Order Paid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WhatsApp Conversion Funnel (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <i className="fa-solid fa-filter text-sky-400"></i>
                  قمع تحويل واسترداد السلات (WhatsApp Conversion Funnel)
                </h3>
                <span className="text-xs text-dark-text-muted">
                  معدل انتقال العميل من ترك السلة حتى إتمام الدفع بنجاح
                </span>
              </div>
              <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono font-bold text-whatsapp-green">
                التحويل الكلي: {currentData.recoveryRate}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {currentData.funnelData.map((stage, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dark-surface-elevated border border-dark-border text-[10px] text-dark-text-muted font-mono">
                        {idx + 1}
                      </span>
                      {stage.stage}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-dark-text-muted text-[11px]">
                        {stage.count.toLocaleString()} عميل
                      </span>
                      <span className="text-whatsapp-green font-bold">{stage.rate}</span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-dark-border/60 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        idx === 4
                          ? 'bg-whatsapp-green shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : idx === 3
                            ? 'bg-sky-400'
                            : idx === 2
                              ? 'bg-amber-400'
                              : 'bg-emerald-600/70'
                      }`}
                      style={{
                        width: `${Math.max(
                          (stage.count / (currentData.funnelData[0]?.count || 1)) * 100,
                          8
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Peak Hours Sales & Recovery (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <i className="fa-solid fa-clock text-amber-400"></i>
                  ساعات الذروة واستجابة السلات (Peak Hours)
                </h3>
                <span className="text-xs text-dark-text-muted">
                  أفضل أوقات إرسال تذكيرات الواتساب وتحقيق أعلى معدل استجابة
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22303c" />
                  <XAxis dataKey="hour" stroke="#71767b" fontSize={11} />
                  <YAxis stroke="#71767b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161e27',
                      borderColor: '#22303c',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    name="إجمالي المبيعات"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="recovered"
                    name="المسترد من السلات"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* WhatsApp ROI Financial Performance Matrix */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-dark-card to-dark-card p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-whatsapp-green text-xl shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <i className="fa-solid fa-coins"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  العائد المالي المباشر على استثمار واتساب (WhatsApp Recovery ROI Matrix)
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 font-mono">
                  عائد استثماري: 188.1x ROAS
                </span>
              </div>
              <p className="text-xs text-dark-text-secondary mt-0.5">
                حساب صافي الأرباح المحققة من حملات استرداد السلات التلقائية مقارنة بتكلفة رسائل API.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-dark-border bg-dark-bg/80 p-2.5 text-center">
              <span className="text-[10px] text-dark-text-muted block">تكلفة رسائل واتساب:</span>
              <span className="font-mono font-bold text-white text-sm">185.00 $</span>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-center">
              <span className="text-[10px] text-emerald-300 block">الإيراد المسترد:</span>
              <span className="font-mono font-extrabold text-whatsapp-green text-sm">{currentData.recoveredRevenue}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-center">
              <span className="text-[10px] text-amber-300 block">صافي الربح الإضافي:</span>
              <span className="font-mono font-extrabold text-amber-200 text-sm">+{currentData.recoveredRevenue.replace(' $', '')} $</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Abandoned vs Recovered Products Intelligence & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Products Table (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <i className="fa-solid fa-boxes-stacked text-whatsapp-green"></i>
                  المنتجات الأكثر تركاً واسترداداً (Product Intelligence)
                </h3>
                <span className="text-xs text-dark-text-muted">
                  تحليل الأصناف المعلقة بالسلات وإجراءات الاسترداد الموصى بها
                </span>
              </div>
              <span className="text-xs text-dark-text-muted font-mono">5 منتجات رائدة</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="border-b border-dark-border text-dark-text-muted bg-dark-surface-elevated/40">
                  <tr>
                    <th className="py-2.5 px-3">المنتج</th>
                    <th className="py-2.5 px-3">سلات متروكة</th>
                    <th className="py-2.5 px-3">سلات مستردة</th>
                    <th className="py-2.5 px-3">معدل الاسترداد</th>
                    <th className="py-2.5 px-3">الإيراد المسترد</th>
                    <th className="py-2.5 px-3">الحافز الموصى به</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40">
                  {topAbandonedProductsData.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-dark-surface-elevated/40 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold block text-white">{prod.name}</span>
                        <span className="text-[10px] text-dark-text-muted">{prod.category}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-dark-text-secondary">{prod.abandonedCount} سلة</td>
                      <td className="py-3 px-3 font-mono font-bold text-white">{prod.recoveredCount} سلة</td>
                      <td className="py-3 px-3 font-mono font-bold text-whatsapp-green">{prod.recoveryRate}</td>
                      <td className="py-3 px-3 font-mono font-extrabold text-white">{prod.recoveredRevenue}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                          prod.actionBadge === 'green'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : prod.actionBadge === 'purple'
                              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                              : prod.actionBadge === 'blue'
                                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {prod.actionRecommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Abandonment Reasons Diagnostics (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <i className="fa-solid fa-stethoscope text-rose-400"></i>
                أسباب ترك السلات (Cart Diagnostics)
              </h3>
              <span className="text-xs text-dark-text-muted">
                التحليل السلوكي لدوافع عدم إتمام الشراء
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {abandonmentReasonsData.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-dark-border bg-dark-bg/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-bold flex items-center gap-2">
                      <i className={`fa-solid ${item.icon} text-xs text-${item.color}-400`}></i>
                      {item.reason}
                    </span>
                    <span className="font-mono font-extrabold text-amber-300">{item.percent}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-dark-text-muted">
                    <span>العدد التقديري: {item.count}</span>
                    <span className="text-emerald-400 font-bold">معالج تلقائياً ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Agent & Bot Contribution Leaderboard */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-medal text-amber-400"></i>
              مساهمة الروبوت وفريق المبيعات في استرداد السلات وإغلاق الصفقات
            </h3>
            <span className="text-xs text-dark-text-muted">
              النتائج المالية المحققة لكل موظف ومحرك الذكاء الاصطناعي
            </span>
          </div>
          <span className="text-xs font-mono text-whatsapp-green font-bold">
            إجمالي المحصل: {currentData.recoveredRevenue}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-dark-border text-dark-text-muted bg-dark-surface-elevated/50">
              <tr>
                <th className="py-2.5 px-3">الممثل / الروبوت</th>
                <th className="py-2.5 px-3">الصفقات المغلقة</th>
                <th className="py-2.5 px-3">الإيرادات المستردة</th>
                <th className="py-2.5 px-3">معدل التحويل</th>
                <th className="py-2.5 px-3">سرعة الاستجابة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/40 text-dark-text-primary">
              {agentPerformance.map((agent, i) => (
                <tr key={i} className="hover:bg-dark-surface-elevated/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{agent.avatar}</span>
                      <div>
                        <span className="font-bold block text-white">{agent.name}</span>
                        <span className="text-[10px] text-dark-text-muted font-mono">
                          {agent.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {agent.ordersClosed} طلب
                  </td>
                  <td className="py-3 px-3 font-mono font-extrabold text-whatsapp-green">
                    {agent.recoveredRevenue}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-300">
                    {agent.conversionRate}
                  </td>
                  <td className="py-3 px-3 text-dark-text-muted font-mono text-[11px]">
                    {agent.avgTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-5 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-file-export text-whatsapp-green text-base"></i>
                <h3 className="text-sm font-extrabold text-white">تصدير التقرير المالي والتحليلي</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-dark-text-muted hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-dark-text-secondary bg-dark-bg/60 p-3 rounded-xl border border-dark-border/50">
              <div className="flex justify-between">
                <span>الفترة المحددة:</span>
                <span className="text-white font-bold">{currentData.label}</span>
              </div>
              <div className="flex justify-between">
                <span>إجمالي الإيرادات:</span>
                <span className="text-white font-mono font-bold">{currentData.totalRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span>السلات المستردة:</span>
                <span className="text-whatsapp-green font-mono font-bold">{currentData.recoveredRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span>معدل التحويل:</span>
                <span className="text-amber-300 font-mono font-bold">{currentData.recoveryRate}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                onClick={handleExportCSV}
                variant="commerce"
                className="w-full justify-center text-xs font-bold"
              >
                <i className="fa-solid fa-file-csv ml-1.5 text-sm"></i>
                تحميل ملف بيانات شامل (CSV)
              </Button>
              <Button
                onClick={handlePrintReport}
                variant="secondary"
                className="w-full justify-center text-xs font-bold"
              >
                <i className="fa-solid fa-print ml-1.5 text-sm"></i>
                طباعة التقرير أو حفظه كـ PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
