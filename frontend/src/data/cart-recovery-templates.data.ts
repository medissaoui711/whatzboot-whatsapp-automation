export interface CartRecoveryTemplate {
  id: string;
  title: string;
  description: string;
  category: 'drip' | 'immediate' | 'discount' | 'urgency' | 'vip' | 'assistance' | 'luxury' | 'flexible_pay';
  categoryLabel: string;
  dripStep?: number; // 1 to 5 for multi-step drip
  triggerTiming: string;
  recommendedDelayMinutes: number;
  expectedConversionRate: string;
  badge: string;
  badgeColor: 'green' | 'amber' | 'blue' | 'purple' | 'rose' | 'gold';
  message: string;
  toneStyle?: string;
  discountCode?: string;
  discountPercent?: number;
  buttonText: string;
  buttonType: 'checkout' | 'chat';
  mediaType?: 'image' | 'none';
  sampleVariables: {
    customer_name: string;
    cart_items: string;
    cart_value: string;
    discount_code: string;
    checkout_link: string;
    expiry_hours: string;
    store_name: string;
  };
}

export const cartRecoveryTemplates: CartRecoveryTemplate[] = [
  // --- DRIP SEQUENCE (1 to 5) ---
  {
    id: 'drip-step-1',
    title: 'سلسلة 1️⃣: تذكير لطيف بحفظ السلة (بعد 30 دقيقة)',
    description: 'المرحلة الأولى في السلسلة التتابعية: تذكير ودي وفوري بأن السلة محفوظة دون أي ضغط بيعي.',
    category: 'drip',
    categoryLabel: 'سلسلة تتابعية',
    dripStep: 1,
    triggerTiming: 'بعد 30 - 60 دقيقة',
    recommendedDelayMinutes: 45,
    expectedConversionRate: '29.5%',
    badge: 'الخطوة 1: تذكير لطيف',
    badgeColor: 'blue',
    toneStyle: 'ودود ومهذب',
    message: `مرحباً {{customer_name}} 👋

لاحظنا أنك تركت بعض المنتجات المميزة في سلتك بمتجر {{store_name}}:
🛍️ {{cart_items}}
💵 إجمالي السلة: {{cart_value}}

لقد حفظنا سلتك بأمان لتتمكن من إكمال طلبك بضغطة واحدة قبل نفاد الكميات المتاحة! 

اضغط على الرابط بالأسفل للمتابعة بكل سهولة:
🔗 {{checkout_link}}`,
    buttonText: 'استكمال الطلب بضغطة واحدة 🛍️',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'سارة الأحمد',
      cart_items: 'عطر اللافندر الملكي (1) + لوشن مسك العود (1)',
      cart_value: '290.00 $',
      discount_code: 'SAVECART',
      checkout_link: 'https://whatzboot.pay/drip-1-recov',
      expiry_hours: '24',
      store_name: 'متجر سحر العطور',
    },
  },
  {
    id: 'drip-step-2',
    title: 'سلسلة 2️⃣: مساعدة تقنية ودعم بوابات الدفع (بعد 3 ساعات)',
    description: 'المرحلة الثانية: الاستفسار برفق عما إذا كان العميل واجه صعوبة في بوابات الدفع أو العنوان وتوفير مساعدة الموظف.',
    category: 'drip',
    categoryLabel: 'سلسلة تتابعية',
    dripStep: 2,
    triggerTiming: 'بعد 3 ساعات',
    recommendedDelayMinutes: 180,
    expectedConversionRate: '25.8%',
    badge: 'الخطوة 2: دعم فوري',
    badgeColor: 'blue',
    toneStyle: 'خدمة عملاء داعمة',
    message: `مرحباً أستاذ/ة {{customer_name}} 🤝
معك فريق العناية بالعملاء في {{store_name}}.

لاحظنا محاولتك إتمام طلب ({{cart_items}} بقيمة {{cart_value}}). هل واجهتك أي صعوبة في الدفع عبر مدى أو Apple Pay أو خيارات التقسيط؟

يسعدنا مساعدتك وتسهيل طلبك فوراً، يمكنك الرد على هذه الرسالة أو الضغط أدناه لإعادة المحاولة:
🔗 {{checkout_link}}`,
    buttonText: 'تحدث مع مستشار المبيعات 💬',
    buttonType: 'chat',
    sampleVariables: {
      customer_name: 'سارة الأحمد',
      cart_items: 'عطر اللافندر الملكي (1) + لوشن مسك العود (1)',
      cart_value: '290.00 $',
      discount_code: 'HELPME',
      checkout_link: 'https://whatzboot.pay/drip-2-support',
      expiry_hours: '24',
      store_name: 'متجر سحر العطور',
    },
  },
  {
    id: 'drip-step-3',
    title: 'سلسلة 3️⃣: حافز كود الخصم 10% [SAVE10] (بعد 6 ساعات)',
    description: 'المرحلة الثالثة: تقديم خصم مباشر لتحفيز العميل المتردد على الشراء فوراً.',
    category: 'drip',
    categoryLabel: 'سلسلة تتابعية',
    dripStep: 3,
    triggerTiming: 'بعد 6 ساعات',
    recommendedDelayMinutes: 360,
    expectedConversionRate: '38.4%',
    badge: 'الخطوة 3: خصم 10%',
    badgeColor: 'green',
    toneStyle: 'تحفيزي مع مكافأة',
    discountCode: 'SAVE10',
    discountPercent: 10,
    message: `يا هلا {{customer_name}} 🎁

لأننا نود أن تسعد بمنتجاتنا في {{store_name}}، يسعدنا إهداؤك كوبون خصم 10% حصري لسلتك المحفوظة!

🏷️ كود الخصم: {{discount_code}}
🛍️ المنتجات: {{cart_items}}
💰 القيمة قبل الخصم: {{cart_value}}

اضغط على الرابط ليتم تطبيق الخصم فورياً عند الدفع:
🔗 {{checkout_link}}`,
    buttonText: 'تطبيق الخصم 10% والإتمام 💳',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'سارة الأحمد',
      cart_items: 'عطر اللافندر الملكي (1) + لوشن مسك العود (1)',
      cart_value: '290.00 $',
      discount_code: 'SAVE10',
      checkout_link: 'https://whatzboot.pay/drip-3-save10?code=SAVE10',
      expiry_hours: '12',
      store_name: 'متجر سحر العطور',
    },
  },
  {
    id: 'drip-step-4',
    title: 'سلسلة 4️⃣: شحن سريع مجاني ومؤمن [FREESHIP] (بعد 18 ساعة)',
    description: 'المرحلة الرابعة: إزالة عقبة تكلفة الشحن بتقديم توصيل سريع مجاني وتغليف آمن.',
    category: 'drip',
    categoryLabel: 'سلسلة تتابعية',
    dripStep: 4,
    triggerTiming: 'بعد 18 ساعة',
    recommendedDelayMinutes: 1080,
    expectedConversionRate: '34.2%',
    badge: 'الخطوة 4: شحن مجاني',
    badgeColor: 'purple',
    toneStyle: 'قيمة مضافة',
    discountCode: 'FREESHIP',
    message: `أهلاً يا {{customer_name}} 🚚✨

يسرنا ترقية طلبك المعلق إلى الشحن السريع المجاني والمؤمن بالكامل لباب بيتك!

📦 محتويات طلبيتك: {{cart_items}}
💵 القيمة: {{cart_value}}
🚚 تكلفة الشحن: 0.00 $ (مجاناً 100% بكود {{discount_code}})

العرض متاح للشحن اليوم فور تأكيدك عبر الرابط:
🔗 {{checkout_link}}`,
    buttonText: 'تأكيد الشحن المجاني الآن 🚀',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'سارة الأحمد',
      cart_items: 'عطر اللافندر الملكي (1) + لوشن مسك العود (1)',
      cart_value: '290.00 $',
      discount_code: 'FREESHIP',
      checkout_link: 'https://whatzboot.pay/drip-4-freeship?code=FREESHIP',
      expiry_hours: '8',
      store_name: 'متجر سحر العطور',
    },
  },
  {
    id: 'drip-step-5',
    title: 'سلسلة 5️⃣: الفرصة الأخيرة وتنبيه إلغاء الحجز (بعد 36 ساعة)',
    description: 'المرحلة الخامسة والأخيرة: تنبيه بانتهاء صلاحية حجز المنتجات لإشعال الرغبة بالقرار السريع.',
    category: 'drip',
    categoryLabel: 'سلسلة تتابعية',
    dripStep: 5,
    triggerTiming: 'بعد 36 - 48 ساعة',
    recommendedDelayMinutes: 2160,
    expectedConversionRate: '27.1%',
    badge: 'الخطوة 5: فرصة أخيرة',
    badgeColor: 'amber',
    toneStyle: 'إلحاح إيجابي (FOMO)',
    discountCode: 'FINALCALL',
    message: `تنبيه أخير يا {{customer_name}} ⏳

سينتهي حجز المنتجات في سلتك خلال {{expiry_hours}} ساعة وسيعاد عرضها لبقية المشترين:
⚠️ {{cart_items}}
💰 الإجمالي: {{cart_value}}

لتثبيت المنتجات واستلامها قبل إغلاق الطلب، اضغط على الرابط:
🔗 {{checkout_link}}`,
    buttonText: 'تثبيت طلبيتي واستلامها ⚡',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'سارة الأحمد',
      cart_items: 'عطر اللافندر الملكي (1) + لوشن مسك العود (1)',
      cart_value: '290.00 $',
      discount_code: 'FINALCALL',
      checkout_link: 'https://whatzboot.pay/drip-5-final?code=FINALCALL',
      expiry_hours: '4',
      store_name: 'متجر سحر العطور',
    },
  },

  // --- VIP & HIGH VALUE CARTS ---
  {
    id: 'recov-vip-luxury',
    title: 'سلة كبار المشترين VIP مع مدير حساب مخصص',
    description: 'قالب فخم مخصص للسلات التي تتجاوز 500 $ مع تخصيص مستشار مبيعات وهدية راقية.',
    category: 'vip',
    categoryLabel: 'عملاء VIP',
    triggerTiming: 'بعد ساعتين للطلبات > 500 $',
    recommendedDelayMinutes: 120,
    expectedConversionRate: '46.5%',
    badge: 'سلات عالية القيمة ⭐',
    badgeColor: 'purple',
    toneStyle: 'نخبة وفخامة',
    discountCode: 'VIPCARE',
    message: `أهلاً بك عميلنا المتميز {{customer_name}} ⭐

يسعدنا في {{store_name}} إعلامك بأنه تم تخصيص طلبك ضمن باقة عملاء النخبة، وتم إرفاق هدية عينية راقية مع شحن سريع VIP مجاناً لطلبك:

💎 أصناف الطلبية: {{cart_items}}
💰 القيمة الكلية: {{cart_value}}
🎁 هديتك الخاصة: باقة تجربة المنتجات الجديدة مجاناً

يسعد مدير حسابك في واتساب بخدمتك شخصياً وتأكيد تفاصيل التوصيل:
🔗 {{checkout_link}}`,
    buttonText: 'تأكيد طلبية VIP الفاخرة 💎',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'المهندس خالد الرشيد',
      cart_items: 'جهاز إسبريسو احترافي إيطالي + طقم أكواب سيراميك يدوية',
      cart_value: '1,450.00 $',
      discount_code: 'VIPCARE',
      checkout_link: 'https://whatzboot.pay/vip-recov-9901',
      expiry_hours: '12',
      store_name: 'متجر باريستا برو',
    },
  },
  {
    id: 'recov-b2b-wholesale',
    title: 'سلات الجملة والشركات (B2B & Bulk Orders)',
    description: 'قالب موجه للشركات والمؤسسات مع إرفاق عرض أسعار رسمي وفاتورة ضريبية إلكترونية.',
    category: 'vip',
    categoryLabel: 'عملاء VIP',
    triggerTiming: 'بعد 4 ساعات لطلبات الشركات',
    recommendedDelayMinutes: 240,
    expectedConversionRate: '41.0%',
    badge: 'طلبات الجملة B2B',
    badgeColor: 'blue',
    toneStyle: 'رسمي واحترافي',
    discountCode: 'CORP15',
    message: `السادة مؤسسة {{customer_name}} المحترمين 🏢

تحية طيبة من {{store_name}}،
تم إعداد وتجهيز عرض السعر والطلبية المبدئية رقم المحفوظة في نظامنا:

📋 تفاصيل الطلب: {{cart_items}}
💵 القيمة التقديرية: {{cart_value}}
📄 الفاتورة الضريبية: جاهزة مع خصم تجاري إضافي 15% (كود {{discount_code}})

يمكنكم مراجعة مسودة الفاتورة وإتمام أمر الشراء بالاعتماد البنكي المباشر:
🔗 {{checkout_link}}`,
    buttonText: 'مراجعة أمر الشراء والدفع 📑',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'شركة آفاق النماء للتجارة',
      cart_items: 'كرتون عينات المبيعات الفاخرة (5) + أطقم ترويجية (10)',
      cart_value: '3,800.00 $',
      discount_code: 'CORP15',
      checkout_link: 'https://whatzboot.pay/b2b-quote-4412',
      expiry_hours: '48',
      store_name: 'مجموعة النخبة للمستلزمات',
    },
  },

  // --- FLEXIBLE PAYMENT & BUY NOW PAY LATER ---
  {
    id: 'recov-flexible-tabby',
    title: 'تقسيط مريح عبر تابي وتمارا (بدون فوائد)',
    description: 'تذليل العائق المالي بتقسيم الفاتورة على 4 دفعات ميسرة بدون أي رسوم إضافية.',
    category: 'flexible_pay',
    categoryLabel: 'تقسيط ومرونة الدفع',
    triggerTiming: 'بعد 4 ساعات',
    recommendedDelayMinutes: 240,
    expectedConversionRate: '37.8%',
    badge: 'قسّمها على 4 دفعات',
    badgeColor: 'green',
    toneStyle: 'مرن وسهل',
    message: `يا هلا {{customer_name}} 💳✨

لا تشيل هم الدفعة الواحدة! يمكنك الآن إتمام سلتك في {{store_name}} وتقسيم المبلغ على 4 دفعات ميسرة بدون أي فوائد أو رسوم:

🛍️ منتجاتك: {{cart_items}}
💰 الإجمالي: {{cart_value}} (أو ادفع ربع القيمة اليوم فقط عبر Tabby / Tamara)

اختر بوابة التقسيط عند الدفع من خلال الرابط:
🔗 {{checkout_link}}`,
    buttonText: 'تقسيط الطلب على 4 دفعات 💳',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'فاطمة العلي',
      cart_items: 'طقم مفارش قطن مصري ملكي + وسائد ريش طبيعي',
      cart_value: '480.00 $',
      discount_code: 'SPLIT4',
      checkout_link: 'https://whatzboot.pay/tabby-recov-771',
      expiry_hours: '24',
      store_name: 'مفارش السعادة',
    },
  },

  // --- FREE GIFT & CASHBACK ---
  {
    id: 'recov-free-gift-promo',
    title: 'هدية مجانية مضاعفة + عينات حصرية [FREEGIFT]',
    description: 'إغراء العميل بهدية حقيقية وعينات تجربة تضاف فورياً إلى سلة الشراء.',
    category: 'discount',
    categoryLabel: 'هدايا ومكافآت',
    triggerTiming: 'بعد 5 ساعات',
    recommendedDelayMinutes: 300,
    expectedConversionRate: '39.8%',
    badge: 'هدية مجانية 🎁',
    badgeColor: 'green',
    toneStyle: 'مبهج وكريم',
    discountCode: 'FREEGIFT',
    message: `مفاجأة سارة يا {{customer_name}} 🎉🎁

يسعدنا أن نخبرك بأنه تمت إضافة هدية فاخرة وعينات حصرية إلى سلتك بدون أي تكلفة إضافية!

🛍️ سلتك: {{cart_items}}
🎁 هديتك المجانية: عينة حصرية من الإصدار الجديد + شحن سريع
💵 الإجمالي: {{cart_value}} فقط

العرض ساري لمدة 6 ساعات فقط، استلم هديتك وأكمل طلبك من هنا:
🔗 {{checkout_link}}`,
    buttonText: 'المطالبة بهديتي وإتمام الطلب 🎁',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'ريم الدوسري',
      cart_items: 'مجموعة العناية بالبشرة العضوية الشاملة',
      cart_value: '310.00 $',
      discount_code: 'FREEGIFT',
      checkout_link: 'https://whatzboot.pay/gift-recov-8812',
      expiry_hours: '6',
      store_name: 'أورجانيك بيوتي',
    },
  },

  // --- LOCALIZED & ARABIC TONES ---
  {
    id: 'recov-gulf-friendly',
    title: 'لهجة خليجية ودية ومرحة (Friendly & Warm)',
    description: 'صياغة محلية دافئة وقريبة من القلب تعزز الألفة وسرعة اتخاذ القرار.',
    category: 'immediate',
    categoryLabel: 'لهجة خليجية ودية',
    triggerTiming: 'بعد ساعتين',
    recommendedDelayMinutes: 120,
    expectedConversionRate: '35.4%',
    badge: 'لهجة خليجية 🇸🇦',
    badgeColor: 'amber',
    toneStyle: 'خليجي ودي ومرح',
    discountCode: 'HALA10',
    message: `يا هلا والله {{customer_name}} 👋🌸

عساك بألف خير، شفنا زين اختياراتك وسلتك الحلوة في {{store_name}} واقفة وتنتظرك!

🛍️ أغراضك بالسلة: {{cart_items}}
💰 الحساب: {{cart_value}} (وجهزنا لك كود خصم خاص {{discount_code}} يطيّب خاطرك ✨)

دقّة زر وحدة وطلبك يتغلف وينطلق لك مباشرة:
🔗 {{checkout_link}}`,
    buttonText: 'كمّل طلبك يا الغالي 🛍️',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'سلطان القحطاني',
      cart_items: 'شماغ كلاسيك ملكي خاص + مسبحة بكلايت فاخرة',
      cart_value: '220.00 $',
      discount_code: 'HALA10',
      checkout_link: 'https://whatzboot.pay/gulf-recov-3012',
      expiry_hours: '12',
      store_name: 'أناقة الرجل العربي',
    },
  },
  {
    id: 'recov-luxury-minimal',
    title: 'أسلوب راقٍ وموجز للمتاجر الفاخرة (Luxury & Minimal)',
    description: 'نص مختصر، فخم، ومباشر مخصص للعلامات التجارية الراقية وتجار المجوهرات والموضة.',
    category: 'luxury',
    categoryLabel: 'متاجر فاخرة',
    triggerTiming: 'بعد 4 ساعات',
    recommendedDelayMinutes: 240,
    expectedConversionRate: '33.2%',
    badge: 'Luxury Minimal 💎',
    badgeColor: 'purple',
    toneStyle: 'فاخر وموجز',
    message: `تحية طيبة {{customer_name}}،

تظل مختاراتك في {{store_name}} محفوظة بعناية فائقة:
• {{cart_items}}
• القيمة: {{cart_value}}

يسعدنا تأكيد طلبك وشحنه بأعلى معايير التغليف الفاخر عبر الرابط:
🔗 {{checkout_link}}`,
    buttonText: 'إتمام الطلب الفاخر ⚜️',
    buttonType: 'checkout',
    sampleVariables: {
      customer_name: 'منيرة السبيعي',
      cart_items: 'سوار ذهبي عيار 18 بتصميم ماسي ناعم',
      cart_value: '950.00 $',
      discount_code: 'EXCLUSIVE',
      checkout_link: 'https://whatzboot.pay/luxury-cart-1102',
      expiry_hours: '24',
      store_name: 'دار الجوهرة للمجوهرات',
    },
  },
];

