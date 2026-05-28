'use client';

import IdeaAnalyzer from '@/app/components/shared/IdeaAnalyzer';

export default function IdeaAnalyzerPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#e8eaf0' }}>
          💡 محلل الأفكار
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7a95' }}>
          حلل فكرة مشروعك بتعمق مع الذكاء الاصطناعي
        </p>
      </div>
      <div className="max-w-3xl">
        <IdeaAnalyzer role="entrepreneur" />
      </div>
    </div>
  );
}
