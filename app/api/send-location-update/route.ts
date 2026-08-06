import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const TEMP_TOKEN = 'marfa-location-update-2026-08-06';
const MAPS_LINK = 'https://maps.app.goo.gl/hH2bhED852UMbL6Y9';
const NEW_LOCATION = 'فندق هوليداي فيلا حائل';
const OLD_LOCATION = 'ثمد كوفي';

function locationChangeEmail(name: string) {
  return `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h2 style="color:#c9a84c;text-align:center;margin:0 0 8px 0;font-size:20px;">📢 تحديث مهم — تغيير مكان اللقاء</h2>
    <p style="color:#64748b;text-align:center;margin:0 0 24px 0;font-size:13px;">تغيير دائم في موقع لقاءات مرفأ الأسبوعية</p>

    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="color:#92400e;margin:0 0 12px 0;font-size:15px;line-height:1.8;">
        ${name || 'ضيفنا الكريم'}،
      </p>
      <p style="color:#92400e;margin:0;font-size:15px;line-height:1.8;">
        نود إعلامكم بأن مكان لقاءات مرفأ الأسبوعية قد تغيّر <strong>بشكل دائم</strong> من
        <span style="text-decoration:line-through;color:#dc2626;">${OLD_LOCATION}</span>
        إلى الموقع الجديد:
      </p>
    </div>

    <div style="background:#0a0f1e;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="color:#c9a84c;font-size:22px;font-weight:bold;margin:0 0 8px 0;">📍 ${NEW_LOCATION}</p>
      <a href="${MAPS_LINK}" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:14px;margin-top:12px;">🗺️ فتح في خرائط قوقل</a>
    </div>

    <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="color:#166534;margin:0;font-size:14px;line-height:1.8;">
        ✅ <strong>الموعد لم يتغير:</strong> كل جمعة بعد صلاة الجمعة<br/>
        ✅ <strong>المكان الجديد ثابت:</strong> ${NEW_LOCATION} — من هذا الأسبوع فصاعداً
      </p>
    </div>

    <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #c9a84c44;">
      <p style="color:#64748b;font-size:11px;margin:0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

function tomorrowMeetingEmail(name: string) {
  return `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h2 style="color:#0a0f1e;text-align:center;margin:0 0 4px 0;font-size:20px;">📅 تذكير — لقاء الغد</h2>
    <p style="color:#c9a84c;text-align:center;margin:0 0 24px 0;font-size:14px;font-weight:bold;">الجمعة 7 أغسطس 2026</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b;width:100px;">📅 التاريخ</td><td style="padding:10px 12px;color:#0a0f1e;font-weight:bold;">الجمعة 7 أغسطس 2026</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b;">🕐 الوقت</td><td style="padding:10px 12px;color:#0a0f1e;font-weight:bold;">بعد صلاة الجمعة</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b;">📍 المكان</td><td style="padding:10px 12px;color:#0a0f1e;font-weight:bold;"><a href="${MAPS_LINK}" style="color:#0a0f1e;text-decoration:underline;">${NEW_LOCATION}</a> <span style="color:#c9a84c;font-size:11px;">(جديد)</span></td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b;">📚 الموضوع</td><td style="padding:10px 12px;color:#c9a84c;font-weight:bold;">المالية ودراسة الجدوى</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b;">🏢 دراسة الحالة</td><td style="padding:10px 12px;color:#0a0f1e;">حالة "WeWork" (الفشل المالي)</td></tr>
    </table>

    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="color:#92400e;margin:0;font-size:14px;line-height:1.8;">
        ⚠️ <strong>تنبيه:</strong> المكان الجديد هو ${NEW_LOCATION} — يرجى الانتباه وعدم الذهاب إلى الموقع القديم (${OLD_LOCATION}).
      </p>
    </div>

    <div style="text-align:center;">
      <a href="${MAPS_LINK}" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px;">🗺️ فتح الموقع في خرائط قوقل</a>
    </div>

    <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #c9a84c44;">
      <p style="color:#64748b;font-size:11px;margin:0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const send = searchParams.get('send'); // 'change', 'tomorrow', or 'both'

  if (token !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!send || !['change', 'tomorrow', 'both'].includes(send)) {
    return NextResponse.json({ error: 'Missing or invalid ?send= (change|tomorrow|both)' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: subscribers, error: dbError } = await supabase
    .from('meeting_subscribers')
    .select('email');

  if (dbError) {
    return NextResponse.json({ error: 'DB error: ' + dbError.message }, { status: 500 });
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ error: 'No subscribers found' }, { status: 404 });
  }

  const emails = subscribers.map((s: { email: string }) => s.email);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const results: { email: string; change?: string; tomorrow?: string }[] = [];

  const sendChange = send === 'change' || send === 'both';
  const sendTomorrow = send === 'tomorrow' || send === 'both';

  for (const email of emails) {
    const name = email.split('@')[0];
    const entry: { email: string; change?: string; tomorrow?: string } = { email };

    if (sendChange) {
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: email,
          subject: '📢 تحديث مهم — تغيير مكان لقاءات مرفأ إلى فندق هوليداي فيلا حائل',
          html: locationChangeEmail(name),
        });
        entry.change = error ? `فشل: ${error.message}` : 'تم';
      } catch (err: unknown) {
        entry.change = `فشل: ${err instanceof Error ? err.message : String(err)}`;
      }
      await new Promise(r => setTimeout(r, 600));
    }

    if (sendTomorrow) {
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: email,
          subject: '📅 تذكير — لقاء الغد الجمعة 7 أغسطس | فندق هوليداي فيلا حائل',
          html: tomorrowMeetingEmail(name),
        });
        entry.tomorrow = error ? `فشل: ${error.message}` : 'تم';
      } catch (err: unknown) {
        entry.tomorrow = `فشل: ${err instanceof Error ? err.message : String(err)}`;
      }
      await new Promise(r => setTimeout(r, 600));
    }

    results.push(entry);
  }

  const summary = {
    total: emails.length,
    changeSent: results.filter(r => r.change === 'تم').length,
    changeFailed: results.filter(r => r.change?.startsWith('فشل')).length,
    tomorrowSent: results.filter(r => r.tomorrow === 'تم').length,
    tomorrowFailed: results.filter(r => r.tomorrow?.startsWith('فشل')).length,
  };

  return NextResponse.json({ success: true, summary, results });
}
