const { createClient } = require('@supabase/supabase-js');

// Config from .env.local (gxrpgjbvbueqaqculndl)
const supabaseUrl = 'https://gxrpgjbvbueqaqculndl.supabase.co';
// ANON KEY
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cnBnamJ2YnVlcWFxY3VsbmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTIyMzIsImV4cCI6MjA4MDc4ODIzMn0.jtiSfJP6QOWD4eQ7b6H2tvONhkhv7SYhf_xO07FoNa0';

const supabase = createClient(supabaseUrl, supabaseKey);

const action = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];

if (!action || !email) {
    console.error('Usage: node scripts/test_helper.js <login> <email> <password>');
    process.exit(1);
}

async function main() {
    if (action === 'login') {
        console.log(`Attempting login for ${email}...`);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password || 'Password123!'
        });

        if (error) {
            console.error('Login Error:', error.message);
            // Check for profile status manually if possible (public table?)
            // But usually the client app does that after login.
            // If we are pending, Supabase Auth itself usually lets us in, but the APP blocks us.
            // Wait, does Supabase Auth block pending users? 
            // The app logic says: "If investorProfile?.approval_status === 'pending' ... Sign out immediately".

            // So if `signInWithPassword` SUCCEEDS, it means we are authenticated. 
            // Then we must check the profiles table to see if we WOULD be blocked.

        } else {
            console.log('Login Successful (Auth Level). User ID:', data.user.id);

            // Now check profile status
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
