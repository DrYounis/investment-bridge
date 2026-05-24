-- ============================================================
-- Clean existing articles: strip ALL Argaam/أرقام references
-- ============================================================
-- Run this in the Supabase SQL Editor for the production project:
-- https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new
-- ============================================================

-- Step 1: Replace Argaam brand references in all text fields
UPDATE financial_news_articles
SET
  title          = REGEXP_REPLACE(title,          'أرقام|أرقـام|argaam|Argaam', 'marfa.sa', 'gi'),
  original_title = REGEXP_REPLACE(original_title, 'أرقام|أرقـام|argaam|Argaam', 'marfa.sa', 'gi'),
  summary        = REGEXP_REPLACE(summary,        'أرقام|أرقـام|argaam|Argaam', 'marfa.sa', 'gi'),
  full_content   = REGEXP_REPLACE(full_content,   'أرقام|أرقـام|argaam|Argaam', 'marfa.sa', 'gi');

-- Step 2: Strip source attribution patterns (after Argaam→marfa.sa replacement)
UPDATE financial_news_articles
SET
  summary        = REGEXP_REPLACE(summary,        'marfa\.sa\s*[-–—]\s*خاص', '', 'gi'),
  full_content   = REGEXP_REPLACE(full_content,   'marfa\.sa\s*[-–—]\s*خاص', '', 'gi'),
  original_title = REGEXP_REPLACE(original_title, 'marfa\.sa\s*[-–—]\s*خاص', '', 'gi');

-- Step 3: Strip "محللون لـ marfa.sa" patterns
UPDATE financial_news_articles
SET
  summary      = REGEXP_REPLACE(summary,      'محللون لـ marfa\.sa\s*[:\-]?\s*', '', 'gi'),
  full_content = REGEXP_REPLACE(full_content, 'محللون لـ marfa\.sa\s*[:\-]?\s*', '', 'gi');

-- Step 4: Strip leaked Claude prompt artifacts from titles (nested to avoid multi-assignment error)
UPDATE financial_news_articles
SET
  title = REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(title, '\*\*العنوان المحسّن[：:]\s*\*\*\s*', '', 'g'),
              '^العنوان المحسّن[：:]\s*', '', 'g'
            ),
            '^تحليل العنوان[：:]\s*', '', 'g'
          );

-- Step 5: Strip leaked Claude prompt artifacts from summaries (nested)
UPDATE financial_news_articles
SET
  summary = REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  REGEXP_REPLACE(
                    REGEXP_REPLACE(
                      REGEXP_REPLACE(
                        REGEXP_REPLACE(summary, '\*\*العنوان المحسّن[：:]\s*\*\*[^.]*\.', '', 'g'),
                        '\*\*تحليل العنوان[：:]\s*\*\*[^.]*\.', '', 'g'
                      ),
                      '- عدد الأحرف[：:][^\n]*', '', 'g'
                    ),
                    '- يتضمن الكلمة المفتاحية[^\n]*', '', 'g'
                  ),
                  '- الكلمة المفتاحية المستخدمة[：:][^\n]*', '', 'g'
                ),
                '- يحافظ على[^\n]*', '', 'g'
              ),
              '- مزايا هذا العنوان[：:][^\n]*', '', 'g'
            );

-- Step 6: Strip "شاشة تداول السوق السعودي ترصد" patterns
UPDATE financial_news_articles
SET
  full_content = REGEXP_REPLACE(full_content, 'شاشة تداول السوق السعودي ترصد [""«][^""»]+[""»]\s*', '', 'g');

-- Step 7: Clean up empty fields
UPDATE financial_news_articles
SET summary = 'تحليل مالي من marfa.sa'
WHERE summary IS NULL OR TRIM(summary) = '';

UPDATE financial_news_articles
SET title = 'تحليل مالي من marfa.sa'
WHERE title IS NULL OR TRIM(title) = '';

-- Step 8: Verify — count remaining Argaam references
SELECT 'title' AS field, COUNT(*) AS remaining FROM financial_news_articles WHERE title ~* 'أرقام|argaam'
UNION ALL
SELECT 'original_title', COUNT(*) FROM financial_news_articles WHERE original_title ~* 'أرقام|argaam'
UNION ALL
SELECT 'summary', COUNT(*) FROM financial_news_articles WHERE summary ~* 'أرقام|argaam'
UNION ALL
SELECT 'full_content', COUNT(*) FROM financial_news_articles WHERE full_content ~* 'أرقام|argaam';
