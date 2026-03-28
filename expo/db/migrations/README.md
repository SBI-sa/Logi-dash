# Database Migration Guide

## Overview
This directory contains SQL migration files for the LogiPoint Dashboard application.

## Current Migration
**File:** `001_initial_schema.sql`
**Purpose:** Create all 9 dashboard tables with complete schema, RLS policies, and triggers

## How to Apply Migration

### Option 1: Supabase Studio (Recommended)
1. Open your Supabase project dashboard: https://supabase.com/dashboard/project/vckvjvswmwlfvieudjrf
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute

### Option 2: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db reset
# Then apply the migration manually via Studio
```

## After Migration - Enable Realtime

The migration creates the tables, but realtime must be enabled via Supabase Studio:

1. Go to **Database** → **Replication** in Supabase Studio
2. Find **supabase_realtime** publication
3. Enable these tables:
   - ✅ sales
   - ✅ risks
   - ✅ contracts
   - ✅ real_estate
   - ✅ logistics
   - ✅ warehouse
   - ✅ vas
   - ✅ po
   - ✅ last_updated

Or run this SQL in the SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE sales;
ALTER PUBLICATION supabase_realtime ADD TABLE risks;
ALTER PUBLICATION supabase_realtime ADD TABLE contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE real_estate;
ALTER PUBLICATION supabase_realtime ADD TABLE logistics;
ALTER PUBLICATION supabase_realtime ADD TABLE warehouse;
ALTER PUBLICATION supabase_realtime ADD TABLE vas;
ALTER PUBLICATION supabase_realtime ADD TABLE po;
ALTER PUBLICATION supabase_realtime ADD TABLE last_updated;
```

## Verification

After applying the migration, run these verification queries:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check row counts (should have 1 row per table)
SELECT 'sales' as table, COUNT(*) as rows FROM sales
UNION ALL SELECT 'risks', COUNT(*) FROM risks
UNION ALL SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL SELECT 'real_estate', COUNT(*) FROM real_estate
UNION ALL SELECT 'logistics', COUNT(*) FROM logistics
UNION ALL SELECT 'warehouse', COUNT(*) FROM warehouse
UNION ALL SELECT 'vas', COUNT(*) FROM vas
UNION ALL SELECT 'po', COUNT(*) FROM po
UNION ALL SELECT 'last_updated', COUNT(*) FROM last_updated;
```

## Schema Summary

All tables follow this pattern:
- **Primary Key:** `id` (SERIAL)
- **Timestamps:** `created_at`, `updated_at` (auto-managed)
- **Data Storage:** Scalar fields + JSONB for nested objects
- **RLS:** Public read (anon), authenticated write
- **Realtime:** Enabled for live updates
- **Pattern:** Singleton (id = 1) per table

## Next Steps

After successful migration:
1. Verify tables exist ✅
2. Verify RLS policies applied ✅
3. Enable realtime on all tables ✅
4. Update DataContext.tsx with realtime subscriptions
5. Test admin write → viewer realtime sync
