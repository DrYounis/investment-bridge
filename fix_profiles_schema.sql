-- Add missing columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS user_type TEXT;

-- Verify the table structure
SELECT * FROM public.profiles LIMIT 1;
