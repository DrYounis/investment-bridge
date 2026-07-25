-- Junction table: many-to-many relationship between meetings and glossary terms
-- One term can match multiple meetings (e.g., "استثمار" matches meetings 3, 6, 14)
-- Populated by keyword matching from scheduleData.glossaryKeywords

CREATE TABLE IF NOT EXISTS public.meeting_glossary_terms (
  meeting_number INTEGER NOT NULL,
  term_number INTEGER NOT NULL REFERENCES public.marfa_glossary_terms(term_number) ON DELETE CASCADE,
  relevance_score INTEGER DEFAULT 0,  -- higher = more keywords matched
  PRIMARY KEY (meeting_number, term_number)
);

CREATE INDEX IF NOT EXISTS idx_mgt_meeting ON public.meeting_glossary_terms (meeting_number);
CREATE INDEX IF NOT EXISTS idx_mgt_term ON public.meeting_glossary_terms (term_number);

ALTER TABLE public.meeting_glossary_terms ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.meeting_glossary_terms IS 'Links glossary terms to meetings based on keyword matching. Updated by populate-meeting-glossary-terms script.';
