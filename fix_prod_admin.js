const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load env vars from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Set them in .env.local at the project root.'
    );
  }
  return createClient(url, key);
}

async function fixOriginalAdmin() {
  const supabase = getServiceClient();
  console.log('Attempting to fix op.younis@gmail.com on PRODUCTION...');

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = listData.users.find(u => u.email === 'op.younis@gmail.com');

  if (!user) {
    console.error('User op.younis@gmail.com NOT FOUND in production auth.users!');
    return;
  }

  console.log(`Found user ${user.id}. Updating password and confirming email...`);

  const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      password: '12345678',
      email_confirm: true,
      user_metadata: { email_verified: true, phone_verified: false },
    }
  );

  if (updateError) {
    console.error('Error updating user:', updateError);
  } else {
    console.log('User password updated and email confirmed successfully.');
    await ensureAdminProfile(supabase, user.id);
  }
}

async function ensureAdminProfile(supabase, userId) {
  console.log(`Checking/Updating profile for ${userId}...`);

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching profile:', fetchError);
  } else {
    console.log('Current profile user_type:', profile.user_type);
    if (profile.user_type !== 'admin') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_type: 'admin' })
        .eq('id', userId);

      if (updateError) console.error('Error updating profile to admin:', updateError);
      else console.log('Profile updated to admin.');
    } else {
      console.log('Profile is already admin.');
    }
  }
}

fixOriginalAdmin();
