'use client';

export default function GoalsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#e8eaf0' }}>🎯 الأهداف</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7a95' }}>قريباً — تتبع الأهداف والمؤشرات</p>
      </div>
      <div className="rounded-2xl p-12 text-center" style={{ background: '#0d1428' }}>
        <span className="text-5xl">🚧</span>
        <p className="text-sm mt-4" style={{ color: '#6b7a95' }}>هذه الصفحة قيد التطوير</p>
      </div>
    </div>
  );
}
