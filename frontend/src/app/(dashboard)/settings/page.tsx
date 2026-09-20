'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'device' | 'profile' | 'payments' | 'language'>('device');
  const { language, setLanguage } = useLanguage();
  const { addToast } = useToast();

  // Sync with URL query parameter ?tab=
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['device', 'profile', 'payments', 'language'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Device state
  const [isConnected, setIsConnected] = useState(true);

  // Business profile state
  const [businessName, setBusinessName] = useState('WhatzBoot Commerce Studio - المتجر الرسمي');
  const [category, setCategory] = useState('تجارة إلكترونية وتجزئة مباشرة');
  const [description, setDescription] = useState(
    'منصة المبيعات والطلبات التحادثية الأسرع للتسوق الفوري والدفع عبر واتساب بأعلى معايير الأمان.'
  );
  const [businessHours, setBusinessHours] = useState('يومياً على مدار 24 ساعة (دعم فوري)');

  // Payments & Webhook state
  const [webhookUrl, setWebhookUrl] = useState('https://my-store.com/api/webhooks/whatsapp-orders');
  const [apiKey, setApiKey] = useState('wb_live_98a72b849102c48e88ff120');
  const [paymentGateway, setPaymentGateway] = useState('moyasar');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'تم حفظ الإعدادات',
      message: 'تم تحديث بيانات الملف التجاري والكتالوج بنجاح.',
    });
  };

  const handleTestWebhook = () => {
    addToast({
      type: 'info',
      title: 'اختبار ربط الدفع والطلبات',
      message: 'تم إرسال حدث تجريبي بنجاح إلى الرابط المحدد (HTTP 200 OK).',
    });
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            إعدادات النظام والتكاملات التجارية (Settings)
          </h1>
          <Badge variant="gold">إعدادات المتجر المتقدمة</Badge>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
          إدارة جلسة واتساب المتصلة، هوية المتجر والكتالوج، وتكاملات بوابات الدفع الإلكتروني.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-dark-border pb-3">
        {[
          { id: 'device', label: 'حالة الاتصال والجلسة', icon: 'fa-mobile-screen' },
          { id: 'profile', label: 'الملف التجاري والكتالوج', icon: 'fa-store' },
          { id: 'payments', label: 'بوابات الدفع والـ Webhooks', icon: 'fa-credit-card' },
          { id: 'language', label: 'اللغة والمظهر', icon: 'fa-globe' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap border ${
              activeTab === t.id
                ? 'bg-emerald-500 text-black border-emerald-500 shadow'
                : 'bg-dark-card border-dark-border text-dark-text-secondary hover:text-white'
            }`}
          >
            <i className={`fa-solid ${t.icon} text-xs`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. Device Connection */}
      {activeTab === 'device' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Card title="حالة جلسة واتساب للأعمال (WhatsApp Business Instance)" className="p-4 sm:p-5">
              {isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black text-xl shadow-lg">
                        <i className="fa-brands fa-whatsapp"></i>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm">
                          الجلسة متصلة ومفعّلة لاستقبال الطلبات الفورية
                        </h4>
                        <p className="text-xs text-emerald-400 font-mono mt-0.5" dir="ltr">
                          +966 50 123 4567 (حساب تجاري موثق ✓)
                        </p>
                      </div>
                    </div>

                    <Badge variant="success" size="md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-1.5 inline-block"></span>
                      متصل (Online)
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-3.5">
                      <span className="text-dark-text-muted block">الجهاز المقترن</span>
                      <span className="font-bold text-white mt-1 block">
                        Apple iPhone 15 Pro Max
                      </span>
                    </div>
                    <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-3.5">
                      <span className="text-dark-text-muted block">مستوى البطارية</span>
                      <span className="font-bold text-emerald-400 mt-1 block">92% 🔋 شحن مستقر</span>
                    </div>
                    <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-3.5">
                      <span className="text-dark-text-muted block">سرعة الاستجابة</span>
                      <span className="font-bold text-sky-400 font-mono mt-1 block">38ms (فائقة)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-border">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        addToast({
                          type: 'info',
                          title: 'إعادة المزامنة',
                          message: 'تم تحديث اتصال الجلسة مع خوادم واتساب بنجاح.',
                        });
                      }}
                    >
                      <i className="fa-solid fa-arrows-rotate ml-1.5 text-xs"></i>
                      إعادة مزامنة الجلسة
                    </Button>
                    <button
                      onClick={() => {
                        setIsConnected(false);
                        addToast({
                          type: 'warning',
                          title: 'قطع الاتصال',
                          message: 'تم قطع اتصال الحساب مؤقتاً.',
                        });
                      }}
                      className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      قطع الاتصال بالجهاز
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-2xl">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      لا يوجد رقم واتساب مقترن حالياً
                    </h4>
                    <p className="text-xs text-dark-text-secondary mt-1">
                      امسح رمز الاستجابة السريعة (QR Code) لربط رقم واتساب باللوحة وتفعيل استقبال الطلبات.
                    </p>
                  </div>
                  <Button onClick={() => setIsConnected(true)} variant="gold">
                    <i className="fa-solid fa-qrcode ml-2 text-xs"></i>
                    إعادة ربط الجهاز الآن
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card title="إرشادات استقرار وحماية الحساب" className="p-4 sm:p-5">
              <ul className="space-y-3.5 text-xs text-dark-text-secondary leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5 shrink-0">
                    <i className="fa-solid fa-shield-halved text-[10px]"></i>
                  </div>
                  <span>تأكد من إبقاء الهاتف متصلاً بشبكة Wi-Fi مستقرة لضمان تدفق رسائل المبيعات فوراً.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5 shrink-0">
                    <i className="fa-solid fa-bolt text-[10px]"></i>
                  </div>
                  <span>اعتمد الفواصل الزمنية الآمنة (10 - 20 ثانية) عند إطلاق الحملات الترويجية الكبرى.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5 shrink-0">
                    <i className="fa-solid fa-lock text-[10px]"></i>
                  </div>
                  <span>
                    كافة محادثات المبيعات وروابط الدفع مشفرة بتشفير تام من طرف لطرف (End-to-End Encryption).
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* 2. Business Profile */}
      {activeTab === 'profile' && (
        <Card title="بيانات المتجر والكتالوج المعروض للعملاء" className="p-4 sm:p-5">
          <form onSubmit={handleSaveProfile} className="max-w-2xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                اسم المتجر التجاري
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                تصنيف النشاط التجاري
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                نبذة عن المتجر (Bio)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input p-3 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                أوقات العمل واستقبال الطلبات
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="gold">
                <i className="fa-solid fa-check ml-1.5 text-xs"></i>
                حفظ تعديلات المتجر
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 3. Payments & Webhooks */}
      {activeTab === 'payments' && (
        <Card title="ربط بوابات الدفع الإلكتروني والـ Webhooks" className="p-4 sm:p-5">
          <div className="max-w-2xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-2">
                بوابة الدفع الافتراضية لروابط السداد
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'moyasar', name: 'ميسر (Moyasar)', desc: 'مدى، Apple Pay، فيزا' },
                  { id: 'tap', name: 'تاب (Tap Payments)', desc: 'دفع خليجي متكامل' },
                  { id: 'tamara', name: 'تمارا / تابى (BNPL)', desc: 'تقسيط المشتريات' },
                ].map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setPaymentGateway(gw.id)}
                    className={`rounded-2xl border p-3.5 text-right transition-colors ${
                      paymentGateway === gw.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:text-white'
                    }`}
                  >
                    <span className="font-bold block text-xs">{gw.name}</span>
                    <span className="text-[10px] text-dark-text-muted mt-1 block">{gw.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                مفتاح الـ API للربط البرمجي (API Secret Key)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="flex-1 rounded-xl border border-dark-border bg-dark-bg px-3 py-2 font-mono text-xs text-emerald-400 focus:outline-none"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    addToast({
                      type: 'success',
                      title: 'تم النسخ',
                      message: 'تم نسخ مفتاح الـ API إلى الحافظة بنجاح.',
                    });
                  }}
                >
                  نسخ المفتاح
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                رابط استلام تنبيهات الطلبات والمدفوعات (Webhook URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-dark-border bg-dark-input px-3 py-2 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
                <Button onClick={handleTestWebhook} variant="gold" size="sm">
                  فحص تجريبي
                </Button>
              </div>
              <p className="mt-1 text-[11px] text-dark-text-muted">
                يتم إرسال تنبيه فوري بصيغة JSON مع كل عملية دفع مكتملة أو طلب جديد وارد عبر واتساب.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Language */}
      {activeTab === 'language' && (
        <Card title="إعدادات اللغة والمظهر" className="p-4 sm:p-5">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-2">
                لغة العرض في النظام (Display Language)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`rounded-2xl border p-4 text-center transition-colors ${
                    language === 'ar'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow'
                      : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:text-white'
                  }`}
                >
                  <span className="text-sm block font-bold">العربية (RTL)</span>
                  <span className="text-xs opacity-75 mt-1 block">اللغة الافتراضية للمتجر</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-2xl border p-4 text-center transition-colors ${
                    language === 'en'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow'
                      : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:text-white'
                  }`}
                >
                  <span className="text-sm block font-bold">English (LTR)</span>
                  <span className="text-xs opacity-75 mt-1 block">International Studio</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
