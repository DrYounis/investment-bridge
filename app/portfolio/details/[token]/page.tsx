import { createServiceClient } from '@/lib/supabase/service';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

type Project = {
  id: string; name_ar: string; name_en: string; icon: string;
  sector_ar: string; stage_ar: string; live_url: string | null;
  overview_ar: string; problem_ar: string; solution_ar: string;
  features_ar: string[]; status_ar: string; business_model_ar: string; why_now_ar: string;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  return { robots: { index: false, follow: false } };
}

function WhatsAppLink(name: string) {
  const msg = encodeURIComponent(`مهتم بمناقشة الاستثمار في ${name}`);
  return `https://wa.me/966555056545?text=${msg}`;
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const svc = createServiceClient();

  const { data: project } = await svc
    .from('marfa_portfolio')
    .select('*')
    .eq('access_token', token)
    .eq('is_active', true)
    .single();

  if (!project) notFound();

  const p = project as Project;
  const features: string[] = Array.isArray(p.features_ar) ? p.features_ar : [];

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* Premium Header */}
      <section className="bg-[#0a0f1e] pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{p.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-3 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] font-bold border border-[#c9a84c]/20" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  وثيقة خاصة — للمستثمرين فقط
                </span>
              </div>
              <h1 className="text-4xl font-black text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {p.name_ar}
              </h1>
              <p className="text-[#64748b] mt-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {p.name_en} · {p.sector_ar} · {p.stage_ar}
              </p>
            </div>
          </div>
          {p.live_url && (
            <a href={p.live_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] font-bold rounded-xl hover:bg-[#d4a843] transition-colors text-sm"
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              زيارة المنصة مباشرة ↗
            </a>
          )}
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <Section title="نظرة عامة" body={p.overview_ar} />
        <Section title="المشكلة" body={p.problem_ar} />
        <Section title="الحل" body={p.solution_ar} />
        <Section title="الوضع الحالي" body={p.status_ar} />
        <Section title="نموذج العمل" body={p.business_model_ar} />
        <Section title="لماذا الآن؟" body={p.why_now_ar} />

        {features.length > 0 && (
          <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
            <h2 className="text-lg font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              أبرز المزايا
            </h2>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  <span className="text-[#c9a84c] mt-0.5">●</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* CTA Block */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-[#0a0f1e] rounded-3xl p-10 border-2 border-[#c9a84c]/30 text-center">
          <h2 className="text-2xl font-black text-[#c9a84c] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            مهتم بالاستثمار في هذا المشروع؟
          </h2>
          <p className="text-[#a0aec0] mb-8 max-w-lg mx-auto" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            نسبة الشراكة وحجم الاستثمار تُناقش مباشرة — احجز اجتماعاً مع فريق مرفأ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WhatsAppLink(p.name_ar)} target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-sm"
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              💬 واتساب
            </a>
            <a href="mailto:mohamedy2003@gmail.com?subject=استثمار في {p.name_ar}"
              className="px-8 py-4 bg-white text-[#0a0f1e] font-bold rounded-2xl hover:bg-[#f0f0f0] transition-colors text-sm"
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              ✉️ بريد إلكتروني
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
      <h2 className="text-lg font-bold text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {title}
      </h2>
      <p className="text-[#4a5b78] leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {body}
      </p>
    </div>
  );
}
