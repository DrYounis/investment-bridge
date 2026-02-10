-- Drop and recreate news_feed table completely
DROP TABLE IF EXISTS public.news_feed CASCADE;

-- Create fresh news_feed table
CREATE TABLE public.news_feed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL CHECK (source IN ('local', 'global', 'hail')),
  category text,
  text text NOT NULL,
  link text,
  created_at timestamptz DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.news_feed ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "News items are viewable by everyone"
  ON news_feed FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage news items"
  ON news_feed FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_feed;

-- Insert test data
INSERT INTO public.news_feed (source, category, text, link) VALUES
('local', 'السوق السعودي', 'تاسي يحقق مكاسب قوية بنسبة 2.3% مدعوماً بارتفاع أسهم القطاع المالي والطاقة', 'https://argaam.com'),
('global', 'مصطلح استثماري', 'ما هو التمويل الجماعي (Crowdfunding)؟ دليل شامل للمستثمرين', 'https://investopedia.com'),
('hail', 'فرص حائل', 'إطلاق برنامج دعم للمشاريع الناشئة في حائل بقيمة 50 مليون ريال', '#'),
('local', 'لوائح', 'هيئة السوق المالية تعلن تسهيلات للشركات الناشئة', 'https://cma.org.sa');

-- Verify
SELECT * FROM public.news_feed ORDER BY created_at DESC;
