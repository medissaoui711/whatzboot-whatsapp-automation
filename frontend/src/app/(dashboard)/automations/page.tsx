'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface AutomationRule {
  id: string;
  name: string;
  triggerType: 'exact' | 'contains' | 'welcome' | 'out_of_hours' | 'commerce';
  keywords: string[];
  response: string;
  enabled: boolean;
  triggerCount: number;
  lastTriggered: string;
}

const initialRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'الرد الترحيبي ورابط الكتالوج',
    triggerType: 'welcome',
    keywords: ['مرحبا', 'السلام عليكم', 'أهلا', 'هلا', 'صباح الخير', 'مساء الخير'],
    response: 'أهلاً وسهلاً بك في WhatzBoot Commerce! 🌸\nيسعدنا تواصلك معنا، نحن هنا لمساعدتك في اختيار وشراء أفضل المنتجات.\n\nيمكنك إرسال:\n1️⃣ [المنيو] لعرض الكتالوج الشامل وقائمة الأسعار 🏷️\n2️⃣ [دفع] لإصدار رابط دفع فوري 💳\n3️⃣ [تتبع] للاستعلام الفوري عن حالة شحنتك 🚚\n4️⃣ [خدمة] للتحدث مع ممثل مبيعات متخصص.',
    enabled: true,
    triggerCount: 1420,
    lastTriggered: 'منذ 5 دقائق',
  },
  {
    id: 'rule-2',
    name: 'قائمة الأسعار والمنتجات الأكثر مبيعاً',
    triggerType: 'commerce',
    keywords: ['منيو', 'المنيو', 'سعر', 'اسعار', 'كتالوج', 'منتجات', 'شراء'],
    response: 'تفضل قائمة منتجاتنا الأكثر طلباً لهذا الأسبوع 🏷️:\n\n🍕 بيتزا مارغريتا إيطالية فاخرة: 45 $\n🌯 شاورما دجاج عربية ممتازة: 15 $\n🥗 سلطة سيزر كرسبي: 35 $\n\nتصفح الكتالوج الشامل واطلب بضغطة زر: https://whatzboot.store 🛍️',
    enabled: true,
    triggerCount: 890,
    lastTriggered: 'منذ 20 دقيقة',
  },
  {
    id: 'rule-3',
    name: 'الاستعلام الفوري وتتبع الشحنات',
    triggerType: 'contains',
    keywords: ['تتبع', 'طلب', 'وين طلبي', 'حالة الطلب', 'شحن'],
    response: 'لتتبع طلبك فوراً 📦:\nالرجاء كتابة رقم الطلب مسبوقاً برمز # (مثال: #1042) وسنزودك برابط الشحن المباشر وموقع المندوب في الحال!',
    enabled: true,
    triggerCount: 512,
    lastTriggered: 'منذ ساعتين',
  },
  {
    id: 'rule-4',
    name: 'الرد خارج أوقات العمل وحفظ الطلب',
    triggerType: 'out_of_hours',
    keywords: ['خارج الدوام'],
    response: 'نشكر تواصلك معنا 🌙! أوقات العمل الرسمية من 9:00 صباحاً حتى 11:00 مساءً.\nتم تسجيل رغبتك وسيقوم فريق المبيعات بالتواصل معك فور بدء ساعات العمل.',
    enabled: true,
    triggerCount: 320,
    lastTriggered: 'أمس 01:15 ص',
  },
];

export default function AutomationsPage() {
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Rule Form
  const [newName, setNewName] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [newTriggerType, setNewTriggerType] = useState<'contains' | 'exact' | 'commerce'>('contains');

  // Simulator state
  const [simInput, setSimInput] = useState('');
  const [simMessages, setSimMessages] = useState<
    { sender: 'user' | 'bot'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'مرحباً بك في محاكي بوت المبيعات الذكي! اكتب أي كلمة مثل "مرحبا" أو "المنيو" أو "تتبع" لاختبار الردود التلقائية المربوطة بالكتالوج.',
      time: '10:00 ص',
    },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newResponse) return;

    const keywordsArray = newKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newName,
      triggerType: newTriggerType,
      keywords: keywordsArray,
      response: newResponse,
      enabled: true,
      triggerCount: 0,
      lastTriggered: 'الآن',
    };

    setRules([newRule, ...rules]);
    setIsModalOpen(false);
    setNewName('');
    setNewKeywords('');
    setNewResponse('');
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSimSend = () => {
    if (!simInput.trim()) return;

    const userText = simInput.trim();
    const timeNow = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    setSimMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        time: timeNow,
      },
    ]);
    setSimInput('');

    setTimeout(() => {
      const lower = userText.toLowerCase();
      const matchedRule = rules.find((r) => {
        if (!r.enabled) return false;
        if (r.triggerType === 'exact') {
          return r.keywords.some((k) => k.toLowerCase() === lower);
        }
        return r.keywords.some((k) => lower.includes(k.toLowerCase()));
      });

      let reply = '';
      if (matchedRule) {
        reply = matchedRule.response;
        setRules((prev) =>
          prev.map((r) =>
            r.id === matchedRule.id
              ? { ...r, triggerCount: r.triggerCount + 1, lastTriggered: 'الآن' }
              : r
          )
        );
      } else {
        reply =
          '🤖 لم يتم العثور على قاعدة مطابقة لهذه الكلمة.\nيمكنك إضافة قاعدة رد تلقائي جديدة عبر الزر العلوي لتفعيل الاستجابة التلقائية فوراً!';
      }

      setSimMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 500);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              محرك الأتمتة والردود الذكية (Sales Bot Flows)
            </h1>
            <Badge variant="gold">أتمتة مبيعات 24/7</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
            تهيئة ردود آلية ذكية لتحويل استفسارات العملاء إلى مبيعات مؤكدة على مدار الساعة بدون تدخل بشري.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="gold"
          size="sm"
          className="flex items-center gap-2"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          إضافة قاعدة أتمتة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rules list (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-dark-border bg-dark-card p-4">
              <span className="text-xs text-dark-text-muted font-medium">إجمالي القواعد</span>
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-white mt-1">{rules.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-dark-card p-4">
              <span className="text-xs text-dark-text-muted font-medium">القواعد النشطة</span>
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 mt-1">
                {rules.filter((r) => r.enabled).length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-dark-card p-4">
              <span className="text-xs text-dark-text-muted font-medium">ردود أغلقت مبيعات</span>
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300 mt-1">
                {rules.reduce((acc, r) => acc + r.triggerCount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Cards for each rule */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`rounded-2xl border p-4 transition-all bg-dark-card ${
                  rule.enabled ? 'border-dark-border' : 'border-dark-border/40 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-extrabold text-white">{rule.name}</h3>
                      <Badge
                        variant={rule.triggerType === 'welcome' ? 'gold' : rule.triggerType === 'commerce' ? 'info' : 'default'}
                        size="sm"
                      >
                        {rule.triggerType === 'welcome' ? 'ترحيب وكتالوج' : rule.triggerType === 'commerce' ? 'مبيعات وأسعار' : 'مطابقة كلمات'}
                      </Badge>
                    </div>

                    {/* Keywords */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rule.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 font-mono"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>

                    {/* Response snippet */}
                    <div className="mt-3 rounded-xl bg-dark-surface-elevated border border-dark-border p-3 text-xs text-dark-text-primary whitespace-pre-wrap leading-relaxed">
                      {rule.response}
                    </div>

                    {/* Stats footer */}
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-dark-text-muted font-mono">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <i className="fa-solid fa-bolt text-xs"></i>
                        تم الرد {rule.triggerCount} مرة
                      </span>
                      <span>آخر استجابة: {rule.lastTriggered}</span>
                    </div>
                  </div>

                  {/* Actions & toggle */}
                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.enabled ? 'bg-emerald-500' : 'bg-dark-border'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                          rule.enabled ? 'translate-x-1' : 'translate-x-6'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-dark-text-muted hover:text-rose-400 text-xs p-1 transition-colors"
                      title="حذف القاعدة"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Bot Simulator (Right 5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-2xl border border-dark-border bg-dark-card p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <i className="fa-solid fa-robot text-sm"></i>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">محاكي متجر واتساب التفاعلي</h3>
                  <p className="text-[10px] text-emerald-400 font-mono">متصل بالروبوت والقواعد النشطة ✓</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSimMessages([
                    {
                      sender: 'bot',
                      text: 'تمت إعادة تشغيل المحاكي! اكتب أي استفسار لتجربة الرد الفوري.',
                      time: 'الآن',
                    },
                  ])
                }
                className="text-xs text-dark-text-muted hover:text-white transition-colors"
                title="إعادة تعيين المحادثة"
              >
                <i className="fa-solid fa-arrows-rotate"></i>
              </button>
            </div>

            {/* Chat Simulator messages */}
            <div className="h-80 overflow-y-auto space-y-2.5 rounded-xl bg-[#0b141a] p-3 border border-dark-border">
              {simMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-black font-semibold'
                        : 'bg-[#1f2c34] text-white border border-dark-border/40'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-[11px]">{msg.text}</p>
                    <span className="mt-1 block text-[9px] opacity-60 text-left font-mono">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulator input */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSimSend()}
                placeholder="اكتب: مرحبا، المنيو، أو تتبع..."
                className="flex-1 rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs text-white placeholder:text-dark-text-muted focus:border-emerald-500 focus:outline-none"
              />
              <Button onClick={handleSimSend} variant="gold" size="sm" className="!px-3">
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-dark-border bg-dark-card p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-4">
              <h2 className="text-lg font-extrabold text-white">إضافة قاعدة أتمتة جديدة</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-dark-text-muted hover:text-white"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  اسم القاعدة
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: الاستفسار عن كود الخصم"
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  نوع القاعدة
                </label>
                <select
                  value={newTriggerType}
                  onChange={(e) => setNewTriggerType(e.target.value as any)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="contains">تحتوي الرسالة على إحدى الكلمات</option>
                  <option value="exact">مطابقة تامة لكلمة محددة</option>
                  <option value="commerce">استفسار تجاري / قائمة الأسعار</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  الكلمات المفتاحية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  required
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="كود, خصم, كوبون, تخفيض"
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  الرد التلقائي
                </label>
                <textarea
                  rows={4}
                  required
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="اكتب الرد الذي سيتم إرساله للعميل تلقائياً..."
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" variant="gold">
                  حفظ وتفعيل القاعدة
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
