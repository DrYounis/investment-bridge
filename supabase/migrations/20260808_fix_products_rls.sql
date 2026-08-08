-- Allow anyone (anon + authenticated) to read active products
-- Fixes: plans page showing "غير متاح حالياً" and price mismatch (100 vs 150)
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT USING (is_active = true);
