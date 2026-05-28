'use client';

import NotepadSection from '@/app/components/shared/NotepadSection';

export default function NotepadPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#e8eaf0' }}>
          📝 المفكرة
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7a95' }}>
          دوّن أفكارك وملاحظاتك
        </p>
      </div>
      <div className="max-w-2xl">
        <NotepadSection />
      </div>
    </div>
  );
}
