-- Clean up bogus YouTube URLs that were scraped from page chrome (sidebar widgets etc.)
-- Only keep video_url when the article content is short (< 100 chars, i.e. it IS a video article)

-- 1. Remove the specific recurring bogus video
UPDATE financial_news_articles 
SET video_url = NULL 
WHERE video_url = 'https://www.youtube.com/watch?v=9GFzsaQ2Shc';

-- 2. Remove video_url from any article that has substantial text content
-- (a text article with an embedded video widget is NOT a video article)
UPDATE financial_news_articles 
SET video_url = NULL 
WHERE video_url IS NOT NULL 
  AND video_url != '' 
  AND content IS NOT NULL 
  AND length(content) > 100;

-- Verify
SELECT id, title, video_url, length(content) as content_len
FROM financial_news_articles 
WHERE video_url IS NOT NULL;
