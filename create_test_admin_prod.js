const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tkokgarmxcgvsedtgben.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrb2tnYXJteGNndnNlZHRnYmVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg1NTU2NywiZXhwIjoyMDg1NDMxNTY3fQ.0yxz8dFL3J1AwjOWTIhZ2QLtAF_aZEJ3wbVQAksqCkM';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
    console.log('Attempting to create admin.test@gmail.com with Service Role...');

    // 1. Create User (auto-confirmed)
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: 'admin.test@gmail.com',
        password: '12345678',
        email_confirm: true,
        user_metadata: { full_name: 'Admin Test' }
    });

    if (userError) {
        console.error('Error creating user:', userError);
        // If user already exists, we might want to update password/confirm it
        if (userError.message.includes('already registered')) {
            console.log('User exists, attempting to update password and confirm email...');
            // We need the user ID first. We can list users or just try update if we had ID, but list is safer
            const { data: listData } = await supabase.auth.admin.listUsers();
            // Since we can't filter listUsers by email easily without pagination in some versions, 
            // let's just try to find it. Or simpler: just use update with the email if API supports it, 
            // but admin.updateUserById requires ID.
            // Actually, let's find the user.
            const user = listData.users.find(u => u.email === 'admin.test@gmail.com');
            if (user) {
                const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
                    user.id,
                    { password: '12345678', email_confirm: true }
                );
                if (updateError) console.error('Error updating existing user:', updateError);
                else {
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
        .update({ user_type: 'admin' })
        .eq('id', userId);

    if (profileError) {
        console.error('Error updating profile user_type:', profileError);
    } else {
        console.log('Success: User promoted to admin in public.profiles');
    }
}

createAdminUser();
