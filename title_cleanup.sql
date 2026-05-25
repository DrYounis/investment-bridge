UPDATE financial_news_articles
SET title = TRIM(REGEXP_REPLACE(
  TRIM(REGEXP_REPLACE(
    TRIM(REGEXP_REPLACE(
      TRIM(REGEXP_REPLACE(
        TRIM(REGEXP_REPLACE(
          TRIM(REGEXP_REPLACE(
            TRIM(REGEXP_REPLACE(
              TRIM(REGEXP_REPLACE(
                TRIM(REGEXP_REPLACE(
                  TRIM(REGEXP_REPLACE(
                    TRIM(REGEXP_REPLACE(title, '\s*---.*$', '', 'g')),
                    '\s*\*\*عدد الأحرف.*$', '', 'g')
                  ),
                  '\s*\*\*الكلمة المفتاحية.*$', '', 'g')
                ),
                '\s*\*\*تحليل العنوان.*$', '', 'g')
              ),
              '\s*\*\*مزايا هذا العنوان.*$', '', 'g')
            ),
            '\s*\*\*البدائل.*$', '', 'g')
          ),
          '\s*الكلمات المفتاحية المستخدمة.*$', '', 'g')
        ),
        '\s*هذا العنوان.*$', '', 'g')
      ),
      '\s*العنوان محسّن.*$', '', 'g')
    ),
    '\s*\(\d{2}\s*حرف.*$', '', 'g')
  ),
  '^إليك عنوان SEO محسّن[：:]\s*', '', 'g')
);

UPDATE financial_news_articles
SET title = TRIM(BOTH '*' FROM title);

UPDATE financial_news_articles
SET title = TRIM(SPLIT_PART(title, E'\n', 1))
WHERE LENGTH(title) > 100;

UPDATE financial_news_articles
SET title = 'تحليل مالي من marfa.sa'
WHERE title IS NULL OR TRIM(title) = '';

SELECT slug, LEFT(title, 120) AS title_preview
FROM financial_news_articles
WHERE LENGTH(title) > 80 OR title LIKE '%**%' OR title LIKE '%---%'
ORDER BY created_at DESC;
