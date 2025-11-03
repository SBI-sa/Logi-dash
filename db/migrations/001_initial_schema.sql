-- ============================================================================
-- LogiPoint Dashboard - Initial Schema Migration
-- ============================================================================
-- Purpose: Create all 9 dashboard tables with JSONB for nested data
-- Pattern: Singleton (id = 1) per table for dashboard snapshot
-- RLS: Public read, authenticated write
-- Realtime: Enabled on all tables
-- ============================================================================

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS risks CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS real_estate CASCADE;
DROP TABLE IF EXISTS logistics CASCADE;
DROP TABLE IF EXISTS warehouse CASCADE;
DROP TABLE IF EXISTS vas CASCADE;
DROP TABLE IF EXISTS po CASCADE;
DROP TABLE IF EXISTS last_updated CASCADE;

-- ============================================================================
-- 1. SALES TABLE
-- ============================================================================
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  
  -- Scalar metrics
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  last_year_ytd_revenue NUMERIC NOT NULL DEFAULT 0,
  mtd_revenue NUMERIC NOT NULL DEFAULT 0,
  ytd_revenue NUMERIC NOT NULL DEFAULT 0,
  mtd_budget NUMERIC NOT NULL DEFAULT 0,
  ytd_budget NUMERIC NOT NULL DEFAULT 0,
  revenue_target NUMERIC NOT NULL DEFAULT 0,
  growth_percentage NUMERIC NOT NULL DEFAULT 0,
  total_revenue_color TEXT,
  revenue_target_color TEXT,
  
  -- Complex nested data (JSONB)
  quarterly_targets JSONB NOT NULL DEFAULT '{}'::jsonb,
  quarterly_labelling JSONB NOT NULL DEFAULT '{}'::jsonb,
  top_products JSONB NOT NULL DEFAULT '[]'::jsonb,
  top_customers JSONB NOT NULL DEFAULT '[]'::jsonb,
  top_customers_monthly JSONB NOT NULL DEFAULT '{}'::jsonb,
  revenue_by_segment JSONB NOT NULL DEFAULT '[]'::jsonb,
  revenue_by_segment_monthly JSONB NOT NULL DEFAULT '{}'::jsonb,
  monthly_trend JSONB NOT NULL DEFAULT '[]'::jsonb,
  monthly_revenue JSONB NOT NULL DEFAULT '[]'::jsonb,
  account_managers JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. RISKS TABLE
-- ============================================================================
CREATE TABLE risks (
  id SERIAL PRIMARY KEY,
  
  -- Scalar metrics
  total_risks INTEGER NOT NULL DEFAULT 0,
  high_risks INTEGER NOT NULL DEFAULT 0,
  medium_risks INTEGER NOT NULL DEFAULT 0,
  low_risks INTEGER NOT NULL DEFAULT 0,
  mitigated_percentage NUMERIC NOT NULL DEFAULT 0,
  mitigated_risks_count INTEGER NOT NULL DEFAULT 0,
  total_risks_for_mitigation INTEGER NOT NULL DEFAULT 0,
  risks_addressed_date TEXT,
  
  -- Complex nested data (JSONB)
  risks_by_department JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_heatmap JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. CONTRACTS TABLE
-- ============================================================================
CREATE TABLE contracts (
  id SERIAL PRIMARY KEY,
  
  -- Scalar metrics
  expiring_this_month INTEGER NOT NULL DEFAULT 0,
  expiring_this_quarter INTEGER NOT NULL DEFAULT 0,
  total_contracts INTEGER NOT NULL DEFAULT 0,
  
  -- Complex nested data (JSONB)
  contracts JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. REAL_ESTATE TABLE
-- ============================================================================
CREATE TABLE real_estate (
  id SERIAL PRIMARY KEY,
  
  -- JIP metrics
  jip_total_capacity NUMERIC NOT NULL DEFAULT 0,
  jip_occupied_land NUMERIC NOT NULL DEFAULT 0,
  jip_occupancy_percentage NUMERIC NOT NULL DEFAULT 0,
  jip_average_rate NUMERIC NOT NULL DEFAULT 0,
  
  -- Parking (nested object stored as JSONB)
  parking JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Complex nested data (JSONB)
  lands JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Image URIs
  land_image_uri TEXT,
  jlh_image_uri TEXT,
  additional_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. LOGISTICS TABLE
-- ============================================================================
CREATE TABLE logistics (
  id SERIAL PRIMARY KEY,
  
  -- Scalar metrics
  on_time_delivery_rate NUMERIC NOT NULL DEFAULT 0,
  average_delivery_time NUMERIC NOT NULL DEFAULT 0,
  transportation_cost_per_shipment NUMERIC NOT NULL DEFAULT 0,
  active_shipments INTEGER NOT NULL DEFAULT 0,
  delayed_shipments INTEGER NOT NULL DEFAULT 0,
  utilization_rate NUMERIC NOT NULL DEFAULT 0,
  fleet_utilization NUMERIC NOT NULL DEFAULT 0,
  trucks INTEGER NOT NULL DEFAULT 0,
  drivers INTEGER NOT NULL DEFAULT 0,
  trips_in_progress INTEGER NOT NULL DEFAULT 0,
  trips_completed INTEGER NOT NULL DEFAULT 0,
  trips_pending INTEGER NOT NULL DEFAULT 0,
  trips_transporters INTEGER NOT NULL DEFAULT 0,
  
  -- Complex nested data (JSONB)
  delivery_performance JSONB NOT NULL DEFAULT '[]'::jsonb,
  delays_by_route JSONB NOT NULL DEFAULT '[]'::jsonb,
  thresholds JSONB NOT NULL DEFAULT '{}'::jsonb,
  trip_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  trip_categories_monthly JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. WAREHOUSE TABLE
-- ============================================================================
CREATE TABLE warehouse (
  id SERIAL PRIMARY KEY,
  
  -- Scalar metrics
  current_occupancy NUMERIC NOT NULL DEFAULT 0,
  capacity NUMERIC NOT NULL DEFAULT 0,
  occupancy_percentage NUMERIC NOT NULL DEFAULT 0,
  inbound_shipments INTEGER NOT NULL DEFAULT 0,
  outbound_shipments INTEGER NOT NULL DEFAULT 0,
  inventory_turnover NUMERIC NOT NULL DEFAULT 0,
  average_days_in_storage NUMERIC NOT NULL DEFAULT 0,
  
  -- Complex nested data (JSONB)
  occupancy_by_zone JSONB NOT NULL DEFAULT '[]'::jsonb,
  occupancy_trend JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Image URI
  allocation_image_uri TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. VAS TABLE (Value Added Services)
-- ============================================================================
CREATE TABLE vas (
  id SERIAL PRIMARY KEY,
  
  -- Complex nested data (JSONB)
  delivery_total JSONB NOT NULL DEFAULT '{}'::jsonb,
  labelling_total JSONB NOT NULL DEFAULT '{}'::jsonb,
  top_5_clients JSONB NOT NULL DEFAULT '[]'::jsonb,
  labelling_quarterly JSONB NOT NULL DEFAULT '{}'::jsonb,
  delivery_quarterly JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. PO TABLE (Purchase Orders)
-- ============================================================================
CREATE TABLE po (
  id SERIAL PRIMARY KEY,
  
  -- Complex nested data (JSONB)
  fcl_quarterly JSONB NOT NULL DEFAULT '{}'::jsonb,
  lcl_quarterly JSONB NOT NULL DEFAULT '{}'::jsonb,
  fcl_monthly JSONB NOT NULL DEFAULT '[]'::jsonb,
  lcl_monthly JSONB NOT NULL DEFAULT '[]'::jsonb,
  ciy_movement JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 9. LAST_UPDATED TABLE
-- ============================================================================
CREATE TABLE last_updated (
  id SERIAL PRIMARY KEY,
  
  -- Card-level update tracking (JSONB key-value pairs)
  timestamps JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- AUTO-UPDATE TRIGGERS FOR updated_at
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_real_estate_updated_at BEFORE UPDATE ON real_estate
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_logistics_updated_at BEFORE UPDATE ON logistics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouse_updated_at BEFORE UPDATE ON warehouse
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vas_updated_at BEFORE UPDATE ON vas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_po_updated_at BEFORE UPDATE ON po
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_last_updated_updated_at BEFORE UPDATE ON last_updated
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE vas ENABLE ROW LEVEL SECURITY;
ALTER TABLE po ENABLE ROW LEVEL SECURITY;
ALTER TABLE last_updated ENABLE ROW LEVEL SECURITY;

-- Public (anon) can SELECT (read) all data
CREATE POLICY "Public read access" ON sales FOR SELECT USING (true);
CREATE POLICY "Public read access" ON risks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contracts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON real_estate FOR SELECT USING (true);
CREATE POLICY "Public read access" ON logistics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON warehouse FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vas FOR SELECT USING (true);
CREATE POLICY "Public read access" ON po FOR SELECT USING (true);
CREATE POLICY "Public read access" ON last_updated FOR SELECT USING (true);

-- Authenticated users can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated write access" ON sales FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON risks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON contracts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON real_estate FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON logistics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON warehouse FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON vas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON po FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON last_updated FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- ENABLE REALTIME
-- ============================================================================

-- Enable realtime for all tables via Supabase Studio or CLI:
-- ALTER PUBLICATION supabase_realtime ADD TABLE sales;
-- ALTER PUBLICATION supabase_realtime ADD TABLE risks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE contracts;
-- ALTER PUBLICATION supabase_realtime ADD TABLE real_estate;
-- ALTER PUBLICATION supabase_realtime ADD TABLE logistics;
-- ALTER PUBLICATION supabase_realtime ADD TABLE warehouse;
-- ALTER PUBLICATION supabase_realtime ADD TABLE vas;
-- ALTER PUBLICATION supabase_realtime ADD TABLE po;
-- ALTER PUBLICATION supabase_realtime ADD TABLE last_updated;

-- ============================================================================
-- INITIAL DATA (Optional - Singleton row with id = 1)
-- ============================================================================

-- Insert default rows for singleton pattern
INSERT INTO sales (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO risks (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO contracts (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO real_estate (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO logistics (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO warehouse (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO vas (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO po (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO last_updated (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- INDEXES (Optional - for performance)
-- ============================================================================

-- Single-row singleton pattern doesn't need indexes, but adding for completeness
CREATE INDEX idx_sales_updated_at ON sales(updated_at);
CREATE INDEX idx_risks_updated_at ON risks(updated_at);
CREATE INDEX idx_contracts_updated_at ON contracts(updated_at);
CREATE INDEX idx_real_estate_updated_at ON real_estate(updated_at);
CREATE INDEX idx_logistics_updated_at ON logistics(updated_at);
CREATE INDEX idx_warehouse_updated_at ON warehouse(updated_at);
CREATE INDEX idx_vas_updated_at ON vas(updated_at);
CREATE INDEX idx_po_updated_at ON po(updated_at);
CREATE INDEX idx_last_updated_updated_at ON last_updated(updated_at);

-- ============================================================================
-- VERIFICATION QUERIES (Run these after migration to verify)
-- ============================================================================

-- Check that all tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies exist
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check initial data
-- SELECT 'sales' as table, COUNT(*) as rows FROM sales
-- UNION ALL SELECT 'risks', COUNT(*) FROM risks
-- UNION ALL SELECT 'contracts', COUNT(*) FROM contracts
-- UNION ALL SELECT 'real_estate', COUNT(*) FROM real_estate
-- UNION ALL SELECT 'logistics', COUNT(*) FROM logistics
-- UNION ALL SELECT 'warehouse', COUNT(*) FROM warehouse
-- UNION ALL SELECT 'vas', COUNT(*) FROM vas
-- UNION ALL SELECT 'po', COUNT(*) FROM po
-- UNION ALL SELECT 'last_updated', COUNT(*) FROM last_updated;
