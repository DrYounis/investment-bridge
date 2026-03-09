const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use environment variables for credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp() {
  const email = process.env.TEST_ENTREPRENEUR_EMAIL || 'test.entrepreneur@gmail.com';
  const password = process.env.TEST_ENTREPRENEUR_PASSWORD;
  const fullName = process.env.TEST_ENTREPRENEUR_NAME || 'Test Entrepreneur';
  const phone = process.env.TEST_ENTREPRENEUR_PHONE || '0588888888';
  const sector = process.env.TEST_ENTREPRENEUR_SECTOR || 'Technology';

  if (!password) {
    console.error('Error: TEST_ENTREPRENEUR_PASSWORD not set in environment');
    console.log('Usage: TEST_ENTREPRENEUR_PASSWORD=your_secure_password node create_test_entrepreneur.js');
    process.exit(1);
  }

  console.log('Attempting to sign up entrepreneur:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: 'entrepreneur',
        phone,
        sector
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('✓ User created:', data.user?.email);
  }
}

signUp();
