-- Temporarily add INSERT policies for seeding
-- This allows anyone to insert seed data for testing purposes
-- NOTE: Remove these policies in production!

-- Allow anyone to insert announcements (for seeding)
DROP POLICY IF EXISTS "Allow seed announcements" ON announcements;
CREATE POLICY "Allow seed announcements"
  ON announcements FOR INSERT
  WITH CHECK (true);

-- Allow anyone to insert meetings (for seeding)
DROP POLICY IF EXISTS "Allow seed meetings" ON meetings;
CREATE POLICY "Allow seed meetings"
  ON meetings FOR INSERT
  WITH CHECK (true);
