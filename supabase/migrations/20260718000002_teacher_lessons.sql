-- Teacher Lessons — editable course content for Arabic Vibe Coding
CREATE TABLE IF NOT EXISTS public.teacher_lessons (
  id SERIAL PRIMARY KEY,
  day smallint NOT NULL UNIQUE CHECK (day BETWEEN 1 AND 10),
  title text NOT NULL,
  icon text NOT NULL DEFAULT '📝',
  content text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT timezone('utc', now())
);

ALTER TABLE public.teacher_lessons ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view lessons
CREATE POLICY "Anyone can view lessons" ON public.teacher_lessons FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role full access
CREATE POLICY "Service role full access" ON public.teacher_lessons FOR ALL
  USING (auth.role() = 'service_role');

-- Seed lessons from page.tsx content
-- (Run this block to seed initial content. After first deploy, content is manageable via admin UI.)
