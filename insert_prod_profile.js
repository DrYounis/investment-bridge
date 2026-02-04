const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tkokgarmxcgvsedtgben.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrb2tnYXJteGNndnNlZHRnYmVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg1NTU2NywiZXhwIjoyMDg1NDMxNTY3fQ.0yxz8dFL3J1AwjOWTIhZ2QLtAF_aZEJ3wbVQAksqCkM';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertProfile() {
    const userId = '67d6abf5-05df-44bd-95e7-c44f6fbcbe34'; // From previous log
    console.log(`Inserting profile for user ${userId}...`);

    const { data, error } = await supabase
        .from('profiles')
        .insert([
            {
                id: userId,
                email: 'op.younis@gmail.com',
                user_type: 'admin',
                created_at: new Date().toISOString()
            }
        ])
        .select();

    if (error) {
        console.error('Error inserting profile:', error);
    } else {
        console.log('Profile inserted successfully:', data);
    }
}

insertProfile();
