import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Allow internal API secret as auth bypass for one-off admin operations
  const apiKey = request.headers.get('x-api-key');
  const isInternal = Boolean(apiKey && process.env.INTERNAL_API_SECRET && apiKey === process.env.INTERNAL_API_SECRET);

  if (!isInternal) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isSuperAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const supabaseService = createServiceClient();
  const { data: profiles, error } = await supabaseService
    .from('profiles')
    .select('id, full_name, email');

  if (error || !profiles || profiles.length === 0) {
    return NextResponse.json({ error: error?.message || 'No profiles found' }, { status: 500 });
  }

  const subject = '🦈 دليل الطالب الجديد — جلسة التفاوض (Shark Tank) | مرفأ';
  const resend = getResend();
  const results: { email: string; status: string }[] = [];

  for (const profile of profiles) {
    const name = profile.full_name || profile.email?.split('@')[0] || 'رائد أعمال';
    const email = profile.email;
    if (!email) continue;

    const html = buildAnnouncementHTML(name);

    try {
      await resend.emails.send({
        from: 'Marfa Advisory <noreply@marfa.sa>',
        to: email,
        subject,
        html,
      });
      results.push({ email, status: 'sent' });
    } catch (err) {
      console.error('[announce] failed to send to', email, err);
      results.push({ email, status: 'failed' });
    }
  }

  const sent = results.filter(r => r.status === 'sent').length;
  const failed = results.filter(r => r.status === 'failed').length;

  return NextResponse.json({ success: true, sent, failed, total: profiles.length });
}

function buildAnnouncementHTML(name: string) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:24px;margin:0 0 8px 0">🦈 محتوى جديد في المجلس الاستشاري</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">${name}، أضفنا دليلاً دراسياً جديداً لجلسة التفاوض</p>
  </div>
  <div style="padding:32px 24px">
    <div style="border-radius:16px;padding:24px;background:#faf8f2;margin-bottom:20px">
      <p style="color:#0a0f1e;font-size:16px;font-weight:bold;margin:0 0 12px">📖 دليل نظريات التفاوض — Shark Tank</p>
      <p style="color:#64748b;font-size:14px;line-height:1.8;margin:0">
        دليل دراسي شامل يغطي نظريات التفاوض التوزيعي والتكاملي، مع أمثلة عملية من بيئة العمل — طلب زيادة راتب، توزيع المشاريع بين الزملاء، والمزيد.
      </p>
    </div>

    <div style="text-align:center;margin-bottom:20px">
      <a href="https://www.marfa.sa/meetings/majlis/6" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">📄 افتح ملفات الجلسة ←</a>
    </div>

    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #c9a84c44;text-align:center">
      <p style="color:#8a94a8;font-size:11px;margin:0">🏛️ المجلس الاستشاري — مرفأ &nbsp;|&nbsp; حائل 🇸🇦</p>
      <p style="color:#8a94a8;font-size:11px;margin:4px 0 0">www.marfa.sa</p>
    </div>
  </div>
</div>
</body></html>`;
}
