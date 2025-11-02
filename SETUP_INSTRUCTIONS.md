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
Run this SQL in Supabase SQL Editor:

```sql
-- Insert initial sales data
INSERT INTO sales (id, data, updated_at) VALUES (
  1,
  '{"totalRevenue": 12450000, "lastYearYtdRevenue": 10500000, "mtdRevenue": 3200000, "ytdRevenue": 9850000, "mtdBudget": 3500000, "ytdBudget": 10500000, "revenueTarget": 15000000, "growthPercentage": 18.5, "quarterlyTargets": {"q1": {"current": 3150000, "target": 3500000, "lastYear": 2900000}, "q2": {"current": 3700000, "target": 3750000, "lastYear": 3400000}, "q3": {"current": 3000000, "target": 3750000, "lastYear": 2800000}, "q4": {"current": 0, "target": 4000000, "lastYear": 3400000}}, "quarterlyLabelling": {"q1": {"current": 12500, "lastYear": 11200}, "q2": {"current": 13800, "lastYear": 12500}, "q3": {"current": 14200, "lastYear": 13100}, "q4": {"current": 15000, "lastYear": 13800}}, "topProducts": [{"name": "Product A", "sales": 2500000}, {"name": "Product B", "sales": 1800000}], "topCustomers": [{"name": "Client Alpha", "sales": 3200000, "color": "#00617f"}], "revenueBySegment": [], "monthlyTrend": [], "monthlyRevenue": [], "accountManagers": [], "topCustomersMonthly": {}, "revenueBySegmentMonthly": {}}',
  NOW()
);

-- Insert initial risk data  
INSERT INTO risks (id, data, updated_at) VALUES (
  1,
  '{"totalRisks": 24, "highRisks": 8, "mediumRisks": 10, "lowRisks": 6, "mitigatedPercentage": 65, "mitigatedRisksCount": 15, "totalRisksForMitigation": 23, "risksByDepartment": [{"department": "Operations", "count": 12, "color": "#00617f"}, {"department": "Finance", "count": 6, "color": "#00617f"}], "riskHeatmap": [], "risksAddressedDate": "2024-10-15"}',
  NOW()
);
```

### Step 3: Configure Row-Level Security (RLS) - Optional for now

For production, you should enable RLS policies. For development, you can disable RLS on all tables:

```sql
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE risks DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate DISABLE ROW LEVEL SECURITY;
ALTER TABLE logistics DISABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse DISABLE ROW LEVEL SECURITY;
ALTER TABLE vas DISABLE ROW LEVEL SECURITY;
ALTER TABLE po DISABLE ROW LEVEL SECURITY;
ALTER TABLE last_updated DISABLE ROW LEVEL SECURITY;
```

**For production**, enable RLS and create policies like:

```sql
-- Allow public read access
CREATE POLICY "Allow public read" ON sales FOR SELECT USING (true);

-- Allow authenticated users to update (admin only)
CREATE POLICY "Allow authenticated update" ON sales FOR UPDATE 
USING (auth.role() = 'authenticated');
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
