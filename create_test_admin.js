const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gxrpgjbvbueqaqculndl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cnBnamJ2YnVlcWFxY3VsbmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTIyMzIsImV4cCI6MjA4MDc4ODIzMn0.jtiSfJP6QOWD4eQ7b6H2tvONhkhv7SYhf_xO07FoNa0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp() {
    const { data, error } = await supabase.auth.signUp({
        email: 'admin.test@gmail.com',
        password: '12345678',
    });

    if (error) {
        console.error('Error creating user:', error);
    } else {
        console.log('User created:', JSON.stringify(data, null, 2));
    }
}

signUp();
