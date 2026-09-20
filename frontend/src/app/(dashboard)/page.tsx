'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/features/dashboard/DashboardCard';
import MessageChart from '@/components/features/dashboard/MessageChart';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { performanceData } from '@/data/performance.data';

const DashboardPage = () => {
  const [botActive, setBotActive] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Top Header & Commerce Action Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              استوديو المبيعات والتجارة التحادثية
            </h1>
            <Badge variant="gold" dot>
              مباشر
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
            متابعة فورية لإيرادات المبيعات عبر واتساب، سلات الشراء، وتفاعل العملاء مع الكتالوج الآلي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick bot toggle */}
          <button
            onClick={() => setBotActive((prev) => !prev)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
              botActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-dark-card border-dark-border text-dark-text-secondary hover:text-dark-text-primary'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${botActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`}
            ></span>
            <span>كتالوج البوت: {botActive ? 'مفعّل ونشط' : 'متوقف'}</span>
          </button>

          <Link href="/orders">
            <Button variant="gold" size="sm" className="flex items-center gap-2">
              <i className="fa-solid fa-plus text-xs"></i>
              تسجيل طلب جديد
            </Button>
          </Link>

          <Link href="/send-message">
            <Button variant="primary" size="sm" className="flex items-center gap-2">
              <i className="fa-solid fa-bullhorn text-xs"></i>
              إطلاق حملة ترويجية
            </Button>
          </Link>
        </div>
      </div>

      {/* Commerce KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="مبيعات واتساب المكتملة"
          value="48,920 $"
          change="+18.4%"
          changeType="increase"
          icon="fa-solid fa-coins"
          accent="gold"
        />
        <DashboardCard
          title="الطلبات المنجزة عبر المحادثات"
          value="342 طلب"
          change="+8.2%"
          changeType="increase"
          icon="fa-solid fa-bag-shopping"
          accent="green"
        />
        <DashboardCard
          title="استرداد السلات المتروكة"
          value="34.8%"
          change="+5.1%"
          changeType="increase"
          icon="fa-solid fa-cart-arrow-down"
          accent="blue"
        />
        <DashboardCard
          title="متوسط قيمة سلة الشراء (AOV)"
          value="143 $"
          change="+3.4%"
          changeType="increase"
          icon="fa-solid fa-chart-line"
          accent="purple"
        />
      </div>

      {/* Connection & Live Store Status Strip */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-dark-card to-dark-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold shadow-md">
              <i className="fa-solid fa-store text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">متجر واتساب النشط متزامن بالكامل</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  بوابة الدفع متصلة
                </span>
              </div>
              <p className="text-xs text-dark-text-secondary mt-0.5">
                الرقم المعتمد: <span className="font-mono text-dark-text-primary" dir="ltr">+966 50 829 4410</span> • سرعة إصدار الفواتير الآلية: <span className="font-semibold text-emerald-400">فورية (1.2 ثانية)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/team-inbox"
              className="rounded-xl border border-dark-border bg-dark-bg/80 px-3 py-1.5 text-xs font-semibold text-dark-text-primary hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
            >
              المحادثات النشطة (3 تنتظر ردك)
            </Link>
            <Link
              href="/orders"
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              متابعة الطلبات الجارية
            </Link>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <Card
        title="حركة الرسائل والتحويلات البيعية (Sales & Message Volume)"
        subtitle="مقارنة بين حجم الاستفسارات الواردة ونسبة تحويلها إلى طلبات مؤكدة"
        action={
          <div className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-input p-1">
            {[
              { id: '7d', label: '7 أيام' },
              { id: '30d', label: '30 يوماً' },
              { id: '90d', label: '3 أشهر' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as any)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  timeRange === tab.id
                    ? 'bg-whatsapp-green text-black font-bold'
                    : 'text-dark-text-secondary hover:text-dark-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
        className="p-4 sm:p-6"
      >
        <div className="h-72 w-full mt-2">
          <MessageChart data={performanceData} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-dark-border/50 pt-4 text-xs text-dark-text-secondary">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span>الرسائل الترويجية الصادرة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-sky-500"></span>
            <span>استفسارات وطلبات العملاء</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">89.2%</span>
            <span>معدل إتمام صفقات المحادثة</span>
          </div>
        </div>
      </Card>

      {/* Commerce Insights Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Commerce Conversations */}
        <Card
          title="محادثات مبيعات نشطة وسلات شراء"
          subtitle="العملاء المتفاعلون حالياً مع الكتالوج ورسائل العروض"
          action={
            <Link
              href="/team-inbox"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              فتح الوارد
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
            </Link>
          }
          className="p-4 sm:p-5"
        >
          <div className="space-y-3 mt-1">
            {[
              {
                name: 'سارة الأحمد',
                time: '10:42 ص',
                msg: 'هل يتوفر لديكم توصيل سريع إلى الرياض اليوم؟ سأطلب بيتزا مارغريتا الآن',
                tag: 'عميل VIP',
                tagVariant: 'gold' as const,
                cartValue: '90.00 $',
                unread: true,
              },
              {
                name: 'محمد خالد الشمري',
                time: '09:15 ص',
                msg: 'تم سداد الفاتورة عبر رابط الدفع بنجاح.',
                tag: 'تم السداد',
                tagVariant: 'success' as const,
                cartValue: '180.00 $',
                unread: false,
              },
              {
                name: 'ريم القحطاني',
                time: 'أمس',
                msg: 'أرغب بالاستفسار عن عروض التخفيضات للباقات الشهرية.',
                tag: 'سلة متروكة',
                tagVariant: 'warning' as const,
                cartValue: '350.00 $',
                unread: false,
              },
            ].map((chat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-dark-border/60 bg-dark-bg/40 p-3 hover:border-emerald-500/30 hover:bg-dark-border/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-surface-elevated text-dark-text-primary text-xs font-bold border border-dark-border">
                    {chat.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{chat.name}</span>
                      <Badge variant={chat.tagVariant} size="sm">
                        {chat.tag}
                      </Badge>
                    </div>
                    <p className="text-xs text-dark-text-secondary truncate max-w-[200px] sm:max-w-xs mt-0.5">
                      {chat.msg}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono text-xs font-bold text-amber-300">{chat.cartValue}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-dark-text-muted">{chat.time}</span>
                    {chat.unread && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Orders & Commerce Conversion */}
        <Card
          title="سجل الطلبات والفواتير المباشرة"
          subtitle="آخر المعاملات المنفذة عبر المتجر التحادثي"
          action={
            <Link
              href="/orders"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              جميع الطلبات
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
            </Link>
          }
          className="p-4 sm:p-5"
        >
          <div className="space-y-3 mt-1">
            {[
              {
                id: 'WB-1052',
                customer: 'سارة الأحمد',
                items: 'بيتزا مارغريتا (2)',
                total: '90.00 $',
                status: 'قيد التجهيز',
                variant: 'warning' as const,
              },
              {
                id: 'WB-1051',
                customer: 'محمد الشمري',
                items: 'شاورما دجاج (4) + وجبة عائلية',
                total: '180.00 $',
                status: 'مكتمل ومسلَّم',
                variant: 'success' as const,
              },
              {
                id: 'WB-1050',
                customer: 'ريم القحطاني',
                items: 'سلطة سيزر كرسبي (2)',
                total: '70.00 $',
                status: 'تم التأكيد والسداد',
                variant: 'info' as const,
              },
            ].map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between rounded-xl border border-dark-border/60 bg-dark-bg/40 p-3 hover:border-amber-500/30 hover:bg-dark-border/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      #{ord.id}
                    </span>
                    <span className="text-xs font-bold text-white">{ord.customer}</span>
                  </div>
                  <p className="text-xs text-dark-text-secondary mt-0.5">{ord.items}</p>
                </div>
                <div className="text-left flex flex-col items-end gap-1">
                  <span className="text-xs font-extrabold text-white font-mono">{ord.total}</span>
                  <Badge variant={ord.variant} size="sm">
                    {ord.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
