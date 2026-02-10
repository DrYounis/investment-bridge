// Test News Insertion Script
// This script inserts sample news into Supabase to test the real-time ticker

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const SUPABASE_URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const SERVICE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();

// Sample news items (using only required fields)
const testNews = [
    {
        source: 'local',
        text: 'تاسي يحقق مكاسب قوية بنسبة 2.3% مدعوماً بارتفاع أسهم القطاع المالي والطاقة في تعاملات اليوم',
        link: 'https://argaam.com'
    },
    {
        source: 'global',
        text: 'ما هو التمويل الجماعي (Crowdfunding)؟ دليل شامل للمستثمرين ورواد الأعمال',
        link: 'https://investopedia.com'
    },
    {
        source: 'hail',
        text: 'إطلاق برنامج دعم جديد للمشاريع الناشئة في منطقة حائل بقيمة 50 مليون ريال سعودي',
        link: '#'
    },
    {
        source: 'local',
        text: 'هيئة السوق المالية تعلن تسهيلات جديدة للشركات الناشئة الراغبة في الإدراج بالسوق',
        link: 'https://cma.org.sa'
    },
    {
        source: 'global',
        text: 'ارتفاع الاستثمارات الأجنبية المباشرة في قطاع التقنية السعودي بنسبة 45% خلال عام 2025',
        link: 'https://bloomberg.com'
    }
];

// Function to insert news
function insertNews() {
    const url = new URL(`${SUPABASE_URL}/rest/v1/news_feed`);

    const postData = JSON.stringify(testNews);

    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Length': Buffer.byteLength(postData),
            'Prefer': 'return=minimal'
        }
    };

    console.log('🚀 Inserting test news into Supabase...\n');

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 201 || res.statusCode === 200) {
                console.log('✅ SUCCESS! Test news inserted into Supabase\n');
                console.log(`✓ Inserted ${testNews.length} news items:`);
                testNews.forEach((item, i) => {
                    console.log(`  ${i + 1}. [${item.source}] ${item.text.substring(0, 70)}...`);
                });
                console.log('\n🎯 Check your website ticker - news should appear automatically!');
                console.log('   Visit: http://localhost:3000\n');
            } else {
                console.error('❌ Error:', res.statusCode);
                console.error('Response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request failed:', error.message);
    });

    req.write(postData);
    req.end();
}

// Run the insertion
insertNews();
