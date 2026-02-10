import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as fs from 'fs';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Using key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE ✅' : 'ANON ⚠️');

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
    console.log('🌱 Seeding database with sample data...\n');

    // Check current counts
    const { count: meetingsCount } = await supabase.from('meetings').select('*', { count: 'exact', head: true });
    const { count: announcementsCount } = await supabase.from('announcements').select('*', { count: 'exact', head: true });

    console.log('📊 Current counts:');
    console.log(`  Meetings: ${meetingsCount}`);
    console.log(`  Announcements: ${announcementsCount}\n`);

    // Seed meetings if empty
    if (meetingsCount === 0) {
        console.log('📅 Adding sample meetings...');
        const { error: meetingsError } = await supabase.from('meetings').insert([
            {
                title: 'اجتماع مع فريق مشروع مدينة الغد',
                description: 'مناقشة خطة العمل للربع القادم وتحديد المعالم الرئيسية',
                scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'scheduled',
                meeting_link: 'https://meet.google.com/xyz'
            },
            {
                title: 'عرض تقديمي لمشروع تطوير البنية التحتية',
                description: 'استعراض المشروع أمام المستثمرين المحتملين',
                scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'scheduled',
                meeting_link: 'https://zoom.us/j/123456'
            },
            {
                title: 'مراجعة ربع سنوية - مشروع تصنيع الأغذية',
                description: 'تقييم الأداء المالي والتشغيلي',
                scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'scheduled',
                meeting_link: null
            },
            {
                title: 'لقاء تواصل مع رواد الأعمال',
                description: 'جلسة networking مع مؤسسي الشركات الناشئة في حائل',
                scheduled_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'scheduled',
                meeting_link: 'https://teams.microsoft.com/abc'
            }
        ]);

        if (meetingsError) {
            console.error('❌ Error adding meetings:', meetingsError.message);
        } else {
            console.log('✅ Successfully added 4 meetings');
        }
    } else {
        console.log('⏭️  Skipping meetings (already have data)');
    }

    // Seed announcements if empty
    if (announcementsCount === 0) {
        console.log('📢 Adding sample announcements...');
        const { error: announcementsError } = await supabase.from('announcements').insert([
            {
                title: '🎓 دورة تدريبية جديدة: أساسيات الاستثمار الجريء',
                content: 'انضم إلينا في دورة مكثفة لمدة 3 أيام حول رأس المال الجريء وتقييم المشاريع. التسجيل مفتوح حتى نهاية الأسبوع.',
                type: 'academy',
                target_role: 'all',
                starts_at: new Date().toISOString(),
                ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                title: '📊 تقرير السوق الأسبوعي متاح الآن',
                content: 'يمكنك الآن الاطلاع على تحليل السوق الأسبوعي الذي يغطي أبرز الفرص الاستثمارية في منطقة حائل.',
                type: 'system',
                target_role: 'investor',
                starts_at: new Date().toISOString(),
                ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                title: '🚀 فتح باب التقديم لبرنامج تسريع الأعمال',
                content: 'برنامج تسريع مدته 3 أشهر لمشاريع المرحلة المبكرة. التقديم مفتوح حتى نهاية الشهر.',
                type: 'academy',
                target_role: 'entrepreneur',
                starts_at: new Date().toISOString(),
                ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                title: '⚙️ صيانة مجدولة للنظام',
                content: 'سيكون النظام تحت الصيانة يوم الجمعة من الساعة 2 صباحاً حتى 6 صباحاً. نعتذر عن أي إزعاج.',
                type: 'system',
                target_role: 'all',
                starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                ends_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                title: '💡 نصيحة الأسبوع: تنويع المحفظة الاستثمارية',
                content: 'تعلم كيفية توزيع استثماراتك عبر قطاعات متعددة لتقليل المخاطر وزيادة العوائد المحتملة.',
                type: 'general',
                target_role: 'investor',
                starts_at: new Date().toISOString(),
                ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]);

        if (announcementsError) {
            console.error('❌ Error adding announcements:', announcementsError.message);
        } else {
            console.log('✅ Successfully added 5 announcements');
        }
    } else {
        console.log('⏭️  Skipping announcements (already have data)');
    }

    // Final counts
    const { count: finalMeetingsCount } = await supabase.from('meetings').select('*', { count: 'exact', head: true });
    const { count: finalAnnouncementsCount } = await supabase.from('announcements').select('*', { count: 'exact', head: true });

    console.log('\n✅ Seeding complete!');
    console.log('📊 Final counts:');
    console.log(`  Meetings: ${finalMeetingsCount}`);
    console.log(`  Announcements: ${finalAnnouncementsCount}`);
}

seedData()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
