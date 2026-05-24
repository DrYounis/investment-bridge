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

async function insertProfile() {
  const supabase = getServiceClient();
  const userId = '67d6abf5-05df-44bd-95e7-c44f6fbcbe34';
  console.log(`Inserting profile for user ${userId}...`);

  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      email: 'op.younis@gmail.com',
      user_type: 'admin',
      created_at: new Date().toISOString(),
    }])
    .select();

  if (error) {
    console.error('Error inserting profile:', error);
  } else {
    console.log('Profile inserted successfully:', data);
  }
}

insertProfile();
