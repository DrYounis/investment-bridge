'use client';

import { Slide } from '@/types/pitch-deck';

interface StepFourProps {
  slides: Slide[];
  isGenerating: boolean;
  progress: number;
  progressText: string;
  onGenerate: () => void;
  onViewEditor: () => void;
}

export default function StepFour_Generate({
  slides, isGenerating, progress, progressText, onGenerate, onViewEditor,
}: StepFourProps) {
  return (
    <div className="space-y-6 text-center">
      {!isGenerating && slides.length === 0 && (
        <>
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-2">جاهز لإنشاء عرضك الاستثماري</h2>
          <p className="text-[#8a9bb8] text-sm max-w-md mx-auto mb-6">
            سيقوم الذكاء الاصطناعي بتحليل معلومات مشروعك وإنشاء 10 شرائح عرض احترافية
          </p>
          <button
            onClick={onGenerate}
            className="px-10 py-4 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0a0f1e] font-bold rounded-xl hover:from-[#e2c478] hover:to-[#c9a84c] transition-all duration-300 shadow-lg hover:shadow-[0_8px_24px_rgba(201,168,76,0.3)] text-lg"
          >
            🪄 إنشاء العرض الآن
          </button>
        </>
      )}

      {isGenerating && (
        <div className="space-y-6 py-10">
          <div className="text-4xl animate-bounce">⚡</div>
          <h2 className="text-xl font-bold text-white">جاري إنشاء عرضك الاستثماري...</h2>

          {/* Progress bar */}
          <div className="max-w-md mx-auto bg-[#1e2d4a] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e2c478] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress text */}
          <p className="text-[#c9a84c] font-bold text-lg">{progressText}</p>
          <p className="text-[#4a5a78] text-sm">الشريحة {slides.length} من 10</p>

          {/* Generated slides preview */}
          {slides.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mt-6">
              {slides.map((slide, i) => (
                <div
                  key={slide.id}
                  className="aspect-video bg-[#111827] border border-[#1e2d4a] rounded-lg flex items-center justify-center text-sm text-[#8a9bb8] animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className="text-[#c9a84c] font-bold">{i + 1}</div>
                    <div className="text-xs mt-1">{slide.title?.slice(0, 20)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isGenerating && slides.length > 0 && (
        <div className="space-y-4">
          <div className="text-4xl">✅</div>
          <h2 className="text-xl font-bold text-white">تم إنشاء العرض بنجاح!</h2>
          <p className="text-[#8a9bb8] text-sm">تم إنشاء {slides.length} شرائح. يمكنك الآن تعديلها وتصديرها.</p>
          <button
            onClick={onViewEditor}
            className="px-8 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0a0f1e] font-bold rounded-xl hover:from-[#e2c478] hover:to-[#c9a84c] transition-all duration-300 shadow-lg"
          >
            📝 فتح المحرر
          </button>
        </div>
      )}
    </div>
  );
}
