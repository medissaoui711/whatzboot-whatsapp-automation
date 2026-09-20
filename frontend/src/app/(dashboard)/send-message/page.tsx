'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cartRecoveryTemplates, CartRecoveryTemplate } from '@/data/cart-recovery-templates.data';

interface CampaignRecord {
  id: string;
  name: string;
  target: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  conversionCount: number;
  revenueGenerated: string;
  status: 'completed' | 'in_progress' | 'scheduled' | 'draft';
  createdAt: string;
  type?: 'cart_recovery' | 'promotional';
}

const mockCampaigns: CampaignRecord[] = [
  {
    id: 'camp-recov-1',
    name: 'استرداد السلات التلقائي - كود [SAVE10]',
    target: 'سلات غير مكتملة (85 عميل)',
    totalRecipients: 85,
    sentCount: 85,
    deliveredCount: 84,
    readCount: 76,
    conversionCount: 32,
    revenueGenerated: '7,680 $',
    status: 'completed',
    createdAt: 'اليوم 11:30 ص',
    type: 'cart_recovery',
  },
  {
    id: 'camp-1',
    name: 'حملة عروض نهاية الأسبوع 30% خصم',
    target: 'عملاء VIP ⭐ (128 عميل)',
    totalRecipients: 128,
    sentCount: 128,
    deliveredCount: 126,
    readCount: 114,
    conversionCount: 38,
    revenueGenerated: '6,480 $',
    status: 'completed',
    createdAt: '2024-07-20 14:30',
    type: 'promotional',
  },
  {
    id: 'camp-recov-2',
    name: 'سلات VIP مع شحن مجاني [FREESHIP]',
    target: 'سلات كبار المشترين (34 عميل)',
    totalRecipients: 34,
    sentCount: 34,
    deliveredCount: 34,
    readCount: 31,
    conversionCount: 18,
    revenueGenerated: '8,420 $',
    status: 'completed',
    createdAt: 'أمس 16:15 م',
    type: 'cart_recovery',
  },
  {
    id: 'camp-3',
    name: 'إطلاق منيو الصيف وتوصيل مجاني',
    target: 'كافة المشتركين (1,450 جهة)',
    totalRecipients: 1450,
    sentCount: 920,
    deliveredCount: 902,
    readCount: 710,
    conversionCount: 82,
    revenueGenerated: '12,900 $',
    status: 'in_progress',
    createdAt: 'اليوم 09:00 ص',
    type: 'promotional',
  },
];

export default function BroadcasterPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'create' | 'history'>('templates');

  // Selected Recovery Template in Library
  const [selectedTemplate, setSelectedTemplate] = useState<CartRecoveryTemplate>(cartRecoveryTemplates[1]);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');
  const [autoRecoveryEnabled, setAutoRecoveryEnabled] = useState(true);
  const [selectedTriggerDelay, setSelectedTriggerDelay] = useState('180');

  // Live Variable Overrides for Interactive Preview
  const [liveVars, setLiveVars] = useState({
    customer_name: 'سارة الأحمد',
    cart_items: 'عطر اللافندر الملكي (1) + لوشن مسك العود (1)',
    cart_value: '290.00 $',
    discount_code: 'SAVE10',
    checkout_link: 'https://whatzboot.pay/cart-recov-8291?code=SAVE10',
    expiry_hours: '12',
    store_name: 'متجر سحر العطور',
  });

  // Custom Campaign Form State
  const [campaignName, setCampaignName] = useState('حملة استرداد السلات الذكية عبر واتساب');
  const [selectedAudience, setSelectedAudience] = useState('abandoned');
  const [messageText, setMessageText] = useState(
    'مرحباً {اسم_العميل} 👋\n\nلاحظنا أنك تركت منتجات رائعة في سلتك! استخدم كود الخصم {كوبون_الخصم} للحصول على خصم 10% فوري مع توصيل سريع 🛍️\n\nاضغط على الرابط بالأسفل لإتمام الطلب الآن:\n{رابط_السداد}'
  );
  const [hasMedia, setHasMedia] = useState(true);
  const [includeButtons, setIncludeButtons] = useState(true);
  const [buttonText, setButtonText] = useState('استكمال الطلب بالخصم 🛍️');
  const [delayInterval, setDelayInterval] = useState(10);

  // Sending Simulation State
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(mockCampaigns);
  const [logs, setLogs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const audienceCounts: Record<string, number> = {
    all: 1450,
    vip: 128,
    abandoned: 85,
    recent_buyers: 340,
  };

  const currentAudienceCount = audienceCounts[selectedAudience] || 85;

  const insertVariable = (variable: string) => {
    setMessageText((prev) => prev + ` {${variable}} `);
  };

  // Helper to apply selected template into the campaign builder
  const handleApplyTemplateToBuilder = (tmpl: CartRecoveryTemplate) => {
    setSelectedTemplate(tmpl);
    setCampaignName(`حملة: ${tmpl.title}`);
    setSelectedAudience('abandoned');
    setMessageText(
      tmpl.message
        .replace(/{{customer_name}}/g, '{اسم_العميل}')
        .replace(/{{cart_items}}/g, '{أصناف_السلة}')
        .replace(/{{cart_value}}/g, '{قيمة_السلة}')
        .replace(/{{discount_code}}/g, tmpl.discountCode || '{كوبون_الخصم}')
        .replace(/{{checkout_link}}/g, '{رابط_السداد}')
        .replace(/{{expiry_hours}}/g, tmpl.sampleVariables.expiry_hours)
        .replace(/{{store_name}}/g, tmpl.sampleVariables.store_name)
    );
    setButtonText(tmpl.buttonText);
    setIncludeButtons(true);
    setActiveTab('create');
    showToast(`تم تحميل قالب "${tmpl.title}" في محرر الحملات بنجاح!`);
  };

  // Immediate launch for abandoned carts from template view
  const handleLaunchInstantRecovery = (tmpl: CartRecoveryTemplate) => {
    setIsSending(true);
    setSendProgress(0);
    setSentCount(0);
    setLogs([
      `🛒 بدء الإطلاق الفوري لحملة استرداد السلات "${tmpl.title}"...`,
      `📦 استهداف 85 سلة متروكة مسجلة اليوم`,
    ]);

    const total = 45;
    let current = 0;

    const interval = setInterval(() => {
      current += 5;
      const progress = Math.min(Math.round((current / total) * 100), 100);
      setSendProgress(progress);
      setSentCount(current);

      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ✅ تم إرسال رسالة الاسترداد بنجاح للعميل +966 5${Math.floor(
          10000000 + Math.random() * 90000000
        )} - رابط السلة مفعّل`,
        ...prev.slice(0, 12),
      ]);

      if (current >= total) {
        clearInterval(interval);
        setIsSending(false);
        setLogs((prev) => [
          `🎉 اكتملت حملة استرداد السلات بنجاح! تم استرداد 29 سلة فورياً بمبلغ تقديري 6,450 $`,
          ...prev,
        ]);

        const newRec: CampaignRecord = {
          id: `camp-recov-${Date.now()}`,
          name: `استرداد سلات: ${tmpl.title}`,
          target: 'سلات متروكة (85 عميل)',
          totalRecipients: 85,
          sentCount: 85,
          deliveredCount: 83,
          readCount: 74,
          conversionCount: 29,
          revenueGenerated: '6,450 $',
          status: 'completed',
          createdAt: 'الآن',
          type: 'cart_recovery',
        };
        setCampaigns([newRec, ...campaigns]);
        showToast('🎉 تم إطلاق حملة الاسترداد بنجاح وتسجيل المبيعات في سجل الحملات!');
      }
    }, 450);
  };

  // Launch campaign from builder
  const handleLaunchCampaign = () => {
    if (!messageText.trim()) return;

    setIsSending(true);
    setSendProgress(0);
    setSentCount(0);
    setLogs([`🚀 تم بدء إرسال الحملة "${campaignName}" بمعدل أمان عالي لحماية الرقم...`]);

    const total = 50;
    let current = 0;

    const interval = setInterval(() => {
      current += 5;
      const progress = Math.min(Math.round((current / total) * 100), 100);
      setSendProgress(progress);
      setSentCount(current);

      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ✅ تم تسليم الرسالة لرقم +966 5${Math.floor(
          10000000 + Math.random() * 90000000
        )} بنجاح`,
        ...prev.slice(0, 15),
      ]);

      if (current >= total) {
        clearInterval(interval);
        setIsSending(false);
        setLogs((prev) => [
          `🎉 اكتمل إرسال الحملة بنجاح بنسبة تسليم 99.2%!`,
          ...prev,
        ]);

        const newRec: CampaignRecord = {
          id: `camp-${Date.now()}`,
          name: campaignName,
          target: selectedAudience === 'vip' ? 'عملاء VIP ⭐' : selectedAudience === 'abandoned' ? 'سلات متروكة 🛒' : 'كافة العملاء',
          totalRecipients: currentAudienceCount,
          sentCount: currentAudienceCount,
          deliveredCount: Math.round(currentAudienceCount * 0.98),
          readCount: Math.round(currentAudienceCount * 0.88),
          conversionCount: Math.round(currentAudienceCount * 0.35),
          revenueGenerated: `${(currentAudienceCount * 55).toLocaleString()} $`,
          status: 'completed',
          createdAt: 'الآن',
          type: selectedAudience === 'abandoned' ? 'cart_recovery' : 'promotional',
        };
        setCampaigns([newRec, ...campaigns]);
        showToast('تم إرسال الحملة بنجاح وتحديث الإيرادات!');
      }
    }, 500);
  };

  // Process live template message text with variables
  const renderTemplateMessage = (template: CartRecoveryTemplate) => {
    return template.message
      .replace(/{{customer_name}}/g, liveVars.customer_name)
      .replace(/{{cart_items}}/g, liveVars.cart_items)
      .replace(/{{cart_value}}/g, liveVars.cart_value)
      .replace(/{{discount_code}}/g, liveVars.discount_code)
      .replace(/{{checkout_link}}/g, liveVars.checkout_link)
      .replace(/{{expiry_hours}}/g, liveVars.expiry_hours)
      .replace(/{{store_name}}/g, liveVars.store_name);
  };

  const filteredTemplates = cartRecoveryTemplates.filter((t) => {
    if (templateCategoryFilter === 'all') return true;
    return t.category === templateCategoryFilter;
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 rounded-2xl bg-[#181922] border-2 border-whatsapp-green px-5 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 animate-fade-in-up">
          <span className="flex h-3 w-3 rounded-full bg-whatsapp-green animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              استوديو الحملات واسترداد السلات الذكي
            </h1>
            <Badge variant="gold">WhatsApp Recovery Engine</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
            قوالب مؤتمتة لاسترداد السلات المتروكة، إطلاق حملات ترويجية عالية التحويل، وإدارة مبيعات واتساب.
          </p>
        </div>

        {/* 3 Major Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-dark-border bg-dark-card p-1">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-whatsapp-green text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-dark-text-secondary hover:text-white'
            }`}
          >
            <i className="fa-solid fa-cart-shopping text-xs"></i>
            قوالب استرداد السلات 🛒
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-whatsapp-green text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-dark-text-secondary hover:text-white'
            }`}
          >
            <i className="fa-solid fa-pen-to-square text-xs"></i>
            محرر الحملات المخصص
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-whatsapp-green text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-dark-text-secondary hover:text-white'
            }`}
          >
            <i className="fa-solid fa-chart-line text-xs"></i>
            سجل الحملات والمبيعات ({campaigns.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AUTOMATED CART RECOVERY TEMPLATES (SUITE 1 CORE)                   */}
      {/* ========================================================================= */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Recovery Automation Control Strip */}
          <Card className="p-4 sm:p-5 border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-dark-card to-dark-card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-whatsapp-green text-xl shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-white">
                      محرك الاسترداد الآلي للسلات المتروكة (Autonomous Webhook)
                    </h2>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      نشط ويعمل تلقائياً ✓
                    </span>
                  </div>
                  <p className="text-xs text-dark-text-secondary mt-0.5">
                    يقوم النظام برصد أي عميل يترك سلة الشراء في متجرك، وإرسال قالب الاسترداد المناسب عبر واتساب تلقائياً.
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-dark-bg/80 border border-dark-border rounded-xl px-3 py-1.5 text-xs">
                  <span className="text-dark-text-muted">زمن تفعيل التذكير:</span>
                  <select
                    value={selectedTriggerDelay}
                    onChange={(e) => setSelectedTriggerDelay(e.target.value)}
                    className="bg-transparent text-white font-bold font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="60" className="bg-dark-card">بعد 60 دقيقة (ساعة واحدة)</option>
                    <option value="180" className="bg-dark-card">بعد 3 ساعات (تطبيق كود الخصم)</option>
                    <option value="360" className="bg-dark-card">بعد 6 ساعات (شحن مجاني)</option>
                    <option value="1440" className="bg-dark-card">بعد 24 ساعة (فرصة أخيرة)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoRecoveryEnabled(!autoRecoveryEnabled)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                    autoRecoveryEnabled
                      ? 'bg-whatsapp-green text-black border-whatsapp-green shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-dark-border text-dark-text-muted border-transparent'
                  }`}
                >
                  <i className={`fa-solid ${autoRecoveryEnabled ? 'fa-toggle-on' : 'fa-toggle-off'} text-base`}></i>
                  <span>{autoRecoveryEnabled ? 'الأتمتة مفعّلة' : 'الأتمتة متوقفة'}</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Template Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: `كافة القوالب (${cartRecoveryTemplates.length})`, icon: 'fa-layer-group' },
              { id: 'drip', label: 'سلسلة تتابعية (Drip Sequence)', icon: 'fa-timeline' },
              { id: 'discount', label: 'خصومات وكوبونات', icon: 'fa-tags' },
              { id: 'vip', label: 'عملاء VIP وسلات كبرى', icon: 'fa-crown' },
              { id: 'flexible_pay', label: 'تقسيط ودفع مرن', icon: 'fa-credit-card' },
              { id: 'immediate', label: 'تذكير مبكر ولطيف', icon: 'fa-bell' },
              { id: 'luxury', label: 'متاجر فاخرة', icon: 'fa-gem' },
              { id: 'assistance', label: 'خدمة عملاء ومساعدة', icon: 'fa-headset' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setTemplateCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 whitespace-nowrap font-bold transition-all ${
                  templateCategoryFilter === cat.id
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'border-dark-border bg-dark-card text-dark-text-secondary hover:text-white'
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-[11px]`}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* AI Tone & Copywriting Assistant Strip */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-dark-card to-dark-card p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">مساعد الذكاء الاصطناعي لصياغة نبرة الرسالة (AI Tone Refiner)</span>
                <span className="text-[11px] text-dark-text-secondary">غيّر نبرة القالب المحدد بنقرة واحدة لتحقيق أعلى استجابة بيعية:</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                {
                  label: 'خليجي ودي 🇸🇦',
                  apply: () => {
                    setLiveVars((prev) => ({
                      ...prev,
                      customer_name: 'سلطان القحطاني',
                      store_name: 'أناقة الرجل العربي',
                    }));
                    const tmpl = cartRecoveryTemplates.find((t) => t.id === 'recov-gulf-friendly');
                    if (tmpl) setSelectedTemplate(tmpl);
                    showToast('تم تحويل النبرة إلى اللهجة الخليجية الودية!');
                  },
                },
                {
                  label: 'فاخر وموجز 💎',
                  apply: () => {
                    const tmpl = cartRecoveryTemplates.find((t) => t.id === 'recov-luxury-minimal');
                    if (tmpl) setSelectedTemplate(tmpl);
                    showToast('تم تحويل النبرة إلى الأسلوب الفاخر الموجز!');
                  },
                },
                {
                  label: 'فرصة أخيرة (FOMO) ⏳',
                  apply: () => {
                    const tmpl = cartRecoveryTemplates.find((t) => t.id === 'drip-step-5');
                    if (tmpl) setSelectedTemplate(tmpl);
                    showToast('تم تحويل النبرة إلى التنبيه العاجل وإلغاء الحجز!');
                  },
                },
                {
                  label: 'تقسيط تابي/تمارا 💳',
                  apply: () => {
                    const tmpl = cartRecoveryTemplates.find((t) => t.id === 'recov-flexible-tabby');
                    if (tmpl) setSelectedTemplate(tmpl);
                    showToast('تم تفعيل قالب التقسيط الميسر!');
                  },
                },
              ].map((tone, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={tone.apply}
                  className="rounded-lg bg-dark-bg/80 hover:bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 text-[11px] font-bold text-purple-200 hover:text-white transition-colors"
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Template Gallery (Left) & Real-Time WhatsApp Mockup & Variables (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Template Library Cards */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-dark-text-muted uppercase tracking-wider">
                  اختر القالب للمعاينة والتخصيص ({filteredTemplates.length} قوالب متاحة)
                </h3>
                <span className="text-[11px] text-whatsapp-green font-bold">
                  متوافق مع أحدث معايير Meta وواتساب للأعمال
                </span>
              </div>

              <div className="space-y-3">
                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplate.id === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        if (template.discountCode) {
                          setLiveVars((prev) => ({ ...prev, discount_code: template.discountCode! }));
                        }
                      }}
                      className={`group relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-whatsapp-green bg-emerald-950/15 ring-2 ring-emerald-400/20 shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
                          : 'border-dark-border bg-dark-card hover:border-dark-border/80 hover:bg-dark-surface-elevated'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                              isSelected
                                ? 'bg-whatsapp-green text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                : 'bg-dark-border/50 text-dark-text-secondary'
                            }`}
                          >
                            <i className="fa-brands fa-whatsapp"></i>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                                {template.title}
                              </h4>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  template.badgeColor === 'green'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : template.badgeColor === 'purple'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : template.badgeColor === 'amber'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {template.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-dark-text-muted mt-0.5 block">
                              التوقيت المقترح: {template.triggerTiming} • معدل استرداد متوقع: {template.expectedConversionRate}
                            </span>
                          </div>
                        </div>

                        {template.discountCode && (
                          <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 shrink-0">
                            كود: {template.discountCode}
                          </span>
                        )}
                      </div>

                      <p className="mt-2.5 text-xs text-dark-text-secondary leading-relaxed line-clamp-2">
                        {template.description}
                      </p>

                      <div className="mt-3.5 flex items-center justify-between border-t border-dark-border/60 pt-3 text-xs">
                        <div className="flex items-center gap-2 text-[11px] text-dark-text-muted">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <i className="fa-solid fa-arrow-pointer text-[10px]"></i>
                            زر: {template.buttonText}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyTemplateToBuilder(template);
                            }}
                            className="rounded-lg border border-dark-border bg-dark-bg/60 hover:border-whatsapp-green/40 hover:text-white px-2.5 py-1 text-xs text-dark-text-secondary transition-colors"
                          >
                            تخصيص في المحرر
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunchInstantRecovery(template);
                            }}
                            className="rounded-lg bg-whatsapp-green hover:bg-emerald-400 text-black px-3 py-1 text-xs font-bold shadow-sm transition-all"
                          >
                            إطلاق فوري للسلات
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress & Live Logs on Recovery Launch */}
              {(isSending || sendProgress > 0) && (
                <Card className="p-4 border-emerald-500/30 bg-dark-card space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin text-whatsapp-green"></i>
                      جارٍ إرسال حملة استرداد السلات الحالية...
                    </span>
                    <span className="text-whatsapp-green font-mono">{sendProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-dark-border overflow-hidden">
                    <div
                      className="h-full bg-whatsapp-green transition-all duration-300"
                      style={{ width: `${sendProgress}%` }}
                    ></div>
                  </div>
                  <div className="rounded-xl bg-black/60 border border-dark-border p-3 font-mono text-[11px] max-h-32 overflow-y-auto space-y-1">
                    {logs.map((log, idx) => (
                      <p key={idx} className="text-dark-text-secondary">
                        {log}
                      </p>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right 5 Cols: Live Interactive WhatsApp Mockup & Variables Simulator */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-dark-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-mobile-screen text-emerald-400"></i>
                  معاينة حية وتخصيص المتغيرات
                </h3>
                <span className="text-[10px] text-dark-text-muted font-mono">LIVE PREVIEW</span>
              </div>

              {/* WhatsApp Device Mockup */}
              <div className="mx-auto w-full max-w-[340px] rounded-[38px] border-4 border-dark-border bg-[#0b141a] p-3 shadow-2xl shadow-black relative select-none">
                {/* Notch */}
                <div className="mx-auto mb-2 h-4 w-28 rounded-full bg-dark-border/90 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-black"></span>
                </div>

                {/* WhatsApp Chat Bar Header */}
                <div className="flex items-center gap-2.5 border-b border-dark-border/40 pb-2 px-1">
                  <i className="fa-solid fa-chevron-right text-xs text-white/60"></i>
                  <div className="h-8 w-8 rounded-full bg-whatsapp-green flex items-center justify-center text-black font-extrabold text-xs">
                    <i className="fa-solid fa-store"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{liveVars.store_name}</h4>
                      <i className="fa-solid fa-badge-check text-[10px] text-whatsapp-green"></i>
                    </div>
                    <span className="text-[9px] text-emerald-400 block font-medium">حساب أعمال رسمي موثق ✓</span>
                  </div>
                  <i className="fa-solid fa-ellipsis-vertical text-xs text-white/50"></i>
                </div>

                {/* Chat Message Bubble */}
                <div className="my-3 min-h-[300px] flex flex-col justify-end space-y-2.5">
                  {/* Watermark day badge */}
                  <div className="flex justify-center">
                    <span className="rounded-md bg-[#182229] px-2.5 py-0.5 text-[9px] text-white/60 font-medium">
                      اليوم
                    </span>
                  </div>

                  {/* Message Bubble Card */}
                  <div className="rounded-2xl bg-[#1f2c34] p-3.5 text-xs text-white shadow-md border border-dark-border/50">
                    {/* Media image for visual recovery templates */}
                    {selectedTemplate.category === 'vip' ? (
                      <div className="mb-2.5 overflow-hidden rounded-xl border border-white/10">
                        <img
                          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80"
                          alt="VIP Gift"
                          className="h-28 w-full object-cover"
                        />
                      </div>
                    ) : selectedTemplate.category === 'discount' ? (
                      <div className="mb-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 p-2 text-center">
                        <span className="text-[10px] text-amber-300 font-bold block">
                          🎁 كود الخصم الحصري المطبق:
                        </span>
                        <span className="text-sm font-mono font-extrabold text-white tracking-widest">
                          {liveVars.discount_code}
                        </span>
                      </div>
                    ) : null}

                    {/* Formatted live text */}
                    <p className="whitespace-pre-wrap leading-relaxed text-[11.5px] text-zinc-100 font-sans">
                      {renderTemplateMessage(selectedTemplate)}
                    </p>

                    <div className="mt-2 flex items-center justify-end gap-1 text-[9px] text-white/40 font-mono">
                      <span>11:42 ص</span>
                      <i className="fa-solid fa-check-double text-whatsapp-green text-[10px]"></i>
                    </div>
                  </div>

                  {/* WhatsApp Action Button */}
                  <div className="rounded-xl bg-[#1f2c34] border border-whatsapp-green/40 p-2.5 text-center text-xs font-bold text-whatsapp-green shadow-lg hover:bg-[#273741] transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-bag-shopping text-[11px]"></i>
                    <span>{selectedTemplate.buttonText}</span>
                  </div>
                </div>

                <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-dark-border/60"></div>
              </div>

              {/* Dynamic Variables Live Editor */}
              <Card className="p-3.5 sm:p-4 space-y-3 bg-dark-card/90">
                <div className="flex items-center justify-between border-b border-dark-border/60 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-sliders text-amber-400"></i>
                    تعديل متغيرات المعاينة الحية
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLiveVars({
                        customer_name: 'فهد العتيبي',
                        cart_items: 'ساعة ذكية مقاومة للماء + شاحن سريع',
                        cart_value: '420.00 $',
                        discount_code: 'SAVE10',
                        checkout_link: 'https://whatzboot.pay/cart-recov-7721',
                        expiry_hours: '6',
                        store_name: 'متجر سحر العطور',
                      });
                    }}
                    className="text-[10px] text-dark-text-muted hover:text-white"
                  >
                    نموذج عميل آخر ↻
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-dark-text-muted mb-0.5 font-mono">
                      {`{{customer_name}}`}
                    </label>
                    <input
                      type="text"
                      value={liveVars.customer_name}
                      onChange={(e) => setLiveVars({ ...liveVars, customer_name: e.target.value })}
                      className="w-full rounded-lg border border-dark-border bg-dark-input px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-dark-text-muted mb-0.5 font-mono">
                      {`{{cart_value}}`}
                    </label>
                    <input
                      type="text"
                      value={liveVars.cart_value}
                      onChange={(e) => setLiveVars({ ...liveVars, cart_value: e.target.value })}
                      className="w-full rounded-lg border border-dark-border bg-dark-input px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] text-dark-text-muted mb-0.5 font-mono">
                      {`{{cart_items}}`}
                    </label>
                    <input
                      type="text"
                      value={liveVars.cart_items}
                      onChange={(e) => setLiveVars({ ...liveVars, cart_items: e.target.value })}
                      className="w-full rounded-lg border border-dark-border bg-dark-input px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-dark-text-muted mb-0.5 font-mono">
                      {`{{discount_code}}`}
                    </label>
                    <input
                      type="text"
                      value={liveVars.discount_code}
                      onChange={(e) => setLiveVars({ ...liveVars, discount_code: e.target.value })}
                      className="w-full rounded-lg border border-dark-border bg-dark-input px-2 py-1 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-dark-text-muted mb-0.5 font-mono">
                      {`{{expiry_hours}}`}
                    </label>
                    <input
                      type="text"
                      value={liveVars.expiry_hours}
                      onChange={(e) => setLiveVars({ ...liveVars, expiry_hours: e.target.value })}
                      className="w-full rounded-lg border border-dark-border bg-dark-input px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    onClick={() => handleApplyTemplateToBuilder(selectedTemplate)}
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <i className="fa-solid fa-pen text-[10px] ml-1"></i>
                    فتح في المحرر
                  </Button>
                  <Button
                    onClick={() => handleLaunchInstantRecovery(selectedTemplate)}
                    variant="commerce"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <i className="fa-solid fa-paper-plane text-[10px] ml-1"></i>
                    إرسال لـ 85 سلة الآن
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CUSTOM CAMPAIGN BUILDER (ENHANCED)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Builder Forms (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1: Campaign details */}
            <Card title="1. تحديد الحملة والجمهور المستهدف" className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  اسم الحملة (للأرشفة والتقارير)
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="مثال: عروض الجمعة، استرداد السلات المتروكة"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-2">
                  شريحة الجمهور المستهدفة
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'abandoned', label: 'سلات متروكة 🛒', count: '85 سلة', accent: 'border-rose-500/30' },
                    { id: 'vip', label: 'عملاء VIP ⭐', count: '128 عميل', accent: 'border-amber-500/30' },
                    { id: 'recent_buyers', label: 'مشترون سابقون', count: '340 عميل', accent: 'border-emerald-500/30' },
                    { id: 'all', label: 'كافة العملاء', count: '1,450 عميل', accent: 'border-dark-border' },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setSelectedAudience(aud.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-colors ${
                        selectedAudience === aud.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow'
                          : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold">{aud.label}</span>
                      <span className="text-[10px] font-mono text-dark-text-muted mt-1">{aud.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Step 2: Content & Buttons */}
            <Card title="2. صياغة المحتوى وأزرار الشراء التفاعلية" className="p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="text-xs font-bold text-dark-text-secondary">
                    نص الرسالة الترويجية
                  </label>
                  <div className="flex items-center gap-1.5 text-xs flex-wrap">
                    <span className="text-[11px] text-dark-text-muted">المتغيرات:</span>
                    <button
                      type="button"
                      onClick={() => insertVariable('اسم_العميل')}
                      className="rounded-lg bg-dark-surface-elevated border border-dark-border px-2 py-0.5 text-[11px] text-emerald-400 hover:border-emerald-500 transition-colors font-mono"
                    >
                      + {`{اسم_العميل}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable('أصناف_السلة')}
                      className="rounded-lg bg-dark-surface-elevated border border-dark-border px-2 py-0.5 text-[11px] text-blue-400 hover:border-blue-500 transition-colors font-mono"
                    >
                      + {`{أصناف_السلة}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable('قيمة_السلة')}
                      className="rounded-lg bg-dark-surface-elevated border border-dark-border px-2 py-0.5 text-[11px] text-emerald-300 hover:border-emerald-500 transition-colors font-mono"
                    >
                      + {`{قيمة_السلة}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable('كوبون_الخصم')}
                      className="rounded-lg bg-dark-surface-elevated border border-dark-border px-2 py-0.5 text-[11px] text-amber-300 hover:border-amber-500 transition-colors font-mono"
                    >
                      + {`{كوبون_الخصم}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable('رابط_السداد')}
                      className="rounded-lg bg-dark-surface-elevated border border-dark-border px-2 py-0.5 text-[11px] text-purple-300 hover:border-purple-500 transition-colors font-mono"
                    >
                      + {`{رابط_السداد}`}
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input p-3 text-xs sm:text-sm text-white leading-relaxed focus:border-emerald-500 focus:outline-none font-sans"
                  placeholder="اكتب نص الرسالة هنا..."
                />
              </div>

              {/* Media toggle */}
              <div className="flex items-center justify-between border-t border-dark-border/60 pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <i className="fa-solid fa-image text-xs"></i>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      إرفاق بانر العرض الترويجي
                    </span>
                    <span className="text-[11px] text-dark-text-muted">
                      يزيد معدل التحويل إلى طلبات مكتملة بنسبة 45%
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasMedia}
                  onChange={(e) => setHasMedia(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Buttons toggle */}
              <div className="flex items-center justify-between border-t border-dark-border/60 pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <i className="fa-solid fa-arrow-pointer text-xs"></i>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      أزرار الإجراء السريع (WhatsApp Quick Buttons)
                    </span>
                    <span className="text-[11px] text-dark-text-muted">
                      زر مباشر لإتمام الطلب أو رابط الدفع بضغطة واحدة
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeButtons}
                  onChange={(e) => setIncludeButtons(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>

              {includeButtons && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                    نص زر الإجراء (Call to Action)
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}
            </Card>

            {/* Step 3: Anti-Ban & Launch */}
            <Card title="3. إعدادات الحماية من الحظر ومحاكاة السلوك البشري" className="p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-dark-text-secondary font-bold">
                    الفاصل الزمني التلقائي بين كل رسالة:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {delayInterval} - {delayInterval + 4} ثوانٍ
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="30"
                  value={delayInterval}
                  onChange={(e) => setDelayInterval(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="mt-1 text-[11px] text-dark-text-muted">
                  خوارزمية الإرسال تحاكي السلوك الإنساني بدقة لتفادي رصد الحملة أو تقييد الرقم.
                </p>
              </div>

              <div className="border-t border-dark-border/60 pt-4">
                <Button
                  onClick={handleLaunchCampaign}
                  disabled={isSending || !messageText.trim()}
                  variant="gold"
                  className="w-full !py-3 text-sm font-bold justify-center"
                >
                  {isSending ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin ml-2"></i>
                      جارٍ إرسال الحملة ({sendProgress}%)...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-rocket ml-2"></i>
                      إطلاق الحملة لـ {currentAudienceCount} عميل الآن
                    </>
                  )}
                </Button>
              </div>

              {/* Progress & Live Log */}
              {(isSending || sendProgress > 0) && (
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-bold">
                      <span className="text-white">معدل الإنجاز</span>
                      <span className="text-emerald-400 font-mono">{sendProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-dark-border overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${sendProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-black/50 border border-dark-border p-3 font-mono text-[11px] max-h-36 overflow-y-auto space-y-1">
                    {logs.map((log, idx) => (
                      <p key={idx} className="text-dark-text-secondary">
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <h3 className="text-xs font-bold text-dark-text-muted mb-3 flex items-center gap-1.5">
              <i className="fa-solid fa-mobile-screen-button text-emerald-400"></i>
              معاينة الرسالة الحية على هاتف العميل
            </h3>

            {/* iPhone Realistic Mockup */}
            <div className="w-[300px] sm:w-[320px] rounded-[36px] border-4 border-dark-border bg-[#0b141a] p-3 shadow-2xl shadow-black">
              {/* iPhone notch */}
              <div className="mx-auto mb-3 h-4 w-28 rounded-full bg-dark-border/80 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-black"></span>
              </div>

              {/* WhatsApp App Header */}
              <div className="flex items-center gap-2.5 border-b border-dark-border/40 pb-2.5">
                <i className="fa-solid fa-chevron-right text-xs text-white/70"></i>
                <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-extrabold text-xs">
                  WB
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white leading-none">متجرنا الرسمي</h4>
                  <span className="text-[10px] text-emerald-400 font-medium">حساب تجاري موثق ✓</span>
                </div>
              </div>

              {/* WhatsApp Chat Body Preview */}
              <div className="my-4 min-h-[340px] rounded-xl bg-[#0b141a] p-2 flex flex-col justify-end space-y-2">
                <div className="rounded-2xl bg-[#1f2c34] p-3 text-xs text-white max-w-[95%] shadow-sm border border-dark-border/40">
                  {hasMedia && (
                    <div className="mb-2 overflow-hidden rounded-xl">
                      <img
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80"
                        alt="Promo Banner"
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  )}

                  <p className="whitespace-pre-wrap leading-relaxed text-[11px] text-zinc-200">
                    {messageText
                      .replace(/{اسم_العميل}/g, 'سارة الأحمد')
                      .replace(/{أصناف_السلة}/g, 'عطر اللافندر الملكي (1)')
                      .replace(/{قيمة_السلة}/g, '290.00 $')
                      .replace(/{كوبون_الخصم}/g, 'SAVE10')
                      .replace(/{رابط_السداد}/g, 'https://whatzboot.pay/cart-recov-8291')}
                  </p>

                  <div className="mt-1.5 flex justify-end text-[9px] text-white/40 font-mono">
                    10:45 ص
                  </div>
                </div>

                {/* WhatsApp Interactive Button */}
                {includeButtons && (
                  <div className="rounded-xl bg-[#1f2c34] border border-dark-border/60 p-2 text-center text-xs font-bold text-emerald-400 shadow-md">
                    <i className="fa-solid fa-arrow-up-right-from-square ml-1.5 text-[10px]"></i>
                    {buttonText}
                  </div>
                )}
              </div>

              <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-dark-border/60"></div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CAMPAIGNS & RECOVERY HISTORY                                       */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-white">سجل الحملات ومعدلات استرداد السلات</h3>
              <p className="text-xs text-dark-text-muted mt-0.5">
                تتبع النتائج الحقيقية للرسائل المرسلة والمبيعات المتحققة لكل حملة.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                إجمالي إيراد الحملات: 31,450 $
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b border-dark-border text-dark-text-muted bg-dark-surface-elevated/50">
                <tr>
                  <th className="py-3 px-3">اسم الحملة والنوع</th>
                  <th className="py-3 px-3">الجمهور المستهدف</th>
                  <th className="py-3 px-3">المرسل / المستلم</th>
                  <th className="py-3 px-3">نسبة القراءة</th>
                  <th className="py-3 px-3">الطلبات المستردة</th>
                  <th className="py-3 px-3">الإيراد المحقق</th>
                  <th className="py-3 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/40 text-dark-text-primary">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-dark-surface-elevated/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {camp.type === 'cart_recovery' ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 text-[10px]">
                            🛒
                          </span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px]">
                            📢
                          </span>
                        )}
                        <div>
                          <span className="font-bold text-white block">{camp.name}</span>
                          <span className="text-[10px] text-dark-text-muted font-mono">{camp.createdAt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-dark-text-secondary">{camp.target}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {camp.sentCount} / {camp.totalRecipients}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                      {Math.round((camp.readCount / (camp.sentCount || 1)) * 100)}%
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {camp.conversionCount} طلب
                    </td>
                    <td className="py-3 px-3 font-mono font-extrabold text-amber-300">
                      {camp.revenueGenerated}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={camp.status === 'completed' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {camp.status === 'completed' ? 'مكتملة بنجاح' : 'جارٍ الإرسال'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
