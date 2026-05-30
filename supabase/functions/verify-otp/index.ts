import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, code, full_name, user_type } = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'البريد الإلكتروني ورمز التحقق مطلوبان' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
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
      return new Response(
        JSON.stringify({ error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Mark code as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', codes[0].id);

    // 3. Check if user exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Failed to list users:', listError);
      return new Response(
        JSON.stringify({ error: 'فشل في التحقق من المستخدم' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const existingUser = existingUsers.users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user via Admin API (no password — passwordless)
      const password = crypto.randomUUID() + crypto.randomUUID(); // random secure password
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: full_name || '',
          user_type: user_type || 'entrepreneur',
          role: user_type || 'entrepreneur',
        },
      });

      if (createError || !newUser.user) {
        console.error('Failed to create user:', createError);
        return new Response(
          JSON.stringify({ error: 'فشل في إنشاء الحساب' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = newUser.user.id;
      isNewUser = true;
    }

    // 4. Generate a session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
    });

    // Fallback: generate access token directly if magic link fails
    // We create a sign-in by generating a session token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: 'temporary-placeholder',
    });

    // If sign-in fails (user was just created with random password), update password and try again
    if (signInError && existingUser) {
      // For existing users, generate a nonce-based session
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: normalizedEmail,
      });

      if (linkError || !linkData) {
        console.error('Failed to generate session:', linkError);
        return new Response(
          JSON.stringify({ error: 'فشل في إنشاء جلسة. يرجى المحاولة مرة أخرى.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          is_new_user: false,
          user_id: userId,
          access_token: linkData.properties?.access_token || '',
          refresh_token: linkData.properties?.refresh_token || '',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (signInError || !signInData.session) {
      // For new users, update their password to a known one so they can sign in client-side
      const tempPassword = crypto.randomUUID();
      await supabase.auth.admin.updateUserById(userId, { password: tempPassword });

      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: tempPassword,
      });

      if (retryError || !retryData.session) {
        console.error('Failed to sign in new user:', retryError);
        return new Response(
          JSON.stringify({ error: 'فشل في إنشاء الجلسة' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          is_new_user: true,
          user_id: userId,
          access_token: retryData.session.access_token,
          refresh_token: retryData.session.refresh_token,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        is_new_user: isNewUser,
        user_id: userId,
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('verify-otp error:', err);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
