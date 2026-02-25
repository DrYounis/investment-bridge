-- 1. Create the investor_requests table
CREATE TABLE IF NOT EXISTS public.investor_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    investor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'contacted', 'closed')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT -- For you to add private admin notes later
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.investor_requests ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Policy A: Investors can insert their own requests
DROP POLICY IF EXISTS "Investors can create requests" ON public.investor_requests;
CREATE POLICY "Investors can create requests" 
ON public.investor_requests 
FOR INSERT 
WITH CHECK (auth.uid() = investor_id);

-- Policy B: Investors can view their own requests (useful if you add a "My Requests" tab for them)
DROP POLICY IF EXISTS "Investors can view their own requests" ON public.investor_requests;
CREATE POLICY "Investors can view their own requests" 
ON public.investor_requests 
FOR SELECT 
USING (auth.uid() = investor_id);

-- Policy C: Admins can view and update all requests
-- Note: Adjust 'admin' to match how you handle roles in your `profiles` table. 
-- If you are using a specific email for your admin account, you can use that instead.
DROP POLICY IF EXISTS "Admins can view all requests" ON public.investor_requests;
CREATE POLICY "Admins can view all requests" 
ON public.investor_requests 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can update requests" ON public.investor_requests;
CREATE POLICY "Admins can update requests" 
ON public.investor_requests 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- 4. Create an index for faster querying by investor_id and status
CREATE INDEX IF NOT EXISTS idx_investor_requests_investor_id ON public.investor_requests(investor_id);
CREATE INDEX IF NOT EXISTS idx_investor_requests_status ON public.investor_requests(status);
