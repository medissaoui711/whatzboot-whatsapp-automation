'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  email?: string;
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
}

const initialContacts: Contact[] = [
  {
    id: 'c-1',
    name: 'سارة الأحمد',
    phone: '+966 54 123 9876',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    email: 'sara.ahmed@example.com',
    tags: ['VIP ⭐', 'عميل متكرر'],
    totalOrders: 6,
    totalSpent: 1240,
    lastActive: 'منذ 10 دقائق',
  },
  {
    id: 'c-2',
    name: 'فهد العتيبي',
    phone: '+966 50 887 4321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    email: 'fahad@example.com',
    tags: ['طلب حديث'],
    totalOrders: 2,
    totalSpent: 350,
    lastActive: 'أمس',
  },
  {
    id: 'c-3',
    name: 'مؤسسة النماء للتجارة (خالد)',
    phone: '+966 55 334 7788',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    email: 'khaled@namaa.sa',
    tags: ['VIP ⭐', 'جملة وشركات'],
    totalOrders: 14,
    totalSpent: 8400,
    lastActive: 'منذ يومين',
  },
  {
    id: 'c-4',
    name: 'نورة الشمري',
    phone: '+966 56 776 2211',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    email: 'noura.sh@example.com',
    tags: ['VIP ⭐'],
    totalOrders: 5,
    totalSpent: 920,
    lastActive: 'منذ 3 أيام',
  },
  {
    id: 'c-5',
    name: 'عبدالرحمن الدوسري',
    phone: '+966 53 112 3344',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    tags: ['عميل محتمل'],
    totalOrders: 0,
    totalSpent: 0,
    lastActive: 'منذ أسبوع',
  },
  {
    id: 'c-6',
    name: 'ريم القحطاني',
    phone: '+966 59 998 8776',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    tags: ['سلة متروكة'],
    totalOrders: 1,
    totalSpent: 350,
    lastActive: 'منذ ساعتين',
  },
];

export default function ContactManagerPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // New Contact Form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+966 ');
  const [newTag, setNewTag] = useState('عميل محتمل');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedTag === 'all') return true;
    return c.tags.some((t) => t.includes(selectedTag));
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map((c) => c.id));
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newContact: Contact = {
      id: `c-${Date.now()}`,
      name: newName,
      phone: newPhone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      tags: [newTag],
      totalOrders: 0,
      totalSpent: 0,
      lastActive: 'الآن',
    };

    setContacts([newContact, ...contacts]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('+966 ');
  };

  const handleDeleteSelected = () => {
    setContacts((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              إدارة العملاء وشرائح المبيعات (CRM)
            </h1>
            <Badge variant="gold">قاعدة بيانات المشترين</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
            متابعة القيمة الإجمالية للعملاء (LTV)، تصنيفات VIP، وإطلاق حملات مخصصة عبر واتساب.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <i className="fa-solid fa-file-import text-xs"></i>
            استيراد ملف CSV
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            إضافة عميل جديد
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-dark-border bg-dark-card p-4">
          <span className="text-xs text-dark-text-muted font-medium">إجمالي قاعدة العملاء</span>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-white mt-1">
            {contacts.length * 420 + 320} عميل
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-dark-card p-4">
          <span className="text-xs text-dark-text-muted font-medium">كبار المشترين (VIP ⭐)</span>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300 mt-1">
            {contacts.filter((c) => c.tags.some((t) => t.includes('VIP'))).length} عملاء
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-dark-card p-4">
          <span className="text-xs text-dark-text-muted font-medium">إجمالي المبيعات المحققة (LTV)</span>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 mt-1">
            {contacts.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()} $
          </p>
        </div>
        <div className="rounded-2xl border border-sky-500/20 bg-dark-card p-4">
          <span className="text-xs text-dark-text-muted font-medium">متوسط مشتريات العميل</span>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-sky-400 mt-1">
            {(contacts.reduce((acc, c) => acc + c.totalSpent, 0) / (contacts.length || 1)).toFixed(0)} $
          </p>
        </div>
      </div>

      {/* Search & Filters Card */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-xs text-dark-text-muted"></i>
            <input
              type="text"
              placeholder="بحث بالاسم أو رقم الجوال..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-input py-2 pl-3 pr-9 text-xs text-dark-text-primary placeholder:text-dark-text-muted focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Tag filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'جميع العملاء' },
              { id: 'VIP', label: 'VIP ⭐' },
              { id: 'جملة', label: 'جملة وشركات' },
              { id: 'طلب حديث', label: 'طلب حديث' },
              { id: 'سلة متروكة', label: 'سلة متروكة' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTag(t.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors border ${
                  selectedTag === t.id
                    ? 'bg-emerald-500 text-black border-emerald-500'
                    : 'bg-dark-surface-elevated border-dark-border text-dark-text-secondary hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Bar if selected */}
        {selectedIds.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs">
            <span className="font-bold text-emerald-400">
              تم تحديد {selectedIds.length} جهة اتصال
            </span>
            <div className="flex items-center gap-2">
              <Link href="/send-message">
                <Button variant="primary" size="sm">
                  إطلاق حملة واتساب للمحددين
                </Button>
              </Link>
              <button
                onClick={handleDeleteSelected}
                className="text-rose-400 hover:text-rose-300 font-bold px-2 text-xs"
              >
                حذف المحدد
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {filteredContacts.length === 0 ? (
          <EmptyState
            icon="fa-solid fa-users-slash"
            title="لا توجد جهات اتصال مطابقة"
            description="جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b border-dark-border text-dark-text-muted bg-dark-surface-elevated/50">
                <tr>
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 && selectedIds.length === filteredContacts.length
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">العميل</th>
                  <th className="py-3 px-3">رقم الهاتف</th>
                  <th className="py-3 px-3">التصنيف</th>
                  <th className="py-3 px-3">الطلبات المنفذة</th>
                  <th className="py-3 px-3">إجمالي الإنفاق (LTV)</th>
                  <th className="py-3 px-3">آخر تفاعل</th>
                  <th className="py-3 px-3 text-center">إجراءات المبيعات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/40 text-dark-text-primary">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-dark-surface-elevated/40 transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(contact.id)}
                        onChange={() => handleToggleSelect(contact.id)}
                        className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="h-9 w-9 rounded-xl object-cover border border-dark-border"
                        />
                        <div>
                          <span className="font-bold text-white block text-xs sm:text-sm">
                            {contact.name}
                          </span>
                          {contact.email && (
                            <span className="text-[11px] text-dark-text-muted">
                              {contact.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-dark-text-secondary" dir="ltr">
                      {contact.phone}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={tag.includes('VIP') ? 'gold' : tag.includes('سلة') ? 'warning' : 'default'}
                            size="sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{contact.totalOrders} طلبات</td>
                    <td className="py-3 px-3 font-mono font-extrabold text-amber-300">
                      {contact.totalSpent.toLocaleString()} $
                    </td>
                    <td className="py-3 px-3 text-dark-text-muted">{contact.lastActive}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href="/team-inbox"
                          className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="فتح في الوارد التحادثي"
                        >
                          <i className="fa-solid fa-comments text-xs"></i>
                        </Link>
                        <a
                          href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="فتح في تطبيق واتساب"
                        >
                          <i className="fa-brands fa-whatsapp text-sm"></i>
                        </a>
                        <button
                          onClick={() =>
                            setContacts((prev) => prev.filter((c) => c.id !== contact.id))
                          }
                          className="rounded-lg p-1.5 text-dark-text-muted hover:text-rose-400 transition-colors"
                          title="حذف"
                        >
                          <i className="fa-regular fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-extrabold text-white mb-4 border-b border-dark-border pb-3">
              إضافة عميل جديد
            </h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: تركي الراجحي"
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  رقم الواتساب
                </label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  تصنيف الشريحة
                </label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="عميل محتمل">عميل محتمل</option>
                  <option value="VIP ⭐">VIP ⭐ (عميل مميز)</option>
                  <option value="جملة وشركات">جملة وشركات</option>
                  <option value="سلة متروكة">سلة متروكة</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" variant="gold">
                  حفظ العميل
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-extrabold text-white mb-4 border-b border-dark-border pb-3">
              استيراد جهات اتصال من ملف CSV / Excel
            </h3>
            <div className="space-y-4 text-xs text-dark-text-secondary">
              <div className="rounded-xl border-2 border-dashed border-dark-border p-6 text-center hover:border-emerald-500/50 cursor-pointer transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-emerald-400 mb-2"></i>
                <p className="font-bold text-white">اسحب وأفلت ملف CSV هنا أو اضغط للاختيار</p>
                <p className="text-[11px] text-dark-text-muted mt-1">
                  يجب أن يحتوي الملف على أعمدة: الاسم، رقم الهاتف، والتصنيف.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  إغلاق
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    alert('تم استيراد جهات الاتصال بنجاح!');
                  }}
                >
                  بدء الاستيراد
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
