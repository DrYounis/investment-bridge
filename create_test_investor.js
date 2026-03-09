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
  const email = process.env.TEST_INVESTOR_EMAIL || 'repro.investor.test@gmail.com';
  const password = process.env.TEST_INVESTOR_PASSWORD;
  const fullName = process.env.TEST_INVESTOR_NAME || 'Test Investor';
  const phone = process.env.TEST_INVESTOR_PHONE || '0599999999';
  const commercialRegister = process.env.TEST_INVESTOR_CR || '999';

  if (!password) {
    console.error('Error: TEST_INVESTOR_PASSWORD not set in environment');
    console.log('Usage: TEST_INVESTOR_PASSWORD=your_secure_password node create_test_investor.js');
    process.exit(1);
  }

  console.log('Attempting to sign up investor:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: 'investor',
        phone,
        commercial_register: commercialRegister
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
