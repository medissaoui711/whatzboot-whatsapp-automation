'use client';

import React, { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  VoicePersona,
  defaultPersonas,
  VoiceCallLog,
  initialVoiceCallLogs,
  generateVoiceResponse,
  speakText,
  stopAllSpeech,
} from '@/services/gemini-voice.service';

export default function VoiceAgentPage() {
  // Active Persona State
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(defaultPersonas[0]);
  const [callLogs, setCallLogs] = useState<VoiceCallLog[]>(initialVoiceCallLogs);

  // Human Voice Engine Settings
  const [voiceEngine, setVoiceEngine] = useState<'gemini_neural' | 'natural_neural_local'>('gemini_neural');
  const [vocalWarmthLevel, setVocalWarmthLevel] = useState<number>(1.25);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);

  // Active Call Simulator State
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeCallCustomer, setActiveCallCustomer] = useState({
    name: 'سلطان المنصور',
    phone: '+966 55 432 1098',
    cartItems: 'طقم عطر اللافندر الملكي + دهن عود سيوفي',
    cartTotal: '240.00 $',
  });

  const [currentTranscript, setCurrentTranscript] = useState<
    { sender: 'agent' | 'customer'; text: string; time: string }[]
  >([
    {
      sender: 'agent',
      text: 'يا هلا أستاذ سلطان! يسعد مساك، معك سارة من خدمة العملاء. لاحظت إنك جهزت طقم العطور الملكية بالسلة وحبيت أتأكد إذا تحب نفعّل لك شحن مجاني اليوم؟',
      time: '0:02',
    },
  ]);

  const [customUserInput, setCustomUserInput] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'cart_recovery' | 'cod_confirm' | 'vip_followup'>('cart_recovery');
  
  // Selected Call Log for modal inspection
  const [inspectingCall, setInspectingCall] = useState<VoiceCallLog | null>(null);

  // Auto-scrolling for transcript
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentTranscript]);

  // Call duration counter
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Start Call Simulation
  const handleStartCall = (scenario: 'cart_recovery' | 'cod_confirm' | 'vip_followup') => {
    setActiveScenario(scenario);
    setIsCallActive(true);
    setCallDuration(0);

    let initialMsg = '';
    if (scenario === 'cart_recovery') {
      initialMsg = `يا هلا أستاذ ${activeCallCustomer.name}! يسعد مساك، معك ${selectedPersona.name.split(' ')[0]} من المتجر. لاحظت إنك جهزت طقم العطور بالسلة وحبيت أساعدك ونفعّل لك شحن مجاني الحين.`;
    } else if (scenario === 'cod_confirm') {
      initialMsg = `مرحباً أستاذ ${activeCallCustomer.name}، معك ${selectedPersona.name.split(' ')[0]} لتأكيد طلبك رقم #1094 للدفع عند الاستلام والتأكد من العنوان لسرعة التوصيل.`;
    } else {
      initialMsg = `حياك الله أستاذ ${activeCallCustomer.name}، معك ${selectedPersona.name.split(' ')[0]} بخصوص طلبيات الجملة وتخصيص الباقات الخاصة.`;
    }

    setCurrentTranscript([
      {
        sender: 'agent',
        text: initialMsg,
        time: '0:02',
      },
    ]);

    setIsSpeaking(true);
    speakText(
      initialMsg,
      { ...selectedPersona, voiceRate: voiceSpeed, vocalWarmth: vocalWarmthLevel },
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      voiceEngine === 'gemini_neural'
    );
  };

  // End Call Simulation
  const handleEndCall = () => {
    stopAllSpeech();
    setIsCallActive(false);
    setIsSpeaking(false);
    setIsListening(false);

    // Save to call history log
    const newLog: VoiceCallLog = {
      id: `call-${Date.now()}`,
      customerName: activeCallCustomer.name,
      customerPhone: activeCallCustomer.phone,
      scenario: activeScenario,
      scenarioLabel:
        activeScenario === 'cart_recovery'
          ? 'استرداد سلة كبار العملاء'
          : activeScenario === 'cod_confirm'
          ? 'تأكيد طلب دفع عند الاستلام'
          : 'استشارة VIP وجملة',
      agentName: `${selectedPersona.name.split(' ')[0]} (Voice AI)`,
      duration: `${formatTime(callDuration)} دقيقة`,
      status: 'completed_sale',
      statusLabel: 'تم التفاعل بنجاح ✅',
      statusColor: 'green',
      orderValue: activeCallCustomer.cartTotal,
      timestamp: 'الآن',
      transcript: currentTranscript,
    };

    setCallLogs((prev) => [newLog, ...prev]);
  };

  // Play a quick sample of persona's human voice
  const handlePlaySample = (p: VoicePersona) => {
    if (playingSampleId === p.id) {
      stopAllSpeech();
      setPlayingSampleId(null);
      return;
    }

    setPlayingSampleId(p.id);
    const samplePhrase =
      p.id === 'abdulrahman-vip'
        ? `يا مرحبا أستاذنا الفاضل، معك عبدالرحمن مستشار كبار العملاء ومبيعات الجملة. كيف أقدر أخدمك اليوم ونوفر لك أفضل التسهيلات والأسعار الخاصة؟`
        : p.id === 'faisal-tech'
        ? `يا أهلاً بك! معك فيصل من المبيعات والتقنية. كيف أقدر أساعدك باختيار أنسب منتج وتفعيل كود الخصم اليوم؟`
        : p.id === 'tariq-operations'
        ? `مرحباً بك، معك طارق من إدارة العمليات والشحن. حبيت أبلغك أن شحنتك مجهزة وجاهزة للتسليم فوراً.`
        : p.id === 'noura-cs'
        ? `يا هلا والله! معك نورة لتأكيد طلبك الدفع عند الاستلام. العنوان جاهز لنعتمد الشحن السريع اليوم؟`
        : p.id === 'mariam-msa'
        ? `أهلاً وسهلاً بك، معك مريم من خدمة العملاء الراقية. يسعدني تزويدك بكافة تفاصيل طلبك وعروضنا الحصرية.`
        : `يا هلا والله! معك ${p.name.split(' ')[0]}، كيف أقدر أخدمك اليوم ونعتمد طلبك بأفضل سعر وشحن مجاني؟`;
    
    speakText(
      samplePhrase,
      { ...p, vocalWarmth: vocalWarmthLevel, voiceRate: voiceSpeed },
      () => setPlayingSampleId(p.id),
      () => setPlayingSampleId(null),
      voiceEngine === 'gemini_neural'
    );
  };

  // Process user's speech / message
  const handleUserSendMessage = async (text: string) => {
    if (!text.trim() || isGeneratingReply) return;

    const timeStr = formatTime(callDuration);
    const userMsg = { sender: 'customer' as const, text: text.trim(), time: timeStr };
    const updatedHistory = [...currentTranscript, userMsg];
    setCurrentTranscript(updatedHistory);
    setCustomUserInput('');
    setIsGeneratingReply(true);

    try {
      const reply = await generateVoiceResponse(
        text,
        selectedPersona,
        updatedHistory,
        {
          customerName: activeCallCustomer.name,
          cartItems: activeCallCustomer.cartItems,
          cartTotal: activeCallCustomer.cartTotal,
        }
      );

      const agentMsg = {
        sender: 'agent' as const,
        text: reply,
        time: formatTime(callDuration + 1),
      };

      setCurrentTranscript((prev) => [...prev, agentMsg]);
      setIsSpeaking(true);
      speakText(
        reply,
        { ...selectedPersona, voiceRate: voiceSpeed, vocalWarmth: vocalWarmthLevel },
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        voiceEngine === 'gemini_neural'
      );
    } catch (err) {
      console.error('Error generating reply:', err);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Browser Speech Recognition (STT) for speaking into microphone
  const handleToggleMic = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('ميزة التعرف الصوتي المباشر عبر الميكروفون تتطلب متصفحاً حديثاً مثل Chrome أو Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          handleUserSendMessage(spoken);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dark-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <i className="fa-solid fa-headset text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">الوكيل الصوتي البشري الذكي (Human Voice AI)</h1>
                <Badge variant="gold" size="sm">
                  Neural Studio Voices ✨
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-dark-text-secondary mt-0.5">
                نظام أصوات بشرية طبيعية فائقة الواقعية مع معالجة الرنين الصوتي والدفء البشري لإجراء مكالمات البيع وتأكيد الطلبات.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={() => handleStartCall('cart_recovery')}
            variant="commerce"
            size="md"
            className="text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20"
          >
            <i className="fa-solid fa-phone-volume ml-1.5 animate-pulse"></i>
            بدء مكالمة استرداد سلة (صوت بشري طبيعي)
          </Button>

          <Button
            onClick={() => handleStartCall('cod_confirm')}
            variant="secondary"
            size="md"
            className="text-xs sm:text-sm !border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <i className="fa-solid fa-box-check ml-1.5"></i>
            مكالمة تأكيد COD
          </Button>
        </div>
      </div>

      {/* Human Voice Neural Studio Settings Banner */}
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-dark-card to-dark-surface p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
                محرك الصوت البشري المتقدم (Human Vocal Engine)
              </h3>
              <Badge variant="green" size="sm">
                Human Prosody & Resonant Warmth
              </Badge>
            </div>
            <p className="text-xs text-dark-text-secondary max-w-2xl leading-relaxed">
              تم تحسين الصوت للتخلص من النبرة الآلية الرتيبة واستبدالها بنبرات صوت طبيعية تحاكي النطق البشري الحقيقي، مخارج الحروف، والتنغيم الصوتي الدافئ.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Engine Mode Switcher */}
            <div className="flex items-center rounded-xl border border-dark-border bg-dark-bg/80 p-1">
              <button
                onClick={() => setVoiceEngine('gemini_neural')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  voiceEngine === 'gemini_neural'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md'
                    : 'text-dark-text-secondary hover:text-white'
                }`}
              >
                <i className="fa-solid fa-sparkles"></i>
                <span>Gemini Neural HD (بشري 100%)</span>
              </button>
              <button
                onClick={() => setVoiceEngine('natural_neural_local')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  voiceEngine === 'natural_neural_local'
                    ? 'bg-dark-surface-elevated text-white border border-dark-border'
                    : 'text-dark-text-secondary hover:text-white'
                }`}
              >
                <i className="fa-solid fa-bolt text-emerald-400"></i>
                <span>Arabic Natural Neural</span>
              </button>
            </div>

            {/* Vocal Warmth Control */}
            <div className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-bg/80 px-3 py-1.5 text-xs">
              <span className="text-dark-text-muted text-[11px] font-bold">دفء الصوت (EQ):</span>
              <select
                value={vocalWarmthLevel}
                onChange={(e) => setVocalWarmthLevel(parseFloat(e.target.value))}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="1.0" className="bg-dark-card text-white">طبيعي متوازن</option>
                <option value="1.25" className="bg-dark-card text-white">صوت دافئ واستوديو ⭐</option>
                <option value="1.45" className="bg-dark-card text-white">فخم ورصين (VIP)</option>
              </select>
            </div>

            {/* Speaking Rate Control */}
            <div className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-bg/80 px-3 py-1.5 text-xs">
              <span className="text-dark-text-muted text-[11px] font-bold">سرعة الكلام:</span>
              <select
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="0.92" className="bg-dark-card text-white">هادئ ومفصل (0.9x)</option>
                <option value="1.0" className="bg-dark-card text-white">طبيعي بشري (1.0x)</option>
                <option value="1.08" className="bg-dark-card text-white">سريع ولبق (1.1x)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">المكالمات المنفذة اليوم</span>
            <span className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-sm border border-sky-500/20">
              <i className="fa-solid fa-phone"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">24</span>
            <span className="text-xs text-emerald-400 font-bold">+6 مكالمات حية</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">متوسط زمن الاستجابة: 0.9 ثانية</p>
        </Card>

        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">نسبة إغلاق الصفقات صوتياً</span>
            <span className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">
              <i className="fa-solid fa-chart-line-up"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">68.5%</span>
            <span className="text-xs text-emerald-400 font-bold">↑ 22% بفضل الصوت البشري</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">16 من أصل 24 سلة تم استردادها فورياً</p>
        </Card>

        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">مبيعات المكالمات المستردة</span>
            <span className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm border border-amber-500/20">
              <i className="fa-solid fa-bag-shopping"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-300 font-mono">3,840.00 $</span>
            <span className="text-xs text-amber-400 font-bold">إيراد مسترد</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">عبر روابط سداد فورية بالواتساب</p>
        </Card>

        <Card className="border-dark-border/60 bg-dark-card/90 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-text-muted font-bold">رضا العملاء عن المكالمة</span>
            <span className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm border border-purple-500/20">
              <i className="fa-solid fa-stars"></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-300 font-mono">4.9 / 5.0</span>
            <span className="text-xs text-purple-400 font-bold">🌟 صوت طبيعي</span>
          </div>
          <p className="text-[11px] text-dark-text-secondary mt-1">94% اعتقدوا أن المتصل موظف حقيقي</p>
        </Card>
      </div>

      {/* Main Grid: Interactive Call Simulator (7 Columns) & Persona Voice Studio (5 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Live Call Stage (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-dark-border/80 bg-dark-card p-5 relative overflow-hidden">
            {/* Header of Active Call Simulator */}
            <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-3xl">{selectedPersona.avatar}</span>
                  {isCallActive && (
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-dark-card">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">{selectedPersona.name}</h2>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      {voiceEngine === 'gemini_neural' ? `Gemini Neural (${selectedPersona.geminiVoiceName})` : 'Natural HD'}
                    </span>
                  </div>
                  <p className="text-xs text-dark-text-muted">
                    متصل مع العميل: <span className="text-white font-bold">{activeCallCustomer.name}</span> ({activeCallCustomer.phone})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCallActive ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs font-mono font-bold text-rose-400">
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                      {formatTime(callDuration)}
                    </span>
                    <button
                      onClick={handleEndCall}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-phone-slash"></i>
                      إنهاء
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleStartCall(activeScenario)}
                    variant="commerce"
                    size="sm"
                    className="text-xs font-bold shadow-md shadow-emerald-500/20"
                  >
                    <i className="fa-solid fa-phone ml-1.5"></i>
                    اتصال الآن 🎙️
                  </Button>
                )}
              </div>
            </div>

            {/* Visual Acoustic Waveform / Talking Indicator */}
            <div className="my-3 rounded-xl border border-dark-border/60 bg-dark-bg/90 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 h-6">
                  {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 30].map((height, i) => (
                    <span
                      key={i}
                      style={{
                        height: isSpeaking ? `${height}%` : '20%',
                        transition: 'height 0.15s ease',
                      }}
                      className={`w-1 rounded-full ${
                        isSpeaking
                          ? 'bg-gradient-to-t from-amber-500 to-emerald-400 animate-pulse'
                          : 'bg-dark-border'
                      }`}
                    ></span>
                  ))}
                </div>
                <span className="text-xs font-medium text-dark-text-secondary">
                  {isSpeaking ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <i className="fa-solid fa-volume-high animate-bounce"></i>
                      الصوت البشري الطبيعي قيد التحدث...
                    </span>
                  ) : isListening ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <i className="fa-solid fa-microphone animate-pulse"></i>
                      جاري الاستماع لصوتك عبر المايكروفون...
                    </span>
                  ) : isGeneratingReply ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <i className="fa-solid fa-brain animate-spin"></i>
                      الوكيل يفكر في صياغة الرد المثالي...
                    </span>
                  ) : (
                    <span className="text-dark-text-muted">الوكيل جاهز للتحدث أو تلقي رد العميل</span>
                  )}
                </span>
              </div>

              <span className="text-[11px] font-mono text-dark-text-muted">
                {selectedPersona.toneDescription.split(' ')[0]} {selectedPersona.toneDescription.split(' ')[1]}
              </span>
            </div>

            {/* Live Call Transcript Bubble Stream */}
            <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-xl border border-dark-border/40 bg-dark-surface/50">
              {currentTranscript.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${
                    t.sender === 'agent' ? 'ml-auto items-start' : 'mr-auto items-end'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-dark-text-muted mb-1 font-mono">
                    <span>{t.sender === 'agent' ? `${selectedPersona.name.split(' ')[0]} (AI)` : activeCallCustomer.name}</span>
                    <span>• {t.time}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      t.sender === 'agent'
                        ? 'bg-gradient-to-br from-amber-950/40 via-dark-card to-dark-surface-elevated border border-amber-500/30 text-amber-50 shadow-sm'
                        : 'bg-dark-surface-elevated border border-dark-border text-white'
                    }`}
                  >
                    {t.text}
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Quick Customer Test Prompts */}
            <div className="mt-3">
              <span className="text-[11px] text-dark-text-muted block mb-1.5 font-bold">
                محاكاة ردود العميل السريعة (اضغط للتجربة الفورية):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'والله متردد والمنتج سعره غالي شوي',
                  'كم يستغرق التوصيل للرياض؟',
                  'هل في كود خصم أو شحن مجاني؟',
                  'كيف طريقة الاسترجاع إذا ما ناسبني؟',
                  'تمام اعتمد الطلب الحين وأرسل لي الرابط',
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserSendMessage(promptText)}
                    disabled={!isCallActive || isGeneratingReply}
                    className="rounded-lg border border-dark-border/80 bg-dark-surface px-2.5 py-1 text-[11px] text-dark-text-secondary hover:border-amber-500/60 hover:text-amber-300 disabled:opacity-40 transition-colors"
                  >
                    💬 "{promptText}"
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Interactive Input & Mic */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMic}
                disabled={!isCallActive}
                className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center transition-all ${
                  isListening
                    ? 'border-rose-500 bg-rose-500 text-white animate-pulse shadow-[0_0_15px_#f43f5e]'
                    : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:border-amber-500 hover:text-amber-400'
                } disabled:opacity-50`}
                title="تحدث بصوتك عبر الميكروفون"
              >
                <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-sm`}></i>
              </button>

              <input
                type="text"
                placeholder={isCallActive ? "اكتب ما يقوله العميل واضغط إرسال..." : "اضغط 'اتصال الآن' لبدء المكالمة الصوتية..."}
                value={customUserInput}
                onChange={(e) => setCustomUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUserSendMessage(customUserInput);
                }}
                disabled={!isCallActive || isGeneratingReply}
                className="flex-1 rounded-xl border border-dark-border bg-dark-input px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none disabled:opacity-50"
              />

              <Button
                onClick={() => handleUserSendMessage(customUserInput)}
                disabled={!isCallActive || !customUserInput.trim() || isGeneratingReply}
                variant="commerce"
                size="sm"
                className="text-xs font-bold"
              >
                تحدث 🗣️
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Persona Studio & Automated Triggers (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Persona Selector with Voice Quality Tags */}
          <Card className="border-dark-border/80 bg-dark-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <i className="fa-solid fa-users-gear text-amber-400"></i>
                شخصيات الأصوات البشرية (Human Personas)
              </h3>
              <Badge variant="blue" size="sm">
                6 نبرات طبيعية
              </Badge>
            </div>

            <div className="space-y-2">
              {defaultPersonas.map((p) => {
                const isSelected = selectedPersona.id === p.id;
                const isPlayingThis = playingSampleId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPersona(p)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm shadow-amber-500/20 ring-1 ring-amber-500/40'
                        : 'border-dark-border bg-dark-surface-elevated/60 text-dark-text-secondary hover:border-dark-border/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold block text-white">{p.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-mono">
                            {p.geminiVoiceName}
                          </span>
                          {p.gender === 'male' ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
                              👔 صوت رجالي عميق
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30 font-medium">
                              🌸 صوت أنثوي دافئ
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-dark-text-muted line-clamp-1">{p.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySample(p);
                        }}
                        className={`h-8 px-2 rounded-lg border text-xs flex items-center gap-1 font-bold transition-all ${
                          isPlayingThis
                            ? 'border-rose-500 bg-rose-500/20 text-rose-300 animate-pulse'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/30'
                        }`}
                        title="استماع فوري لنبرة الصوت البشري"
                      >
                        <i className={`fa-solid ${isPlayingThis ? 'fa-pause' : 'fa-play'} text-[10px]`}></i>
                        <span className="text-[10px]">استمع</span>
                      </button>

                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-500 bg-amber-500 text-black' : 'border-dark-border'
                        }`}
                      >
                        {isSelected && <i className="fa-solid fa-check text-[9px]"></i>}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Automated Voice Campaign Triggers */}
          <Card className="border-dark-border/80 bg-dark-card p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <i className="fa-solid fa-bolt text-whatsapp-green"></i>
              مشغلات المكالمات الصوتية التلقائية (Triggers)
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-surface-elevated p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🛒</span>
                  <div>
                    <span className="font-bold text-white block text-[11px]">مكالمة استرداد السلة لكبار العملاء</span>
                    <span className="text-[10px] text-dark-text-muted">إذا تجاوزت السلة 150 $ ومرت 30 دقيقة</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-dark-border text-whatsapp-green focus:ring-whatsapp-green bg-dark-bg"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-surface-elevated p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">📦</span>
                  <div>
                    <span className="font-bold text-white block text-[11px]">تأكيد طلبات الدفع عند الاستلام (COD)</span>
                    <span className="text-[10px] text-dark-text-muted">مكالمة آلية فور تسجيل طلب COD جديد</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-dark-border text-whatsapp-green focus:ring-whatsapp-green bg-dark-bg"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-surface-elevated p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎙️</span>
                  <div>
                    <span className="font-bold text-white block text-[11px]">الرد الصوتي على رسائل واتساب الصوتية</span>
                    <span className="text-[10px] text-dark-text-muted">تحويل الصوت لنص والرد برسالة صوتية AI</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-dark-border text-whatsapp-green focus:ring-whatsapp-green bg-dark-bg"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Voice Call History & Transcripts Log */}
      <Card className="border-dark-border/80 bg-dark-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-list-check text-sky-400"></i>
              سجل المكالمات الصوتية والتفريغ النصي (Voice Call Logs)
            </h3>
            <p className="text-xs text-dark-text-secondary mt-0.5">
              متابعة نتائج المكالمات، التفريغ النصي الكامل، ونسب تحويل الصفقات المغلقة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-text-muted">إجمالي المكالمات المسجلة: {callLogs.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-dark-border/60 text-dark-text-muted">
                <th className="py-2.5 px-3">العميل ورقم الهاتف</th>
                <th className="py-2.5 px-3">نوع المكالمة والهدف</th>
                <th className="py-2.5 px-3">الوكيل الصوتي</th>
                <th className="py-2.5 px-3">المدة</th>
                <th className="py-2.5 px-3">القيمة</th>
                <th className="py-2.5 px-3">النتيجة</th>
                <th className="py-2.5 px-3 text-center">التفريغ النصي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/40">
              {callLogs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-surface-elevated/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-white block">{log.customerName}</span>
                    <span className="text-[11px] text-dark-text-muted font-mono" dir="ltr">{log.customerPhone}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-dark-text-primary block font-medium">{log.scenarioLabel}</span>
                    <span className="text-[10px] text-dark-text-muted">{log.timestamp}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-amber-300">{log.agentName}</td>
                  <td className="py-3 px-3 font-mono text-dark-text-secondary">{log.duration}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{log.orderValue}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      {log.statusLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setInspectingCall(log)}
                      className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-bold text-sky-300 hover:bg-sky-500/20 transition-colors"
                    >
                      <i className="fa-solid fa-file-audio ml-1"></i>
                      عرض النص
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transcript Inspection Modal */}
      {inspectingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-dark-border bg-dark-card p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-file-lines text-amber-400"></i>
                  تفريغ مكالمة: {inspectingCall.customerName}
                </h3>
                <span className="text-xs text-dark-text-muted font-mono">{inspectingCall.customerPhone} • {inspectingCall.duration}</span>
              </div>
              <button
                onClick={() => setInspectingCall(null)}
                className="h-8 w-8 rounded-lg border border-dark-border text-dark-text-secondary hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto p-2">
              {inspectingCall.transcript.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    t.sender === 'agent'
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                      : 'bg-dark-surface-elevated border-dark-border text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-dark-text-muted mb-1 font-mono">
                    <span className="font-bold text-white">{t.sender === 'agent' ? inspectingCall.agentName : inspectingCall.customerName}</span>
                    <span>{t.time}</span>
                  </div>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-dark-border/60">
              <Button onClick={() => setInspectingCall(null)} variant="secondary" size="sm">
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
