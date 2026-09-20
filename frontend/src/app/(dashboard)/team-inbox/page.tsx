'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import WhatsAppAudioPlayer from '@/components/chat/WhatsAppAudioPlayer';
import { cartRecoveryTemplates } from '@/data/cart-recovery-templates.data';
import { initialVoiceNoteTemplates, VoiceNoteTemplate } from '@/data/voice-notes-templates.data';
import {
  defaultPersonas,
  VoicePersona,
  speakText,
  generateVoiceResponse,
  stopAllSpeech,
} from '@/services/gemini-voice.service';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Message {
  id: string;
  sender: 'contact' | 'agent';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  audioDuration?: string;
  transcript?: string;
  sentiment?: {
    type: 'positive' | 'hesitant' | 'urgent' | 'inquiry';
    label: string;
  };
  cardType?: 'payment' | 'cart_recovery' | 'invoice' | 'catalog';
  cardPayload?: {
    orderId?: string;
    total?: string;
    discount?: string;
    items?: string;
    link?: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  tags: string[];
  online: boolean;
  assignedAgent: string;
  totalSpent: string;
  totalOrdersCount: number;
  cart: {
    id: string;
    items: CartItem[];
    appliedCoupon?: string;
    discountPercent?: number;
    status: 'سلة متروكة 🛒' | 'قيد المراجعة' | 'تم السداد والتسليم' | 'ملغي';
    checkoutLink: string;
  };
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'سارة الأحمد',
    phone: '+966 54 123 9876',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    unreadCount: 2,
    lastMessage: 'هل يتوفر لديكم توصيل سريع إلى الرياض اليوم؟ تركت طلبي بالسلة 🛍️',
    lastMessageTime: '10:42 ص',
    tags: ['عميل VIP ⭐', 'سلة متروكة 🛒'],
    online: true,
    assignedAgent: 'عبدالله السعيد',
    totalSpent: '1,240 $',
    totalOrdersCount: 6,
    cart: {
      id: 'WB-1052',
      items: [
        { id: 'item-1', name: 'عطر اللافندر الملكي الفاخر', price: 180, quantity: 1 },
        { id: 'item-2', name: 'لوشن مسك العود المركز', price: 110, quantity: 1 },
      ],
      appliedCoupon: 'SAVE10',
      discountPercent: 10,
      status: 'سلة متروكة 🛒',
      checkoutLink: 'https://whatzboot.pay/cart-recov-1052?code=SAVE10',
    },
    messages: [
      {
        id: 'm-1',
        sender: 'contact',
        text: 'السلام عليكم ورحمة الله، أسعد الله صباحكم',
        timestamp: '10:38 ص',
      },
      {
        id: 'm-2',
        sender: 'agent',
        text: 'وعليكم السلام ورحمة الله وبركاته يا هلا أستاذة سارة! كيف نقدر نخدمك اليوم؟ ✨',
        timestamp: '10:39 ص',
        status: 'read',
      },
      {
        id: 'm-3',
        sender: 'contact',
        text: 'رسالة صوتية واردة (0:12 ثانية)',
        mediaType: 'audio',
        audioDuration: '0:12',
        transcript: 'يا هلا أختي، حبيت أسأل هل عطر اللافندر الملكي متوفر منه تسليم فوري بالرياض اليوم؟ لأن عندي مناسبة بكرة وما كملت الدفع بالسلة لحد ما أتأكد منكم.',
        sentiment: {
          type: 'hesitant',
          label: 'استفسار عن سرعة التوصيل وتأكيد الشحن 🚀',
        },
        timestamp: '10:42 ص',
      },
      {
        id: 'm-4',
        sender: 'agent',
        text: 'رسالة صوتية مرسلة (0:18 ثانية)',
        mediaType: 'audio',
        audioDuration: '0:18',
        transcript: 'يا هلا وغلا أستاذة سارة! معك سارة من المتجر، أبشري بالخير العطر متوفر وجاهز للشحن الفوري لباب بيتك اليوم بالرياض مع تغليف إهداء فاخر وكود خصم [SAVE10] مفعّل لكِ حالاً!',
        timestamp: '10:44 ص',
        status: 'read',
      },
    ],
  },
  {
    id: 'conv-2',
    name: 'فهد العتيبي',
    phone: '+966 50 887 4321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    unreadCount: 0,
    lastMessage: 'تم استلام الطلب رقم #1042 بنجاح، شكراً لكم!',
    lastMessageTime: 'أمس',
    tags: ['طلب مكتمل ✅'],
    online: false,
    assignedAgent: 'فاطمة الزهراني',
    totalSpent: '420 $',
    totalOrdersCount: 2,
    cart: {
      id: 'WB-1042',
      items: [{ id: 'item-3', name: 'باقة العطور الشرقية المتكاملة', price: 350, quantity: 1 }],
      status: 'تم السداد والتسليم',
      checkoutLink: 'https://whatzboot.pay/wb-1042',
    },
    messages: [
      {
        id: 'm-201',
        sender: 'agent',
        text: 'أهلاً أستاذ فهد، مندوب التوصيل في طريقه إليك الآن.',
        timestamp: '03:15 م',
        status: 'read',
      },
      {
        id: 'm-202',
        sender: 'contact',
        text: 'تم استلام الطلب رقم #1042 بنجاح، شكراً لكم!',
        timestamp: '03:45 م',
      },
    ],
  },
  {
    id: 'conv-3',
    name: 'مؤسسة النماء للتجارة (خالد)',
    phone: '+966 55 334 7788',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    unreadCount: 1,
    lastMessage: 'أرغب بتحديث طلبية الجملة للأسبوع القادم وإرسال الفاتورة الضريبية',
    lastMessageTime: '09:15 ص',
    tags: ['عميل VIP ⭐', 'جملة'],
    online: true,
    assignedAgent: 'عبدالله السعيد',
    totalSpent: '8,400 $',
    totalOrdersCount: 14,
    cart: {
      id: 'WB-1038',
      items: [
        { id: 'item-4', name: 'كرتون عينات المبيعات الفاخرة', price: 1200, quantity: 2 },
        { id: 'item-5', name: 'مجموعة الهدايا الترويجية', price: 450, quantity: 1 },
      ],
      appliedCoupon: 'VIP20',
      discountPercent: 20,
      status: 'قيد المراجعة',
      checkoutLink: 'https://whatzboot.pay/wb-1038',
    },
    messages: [
      {
        id: 'm-301',
        sender: 'contact',
        text: 'أرغب بتحديث طلبية الجملة للأسبوع القادم وإرسال الفاتورة الضريبية',
        timestamp: '09:15 ص',
      },
    ],
  },
  {
    id: 'conv-4',
    name: 'ريم الدوسري',
    phone: '+966 56 991 2233',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    unreadCount: 0,
    lastMessage: 'تم تفعيل كود الخصم وسأقوم بالدفع عبر Apple Pay الآن',
    lastMessageTime: 'أمس',
    tags: ['سلة مستردة 🎉'],
    online: false,
    assignedAgent: 'روبوت المبيعات الذكي 🤖',
    totalSpent: '650 $',
    totalOrdersCount: 3,
    cart: {
      id: 'WB-1049',
      items: [
        { id: 'item-6', name: 'طقم العناية بالشعر الطبيعي', price: 220, quantity: 1 },
        { id: 'item-7', name: 'سيروم فيتامين سي', price: 95, quantity: 1 },
      ],
      appliedCoupon: 'SAVE10',
      discountPercent: 10,
      status: 'تم السداد والتسليم',
      checkoutLink: 'https://whatzboot.pay/wb-1049',
    },
    messages: [
      {
        id: 'm-401',
        sender: 'contact',
        text: 'مرحبا، كنت حاطة منتجات بالسلة بس ما كملت الدفع',
        timestamp: 'أمس 04:30 م',
      },
      {
        id: 'm-402',
        sender: 'agent',
        text: 'أهلاً أختي ريم! تم حفظ سلتك مع كود خصم إضافي 10% [SAVE10] متاح حتى مساء اليوم 🎁',
        timestamp: 'أمس 04:32 م',
        status: 'read',
      },
      {
        id: 'm-403',
        sender: 'contact',
        text: 'تم تفعيل كود الخصم وسأقوم بالدفع عبر Apple Pay الآن',
        timestamp: 'أمس 04:35 م',
      },
    ],
  },
];

export default function TeamInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [filter, setFilter] = useState<'all' | 'unread' | 'vip' | 'orders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showSideInfo, setShowSideInfo] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agentNote, setAgentNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({
    'conv-1': 'العميلة تفضل التوصيل الصباحي، ودائماً تطلب عبر رابط مدى المباشر.',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Voice AI States
  const [showVoiceNoteModal, setShowVoiceNoteModal] = useState(false);
  const [selectedVoicePersona, setSelectedVoicePersona] = useState<VoicePersona>(defaultPersonas[0]);
  const [selectedVoiceTemplate, setSelectedVoiceTemplate] = useState<VoiceNoteTemplate>(initialVoiceNoteTemplates[0]);
  const [customVoiceScript, setCustomVoiceScript] = useState('');
  const [isPlayingVoicePreview, setIsPlayingVoicePreview] = useState(false);

  // In-Chat Voice Call States
  const [showInChatCallModal, setShowInChatCallModal] = useState(false);
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [liveCallDuration, setLiveCallDuration] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [liveCallTranscript, setLiveCallTranscript] = useState<
    { sender: 'agent' | 'customer'; text: string; time: string }[]
  >([]);

  // New item modal in cart
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('50');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Timer for active in-chat call
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

  const handleSendVoiceNote = (
    textToSend: string,
    personaId: string,
    durationFormatted: string = '0:18'
  ) => {
    const newMsg: Message = {
      id: `msg-voice-${Date.now()}`,
      sender: 'agent',
      text: 'رسالة صوتية مرسلة',
      mediaType: 'audio',
      audioDuration: durationFormatted,
      transcript: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            lastMessage: '🎙️ رسالة صوتية مرسلة',
            lastMessageTime: 'الآن',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    showToast('تم إرسال الرسالة الصوتية المخصصة بنجاح عبر واتساب!');
    setShowVoiceNoteModal(false);
  };

  const handleStartInChatCall = () => {
    setShowInChatCallModal(true);
    setIsLiveCallActive(true);
    const initialGreeting = `مرحباً بك أستاذ ${activeConv.name.split(' ')[0]}! معك سارة من المتجر، لاحظنا وجود سلة تسوق قيد الانتظار بقيمة ${calculateCartTotal(activeConv.cart).toFixed(0)} $. هل يمكنني مساعدتك في تأكيد التوصيل السريع مع كود خصم إضافي؟`;
    
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

  const handleSimulateCustomerResponseInCall = (customerText: string) => {
    const customerMsg = {
      sender: 'customer' as const,
      text: customerText,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveCallTranscript((prev) => [...prev, customerMsg]);

    // AI thinking & responding
    setIsAISpeaking(true);
    setTimeout(async () => {
      const response = await generateVoiceResponse(
        customerText,
        selectedVoicePersona,
        liveCallTranscript.map((t) => ({
          role: t.sender === 'agent' ? 'model' : 'user',
          text: t.text,
        })),
        {
          customerName: activeConv.name,
          cartTotal: calculateCartTotal(activeConv.cart).toFixed(2),
          cartItems: activeConv.cart.items.map((i) => i.name).join('، '),
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

  const handleEndInChatCall = () => {
    setIsLiveCallActive(false);
    setIsAISpeaking(false);
    stopAllSpeech();
    showToast('تم إنهاء المكالمة وتسجيل نتائجها بنجاح.');
    setShowInChatCallModal(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  // Cart Calculations
  const calculateCartSubtotal = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateCartTotal = (cart: Conversation['cart']) => {
    const subtotal = calculateCartSubtotal(cart.items);
    if (cart.discountPercent) {
      const discount = (subtotal * cart.discountPercent) / 100;
      return Math.max(0, subtotal - discount);
    }
    return subtotal;
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.phone.includes(searchQuery) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'vip') return conv.tags.some((t) => t.includes('VIP'));
    if (filter === 'orders') return Boolean(conv.cart && conv.cart.items.length > 0);
    return true;
  });

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    setMobileView('chat');
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (
    textToSend?: string,
    cardType?: Message['cardType'],
    cardPayload?: Message['cardPayload']
  ) => {
    const text = textToSend || inputText.trim();
    if (!text && !cardType) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text: text || '',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      cardType,
      cardPayload,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            lastMessage: text || 'تم إرسال بطاقة تجارية 🛍️',
            lastMessageTime: 'الآن',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    if (!textToSend) {
      setInputText('');
    }

    // Auto simulated customer reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const contactReply: Message = {
          id: `msg-rep-${Date.now()}`,
          sender: 'contact',
          text: 'شكراً جزيلاً لسرعة تجاوبكم واهتمامكم! تم الاطلاع.',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === activeConvId) {
              return {
                ...conv,
                lastMessage: contactReply.text,
                lastMessageTime: 'الآن',
                messages: [...conv.messages, contactReply],
              };
            }
            return conv;
          })
        );
      }, 1400);
    }, 1100);
  };

  // Cart Handlers
  const handleUpdateItemQuantity = (itemId: string, delta: number) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          const updatedItems = conv.cart.items
            .map((item) => {
              if (item.id === itemId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];

          return {
            ...conv,
            cart: {
              ...conv.cart,
              items: updatedItems,
            },
          };
        }
        return conv;
      })
    );
  };

  const handleApplyCoupon = (couponCode: string, percent: number) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            cart: {
              ...conv.cart,
              appliedCoupon: couponCode,
              discountPercent: percent,
              checkoutLink: `https://whatzboot.pay/cart-recov-${conv.cart.id}?code=${couponCode}`,
            },
          };
        }
        return conv;
      })
    );
    showToast(`تم تطبيق كوبون [${couponCode}] بخصم ${percent}% بنجاح!`);
  };

  const handleAddItemToCart = () => {
    if (!newItemName.trim() || !newItemPrice) return;
    const item: CartItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      price: Number(newItemPrice),
      quantity: 1,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            cart: {
              ...conv.cart,
              items: [...conv.cart.items, item],
            },
          };
        }
        return conv;
      })
    );

    setNewItemName('');
    setNewItemPrice('50');
    showToast('تمت إضافة المنتج إلى سلة العميل بنجاح!');
  };

  // Quick Action: Send direct payment link
  const handleSendPaymentLink = () => {
    if (!activeConv) return;
    const total = calculateCartTotal(activeConv.cart);
    const subtotal = calculateCartSubtotal(activeConv.cart.items);
    const itemsSummary = activeConv.cart.items.map((i) => `${i.name} (×${i.quantity})`).join(' + ');

    const msg = `💳 مرحباً ${activeConv.name}، تفضل رابط الدفع الإلكتروني المباشر لطلبك رقم #${activeConv.cart.id} بمبلغ ${total.toFixed(2)} $ ${
      activeConv.cart.discountPercent ? `(بعد خصم ${activeConv.cart.discountPercent}%)` : ''
    }:\n${activeConv.cart.checkoutLink}\n\n🔒 الدفع آمن وفوري عبر مدى، Apple Pay، والبطاقات الائتمانية.`;

    handleSendMessage(msg, 'payment', {
      orderId: activeConv.cart.id,
      total: `${total.toFixed(2)} $`,
      discount: activeConv.cart.appliedCoupon ? `${activeConv.cart.appliedCoupon} (${activeConv.cart.discountPercent}%)` : undefined,
      items: itemsSummary,
      link: activeConv.cart.checkoutLink,
    });
    showToast('تم إرسال رابط الدفع إلى المحادثة بنجاح!');
  };

  // Quick Action: Send smart cart recovery message from library
  const handleSendCartRecoveryOffer = () => {
    if (!activeConv) return;
    const recoveryTemplate = cartRecoveryTemplates[1]; // 10% discount template
    const itemsSummary = activeConv.cart.items.map((i) => `${i.name} (×${i.quantity})`).join(' + ');
    const total = calculateCartTotal(activeConv.cart);

    const msg = `مرحباً ${activeConv.name} 👋\n\nلاحظنا أنك تركت سلة تسوق مميزة لدينا تتضمن:\n📦 ${itemsSummary}\n\nيسرنا تقديم كود خصم خاص [SAVE10] بقيمة 10% فعال خلال الساعات القادمة 🛍️✨\n\nاضغط هنا لإتمام طلبك فورياً:\n${activeConv.cart.checkoutLink}`;

    handleSendMessage(msg, 'cart_recovery', {
      orderId: activeConv.cart.id,
      total: `${total.toFixed(2)} $`,
      discount: 'SAVE10 (10%)',
      items: itemsSummary,
      link: activeConv.cart.checkoutLink,
    });
    showToast('تم إرسال رسالة استرداد السلة الذكية مع كود الخصم!');
  };

  // Quick Action: Send invoice
  const handleSendInvoice = () => {
    if (!activeConv) return;
    const total = calculateCartTotal(activeConv.cart);
    const itemsSummary = activeConv.cart.items.map((i) => `${i.name} (×${i.quantity}) - ${(i.price * i.quantity).toFixed(2)} $`).join('\n• ');

    const msg = `📄 فاتورة واتساب الضريبية الإلكترونية:\n\nرقم الفاتورة: #${activeConv.cart.id}\nالعميل: ${activeConv.name}\nالهاتف: ${activeConv.phone}\n\nالأصناف:\n• ${itemsSummary}\n\nالإجمالي النهائي: ${total.toFixed(2)} $\nالحالة: ${activeConv.cart.status}\n\nنشكرك لتسوقك معنا دائماً! 🌸`;

    handleSendMessage(msg, 'invoice', {
      orderId: activeConv.cart.id,
      total: `${total.toFixed(2)} $`,
      items: itemsSummary,
    });
    showToast('تمت مشاركة الفاتورة الضريبية مع العميل!');
  };

  // Quick Action: Send menu/catalog
  const handleSendCatalog = () => {
    const msg = `🛍️ تفضل كتالوج المنتجات الأكثر طلباً مع عروض اليوم:\n\n1️⃣ عطر اللافندر الملكي: 180 $ ⭐\n2️⃣ لوشن مسك العود: 110 $ ⭐\n3️⃣ باقة الهدايا الفاخرة: 290 $\n4️⃣ سيروم فيتامين سي النقي: 95 $\n\nيمكنك الرد باسم المنتج مباشرة لإضافته لسلتك فورياً! 📦`;
    handleSendMessage(msg, 'catalog');
    showToast('تم إرسال كتالوج المنتجات!');
  };

  // Update order status
  const handleUpdateOrderStatus = (newStatus: Conversation['cart']['status']) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            cart: {
              ...conv.cart,
              status: newStatus,
            },
          };
        }
        return conv;
      })
    );
    handleSendMessage(`🚚 تم تحديث حالة طلبك #${activeConv?.cart?.id} إلى: [${newStatus}] بنجاح ✅`);
    showToast(`تم تغيير حالة الطلب إلى "${newStatus}"`);
  };

  const handleSaveNote = () => {
    if (!agentNote.trim()) return;
    setSavedNotes((prev) => ({
      ...prev,
      [activeConvId]: agentNote,
    }));
    setAgentNote('');
    showToast('تم حفظ ملاحظة الموظف بنجاح!');
  };

  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 rounded-2xl bg-[#181922] border-2 border-whatsapp-green px-5 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 animate-fade-in-up">
          <span className="flex h-3 w-3 rounded-full bg-whatsapp-green animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex h-[calc(100vh-10.5rem)] lg:h-[calc(100vh-6.5rem)] overflow-hidden rounded-2xl border border-dark-border bg-dark-card shadow-2xl">
        {/* ========================================================================= */}
        {/* 1. Conversations List (Left Panel)                                       */}
        {/* ========================================================================= */}
        <div
          className={`flex w-full md:w-80 lg:w-96 flex-col border-inline-end border-dark-border bg-dark-bg/60 transition-all duration-200 ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="border-b border-dark-border p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h2 className="text-base font-extrabold text-white tracking-tight">صندوق محادثات المبيعات</h2>
              </div>
              <Badge variant="gold" size="sm">
                {conversations.reduce((acc, c) => acc + c.unreadCount, 0)} جديدة
              </Badge>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-xs text-dark-text-muted"></i>
              <input
                type="text"
                placeholder="بحث بالاسم، الجوال، أو رقم السلة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input py-2 pl-3 pr-8 text-xs text-dark-text-primary placeholder:text-dark-text-muted focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'unread', label: 'غير مقروء' },
                { id: 'vip', label: 'عملاء VIP ⭐' },
                { id: 'orders', label: 'سلات وطلبات 🛒' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-emerald-500 text-black shadow'
                      : 'bg-dark-surface-elevated text-dark-text-secondary hover:text-dark-text-primary border border-dark-border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Chats */}
          <div className="flex-1 overflow-y-auto divide-y divide-dark-border/40">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  className={`flex cursor-pointer items-center gap-3 p-3 transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 border-r-4 border-emerald-500'
                      : 'hover:bg-dark-surface-elevated/50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="h-11 w-11 rounded-xl object-cover border border-dark-border"
                    />
                    {conv.online && (
                      <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-dark-card bg-emerald-400"></span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-xs sm:text-sm font-bold text-white">
                        {conv.name}
                      </h3>
                      <span className="text-[10px] text-dark-text-muted font-mono">{conv.lastMessageTime}</span>
                    </div>

                    <p className="mt-0.5 truncate text-xs text-dark-text-secondary">
                      {conv.lastMessage}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          {conv.totalSpent}
                        </span>
                        {conv.tags.slice(0, 1).map((t) => (
                          <span key={t} className="text-[10px] text-dark-text-muted">
                            • {t}
                          </span>
                        ))}
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-extrabold text-black">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Chat Area (Center Panel)                                              */}
        {/* ========================================================================= */}
        <div
          className={`flex flex-1 flex-col bg-dark-bg transition-all duration-200 ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Chat Top Header */}
              <div className="flex h-16 items-center justify-between border-b border-dark-border bg-dark-card px-4">
                <div className="flex items-center gap-3">
                  {/* Mobile back button */}
                  <button
                    onClick={() => setMobileView('list')}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border text-dark-text-secondary hover:text-white md:hidden"
                    title="العودة لقائمة المحادثات"
                  >
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>

                  <div className="relative shrink-0">
                    <img
                      src={activeConv.avatar}
                      alt={activeConv.name}
                      className="h-10 w-10 rounded-xl object-cover border border-dark-border"
                    />
                    {activeConv.online && (
                      <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-dark-card bg-emerald-400"></span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-extrabold text-white">{activeConv.name}</h2>
                      {activeConv.tags.some((t) => t.includes('VIP')) && (
                        <Badge variant="gold" size="sm">
                          VIP
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-dark-text-secondary flex items-center gap-1.5 mt-0.5">
                      <span dir="ltr" className="font-mono text-dark-text-muted">{activeConv.phone}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">
                        {activeConv.online ? 'متصل بالمتجر الآن' : 'غير متصل'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Chat Header Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartInChatCall}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-2.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-colors shadow-sm shadow-amber-500/10"
                    title="بدء مكالمة هاتفية صوتية بالذكاء الاصطناعي مع العميل"
                  >
                    <i className="fa-solid fa-phone-volume text-xs animate-pulse"></i>
                    <span>مكالمة هاتفية صوتية (Voice AI)</span>
                  </button>

                  <button
                    onClick={() => setShowVoiceNoteModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-2.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-colors"
                    title="توليد رسالة صوتية مخصصة"
                  >
                    <i className="fa-solid fa-microphone-lines text-xs"></i>
                    <span>فويس نوت AI</span>
                  </button>

                  <button
                    onClick={handleSendCartRecoveryOffer}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    <i className="fa-solid fa-bolt text-xs"></i>
                    <span>استرداد السلة [SAVE10]</span>
                  </button>

                  <button
                    onClick={handleSendPaymentLink}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    <i className="fa-solid fa-credit-card text-xs"></i>
                    <span>رابط دفع فوري</span>
                  </button>

                  {/* Toggle customer commerce panel */}
                  <button
                    onClick={() => {
                      setShowSideInfo(!showSideInfo);
                      setMobileDrawerOpen(!mobileDrawerOpen);
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                      showSideInfo
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:text-white'
                    }`}
                    title="سلة وبيانات العميل"
                  >
                    <i className="fa-solid fa-bag-shopping text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Quick Commerce Action Toolbar */}
              <div className="flex items-center justify-between border-b border-dark-border/40 bg-dark-card/50 px-3 py-2 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-dark-text-muted font-bold whitespace-nowrap pl-1 text-[11px]">
                    أوامر المبيعات:
                  </span>
                  <button
                    onClick={handleSendPaymentLink}
                    className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors whitespace-nowrap"
                  >
                    <i className="fa-solid fa-link text-[10px]"></i>
                    <span>إرسال رابط الدفع ({calculateCartTotal(activeConv.cart).toFixed(2)} $)</span>
                  </button>

                  <button
                    onClick={handleSendCartRecoveryOffer}
                    className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors whitespace-nowrap"
                  >
                    <i className="fa-solid fa-cart-shopping text-[10px]"></i>
                    <span>تذكير استرداد السلة</span>
                  </button>

                  <button
                    onClick={handleSendInvoice}
                    className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-surface-elevated px-2.5 py-1 text-xs font-semibold text-dark-text-primary hover:border-emerald-500/40 hover:text-emerald-400 transition-colors whitespace-nowrap"
                  >
                    <i className="fa-solid fa-file-invoice text-[10px]"></i>
                    <span>فاتورة ضريبية</span>
                  </button>

                  <button
                    onClick={handleSendCatalog}
                    className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-surface-elevated px-2.5 py-1 text-xs font-semibold text-dark-text-primary hover:border-emerald-500/40 hover:text-emerald-400 transition-colors whitespace-nowrap"
                  >
                    <i className="fa-solid fa-store text-[10px]"></i>
                    <span>كتالوج المنتجات</span>
                  </button>

                  <button
                    onClick={() => handleUpdateOrderStatus('تم السداد والتسليم')}
                    className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors whitespace-nowrap"
                  >
                    <i className="fa-solid fa-check-double text-[10px]"></i>
                    <span>تأكيد السداد ✅</span>
                  </button>
                </div>

                {/* Live Sales Target Ticker */}
                <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono bg-dark-bg/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg text-emerald-300">
                  <span className="flex h-2 w-2 rounded-full bg-whatsapp-green animate-pulse"></span>
                  <span>الوردية الحالية: 8 صفقات مغلقة</span>
                  <span>•</span>
                  <span className="font-bold text-amber-300">1,840 $ مسترد</span>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]">
                <div className="flex justify-center my-1">
                  <span className="rounded-full bg-dark-card/90 border border-dark-border px-3 py-0.5 text-[10px] text-dark-text-muted font-medium">
                    محادثة متجر واتساب الرسمية المشفرة
                  </span>
                </div>

                {activeConv.messages.map((msg) => {
                  const isMe = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <img
                          src={activeConv.avatar}
                          alt=""
                          className="h-6 w-6 rounded-lg object-cover mb-1 border border-dark-border"
                        />
                      )}

                      {/* Render Audio Voice Note with waveform and transcript */}
                      {msg.mediaType === 'audio' ? (
                        <div className="space-y-1">
                          <WhatsAppAudioPlayer
                            sender={msg.sender}
                            duration={msg.audioDuration || '0:16'}
                            transcript={msg.transcript || msg.text}
                            sentiment={msg.sentiment}
                            agentName={msg.sender === 'agent' ? 'سارة (استشارية المبيعات)' : undefined}
                            avatar={msg.sender === 'agent' ? undefined : activeConv.avatar}
                            onQuickAction={(actionText) => {
                              handleSendVoiceNote(
                                `يا هلا أستاذة ${activeConv.name.split(' ')[0]}! يسعد مساك، أبشري وفرنا لك شحن مجاني فوري وتغليف فاخر مع كود خصم [SAVE10] مفعّل بالسلة!`,
                                'sara-sales',
                                '0:18'
                              );
                            }}
                          />
                          <div className="flex items-center justify-end gap-1 text-[10px] text-white/50 px-1">
                            <span className="font-mono">{msg.timestamp}</span>
                            {isMe && (
                              <span className={msg.status === 'read' ? 'text-emerald-400' : 'text-white/50'}>
                                <i className="fa-solid fa-check-double text-[10px]"></i>
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`relative max-w-sm sm:max-w-md rounded-2xl px-3.5 py-2.5 shadow-md ${
                            isMe
                              ? 'bg-[#0f3d32] border border-emerald-600/30 text-emerald-50 rounded-bl-sm'
                              : 'bg-[#1a1a20] border border-dark-border text-dark-text-primary rounded-br-sm'
                          }`}
                        >
                          {/* Rich Interactive Card Embeds */}
                          {msg.cardType === 'payment' && msg.cardPayload && (
                            <div className="mb-2 rounded-xl bg-black/40 border border-amber-500/30 p-2.5 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-amber-300 font-bold">
                                <span className="flex items-center gap-1">
                                  <i className="fa-solid fa-credit-card text-xs"></i>
                                  طلب دفع إلكتروني #{msg.cardPayload.orderId}
                                </span>
                                <span className="font-mono text-sm">{msg.cardPayload.total}</span>
                              </div>
                              {msg.cardPayload.discount && (
                                <span className="text-[10px] text-emerald-300 block font-mono">
                                  الكوبون المطبق: {msg.cardPayload.discount}
                                </span>
                              )}
                              <div className="rounded-lg bg-emerald-500/20 text-emerald-300 text-center py-1.5 font-bold cursor-pointer hover:bg-emerald-500/30 transition-colors">
                                دفع فوري عبر Apple Pay / مدى ⚡
                              </div>
                            </div>
                          )}

                          {msg.cardType === 'cart_recovery' && msg.cardPayload && (
                            <div className="mb-2 rounded-xl bg-black/40 border border-emerald-500/30 p-2.5 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-emerald-300 font-bold">
                                <span className="flex items-center gap-1">
                                  <i className="fa-solid fa-cart-shopping text-xs"></i>
                                  استرداد السلة المحفوظة
                                </span>
                                <span className="font-mono text-xs">{msg.cardPayload.total}</span>
                              </div>
                              <div className="rounded-lg bg-amber-500/20 text-amber-300 text-center py-1 font-mono font-bold">
                                كوبون خصم 10% [SAVE10] مفعّل
                              </div>
                            </div>
                          )}

                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</p>
                          
                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/50">
                            <span className="font-mono">{msg.timestamp}</span>
                            {isMe && (
                              <span className={msg.status === 'read' ? 'text-emerald-400' : 'text-white/50'}>
                                <i className="fa-solid fa-check-double text-[10px]"></i>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-dark-text-secondary">
                    <img
                      src={activeConv.avatar}
                      alt=""
                      className="h-6 w-6 rounded-lg object-cover"
                    />
                    <div className="rounded-2xl bg-[#1a1a20] border border-dark-border px-3 py-2 text-dark-text-secondary">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400"></span>
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.2s]"></span>
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.4s]"></span>
                        <span className="mr-1 text-[11px] font-medium">العميل يكتب الآن...</span>
                      </span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input Composer */}
              <div className="border-t border-dark-border bg-dark-card p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendCatalog}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-border text-dark-text-muted hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                    title="كتالوج المنتجات"
                  >
                    <i className="fa-solid fa-store text-sm"></i>
                  </button>

                  <button
                    onClick={() => setShowVoiceNoteModal(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
                    title="توليد رسالة صوتية ذكية (AI Voice Note)"
                  >
                    <i className="fa-solid fa-microphone-lines text-sm"></i>
                  </button>

                  <textarea
                    rows={1}
                    placeholder="اكتب ردك للعميل هنا... (اضغط Enter للإرسال)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 resize-none rounded-xl border border-dark-border bg-dark-input px-3.5 py-2.5 text-xs sm:text-sm text-dark-text-primary placeholder:text-dark-text-muted focus:border-emerald-500 focus:outline-none"
                  />

                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim()}
                    variant="commerce"
                    className="h-10 w-10 !p-0 rounded-xl shrink-0"
                    title="إرسال"
                  >
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-dark-text-muted text-sm">
              اختر محادثة لبدء إتمام الصفقات
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. Customer Commerce & Cart Manager (Right Panel)                         */}
        {/* ========================================================================= */}
        {showSideInfo && activeConv && (
          <div className="hidden xl:flex w-84 flex-col border-r border-dark-border bg-dark-card/95 p-4 overflow-y-auto space-y-4">
            {/* Customer Profile Header */}
            <div className="flex flex-col items-center text-center pb-3 border-b border-dark-border/60">
              <img
                src={activeConv.avatar}
                alt={activeConv.name}
                className="h-14 w-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
              />
              <h3 className="mt-2 text-sm font-extrabold text-white">{activeConv.name}</h3>
              <p className="text-xs text-dark-text-muted font-mono" dir="ltr">{activeConv.phone}</p>
              <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                {activeConv.tags.map((tag) => (
                  <Badge key={tag} variant={tag.includes('VIP') ? 'gold' : 'default'} size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Commerce Metrics Strip */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2 text-center">
                <span className="text-[10px] text-dark-text-muted block font-medium">إجمالي المشتريات</span>
                <span className="text-xs font-mono font-extrabold text-amber-300">{activeConv.totalSpent}</span>
              </div>
              <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-2 text-center">
                <span className="text-[10px] text-dark-text-muted block font-medium">الطلبات السابقة</span>
                <span className="text-xs font-mono font-extrabold text-white">{activeConv.totalOrdersCount} طلبات</span>
              </div>
            </div>

            {/* Active Cart & Checkout Manager Widget */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-cart-shopping text-emerald-400 text-xs"></i>
                  <span className="text-xs font-bold text-white">إدارة سلة الشراء #{activeConv.cart.id}</span>
                </div>
                <Badge variant="warning" size="sm">
                  {activeConv.cart.status}
                </Badge>
              </div>

              {/* Items in Cart */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activeConv.cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-dark-bg/80 border border-dark-border/60 rounded-xl p-2 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-1">
                      <span className="font-bold text-white block truncate">{item.name}</span>
                      <span className="text-[10px] text-dark-text-muted font-mono">{item.price} $ للقطعة</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono">
                      <button
                        onClick={() => handleUpdateItemQuantity(item.id, -1)}
                        className="h-5 w-5 rounded bg-dark-surface-elevated border border-dark-border text-dark-text-muted hover:text-white flex items-center justify-center text-[10px]"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateItemQuantity(item.id, 1)}
                        className="h-5 w-5 rounded bg-dark-surface-elevated border border-dark-border text-dark-text-muted hover:text-white flex items-center justify-center text-[10px]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {activeConv.cart.items.length === 0 && (
                  <p className="text-center text-xs text-dark-text-muted py-2">السلة فارغة حالياً</p>
                )}
              </div>

              {/* Quick Add Product Inline */}
              <div className="flex items-center gap-1 pt-1">
                <input
                  type="text"
                  placeholder="اسم المنتج الجديد..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 rounded-lg border border-dark-border bg-dark-input px-2 py-1 text-[11px] text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="السعر"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-14 rounded-lg border border-dark-border bg-dark-input px-1.5 py-1 text-[11px] text-white font-mono focus:outline-none"
                />
                <button
                  onClick={handleAddItemToCart}
                  className="rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 text-[11px] font-bold hover:bg-emerald-500/30 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Discount Coupons Strip */}
              <div className="border-t border-dark-border/40 pt-2 space-y-1.5">
                <span className="text-[10px] text-dark-text-muted block">تطبيق كود خصم فوري:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { code: 'SAVE10', percent: 10, label: 'خصم 10%' },
                    { code: 'FREESHIP', percent: 15, label: 'شحن مجاني' },
                    { code: 'VIP20', percent: 20, label: 'VIP 20%' },
                  ].map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code, c.percent)}
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold transition-all ${
                        activeConv.cart.appliedCoupon === c.code
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-dark-surface-elevated text-dark-text-secondary border border-dark-border hover:text-white'
                      }`}
                    >
                      {c.code} ({c.percent}%)
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="border-t border-dark-border/40 pt-2 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-dark-text-muted text-[11px]">
                  <span>المجموع الفرعي:</span>
                  <span>{calculateCartSubtotal(activeConv.cart.items).toFixed(2)} $</span>
                </div>
                {activeConv.cart.discountPercent && (
                  <div className="flex justify-between text-emerald-400 text-[11px]">
                    <span>خصم الكوبون ({activeConv.cart.discountPercent}%):</span>
                    <span>
                      -
                      {(
                        (calculateCartSubtotal(activeConv.cart.items) * activeConv.cart.discountPercent) /
                        100
                      ).toFixed(2)}{' '}
                      $
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-dark-border/30">
                  <span>الإجمالي المطلوب:</span>
                  <span className="text-emerald-400">
                    {calculateCartTotal(activeConv.cart).toFixed(2)} $
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5 pt-1">
                <Button
                  onClick={handleSendPaymentLink}
                  variant="gold"
                  size="sm"
                  className="w-full text-xs"
                >
                  <i className="fa-solid fa-link text-[10px] ml-1"></i>
                  إرسال رابط الدفع بالمحادثة
                </Button>

                <Button
                  onClick={handleSendCartRecoveryOffer}
                  variant="commerce"
                  size="sm"
                  className="w-full text-xs"
                >
                  <i className="fa-solid fa-bolt text-[10px] ml-1"></i>
                  تذكير استرداد السلة [SAVE10]
                </Button>

                <Button
                  onClick={() => {
                    if (!activeConv) return;
                    const total = calculateCartTotal(activeConv.cart);
                    const installment = (total / 4).toFixed(2);
                    const msg = `💳 مرحباً ${activeConv.name}، بإمكانك الآن تقسيط قيمة سلتك (#${activeConv.cart.id}) على 4 دفعات بدون فوائد أو رسوم عبر تابي/تمارا بواقع ${installment} $ شهرياً:\n${activeConv.cart.checkoutLink}&gateway=tabby\n\n🛍️ اضغط على الرابط واختر الدفع بالتقسيط لإتمام طلبك فوراً.`;
                    handleSendMessage(msg, 'payment', {
                      orderId: activeConv.cart.id,
                      total: `4 دفعات × ${installment} $`,
                      discount: 'تقسيط بدون فوائد (تابي/تمارا)',
                      link: `${activeConv.cart.checkoutLink}&gateway=tabby`,
                    });
                    showToast('تم إرسال رابط التقسيط الميسر عبر تابي/تمارا!');
                  }}
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs !border-sky-500/30 text-sky-300 hover:bg-sky-500/10"
                >
                  <i className="fa-solid fa-credit-card text-[10px] ml-1"></i>
                  إرسال رابط تقسيط (تابي/تمارا)
                </Button>
              </div>
            </div>

            {/* Smart Cross-Sell & Upsell Suggestions */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-wand-magic-sparkles text-purple-400 text-xs"></i>
                  اقتراحات زيادة قيمة السلة (Upsell)
                </span>
                <span className="text-[10px] text-purple-300 font-mono">+AOV</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'تغليف هدايا ملكي فاخر', price: 25, icon: 'fa-gift' },
                  { name: 'مسك العود المركز (تولّة)', price: 45, icon: 'fa-bottle-droplet' },
                  { name: 'ضمان ذهبي واستبدال فوري', price: 15, icon: 'fa-shield-halved' },
                ].map((addon, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-dark-bg/80 border border-dark-border/60 rounded-xl p-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <i className={`fa-solid ${addon.icon} text-purple-400 text-xs`}></i>
                      <div>
                        <span className="font-bold text-white block text-[11px]">{addon.name}</span>
                        <span className="text-[10px] text-dark-text-muted font-mono">+{addon.price} $</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const item: CartItem = {
                          id: `addon-${Date.now()}-${idx}`,
                          name: addon.name,
                          price: addon.price,
                          quantity: 1,
                        };
                        setConversations((prev) =>
                          prev.map((conv) => {
                            if (conv.id === activeConvId) {
                              return {
                                ...conv,
                                cart: {
                                  ...conv.cart,
                                  items: [...conv.cart.items, item],
                                },
                              };
                            }
                            return conv;
                          })
                        );
                        showToast(`تمت إضافة ${addon.name} لسلة العميل!`);
                      }}
                      className="rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 text-[10px] font-bold hover:bg-purple-500/30 transition-colors"
                    >
                      + إضافة
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Internal Notes */}
            <div className="space-y-2 border-t border-dark-border/60 pt-3">
              <h4 className="text-[11px] font-bold uppercase text-dark-text-muted">ملاحظات العميل الداخلية</h4>
              {savedNotes[activeConv.id] && (
                <div className="rounded-xl border border-dark-border bg-dark-surface-elevated p-2 text-xs text-dark-text-primary leading-relaxed">
                  {savedNotes[activeConv.id]}
                </div>
              )}
              <textarea
                rows={2}
                placeholder="اكتب ملاحظة حول طلب العميل..."
                value={agentNote}
                onChange={(e) => setAgentNote(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input p-2 text-xs text-dark-text-primary focus:border-emerald-500 focus:outline-none"
              />
              <Button
                onClick={handleSaveNote}
                variant="secondary"
                size="sm"
                className="w-full text-xs"
              >
                حفظ الملاحظة
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Voice Note AI Generator Modal                                             */}
      {/* ========================================================================= */}
      {showVoiceNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-purple-500/30 bg-dark-card p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <i className="fa-solid fa-microphone-lines text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    توليد رسالة صوتية ذكية (AI Voice Note)
                  </h3>
                  <p className="text-xs text-dark-text-secondary">
                    إرسال فويس نوت واتساب مخصص بصوت بشري واقعي باسم العميل
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVoiceNoteModal(false)}
                className="text-dark-text-muted hover:text-white"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Persona Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-text-primary">اختر النبرة والصوت:</label>
              <div className="grid grid-cols-3 gap-2">
                {defaultPersonas.map((p) => {
                  const isSelected = selectedVoicePersona.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedVoicePersona(p)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/15 text-white ring-1 ring-purple-500'
                          : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:border-purple-500/40'
                      }`}
                    >
                      <span className="text-2xl mb-1">{p.avatar}</span>
                      <span className="text-xs font-bold">{p.name}</span>
                      <span className="text-[10px] text-dark-text-muted mt-0.5">{p.dialect}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-text-primary">اختر قالب المناسبة أو السيناريو:</label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {initialVoiceNoteTemplates.map((tpl) => {
                  const isSelected = selectedVoiceTemplate.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setSelectedVoiceTemplate(tpl);
                        setCustomVoiceScript(
                          tpl.text
                            .replace('{اسم_العميل}', activeConv.name.split(' ')[0])
                            .replace('{رقم_الطلب}', activeConv.cart.id)
                        );
                      }}
                      className={`text-right p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                          : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span>{tpl.categoryLabel}</span>
                        <span className="font-mono text-[10px] text-dark-text-muted">{tpl.durationFormatted}</span>
                      </div>
                      <p className="text-xs font-medium text-white truncate">{tpl.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Script Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-text-primary">نص الرسالة الصوتية المفرغة:</label>
              <textarea
                rows={3}
                value={
                  customVoiceScript ||
                  selectedVoiceTemplate.text
                    .replace('{اسم_العميل}', activeConv.name.split(' ')[0])
                    .replace('{رقم_الطلب}', activeConv.cart.id)
                }
                onChange={(e) => setCustomVoiceScript(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-input p-3 text-xs text-dark-text-primary leading-relaxed focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-dark-border">
              <button
                onClick={() => {
                  const textToPlay =
                    customVoiceScript ||
                    selectedVoiceTemplate.text
                      .replace('{اسم_العميل}', activeConv.name.split(' ')[0])
                      .replace('{رقم_الطلب}', activeConv.cart.id);

                  if (isPlayingVoicePreview) {
                    stopAllSpeech();
                    setIsPlayingVoicePreview(false);
                  } else {
                    speakText(
                      textToPlay,
                      selectedVoicePersona,
                      () => setIsPlayingVoicePreview(true),
                      () => setIsPlayingVoicePreview(false)
                    );
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-dark-border bg-dark-surface-elevated px-3 py-2 text-xs font-bold text-dark-text-primary hover:text-white hover:border-purple-500/40 transition-colors"
              >
                <i className={`fa-solid ${isPlayingVoicePreview ? 'fa-stop text-red-400' : 'fa-volume-high text-purple-400'}`}></i>
                <span>{isPlayingVoicePreview ? 'إيقاف المعاينة' : 'استماع للمعاينة الصوتية'}</span>
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowVoiceNoteModal(false)}
                >
                  إلغاء
                </Button>
                <Button
                  variant="commerce"
                  size="sm"
                  onClick={() => {
                    const finalScript =
                      customVoiceScript ||
                      selectedVoiceTemplate.text
                        .replace('{اسم_العميل}', activeConv.name.split(' ')[0])
                        .replace('{رقم_الطلب}', activeConv.cart.id);
                    handleSendVoiceNote(finalScript, selectedVoicePersona.id, selectedVoiceTemplate.durationFormatted);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 border-purple-500"
                >
                  <i className="fa-solid fa-paper-plane ml-1.5"></i>
                  إرسال الفويس نوت إلى العميل
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Live In-Chat Voice Call Modal                                             */}
      {/* ========================================================================= */}
      {showInChatCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-amber-500/40 bg-dark-card p-6 shadow-2xl space-y-4 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-amber-400">
                    <img src={activeConv.avatar} alt="" className="h-full w-full object-cover" />
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
                    <span>مكالمة ذكية جارية مع: {activeConv.name}</span>
                    <Badge variant="warning" size="sm">
                      {formatDuration(liveCallDuration)}
                    </Badge>
                  </h3>
                  <p className="text-xs text-dark-text-muted font-mono" dir="ltr">
                    {activeConv.phone} • سلة متروكة ({calculateCartTotal(activeConv.cart).toFixed(2)} $)
                  </p>
                </div>
              </div>

              <button
                onClick={handleEndInChatCall}
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
                <span>{isAISpeaking ? 'سارة (الوكيل الصوتي) تتحدث الآن...' : 'بانتظار حديث العميل (استماع ذكي)...'}</span>
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
                    {t.sender === 'agent' ? 'سارة (الوكيل الصوتي)' : activeConv.name} • {t.time}
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
                محاكاة رد العميل الصوتي (اضغط لتجربة تفاعل الوكيل الذكي):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'كم تكلفة الشحن وهل متوفر دفع عند الاستلام؟',
                  'هل الكود SAVE10 يخصم 10% على كل السلة؟',
                  'تمام موافق، ابعث لي رابط الدفع على الواتساب!',
                ].map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSimulateCustomerResponseInCall(reply)}
                    className="text-xs bg-dark-surface-elevated hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-dark-border text-dark-text-primary hover:text-white px-2.5 py-1.5 rounded-lg transition-all text-right"
                  >
                    🗣️ {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Call Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-dark-border">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="commerce"
                  onClick={() => {
                    handleSendCartRecoveryOffer();
                    showToast('تم إرسال كود الاسترداد SAVE10 إلى محادثة العميل!');
                  }}
                  className="!text-xs"
                >
                  <i className="fa-solid fa-paper-plane ml-1"></i>
                  إرسال رابط السلة فوراً
                </Button>
              </div>

              <button
                onClick={handleEndInChatCall}
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
}
