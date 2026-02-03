-- Cleanup unused tables
DROP TABLE IF EXISTS investors;
DROP TABLE IF EXISTS entrepreneurs;
DROP TABLE IF EXISTS physician_applications;
DROP TABLE IF EXISTS specialty_pages;
-- Drop investment_opportunities and cascade to remove dependent constraints (like in investor_interactions)
DROP TABLE IF EXISTS investment_opportunities CASCADE;
