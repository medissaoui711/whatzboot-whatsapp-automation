'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { WhatsAppGroup, initialGroupsData } from '@/data/whatsapp-groups.data';

export default function WhatsAppGroupsPage() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>(initialGroupsData);
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'broadcast' | 'activity'>('overview');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0].id);

  // Broadcaster state
  const [selectedGroupIdsForBroadcast, setSelectedGroupIdsForBroadcast] = useState<string[]>([
    groups[0].id,
    groups[1].id,
  ]);
  const [broadcastMessage, setBroadcastMessage] = useState(
    '⚡ عرض خاص وحصري لأعضاء مجتمع واتساب! احصل على خصم 20% إضافي على جميع المنتجات باستخدام كود [FLASH20] اليوم فقط.'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // New Group Modal state
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'vip_customers' | 'flash_deals' | 'b2b_wholesale' | 'community'>('vip_customers');

  // Keyword adder state
  const [newKeyword, setNewKeyword] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const handleExportContacts = (group: WhatsAppGroup) => {
    // Generate dummy CSV string for members
    const csvContent = `data:text/csv;charset=utf-8,الاسم,الهاتف,المجموعة,الحالة\n` +
      Array.from({ length: 25 })
        .map((_, i) => `عضو ${i + 1},+96650${Math.floor(1000000 + Math.random() * 9000000)},${group.name},نشط`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `جهات_اتصال_${group.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`تم تصدير جهات اتصال "${group.name}" بنجاح كملف CSV!`);
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim() || selectedGroupIdsForBroadcast.length === 0) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      showToast(`تم نشر العرض بنجاح في ${selectedGroupIdsForBroadcast.length} مجموعات بفاصل زمني آمن!`);
      setTimeout(() => setBroadcastSuccess(false), 4000);
    }, 1500);
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === selectedGroupId) {
          return {
            ...g,
            bannedKeywords: [...g.bannedKeywords, newKeyword.trim()],
          };
        }
        return g;
      })
    );
    setNewKeyword('');
    showToast('تمت إضافة الكلمة لقائمة الحظر التلقائي!');
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === selectedGroupId) {
          return {
            ...g,
            bannedKeywords: g.bannedKeywords.filter((k) => k !== keywordToRemove),
          };
        }
        return g;
      })
    );
    showToast('تمت إزالة الكلمة من قائمة الحظر.');
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newG: WhatsAppGroup = {
      id: `grp-${Date.now()}`,
      name: newGroupName,
      category: newGroupCategory,
      categoryLabel:
        newGroupCategory === 'vip_customers'
          ? 'عملاء مميزين VIP'
          : newGroupCategory === 'flash_deals'
          ? 'عروض وتخفيضات فلاش'
          : newGroupCategory === 'b2b_wholesale'
          ? 'طلبات الجملة B2B'
          : 'مجتمع عام',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      memberCount: 1,
      maxCapacity: 1024,
      inviteLink: `https://chat.whatsapp.com/G${Math.random().toString(36).substring(2, 9)}`,
      status: 'active',
      statusLabel: 'نشطة وجديدة',
      antiSpamEnabled: true,
      autoWelcomeEnabled: true,
      welcomeMessage: `أهلاً بك في مجموعة ${newGroupName}! نتمنى لك تجربة تسوق رائعة.`,
      bannedKeywords: ['اعلان', 'تداول', 'روابط'],
      blockLinks: true,
      lockSchedule: {
        enabled: true,
        lockTime: '23:00',
        unlockTime: '08:00',
      },
      totalSpamBlocked: 0,
      totalWelcomed: 1,
      recentActivity: [{ id: `act-${Date.now()}`, time: 'الآن', action: 'تم إنشاء وتفعيل المجموعة', type: 'join' }],
    };

    setGroups((prev) => [newG, ...prev]);
    setShowNewGroupModal(false);
    setNewGroupName('');
    showToast(`تم إنشاء وتفعيل المجموعة "${newG.name}" بنجاح!`);
  };

  const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0);
  const totalSpam = groups.reduce((sum, g) => sum + g.totalSpamBlocked, 0);
  const totalWelcomed = groups.reduce((sum, g) => sum + g.totalWelcomed, 0);

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-emerald-500 text-black px-4 py-2 text-xs font-bold shadow-2xl shadow-emerald-500/40 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dark-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <i className="fa-solid fa-users-rectangle text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">إدارة مجموعات واتساب (Groups Suite)</h1>
                <Badge variant="commerce" size="sm">
                  Community AI 👥
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-dark-text-secondary mt-0.5">
                منظومة مركزية لإدارة مجتمعات العملاء، حماية المجموعات من السبام والروابط، الترحيب التلقائي، والبث المجدول.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={() => setShowNewGroupModal(true)}
            variant="commerce"
            size="md"
            className="text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20"
          >
            <i className="fa-solid fa-plus ml-1.5"></i>
            إنشاء مجموعة جديدة
          </Button>

          <Button
            onClick={() => handleExportContacts(activeGroup)}
            variant="secondary"
            size="md"
            className="text-xs sm:text-sm !border-sky-500/30 text-sky-300 hover:bg-sky-500/10"
          >
            <i className="fa-solid fa-file-arrow-down ml-1.5"></i>
            تصدير جهات الاتصال (CSV)
          </Button>
        </div>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">المجموعات النشطة</span>
            <span className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">
              <i className="fa-solid fa-comments"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{groups.length}</span>
            <span className="text-xs text-emerald-400 font-bold">مجموعات رسمية</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">توليد تلقائي عند اكتمال السعة</p>
        </Card>

        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">إجمالي الأعضاء المستضافين</span>
            <span className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-sm border border-sky-500/20">
              <i className="fa-solid fa-user-group"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-400 font-mono">{totalMembers.toLocaleString()}</span>
            <span className="text-xs text-sky-300 font-bold">عضو نشط</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">جمهور جاهز لإعادة الاستهداف</p>
        </Card>

        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">رسائل السبام والروابط المحظورة</span>
            <span className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-sm border border-rose-500/20">
              <i className="fa-solid fa-shield-halved"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-400 font-mono">{totalSpam}</span>
            <span className="text-xs text-rose-300 font-bold">حظر فوري</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">حماية 100% من الإعلانات المزعجة</p>
        </Card>

        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">رسائل الترحيب التلقائية</span>
            <span className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm border border-amber-500/20">
              <i className="fa-solid fa-gift"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{totalWelcomed.toLocaleString()}</span>
            <span className="text-xs text-amber-300 font-bold">كوبون ترحيبي</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">نسبة استخدام الكوبون: 34%</p>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-dark-border/60 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-dark-text-secondary hover:text-white hover:bg-dark-surface-elevated'
          }`}
        >
          <i className="fa-solid fa-grid-2"></i>
          المجموعات وقائمة الأعضاء ({groups.length})
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-dark-text-secondary hover:text-white hover:bg-dark-surface-elevated'
          }`}
        >
          <i className="fa-solid fa-shield-virus"></i>
          المشرف الذكي وقواعد الحماية (Anti-Spam)
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-dark-text-secondary hover:text-white hover:bg-dark-surface-elevated'
          }`}
        >
          <i className="fa-solid fa-bullhorn"></i>
          البث والنشر المتعدد للمجموعات
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'activity'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-dark-text-secondary hover:text-white hover:bg-dark-surface-elevated'
          }`}
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          سجل النشاط اللحظي للأعضاء
        </button>
      </div>

      {/* Tab 1: Overview & Active Groups List */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group) => {
            const fillPercent = Math.round((group.memberCount / group.maxCapacity) * 100);
            return (
              <Card
                key={group.id}
                className="border-dark-border/80 bg-dark-card p-5 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-dark-border"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white">{group.name}</h3>
                        <span className="text-[11px] text-emerald-400 font-medium">{group.categoryLabel}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        group.status === 'full'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : group.status === 'almost_full'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {group.statusLabel}
                    </span>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="space-y-1.5 bg-dark-bg/60 p-3 rounded-xl border border-dark-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-text-muted">السعة الحالية</span>
                      <span className="font-mono font-bold text-white">
                        {group.memberCount} / {group.maxCapacity} ({fillPercent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-dark-border/60 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${fillPercent}%` }}
                        className={`h-full rounded-full transition-all ${
                          fillPercent >= 100
                            ? 'bg-rose-500'
                            : fillPercent >= 90
                            ? 'bg-amber-400'
                            : 'bg-whatsapp-green'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Automation Status Chips */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-dark-text-secondary bg-dark-surface-elevated/80 p-2 rounded-lg border border-dark-border/40">
                      <i className="fa-solid fa-shield-check text-emerald-400"></i>
                      <span>حظر روابط السبام</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-dark-text-secondary bg-dark-surface-elevated/80 p-2 rounded-lg border border-dark-border/40">
                      <i className="fa-solid fa-gift text-amber-400"></i>
                      <span>ترحيب بكوبون</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-dark-border/60 flex items-center gap-2">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(group.inviteLink);
                      showToast('تم نسخ رابط دعوة المجموعة إلى الحافظة!');
                    }}
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <i className="fa-solid fa-copy ml-1"></i>
                    نسخ الرابط
                  </Button>

                  <Button
                    onClick={() => handleExportContacts(group)}
                    variant="commerce"
                    size="sm"
                    className="text-xs"
                  >
                    <i className="fa-solid fa-download ml-1"></i>
                    تصدير
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab 2: AI Auto-Moderation & Anti-Spam Rules */}
      {activeTab === 'moderation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Select Group for Configuration (4 Columns) */}
          <div className="lg:col-span-4 space-y-3">
            <Card className="border-dark-border/80 bg-dark-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <i className="fa-solid fa-users text-emerald-400"></i>
                اختر المجموعة لتعديل قواعد الحماية
              </h3>

              <div className="space-y-2">
                {groups.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      selectedGroupId === g.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm shadow-emerald-500/20'
                        : 'border-dark-border bg-dark-surface-elevated/60 text-dark-text-secondary hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={g.avatar} alt={g.name} className="h-8 w-8 rounded-lg object-cover" />
                      <span className="text-xs font-bold truncate max-w-[170px]">{g.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-dark-text-muted">{g.memberCount} عضو</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Rules Editor (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="border-dark-border/80 bg-dark-card p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <img src={activeGroup.avatar} alt={activeGroup.name} className="h-10 w-10 rounded-xl object-cover border border-dark-border" />
                  <div>
                    <h3 className="text-base font-bold text-white">إعدادات حماية: {activeGroup.name}</h3>
                    <span className="text-xs text-emerald-400 font-mono">المشرف الآلي نشط على مدار الساعة</span>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-link-slash text-rose-400"></i>
                      حظر الروابط الإعلانية تلقائياً
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked={activeGroup.blockLinks}
                      className="h-4 w-4 rounded border-dark-border text-whatsapp-green bg-dark-bg focus:ring-whatsapp-green"
                    />
                  </div>
                  <p className="text-[11px] text-dark-text-secondary">
                    حذف أي رسالة تحتوي على روابط إنترنت أو روابط قروبات منافسة فور إرسالها.
                  </p>
                </div>

                <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-moon text-indigo-400"></i>
                      جدول إغلاق المجموعة الليلي
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked={activeGroup.lockSchedule.enabled}
                      className="h-4 w-4 rounded border-dark-border text-whatsapp-green bg-dark-bg focus:ring-whatsapp-green"
                    />
                  </div>
                  <p className="text-[11px] text-dark-text-secondary">
                    إغلاق النشر للأعضاء من 11:00 م حتى 08:00 ص لحفظ هدوء المجموعة.
                  </p>
                </div>
              </div>

              {/* Banned Keywords List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-ban text-rose-400"></i>
                  قائمة الكلمات المحظورة الحية (حذف فوري وتنبيه العضو):
                </h4>

                <div className="flex flex-wrap gap-2">
                  {activeGroup.bannedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-xs text-rose-300 font-bold"
                    >
                      {kw}
                      <button
                        onClick={() => handleRemoveKeyword(kw)}
                        className="hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="أضف كلمة جديدة لحظرهـا (مثال: تداول، تسويق، قروب)..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddKeyword();
                    }}
                    className="flex-1 rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <Button onClick={handleAddKeyword} variant="secondary" size="sm" className="text-xs">
                    + إضافة كلمة
                  </Button>
                </div>
              </div>

              {/* Auto Welcome Message */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
                  رسالة الترحيب التلقائية عند انضمام عضو جديد:
                </h4>
                <textarea
                  rows={3}
                  defaultValue={activeGroup.welcomeMessage}
                  className="w-full rounded-xl border border-dark-border bg-dark-input p-3 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => showToast('تم حفظ قواعد الترحيب والحماية بنجاح!')}
                    variant="commerce"
                    size="sm"
                    className="text-xs"
                  >
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Multi-Group Broadcaster */}
      {activeTab === 'broadcast' && (
        <Card className="border-dark-border/80 bg-dark-card p-5 space-y-5 max-w-4xl mx-auto shadow-2xl">
          <div className="border-b border-dark-border/60 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-bullhorn text-amber-400"></i>
              بث العروض والرسائل المتعددة لجميع المجموعات (Multi-Group Broadcaster)
            </h3>
            <p className="text-xs text-dark-text-secondary mt-0.5">
              إرسال عروض ترويجية لعدة مجموعات في نفس الوقت مع فاصل زمني أمني للحفاظ على أمان رقم الواتساب.
            </p>
          </div>

          {/* Group Selection Checkboxes */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-white block">اختر المجموعات المستهدفة بالبث:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {groups.map((g) => {
                const isChecked = selectedGroupIdsForBroadcast.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      setSelectedGroupIdsForBroadcast((prev) =>
                        isChecked ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                      );
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      isChecked
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm shadow-amber-500/20'
                        : 'border-dark-border bg-dark-surface-elevated/60 text-dark-text-secondary hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-dark-border text-amber-500 focus:ring-amber-500 bg-dark-bg"
                      />
                      <div>
                        <span className="text-xs font-bold block">{g.name}</span>
                        <span className="text-[10px] text-dark-text-muted">{g.memberCount} عضو</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white block">نص الرسالة أو العرض:</label>
            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-input p-3 text-xs text-white leading-relaxed focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>

          {/* Broadcast Safety & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-dark-border/60">
            <div className="flex items-center gap-2 text-xs text-dark-text-secondary font-mono">
              <i className="fa-solid fa-shield-check text-emerald-400"></i>
              <span>الحماية الذكية: إرسال متتابع بفاصل 3-5 ثوانٍ بين المجموعات</span>
            </div>

            <Button
              onClick={handleSendBroadcast}
              disabled={isBroadcasting || selectedGroupIdsForBroadcast.length === 0}
              variant="commerce"
              size="md"
              className="text-xs font-bold shadow-lg shadow-emerald-500/20"
            >
              {isBroadcasting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin ml-1.5"></i>
                  جارٍ البث في المجموعات...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane ml-1.5"></i>
                  إرسال البث إلى {selectedGroupIdsForBroadcast.length} مجموعات
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 4: Live Activity Log */}
      {activeTab === 'activity' && (
        <Card className="border-dark-border/80 bg-dark-card p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-timeline text-sky-400"></i>
            سجل النشاط اللحظي والتفاعلات داخل المجموعات
          </h3>

          <div className="space-y-3">
            {groups.flatMap((g) => g.recentActivity.map((a) => ({ ...a, groupName: g.name }))).map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-surface-elevated/70 p-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs ${
                      act.type === 'spam_blocked'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : act.type === 'broadcast'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        act.type === 'spam_blocked'
                          ? 'fa-shield-halved'
                          : act.type === 'broadcast'
                          ? 'fa-bullhorn'
                          : 'fa-user-plus'
                      }`}
                    ></i>
                  </span>

                  <div>
                    <span className="font-bold text-white block">{act.action}</span>
                    <span className="text-[10px] text-dark-text-muted">{act.groupName}</span>
                  </div>
                </div>

                <span className="text-[10px] text-dark-text-muted font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-users-plus text-emerald-400"></i>
                إنشاء وتفعيل مجموعة واتساب جديدة
              </h3>
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="h-8 w-8 rounded-lg border border-dark-border text-dark-text-secondary hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-white block mb-1">اسم المجموعة:</label>
                <input
                  type="text"
                  placeholder="مثال: نادي عملاء VIP #2 أو صفقات العيد..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1">نوع وتصنيف المجموعة:</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="vip_customers">👑 كبار العملاء VIP</option>
                  <option value="flash_deals">⚡ صفقات وتخفيضات فلاش</option>
                  <option value="b2b_wholesale">🏢 تجار جملة وموزعين</option>
                  <option value="community">👥 مجتمع عام</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-dark-border/60">
              <Button onClick={() => setShowNewGroupModal(false)} variant="secondary" size="sm">
                إلغاء
              </Button>
              <Button onClick={handleCreateGroup} variant="commerce" size="sm">
                إنشاء وتوليد الرابط الذكي
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
