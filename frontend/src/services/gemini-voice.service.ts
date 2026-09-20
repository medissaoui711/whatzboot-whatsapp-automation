import { GoogleGenAI } from '@google/genai';

export interface VoicePersona {
  id: string;
  name: string;
  role: string;
  gender: 'female' | 'male';
  dialect: 'gulf' | 'msa' | 'egyptian' | 'levantine';
  avatar: string;
  voicePitch: number; // 0.65 - 1.2 (Male: 0.65-0.78, Female: 1.0-1.15)
  voiceRate: number;
  vocalWarmth: number; // 0.8 - 2.0 human chest resonance EQ
  geminiVoiceName: 'Aoede' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Charon' | 'Puck';
  toneDescription: string;
  systemPrompt: string;
}

export const defaultPersonas: VoicePersona[] = [
  {
    id: 'sara-sales',
    name: 'سارة (مبيعات واسترداد السلات)',
    role: 'صوت أنثوي سعودي دافئ ونبرة مبيعات ذكية 🌸',
    gender: 'female',
    dialect: 'gulf',
    avatar: '👩‍💼',
    voicePitch: 1.05,
    voiceRate: 0.98,
    vocalWarmth: 1.25,
    geminiVoiceName: 'Aoede',
    toneDescription: 'نبرة صوت سعودية أنثوية ودودة وطبيعية جداً تشعرك بالتواصل مع استشارية حقيقية',
    systemPrompt: `أنتِ "سارة"، استشارية مبيعات ذكية وودودة في متجر إلكتروني فاخر. 
تتحدثين بنبرة صوت أنثوية دافئة وطبيعية باللهجة الخليجية/السعودية الراقية واللطيفة ("يا هلا"، "أبشر"، "طال عمرك"، "يسعد مساك"). 
هدف كسب ثقة العميل وحل أي تردد لديه بخصوص المنتجات في سلته، وتقديم عروض مغرية مثل شحن مجاني أو كود خصم 10% [SAVE10] أو التقسيط على 4 دفعات بدون فوائد عبر تابي لإتمام الشراء فوراً.
اجعلي إجاباتك موجزة، مشجعة، ودافئة في جملتين إلى 3 جمل كأنك في اتصال هاتفي حقيقي.`,
  },
  {
    id: 'abdulrahman-vip',
    name: 'عبدالرحمن (مستشار كبار العملاء VIP)',
    role: 'صوت رجالي عميق ووقور (Deep Baritone) 👔',
    gender: 'male',
    dialect: 'gulf',
    avatar: '👨‍💼',
    voicePitch: 0.50, // Deep authentic masculine baritone pitch
    voiceRate: 0.88, // Dignified, calm executive cadence
    vocalWarmth: 2.5, // Maximum masculine chest resonance
    geminiVoiceName: 'Charon', // Deepest masculine baritone voice in Gemini
    toneDescription: 'صوت رجل حقيقي وقور وعميق النبرة (Deep Baritone) يعكس الهيبة والمصداقية في صفقات الجملة والـ VIP',
    systemPrompt: `أنت "عبدالرحمن"، مستشار مبيعات أول ورجل أعمال خبير لكبار العملاء (VIP) ومبيعات الجملة. 
تتحدث بصوت رجل بالغ، عميق النبرة وفخم (Baritone)، رزين ومحترم باللهجة الخليجية البيضاء الرصينة ("يا مرحبا يا غالي"، "حياك الله أستاذنا"، "أبشر بالخير"). 
تساعد العميل في تخصيص الطلبيات الكبرى، تقديم تسهيلات الدفع، والفواتير الضريبية مع ضمان الجودة الفائق.
اجعل ردك واثقاً، موجزاً، وحاسماً كرجل أعمال محترف.`,
  },
  {
    id: 'noura-cs',
    name: 'نورة (تأكيد الطلبات COD والدعم)',
    role: 'صوت أنثوي مبهج وسريع لتأكيد الشحن ⚡',
    gender: 'female',
    dialect: 'gulf',
    avatar: '🎧',
    voicePitch: 1.10,
    voiceRate: 1.02,
    vocalWarmth: 1.15,
    geminiVoiceName: 'Kore',
    toneDescription: 'نبرة صوت حيوية ولبقة تنجز تأكيد العناوين والشحن في ثوانٍ معدودة',
    systemPrompt: `أنتِ "نورة"، مسؤولة تأكيد شحن الطلبيات وخدمة العملاء. 
تتصلين بالعميل لتأكيد عنوان التوصيل لطلب الدفع عند الاستلام (COD) بسرعة ولباقة تامة للتأكد من جاهزيته لاستلام الشحنة وتفادي رجوعها.
أسلوبك سريع، مبهج ومباشر.`,
  },
  {
    id: 'faisal-tech',
    name: 'فيصل (المبيعات العصرية والتقنية)',
    role: 'صوت شاب رجالي عصري وذكي 📱',
    gender: 'male',
    dialect: 'gulf',
    avatar: '🧑‍💼',
    voicePitch: 0.72,
    voiceRate: 0.96,
    vocalWarmth: 1.5,
    geminiVoiceName: 'Puck',
    toneDescription: 'نبرة رجالية شابة عصرية ومقنعة تناسب المنتجات الإلكترونية والتقنية',
    systemPrompt: `أنت "فيصل"، مستشار تقني ومبيعات عصري. تتحدث بصوت شاب رجالي واثق وذكي باللهجة البيضاء وتجيب باحترافية على المواصفات والضمان.`,
  },
  {
    id: 'tariq-operations',
    name: 'طارق (إدارة الشحن والعمليات اللوجستية)',
    role: 'صوت رجالي قوي وحازم للعمليات 🚛',
    gender: 'male',
    dialect: 'gulf',
    avatar: '👷‍♂️',
    voicePitch: 0.60,
    voiceRate: 0.92,
    vocalWarmth: 2.0,
    geminiVoiceName: 'Fenrir',
    toneDescription: 'صوت رجالي حازم وواضح يتابع الشحنات ومواعيد التوصيل بدقة',
    systemPrompt: `أنت "طارق"، مسؤول العمليات والشحن السريع. تتحدث بصوت رجالي حازم وسريع البديهة لتنسيق استلام الطلبات وحل مشاكل عناوين الشحن.`,
  },
  {
    id: 'mariam-msa',
    name: 'مريم (المبيعات بالعربية الفصحى البيضاء)',
    role: 'صوت نسائي عربي فائق النقاء والأناقة ✨',
    gender: 'female',
    dialect: 'msa',
    avatar: '🧕',
    voicePitch: 1.00,
    voiceRate: 0.95,
    vocalWarmth: 1.3,
    geminiVoiceName: 'Aoede',
    toneDescription: 'صوت عربي نقي ومخارج حروف واضحة تناسب كافة العملاء في الوطن العربي والخليج',
    systemPrompt: `أنتِ "مريم"، مستشارة خدمة العملاء الراقية. تتحدثين بالعربية البيضاء الفصحى الميسرة وبنبرة دافئة وواضحة جداً.`,
  },
];

export interface VoiceCallLog {
  id: string;
  customerName: string;
  customerPhone: string;
  scenario: 'cart_recovery' | 'cod_confirm' | 'inbound_inquiry' | 'vip_followup';
  scenarioLabel: string;
  agentName: string;
  duration: string;
  status: 'completed_sale' | 'callback_requested' | 'confirmed_cod' | 'declined';
  statusLabel: string;
  statusColor: 'green' | 'amber' | 'blue' | 'rose';
  orderValue: string;
  timestamp: string;
  transcript: { sender: 'agent' | 'customer'; text: string; time: string }[];
}

export const initialVoiceCallLogs: VoiceCallLog[] = [
  {
    id: 'call-101',
    customerName: 'فهد العتيبي',
    customerPhone: '+966 50 887 4321',
    scenario: 'cart_recovery',
    scenarioLabel: 'استرداد سلة كبار العملاء (280 $)',
    agentName: 'سارة (Voice AI)',
    duration: '0:48 ثانية',
    status: 'completed_sale',
    statusLabel: 'تم إغلاق البيع وإرسال رابط مدى ✅',
    statusColor: 'green',
    orderValue: '280.00 $',
    timestamp: 'اليوم، 11:20 ص',
    transcript: [
      { sender: 'agent', text: 'مرحباً أستاذ فهد، يسعد صباحك معك سارة من متجرنا. لاحظت اهتمامك بطقم العطور الشرقية بالسلة وحبيت أتأكد إذا واجهتك أي صعوبة بالدفع؟', time: '0:02' },
      { sender: 'customer', text: 'أهلاً سارة، والله كنت محتار بين التوصيل للرياض أو جدة ووقفت عند خطوة الشحن.', time: '0:14' },
      { sender: 'agent', text: 'ولا تشيل هم أبشر! وفرت لك شحن مجاني فوري مع كود خصم إضافي 10%. أرسلت لك رابط السداد السريع الحين على الواتساب بضغطة زر.', time: '0:25' },
      { sender: 'customer', text: 'ممتاز جداً، وصلني الرابط وسددت بالـ Apple Pay الآن، شكراً لك!', time: '0:42' },
    ],
  },
  {
    id: 'call-102',
    customerName: 'سارة الأحمد',
    customerPhone: '+966 54 123 9876',
    scenario: 'cod_confirm',
    scenarioLabel: 'تأكيد طلب دفع عند الاستلام (COD)',
    agentName: 'نورة (Voice AI)',
    duration: '0:35 ثانية',
    status: 'confirmed_cod',
    statusLabel: 'تم تأكيد العنوان وجدية الشحن 📦',
    statusColor: 'blue',
    orderValue: '195.00 $',
    timestamp: 'اليوم، 10:15 ص',
    transcript: [
      { sender: 'agent', text: 'يا هلا أخت سارة، معك نورة لتأكيد طلبك رقم #1052 للدفع عند الاستلام بمدينة الرياض حي النرجس.', time: '0:02' },
      { sender: 'customer', text: 'أهلاً نورة، نعم العنوان صحيح وموجودة بالبيت غداً بإذن الله.', time: '0:12' },
      { sender: 'agent', text: 'تم اعتماد الشحنة فوراً وستصلك رسالة تتبع عبر الواتساب، يومك سعيد!', time: '0:22' },
    ],
  },
  {
    id: 'call-103',
    customerName: 'سلطان القحطاني',
    customerPhone: '+966 55 991 3344',
    scenario: 'vip_followup',
    scenarioLabel: 'استشارة طلبية جملة وتخصيص باقات',
    agentName: 'عبدالرحمن (Voice AI)',
    duration: '1:15 دقيقة',
    status: 'completed_sale',
    statusLabel: 'تم اعتماد الفاتورة الضريبية 📄',
    statusColor: 'green',
    orderValue: '1,450.00 $',
    timestamp: 'أمس، 04:40 م',
    transcript: [
      { sender: 'agent', text: 'حياك الله أستاذ سلطان، معك عبدالرحمن بخصوص استفسارك عن توريد كراتين العينات الفاخرة لشركتكم.', time: '0:03' },
      { sender: 'customer', text: 'أهلاً عبدالرحمن، نحتاج 5 كراتين مع فاتورة ضريبية رسمية للشركة وشحن سريع للدمام.', time: '0:20' },
      { sender: 'agent', text: 'أبشر طال عمرك، خصم 20% معتمد مع الشحن المبرد المجاني، وتم إرسال مسودة الفاتورة على الواتساب للاعتماد.', time: '0:45' },
      { sender: 'customer', text: 'بيض الله وجهك، تم التحويل وسنرسل الإشعار حالاً.', time: '1:05' },
    ],
  },
];

let aiClient: GoogleGenAI | null = null;
let currentAudioContext: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;

function getAIClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Clean Arabic text for optimal human vocal prosody (adds natural breathing punctuation)
export function prepareHumanSpeechText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/\$/g, 'دولار')
    .replace(/COD/gi, 'الدفع عند الاستلام')
    .replace(/VIP/gi, 'كبار العملاء')
    .replace(/AI/gi, 'الذكي')
    .trim();
}

// Stop any currently playing audio or speech synthesis
export function stopAllSpeech(): void {
  if (typeof window !== 'undefined') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentSourceNode) {
      try {
        currentSourceNode.stop();
        currentSourceNode.disconnect();
      } catch {
        // already stopped
      }
      currentSourceNode = null;
    }
    if (currentAudioContext && currentAudioContext.state !== 'closed') {
      try {
        currentAudioContext.close();
      } catch {
        // ignore
      }
      currentAudioContext = null;
    }
  }
}

// Play raw PCM / WAV base64 audio with human warmth acoustic processing tailored to gender & resonance
export function playNeuralAudioBuffer(
  base64Data: string,
  sampleRate = 24000,
  warmthFactor = 1.2,
  gender: 'male' | 'female' = 'female',
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      stopAllSpeech();

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx({ sampleRate });
      currentAudioContext = audioCtx;

      const binaryString = atob(base64Data);
      const len = binaryString.length;

      // Check for WAV container
      if (binaryString.startsWith('RIFF')) {
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        audioCtx.decodeAudioData(
          bytes.buffer,
          (buffer) => {
            const source = audioCtx.createBufferSource();
            currentSourceNode = source;
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            onStart?.();
            source.onended = () => {
              onEnd?.();
              resolve();
            };
            source.start(0);
          },
          (err) => {
            reject(err);
          }
        );
        return;
      }

      // Raw 16-bit PCM (standard Gemini TTS output)
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32);

      // Acoustic Studio DSP Chain
      // For Male (Abdulrahman/Faisal/Tariq): Boost deep chest fundamental (125Hz) and reduce tinny treble
      // For Female (Sara/Noura/Mariam): Boost throat warmth (240Hz) and clarity presence (3200Hz)
      const warmthFilter = audioCtx.createBiquadFilter();
      warmthFilter.type = 'peaking';
      if (gender === 'male') {
        warmthFilter.frequency.value = 125; // Deep male chest baritone resonance
        warmthFilter.gain.value = 4.0 * warmthFactor;
      } else {
        warmthFilter.frequency.value = 240; // Female throat warmth
        warmthFilter.gain.value = 2.5 * warmthFactor;
      }

      const presenceFilter = audioCtx.createBiquadFilter();
      presenceFilter.type = 'peaking';
      presenceFilter.frequency.value = gender === 'male' ? 2200 : 3200;
      presenceFilter.gain.value = gender === 'male' ? 1.0 : 1.8;

      // Anti-harshness low-pass filter for smooth human resonance
      const antiHarshFilter = audioCtx.createBiquadFilter();
      antiHarshFilter.type = 'lowpass';
      antiHarshFilter.frequency.value = gender === 'male' ? 6500 : 8500;

      const softCompressor = audioCtx.createDynamicsCompressor();
      softCompressor.threshold.setValueAtTime(-18, audioCtx.currentTime);
      softCompressor.knee.setValueAtTime(10, audioCtx.currentTime);
      softCompressor.ratio.setValueAtTime(3, audioCtx.currentTime);
      softCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
      softCompressor.release.setValueAtTime(0.15, audioCtx.currentTime);

      const source = audioCtx.createBufferSource();
      currentSourceNode = source;
      source.buffer = audioBuffer;

      source.connect(warmthFilter);
      warmthFilter.connect(presenceFilter);
      presenceFilter.connect(antiHarshFilter);
      antiHarshFilter.connect(softCompressor);
      softCompressor.connect(audioCtx.destination);

      onStart?.();
      source.onended = () => {
        onEnd?.();
        resolve();
      };
      source.start(0);
    } catch (e) {
      reject(e);
    }
  });
}

// Generate real human studio voice audio via Gemini Neural TTS
export async function generateGeminiNeuralTTS(
  text: string,
  persona: VoicePersona
): Promise<string | null> {
  const client = getAIClient();
  if (!client) return null;

  try {
    const cleanText = prepareHumanSpeechText(text);
    
    // Explicit vocal timbre prompt to enforce strong masculine or feminine characteristics
    let speechPrompt = '';
    if (persona.gender === 'male') {
      speechPrompt = `Speak in a deep, mature, authoritative, resonant masculine Arabic male voice (Saudi/Gulf baritone man). Never sound feminine: "${cleanText}"`;
    } else {
      speechPrompt = `Speak in a warm, polite, natural feminine Arabic voice (Saudi/Gulf woman): "${cleanText}"`;
    }

    const voiceToUse = persona.geminiVoiceName || (persona.gender === 'male' ? 'Charon' : 'Aoede');

    const response = await client.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: speechPrompt }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceToUse },
          },
        },
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/')) {
            return part.inlineData.data || null;
          }
        }
      }
    }
    return null;
  } catch (err) {
    console.warn('Gemini Neural TTS call exception, falling back:', err);
    return null;
  }
}

// Generate intelligent conversational replies for voice calls
export async function generateVoiceResponse(
  userSpeech: string,
  persona: VoicePersona,
  conversationHistory: { role?: string; sender?: 'agent' | 'customer'; text: string }[],
  context: { customerName?: string; cartTotal?: string; cartItems?: string; orderNumber?: string }
): Promise<string> {
  const client = getAIClient();

  if (client) {
    try {
      const systemInstruction = `${persona.systemPrompt}

معلومات المكالمة الحالية:
- اسم العميل: ${context.customerName || 'العميل الفاضل'}
- قيمة السلة / الطلب: ${context.cartTotal || '180.00 $'}
- الأصناف: ${context.cartItems || 'طقم عطور فاخرة'}
- رقم الطلب (إن وجد): ${context.orderNumber || '#1089'}

إرشادات المكالمة الصوتية الحقيقية:
1. الرد يجب أن يكون قصيراً جداً (جملة أو جملتين فقط) ليتناسب مع المحادثة الهاتفية السريعة.
2. لا تستخدم رموز تعبيرية (emojis) أو تنسيقات Markdown في النص لأن هذا النص سيتم تحويله إلى صوت منطوق.
3. كن مقنعاً وودوداً باللهجة الخليجية البيضاء المريحة.
4. شجع العميل على إتمام الطلب فوراً برابط سريع أو تأكيد الشحن.`;

      const formattedHistory = conversationHistory.slice(-6).map((msg) => {
        const isModel = msg.role === 'model' || msg.sender === 'agent';
        return `${isModel ? 'الوكيل' : 'العميل'}: ${msg.text}`;
      }).join('\n');

      const prompt = `${formattedHistory}\nالعميل: ${userSpeech}\nالوكيل (رد في جملة أو جملتين مباشرة):`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }
        ],
      });

      const replyText = response.text?.trim();
      if (replyText) {
        return replyText.replace(/[*_~`#]/g, '').replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}]/gu, '');
      }
    } catch (err) {
      console.warn('Gemini generateVoiceResponse fallback:', err);
    }
  }

  // Realistic Fallback Responses
  const lower = userSpeech.toLowerCase();
  if (lower.includes('غالي') || lower.includes('سعر') || lower.includes('خصم')) {
    if (persona.gender === 'male') {
      return `أبشر بالخير يا غالي، تقديراً لك يسعدني اعتماد خصم فوري 10% مع شحن مجاني، تحب نعتمد الطلب الحين؟`;
    }
    return `يا هلا بك! ولا تشيل هم السعر، وفرت لك كود خصم إضافي وشحن مجاني الحين لتستفيد من العرض قبل نفاد الكمية.`;
  }

  if (lower.includes('توصيل') || lower.includes('متى') || lower.includes('وقت')) {
    if (persona.gender === 'male') {
      return `التوصيل سريع بإذن الله خلال 24 إلى 48 ساعة لباب بيتك مع الشحن المبرد المضمون.`;
    }
    return `طلبك يوصلك خلال يوم إلى يومين بالكثير، وأول ما نرسله بيجيك رابط تتبع مباشر على الواتساب.`;
  }

  if (lower.includes('اعتمد') || lower.includes('موافق') || lower.includes('تم') || lower.includes('ارسل')) {
    if (persona.gender === 'male') {
      return `بيض الله وجهك يا أستاذ ${context.customerName || ''}! تم اعتماد طلبك فوراً وتجهيز الشحن، وستصلك رسالة التأكيد عبر الواتساب.`;
    }
    return `تسلم يا رب! تم تأكيد طلبك بنجاح، وبيوصلك مسج تأكيد الحين على الواتساب فيه كل التفاصيل. شكراً لثقتك!`;
  }

  if (persona.gender === 'male') {
    return `يا هلا بك أستاذ ${context.customerName || ''}! يشرفني خدمتك وأبشر بأفضل عرض وتسهيلات مخصصة لطلبك اليوم.`;
  }

  return `يا هلا بك أستاذ ${context.customerName || ''}! يسعدني أخدمك وأجهز لك طلبك الحين بأفضل عرض متاح مع الشحن المجاني والتغليف الفاخر.`;
}

// Cached voices for instant availability across Chromium and WebKit browsers
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesInitialized = false;

export function initSpeechSynthesisVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    if (cachedVoices.length > 0) {
      voicesInitialized = true;
    }
    
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      voicesInitialized = true;
    };
  } catch (err) {
    console.warn('Voice initialization error:', err);
  }
  
  return cachedVoices;
}

// Auto-run on client load
if (typeof window !== 'undefined') {
  initSpeechSynthesisVoices();
}

// Find the most authentic human voice matching gender and Arabic dialect
export function getBestArabicNeuralVoice(gender: 'female' | 'male'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const arabicVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('ar'));

  const maleKeywords = [
    'naayf', 'hamed', 'maged', 'tariq', 'shakir', 'youssef', 'zayd',
    'ar-sa-wavenet-b', 'ar-sa-wavenet-c', 'ar-sa-wavenet-d',
    'ar-xa-wavenet-b', 'ar-xa-wavenet-d', 'ar-xa-standard-b', 'ar-xa-standard-d',
    'ar-eg-wavenet-b', 'ar-eg-standard-b', 'ar-sa-standard-b', 'ar-sa-standard-d',
    'ar-sa-x-dfz-local', 'male', 'man', 'baritone', 'guy'
  ];

  const femaleKeywords = [
    'salma', 'laila', 'zariyah', 'fatima', 'hoda', 'zeina', 'maryam', 'sana',
    'ar-sa-wavenet-a', 'ar-xa-wavenet-a', 'ar-xa-standard-a', 'ar-sa-standard-a',
    'ar-eg-standard-a', 'female', 'woman', 'girl'
  ];

  if (gender === 'male') {
    // 1. Explicit Arabic Male Voice
    if (arabicVoices.length > 0) {
      const explicitMale = arabicVoices.find((v) => {
        const lower = v.name.toLowerCase();
        return maleKeywords.some((m) => lower.includes(m)) && !femaleKeywords.some((f) => lower.includes(f));
      });
      if (explicitMale) return explicitMale;

      // 2. Arabic voice that does NOT contain any female identifier
      const nonFemaleArabic = arabicVoices.find((v) => {
        const lower = v.name.toLowerCase();
        return !femaleKeywords.some((f) => lower.includes(f));
      });
      if (nonFemaleArabic) return nonFemaleArabic;

      // 3. Fallback Arabic voice
      return arabicVoices[0];
    }

    // If no Arabic voices available at all, find high-definition male voice in system
    const systemMale = voices.find((v) => {
      const lower = v.name.toLowerCase();
      return maleKeywords.some((m) => lower.includes(m)) || lower.includes('david') || lower.includes('ryan') || lower.includes('george') || lower.includes('daniel') || lower.includes('alex');
    });
    return systemMale || voices[0] || null;
  } else {
    // Female voice resolution
    if (arabicVoices.length > 0) {
      const explicitFemale = arabicVoices.find((v) => {
        const lower = v.name.toLowerCase();
        return femaleKeywords.some((f) => lower.includes(f));
      });
      if (explicitFemale) return explicitFemale;
      return arabicVoices[0];
    }
    return voices[0] || null;
  }
}

// Main Human Voice Player: Intelligently uses Gemini Neural Studio TTS or Enhanced Natural Arabic Voice
export function speakText(
  text: string,
  persona: VoicePersona,
  onStart?: () => void,
  onEnd?: () => void,
  preferNeuralEngine = true
): void {
  if (typeof window === 'undefined') {
    onStart?.();
    setTimeout(() => onEnd?.(), 1000);
    return;
  }

  const cleanText = prepareHumanSpeechText(text);

  // Attempt 1: Gemini Neural Studio TTS for genuine 100% human-like voice
  if (preferNeuralEngine && (process.env.GEMINI_API_KEY || process.env.API_KEY)) {
    onStart?.();
    generateGeminiNeuralTTS(cleanText, persona)
      .then((base64Audio) => {
        if (base64Audio) {
          playNeuralAudioBuffer(base64Audio, 24000, persona.vocalWarmth, persona.gender, onStart, onEnd).catch(() => {
            speakWithEnhancedBrowserVoice(cleanText, persona, onStart, onEnd);
          });
        } else {
          speakWithEnhancedBrowserVoice(cleanText, persona, onStart, onEnd);
        }
      })
      .catch(() => {
        speakWithEnhancedBrowserVoice(cleanText, persona, onStart, onEnd);
      });
    return;
  }

  // Attempt 2: Enhanced Local Acoustic Speech Synthesis
  speakWithEnhancedBrowserVoice(cleanText, persona, onStart, onEnd);
}

// Local Acoustic Voice Synthesizer with realistic pitch and pauses
function speakWithEnhancedBrowserVoice(
  cleanText: string,
  persona: VoicePersona,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onStart?.();
    setTimeout(() => onEnd?.(), 1500);
    return;
  }

  stopAllSpeech();

  // Make sure voice list is ready
  initSpeechSynthesisVoices();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ar-SA';
  
  // For male voice (Abdulrahman/Faisal/Tariq), ensure deep masculine pitch
  if (persona.gender === 'male') {
    utterance.pitch = Math.max(0.45, Math.min(persona.voicePitch, 0.58));
    utterance.rate = Math.min(persona.voiceRate, 0.90);
  } else {
    utterance.pitch = Math.max(0.95, persona.voicePitch);
    utterance.rate = persona.voiceRate;
  }

  const bestVoice = getBestArabicNeuralVoice(persona.gender);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = () => {
    onEnd?.();
  };

  // Chromium bug workaround: ensure speech synthesis isn't paused
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  window.speechSynthesis.speak(utterance);
}
