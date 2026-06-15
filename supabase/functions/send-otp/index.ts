import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'البريد الإلكتروني مطلوب' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Store code with 10-minute expiry
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email: email.toLowerCase().trim(),
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      console.error('Failed to store verification code:', insertError);
      return new Response(
        JSON.stringify({ error: 'فشل في إرسال الرمز. يرجى المحاولة مرة أخرى.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'Marfa.sa <noreply@marfa.sa>',
      to: email,
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

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('send-otp error:', err);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
