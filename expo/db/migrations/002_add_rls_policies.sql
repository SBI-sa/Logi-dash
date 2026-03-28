-- ============================================================================
-- RLS POLICIES FOR ALL TABLES
-- ============================================================================
-- This allows the anon key to read and write to all dashboard tables
-- Since these are singleton tables (id=1) for dashboard snapshots,
-- we allow full public access for the admin/viewer pattern

-- Sales Table RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on sales"
ON sales FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on sales"
ON sales FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on sales"
ON sales FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Risks Table RLS
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on risks"
ON risks FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on risks"
ON risks FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on risks"
ON risks FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Contracts Table RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on contracts"
ON contracts FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on contracts"
ON contracts FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on contracts"
ON contracts FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Real Estate Table RLS
ALTER TABLE real_estate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on real_estate"
ON real_estate FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on real_estate"
ON real_estate FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on real_estate"
ON real_estate FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Logistics Table RLS
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on logistics"
ON logistics FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on logistics"
ON logistics FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on logistics"
ON logistics FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Warehouse Table RLS
ALTER TABLE warehouse ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on warehouse"
ON warehouse FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on warehouse"
ON warehouse FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on warehouse"
ON warehouse FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- VAS Table RLS
ALTER TABLE vas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on vas"
ON vas FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on vas"
ON vas FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on vas"
ON vas FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- PO Table RLS
ALTER TABLE po ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on po"
ON po FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on po"
ON po FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on po"
ON po FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Last Updated Table RLS
ALTER TABLE last_updated ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on last_updated"
ON last_updated FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access on last_updated"
ON last_updated FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access on last_updated"
ON last_updated FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
