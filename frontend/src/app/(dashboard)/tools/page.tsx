'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<'link' | 'cleaner' | 'templates'>('link');

  // Tool 1: WhatsApp Commerce Link & QR Generator
  const [linkPhone, setLinkPhone] = useState('966501234567');
  const [linkType, setLinkType] = useState<'catalog' | 'order' | 'discount'>('catalog');
  const [linkMessage, setLinkMessage] = useState(
    'مرحباً! أود طلب المنتج من الكتالوج والاستفادة من خصم العرض الخاص 🛍️'
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const generatedUrl = `https://wa.me/${linkPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    linkMessage
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Tool 2: Phone Number Cleaner
  const [rawNumbers, setRawNumbers] = useState(
    '050 123 4567\n055-987-6543\n+966541112233\n0533221144\n050 123 4567'
  );
  const [countryCode, setCountryCode] = useState('966');
  const [cleanedNumbers, setCleanedNumbers] = useState<string[]>([]);
  const [stats, setStats] = useState<{ total: number; unique: number; duplicates: number } | null>(
    null
  );

  const handleCleanNumbers = () => {
    const lines = rawNumbers.split('\n').map((l) => l.trim()).filter(Boolean);
    const cleanedSet = new Set<string>();
    const cleanedList: string[] = [];

    lines.forEach((line) => {
      let digits = line.replace(/[^0-9]/g, '');
      if (digits.startsWith('0')) {
        digits = countryCode + digits.slice(1);
      } else if (!digits.startsWith(countryCode) && digits.length <= 10) {
        digits = countryCode + digits;
      }
      cleanedList.push(digits);
      cleanedSet.add(digits);
    });

    const uniqueList = Array.from(cleanedSet);
    setCleanedNumbers(uniqueList);
    setStats({
      total: lines.length,
      unique: uniqueList.length,
      duplicates: lines.length - uniqueList.length,
    });
  };

  // Tool 3: Commerce Canned Responses
  const templates = [
    {
      code: '/catalog',
      title: 'رابط الكتالوج والأسعار الرسمي',
      text: 'تفضل كتالوج متجرنا الشامل وقائمة الأسعار المحدثة: https://whatzboot.store/catalog 🛍️ يمكنك إضافة منتجاتك للسلة والدفع مباشرة من المحادثة!',
    },
    {
      code: '/payment',
      title: 'رابط الدفع السريع الآمن (مدى / Apple Pay)',
      text: 'تم تجهيز رابط الدفع الإلكتروني المباشر لطلبك: https://pay.whatzboot.sa/inv/WB-9821\nيدعم مدى، Apple Pay، والبطاقات الائتمانية بكل أمان 💳.',
    },
    {
      code: '/shipping',
      title: 'سياسة ومواعيد الشحن السريع',
      text: 'الشحن متوفر لكافة المدن خلال 24 - 48 ساعة فقط، والشحن مجاني للطلبات بقيمة $200 وأكثر 🚚.',
    },
    {
      code: '/vip_discount',
      title: 'كوبون خصم حصري للعملاء المميزين',
      text: 'تقديراً لثقتك واختيارك الدائم لنا، يسرنا إهداؤك كود خصم إضافي 15% [VIP15] صالح للاستخدام فوراً في هذا الطلب ⭐.',
    },
  ];

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            حقيبة أدوات التجارة التحادثية (WhatsApp Commerce Toolkit)
          </h1>
          <Badge variant="gold">أدوات مبيعات فورية</Badge>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
          مُوَلِّد روابط البيع المباشرة، معالجة وتنقية أرقام الحملات، ومكتبة الردود المحفزة للشراء.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-dark-border pb-3">
        {[
          { id: 'link', label: 'مُوَلِّد روابط المحادثة و QR', icon: 'fa-qrcode' },
          { id: 'cleaner', label: 'مصحح وفلتر أرقام الحملات', icon: 'fa-filter' },
          { id: 'templates', label: 'قوالب الردود السريعة (Canned)', icon: 'fa-bolt' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap border ${
              activeTool === t.id
                ? 'bg-emerald-500 text-black border-emerald-500 shadow'
                : 'bg-dark-card border-dark-border text-dark-text-secondary hover:text-white'
            }`}
          >
            <i className={`fa-solid ${t.icon} text-xs`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tool 1: WhatsApp Link & QR */}
      {activeTool === 'link' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <Card title="إنشاء رابط دردشة مباشر مخصص للبيع الفوري" className="p-4 sm:p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                    رقم الواتساب التجاري (مع كود الدولة)
                  </label>
                  <input
                    type="text"
                    value={linkPhone}
                    onChange={(e) => setLinkPhone(e.target.value)}
                    placeholder="966501234567"
                    className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-text-secondary mb-1.5">
                    نوع الهدف التحادثي
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'catalog', label: 'طلب الكتالوج' },
                      { id: 'order', label: 'شراء منتج محدد' },
                      { id: 'discount', label: 'تفعيل كود خصم' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => {
                          setLinkType(btn.id as any);
                          if (btn.id === 'catalog')
                            setLinkMessage('مرحباً! أود تصفح كتالوج المنتجات والطلب عبر واتساب 🛍️');
                          if (btn.id === 'order')
                            setLinkMessage('مرحباً، أود تسجيل طلب فوري للمنتج المعلن عنه 📦');
                          if (btn.id === 'discount')
                            setLinkMessage('مرحباً، أرغب في تفعيل كود الخصم الترويجي [SAVE20] في طلبي 🏷️');
                        }}
                        className={`rounded-xl py-2 text-xs font-bold border transition-colors ${
                          linkType === btn.id
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-dark-surface-elevated border-dark-border text-dark-text-secondary hover:text-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                    نص الرسالة التلقائية للعميل
                  </label>
                  <textarea
                    rows={3}
                    value={linkMessage}
                    onChange={(e) => setLinkMessage(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-input p-3 text-xs sm:text-sm text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-3.5 space-y-1.5">
                  <span className="text-[11px] font-bold text-dark-text-muted block">
                    الرابط المباشر الناتج:
                  </span>
                  <p className="font-mono text-xs text-emerald-400 break-all">{generatedUrl}</p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCopyLink} variant="gold" className="flex-1 justify-center">
                    <i className="fa-solid fa-copy ml-2"></i>
                    {copiedLink ? 'تم نسخ الرابط بنجاح!' : 'نسخ رابط واتساب'}
                  </Button>
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center rounded-xl border border-dark-border bg-dark-surface-elevated px-4 text-xs font-bold text-white hover:border-emerald-500 transition-colors"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square ml-1.5 text-xs"></i>
                    اختبار الرابط
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* QR Code preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <Card title="رمز الاستجابة السريعة (QR Code)" className="w-full p-4 sm:p-5 flex flex-col items-center text-center">
              <div className="my-2 rounded-2xl bg-white p-4 shadow-xl">
                <svg
                  className="h-44 w-44"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="25" height="25" fill="#0b141a" rx="3" />
                  <rect x="4" y="4" width="17" height="17" fill="#ffffff" rx="2" />
                  <rect x="8" y="8" width="9" height="9" fill="#10b981" rx="1" />

                  <rect x="75" width="25" height="25" fill="#0b141a" rx="3" />
                  <rect x="79" y="4" width="17" height="17" fill="#ffffff" rx="2" />
                  <rect x="83" y="8" width="9" height="9" fill="#10b981" rx="1" />

                  <rect y="75" width="25" height="25" fill="#0b141a" rx="3" />
                  <rect x="4" y="79" width="17" height="17" fill="#ffffff" rx="2" />
                  <rect x="8" y="83" width="9" height="9" fill="#10b981" rx="1" />

                  <rect x="35" y="10" width="8" height="8" fill="#0b141a" />
                  <rect x="50" y="8" width="8" height="8" fill="#0b141a" />
                  <rect x="62" y="15" width="6" height="6" fill="#0b141a" />

                  <rect x="12" y="35" width="7" height="7" fill="#0b141a" />
                  <rect x="30" y="30" width="9" height="9" fill="#0b141a" />
                  <rect x="45" y="32" width="14" height="14" fill="#0b141a" rx="2" />
                  <rect x="68" y="35" width="8" height="8" fill="#0b141a" />
                  <rect x="85" y="38" width="8" height="8" fill="#0b141a" />

                  <rect x="8" y="55" width="8" height="8" fill="#0b141a" />
                  <rect x="25" y="50" width="8" height="8" fill="#0b141a" />
                  <rect x="40" y="52" width="20" height="8" fill="#f59e0b" />
                  <rect x="70" y="55" width="8" height="8" fill="#0b141a" />

                  <rect x="35" y="75" width="8" height="8" fill="#0b141a" />
                  <rect x="50" y="70" width="8" height="8" fill="#0b141a" />
                  <rect x="65" y="78" width="8" height="8" fill="#0b141a" />
                  <rect x="80" y="72" width="12" height="12" fill="#0b141a" />
                  <rect x="48" y="84" width="12" height="10" fill="#0b141a" />
                </svg>
              </div>

              <p className="text-xs text-dark-text-muted mt-2">
                امسح الرمز بكاميرا الجوال للوصول للمحادثة الفورية
              </p>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert('تم تحميل صورة الـ QR Code بصيغة PNG عالية الجودة!')}
                className="mt-4 w-full"
              >
                <i className="fa-solid fa-download ml-1.5 text-xs"></i>
                تحميل صورة الرمز للطباعة أو المنشورات
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Tool 2: Cleaner */}
      {activeTool === 'cleaner' && (
        <Card title="تنقية وفلترة قوائم أرقام الهواتف قبل إطلاق الحملات" className="p-4 sm:p-5">
          <p className="text-xs text-dark-text-secondary mb-4">
            الصق قائمة أرقام غير منسقة تحتوي مسافات أو أصفاراً بادئة، وسيقوم النظام بتوحيد الصيغة الدولية (+966) وحذف التكرار تلقائياً لتفادي كلفة الرسائل الزائدة.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                الأرقام الخام (كل رقم في سطر)
              </label>
              <textarea
                rows={8}
                value={rawNumbers}
                onChange={(e) => setRawNumbers(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input p-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-dark-text-muted">رمز الدولة:</span>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-dark-border bg-dark-input px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="966">السعودية (+966)</option>
                  <option value="971">الإمارات (+971)</option>
                  <option value="965">الكويت (+965)</option>
                  <option value="20">مصر (+20)</option>
                </select>
                <Button onClick={handleCleanNumbers} variant="gold" size="sm" className="mr-auto">
                  تنظيف الآن
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                النتيجة بعد التنظيف والفلترة ({cleanedNumbers.length} رقم معتمد)
              </label>
              <textarea
                rows={8}
                readOnly
                value={cleanedNumbers.join('\n')}
                placeholder="ستظهر الأرقام المعالجة والموحدة هنا..."
                className="w-full rounded-xl border border-dark-border bg-dark-bg p-3 font-mono text-xs text-emerald-400 focus:outline-none"
              />

              {stats && (
                <div className="mt-2 flex items-center justify-between text-xs text-dark-text-muted">
                  <span>إجمالي المدخل: {stats.total}</span>
                  <span className="text-emerald-400 font-bold">الفريد: {stats.unique}</span>
                  <span className="text-amber-400">المكرر المحذوف: {stats.duplicates}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cleanedNumbers.join('\n'));
                      alert('تم نسخ القائمة المجهزة إلى الحافظة بنجاح!');
                    }}
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    نسخ القائمة
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Tool 3: Templates */}
      {activeTool === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              قوالب الردود السريعة المجهزة للمبيعات والمدفوعات
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div
                key={tmpl.code}
                className="rounded-2xl border border-dark-border bg-dark-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs sm:text-sm text-white">{tmpl.title}</h4>
                  <Badge variant="gold" size="sm" className="font-mono">
                    {tmpl.code}
                  </Badge>
                </div>
                <p className="text-xs text-dark-text-secondary leading-relaxed bg-dark-surface-elevated p-3 rounded-xl border border-dark-border/60">
                  {tmpl.text}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tmpl.text);
                      alert(`تم نسخ قالب "${tmpl.title}" بنجاح!`);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <i className="fa-regular fa-copy text-xs"></i>
                    نسخ القالب لاستخدامه
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
