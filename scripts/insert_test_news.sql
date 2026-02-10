-- Quick Test: Insert Sample News
-- Run this in Supabase SQL Editor to test the news ticker

-- Insert 5 test news items
INSERT INTO public.news_feed (source, text, link) VALUES
('local', 'تاسي يحقق مكاسب قوية بنسبة 2.3% مدعوماً بارتفاع أسهم القطاع المالي والطاقة في تعاملات اليوم', 'https://argaam.com'),
('global', 'ما هو التمويل الجماعي (Crowdfunding)؟ دليل شامل للمستثمرين ورواد الأعمال', 'https://investopedia.com'),
('hail', 'إطلاق برنامج دعم جديد للمشاريع الناشئة في منطقة حائل بقيمة 50 مليون ريال سعودي', '#'),
('local', 'هيئة السوق المالية تعلن تسهيلات جديدة للشركات الناشئة الراغبة في الإدراج بالسوق', 'https://cma.org.sa'),
('global', 'ارتفاع الاستثمارات الأجنبية المباشرة في قطاع التقنية السعودي بنسبة 45% خلال عام 2025', 'https://bloomberg.com');

-- Check if inserted successfully
SELECT COUNT(*) as total_news FROM public.news_feed;
SELECT * FROM public.news_feed ORDER BY created_at DESC LIMIT 10;
