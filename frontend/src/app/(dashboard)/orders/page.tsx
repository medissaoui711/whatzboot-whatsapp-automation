'use client';

import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/order.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import {
  defaultPersonas,
  VoicePersona,
  speakText,
  generateVoiceResponse,
  stopAllSpeech,
} from '@/services/gemini-voice.service';

const statusStyles: Record<OrderStatus, { variant: 'warning' | 'info' | 'purple' | 'success' | 'danger'; label: string }> = {
  Pending: {
    variant: 'warning',
    label: 'قيد الانتظار',
  },
  Confirmed: {
    variant: 'info',
    label: 'تم التأكيد',
  },
  Preparing: {
    variant: 'purple',
    label: 'قيد التجهيز',
  },
  Completed: {
    variant: 'success',
    label: 'مكتمل ومسلَّم',
  },
  Cancelled: {
    variant: 'danger',
    label: 'ملغي',
  },
};

interface AbandonedCart {
  id: string;
  customerName: string;
  customerPhone: string;
  items: string;
  value: string;
  timeAgo: string;
}

const initialAbandonedCarts: AbandonedCart[] = [
  {
    id: 'AC-301',
    customerName: 'ريم القحطاني',
    customerPhone: '+966 53 998 1122',
    items: 'باقة العناية الملكية (قطعتين)',
    value: '350.00 $',
    timeAgo: 'منذ ساعتين',
  },
  {
    id: 'AC-302',
    customerName: 'فيصل السبيعي',
    customerPhone: '+966 55 120 4499',
    items: 'ساعة ذكية مقاومة للماء + شاحن سريع',
    value: '220.00 $',
    timeAgo: 'منذ 5 ساعات',
  },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(initialAbandonedCarts);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'abandoned'>('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Voice AI Calling States
  const [activeCallTarget, setActiveCallTarget] = useState<{
    type: 'cart' | 'order';
    id: string;
    name: string;
    phone: string;
    amount: string;
    items: string;
  } | null>(null);
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [liveCallDuration, setLiveCallDuration] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [selectedVoicePersona, setSelectedVoicePersona] = useState<VoicePersona>(defaultPersonas[0]);
  const [liveCallTranscript, setLiveCallTranscript] = useState<
    { sender: 'agent' | 'customer'; text: string; time: string }[]
  >([]);

  // Timer for active call
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLiveCallActive) {
      interval = setInterval(() => {
        setLiveCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setLiveCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartVoiceCall = (target: {
    type: 'cart' | 'order';
    id: string;
    name: string;
    phone: string;
    amount: string;
    items: string;
  }) => {
    setActiveCallTarget(target);
    setIsLiveCallActive(true);

    const initialGreeting =
      target.type === 'cart'
        ? `مرحباً بك أستاذ ${target.name.split(' ')[0]}! معك سارة من المتجر، لاحظت رغبتك بشراء ${target.items} بقيمة ${target.amount}. يسعدني إهداؤك كود خصم إضافي 10% [SAVE10] وشحن مجاني لإتمام السلة فوراً!`
        : `أهلاً بك أستاذ ${target.name.split(' ')[0]}! معك سارة لتأكيد طلبك رقم #${target.id} بقيمة ${target.amount} (${target.items}). هل ترغب بتأكيد عنوان التوصيل والدفع عند الاستلام اليوم؟`;

    setLiveCallTranscript([
      {
        sender: 'agent',
        text: initialGreeting,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsAISpeaking(true);
    speakText(
      initialGreeting,
      selectedVoicePersona,
      () => setIsAISpeaking(true),
      () => setIsAISpeaking(false)
    );
  };

  const handleSimulateCustomerInOrderCall = (customerText: string) => {
    const customerMsg = {
      sender: 'customer' as const,
      text: customerText,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveCallTranscript((prev) => [...prev, customerMsg]);

    setIsAISpeaking(true);
    setTimeout(async () => {
      if (!activeCallTarget) return;

      const response = await generateVoiceResponse(
        customerText,
        selectedVoicePersona,
        liveCallTranscript.map((t) => ({
          role: t.sender === 'agent' ? 'model' : 'user',
          text: t.text,
        })),
        {
          customerName: activeCallTarget.name,
          cartTotal: activeCallTarget.amount,
          cartItems: activeCallTarget.items,
        }
      );

      const aiMsg = {
        sender: 'agent' as const,
        text: response,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };

      setLiveCallTranscript((prev) => [...prev, aiMsg]);
      speakText(
        response,
        selectedVoicePersona,
        () => setIsAISpeaking(true),
        () => setIsAISpeaking(false)
      );
    }, 1000);
  };

  const handleEndVoiceCall = () => {
    setIsLiveCallActive(false);
    setIsAISpeaking(false);
    stopAllSpeech();
  };

  // New order form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+966 ');
  const [productName, setProductName] = useState('بيتزا مارغريتا');
  const [productPrice, setProductPrice] = useState('45');
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await orderService.getOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
    );
    setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity) || 1;
    const price = parseFloat(productPrice) || 45;
    const total = qty * price;

    const newOrder: Order = {
      id: `WB-${1050 + orders.length}`,
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      items: [
        {
          id: Date.now(),
          name: productName,
          quantity: qty,
          price: price,
        },
      ],
      total: total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    setCustomerName('');
    setCustomerPhone('+966 ');
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search);

    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return ['Pending', 'Preparing', 'Confirmed'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'Completed';
    return true;
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header & Main Commerce Actions */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              إدارة الطلبات والسلات التحادثية
            </h1>
            <Badge variant="gold">مبيعات مباشرة</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-dark-text-secondary">
            متابعة فورية للطلبات، إصدار روابط الدفع، واسترداد سلات الشراء المتروكة عبر رسائل واتساب.
          </p>
        </div>

        <Button
          onClick={() => setIsNewOrderModalOpen(true)}
          variant="gold"
          size="sm"
          className="flex items-center gap-2"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          إنشاء طلب جديد
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-amber-500/20 bg-dark-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-secondary">إجمالي المبيعات المؤكدة</span>
            <i className="fa-solid fa-coins text-amber-400 text-sm"></i>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300 mt-2">
            {orders.reduce((acc, o) => acc + o.total, 0).toFixed(0)} $
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-dark-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-secondary">الطلبات المكتملة</span>
            <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 mt-2">
            {orders.filter((o) => o.status === 'Completed').length} طلب
          </p>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-dark-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-secondary">طلبات جارية وقيد التجهيز</span>
            <i className="fa-solid fa-clock text-sky-400 text-sm"></i>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-sky-400 mt-2">
            {orders.filter((o) => ['Pending', 'Preparing'].includes(o.status)).length} طلب
          </p>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-dark-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-secondary">سلات متروكة تحتاج تذكير</span>
            <i className="fa-solid fa-cart-arrow-down text-rose-400 text-sm"></i>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-extrabold text-rose-400 mt-2">
            {abandonedCarts.length} سلة (570 $)
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-xs text-dark-text-muted"></i>
            <input
              type="text"
              placeholder="بحث برقم الطلب، اسم العميل، أو الجوال..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-input py-2 pl-3 pr-9 text-xs text-dark-text-primary placeholder:text-dark-text-muted focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'جميع الطلبات' },
              { id: 'pending', label: 'الطلبات الجارية' },
              { id: 'completed', label: 'المكتملة والمسلَّمة' },
              { id: 'abandoned', label: `سلات متروكة (${abandonedCarts.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors border ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-black border-emerald-500 shadow'
                    : 'bg-dark-surface-elevated border-dark-border text-dark-text-secondary hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Abandoned Carts Recovery */}
        {activeTab === 'abandoned' ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-center justify-between">
              <span>
                💡 السلات المتروكة هي عملاء أضافوا منتجات دون إتمام الدفع. إرسال تذكير مع كود خصم يحقق نسبة استرداد 34%.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="border-b border-dark-border text-dark-text-muted bg-dark-surface-elevated/50">
                  <tr>
                    <th className="py-3 px-3">رقم السلة</th>
                    <th className="py-3 px-3">العميل</th>
                    <th className="py-3 px-3">المنتجات المتروكة</th>
                    <th className="py-3 px-3">القيمة التقديرية</th>
                    <th className="py-3 px-3">الوقت</th>
                    <th className="py-3 px-3 text-center">إجراء الاسترداد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40 text-dark-text-primary">
                  {abandonedCarts.map((cart) => (
                    <tr key={cart.id} className="hover:bg-dark-surface-elevated/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">{cart.id}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{cart.customerName}</span>
                        <span className="text-[11px] text-dark-text-muted font-mono" dir="ltr">
                          {cart.customerPhone}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-dark-text-secondary">{cart.items}</td>
                      <td className="py-3 px-3 font-mono font-bold text-white">{cart.value}</td>
                      <td className="py-3 px-3 text-dark-text-muted">{cart.timeAgo}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            onClick={() =>
                              handleStartVoiceCall({
                                type: 'cart',
                                id: cart.id,
                                name: cart.customerName,
                                phone: cart.customerPhone,
                                amount: cart.value,
                                items: cart.items,
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-2.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-colors shadow-sm shadow-amber-500/10"
                            title="بدء مكالمة صوتية ذكية لاسترداد السلة"
                          >
                            <i className="fa-solid fa-phone-volume text-xs animate-pulse"></i>
                            <span>اتصال ذكي (Voice AI)</span>
                          </button>

                          <a
                            href={`https://wa.me/${cart.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `مرحباً ${cart.customerName}، لاحظنا أنك تركت سلة التسوق الخاصة بك! نهديك كود خصم إضافي 10% [SAVE10] متاح اليوم فقط لإتمام طلبك عبر هذا الرابط: https://whatzboot.store/cart/${cart.id}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                          >
                            <i className="fa-brands fa-whatsapp"></i>
                            <span>واتساب</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Tab 2: Orders Table */
          loading ? (
            <div className="flex h-48 items-center justify-center">
              <i className="fas fa-spinner fa-spin text-2xl text-emerald-400"></i>
            </div>
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              icon="fa-solid fa-receipt"
              title="لا توجد طلبات مطابقة"
              description="لم يتم العثور على أي طلبات في هذه الشريحة."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="border-b border-dark-border text-dark-text-muted bg-dark-surface-elevated/50">
                  <tr>
                    <th className="py-3 px-3">رقم الطلب</th>
                    <th className="py-3 px-3">العميل</th>
                    <th className="py-3 px-3">المنتجات</th>
                    <th className="py-3 px-3">المبلغ الإجمالي</th>
                    <th className="py-3 px-3 text-center">الحالة</th>
                    <th className="py-3 px-3 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40 text-dark-text-primary">
                  {filteredOrders.map((order) => {
                    const style = statusStyles[order.status] || statusStyles.Pending;
                    return (
                      <tr key={order.id} className="hover:bg-dark-surface-elevated/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-amber-400">
                          {order.id}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-white block">{order.customer.name}</span>
                          <span className="text-[11px] text-dark-text-muted font-mono" dir="ltr">
                            {order.customer.phone}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-dark-text-secondary">
                          {order.items.map((it) => `${it.name} (${it.quantity})`).join(', ')}
                        </td>
                        <td className="py-3 px-3 font-bold font-mono text-white">
                          {order.total.toFixed(2)} $
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge variant={style.variant} size="sm">
                            {style.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedOrder(order)}
                              className="!text-xs !py-1"
                            >
                              <i className="fa-solid fa-eye ml-1"></i>
                              عرض وتحديث
                            </Button>

                            {order.status === 'Pending' && (
                              <button
                                onClick={() =>
                                  handleStartVoiceCall({
                                    type: 'order',
                                    id: order.id,
                                    name: order.customer.name,
                                    phone: order.customer.phone,
                                    amount: `${order.total.toFixed(2)} $`,
                                    items: order.items.map((it) => it.name).join(', '),
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                                title="تأكيد هاتفي بالذكاء الاصطناعي"
                              >
                                <i className="fa-solid fa-phone text-[10px]"></i>
                                <span>تأكيد صوتي AI</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </Card>

      {/* Order Details & WhatsApp Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-dark-border bg-dark-card p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  تفاصيل الطلب: <span className="font-mono text-amber-400">#{selectedOrder.id}</span>
                </h3>
                <p className="text-xs text-dark-text-secondary mt-0.5">
                  معاملة مسجلة عبر متجر واتساب التحادثي
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-dark-text-muted hover:text-white"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Customer Info */}
            <div className="rounded-xl bg-dark-surface-elevated border border-dark-border p-3 space-y-1.5 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-dark-text-secondary">اسم العميل:</span>
                <span className="font-bold text-white">
                  {selectedOrder.customer.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-text-secondary">رقم الهاتف:</span>
                <span className="font-mono text-emerald-400" dir="ltr">
                  {selectedOrder.customer.phone}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-bold uppercase text-dark-text-muted">
                أصناف السلة
              </h4>
              <div className="divide-y divide-dark-border/40 border border-dark-border rounded-xl bg-dark-bg p-3 text-xs">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5">
                    <span className="text-dark-text-primary font-medium">
                      {it.name} × {it.quantity}
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      {(it.price * it.quantity).toFixed(2)} $
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2.5 font-bold text-sm text-white">
                  <span>المجموع النهائي:</span>
                  <span className="font-mono text-emerald-400">{selectedOrder.total.toFixed(2)} $</span>
                </div>
              </div>
            </div>

            {/* Status updates */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold uppercase text-dark-text-muted">
                تحديث حالة الطلب
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Pending', 'Confirmed', 'Preparing', 'Completed'] as OrderStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleUpdateStatus(status)}
                      className={`rounded-xl p-2 text-xs font-bold border transition-colors ${
                        selectedOrder.status === status
                          ? 'border-emerald-500 bg-emerald-500 text-black'
                          : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:border-emerald-500/40 hover:text-white'
                      }`}
                    >
                      {statusStyles[status]?.label || status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* WhatsApp Notification & Actions */}
            <div className="flex flex-col sm:flex-row gap-2 border-t border-dark-border pt-4">
              <button
                type="button"
                onClick={() => {
                  handleStartVoiceCall({
                    type: 'order',
                    id: selectedOrder.id,
                    name: selectedOrder.customer.name,
                    phone: selectedOrder.customer.phone,
                    amount: `${selectedOrder.total.toFixed(2)} $`,
                    items: selectedOrder.items.map((it) => it.name).join(', '),
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
              >
                <i className="fa-solid fa-phone-volume text-sm animate-pulse"></i>
                مكالمة هاتفية ذكية لتأكيد الطلب والعنوان
              </button>

              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `مرحباً ${selectedOrder.customer.name}، نود إعلامك بأن حالة طلبك رقم ${selectedOrder.id} أصبحت الآن: [${statusStyles[selectedOrder.status]?.label}]. شكراً لتسوقك معنا! 🌸`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-colors"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                إشعار العميل عبر واتساب
              </a>
              <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-extrabold text-white mb-4 border-b border-dark-border pb-3">
              تسجيل طلب مبيعات جديد
            </h3>
            <form onSubmit={handleCreateOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  اسم العميل
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: محمد الغامدي"
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-dark-text-primary focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  رقم الواتساب
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-dark-text-primary font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-dark-text-primary focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                    السعر ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-dark-text-primary focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-text-secondary mb-1">
                    الكمية
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs sm:text-sm text-dark-text-primary focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsNewOrderModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" variant="gold">
                  إضافة الطلب وحفظ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* Live AI Voice Call Dialog for Orders & Abandoned Carts                     */}
      {/* ========================================================================= */}
      {activeCallTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-amber-500/40 bg-dark-card p-6 shadow-2xl space-y-4 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-xl">
                    <span>{activeCallTarget.type === 'cart' ? '🛒' : '📦'}</span>
                  </div>
                  {isLiveCallActive && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>
                      {activeCallTarget.type === 'cart' ? 'مكالمة استرداد سلة مع:' : 'مكالمة تأكيد طلب مع:'}{' '}
                      {activeCallTarget.name}
                    </span>
                    <Badge variant="warning" size="sm">
                      {formatDuration(liveCallDuration)}
                    </Badge>
                  </h3>
                  <p className="text-xs text-dark-text-muted font-mono" dir="ltr">
                    {activeCallTarget.phone} • {activeCallTarget.amount} ({activeCallTarget.items})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleEndVoiceCall();
                  setActiveCallTarget(null);
                }}
                className="text-dark-text-muted hover:text-white"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Live Audio Visualizer Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-dark-surface-elevated via-amber-950/20 to-dark-surface-elevated border border-amber-500/20 p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 h-10">
                {[30, 60, 90, 45, 80, 100, 70, 40, 85, 60, 30, 75, 95, 50, 20].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      height: isLiveCallActive && isAISpeaking ? `${Math.max(h * Math.random(), 15)}%` : '15%',
                    }}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isAISpeaking ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500/50'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300">
                <i className="fa-solid fa-microphone-lines animate-pulse"></i>
                <span>{isAISpeaking ? 'سارة (الوكيل الصوتي) تتحدث مع العميل...' : 'بانتظار رد العميل (استماع ذكي)...'}</span>
              </div>
            </div>

            {/* Live Call Transcript Scroll */}
            <div className="rounded-xl border border-dark-border bg-black/40 p-3 h-48 overflow-y-auto space-y-2.5">
              {liveCallTranscript.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col text-xs ${
                    t.sender === 'agent' ? 'items-end text-right' : 'items-start text-right'
                  }`}
                >
                  <span className="text-[10px] text-dark-text-muted mb-0.5">
                    {t.sender === 'agent' ? 'سارة (الوكيل الصوتي)' : activeCallTarget.name} • {t.time}
                  </span>
                  <div
                    className={`p-2.5 rounded-xl max-w-sm leading-relaxed ${
                      t.sender === 'agent'
                        ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100'
                        : 'bg-dark-surface-elevated border border-dark-border text-white'
                    }`}
                  >
                    {t.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Customer Simulated Replies */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-dark-text-muted">
                محاكاة رد العميل الصوتي:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'نعم العنوان صحيح، وأرغب بتأكيد الطلب وشحنه اليوم!',
                  'هل أقدر أغير طريقة الدفع إلى تحويل بنكي أو مدى؟',
                  'تمام شكرًا لكِ، كود الخصم ممتاز وسأكمل السلة حالاً.',
                ].map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSimulateCustomerInOrderCall(reply)}
                    className="text-xs bg-dark-surface-elevated hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-dark-border text-dark-text-primary hover:text-white px-2.5 py-1.5 rounded-lg transition-all text-right"
                  >
                    🗣️ {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Call Actions & Auto Confirm */}
            <div className="flex items-center justify-between pt-2 border-t border-dark-border flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {activeCallTarget.type === 'order' ? (
                  <Button
                    size="sm"
                    variant="commerce"
                    onClick={() => {
                      setOrders((prev) =>
                        prev.map((o) => (o.id === activeCallTarget.id ? { ...o, status: 'Confirmed' } : o))
                      );
                      handleEndVoiceCall();
                      setActiveCallTarget(null);
                    }}
                    className="!text-xs"
                  >
                    <i className="fa-solid fa-check ml-1"></i>
                    تأكيد الطلب وتجهيز الشحن ✅
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="commerce"
                    onClick={() => {
                      setAbandonedCarts((prev) => prev.filter((c) => c.id !== activeCallTarget.id));
                      handleEndVoiceCall();
                      setActiveCallTarget(null);
                    }}
                    className="!text-xs"
                  >
                    <i className="fa-solid fa-bolt ml-1"></i>
                    تحديث السلة إلى مستردة 🎉
                  </Button>
                )}
              </div>

              <button
                onClick={() => {
                  handleEndVoiceCall();
                  setActiveCallTarget(null);
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-red-600/20 transition-all"
              >
                <i className="fa-solid fa-phone-slash"></i>
                <span>إنهاء المكالمة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
