import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 OTP requests per 5 minutes per IP
    const ip = getClientIP(req);
    const limit = rateLimit(ip, { maxRequests: 3, windowMs: 5 * 60 * 1000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً.' },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    // Validate Resend API key is configured
    if (!process.env.RESEND_API_KEY || String(process.env.RESEND_API_KEY).length < 20) {
      logger.error('RESEND_API_KEY is not configured or is a placeholder');
      return NextResponse.json(
        { error: 'خدمة البريد غير مهيأة. يرجى التواصل مع الدعم الفني.' },
        { status: 500 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = createServiceClient();

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Store code with 10-minute expiry
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email: normalizedEmail,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      logger.error('Failed to store verification code:', insertError);
      return NextResponse.json(
        { error: 'فشل في إرسال الرمز. يرجى المحاولة مرة أخرى.' },
        { status: 500 }
      );
    }

    // Send email via Resend
    const { error: resendError } = await getResend().emails.send({
      from: 'Marfa.sa <noreply@marfs.sa>',
      to: normalizedEmail,
      subject: 'رمز التحقق - منصة مرفأ الاستثمارية',
      html: `
        <div style="font-family: 'Tajawal', sans-serif; direction: rtl; text-align: right; padding: 30px; background: #f8fafc; border-radius: 16px; max-width: 480px; margin: auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0a192f; margin: 0; font-size: 24px;">🔐 رمز التحقق</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 8px;">مرحباً بك في منصة مرفأ الاستثمارية</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #475569; font-size: 14px; margin: 0 0 16px;">رمز التحقق الخاص بك هو:</p>
            <div style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #1e40af; background: #eff6ff; padding: 16px 24px; border-radius: 12px; display: inline-block; direction: ltr;">
              ${code}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">صالح لمدة 10 دقائق</p>
          </div>
          <p style="color: #94a3b8; font-size: 11px; margin-top: 20px; text-align: center;">إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد.</p>
        </div>
      `,
    });

    if (resendError) {
      logger.error('Resend email send failed:', resendError);
      return NextResponse.json(
        { error: 'فشل في إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('send-otp error:', err);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
