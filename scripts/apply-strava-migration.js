/**
 * Apply Strava Connections Migration
 * 
 * This script applies the strava_connections table migration to your Supabase database.
 * Run this with: node scripts/apply-strava-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyMigration() {
    console.log('📦 Applying Strava connections migration...\n');

    try {
        // Create table
        console.log('Creating strava_connections table...');
        const { error: tableError } = await supabase.rpc('exec_sql', {
            query: `
                CREATE TABLE IF NOT EXISTS public.strava_connections (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                    athlete_id BIGINT NOT NULL,
                    access_token TEXT NOT NULL,
                    refresh_token TEXT NOT NULL,
                    expires_at BIGINT NOT NULL,
                    athlete_name TEXT,
                    athlete_profile_url TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    UNIQUE(user_id),
                    UNIQUE(athlete_id)
                );
            `
        });

        if (tableError) throw tableError;
        console.log('✅ Table created');

        // Enable RLS
        console.log('Enabling Row Level Security...');
        const { error: rlsError } = await supabase.rpc('exec_sql', {
            query: 'ALTER TABLE public.strava_connections ENABLE ROW LEVEL SECURITY;'
        });

        if (rlsError) throw rlsError;
        console.log('✅ RLS enabled');

        console.log('\n✨ Migration applied successfully!');
        console.log('\n📝 Next step: Get your Strava API credentials from https://www.strava.com/settings/api');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n💡 Please apply the migration manually via Supabase Dashboard:');
        console.log('   1. Go to: https://supabase.com/dashboard');
        console.log('   2. Select your project');
        console.log('   3. Go to SQL Editor');
        console.log('   4. Copy the SQL from: supabase/migrations/20260211000000_create_strava_connections.sql');
        console.log('   5. Paste and run it');
        process.exit(1);
    }
}

applyMigration();
