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

    // 6. Auto-subscribe to weekly meeting notifications (fire-and-forget — don't delay OTP)
    supabase
      .from('meeting_subscribers')
      .upsert({ email: normalizedEmail, source: 'login', last_login_at: new Date().toISOString() }, { onConflict: 'email' })
      .select()
      .maybeSingle()
      .catch(() => {}); // silent fail — don't block auth

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
