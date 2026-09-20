'use client';

import React, { useState, useEffect, useRef } from 'react';

interface WhatsAppAudioPlayerProps {
  sender: 'contact' | 'agent';
  duration?: string;
  transcript?: string;
  sentiment?: {
    type: 'positive' | 'hesitant' | 'urgent' | 'inquiry';
    label: string;
  };
  audioUrl?: string;
  agentName?: string;
  avatar?: string;
  onQuickAction?: (actionText: string) => void;
}

export default function WhatsAppAudioPlayer({
  sender,
  duration = '0:18',
  transcript,
  sentiment,
  agentName,
  avatar,
  onQuickAction,
}: WhatsAppAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress] = useState(0);

  const isAgent = sender === 'agent';

  // Simulate audio playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (5 * playbackSpeed);
        });
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      // If there is a transcript and speech synthesis is available, play synthesized voice
      if (transcript && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(transcript);
        utterance.lang = 'ar-SA';
        utterance.rate = playbackSpeed;
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(0);
        };
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleSpeedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  // Static representative waveform heights
  const bars = [25, 45, 80, 60, 95, 75, 40, 65, 85, 95, 70, 50, 85, 60, 40, 75, 90, 60, 45, 30];

  return (
    <div className="space-y-2 max-w-sm sm:max-w-md">
      {/* Voice Bubble */}
      <div
        className={`flex items-center gap-3 rounded-2xl p-2.5 sm:p-3 transition-all ${
          isAgent
            ? 'bg-[#0f3d32] border border-emerald-600/40 text-white'
            : 'bg-[#1e1e24] border border-dark-border text-white'
        }`}
        dir="ltr"
      >
        {/* Avatar with Mic Indicator */}
        <div className="relative shrink-0">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden bg-dark-card border border-dark-border flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm">{isAgent ? '👩‍💼' : '👤'}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-whatsapp-green flex items-center justify-center text-[10px] text-black shadow-sm font-bold">
            <i className="fa-solid fa-microphone text-[9px]"></i>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
            isAgent
              ? 'bg-whatsapp-green text-black hover:bg-emerald-400'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
          }`}
          title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الرسالة الصوتية'}
        >
          <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-xs`}></i>
        </button>

        {/* Waveform and Progress Bar */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          {/* Animated Waveform */}
          <div className="flex items-center gap-[3px] h-6 cursor-pointer">
            {bars.map((height, i) => {
              const barPercent = (i / bars.length) * 100;
              const isActive = progress >= barPercent;
              return (
                <div
                  key={i}
                  style={{
                    height: `${isPlaying ? Math.max(height * (Math.random() * 0.4 + 0.8), 20) : height}%`,
                  }}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isActive
                      ? isAgent
                        ? 'bg-emerald-300'
                        : 'bg-whatsapp-green'
                      : 'bg-white/20'
                  }`}
                />
              );
            })}
          </div>

          {/* Time & Speed Controls */}
          <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
            <span>{isPlaying ? `${Math.round((progress / 100) * 18)} ثانية` : duration}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeedToggle}
                className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 hover:border-white/30 text-emerald-400 font-bold"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis Badge for Incoming Customer Audio */}
      {!isAgent && sentiment && (
        <div className="flex items-center justify-between bg-dark-card/90 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300">
            <i className="fa-solid fa-brain-circuit text-[11px] animate-pulse"></i>
            <span className="font-bold text-[11px]">تحليل المشاعر: {sentiment.label}</span>
          </div>
          {onQuickAction && (
            <button
              onClick={() => onQuickAction('عرض شحن مجاني + تقسيط')}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg"
            >
              ⚡ إرسال رد صوتي ذكي
            </button>
          )}
        </div>
      )}

      {/* Transcript Accordion */}
      {transcript && (
        <div className="rounded-xl bg-black/30 border border-dark-border/60 p-2 text-xs">
          <button
            onClick={() => setShowTranscript((prev) => !prev)}
            className="flex items-center justify-between w-full text-[11px] text-dark-text-muted hover:text-white font-medium"
          >
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-file-lines text-emerald-400"></i>
              {showTranscript ? 'إخفاء التفريغ النصي الصوتي' : 'عرض التفريغ النصي للرسالة الصوتية'}
            </span>
            <i className={`fa-solid fa-chevron-${showTranscript ? 'up' : 'down'} text-[9px]`}></i>
          </button>

          {showTranscript && (
            <div className="mt-2 pt-2 border-t border-dark-border/40 text-white/90 text-xs leading-relaxed font-sans bg-dark-surface-elevated/40 p-2 rounded-lg">
              <p className="whitespace-pre-wrap">{transcript}</p>
              {agentName && (
                <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                  🎙️ تم التوليد بنبرة: {agentName}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
