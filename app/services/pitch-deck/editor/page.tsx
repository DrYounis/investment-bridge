'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SlideCard from '@/app/components/pitch-deck/SlideCard';
import type { Slide, ProjectFormData, BrandingConfig } from '@/types/pitch-deck';
import { generateSlideId, createEmptySlide } from '@/lib/slide-templates';

export default function PitchDeckEditorPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [branding, setBranding] = useState<BrandingConfig>({
    primaryColor: '#c9a84c', secondaryColor: '#0a0f1e', accentColor: '#e2c478',
    fontChoice: 'tajawal', templateId: 'default',
  });
  const [presentMode, setPresentMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('pitchDeckData');
    if (stored) {
      const data = JSON.parse(stored);
      setSlides(data.slides || []);
      setBranding(data.branding || branding);
    }
  }, []);

  const currentSlide = slides[activeSlide];

  const updateSlide = (field: keyof Slide, value: any) => {
    setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, [field]: value } : s));
  };

  const addSlide = () => {
    const newSlide = createEmptySlide('blank', slides.length);
    setSlides(prev => [...prev, newSlide]);
    setActiveSlide(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
    if (activeSlide >= index) setActiveSlide(Math.max(0, activeSlide - 1));
  };

  const handleExportPPTX = async () => {
    alert('تصدير PPTX — تحت التطوير');
  };

  const handleExportPDF = async () => {
    alert('تصدير PDF — تحت التطوير');
  };

  const togglePresentMode = () => {
    if (!presentMode) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setPresentMode(!presentMode);
  };

  // Keyboard navigation in present mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!presentMode) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveSlide(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        document.exitFullscreen?.();
        setPresentMode(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [presentMode, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white" dir="rtl">
        <div className="text-center">
          <p className="text-[#8a9bb8]">لا توجد شرائح. عد إلى المعالج لإنشاء العرض.</p>
          <Link href="/services/pitch-deck/create" className="text-[#c9a84c] mt-4 inline-block">← العودة للمعالج</Link>
        </div>
      </div>
    );
  }

  if (presentMode) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col" style={{ background: branding.secondaryColor }} dir="rtl">
        {/* Slide display */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-5xl" style={{ aspectRatio: '16/9' }}>
            <SlideCard slide={currentSlide} branding={branding} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-16 bg-[#0a0f1e]/90 border-t border-[#1e2d4a] flex items-center justify-between px-6">
          <button onClick={togglePresentMode} className="text-[#8a9bb8] text-sm">خروج</button>
          <span className="text-[#8a9bb8] text-sm">{activeSlide + 1} / {slides.length}</span>
          <div className="flex gap-2">
            <button onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))} className="text-[#c9a84c] text-lg">‹</button>
            <button onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))} className="text-[#c9a84c] text-lg">›</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-arabic" dir="rtl">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-[#1e2d4a] px-6 h-16 flex items-center justify-between">
        <Link href="/services/pitch-deck" className="text-xl font-bold text-[#c9a84c]">مرفأ <span className="text-[#8a9bb8] font-light text-sm">Editor</span></Link>
        <div className="flex gap-3">
          <button onClick={togglePresentMode} className="px-4 py-2 border border-[#1e2d4a] text-[#8a9bb8] rounded-lg text-sm hover:border-[#c9a84c]/40">
            🖥 عرض
          </button>
          <button onClick={handleExportPPTX} className="px-4 py-2 bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] rounded-lg text-sm hover:bg-[#c9a84c]/30">
            📥 PPTX
          </button>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-[#c9a84c] text-[#0a0f1e] rounded-lg text-sm font-bold">
            📄 PDF
          </button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Slide thumbnails sidebar */}
        <div className="w-48 md:w-56 bg-[#0d1426] border-l border-[#1e2d4a] overflow-y-auto p-3 space-y-2 shrink-0">
          <button onClick={addSlide} className="w-full p-2 border-2 border-dashed border-[#1e2d4a] rounded-lg text-[#4a5a78] text-sm hover:border-[#c9a84c]/40 text-center">
            + شريحة جديدة
          </button>
          {slides.map((slide, i) => (
            <div key={slide.id} className="group relative">
              <div
                onClick={() => setActiveSlide(i)}
                className={`rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  i === activeSlide ? 'border-[#c9a84c]' : 'border-transparent hover:border-[#1e2d4a]'
                }`}
              >
                <div className="text-xs p-2 text-center" style={{ background: branding.secondaryColor }}>
                  <span style={{ color: branding.primaryColor }}>{i + 1}.</span>
                  <span className="text-[#8a9bb8] ml-1">{slide.title?.slice(0, 15) || slide.type}</span>
                </div>
              </div>
              <button
                onClick={() => deleteSlide(i)}
                className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Slide preview */}
          <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0f1e]">
            <div className="w-full max-w-3xl" style={{ aspectRatio: '16/9' }}>
              <SlideCard slide={currentSlide} branding={branding} />
            </div>
          </div>

          {/* Editor panel */}
          <div className="border-t border-[#1e2d4a] bg-[#0d1426] p-4 space-y-3 max-h-48 overflow-y-auto">
            <div className="flex gap-3">
              <input
                value={currentSlide?.title || ''}
                onChange={e => updateSlide('title', e.target.value)}
                placeholder="عنوان الشريحة"
                className="flex-1 p-2 rounded-lg bg-[#1a2235] border border-white/10 text-white text-sm"
              />
              <select
                value={currentSlide?.type || 'blank'}
                onChange={e => updateSlide('type', e.target.value)}
                className="p-2 rounded-lg bg-[#1a2235] border border-white/10 text-white text-sm"
              >
                {['cover','problem','solution','market','product','business-model','traction','team','financials','ask','blank'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <textarea
              value={currentSlide?.content || ''}
              onChange={e => updateSlide('content', e.target.value)}
              placeholder="المحتوى"
              rows={1}
              className="w-full p-2 rounded-lg bg-[#1a2235] border border-white/10 text-white text-sm resize-none"
            />
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs text-[#c9a84c] hover:underline"
            >
              {showNotes ? 'إخفاء ملاحظات المتحدث' : '📝 ملاحظات المتحدث'}
            </button>
            {showNotes && (
              <textarea
                value={currentSlide?.speakerNotes || ''}
                onChange={e => updateSlide('speakerNotes', e.target.value)}
                placeholder="ملاحظات المتحدث — اكتب ما ستقوله أثناء عرض هذه الشريحة"
                rows={2}
                className="w-full p-2 rounded-lg bg-[#1a2235] border border-[#c9a84c]/20 text-white text-sm resize-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
