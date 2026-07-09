'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WizardStepper from '@/app/components/pitch-deck/WizardStepper';
import StepOne_ProjectInfo from '@/app/components/pitch-deck/StepOne_ProjectInfo';
import StepTwo_Upload from '@/app/components/pitch-deck/StepTwo_Upload';
import StepThree_Branding from '@/app/components/pitch-deck/StepThree_Branding';
import StepFour_Generate from '@/app/components/pitch-deck/StepFour_Generate';
import type { ProjectFormData, BrandingConfig, Slide } from '@/types/pitch-deck';

const emptyProject: ProjectFormData = {
  projectName: '', tagline: '', problem: '', solution: '',
  targetMarket: '', businessModel: '', traction: '', teamMembers: '', fundingAsk: '', useOfFunds: '',
};

const defaultBranding: BrandingConfig = {
  primaryColor: '#c9a84c', secondaryColor: '#0a0f1e', accentColor: '#e2c478',
  fontChoice: 'tajawal', templateId: 'default',
};

export default function PitchDeckCreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [projectData, setProjectData] = useState<ProjectFormData>(emptyProject);
  const [branding, setBranding] = useState<BrandingConfig>(defaultBranding);
  const [documentHighlights, setDocumentHighlights] = useState<string>('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [generatingError, setGeneratingError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setProgressText('جاري تحليل المشروع...');

    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectData, documentHighlights }),
      });

      const progressSteps = [
        { pct: 20, text: 'جاري تحليل معلومات المشروع...' },
        { pct: 40, text: 'جاري إنشاء الشرائح...' },
        { pct: 60, text: 'جاري صياغة المحتوى...' },
        { pct: 80, text: 'جاري إضافة ملاحظات المتحدث...' },
        { pct: 90, text: 'أوشك على الانتهاء...' },
      ];

      for (const s of progressSteps) {
        await new Promise(r => setTimeout(r, 800));
        setProgress(s.pct);
        setProgressText(s.text);
      }

      const data = await res.json();

      if (data.error) {
        setGeneratingError('حدث خطأ: ' + data.error);
        setIsGenerating(false);
        return;
      }

      setSlides(data.slides || []);
      setProgress(100);
      setProgressText('اكتمل!');
      await new Promise(r => setTimeout(r, 500));
    } catch (err: any) {
      setGeneratingError('حدث خطأ: ' + (err?.message || 'خطأ غير معروف'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewEditor = () => {
    sessionStorage.setItem('pitchDeckData', JSON.stringify({ projectData, branding, slides }));
    router.push('/services/pitch-deck/editor');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-arabic" dir="rtl">
      <nav className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-[#1e2d4a] px-6 h-16 flex items-center justify-between">
        <Link href="/services/pitch-deck" className="text-xl font-bold text-[#c9a84c]">مرفأ <span className="text-[#8a9bb8] font-light text-sm">العروض التقديمية</span></Link>
        <div className="flex gap-4 text-sm text-[#8a9bb8]">
          <Link href="/services/pitch-deck/templates" className="hover:text-[#c9a84c]">القوالب</Link>
          <Link href="/meetings" className="hover:text-[#c9a84c]">لقاءات مرفأ</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <WizardStepper currentStep={step} onStepClick={setStep} />

        <div className="bg-[#111827] border border-[#1e2d4a] rounded-2xl p-6 md:p-8">
          {step === 0 && (
            <StepOne_ProjectInfo data={projectData} onChange={setProjectData} onNext={() => setStep(1)} />
          )}
          {step === 1 && (
            <StepTwo_Upload
              onHighlightsExtracted={(h) => setDocumentHighlights(JSON.stringify(h))}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepThree_Branding branding={branding} onChange={setBranding} onNext={() => setStep(3)} />
          )}
          {step === 3 && (
            <StepFour_Generate
              slides={slides}
              isGenerating={isGenerating}
              progress={progress}
              progressText={progressText}
              error={generatingError}
              onGenerate={handleGenerate}
              onViewEditor={handleViewEditor}
            />
          )}
        </div>

        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="mt-4 text-[#8a9bb8] hover:text-[#c9a84c] text-sm">
            ← رجوع
          </button>
        )}
      </div>
    </div>
  );
}
