-- ============================================================================
-- LogiPoint Dashboard - Marketing Module Migration
-- ============================================================================
-- Purpose: Create marketing table with year-driven JSONB structure
-- Pattern: Singleton (id = 1) with years object containing monthly/campaign data
-- ============================================================================

-- ============================================================================
-- MARKETING TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing (
  id SERIAL PRIMARY KEY,
  
  -- Year-driven data structure (JSONB)
  -- Structure: { "2025": { monthly: [...], campaigns: [...], campaignMonthly: {...} }, "2026": {...} }
  years JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- AUTO-UPDATE TRIGGER FOR updated_at
-- ============================================================================
CREATE TRIGGER update_marketing_updated_at BEFORE UPDATE ON marketing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE marketing ENABLE ROW LEVEL SECURITY;

-- Public (anon) can SELECT (read) all data
CREATE POLICY "Public read access" ON marketing FOR SELECT USING (true);

-- Authenticated users can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated write access" ON marketing FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- ENABLE REALTIME
-- ============================================================================
-- Run in Supabase Studio or CLI:
-- ALTER PUBLICATION supabase_realtime ADD TABLE marketing;

-- ============================================================================
-- INITIAL DATA (Singleton row with id = 1)
-- ============================================================================
INSERT INTO marketing (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- INDEX
-- ============================================================================
CREATE INDEX idx_marketing_updated_at ON marketing(updated_at);

-- ============================================================================
-- DATA STRUCTURE DOCUMENTATION
-- ============================================================================
-- 
-- years: {
--   "2025": {
--     monthly: [
--       {
--         month: "January",
--         leadsByChannel: {
--           website: number,
--           linkedinOrganic: number,
--           linkedinPaid: number,
--           instagramOrganic: number,
--           instagramPaid: number,
--           facebookOrganic: number,
--           facebookPaid: number
--         },
--         spendByChannelSar: {
--           website: number,
--           linkedinOrganic: number,
--           linkedinPaid: number,
--           instagramOrganic: number,
--           instagramPaid: number,
--           facebookOrganic: number,
--           facebookPaid: number
--         },
--         convertedLeads: number,
--         attributedRevenueSar: number
--       },
--       ... (12 months)
--     ],
--     campaigns: [
--       {
--         id: "uuid",
--         name: "Campaign Name",
--         startDate: "2025-01-15",
--         endDate: "2025-03-31",
--         channels: ["linkedinPaid", "instagramPaid"]
--       },
--       ...
--     ],
--     campaignMonthly: {
--       "campaign-id-1": [
--         {
--           month: "January",
--           leads: number,
--           convertedLeads: number,
--           attributedRevenueSar: number,
--           spendSar: number
--         },
--         ...
--       ],
--       ...
--     }
--   },
--   "2026": { ... }
-- }
