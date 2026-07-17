-- ==========================================
-- Majlis Message Likes — toggleable likes on chat messages
-- ==========================================

CREATE TABLE IF NOT EXISTS public.majlis_message_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES public.majlis_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_number smallint NOT NULL,
  created_at timestamptz DEFAULT timezone('utc', now()),
  UNIQUE(message_id, user_id)
);

ALTER TABLE public.majlis_message_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Likes are viewable by authenticated users" ON public.majlis_message_likes;
CREATE POLICY "Likes are viewable by authenticated users"
  ON public.majlis_message_likes FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own likes" ON public.majlis_message_likes;
CREATE POLICY "Users can insert their own likes"
  ON public.majlis_message_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.majlis_message_likes;
CREATE POLICY "Users can delete their own likes"
  ON public.majlis_message_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER publication supabase_realtime ADD TABLE public.majlis_message_likes;
