import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  try {
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
            subject: 'مرحباً بك في مرفأ — حيث تَرسو الطموحات',
            html: `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#0a0f1e;direction:rtl;font-family:Tajawal,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:30px 0"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#0d1628;border-radius:12px;overflow:hidden;border-top:4px solid #c9a84c"><tr><td style="padding:32px 28px;text-align:right"><h2 style="color:#c9a84c;font-size:18px;margin:0 0 8px 0;font-weight:800;font-family:Tajawal,sans-serif">مرحباً بك في مرفأ</h2><p style="color:#ffffff;font-size:15px;line-height:1.7;margin:16px 0 0 0;font-family:Tajawal,sans-serif">تم تسجيلك بنجاح في منصة مرفأ — المساحة التي تتحول فيها الأفكار إلى مشاريع حقيقية.</p><p style="color:#a0aec0;font-size:14px;line-height:1.8;margin-top:12px;font-family:Tajawal,sans-serif">يمكنك الآن:</p><ul style="color:#a0aec0;font-size:14px;line-height:2;font-family:Tajawal,sans-serif;padding-inline-start:20px"><li>الوصول إلى <strong style="color:#c9a84c">مرساك</strong> — لوحة تحكمك الشخصية</li><li>استكمال ملفك الشخصي ورفع عرضك التقديمي</li><li>حضور اللقاءات الأسبوعية (الجمعة ٨ مساءً)</li></ul><div style="text-align:center;margin:28px 0"><a href="https://www.marfa.sa/dashboard/hub" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#d4a843);color:#0a0f1e;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;font-family:Tajawal,sans-serif">🚢 ادخل إلى مرساك</a></div><hr style="border:none;border-top:1px solid #1a2540;margin:24px 0 12px 0"><p style="color:#64748b;font-size:11px;text-align:right;font-family:Tajawal,sans-serif;margin:0">فريق مرفأ — حيث تَرسو الطموحات</p></td></tr></table></td></tr></table></body></html>`,
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
