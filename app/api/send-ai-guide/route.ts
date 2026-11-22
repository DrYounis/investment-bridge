import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// One-shot token — this route is temporary and will be removed after the send.
const TEMP_TOKEN = 'marfa-ai-guide-nov20';

const SUBJECT = '🤖 دليل لقاء اليوم مرفق — كيف تستخدم الذكاء الاصطناعي بذكاء في يومك وشغلك؟';

function buildEmailHTML(name: string | null): string {
  const greeting = name ? `مرحباً ${name}،` : 'أهلاً بك،';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0;">
<div style="max-width:600px;margin:auto;background:#ffffff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06);">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center;">
    <h1 style="color:#c9a84c;font-size:24px;margin:0 0 8px 0;">⚓ مرفأ — لقاء اليوم</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0;">حيث تَرسو الطموحات</p>
  </div>
  <div style="padding:32px 24px;">
    <div style="border:2px solid #c9a84c;border-radius:16px;padding:24px;background:#faf8f2;margin-bottom:24px;">
      <h2 style="color:#0a0f1e;font-size:19px;margin:0 0 16px 0;text-align:center;">🤖 كيف تستخدم الذكاء الاصطناعي بذكاء في يومك وشغلك؟</h2>
      <p style="color:#4a5b78;line-height:1.9;font-size:15px;margin:0;text-align:center;">${greeting}</p>
      <p style="color:#4a5b78;line-height:1.9;font-size:15px;margin:16px 0 0 0;text-align:center;">
        يسرّنا في منصة مرفأ دعوتك للقاء اليوم — الجمعة ٢٠ نوفمبر ٢٠٢٦ — بعد صلاة الجمعة، في فندق هوليداي فيلا حائل.
      </p>
      <p style="color:#4a5b78;line-height:1.9;font-size:15px;margin:16px 0 0 0;text-align:center;">
        أرفقنا لك «دليل محاور النقاش» لتطّلع عليه قبل اللقاء، ويتضمن المحاور الخمسة التي سنناقشها تفاعليًا:
      </p>
      <div style="text-align:right;margin-top:16px;">
        <p style="color:#0a0f1e;line-height:2;font-size:15px;margin:0;">١. السياق — لماذا «الأمر» ليس كل شيء؟</p>
        <p style="color:#0a0f1e;line-height:2;font-size:15px;margin:0;">٢. بيئة العمل — كل ما يحيط بالذكاء الاصطناعي</p>
        <p style="color:#0a0f1e;line-height:2;font-size:15px;margin:0;">٣. التكرار — التفكير مع الأداة لا مجرد سؤالها</p>
        <p style="color:#0a0f1e;line-height:2;font-size:15px;margin:0;">٤. التحقق والحكم البشري — إبقاء الإنسان في مقعد القيادة</p>
        <p style="color:#0a0f1e;line-height:2;font-size:15px;margin:0;">٥. صيد العقبات اليومية — أين نستخدمه فعليًا؟</p>
      </div>
    </div>
    <div style="margin-top:24px;text-align:center;">
      <p style="color:#0a0f1e;font-weight:bold;font-size:15px;margin:0 0 8px 0;">ننتظر حضورك 🌟</p>
    </div>
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid #c9a84c44;text-align:center;">
      <p style="color:#64748b;font-size:12px;margin:0 0 4px 0;">📍 فندق هوليداي فيلا حائل — بعد صلاة الجمعة</p>
      <p style="color:#64748b;font-size:11px;margin:0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    const { data: subs } = await supabase.from('meeting_subscribers').select('email');
    const { data: profiles } = await supabase.from('profiles').select('email, full_name');

    // Deduplicate by lowercased email; prefer the profile's name when present.
    const map = new Map<string, { email: string; name: string | null }>();
    for (const s of subs || []) {
      const email = (s.email || '').trim();
      if (!email) continue;
      const key = email.toLowerCase();
      if (!map.has(key)) map.set(key, { email, name: null });
    }
    for (const p of profiles || []) {
      const email = (p.email || '').trim();
      if (!email) continue;
      const key = email.toLowerCase();
      const existing = map.get(key);
      map.set(key, {
        email: existing?.email || email,
        name: p.full_name?.trim() || existing?.name || null,
      });
    }

    const recipients = [...map.values()];
    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients' }, { status: 500 });
    }

    // Fetch the PDF from this deployment's public assets.
    const origin = new URL(request.url).origin;
    const pdfRes = await fetch(`${origin}/discussion-guide.pdf`);
    if (!pdfRes.ok) {
      return NextResponse.json({ error: `PDF fetch failed: ${pdfRes.status}` }, { status: 500 });
    }
    const content = Buffer.from(await pdfRes.arrayBuffer()).toString('base64');

    const resend = new Resend(process.env.RESEND_API_KEY);

    const results: { email: string; name: string | null; status: string }[] = [];
    let sent = 0;

    for (const r of recipients) {
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: r.email,
          subject: SUBJECT,
          html: buildEmailHTML(r.name),
          attachments: [{ filename: 'دليل-محاور-النقاش.pdf', content, contentType: 'application/pdf' }],
        });
        if (error) {
          results.push({ email: r.email, name: r.name, status: `فشل: ${error.message}` });
        } else {
          sent++;
          results.push({ email: r.email, name: r.name, status: 'تم الإرسال' });
        }
      } catch (err: unknown) {
        results.push({ email: r.email, name: r.name, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
      }
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    await resend.emails.send({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 تقرير إرسال — دليل محاور النقاش (${sent}/${recipients.length})`,
      html: `<div style="font-family:sans-serif;padding:20px;"><h2>تقرير إرسال دليل محاور النقاش</h2><p>أُرسل ${sent} من ${recipients.length}.</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true, sent, total: recipients.length, results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
