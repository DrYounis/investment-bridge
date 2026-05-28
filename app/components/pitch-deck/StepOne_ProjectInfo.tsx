'use client';

import { ProjectFormData } from '@/types/pitch-deck';

interface StepOneProps {
  data: ProjectFormData;
  onChange: (data: ProjectFormData) => void;
  onNext: () => void;
}

export default function StepOne_ProjectInfo({ data, onChange, onNext }: StepOneProps) {
  const update = (field: keyof ProjectFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const canNext = data.projectName.trim() && data.problem.trim() && data.solution.trim();

  const inputClass = "w-full p-3.5 rounded-xl bg-[#1a2235] border border-white/10 text-white placeholder:text-[#4a5a78] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/50 transition-all";
  const labelClass = "block text-sm font-semibold text-[#8a9bb8] mb-1.5";
  const textareaClass = inputClass + ' resize-none';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">معلومات المشروع</h2>
        <p className="text-[#8a9bb8] text-sm">أدخل المعلومات الأساسية عن مشروعك ليتم بناء العرض الاستثماري</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>اسم المشروع *</label>
          <input className={inputClass} value={data.projectName} onChange={e => update('projectName', e.target.value)} placeholder="مثال: منصة مرفأ" />
        </div>
        <div>
          <label className={labelClass}>الفكرة في جملة واحدة</label>
          <input className={inputClass} value={data.tagline} onChange={e => update('tagline', e.target.value)} placeholder="وصف مختصر لمشروعك" />
        </div>
      </div>

      <div>
        <label className={labelClass}>المشكلة التي تحلها *</label>
        <textarea className={textareaClass} rows={3} value={data.problem} onChange={e => update('problem', e.target.value)} placeholder="ما المشكلة التي يعاني منها السوق؟ اذكر 3-4 نقاط" />
      </div>

      <div>
        <label className={labelClass}>الحل المقترح *</label>
        <textarea className={textareaClass} rows={3} value={data.solution} onChange={e => update('solution', e.target.value)} placeholder="كيف يحل مشروعك هذه المشكلة؟" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>السوق المستهدف</label>
          <input className={inputClass} value={data.targetMarket} onChange={e => update('targetMarket', e.target.value)} placeholder="حجم السوق والفئة المستهدفة" />
        </div>
        <div>
          <label className={labelClass}>نموذج الإيراد</label>
          <input className={inputClass} value={data.businessModel} onChange={e => update('businessModel', e.target.value)} placeholder="كيف ستربح؟ اشتراكات، عمولة..." />
        </div>
      </div>

      <div>
        <label className={labelClass}>المرحلة الحالية والإنجازات</label>
        <textarea className={textareaClass} rows={2} value={data.traction} onChange={e => update('traction', e.target.value)} placeholder="عدد العملاء، الإيرادات، الشراكات..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>أعضاء الفريق</label>
          <input className={inputClass} value={data.teamMembers} onChange={e => update('teamMembers', e.target.value)} placeholder="الأسماء والمناصب" />
        </div>
        <div>
          <label className={labelClass}>حجم التمويل المطلوب</label>
          <input className={inputClass} value={data.fundingAsk} onChange={e => update('fundingAsk', e.target.value)} placeholder="مثال: 2,000,000 ريال" />
        </div>
        <div>
          <label className={labelClass}>استخدام التمويل</label>
          <input className={inputClass} value={data.useOfFunds} onChange={e => update('useOfFunds', e.target.value)} placeholder="التطوير، التسويق، التوظيف..." />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!canNext}
          className="px-8 py-3.5 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0a0f1e] font-bold rounded-xl hover:from-[#e2c478] hover:to-[#c9a84c] transition-all duration-300 shadow-lg hover:shadow-[0_8px_24px_rgba(201,168,76,0.25)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          التالي ←
        </button>
      </div>
    </div>
  );
}
