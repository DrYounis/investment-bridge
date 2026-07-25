-- Add fields for weekly term-of-week email feature
-- short_desc: concise 1-2 sentence summary
-- example: practical real-world example
-- featured_meeting: which meeting (1-14) this term is featured for (Monday email before that Friday's meeting)

ALTER TABLE public.marfa_glossary_terms
  ADD COLUMN IF NOT EXISTS short_desc_ar TEXT,
  ADD COLUMN IF NOT EXISTS short_desc_en TEXT,
  ADD COLUMN IF NOT EXISTS example_ar TEXT,
  ADD COLUMN IF NOT EXISTS example_en TEXT,
  ADD COLUMN IF NOT EXISTS featured_meeting INTEGER,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.marfa_glossary_terms.short_desc_ar IS 'وصف مختصر — جملة أو جملتين';
COMMENT ON COLUMN public.marfa_glossary_terms.short_desc_en IS 'Short description — 1-2 sentences';
COMMENT ON COLUMN public.marfa_glossary_terms.example_ar IS 'مثال تطبيقي من الواقع';
COMMENT ON COLUMN public.marfa_glossary_terms.example_en IS 'Practical real-world example';
COMMENT ON COLUMN public.marfa_glossary_terms.featured_meeting IS 'Meeting number (1-14) this term is featured for in the Monday term-of-week email';
COMMENT ON COLUMN public.marfa_glossary_terms.sent_at IS 'When the term-of-week email was sent for this term';
