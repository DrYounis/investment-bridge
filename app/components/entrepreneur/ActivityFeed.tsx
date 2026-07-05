'use client';

interface Activity {
  text: string;
  time: string;
  color: string;
}

const activities: Activity[] = [
  { text: 'طلب وادي مسرعة وثائق إضافية', time: 'منذ ساعة', color: '#5e9ef0' },
  { text: 'جدولة اجتماع مع صندوق رؤية', time: 'منذ ٣ ساعات', color: '#3ecf8e' },
  { text: 'قراءة نشرتك من ٥ مستثمرين', time: 'أمس', color: '#c9a84c' },
  { text: 'تعليق جديد على خطة العمل', time: 'يومان', color: '#f0a050' },
];

export default function ActivityFeed() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
        📰 النشاط الأخير
      </h3>
      <div className="space-y-2">
        {activities.map((a, i) => (
          <div
            key={i}
            className="rounded-xl p-3 transition-all hover:brightness-110"
            style={{
              background: '#0d1428',
              borderRight: `3px solid ${a.color}`,
            }}
          >
            <p className="text-sm" style={{ color: '#e8eaf0' }}>
              {a.text}
            </p>
            <span className="text-xs mt-1 block" style={{ color: '#6b7a95' }}>
              {a.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
