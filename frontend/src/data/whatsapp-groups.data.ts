export interface WhatsAppGroup {
  id: string;
  name: string;
  category: 'vip_customers' | 'flash_deals' | 'b2b_wholesale' | 'community';
  categoryLabel: string;
  avatar: string;
  memberCount: number;
  maxCapacity: number;
  inviteLink: string;
  status: 'active' | 'almost_full' | 'full' | 'locked_night';
  statusLabel: string;
  antiSpamEnabled: boolean;
  autoWelcomeEnabled: boolean;
  welcomeMessage: string;
  bannedKeywords: string[];
  blockLinks: boolean;
  lockSchedule: {
    enabled: boolean;
    lockTime: string;
    unlockTime: string;
  };
  totalSpamBlocked: number;
  totalWelcomed: number;
  recentActivity: {
    id: string;
    time: string;
    action: string;
    type: 'join' | 'leave' | 'spam_blocked' | 'broadcast';
  }[];
}

export const initialGroupsData: WhatsAppGroup[] = [
  {
    id: 'grp-vip-1',
    name: '👑 نادي كبار العملاء VIP #1',
    category: 'vip_customers',
    categoryLabel: 'عملاء مميزين VIP',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    memberCount: 980,
    maxCapacity: 1024,
    inviteLink: 'https://chat.whatsapp.com/GkVipClub8819xZ',
    status: 'almost_full',
    statusLabel: 'شبه ممتلئة (95%)',
    antiSpamEnabled: true,
    autoWelcomeEnabled: true,
    welcomeMessage: 'يا أهلاً وسهلاً بك في نادي كبار عملاء متجرنا 👑! تفضل كود خصم ترحيبي 15% [VIPJOIN] مخصص لأعضاء المجموعة.',
    bannedKeywords: ['تداول', 'فوركس', 'استثمار', 'قروب', 'روابط', 'شير'],
    blockLinks: true,
    lockSchedule: {
      enabled: true,
      lockTime: '23:00',
      unlockTime: '08:00',
    },
    totalSpamBlocked: 42,
    totalWelcomed: 980,
    recentActivity: [
      { id: 'act-1', time: 'منذ 10 دقائق', action: 'انضمام عضو جديد: +966509123456 وتم إرسال كود الترحيب', type: 'join' },
      { id: 'act-2', time: 'منذ 35 دقيقة', action: 'تم حظر رسالة تحتوي على رابط إعلاني خارجي تلقائياً', type: 'spam_blocked' },
      { id: 'act-3', time: 'منذ ساعتين', action: 'نشر عرض حصري: عينات العطور المجانية لكبار الشخصيات', type: 'broadcast' },
    ],
  },
  {
    id: 'grp-deals-1',
    name: '⚡ صفقات الفلاش والعروض الحصرية #1',
    category: 'flash_deals',
    categoryLabel: 'عروض وتخفيضات فلاش',
    avatar: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150&auto=format&fit=crop&q=80',
    memberCount: 1024,
    maxCapacity: 1024,
    inviteLink: 'https://chat.whatsapp.com/DealHunter2209qA',
    status: 'full',
    statusLabel: 'مكتملة (100%) - تم التوجيه للقروب #2',
    antiSpamEnabled: true,
    autoWelcomeEnabled: true,
    welcomeMessage: 'أهلاً بك في مجتمع صفقات الفلاش ⚡! ترقب إطلاق الخصومات السريعة كل يوم أحد وأربعاء الساعة 8 مساءً.',
    bannedKeywords: ['اعلان', 'تابعني', 'تسويق', 'استثمار'],
    blockLinks: true,
    lockSchedule: {
      enabled: true,
      lockTime: '00:00',
      unlockTime: '09:00',
    },
    totalSpamBlocked: 89,
    totalWelcomed: 1024,
    recentActivity: [
      { id: 'act-4', time: 'منذ 5 دقائق', action: 'المجموعة مكتملة (1024/1024) - تم توجيه 14 زائر جديد إلى قروب #2', type: 'join' },
      { id: 'act-5', time: 'أمس 08:00 م', action: 'بث حملة عروض نهاية الأسبوع بنجاح', type: 'broadcast' },
    ],
  },
  {
    id: 'grp-deals-2',
    name: '⚡ صفقات الفلاش والعروض الحصرية #2',
    category: 'flash_deals',
    categoryLabel: 'عروض وتخفيضات فلاش',
    avatar: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150&auto=format&fit=crop&q=80',
    memberCount: 420,
    maxCapacity: 1024,
    inviteLink: 'https://chat.whatsapp.com/DealHunter2210bB',
    status: 'active',
    statusLabel: 'نشطة وتستقبل أعضاء جدد',
    antiSpamEnabled: true,
    autoWelcomeEnabled: true,
    welcomeMessage: 'أهلاً بك في مجتمع صفقات الفلاش #2 ⚡! تمتع بأسرع وصول لمنتجات الكمية المحدودة.',
    bannedKeywords: ['اعلان', 'تابعني', 'تسويق'],
    blockLinks: true,
    lockSchedule: {
      enabled: false,
      lockTime: '23:30',
      unlockTime: '08:30',
    },
    totalSpamBlocked: 14,
    totalWelcomed: 420,
    recentActivity: [
      { id: 'act-6', time: 'منذ 15 دقيقة', action: 'انضمام 3 أعضاء محوّلين تلقائياً من المجموعة #1', type: 'join' },
    ],
  },
  {
    id: 'grp-b2b',
    name: '🏢 تجار الجملة والموزعين المعتمدين',
    category: 'b2b_wholesale',
    categoryLabel: 'طلبات الجملة B2B',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    memberCount: 310,
    maxCapacity: 1024,
    inviteLink: 'https://chat.whatsapp.com/B2BWholesalePro99',
    status: 'active',
    statusLabel: 'نشطة ومخصصة للتجار',
    antiSpamEnabled: true,
    autoWelcomeEnabled: true,
    welcomeMessage: 'مرحباً بشركائنا في قطاع الجملة والتوزيع 🏢. للحصول على قائمة الأسعار والفواتير الضريبية تواصل مع الإدارة.',
    bannedKeywords: ['قطاعي', 'مفرد', 'تجزئة', 'شخصي'],
    blockLinks: false,
    lockSchedule: {
      enabled: true,
      lockTime: '22:00',
      unlockTime: '08:00',
    },
    totalSpamBlocked: 6,
    totalWelcomed: 310,
    recentActivity: [
      { id: 'act-7', time: 'اليوم 09:30 ص', action: 'نشر ملف PDF: كتالوج أسعار توريدات الربع الثالث لعام 2026', type: 'broadcast' },
    ],
  },
];
