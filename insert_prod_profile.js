const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wxvkzutexitcllyewbnw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dmt6dXRleGl0Y2xseWV3Ym53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU0ODkyNSwiZXhwIjoyMDk1MTI0OTI1fQ.M7JIrOd68G92NBnzRat7rkZycVmIxV-I62sTEBOXB88';
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
