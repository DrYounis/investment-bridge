const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use environment variables for credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const email = process.env.TEST_ADMIN_EMAIL || 'admin.test@gmail.com';
  const password = process.env.TEST_ADMIN_PASSWORD;

  if (!password) {
    console.error('Error: TEST_ADMIN_PASSWORD not set in environment');
    console.log('Usage: TEST_ADMIN_PASSWORD=your_secure_password node create_test_admin_prod.js');
    process.exit(1);
  }

  console.log('Attempting to create admin user:', email);

  // 1. Create User (auto-confirmed with service role)
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Admin Test' }
  });

  if (userError) {
    console.error('Error creating user:', userError);
    // If user already exists, update password and confirm email
    if (userError.message.includes('already registered')) {
      console.log('User exists, attempting to update password and confirm email...');
      const { data: listData } = await supabase.auth.admin.listUsers();
      const user = listData.users.find(u => u.email === email);
      
      if (user) {
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { password, email_confirm: true }
        );
        if (updateError) {
          console.error('Error updating existing user:', updateError);
        } else {
          console.log('Existing user updated:', updateData.user.email);
          await assignAdminRole(user.id);
        }
      } else {
        console.error('Could not find existing user to update.');
      }
    }
  } else {
    console.log('User created:', userData.user.email);
    await assignAdminRole(userData.user.id);
  }
}

async function assignAdminRole(userId) {
  console.log(`Assigning 'admin' role to user ${userId}...`);

  // Update public.profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ user_type: 'admin', role: 'admin' })
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating profile user_type:', profileError);
  } else {
    console.log('✓ Success: User promoted to admin in public.profiles');
  }
}

createAdminUser();
