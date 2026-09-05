import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 verification attempts per 15 minutes per IP
    const ip = getClientIP(req);
    const limit = rateLimit(ip, { maxRequests: 5, windowMs: 15 * 60 * 1000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'محاولات كثيرة جداً. يرجى الانتظار قليلاً والمحاولة مرة أخرى.' },
        { status: 429 }
      );
    }

    const { email, code, full_name, user_type, phone, commercial_register } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني ورمز التحقق مطلوبان' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify the code
    const { data: codes, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (codeError || !codes || codes.length === 0) {
      return NextResponse.json(
        { error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }

    // 2. Mark code as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', codes[0].id);

    // 3. Check if user exists via profiles table (efficient indexed lookup)
    let userId: string;
    let isNewUser = false;

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      // Create new passwordless user
      const tempPassword = crypto.randomUUID() + crypto.randomUUID();
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: full_name || '',
          user_type: user_type || 'entrepreneur',
          role: user_type || 'entrepreneur',
          phone: phone || '',
          ...(commercial_register ? { commercial_register } : {}),
        },
      });

      if (createError || !newUser.user) {
        console.error('Failed to create user:', createError);
        return NextResponse.json(
          { error: 'فشل في إنشاء الحساب' },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
      isNewUser = true;
    }

    // 4. Set password to a known value so we can sign in
    const sessionPassword = crypto.randomUUID();
    await supabase.auth.admin.updateUserById(userId, { password: sessionPassword });

    // 5. Sign in to get a session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: sessionPassword,
    });

    if (signInError || !signInData.session) {
      console.error('Failed to create session:', signInError);
      return NextResponse.json(
        { error: 'فشل في إنشاء الجلسة' },
        { status: 500 }
      );
    }

    // 6. Auto-subscribe + send welcome notification (fire-and-forget — don't delay OTP)
    Promise.resolve(
      supabase
        .from('meeting_subscribers')
        .upsert({ email: normalizedEmail, source: 'login', last_login_at: new Date().toISOString() }, { onConflict: 'email' })
        .select()
        .maybeSingle()
    ).then(() => {
      // After subscribing, trigger notification for this email (fire-and-forget)
      const cronToken = process.env.CRON_SECRET ? `&token=${encodeURIComponent(process.env.CRON_SECRET)}` : '';
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marfa.sa'}/api/cron/weekly-meeting-notification?email=${encodeURIComponent(normalizedEmail)}&welcome=1${cronToken}`)
        .catch(() => {});
    }).catch(() => {}); // silent fail — don't block auth

    // Fire-and-forget welcome email via Resend
    if (isNewUser) {
      Promise.resolve().then(async () => {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'مرفأ <noreply@marfa.sa>',
            to: normalizedEmail,
            subject: '🚀 مرحباً بك في مرفأ — حيث تَرسو الطموحات',
            html: `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:560px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">

<div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
  <h1 style="color:#c9a84c;font-size:22px;margin:0 0 6px 0">🚀 مرحباً بك في مرفأ</h1>
  <p style="color:#a0aec0;font-size:13px;margin:0">حيث تَرسو الطموحات</p>
</div>

<div style="padding:28px 24px">

  <p style="color:#4a5b78;font-size:15px;line-height:1.9;margin:0 0 20px 0;text-align:center">
    تم تسجيلك بنجاح! هذه أبرز ما يمكنك فعله الآن:
  </p>

  <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
    <a href="https://www.marfa.sa/advisor" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">🧠 Marfa 360° — حلّل فكرتك</span>
      <span style="font-size:12px;color:#64748b">مستشار استراتيجي يحلل فكرة مشروعك من 6 زوايا خلال دقائق</span>
    </a>
    <a href="https://www.marfa.sa/meetings" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">🏛️ المجلس الاستشاري</span>
      <span style="font-size:12px;color:#64748b">١٤ لقاء تدريبي — كل جمعة — مع تقييم شهري من مستشارين معتمدين</span>
    </a>
    <a href="https://www.marfa.sa/learn/glossary" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">📚 قاموس المصطلحات التجارية</span>
      <span style="font-size:12px;color:#64748b">٣٠٠ مصطلح ثنائي اللغة — ومصطلح الأسبوع على إيميلك كل اثنين</span>
    </a>
    <a href="https://www.marfa.sa/jobs" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">💼 فرص وظيفية</span>
      <span style="font-size:12px;color:#64748b">وظائف محدّثة من كبرى المنصات في السعودية</span>
    </a>
  </div>

  <div style="text-align:center">
    <a href="https://www.marfa.sa/dashboard/hub" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#d4a843);color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">🚢 ادخل إلى مرساك</a>
  </div>

  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #c9a84c33;text-align:center">
    <p style="color:#64748b;font-size:10px;margin:0">مرفأ — منصة تدريب رواد الأعمال | حائل 🇸🇦</p>
  </div>

</div></div></body></html>`,
          });
        } catch {} // silent fail — don't block auth
      });
    }

    return NextResponse.json({
      success: true,
      is_new_user: isNewUser,
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    });
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
