export interface VoiceNoteTemplate {
  id: string;
  title: string;
  category: 'cart_recovery' | 'cod_confirmation' | 'vip_welcome' | 'upsell_offer' | 'support_reassurance';
  categoryLabel: string;
  targetAudience: string;
  personaId: 'sara-sales' | 'abdulrahman-vip' | 'noura-cs';
  personaName: string;
  durationSeconds: number;
  durationFormatted: string;
  waveformLevels: number[];
  text: string;
  suggestedCoupon?: string;
}

export const initialVoiceNoteTemplates: VoiceNoteTemplate[] = [
  {
    id: 'vn-1',
    title: 'استرداد سلة دافئ + كود شحن مجاني',
    category: 'cart_recovery',
    categoryLabel: 'استرداد السلات 🛒',
    targetAudience: 'العملاء المترددين عند خطوة الشحن',
    personaId: 'sara-sales',
    personaName: 'سارة (استشارية المبيعات)',
    durationSeconds: 16,
    durationFormatted: '0:16',
    waveformLevels: [20, 45, 80, 60, 90, 75, 40, 65, 85, 95, 70, 50, 85, 60, 30, 20],
    text: 'يا هلا وغلا أستاذ {اسم_العميل}! معك سارة من المتجر. لاحظت إنك جهزت أصنافك المفضلة بالسلة وما كملت الطلب، فحبيت أهديك كود شحن مجاني فوري وسريع لباب بيتك. اضغط الرابط وطلبك يوصلك بأسرع وقت!',
    suggestedCoupon: 'FREESHIP',
  },
  {
    id: 'vn-2',
    title: 'تأكيد فوري لطلب الدفع عند الاستلام (COD)',
    category: 'cod_confirmation',
    categoryLabel: 'تأكيد الشحن 📦',
    targetAudience: 'طلبات الدفع عند الاستلام الجديدة',
    personaId: 'noura-cs',
    personaName: 'نورة (تأكيد الطلبات)',
    durationSeconds: 14,
    durationFormatted: '0:14',
    waveformLevels: [15, 30, 70, 85, 60, 75, 90, 80, 65, 85, 55, 40, 70, 50, 25, 10],
    text: 'أهلاً بك أستاذ {اسم_العميل}! معك نورة من خدمة الشحن. طلبك رقم #{رقم_الطلب} بالدفع عند الاستلام تم تجهيزه ومندوبنا راح يتواصل معك غداً للتسليم، نتمنى لك تجربة ممتعة!',
  },
  {
    id: 'vn-3',
    title: 'ترحيب خاص بكبار العملاء VIP وعرض حصري',
    category: 'vip_welcome',
    categoryLabel: 'كبار العملاء 👑',
    targetAudience: 'أصحاب المشتريات التي تتجاوز 1,000 $',
    personaId: 'abdulrahman-vip',
    personaName: 'عبدالرحمن (مستشار VIP)',
    durationSeconds: 22,
    durationFormatted: '0:22',
    waveformLevels: [25, 50, 65, 85, 95, 70, 80, 90, 100, 85, 75, 90, 65, 50, 40, 20],
    text: 'حياك الله أستاذ {اسم_العميل}، يسعد مساك معك عبدالرحمن مستشار كبار العملاء. تقديراً لثقتكم الغالية بنا، يسعدنا تفعيل عضوية VIP الخاصة بكم مع خصم 20% دائم وخدمة التغليف الملكي المجاني.',
    suggestedCoupon: 'VIP20',
  },
  {
    id: 'vn-4',
    title: 'عرض تقسيط تابي على 4 دفعات بدون فوائد',
    category: 'upsell_offer',
    categoryLabel: 'تسهيلات الدفع 💳',
    targetAudience: 'السلات المتروكة ذات القيمة المرتفعة',
    personaId: 'sara-sales',
    personaName: 'سارة (استشارية المبيعات)',
    durationSeconds: 18,
    durationFormatted: '0:18',
    waveformLevels: [20, 40, 60, 85, 70, 90, 80, 60, 75, 95, 80, 65, 50, 45, 30, 15],
    text: 'مرحباً يا غالي! حبيت أبلغك إنك تقدر تقسط سلتك الحالية على 4 دفعات مريحة وميسرة عبر تابي أو تمارا بدون أي رسوم إضافية أو فوائد. الرابط جاهز بالأسفل للسداد المباشر.',
  },
];
