import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const TEMP_TOKEN = 'mrf-manual-meeting-2026-07-30';

function buildSubscriberHTML(email: string, name: string) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 24px; margin: 0 0 8px 0;">⚓ مرفأ — لقاءات دراسات الحالة</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو الطموحات</p>
  </div>
  <div style="padding: 32px 24px;">
    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 16px 0; text-align: center;">📅 دعوة لحضور اللقاء 6</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; width: 100px;">📅 التاريخ</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">الجمعة 31 يوليو 2026</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🕐 الوقت</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">بعد صلاة الجمعة</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📍 المكان</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">ثمد كوفي</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📚 الموضوع</td><td style="padding: 10px 12px; color: #c9a84c; font-weight: bold;">التفاوض</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🏢 دراسة الحالة</td><td style="padding: 10px 12px; color: #0a0f1e;">حالة "Shark Tank" (نماذج حقيقية)</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; vertical-align: top;">🎯 التحدي</td><td style="padding: 10px 12px; color: #64748b; line-height: 1.7;">تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟</td></tr>
      </table>
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.marfa.sa/meetings/majlis/6" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">🏛️ انضم إلى المجلس</a>
    </div>
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">📍 ثمد كوفي — بعد صلاة الجمعة من كل أسبوع</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

function buildInstructorHTML() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 22px; margin: 0;">⚓ تحضير لقاء الغد</h1>
  </div>
  <div style="padding: 32px 24px;">
    <p style="color: #0a0f1e; font-size: 16px; line-height: 1.9; margin: 0 0 20px 0;">
      نكرر لقاء <strong style="color: #c9a84c;">التفاوض</strong> غداً الجمعة 31 يوليو 2026 لأن الأسبوع الماضي حضر ٣ فقط.
    </p>
    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 20px; background: #faf8f2; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 10px; font-weight: bold; color: #64748b; width: 90px;">📚 الموضوع</td><td style="padding: 8px 10px; color: #c9a84c; font-weight: bold;">التفاوض</td></tr>
        <tr><td style="padding: 8px 10px; font-weight: bold; color: #64748b;">🏢 الحالة</td><td style="padding: 8px 10px; color: #0a0f1e;">Shark Tank (نماذج حقيقية)</td></tr>
        <tr><td style="padding: 8px 10px; font-weight: bold; color: #64748b;">🎯 التحدي</td><td style="padding: 8px 10px; color: #64748b; line-height: 1.7;">تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟</td></tr>
        <tr><td style="padding: 8px 10px; font-weight: bold; color: #64748b;">📅 التاريخ</td><td style="padding: 8px 10px; color: #0a0f1e;">الجمعة 31 يوليو 2026</td></tr>
      </table>
    </div>
    <p style="color: #64748b; font-size: 14px; line-height: 1.8; margin: 0;">
      يُرجى التحضير للقاء. الروابط:
      <br/>• <a href="https://www.youtube.com/watch?v=um-iVXiXedc" style="color: #c9a84c;">Scrub Daddy (S4E7)</a>
      <br/>• <a href="https://www.youtube.com/watch?v=ae5MssJ8en4" style="color: #c9a84c;">Ring (S5E9)</a>
    </p>
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">📍 ثمد كوفي — بعد صلاة الجمعة</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${TEMP_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = await request.json().catch(() => null);
    const action = body?.action || 'both'; // 'subscribers' | 'instructors' | 'both'

    const results: { subscribers?: { sent: number; total: number; results: { email: string; status: string }[] }; instructors?: { sent: number; results: { email: string; status: string }[] } } = {};

    // === SUBSCRIBER EMAIL ===
    if (action === 'subscribers' || action === 'both') {
      const { data: subscribers } = await supabase
        .from('meeting_subscribers')
        .select('email')
        .order('subscribed_at', { ascending: true });

      if (!subscribers || subscribers.length === 0) {
        results.subscribers = { sent: 0, total: 0, results: [] };
      } else {
        const subResults: { email: string; status: string }[] = [];
        for (const sub of subscribers) {
          const name = sub.email.split('@')[0];
          try {
            const { error } = await resend.emails.send({
              from: 'Marfa Meetings <noreply@marfa.sa>',
              to: sub.email,
              subject: `🔔 تذكير: لقاء مرفأ 6 — الجمعة 31 يوليو 2026 | التفاوض — Shark Tank`,
              html: buildSubscriberHTML(sub.email, name),
            });
            subResults.push({ email: sub.email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
          } catch (err: unknown) {
            subResults.push({ email: sub.email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
          }
          await new Promise(r => setTimeout(r, 600));
        }
        results.subscribers = {
          sent: subResults.filter(r => r.status === 'تم الإرسال').length,
          total: subscribers.length,
          results: subResults,
        };
      }
    }

    // === INSTRUCTOR/ADMIN EMAIL ===
    if (action === 'instructors' || action === 'both') {
      const adminEmails = [
        'remy.arbaoui@marfa.sa',
        'ceo@marfa.sa',
        'cto@marfa.sa',
        'op.younis@gmail.com',
      ];

      const instResults: { email: string; status: string }[] = [];
      for (const email of adminEmails) {
        try {
          const { error } = await resend.emails.send({
            from: 'Marfa Meetings <noreply@marfa.sa>',
            to: email,
            subject: `📋 تحضير لقاء الغد — التفاوض (مكرر) | الجمعة 31 يوليو`,
            html: buildInstructorHTML(),
          });
          instResults.push({ email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
        } catch (err: unknown) {
          instResults.push({ email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
        }
        await new Promise(r => setTimeout(r, 600));
      }
      results.instructors = {
        sent: instResults.filter(r => r.status === 'تم الإرسال').length,
        results: instResults,
      };
    }

    return NextResponse.json({ success: true, ...results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
