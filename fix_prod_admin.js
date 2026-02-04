const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tkokgarmxcgvsedtgben.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrb2tnYXJteGNndnNlZHRnYmVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg1NTU2NywiZXhwIjoyMDg1NDMxNTY3fQ.0yxz8dFL3J1AwjOWTIhZ2QLtAF_aZEJ3wbVQAksqCkM';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixOriginalAdmin() {
    console.log('Attempting to fix op.younis@gmail.com on PRODUCTION...');

    // 1. Find the user first to get ID
    // Note: listUsers is the only way to search by email in admin API generically
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

    // 2. Update the user
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
            password: '12345678',
            email_confirm: true,
            user_metadata: { email_verified: true, phone_verified: false }
        }
    );

    if (updateError) {
        console.error('Error updating user:', updateError);
    } else {
        console.log('User password updated and email confirmed successfully.');

        // 3. Ensure "admin" role in profiles
        await ensureAdminProfile(user.id);
    }
}

async function ensureAdminProfile(userId) {
    console.log(`Checking/Updating profile for ${userId}...`);

    // Check current profile
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        // If profile missing, we might need to insert it, but let's be careful about triggers
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
