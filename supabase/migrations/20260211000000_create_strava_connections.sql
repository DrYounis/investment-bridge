-- Create strava_connections table for storing athlete Strava authentication
CREATE TABLE IF NOT EXISTS public.strava_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    athlete_id BIGINT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    athlete_name TEXT,
    athlete_profile_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(athlete_id)
);

-- Enable Row Level Security
ALTER TABLE public.strava_connections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own connections
DROP POLICY IF EXISTS "Users can view own strava connections" ON public.strava_connections;
CREATE POLICY "Users can view own strava connections"
    ON public.strava_connections
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own connections
DROP POLICY IF EXISTS "Users can insert own strava connections" ON public.strava_connections;
CREATE POLICY "Users can insert own strava connections"
    ON public.strava_connections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own connections
DROP POLICY IF EXISTS "Users can update own strava connections" ON public.strava_connections;
CREATE POLICY "Users can update own strava connections"
    ON public.strava_connections
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own connections
DROP POLICY IF EXISTS "Users can delete own strava connections" ON public.strava_connections;
CREATE POLICY "Users can delete own strava connections"
    ON public.strava_connections
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_strava_connections_user_id ON public.strava_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_strava_connections_athlete_id ON public.strava_connections(athlete_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_strava_connections_updated_at ON public.strava_connections;
CREATE TRIGGER update_strava_connections_updated_at
    BEFORE UPDATE ON public.strava_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
