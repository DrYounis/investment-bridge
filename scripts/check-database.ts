import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndApplyMigration() {
    console.log('🔍 Checking database tables...\n');

    // Check if tables exist
    const { data: newsData, error: newsError } = await supabase
        .from('news_feed')
        .select('id')
        .limit(1);

    const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('id')
        .limit(1);

    const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('id')
        .limit(1);

    console.log('📊 Table Status:');
    console.log(`  news_feed: ${newsError ? '❌ Missing' : '✅ Exists'}`);
    console.log(`  meetings: ${meetingsError ? '❌ Missing' : '✅ Exists'}`);
    console.log(`  announcements: ${announcementsError ? '❌ Missing' : '✅ Exists'}`);

    if (!newsError && !meetingsError && !announcementsError) {
        console.log('\n✅ All tables exist! Migration already applied.');

        // Check row counts
        const { count: newsCount } = await supabase.from('news_feed').select('*', { count: 'exact', head: true });
        const { count: meetingsCount } = await supabase.from('meetings').select('*', { count: 'exact', head: true });
        const { count: announcementsCount } = await supabase.from('announcements').select('*', { count: 'exact', head: true });

        console.log('\n📈 Current Data:');
        console.log(`  news_feed: ${newsCount} rows`);
        console.log(`  meetings: ${meetingsCount} rows`);
        console.log(`  announcements: ${announcementsCount} rows`);

        return { tablesExist: true, newsCount, meetingsCount, announcementsCount };
    } else {
        console.log('\n⚠️ Some tables are missing. Migration needs to be applied.');
        console.log('Please apply migration: supabase/migrations/20260206154500_realtime_tables.sql');
        return { tablesExist: false };
    }
}

checkAndApplyMigration()
    .then(result => {
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
