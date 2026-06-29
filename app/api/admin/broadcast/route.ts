import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { Resend } from 'resend';

function buildEmailHTML(name: string, title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0f1e;direction:rtl;font-family:Tajawal,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0d1628;border-radius:12px;overflow:hidden;border-top:4px solid #c9a84c;">
        <tr>
          <td style="padding:32px 28px;text-align:right;">
            <h2 style="color:#c9a84c;font-size:18px;margin:0 0 8px 0;font-weight:800;font-family:Tajawal,sans-serif;">مرفأ</h2>
            <p style="color:#ffffff;font-size:15px;line-height:1.7;margin:16px 0 0 0;font-family:Tajawal,sans-serif;">مرحباً ${name}،</p>
            <div style="color:#a0aec0;font-size:14px;line-height:1.8;margin-top:12px;font-family:Tajawal,sans-serif;white-space:pre-wrap;">${body}</div>
            <hr style="border:none;border-top:1px solid #1a2540;margin:24px 0 12px 0;">
            <p style="color:#64748b;font-size:11px;text-align:right;font-family:Tajawal,sans-serif;margin:0;">
              فريق مرفأ — حيث تَرسو الطموحات
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  // 1. Verify super admin via session cookie
  const supabaseServer = await createServerClient();
  const { data: { session } } = await supabaseServer.auth.getSession();

  if (!session || session.user.email !== 'mohamedy2003@gmail.com') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  // 2. Parse request body
  let reqBody: { title: string; body: string; audience: string; sendInApp: boolean; sendEmail: boolean };
  try {
    reqBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }

  const { title, body, audience, sendInApp, sendEmail } = reqBody;
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'العنوان والنص مطلوبان' }, { status: 400 });
  }

  // 3. Fetch target profiles using service_role
  const supabaseAdmin = createServiceClient();

  let profilesQuery = supabaseAdmin.from('profiles').select('id,email,full_name');
  if (audience === 'investor') profilesQuery = profilesQuery.eq('role', 'investor');
  else if (audience === 'entrepreneur') profilesQuery = profilesQuery.eq('role', 'entrepreneur');

  const { data: profiles, error: profilesError } = await profilesQuery;
  if (profilesError || !profiles) {
    return NextResponse.json({ error: 'فشل في جلب المستخدمين' }, { status: 500 });
  }

  const recipientCount = profiles.length;
  let inAppSent = 0;
  let emailSent = 0;
  let emailFailed = 0;

  // 4. In-app notifications (bulk insert in chunks of 100)
  if (sendInApp && recipientCount > 0) {
    const rows = profiles.map((p) => ({
      user_id: p.id,
      message: title.trim(),
      is_read: false,
    }));

    for (let i = 0; i < rows.length; i += 100) {
      const chunk = rows.slice(i, i + 100);
      const { error } = await supabaseAdmin.from('notifications').insert(chunk);
      if (error) {
        console.error('[broadcast] notifications insert failed:', error.message);
      } else {
        inAppSent += chunk.length;
      }
    }
  }

  // 5. Resend emails
  if (sendEmail && recipientCount > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailTasks = profiles.map((p) =>
      resend.emails
        .send({
          from: 'مرفأ <noreply@marfa.sa>',
          to: p.email,
          subject: title.trim(),
          html: buildEmailHTML(p.full_name || 'مستخدم', title.trim(), body.trim()),
        })
        .then((result) => {
          if (result.error) emailFailed++;
          else emailSent++;
        })
        .catch(() => {
          emailFailed++;
        })
    );

    await Promise.allSettled(emailTasks);
  }

  // 6. Save broadcast record
  await supabaseAdmin.from('broadcasts').insert({
    sent_by: session.user.id,
    title: title.trim(),
    body: body.trim(),
    audience,
    sent_in_app: sendInApp,
    sent_email: sendEmail,
    recipient_count: recipientCount,
  });

  // 7. Return
  return NextResponse.json({
    success: true,
    recipientCount,
    inAppSent,
    emailSent,
    emailFailed,
  });
}
