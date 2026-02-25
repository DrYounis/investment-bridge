const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load env vars from .env.local
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                process.env[match[1]] = match[2].trim();
            }
        });
    }
} catch (e) {
    console.warn('Could not load .env.local', e);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tkokgarmxcgvsedtgben.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANON_KEY || !SERVICE_KEY) {
    console.error('Missing keys. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

async function runTests() {
    console.log('🔒 Starting Security Verification...');
    let failures = 0;

    // --- Test 1: Public Write Access (Announcements) ---
    console.log('\n--- Test 1: Public Write Access (Announcements) ---');
    const { error: anonInsertError } = await supabaseAnon
        .from('announcements')
        .insert({ title: 'Hacked', content: 'Public Insert' });

    if (anonInsertError) {
        console.log('✅ PASS: Anon user blocked from inserting announcements.');
        console.log('   Error:', anonInsertError.message);
    } else {
        console.error('❌ FAIL: Anon user WAS ABLE to insert announcements!');
        failures++;
    }

    // Setup Test User
    const testEmail = `security_test_${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    let userId;

    try {
        const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true
        });
        if (createError) throw createError;
        userId = user.user.id;
        console.log(`\nCreated test user: ${testEmail} (${userId})`);

        // Sign in to get tokens
        const { data: session, error: loginError } = await supabaseAnon.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
        });
        if (loginError) throw loginError;

        const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
            global: { headers: { Authorization: `Bearer ${session.session.access_token}` } }
        });

        // --- Test 2: Privilege Escalation (Profiles) ---
        console.log('\n--- Test 2: Privilege Escalation (Profiles) ---');
        const { error: roleUpdateError } = await supabaseUser
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);

        if (roleUpdateError) {
            console.log('✅ PASS: User blocked from updating their own role.');
            console.log('   Error:', roleUpdateError.message);
        } else {
            // Check if it actually changed
            const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', userId).single();
            if (profile.role === 'admin') {
                console.error('❌ FAIL: User SUCCESSFULLY changed role to admin!');
                failures++;
            } else {
                console.error('⚠️ WARN: Update returned no error, but role did not change? (RLS might have silently ignored)');
                console.log('   Current Role:', profile.role);
                // This is also a pass effectively, but explicit error is better.
            }
        }

        // --- Test 3: Opportunity Publishing (Business Logic) ---
        console.log('\n--- Test 3: Opportunity Publishing ---');

        // Set user as entrepreneur (using admin)
        await supabaseAdmin.from('profiles').update({ role: 'entrepreneur', user_type: 'entrepreneur' }).eq('id', userId);

        // Try to create PUBLISHED opportunity
        const { error: createPubError } = await supabaseUser.from('investment_opportunities').insert({
            entrepreneur_id: userId,
            title: 'Illegal Publish',
            status: 'published'
        });

        if (createPubError) {
            console.log('✅ PASS: User blocked from creating published opportunity.');
            console.log('   Error:', createPubError.message);
        } else {
            console.error('❌ FAIL: User CREATED a published opportunity!');
            failures++;
        }

        // Create DRAFT (should succeed)
        const { data: draftOpp, error: createDraftError } = await supabaseUser.from('investment_opportunities').insert({
            entrepreneur_id: userId,
            title: 'Valid Draft',
            status: 'draft'
        }).select().single();

        if (createDraftError) {
            console.error('❌ FAIL: User could not create draft (Prerequisite for update test failed).');
            console.error(createDraftError);
        } else {
            console.log('   (User created draft successfully)');

            // Try to UPDATE to PUBLISHED
            const { error: updatePubError } = await supabaseUser
                .from('investment_opportunities')
                .update({ status: 'published' })
                .eq('id', draftOpp.id);

            if (updatePubError) {
                console.log('✅ PASS: User blocked from updating status to published.');
                console.log('   Error:', updatePubError.message);
            } else {
                console.error('❌ FAIL: User UPDATED status to published!');
                failures++;
            }
        }

    } catch (err) {
        console.error('Unexpected error during testing:', err);
        failures++;
    } finally {
        // Cleanup
        if (userId) {
            console.log('\nCleaning up test user...');
            await supabaseAdmin.auth.admin.deleteUser(userId);
        }
    }

    if (failures === 0) {
        console.log('\n✅ ALL SECURITY VERIFICATIONS PASSED');
        process.exit(0);
    } else {
        console.error(`\n❌ ${failures} VERIFICATIONS FAILED`);
        process.exit(1);
    }
}

runTests();
