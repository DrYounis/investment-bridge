-- Migration: Marfa Studio Ventures — Platform-Originated Pitches
-- Adds platform-originated columns to investment_opportunities, creates marfa_product_lines table,
-- and seeds WiqayaGen, Turathna Hub, and Celebrate-Hub.
-- Run this in the Supabase SQL Editor.

-- =============================================================================
-- 1. ALTER investment_opportunities: add platform-originated columns
-- =============================================================================
ALTER TABLE public.investment_opportunities
  ADD COLUMN IF NOT EXISTS is_platform_originated boolean DEFAULT false;

ALTER TABLE public.investment_opportunities
  ADD COLUMN IF NOT EXISTS source_label text;

ALTER TABLE public.investment_opportunities
  ADD COLUMN IF NOT EXISTS pitch_deck_url text;

ALTER TABLE public.investment_opportunities
  ADD COLUMN IF NOT EXISTS tagline text;

ALTER TABLE public.investment_opportunities
  ADD COLUMN IF NOT EXISTS stage text;

ALTER TABLE public.investment_opportunities
  ADD COLUMN IF NOT EXISTS equity_offered numeric;

-- =============================================================================
-- 2. CREATE marfa_product_lines (internal product-line expansions)
--    STRUCTURALLY SEPARATE from investment_opportunities.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.marfa_product_lines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  tagline text,
  sector text,
  stage text,
  description text,
  expansion_capital numeric,
  equity_or_profit_share text,
  roi_multiple numeric,
  timeline_months integer,
  pitch_deck_url text,
  source_label text DEFAULT 'Marfa Studio — Internal Product Line Expansion',
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

ALTER TABLE public.marfa_product_lines ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 3. RLS: marfa_product_lines — admin-only read
-- =============================================================================
DROP POLICY IF EXISTS "Admin can read product lines" ON public.marfa_product_lines;
CREATE POLICY "Admin can read product lines"
  ON public.marfa_product_lines
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.email = 'mohamedy2003@gmail.com'
    )
  );

DROP POLICY IF EXISTS "Admin can insert product lines" ON public.marfa_product_lines;
CREATE POLICY "Admin can insert product lines"
  ON public.marfa_product_lines
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.email = 'mohamedy2003@gmail.com'
    )
  );

DROP POLICY IF EXISTS "Admin can update product lines" ON public.marfa_product_lines;
CREATE POLICY "Admin can update product lines"
  ON public.marfa_product_lines
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.email = 'mohamedy2003@gmail.com'
    )
  );

-- =============================================================================
-- 4. RLS: investors can read published + platform-originated opportunities
-- =============================================================================
-- Ensure existing RLS policies still apply; add a policy for platform-originated
-- rows so investors can see them even without a specific entrepreneur_id link.
DROP POLICY IF EXISTS "Investors can view platform-originated opportunities" ON public.investment_opportunities;
CREATE POLICY "Investors can view platform-originated opportunities"
  ON public.investment_opportunities
  FOR SELECT
  USING (
    is_platform_originated = true
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.user_type = 'investor'
    )
  );

-- =============================================================================
-- 5. SEED: WiqayaGen and Turathna Hub → investment_opportunities
--    Use a placeholder entrepreneur_id (admin profile) since these are
--    platform-originated, not submitted by an organic founder.
-- =============================================================================

-- Get the admin profile ID
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM public.profiles WHERE email = 'mohamedy2003@gmail.com' LIMIT 1;

  IF admin_id IS NOT NULL THEN

    -- WiqayaGen
    INSERT INTO public.investment_opportunities (
      entrepreneur_id, title, tagline, sector, stage, status,
      summary, target_amount, equity_offered, roi_percentage, payback_period,
      is_platform_originated, source_label, pitch_deck_url
    ) VALUES (
      admin_id,
      'WiqayaGen',
      'AI-driven preventive healthcare platform for the GCC workforce',
      'HealthTech',
      'Seed',
      'published',
      'WiqayaGen is a predictive health analytics platform that integrates with corporate wellness programs, using machine learning to flag early risk factors and reduce insurance claims by up to 35%. Targeting Saudi employers and insurance providers as anchor clients.',
      1500000,
      10.0,
      28,
      '24 months',
      true,
      'Marfa Studio Ventures (platform-originated)',
      NULL -- will be updated in Part 4 after upload
    )
    ON CONFLICT DO NOTHING;

    -- Turathna Hub
    INSERT INTO public.investment_opportunities (
      entrepreneur_id, title, tagline, sector, stage, status,
      summary, target_amount, equity_offered, roi_percentage, payback_period,
      is_platform_originated, source_label, pitch_deck_url
    ) VALUES (
      admin_id,
      'Turathna Hub',
      'Digital marketplace for Saudi cultural heritage crafts and experiences',
      'Creative Economy / E-commerce',
      'Seed',
      'published',
      'Turathna Hub connects Saudi artisans and heritage craft producers with global consumers through a curated digital marketplace. The platform combines storytelling, provenance verification, and direct-to-consumer logistics, targeting the $40B global heritage crafts market.',
      2000000,
      12.5,
      22,
      '30 months',
      true,
      'Marfa Studio Ventures (platform-originated)',
      NULL
    )
    ON CONFLICT DO NOTHING;

  END IF;
END $$;

-- =============================================================================
-- 6. SEED: Celebrate-Hub → marfa_product_lines
-- =============================================================================
INSERT INTO public.marfa_product_lines (
  name, tagline, sector, stage, description,
  expansion_capital, equity_or_profit_share, roi_multiple, timeline_months,
  pitch_deck_url, source_label
) VALUES (
  'Celebrate-Hub (Marfa Celebrations)',
  'End-to-end event management marketplace for the Saudi celebrations economy',
  'Event Tech / Marketplace',
  'Expansion (Series A readiness)',
  'Celebrate-Hub is a Marfa-operated marketplace connecting event organizers, vendors, and venues in Saudi Arabia. The platform handles booking, payments, supplier matching, and logistics for weddings, corporate events, and national celebrations. This is an internal product-line expansion — not an external venture seeking investment through the open marketplace.',
  3500000,
  '15% profit share (revenue-based)',
  3.2,
  36,
  NULL,
  'Marfa Studio — Internal Product Line Expansion (NOT a public investor listing)'
)
ON CONFLICT DO NOTHING;
