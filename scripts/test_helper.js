const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load env vars from .env.local (project root)
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.\n' +
      'Set them in .env.local at the project root.'
    );
  }
  return createClient(url, key);
}

const action = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];

if (!action || !email) {
  console.error('Usage: node scripts/test_helper.js <login> <email> <password>');
  process.exit(1);
}

async function main() {
  const supabase = getClient();

  if (action === 'login') {
    console.log(`Attempting login for ${email}...`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'Password123!',
    });

    if (error) {
      console.error('Login Error:', error.message);
    } else {
      console.log('Login Successful (Auth Level). User ID:', data.user.id);

      try {
        const { data: profile, error: profileFetchError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        if (profileFetchError) {
          console.error('Error fetching profile:', profileFetchError.message);
          return;
        }

        console.log('Profile Type:', profile.user_type);

        if (profile.user_type === 'investor') {
          const { data: investorProfile, error: invError } = await supabase
            .from('investor_profiles')
            .select('approval_status')
            .eq('profile_id', data.user.id)
            .single();

          if (invError) {
            console.error('Error fetching investor profile:', invError.message);
          } else {
            console.log('Investor Status:', investorProfile.approval_status);
          }
        }
      } catch (err) {
        console.error('Error checking profile:', err);
      }
    }
  } else {
    console.error('Unknown action:', action);
  }
}

main();
