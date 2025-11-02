# LogiPoint Supabase Setup Instructions

## Current Status ✅

Your LogiPoint Dashboard app is now running in development mode with Supabase integration!

- ✅ Environment variables configured
- ✅ Supabase client connected
- ✅ DataContext updated to fetch from Supabase
- ✅ Admin dashboard created
- ✅ Dev server running on port 5000

## What You Need to Do Next

### Step 1: Create Supabase Tables

The app is currently showing mock data because the Supabase tables don't exist yet (you're seeing 401 errors in the console, which is normal).

1. Go to your Supabase project: https://vckvjvswmwlfvieudjrf.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the SQL from `SUPABASE_SCHEMA.md` (the CREATE TABLE statements)
4. Click "Run" to create all the tables

### Step 2: Insert Initial Data

After creating the tables, you need to insert the initial mock data. You have two options:

**Option A: Use the Admin Dashboard (Recommended)**
1. Navigate to `/admin` in your app
2. Login with your admin credentials (same as configured in AuthContext.tsx)
3. Edit each section (Sales, Risks, etc.) and click "Save"
4. This will create the initial records in Supabase

> **Security Note:** The current admin credentials are hardcoded in `contexts/AuthContext.tsx` for development purposes. For production deployment, these should be replaced with Supabase Auth or environment-based secrets.

**Option B: Insert Mock Data via SQL**

You can quickly populate all 8 modules with initial data. Run this SQL in Supabase SQL Editor:

```sql
-- Insert initial sales data
INSERT INTO sales (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'totalRevenue', 12450000,
    'lastYearYtdRevenue', 10500000,
    'mtdRevenue', 3200000,
    'ytdRevenue', 9850000,
    'mtdBudget', 3500000,
    'ytdBudget', 10500000,
    'revenueTarget', 15000000,
    'growthPercentage', 18.5,
    'quarterlyTargets', jsonb_build_object(
      'q1', jsonb_build_object('current', 3150000, 'target', 3500000, 'lastYear', 2900000),
      'q2', jsonb_build_object('current', 3700000, 'target', 3750000, 'lastYear', 3400000),
      'q3', jsonb_build_object('current', 3000000, 'target', 3750000, 'lastYear', 2800000),
      'q4', jsonb_build_object('current', 0, 'target', 4000000, 'lastYear', 3400000)
    ),
    'quarterlyLabelling', jsonb_build_object(
      'q1', jsonb_build_object('current', 12500, 'lastYear', 11200, 'color', '#00617f'),
      'q2', jsonb_build_object('current', 13800, 'lastYear', 12500, 'color', '#00617f'),
      'q3', jsonb_build_object('current', 14200, 'lastYear', 13100, 'color', '#00617f'),
      'q4', jsonb_build_object('current', 15000, 'lastYear', 13800, 'color', '#00617f')
    ),
    'topProducts', '[]'::jsonb,
    'topCustomers', '[]'::jsonb,
    'topCustomersMonthly', '{}'::jsonb,
    'revenueBySegment', '[]'::jsonb,
    'revenueBySegmentMonthly', '{}'::jsonb,
    'monthlyTrend', '[]'::jsonb,
    'monthlyRevenue', '[]'::jsonb,
    'accountManagers', '[]'::jsonb
  ),
  NOW()
);

-- Insert initial risk data  
INSERT INTO risks (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'totalRisks', 47,
    'highRisks', 8,
    'mediumRisks', 21,
    'lowRisks', 18,
    'mitigatedPercentage', 62,
    'mitigatedRisksCount', 24,
    'totalRisksForMitigation', 47,
    'risksByDepartment', '[]'::jsonb,
    'riskHeatmap', '[]'::jsonb,
    'risksAddressedDate', '2025-10-06'
  ),
  NOW()
);

-- Insert initial logistics data
INSERT INTO logistics (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'onTimeDeliveryRate', 94.5,
    'averageDeliveryTime', 2.3,
    'transportationCostPerShipment', 450,
    'activeShipments', 156,
    'delayedShipments', 8,
    'utilizationRate', 87,
    'fleetUtilization', 87,
    'trucks', 45,
    'drivers', 68,
    'tripsInProgress', 23,
    'tripsCompleted', 342,
    'tripsPending', 15,
    'tripsTransporters', 8,
    'deliveryPerformance', '[]'::jsonb,
    'delaysByRoute', '[]'::jsonb,
    'thresholds', jsonb_build_object('green', 90, 'yellow', 80),
    'tripCategories', '[]'::jsonb,
    'tripCategoriesMonthly', '{}'::jsonb
  ),
  NOW()
);

-- Insert initial warehouse data
INSERT INTO warehouse (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'currentOccupancy', 425000,
    'capacity', 500000,
    'occupancyPercentage', 85,
    'inboundShipments', 89,
    'outboundShipments', 102,
    'inventoryTurnover', 4.2,
    'averageDaysInStorage', 45,
    'occupancyByZone', '[]'::jsonb,
    'occupancyTrend', '[]'::jsonb,
    'allocationImageUri', ''
  ),
  NOW()
);

-- Insert initial real estate data
INSERT INTO real_estate (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'jipTotalCapacity', 500000,
    'jipOccupiedLand', 385000,
    'jipOccupancyPercentage', 77,
    'jipAverageRate', 125,
    'parking', jsonb_build_object(
      'availableSpaces', 50,
      'rentedSpaces', 180,
      'occupancyRate', 78,
      'averageRate', 250,
      'lastRate', 275,
      'nextEndingContract', '2026-03-15',
      'nextEndingContractSpaces', 25
    ),
    'lands', '[]'::jsonb,
    'landImageUri', '',
    'jlhImageUri', '',
    'additionalImages', '[]'::jsonb
  ),
  NOW()
);

-- Insert initial contract data
INSERT INTO contracts (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'expiringThisMonth', 5,
    'expiringThisQuarter', 12,
    'totalContracts', 48,
    'contracts', '[]'::jsonb
  ),
  NOW()
);

-- Insert initial VAS data
INSERT INTO vas (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'deliveryTotal', jsonb_build_object(
      'year', '2025',
      'current', 8500,
      'previous', 7200,
      'percentageChange', 18.1,
      'color', '#00617f'
    ),
    'labellingTotal', jsonb_build_object(
      'year', '2025',
      'current', 55500,
      'previous', 49800,
      'percentageChange', 11.4,
      'color', '#9b2743'
    ),
    'top5Clients', '[]'::jsonb,
    'labellingQuarterly', jsonb_build_object(
      'q1', jsonb_build_object('current', 12500, 'lastYear', 11200, 'color', '#9b2743'),
      'q2', jsonb_build_object('current', 13800, 'lastYear', 12500, 'color', '#9b2743'),
      'q3', jsonb_build_object('current', 14200, 'lastYear', 13100, 'color', '#9b2743'),
      'q4', jsonb_build_object('current', 15000, 'lastYear', 13800, 'color', '#9b2743')
    ),
    'deliveryQuarterly', jsonb_build_object(
      'q1', jsonb_build_object('current', 1950, 'lastYear', 1650, 'color', '#00617f'),
      'q2', jsonb_build_object('current', 2100, 'lastYear', 1800, 'color', '#00617f'),
      'q3', jsonb_build_object('current', 2250, 'lastYear', 1900, 'color', '#00617f'),
      'q4', jsonb_build_object('current', 2200, 'lastYear', 1850, 'color', '#00617f')
    )
  ),
  NOW()
);

-- Insert initial PO data
INSERT INTO po (id, data, updated_at) VALUES (
  1,
  jsonb_build_object(
    'fclQuarterly', jsonb_build_object(
      'q1', jsonb_build_object('units', 245, 'color', '#00617f'),
      'q2', jsonb_build_object('units', 289, 'color', '#00617f'),
      'q3', jsonb_build_object('units', 312, 'color', '#00617f'),
      'q4', jsonb_build_object('units', 298, 'color', '#00617f')
    ),
    'lclQuarterly', jsonb_build_object(
      'q1', jsonb_build_object('units', 156, 'color', '#9b2743'),
      'q2', jsonb_build_object('units', 178, 'color', '#9b2743'),
      'q3', jsonb_build_object('units', 165, 'color', '#9b2743'),
      'q4', jsonb_build_object('units', 189, 'color', '#9b2743')
    ),
    'fclMonthly', '[]'::jsonb,
    'lclMonthly', '[]'::jsonb,
    'ciyMovement', jsonb_build_object(
      'thisYear', '[]'::jsonb,
      'lastYear', '[]'::jsonb
    )
  ),
  NOW()
);
```

> **Note:** After running this SQL, all 8 modules will have initial data. You can then refine the values through the Admin Dashboard.

### Step 3: Configure Row-Level Security (RLS) - REQUIRED

**Important:** By default, Supabase enables RLS on all tables, which blocks all operations unless you create policies. You need to run the SQL below to allow your app to read and write data.

**Enable RLS with proper policies (Recommended):**

Run this SQL in your Supabase SQL Editor to create policies that allow all operations:

```sql
-- Enable RLS on all tables
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE vas ENABLE ROW LEVEL SECURITY;
ALTER TABLE po ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (development mode)
-- These allow both read (SELECT) and write (INSERT, UPDATE, DELETE) for all users

CREATE POLICY "Allow all operations on sales" ON sales
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on risks" ON risks
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on contracts" ON contracts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on real_estate" ON real_estate
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on logistics" ON logistics
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on warehouse" ON warehouse
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on vas" ON vas
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on po" ON po
  FOR ALL USING (true) WITH CHECK (true);
```

> **Security Note:** These policies allow anyone with the anon key to read and write data. For production, you should restrict write operations to authenticated admin users only. See the "Production Security" section below for details.

**Alternative: Disable RLS (Quick Development Setup)**

If you prefer to disable RLS entirely for faster development:

```sql
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE risks DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate DISABLE ROW LEVEL SECURITY;
ALTER TABLE logistics DISABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse DISABLE ROW LEVEL SECURITY;
ALTER TABLE vas DISABLE ROW LEVEL SECURITY;
ALTER TABLE po DISABLE ROW LEVEL SECURITY;
```

**Production Security (Future Enhancement):**

For production deployment, replace the "allow all" policies with admin-only write policies:

```sql
-- Drop the permissive policies
DROP POLICY "Allow all operations on sales" ON sales;
DROP POLICY "Allow all operations on risks" ON risks;
-- ... repeat for all tables

-- Create read-only policies for public
CREATE POLICY "Allow public read on sales" ON sales
  FOR SELECT USING (true);

-- Create write policies for authenticated admins only
CREATE POLICY "Allow admin write on sales" ON sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update on sales" ON sales
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ... repeat for all tables
```

### Step 4: Test the Admin Workflow

1. Login as Admin at `/admin`
2. Update a KPI value (e.g., Total Revenue)
3. Click "Save Sales Data"
4. You should see "✅ Sales data updated successfully!"
5. Logout and enter as Viewer (code: `2030`)
6. Navigate to Sales dashboard
7. Verify the updated value appears

## How It Works

### Data Flow

**Viewer Mode (Read-Only):**
```
App Start → DataContext loads → Supabase.from('sales').select() → Display in charts
```

**Admin Mode (Edit & Save):**
```
Admin Login → Edit form → Click Save → Supabase.from('sales').upsert() → Success notification
                                                                         ↓
                                                        Viewer refreshes → Sees new data
```

### File Structure

- `supabaseClient.ts` - Supabase connection using environment variables
- `contexts/DataContext.tsx` - Fetches and updates data from/to Supabase
- `app/admin.tsx` - Admin dashboard with editable forms
- `contexts/AuthContext.tsx` - Handles login (viewer code or admin email/password)
- All chart components read from DataContext (no changes needed!)

## Development vs Production

**Current Setup (Development):**
- Running `npm start` (Expo dev server on port 5000)
- Hot reload enabled
- Development mode warnings visible

**For Production Deployment:**
1. Run `npm run build` to create static build in `dist/` folder
2. Deploy `dist/` folder to Netlify
3. Set environment variables in Netlify:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
4. Enable RLS policies in Supabase for security

## Troubleshooting

### "401 Unauthorized" errors in console
- Tables don't exist yet → Create them using SQL from `SUPABASE_SCHEMA.md`
- RLS is enabled → Disable RLS or create proper policies

### "No Supabase data, using mock"
- Tables are empty → Insert initial data via SQL or Admin dashboard
- Network issue → Check Supabase project status

### Changes not appearing
- Refresh the browser (Ctrl+R or Cmd+R)
- Check browser console for errors
- Verify data was saved in Supabase Table Editor

### Admin page won't load
- Make sure you're logged in as admin
- Check credentials: `thamir.sulimani@logipoint.sa` / `Logi@2030`

## Next Steps

1. Create the Supabase tables
2. Insert initial data
3. Test the admin edit → save → viewer refresh workflow
4. Expand admin dashboard to include all data types (contracts, logistics, warehouse, etc.)
5. Add more advanced editing features (arrays, nested objects)
6. Prepare for Netlify deployment

## Important Notes

- **No chart changes were made** - All visual components work exactly as before
- **Same data structure** - Field names and types match your original mock data
- **Mock data fallback** - If Supabase fails, the app still works with mock data
- **Development mode** - The app now runs in live development mode with hot reload
