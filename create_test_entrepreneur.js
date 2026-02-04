const { createClient } = require('@supabase/supabase-js');

// Config from .env.local (gxrpgjbvbueqaqculndl)
const supabaseUrl = 'https://gxrpgjbvbueqaqculndl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cnBnamJ2YnVlcWFxY3VsbmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTIyMzIsImV4cCI6MjA4MDc4ODIzMn0.jtiSfJP6QOWD4eQ7b6H2tvONhkhv7SYhf_xO07FoNa0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp() {
    console.log('Attempting to sign up entrepreneur...');
    const { data, error } = await supabase.auth.signUp({
        email: 'test.entrepreneur@gmail.com',
        password: 'Password123!',
        options: {
            data: {
                full_name: 'Test Entrepreneur',
                user_type: 'entrepreneur',
                phone: '0588888888',
                sector: 'Technology'
            }
        }
    });

    if (error) {
        console.error('Error creating user:', error);
    } else {
        console.log('User created:', data);
    }
}

signUp();
