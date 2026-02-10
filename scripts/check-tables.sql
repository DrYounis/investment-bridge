-- Check which tables exist in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('news_feed', 'meetings', 'announcements')
ORDER BY table_name;
