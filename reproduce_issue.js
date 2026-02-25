require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function reproduceIssue() {
    console.log('Attempting to sign up investor...');
    const email = `repro-${Date.now()}@example.com`;
    const password = 'Password123!';

    // Metadata matching the form
    const metadata = {
        full_name: 'Repro Investor',
        user_type: 'investor',
        role: 'investor',
        phone: '05' + Math.floor(10000000 + Math.random() * 90000000), // Random phone
        commercial_register: '700' + Math.floor(1000000 + Math.random() * 9000000), // Random CR
        experience_level: 'beginner',
        investment_amount: '100k-500k',
        risk_tolerance: 'medium',
        investment_duration: '1-3_years',
        preferred_sectors: ['tech', 'real_estate'],
        expected_return: '10-15%'
    };


    console.log('Using URL:', supabaseUrl);
    console.log('Using Key:', supabaseKey.substring(0, 10) + '...');

    // 1. Check Data API connectivity
    console.log('Checking Data API...');
    const { data: tableData, error: tableError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (tableError) {
        console.error('❌ Data API Error:', tableError);
    } else {
        console.log('✅ Data API connected. Profiles count:', tableData);
    }

    // 2. Attempt Signup
    console.log('Attempting to sign up investor...');
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    });

    if (error) {
        console.error('❌ Error creating user:', error);
        console.error('Error Message:', error.message);
    } else {
        console.log('✅ User created:', data.user?.id);
    }
}

reproduceIssue();
